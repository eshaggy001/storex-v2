import React, { useState, useMemo, useEffect } from 'react';
import { Conversation, Product, Order, StoreInfo } from '../types';

interface MessagesViewProps {
  conversations: Conversation[];
  products: Product[];
  orders: Order[];
  store: StoreInfo;
  onCreateOrder: (order: Partial<Order>) => Order;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  userLanguage?: 'mn' | 'en';
}

type PanelView = 'profile' | 'draft' | 'active_order';

const MessagesView: React.FC<MessagesViewProps> = ({ 
  conversations, 
  products, 
  orders, 
  store,
  onCreateOrder,
  onUpdateOrder,
  userLanguage = 'mn'
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'attention' | 'orders'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [panelView, setPanelView] = useState<PanelView>('profile');
  
  const [draftItems, setDraftItems] = useState<{ productId: string, quantity: number }[]>([]);
  const [draftDelivery, setDraftDelivery] = useState<Order['deliveryMethod']>('pickup');
  const [draftPayment, setDraftPayment] = useState<Order['paymentMethod']>('bank_transfer');
  const [draftAddress, setDraftAddress] = useState('');

  const t = {
    mn: {
      inbox: "Ирсэн зурвас",
      search: "Чат хайх...",
      all: "Бүгд",
      alerts: "Анхаарах",
      aiActive: "AI Идэвхтэй",
      linked: "Захиалгатай",
      channel: "Суваг",
      aiManaged: "AI Хариулж байна",
      manualOrder: "Гараар үүсгэх",
      selectChat: "Чат сонгож AI түүхийг харна уу",
      profile: "Профайл",
      draft: "Ноорог",
      order: "Захиалга",
      newEntry: "Шинэ захиалга бүртгэх",
      clear: "Цэвэрлэх",
      noItems: "Бараа сонгогдоогүй",
      delivery: "Хүргэлтийн төрөл",
      payment: "Төлбөрийн хэлбэр",
      total: "Нийт дүн",
      confirm: "Захиалга үүсгэх",
      addToOrder: "Захиалгад нэмэх",
      actions: "Үйлдэл",
      lifecycle: "Төлөв",
      settlement: "Төлбөр",
      confirmOrder: "Захиалга батлах",
      markPaid: "Төлсөн гэж тэмдэглэх",
      complete: "Дуусгах",
      fullDetails: "Дэлгэрэнгүй",
      aiResponse: "AI Хариулт"
    },
    en: {
      inbox: "Inbox",
      search: "Search chat...",
      all: "All",
      alerts: "Alerts",
      aiActive: "AI Active",
      linked: "Linked Order",
      channel: "Channel",
      aiManaged: "AI Managed",
      manualOrder: "Manual Order",
      selectChat: "Select a chat to view AI history",
      profile: "Profile",
      draft: "Draft",
      order: "Order",
      newEntry: "New Order Entry",
      clear: "Clear",
      noItems: "No items staged",
      delivery: "Delivery Type",
      payment: "Payment Method",
      total: "Total Value",
      confirm: "Confirm and Create",
      addToOrder: "Add to Order",
      actions: "Order Actions",
      lifecycle: "Lifecycle",
      settlement: "Settlement",
      confirmOrder: "Confirm Order",
      markPaid: "Mark as Paid",
      complete: "Complete Sale",
      fullDetails: "Full Details",
      aiResponse: "AI Response"
    }
  };

  const lang = t[userLanguage];

  const selectedConv = conversations.find(c => c.id === selectedId);
  const linkedOrder = orders.find(o => o.customerName === selectedConv?.customerName && o.status !== 'completed');

  useEffect(() => {
    if (linkedOrder) {
      setPanelView('active_order');
    } else {
      setPanelView('profile');
    }
    setDraftItems([]);
  }, [selectedId, linkedOrder]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const matchesSearch = c.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const hasOrder = orders.some(o => o.customerName === c.customerName);
      
      if (filter === 'attention') return matchesSearch && (c.status === 'requires_action' || c.unread);
      if (filter === 'orders') return matchesSearch && hasOrder;
      return matchesSearch;
    });
  }, [conversations, searchQuery, filter, orders]);

  const handleAddToDraft = (productId: string) => {
    setDraftItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId, quantity: 1 }];
    });
    setPanelView('draft');
  };

  const createOrderFromChat = () => {
    if (!selectedConv || draftItems.length === 0) return;
    
    const total = draftItems.reduce((acc, item) => {
      const p = products.find(prod => prod.id === item.productId);
      const price = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price) : 0;
      return acc + (price * item.quantity);
    }, 0);

    onCreateOrder({
      customerName: selectedConv.customerName,
      channel: selectedConv.channel,
      items: draftItems,
      total,
      deliveryMethod: draftDelivery,
      deliveryAddress: draftAddress,
      paymentMethod: draftPayment,
      paymentStatus: 'unpaid',
      status: 'pending',
      isAiGenerated: true,
      aiSummary: `Created during ${selectedConv.channel} conversation by AI recommendation.`
    });

    setDraftItems([]);
    setPanelView('active_order');
  };

  const updateOrderStatus = (status: Order['status']) => {
    if (linkedOrder) {
      onUpdateOrder(linkedOrder.id, { status });
    }
  };

  const getDetectedProducts = (content: string) => {
    const lower = content.toLowerCase();
    const suggestions: Product[] = [];
    if (lower.includes('худи') || lower.includes('hoodie')) {
      const p = products.find(p => p.id === 'P-1001');
      if (p) suggestions.push(p);
    }
    if (lower.includes('подволк') || lower.includes('t-shirt')) {
      const p = products.find(p => p.id === 'P-1002');
      if (p) suggestions.push(p);
    }
    return suggestions;
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-0 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm font-['Manrope'] animate-fade-in">
      
      {/* 1. LEFT COLUMN: Conversation List */}
      <div className="w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">{lang.inbox}</h1>
            <div className="flex gap-1.5">
               <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-black text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{lang.all}</button>
               <button onClick={() => setFilter('attention')} className={`px-3 py-1 rounded-lg text-[11px] font-medium uppercase tracking-wider transition-all ${filter === 'attention' ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{lang.alerts}</button>
            </div>
          </div>
          
          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[14px]"></i>
            <input 
              type="text" 
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[14px] font-normal outline-none focus:border-black transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filteredConversations.map((conv) => {
            const hasOrder = orders.some(o => o.customerName === conv.customerName && o.status !== 'completed');
            return (
              <div 
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-6 cursor-pointer border-b border-slate-50 transition-all relative ${
                  selectedId === conv.id ? 'bg-white shadow-[inset_4px_0_0_#1A1A1A]' : 'hover:bg-white/60'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-semibold text-slate-300">
                        {conv.customerName[0]}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center text-[8px] ${conv.channel === 'instagram' ? 'bg-pink-500 text-white' : 'bg-blue-600 text-white'}`}>
                        <i className={`fa-brands fa-${conv.channel}`}></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-[15px] leading-snug">{conv.customerName}</h4>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 leading-none">{conv.timestamp}</span>
                    </div>
                  </div>
                  {conv.status === 'ai_handling' && (
                    <div className="bg-[#EDFF8C] text-black px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider border border-black/5 animate-pulse leading-none">{lang.aiActive}</div>
                  )}
                </div>
                
                <p className={`text-[14px] font-normal line-clamp-1 mb-2 leading-relaxed ${conv.unread ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
                  {conv.lastMessage}
                </p>

                {hasOrder && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-lg text-[10px] font-medium text-indigo-600 uppercase tracking-wider border border-indigo-100 leading-none">
                    <i className="fa-solid fa-receipt text-[9px]"></i> {lang.linked}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CENTER COLUMN: Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConv ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-slate-900 leading-snug">{selectedConv.customerName}</h3>
                  <div className="flex items-center gap-2 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">{lang.channel}: {selectedConv.channel} • {lang.aiManaged}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPanelView('draft')}
                  className="px-4 py-2 bg-[#EDFF8C] text-black rounded-xl text-[12px] font-medium uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
                >
                  <i className="fa-solid fa-plus mr-1.5 text-[10px]"></i> {lang.manualOrder}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8F9FA]/50 no-scrollbar">
              {selectedConv.messages.map((msg) => {
                const detected = getDetectedProducts(msg.content);
                return (
                  <div key={msg.id} className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] space-y-3 ${msg.sender === 'customer' ? 'items-start' : 'items-end flex flex-col'}`}>
                      
                      {/* Message Bubble */}
                      <div className={`px-5 py-3.5 rounded-[1.5rem] shadow-sm border ${
                        msg.sender === 'assistant' 
                          ? 'bg-[#1A1A1A] text-white border-black/5 rounded-tr-sm' 
                          : msg.sender === 'user' 
                            ? 'bg-[#1A1A1A]/80 text-[#EDFF8C] rounded-tr-sm border-black/10'
                            : 'bg-white border-slate-200 text-slate-800 rounded-tl-sm'
                      }`}>
                        {msg.sender === 'assistant' && (
                          <div className="flex items-center gap-2 mb-1.5 text-[#EDFF8C] text-[10px] font-medium uppercase tracking-[0.15em] leading-none">
                            <i className="fa-solid fa-wand-magic-sparkles text-[9px]"></i> {lang.aiResponse}
                          </div>
                        )}
                        <p className="text-[14px] font-normal leading-relaxed">{msg.content}</p>
                      </div>

                      {/* Product Suggestions Rendering */}
                      {msg.sender === 'assistant' && detected.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 w-72 animate-slide-up">
                          {detected.map(p => {
                            const finalPrice = p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price;
                            return (
                              <div key={p.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-xl group">
                                <div className="h-40 bg-slate-100 relative">
                                  <img src={p.images[0]} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-5 space-y-4">
                                  <div>
                                    <h5 className="text-[15px] font-semibold text-slate-900 truncate tracking-tight leading-snug">{p.name}</h5>
                                    <div className="flex items-center gap-2 mt-1 leading-none">
                                      <p className="text-[14px] font-semibold text-indigo-600 tracking-tight">{finalPrice.toLocaleString()}₮</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => handleAddToDraft(p.id)}
                                      className="flex-1 bg-[#EDFF8C] text-black py-2.5 rounded-xl text-[12px] font-medium uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-sm"
                                    >
                                      {lang.addToOrder}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-4">
             <i className="fa-solid fa-wand-magic-sparkles text-5xl opacity-20"></i>
             <p className="text-[14px] font-normal uppercase tracking-[0.2em] opacity-40">{lang.selectChat}</p>
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: Context Panel */}
      <div className="w-[340px] border-l border-slate-100 bg-white flex flex-col overflow-y-auto no-scrollbar">
        {selectedConv ? (
          <div className="p-8 space-y-10">
            
            {/* View Selector Tabs */}
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
               <button onClick={() => setPanelView('profile')} className={`flex-1 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all ${panelView === 'profile' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>{lang.profile}</button>
               <button onClick={() => setPanelView('draft')} className={`flex-1 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all ${panelView === 'draft' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>{lang.draft}</button>
               {linkedOrder && <button onClick={() => setPanelView('active_order')} className={`flex-1 py-2 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all ${panelView === 'active_order' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>{lang.order}</button>}
            </div>

            {/* PROFILE VIEW */}
            {panelView === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-4">
                   <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl font-semibold text-slate-200 mx-auto leading-none">
                     {selectedConv.customerName[0]}
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">{selectedConv.customerName}</h3>
                     <p className="text-[12px] font-normal text-slate-400 uppercase tracking-widest leading-none mt-1">{selectedConv.channel}</p>
                   </div>
                </div>
              </div>
            )}

            {/* DRAFT ORDER VIEW */}
            {panelView === 'draft' && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between leading-none">
                  <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">{lang.newEntry}</h3>
                  <button onClick={() => setDraftItems([])} className="text-[11px] font-medium text-rose-500 uppercase tracking-wider">{lang.clear}</button>
                </div>

                <div className="space-y-4">
                  {draftItems.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                       <i className="fa-solid fa-cart-plus text-slate-100 text-3xl mb-4 block"></i>
                       <p className="text-[12px] font-medium text-slate-300 uppercase tracking-wider">{lang.noItems}</p>
                    </div>
                  ) : (
                    draftItems.map(item => {
                      const p = products.find(prod => prod.id === item.productId);
                      const finalPrice = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price) : 0;
                      return (
                        <div key={item.productId} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                          <img src={p?.images[0]} className="w-11 h-11 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-slate-900 truncate leading-snug">{p?.name}</p>
                            <p className="text-[12px] font-normal text-slate-400 leading-none mt-1">{finalPrice.toLocaleString()}₮ × {item.quantity}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {draftItems.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-slate-50">
                    <div className="space-y-4">
                       <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest leading-none">{lang.delivery}</label>
                       <div className="flex gap-2">
                          {(['courier', 'pickup'] as const).map(t => (
                            <button key={t} onClick={() => setDraftDelivery(t)} className={`flex-1 py-2.5 rounded-xl text-[11px] font-medium uppercase tracking-wider transition-all ${draftDelivery === t ? 'bg-black text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{t}</button>
                          ))}
                       </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest leading-none ml-1">{lang.payment}</label>
                       <select value={draftPayment} onChange={(e) => setDraftPayment(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-normal outline-none focus:border-black transition-all appearance-none cursor-pointer shadow-sm">
                          {store.fulfillment.paymentMethods.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                       </select>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-between items-end leading-none">
                       <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest">{lang.total}</p>
                       <p className="text-2xl font-semibold text-slate-900 tracking-tight">
                         {draftItems.reduce((acc, item) => {
                           const p = products.find(prod => prod.id === item.productId);
                           const price = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price) : 0;
                           return acc + (price * item.quantity);
                         }, 0).toLocaleString()}₮
                       </p>
                    </div>

                    <button 
                      onClick={createOrderFromChat}
                      className="w-full py-4 bg-black text-white rounded-2xl text-[14px] font-medium uppercase tracking-wider shadow-xl hover:bg-slate-900 transition-all hover:scale-[1.02]"
                    >
                      {lang.confirm}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE ORDER VIEW */}
            {panelView === 'active_order' && linkedOrder && (
              <div className="space-y-8 animate-fade-in">
                 <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2.5rem] space-y-6 relative overflow-hidden shadow-sm">
                    <div className="relative z-10">
                       <p className="text-[11px] font-medium text-indigo-400 uppercase tracking-widest mb-1 leading-none">{lang.order}</p>
                       <h4 className="text-xl font-semibold text-indigo-900 tracking-tight leading-snug">{linkedOrder.id}</h4>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center leading-none">
                          <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-widest">{lang.lifecycle}</span>
                          <span className="text-[11px] font-semibold text-indigo-900 uppercase tracking-widest">{linkedOrder.status}</span>
                       </div>
                       <div className="w-full h-1 bg-white/50 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${( (['pending', 'confirmed', 'paid', 'completed'].indexOf(linkedOrder.status) + 1) / 4) * 100}%` }}></div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6">
                    <h4 className="text-[12px] font-semibold text-slate-400 uppercase tracking-widest ml-1 leading-none">{lang.actions}</h4>
                    <div className="grid grid-cols-1 gap-3">
                       {linkedOrder.status === 'pending' && <button onClick={() => updateOrderStatus('confirmed')} className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl text-[13px] font-medium uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]">{lang.confirmOrder}</button>}
                       {linkedOrder.status === 'confirmed' && <button onClick={() => updateOrderStatus('paid')} className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl text-[13px] font-medium uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]">{lang.markPaid}</button>}
                       {linkedOrder.status === 'paid' && <button onClick={() => updateOrderStatus('completed')} className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[13px] font-medium uppercase tracking-wider shadow-lg transition-all hover:scale-[1.02]">{lang.complete}</button>}
                       <button className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[13px] font-medium uppercase tracking-wider hover:border-black hover:text-black transition-all">{lang.fullDetails}</button>
                    </div>
                 </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 opacity-50 p-12 text-center">
             <i className="fa-solid fa-lock text-4xl mb-4 block"></i>
             <p className="text-[12px] font-semibold uppercase tracking-widest leading-none">{lang.selectChat}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;