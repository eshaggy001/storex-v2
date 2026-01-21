import React, { useState, useMemo } from 'react';
import { StoreInfo, Product } from '../types';

interface StorefrontViewProps {
  store: StoreInfo;
  products: Product[];
  onExit: () => void;
}

const StorefrontView: React.FC<StorefrontViewProps> = ({ store, products, onExit }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Reset variants
    const initialVariants: Record<string, string> = {};
    if (product.options) {
      product.options.forEach(opt => {
        initialVariants[opt.name] = opt.values[0];
      });
    }
    setSelectedVariant(initialVariants);
  };

  const handleVariantChange = (optionName: string, value: string) => {
    setSelectedVariant(prev => ({ ...prev, [optionName]: value }));
  };

  const simulateAIResponse = (userMsg: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "";
      if (userMsg.toLowerCase().includes('buy')) {
        aiResponse = "Excellent choice! I've added this to your bag. Would you like to proceed with payment via QPay or Bank Transfer?";
      } else {
        aiResponse = "I can definitely help with that! What would you like to know about this product?";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1500);
  };

  const handleChatAction = (action: 'buy' | 'ask') => {
    if (!selectedProduct) return;

    let message = action === 'buy'
      ? `Hi! I want to buy ${selectedProduct.name}`
      : `Hi! I have a question about ${selectedProduct.name}`;

    const variants = Object.entries(selectedVariant)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');

    if (variants) message += ` (${variants})`;

    setChatMessages([{ sender: 'user', text: message }]);
    setIsChatOpen(true);
    simulateAIResponse(message);
  };

  const finalPrice = (product: Product) => {
    if (!product.discount) return product.price;
    if (product.discount.type === 'percentage') {
      return product.price * (1 - product.discount.value / 100);
    }
    return product.discount.value;
  };


  return (
    <div className="fixed inset-0 z-[200] bg-slate-100 flex justify-center items-center overflow-hidden font-sans">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Exit Button - Desktop Only */}
      <button
        onClick={onExit}
        className="absolute top-10 left-10 hidden lg:flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-xl hover:scale-105 transition-all text-dark font-black uppercase tracking-widest border border-dark/5"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Exit Preview
      </button>

      {/* Mobile Device Simulator Container */}
      <div className="w-full h-full max-w-[420px] bg-white sm:h-[840px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col sm:rounded-[4rem] sm:border-[12px] sm:border-[#1A1A1A] transform scale-90 sm:scale-100 animate-fade-in transition-all">

        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-40 bg-[#1A1A1A] rounded-b-3xl z-[60] flex items-center justify-center gap-1.5 px-4 hidden sm:flex">
          <div className="w-10 h-1 bg-white/10 rounded-full"></div>
          <div className="w-2 h-2 bg-white/10 rounded-full ml-auto"></div>
        </div>

        {/* AI ACTIVE BANNER - Sticky below notch */}
        <div className="bg-[#1A1A1A] py-1.5 px-6 flex items-center justify-center gap-3 z-50">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-lime rounded-full animate-pulse-slow shadow-[0_0_8px_#EDFF8C]"></span>
            <span className="text-[9px] font-black text-lime uppercase tracking-[0.2em]">Shop Handled by Storex AI</span>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 pt-10 pb-6 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 p-0.5 overflow-hidden shadow-sm">
              <img src={store.logo_url || `https://ui-avatars.com/api/?name=${store.name}&background=EDFF8C&color=1A1A1A`} alt={store.name} className="w-full h-full rounded-[0.8rem] object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-black text-[#1A1A1A] leading-none tracking-tight">{store.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Merchant</span>
              </div>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-bg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-dark transition-all">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-white">

          {/* Featured Banner (Optional) */}
          <div className="px-6 mt-6">
            <div className="h-48 rounded-[2rem] bg-dark relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
              <img
                src={products[0]?.images[0] || "https://picsum.photos/800/600"}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                alt="Banner"
              />
              <div className="absolute inset-x-6 bottom-6 z-20">
                <span className="px-2 py-1 bg-lime text-dark text-[8px] font-black uppercase tracking-widest rounded mb-2 inline-block">New Arrival</span>
                <h2 className="text-xl font-black text-white leading-tight">Spring Collection <br /> Available Now</h2>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 py-8 overflow-x-auto no-scrollbar flex gap-3 sticky top-[88px] z-30 bg-white/90 backdrop-blur-md">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat
                  ? 'bg-dark text-white shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] scale-105'
                  : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="px-6 grid grid-cols-2 gap-x-4 gap-y-8">
            {filteredProducts.map(product => {
              const price = finalPrice(product);
              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group flex flex-col animate-fade-up"
                >
                  <div className="aspect-[4/5] bg-slate-50 relative rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <button className="w-full bg-white/90 backdrop-blur-md text-dark py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Quick View
                      </button>
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-dark/40 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <span className="bg-white text-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Sold Out</span>
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                        -{product.discount.type === 'percentage' ? `${product.discount.value}%` : 'Sale'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 px-2 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-sm font-bold text-[#1A1A1A] line-clamp-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-[#1A1A1A]">{price.toLocaleString()}₮</span>
                        {product.discount && (
                          <span className="text-[11px] text-slate-300 line-through font-bold">{product.price.toLocaleString()}₮</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Footer */}
          <div className="px-10 py-16 text-center border-t border-slate-50 mt-12 bg-slate-50/50">
            <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
              <div className="w-8 h-8 rounded-full bg-dark text-white flex items-center justify-center text-[10px]">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <span className="text-[11px] font-black text-dark uppercase tracking-[0.3em]">STOREX AI</span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-6 px-4 leading-relaxed">Secure Shopping Experience handled by our Global AI Agent.</p>
            <div className="flex justify-center gap-6 opacity-20 transform scale-90">
              <i className="fa-brands fa-cc-visa text-3xl"></i>
              <i className="fa-brands fa-cc-mastercard text-3xl"></i>
              <i className="fa-solid fa-building-columns text-3xl"></i>
              <i className="fa-solid fa-truck-fast text-3xl"></i>
            </div>
          </div>
        </div>

        {/* Product Detail Overlay */}
        {selectedProduct && (
          <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-slide-up origin-bottom">
            <div className="relative flex-1 overflow-y-auto no-scrollbar">

              {/* Image Header */}
              <div className="relative aspect-[4/5] bg-slate-50">
                <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-[1.25rem] bg-white/40 backdrop-blur-xl text-dark flex items-center justify-center shadow-xl hover:bg-white/60 transition-all border border-white/40 group active:scale-90"
                >
                  <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform"></i>
                </button>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="flex flex-col gap-2">
                    {selectedProduct.availabilityType === 'ready' ? (
                      <span className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                        <i className="fa-solid fa-box mr-2"></i> Ready to Ship
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                        <i className="fa-solid fa-clock mr-2"></i> Pre-order ({selectedProduct.deliveryDays} days)
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedProduct.images.length > 1 && (
                      <div className="bg-[#1A1A1A]/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-black text-white uppercase tracking-widest">
                        1 / {selectedProduct.images.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10 pb-32">

                {/* Title & Price */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-lime"></span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedProduct.category}</p>
                  </div>
                  <h2 className="text-3xl font-black text-[#1A1A1A] leading-[1.1] tracking-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="text-3xl font-black text-[#1A1A1A] tracking-tighter">{finalPrice(selectedProduct).toLocaleString()}₮</span>
                    {selectedProduct.discount && (
                      <span className="text-lg text-slate-300 line-through font-bold decoration-slate-400 decoration-2">{selectedProduct.price.toLocaleString()}₮</span>
                    )}
                  </div>
                </div>

                {/* Variants */}
                {selectedProduct.options && selectedProduct.options.length > 0 && (
                  <div className="space-y-8 p-6 bg-bg rounded-[2.5rem] border border-dark/5 shadow-inner">
                    {selectedProduct.options.map(opt => (
                      <div key={opt.name} className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{opt.name}</p>
                        <div className="flex flex-wrap gap-2.5">
                          {opt.values.map(val => (
                            <button
                              key={val}
                              onClick={() => handleVariantChange(opt.name, val)}
                              className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${selectedVariant[opt.name] === val
                                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xl scale-105'
                                : 'border-white bg-white text-slate-400 hover:border-slate-100'
                                }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-4 px-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Story</p>
                  <p className="text-base font-medium text-slate-600 leading-relaxed italic">
                    {selectedProduct.description || "No description available for this premium piece."}
                  </p>
                </div>

                {/* Shipping info */}
                <div className="flex items-center gap-6 py-6 border-y border-slate-50 px-2 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-dark">
                      <i className="fa-solid fa-parachute-box"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global <br /> Shipping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-dark">
                      <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Refund <br /> Policy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-dark">
                      <i className="fa-solid fa-leaf"></i>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ethical <br /> Sourcing</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="p-8 bg-white/80 backdrop-blur-2xl border-t border-slate-50 flex gap-4 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => handleChatAction('ask')}
                className="w-16 h-16 bg-bg flex items-center justify-center rounded-2xl text-dark text-xl hover:bg-slate-100 transition-all border border-slate-100"
              >
                <i className="fa-regular fa-comment-dots"></i>
              </button>
              <button
                onClick={() => handleChatAction('buy')}
                className="flex-1 h-16 bg-dark text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Chat with AI to Order
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* Simulated AI Chat Overlay */}
        {isChatOpen && (
          <div className="absolute inset-0 z-[150] bg-white flex flex-col animate-fade-in">
            <div className="px-6 pt-12 pb-6 flex items-center justify-between border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-lime flex items-center justify-center text-dark shadow-lg shadow-lime/20">
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Storex Assistant</p>
                  <p className="text-sm font-black text-dark leading-none">{store.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-dark transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm font-medium leading-relaxed ${msg.sender === 'user'
                    ? 'bg-dark text-white rounded-tr-none'
                    : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-slate-50 px-5 py-3.5 rounded-3xl rounded-tl-none border border-slate-100 flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a follow up..."
                  disabled
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none opacity-50 cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Preview Mode
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StorefrontView;