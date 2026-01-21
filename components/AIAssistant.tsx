import React, { useState, useRef, useEffect } from 'react';
import { processAssistantCommand, analyzeProductImage } from '../services/geminiService';
import { AppState, Product, Order, Customer } from '../types';

interface AIAssistantProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  onClose?: () => void;
  initialContext?: { image: string, suggestions: { name: string, category: string, options?: any[] } } | null;
  clearContext?: () => void;
  currentView: string;
  contextData?: Product | Order | Customer | null;
}

interface Message {
  role: 'user' | 'assistant';
  type: 'text' | 'image' | 'product_suggestion' | 'product_summary';
  content?: string;
  image?: string;
  productDraft?: Partial<Product>;
  timestamp: Date;
  isActionable?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  state,
  updateState,
  onClose,
  initialContext,
  clearContext,
  currentView,
  contextData
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      type: 'text',
      content: "Hello! I'm your Storex AI. Upload product photos or tell me what you're selling, and I'll handle the rest.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { tokenUsage } = state.store;
  const isEnergyLow = tokenUsage.balance < (tokenUsage.limit * 0.15);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Context Awareness Handlers
  useEffect(() => {
    const getContextGreeting = () => {
      switch (currentView) {
        case 'products':
          return "I can help you analyze inventory or add new products given an image.";
        case 'product_detail':
          return contextData ? `I see you're looking at ${(contextData as Product).name}. Want me to suggest an SEO description or marketing post?` : "Viewing product details.";
        case 'orders':
          return "Need help analyzing sales performance or finding a specific order?";
        case 'order_detail':
          return contextData ? `Order ${(contextData as Order).id} for ${(contextData as Order).customerName}. I can verify the payment or draft a confirmation message.` : "Viewing order details.";
        case 'customers':
          return "I can help you segment your customers or draft broadcast messages.";
        case 'customer_detail':
          return contextData ? `Customer ${(contextData as Customer).name}. I can summarize their history or suggest products they might like.` : "Viewing customer profile.";
        case 'wallet':
          return "I can help you track your payouts and verify BNPL transactions.";
        case 'profile':
          return "I'm here to help with your security and profile settings. I can explain why identity verification is important for secure payouts.";
        default:
          return null;
      }
    };

    const greeting = getContextGreeting();
    if (greeting) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        type: 'text',
        content: greeting,
        timestamp: new Date()
      }]);
    }
  }, [currentView, contextData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const fullBase64 = reader.result as string;

      setMessages(prev => [...prev, {
        role: 'user',
        type: 'image',
        image: fullBase64,
        timestamp: new Date()
      }]);

      setIsTyping(true);

      try {
        const suggestions = await analyzeProductImage(base64);
        setIsTyping(false);

        const lastDraft = [...messages].reverse().find(m => m.productDraft)?.productDraft;

        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'product_suggestion',
          content: lastDraft ? "I've refined your product draft with this photo." : "I've analyzed your image! Does this look correct?",
          image: fullBase64,
          productDraft: {
            ...lastDraft,
            name: lastDraft?.name || suggestions.name,
            category: lastDraft?.category || (suggestions.category as any) || 'Other',
            images: [...(lastDraft?.images || []), fullBase64],
            options: suggestions.options || [],
            availabilityType: lastDraft?.availabilityType || 'ready',
            status: 'ACTIVE'
          },
          timestamp: new Date()
        }]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'text',
          content: "I couldn't analyze that image. Could you try another or tell me the product name?",
          timestamp: new Date()
        }]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmProduct = (draft: Partial<Product>) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      type: 'text',
      content: draft.availabilityType === 'ready'
        ? "Excellent. What is the price and how many do you have in stock?"
        : "Excellent. What is the price and how many days for delivery?",
      productDraft: draft,
      timestamp: new Date()
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', type: 'text', content: userMsg, timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const lastDraft = [...messages].reverse().find(m => m.productDraft)?.productDraft;
      const response = await processAssistantCommand(userMsg, state.products, state.store, undefined, currentView);
      setIsTyping(false);

      if (response.action === 'ADD_PRODUCT' && response.productData) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'product_summary',
          productDraft: {
            ...lastDraft,
            ...response.productData,
            images: lastDraft?.images || [`https://picsum.photos/seed/${response.productData.name}/400/400`]
          },
          content: "Ready to list this product with detected attributes?",
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          type: 'text',
          content: response.textResponse,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setIsTyping(error ? true : false); // Avoid TS issues
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', type: 'text', content: "Something went wrong. Let's try again.", timestamp: new Date() }]);
    }
  };

  const finalizeProduct = (draft: Partial<Product>) => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      business_id: state.store.id,
      created_by: 'AI',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      name: draft.name || 'Untitled',
      price: draft.price || 0,
      description: draft.description || '',
      stock: draft.availabilityType === 'ready' ? (draft.stock || 0) : 0,
      images: draft.images || [`https://picsum.photos/seed/${draft.name}/400/400`],
      category: (draft.category as any) || 'Other',
      status: 'ACTIVE',
      availabilityType: (draft.availabilityType as 'ready' | 'made_to_order') || 'ready',
      deliveryDays: draft.deliveryDays,
      deliveryOptions: draft.deliveryOptions || ['courier'],
      options: draft.options,
      discount: draft.discount
    };

    updateState({
      products: [newProduct, ...state.products]
    });

    setMessages(prev => [...prev, {
      role: 'assistant',
      type: 'text',
      content: "Product is now live in your catalog with all detected attributes!",
      timestamp: new Date()
    }]);
  };

  const calculateFinalPrice = (draft: Partial<Product>) => {
    if (!draft.price) return 0;
    if (!draft.discount) return draft.price;
    if (draft.discount.type === 'percentage') {
      return draft.price * (1 - draft.discount.value / 100);
    }
    return draft.discount.value;
  };

  return (
    <div className="flex flex-col h-full bg-dark overflow-hidden relative border-l border-white/5 font-sans">
      <div className={`absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-[120px] -translate-y-1/2 translate-x-1/2 transition-colors duration-1000 ${isEnergyLow ? 'bg-rose-500' : 'bg-lime'}`}></div>
      <div className={`absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full opacity-10 blur-[100px] translate-y-1/2 -translate-x-1/2`}></div>

      <div className="p-6 border-b border-white/5 relative z-10 flex items-center justify-between bg-dark/40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl transition-all ${isEnergyLow ? 'bg-rose-500 text-white' : 'bg-lime text-dark'}`}>
            <i className={`fa-solid ${isEnergyLow ? 'fa-battery-quarter' : 'fa-wand-magic-sparkles'} text-lg ${!isEnergyLow && 'animate-pulse-slow'}`}></i>
          </div>
          <div>
            <h3 className="text-white font-bold text-base tracking-tight mb-0.5">Storex Assistant</h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse-slow ${isEnergyLow ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-lime shadow-[0_0_8px_#EDFF8C]'}`}></span>
              <p className={`text-[10px] uppercase tracking-[0.2em] font-bold ${isEnergyLow ? 'text-rose-400' : 'text-lime'}`}>
                {isEnergyLow ? 'Energy Critical' : 'Neural Link Active'}
              </p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all border border-white/5">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar relative z-10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-up`} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={`max-w-[85%] rounded-[2rem] ${msg.role === 'user'
              ? (msg.type === 'image' ? 'bg-transparent' : 'bg-lime text-dark font-bold px-6 py-4 shadow-xl')
              : 'bg-white/5 text-slate-200 border border-white/10 backdrop-blur-2xl p-1 shadow-soft'
              }`}>

              {msg.type === 'text' && <div className="px-5 py-3.5"><p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p></div>}
              {msg.type === 'image' && (
                <div className="rounded-card overflow-hidden border-2 border-lime shadow-2xl w-56 transform hover:scale-105 transition-transform duration-500">
                  <img src={msg.image} className="w-full aspect-square object-cover" alt="User upload" />
                </div>
              )}

              {msg.type === 'product_suggestion' && msg.productDraft && (
                <div className="w-72 bg-dark rounded-card overflow-hidden border border-white/10 shadow-2xl">
                  <div className="h-40 relative group">
                    <img src={msg.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Product suggestion" />
                    <div className="absolute top-3 left-3 bg-lime text-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Vision Detect</div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Detected Name</label>
                      <p className="text-base font-bold text-white tracking-tight">{msg.productDraft.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Category</label>
                        <p className="text-[13px] font-bold text-lime">{msg.productDraft.category}</p>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Variants</label>
                        <p className="text-[13px] font-bold text-white truncate">{msg.productDraft.options?.map(o => o.name).join(', ') || 'Standard'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmProduct(msg.productDraft!)}
                      className="w-full btn-primary !rounded-xl !py-3 text-[13px] tracking-widest uppercase font-bold"
                    >
                      Confirm Details
                    </button>
                  </div>
                </div>
              )}

              {msg.type === 'product_summary' && msg.productDraft && (
                <div className="w-72 bg-dark rounded-card overflow-hidden border border-white/10 shadow-2xl">
                  <div className="p-5 border-b border-white/5 flex gap-4 items-center bg-white/5">
                    <img src={msg.productDraft.images?.[0]} className="w-14 h-14 rounded-xl object-cover shadow-lg" alt="Draft" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[14px] font-bold text-white truncate leading-tight">{msg.productDraft.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{msg.productDraft.category}</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pricing</span>
                      <div className="text-right">
                        {msg.productDraft.discount ? (
                          <>
                            <span className="text-[10px] font-medium text-slate-500 line-through mr-2">{msg.productDraft.price?.toLocaleString()}₮</span>
                            <span className="text-base font-bold text-white">{calculateFinalPrice(msg.productDraft).toLocaleString()}₮</span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-white">{msg.productDraft.price?.toLocaleString()}₮</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Inventory</span>
                      <span className="text-sm font-bold text-lime">{msg.productDraft.stock || 0} units available</span>
                    </div>
                    <button
                      onClick={() => finalizeProduct(msg.productDraft!)}
                      className="w-full btn-primary !rounded-xl !py-4 text-[13px] tracking-widest uppercase font-bold shadow-lg"
                    >
                      Publish Catalog
                    </button>
                  </div>
                </div>
              )}

              <div className="px-4 py-2 border-t border-white/5 mt-1">
                <p className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${msg.role === 'user' && msg.type !== 'image' ? 'text-dark' : 'text-slate-500'}`}>
                  Sent • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start gap-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 shadow-md backdrop-blur-md">
              <div className="flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-lime rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-dark border-t border-white/5 relative z-10">
        <div className="absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-dark to-transparent pointer-events-none"></div>
        <form onSubmit={handleSubmit} className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-white/10 transition-all shadow-xl group border border-white/5"
          >
            <i className="fa-solid fa-plus text-lg group-hover:rotate-90 transition-transform"></i>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:ring-2 focus:ring-lime transition-all outline-none pr-14 placeholder:text-slate-600 font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-2 top-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-2xl disabled:opacity-20 ${isEnergyLow ? 'bg-rose-500 text-white' : 'bg-lime text-dark shadow-lime/20'}`}
            >
              <i className="fa-solid fa-arrow-up text-sm"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;