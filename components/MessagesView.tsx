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
      const price = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value / 100) : p.discount.value) : p.price) : 0;
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
    <div className="flex h-[calc(100vh-10rem)] gap-0 bg-white rounded-super border border-dark/5 overflow-hidden shadow-soft font-sans animate-fade-in relative z-10">

      {/* 1. LEFT COLUMN: Conversation List */}
      <div className="w-[400px] border-r border-dark/5 flex flex-col bg-bg/30">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-dark tracking-tighter">{lang.inbox}</h1>
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filter === 'all' ? 'bg-dark text-white border-dark shadow-lg scale-105' : 'bg-white text-slate-400 border-dark/5 shadow-sm'}`}>{lang.all}</button>
              <button onClick={() => setFilter('attention')} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${filter === 'attention' ? 'bg-rose-500 text-white border-rose-500 shadow-lg scale-105' : 'bg-white text-slate-400 border-dark/5 shadow-sm'}`}>{lang.alerts}</button>
            </div>
          </div>

          <div className="relative group">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-lime transition-colors"></i>
            <input
              type="text"
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-dark/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold shadow-soft focus:ring-4 focus:ring-lime/10 focus:border-lime transition-all outline-none placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
          {filteredConversations.map((conv, i) => {
            const hasOrder = orders.some(o => o.customerName === conv.customerName && o.status !== 'completed');
            const isActive = selectedId === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-8 cursor-pointer transition-all relative animate-fade-up ${isActive ? 'bg-white shadow-xl scale-[0.98] rounded-2xl mx-4 my-2 border border-dark/5' : 'hover:bg-white/40 border-b border-dark/5'
                  }`}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-lime rounded-full -ml-1"></div>}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl bg-bg border border-dark/5 flex items-center justify-center text-xl font-bold text-dark tracking-tighter ${isActive ? 'shadow-inner' : 'shadow-sm'}`}>
                        {conv.customerName[0]}
                      </div>
                      <div className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-xl border-2 border-white flex items-center justify-center text-[10px] shadow-sm ${conv.channel === 'instagram' ? 'bg-pink-500 text-white' : 'bg-blue-600 text-white'}`}>
                        <i className={`fa-brands fa-${conv.channel}`}></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-base tracking-tight">{conv.customerName}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1 block">{conv.timestamp}</span>
                    </div>
                  </div>
                  {conv.status === 'ai_handling' && (
                    <div className="bg-lime text-dark px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-black/5 animate-pulse-slow shadow-sm">{lang.aiActive}</div>
                  )}
                </div>

                <p className={`text-[13px] font-medium line-clamp-1 mb-3 leading-relaxed transition-colors ${conv.unread ? 'text-dark font-bold' : 'text-slate-500'}`}>
                  {conv.lastMessage}
                </p>

                {hasOrder && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-xl text-[9px] font-bold text-indigo-500 uppercase tracking-widest border border-indigo-100/50 shadow-sm">
                    <i className="fa-solid fa-receipt text-[10px]"></i> {lang.linked}
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
            <div className="p-8 border-b border-dark/5 flex justify-between items-center bg-white shrink-0 shadow-sm z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center text-lg font-bold text-dark shadow-inner">
                  {selectedConv.customerName[0]}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-xl text-dark tracking-tight">{selectedConv.customerName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{lang.channel}: {selectedConv.channel} • {lang.aiManaged}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPanelView('draft')}
                  className="btn-primary !px-6 !py-3 shadow-xl"
                >
                  <i className="fa-solid fa-plus mr-2 text-dark/70"></i> {lang.manualOrder}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-bg/40 no-scrollbar">
              {selectedConv.messages.map((msg, i) => {
                const detected = getDetectedProducts(msg.content);
                const isAssistant = msg.sender === 'assistant';
                const isUser = msg.sender === 'user';
                const isCustomer = msg.sender === 'customer';

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} animate-fade-up`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`max-w-[80%] space-y-4 ${isCustomer ? 'items-start' : 'items-end flex flex-col'}`}>

                      {/* Message Bubble */}
                      <div className={`px-6 py-4 rounded-[2rem] shadow-premium border transition-all hover:scale-[1.01] ${isAssistant
                        ? 'bg-dark text-white border-white/5 rounded-tr-sm'
                        : isUser
                          ? 'bg-dark/80 text-lime rounded-tr-sm border-white/5 backdrop-blur-md'
                          : 'bg-white border-dark/5 text-slate-800 rounded-tl-sm'
                        }`}>
                        {isAssistant && (
                          <div className="flex items-center gap-2 mb-2 text-lime text-[9px] font-bold uppercase tracking-[0.2em]">
                            <i className="fa-solid fa-wand-magic-sparkles text-[10px] animate-pulse-slow"></i> {lang.aiResponse}
                          </div>
                        )}
                        <p className="text-base font-medium leading-relaxed">{msg.content}</p>
                      </div>

                      {/* Product Suggestions Rendering */}
                      {isAssistant && detected.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 w-80 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                          {detected.map(p => {
                            const finalPrice = p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value / 100) : p.discount.value) : p.price;
                            return (
                              <div key={p.id} className="bg-white rounded-card border border-dark/5 overflow-hidden shadow-2xl group hover:border-lime/30 transition-all">
                                <div className="h-44 bg-bg relative overflow-hidden">
                                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                  <div className="absolute top-4 right-4 bg-lime text-dark px-3 py-1 rounded-lg text-[10px] font-bold shadow-soft">
                                    {p.category}
                                  </div>
                                </div>
                                <div className="p-6 space-y-5">
                                  <div>
                                    <h5 className="text-lg font-bold text-dark truncate tracking-tight">{p.name}</h5>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <p className="text-base font-bold text-indigo-500 tracking-tight">{finalPrice.toLocaleString()}₮</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleAddToDraft(p.id)}
                                    className="w-full btn-primary !py-3 !text-[11px] shadow-lg"
                                  >
                                    <i className="fa-solid fa-cart-plus mr-2 opacity-50"></i>
                                    {lang.addToOrder}
                                  </button>
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
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 gap-6">
            <div className="w-32 h-32 bg-bg rounded-super flex items-center justify-center text-5xl shadow-inner animate-pulse-slow">
              <i className="fa-solid fa-wand-magic-sparkles opacity-20"></i>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">{lang.selectChat}</p>
          </div>
        )}
      </div>

      {/* 3. RIGHT COLUMN: Context Panel */}
      <div className="w-[380px] border-l border-dark/5 bg-white flex flex-col overflow-y-auto no-scrollbar shadow-2xl z-20">
        {selectedConv ? (
          <div className="p-10 space-y-12">

            {/* View Selector Tabs */}
            <div className="flex bg-bg p-1.5 rounded-2xl border border-dark/5 shadow-inner">
              <button onClick={() => setPanelView('profile')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${panelView === 'profile' ? 'bg-white text-dark shadow-sm border border-dark/5' : 'text-slate-400 hover:text-dark'}`}>{lang.profile}</button>
              <button onClick={() => setPanelView('draft')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${panelView === 'draft' ? 'bg-white text-dark shadow-sm border border-dark/5' : 'text-slate-400 hover:text-dark'}`}>{lang.draft}</button>
              {linkedOrder && <button onClick={() => setPanelView('active_order')} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${panelView === 'active_order' ? 'bg-white text-dark shadow-sm border border-dark/5' : 'text-slate-400 hover:text-dark'}`}>{lang.order}</button>}
            </div>

            {/* PROFILE VIEW */}
            {panelView === 'profile' && (
              <div className="space-y-10 animate-fade-up">
                <div className="text-center space-y-6">
                  <div className="w-28 h-28 rounded-super bg-bg border border-dark/5 flex items-center justify-center text-5xl font-bold text-dark tracking-tighter mx-auto shadow-premium">
                    {selectedConv.customerName[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-dark tracking-tight">{selectedConv.customerName}</h3>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm ${selectedConv.channel === 'instagram' ? 'bg-pink-50 text-pink-600 border-pink-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        <i className={`fa-brands fa-${selectedConv.channel} mr-1.5`}></i>
                        {selectedConv.channel}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active now</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Customer Insights</h4>
                  <div className="bg-bg/50 rounded-card p-6 border border-dark/5 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-dark/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders</span>
                      <span className="text-sm font-bold text-dark">12 total</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-dark/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Spend</span>
                      <span className="text-sm font-bold text-indigo-500">240,000₮</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DRAFT ORDER VIEW */}
            {panelView === 'draft' && (
              <div className="space-y-10 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang.newEntry}</h3>
                  <button onClick={() => setDraftItems([])} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                    <i className="fa-solid fa-trash-can mr-1.5 opacity-50"></i> {lang.clear}
                  </button>
                </div>

                <div className="space-y-5">
                  {draftItems.length === 0 ? (
                    <div className="p-16 text-center border-2 border-dashed border-dark/5 rounded-card bg-bg/20">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 text-2xl mx-auto mb-4 shadow-sm">
                        <i className="fa-solid fa-cart-plus"></i>
                      </div>
                      <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{lang.noItems}</p>
                    </div>
                  ) : (
                    draftItems.map(item => {
                      const p = products.find(prod => prod.id === item.productId);
                      const finalPrice = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value / 100) : p.discount.value) : p.price) : 0;
                      return (
                        <div key={item.productId} className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-dark/5 shadow-premium group">
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-soft">
                            <img src={p?.images[0]} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-dark truncate tracking-tight">{p?.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 mt-1">{finalPrice.toLocaleString()}₮ × {item.quantity}</p>
                          </div>
                          <button className="text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                            <i className="fa-solid fa-circle-xmark"></i>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {draftItems.length > 0 && (
                  <div className="space-y-8 pt-8 border-t border-dark/5">
                    <div className="space-y-5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.delivery}</label>
                      <div className="flex gap-3">
                        {(['courier', 'pickup'] as const).map(t => (
                          <button key={t} onClick={() => setDraftDelivery(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${draftDelivery === t ? 'bg-dark text-white border-dark shadow-xl scale-102' : 'bg-white text-slate-400 border-dark/5 shadow-sm hover:border-dark/20'}`}>{t}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.payment}</label>
                      <div className="relative">
                        <select value={draftPayment} onChange={(e) => setDraftPayment(e.target.value as any)} className="w-full bg-white border border-dark/5 rounded-xl px-5 py-4 text-sm font-bold text-dark outline-none focus:border-lime transition-all appearance-none cursor-pointer shadow-soft">
                          {store.fulfillment.paymentMethods.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ').toUpperCase()}</option>)}
                        </select>
                        <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-dark/5 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{lang.total}</p>
                        <p className="text-3xl font-bold text-dark tracking-tighter">
                          {draftItems.reduce((acc, item) => {
                            const p = products.find(prod => prod.id === item.productId);
                            const price = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value / 100) : p.discount.value) : p.price) : 0;
                            return acc + (price * item.quantity);
                          }, 0).toLocaleString()}₮
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-lime/10 text-lime text-[8px] font-bold uppercase tracking-widest">Auto Tax-Inc</span>
                      </div>
                    </div>

                    <button
                      onClick={createOrderFromChat}
                      className="w-full btn-primary !py-5 !text-sm !tracking-widest shadow-2xl pulse-subtle"
                    >
                      <i className="fa-solid fa-check-circle mr-2 opacity-50"></i>
                      {lang.confirm}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE ORDER VIEW */}
            {panelView === 'active_order' && linkedOrder && (
              <div className="space-y-10 animate-fade-up">
                <div className="p-10 bg-dark text-white rounded-super space-y-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                    <i className="fa-solid fa-receipt text-9xl"></i>
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold text-lime uppercase tracking-[0.3em] mb-2">{lang.order}</p>
                    <h4 className="text-3xl font-bold tracking-tighter">{linkedOrder.id}</h4>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{lang.lifecycle}</span>
                      <span className="text-[10px] font-bold text-lime uppercase tracking-widest">{linkedOrder.status}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-lime rounded-full shadow-[0_0_10px_#EDFF8C] transition-all duration-1000" style={{ width: `${((['pending', 'confirmed', 'paid', 'completed'].indexOf(linkedOrder.status) + 1) / 4) * 100}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.actions}</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {linkedOrder.status === 'pending' && <button onClick={() => updateOrderStatus('confirmed')} className="w-full btn-primary !py-4 shadow-xl">{lang.confirmOrder}</button>}
                    {linkedOrder.status === 'confirmed' && <button onClick={() => updateOrderStatus('paid')} className="w-full btn-primary !py-4 shadow-xl">{lang.markPaid}</button>}
                    {linkedOrder.status === 'paid' && <button onClick={() => updateOrderStatus('completed')} className="w-full bg-emerald-600 text-white rounded-2xl py-4 text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all hover:scale-[1.02]">{lang.complete}</button>}
                    <button className="w-full btn-secondary !py-4 shadow-sm">{lang.fullDetails}</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-200 p-12 text-center gap-6">
            <div className="w-20 h-20 bg-bg rounded-card flex items-center justify-center text-3xl shadow-inner">
              <i className="fa-solid fa-lock opacity-20"></i>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 leading-relaxed">{lang.selectChat}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;