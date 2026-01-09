import React, { useMemo, useState } from 'react';
import KPICard from './KPICard';
import { StoreInfo, Order, Conversation, Product, Customer } from '../types';

interface DashboardProps {
  store: StoreInfo;
  orders: Order[];
  conversations: Conversation[];
  products: Product[];
  customers: Customer[];
  userLanguage: 'mn' | 'en';
  onNavigate: (view: string) => void;
  onSelectOrder: (order: Order) => void;
}

const translations = {
  mn: {
    liveSelling: "Шууд & Борлуулалт",
    nextAction: "Дараагийн алхам",
    nextActionDesc: (n: number) => `${n} захиалга таны баталгаажуулалтыг хүлээж байна.`,
    aiActive: "AI Туслах идэвхтэй",
    energy: "ЭНЕРГИ",
    closedOrders: (orders: number, chats: number) => `Өнөөдөр ${chats} чатаас ${orders} захиалга хаасан байна.`,
    handling: (drafts: number) => `Одоогоор хэмжээ болон хүргэлтийн асуултуудад хариулж байна. ${drafts} ноорог захиалга шалгах шаардлагатай.`,
    activeConvos: "Идэвхтэй чат",
    viewChatLog: "Чатын түүх харах",
    monthlyUsage: "Сарын хэрэглээ",
    balance: "Үлдэгдэл эрх",
    flowToday: "Өнөөдрийн урсгал",
    units: "нэгж",
    coverage: "Хүрэлцээ",
    daysLeft: "хоног",
    manageBilling: "AI Төлбөр тохиргоо",
    retailPerf: "Борлуулалтын үзүүлэлт",
    handledByAi: "AI ХАРИУЛСАН",
    chatOrders: "ЧАТ ЗАХИАЛГА",
    revenue: "ОРЛОГО (MNT)",
    pendingAction: "ХҮЛЭЭГДЭЖ БУЙ",
    needsConfirm: "Баталгаажуулах",
    recentMessages: "Сүүлийн зурвасууд",
    viewInbox: "Чат харах",
    recActions: "Зөвлөмжүүд",
    topPerf: "Шилдэг гүйцэтгэл",
    monthAnalytics: "Сарын анализ",
    selling: "Борлуулалт",
    trending: "Трэнд",
    recentOrders: "Сүүлийн захиалгууд",
    seeAll: "Бүгдийг харах",
    sold: "зарагдсан",
    views: "үзэлт",
    actions: {
      confirmOrders: "Захиалга батлах",
      waiting: "хүлээгдэж байна",
      lowStock: "Үлдэгдэл бага",
      lowStockDesc: "бүтээгдэхүүн дуусах дөхсөн",
      reviewInbox: "Чат шалгах",
      unreadMsg: "Уншаагүй зурвас",
    }
  },
  en: {
    liveSelling: "Live & Selling",
    nextAction: "Next Action",
    nextActionDesc: (n: number) => `${n} orders are waiting for your confirmation.`,
    aiActive: "AI Assistant Active",
    energy: "ENERGY",
    closedOrders: (orders: number, chats: number) => `I’ve closed ${orders} orders from ${chats} chats today.`,
    handling: (drafts: number) => `Currently handling size and delivery inquiries. ${drafts} drafts require your manual check.`,
    activeConvos: "Active Conversations",
    viewChatLog: "View Full Chat Log",
    monthlyUsage: "Monthly Usage",
    balance: "Balance Remaining",
    flowToday: "Flow Today",
    units: "units",
    coverage: "Coverage",
    daysLeft: "Days Left",
    manageBilling: "Manage AI Billing",
    retailPerf: "Retail Performance",
    handledByAi: "HANDLED BY AI",
    chatOrders: "CHAT ORDERS",
    revenue: "REVENUE (MNT)",
    pendingAction: "PENDING ACTION",
    needsConfirm: "Needs Confirmation",
    recentMessages: "Recent Messages",
    viewInbox: "View Inbox",
    recActions: "Recommended Actions",
    topPerf: "Top Performance",
    monthAnalytics: "This month's analytics",
    selling: "Selling",
    trending: "Trending",
    recentOrders: "Recent Orders",
    seeAll: "See All",
    sold: "sold",
    views: "views",
    actions: {
      confirmOrders: "Confirm Orders",
      waiting: "orders waiting",
      lowStock: "Low Stock Alert",
      lowStockDesc: "products running low",
      reviewInbox: "Review Inbox",
      unreadMsg: "Check unread messages",
    }
  }
};

const DashboardOverview: React.FC<DashboardProps> = ({ 
  store, 
  orders, 
  conversations, 
  products, 
  customers,
  userLanguage,
  onNavigate,
  onSelectOrder 
}) => {
  const [topMetric, setTopMetric] = useState<'sales' | 'views'>('sales');
  const t = translations[userLanguage];

  // Existing metrics logic
  const metrics = useMemo(() => {
    const todayRevenue = orders
      .filter(o => o.status === 'paid' || o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const aiOrders = orders.filter(o => o.isAiGenerated).length;
    const totalOrders = orders.length;

    const conversionRate = conversations.length > 0 
      ? ((totalOrders / conversations.length) * 100).toFixed(1) 
      : "0.0";
      
    const closedOrdersCount = orders.filter(o => o.status === 'paid' || o.status === 'completed').length;

    return {
      revenue: todayRevenue,
      pending: pendingOrders,
      aiCount: conversations.length,
      total: totalOrders,
      conversionRate,
      closedOrdersCount
    };
  }, [orders, conversations]);

  // Recommended Actions Logic
  const actions = useMemo(() => {
    const list = [];
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    if (pendingOrders > 0) {
      list.push({ 
        title: t.actions.confirmOrders, 
        desc: `${pendingOrders} ${t.actions.waiting}`, 
        icon: 'fa-check', 
        color: 'text-indigo-600', 
        bg: 'bg-indigo-50', 
        action: () => onNavigate('orders') 
      });
    }
    const lowStock = products.filter(p => typeof p.stock === 'number' && p.stock < 5).length;
    if (lowStock > 0) {
      list.push({ 
        title: t.actions.lowStock, 
        desc: `${lowStock} ${t.actions.lowStockDesc}`, 
        icon: 'fa-box-open', 
        color: 'text-rose-600', 
        bg: 'bg-rose-50', 
        action: () => onNavigate('products') 
      });
    }
    if (list.length < 2) {
      list.push({ 
        title: t.actions.reviewInbox, 
        desc: t.actions.unreadMsg, 
        icon: 'fa-envelope', 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        action: () => onNavigate('messages') 
      });
    }
    return list.slice(0, 2);
  }, [orders, products, t]);

  // Top Products Logic
  const topProducts = useMemo(() => {
    if (topMetric === 'sales') {
      const salesMap: Record<string, number> = {};
      orders.forEach(o => {
        if (o.status !== 'pending') { 
          o.items.forEach(item => {
            salesMap[item.productId] = (salesMap[item.productId] || 0) + item.quantity;
          });
        }
      });
      
      return Object.entries(salesMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id, count]) => {
          const product = products.find(p => p.id === id);
          return { 
            ...product, 
            metricLabel: `${count} ${t.sold}`, 
            metricValue: count 
          };
        })
        .filter(p => p.id); 
    } else {
      return [...products]
        .sort((a, b) => (b.price - a.price))
        .slice(0, 3)
        .map(p => ({
          ...p,
          metricLabel: `${Math.floor(Math.random() * 500) + 100} ${t.views}`,
          metricValue: 0
        }));
    }
  }, [orders, products, topMetric, t]);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'qpay': return 'fa-qrcode';
      case 'afterpay': return 'fa-clock'; 
      case 'online': case 'card': return 'fa-credit-card';
      case 'bank_transfer': return 'fa-building-columns';
      case 'cash_on_delivery': return 'fa-money-bill-wave';
      default: return 'fa-wallet';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-['Manrope'] pb-12">
      
      {/* SECTION: Live & Selling Header & Status Cards */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{store.name} • {store.category}</p>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.liveSelling}</h1>
           </div>
           
           {/* Toast Notification */}
           <div className="hidden md:flex items-center gap-3 bg-[#EDFF8C]/20 border border-[#EDFF8C] px-5 py-3 rounded-2xl shadow-sm cursor-pointer hover:bg-[#EDFF8C]/30 transition-colors" onClick={() => onNavigate('orders')}>
              <div className="w-8 h-8 bg-[#EDFF8C] rounded-full flex items-center justify-center text-black shadow-sm shrink-0">
                <i className="fa-solid fa-lightbulb text-xs"></i>
              </div>
              <div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">{t.nextAction}</p>
                 <p className="text-xs font-bold text-slate-900 mt-0.5">{t.nextActionDesc(metrics.pending)}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dark AI Card */}
          <div className="lg:col-span-2 bg-[#1A1A1A] rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl text-white flex flex-col justify-between min-h-[320px] border border-white/5">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDFF8C] rounded-full opacity-5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full border border-white/5 backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-[#EDFF8C] animate-pulse shadow-[0_0_10px_#EDFF8C]"></span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-200">{t.aiActive}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex gap-3">
                         {store.connectedChannels.facebook && <i className="fa-brands fa-facebook text-slate-400 hover:text-white transition-colors text-lg"></i>}
                         {store.connectedChannels.instagram && <i className="fa-brands fa-instagram text-slate-400 hover:text-white transition-colors text-lg"></i>}
                      </div>
                      <div className="w-[1px] h-4 bg-white/20"></div>
                      <div className="flex items-center gap-2 text-[#EDFF8C] text-xs font-bold bg-[#EDFF8C]/10 px-2 py-1 rounded-lg">
                         <i className="fa-solid fa-bolt text-[10px]"></i>
                         <span>{t.energy}: {store.tokenUsage.balance}</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4 max-w-lg">
                   <h2 className="text-3xl font-medium leading-tight tracking-tight">
                      {userLanguage === 'en' ? (
                        <>I’ve closed <span className="text-[#EDFF8C] font-bold border-b-2 border-[#EDFF8C]">{metrics.closedOrdersCount} orders</span> from <span className="text-white font-bold border-b-2 border-white/20">{metrics.aiCount} chats</span> today.</>
                      ) : (
                        <>Өнөөдөр <span className="text-white font-bold border-b-2 border-white/20">{metrics.aiCount} чатаас</span> <span className="text-[#EDFF8C] font-bold border-b-2 border-[#EDFF8C]">{metrics.closedOrdersCount} захиалга</span> хаасан байна.</>
                      )}
                   </h2>
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      {t.handling(metrics.pending)}
                   </p>
                </div>
             </div>

             <div className="relative z-10 flex items-end justify-between mt-8">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {conversations.slice(0, 3).map((c, i) => (
                         <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] bg-slate-700 overflow-hidden relative shadow-md">
                            <img src={`https://i.pravatar.cc/150?u=${c.id}`} alt="" className="w-full h-full object-cover" />
                         </div>
                      ))}
                      {conversations.length > 3 && (
                         <div className="w-10 h-10 rounded-full border-2 border-[#1A1A1A] bg-white text-black flex items-center justify-center text-xs font-bold z-10 shadow-md">
                            +{conversations.length - 3}
                         </div>
                      )}
                   </div>
                   <span className="text-xs font-bold text-slate-300 ml-2">{conversations.length} {t.activeConvos}</span>
                </div>

                <button onClick={() => onNavigate('messages')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#EDFF8C] hover:text-white transition-colors group">
                   {t.viewChatLog} <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
             </div>
          </div>

          {/* Light Usage Card */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden h-full">
             <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
             
             <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded w-fit">{t.monthlyUsage}</p>
                </div>

                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.balance}</p>
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-slate-900 tracking-tighter">{store.tokenUsage.balance.toLocaleString()}</span>
                      <span className="text-lg font-bold text-slate-300">/{store.tokenUsage.limit.toLocaleString()}</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>{t.flowToday}</span>
                      <span>-{store.tokenUsage.usedToday} {t.units}</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${(store.tokenUsage.usedToday / 500) * 100}%` }}></div>
                   </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.coverage}</span>
                   <span className="text-xs font-bold text-emerald-600">~{store.tokenUsage.estimatedDaysLeft} {t.daysLeft}</span>
                </div>
             </div>

             <button onClick={() => onNavigate('settings')} className="w-full py-4 rounded-xl border border-slate-200 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all mt-6 shadow-sm hover:shadow-lg">
                {t.manageBilling}
             </button>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-4">{t.retailPerf}</h3>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label={t.handledByAi} 
          value={metrics.aiCount} 
          badgeText="+100%" 
          badgeColor="bg-[#EDFF8C] text-black"
          icon="fa-robot" 
          iconBgClass="bg-[#EDFF8C]"
          iconColorClass="text-black"
        />
        <KPICard 
          label={t.chatOrders} 
          value={metrics.total} 
          badgeText={`${metrics.conversionRate}% CR`} 
          badgeColor="bg-[#EDFF8C] text-black"
          icon="fa-cart-shopping"
          iconBgClass="bg-white" 
          iconColorClass="text-slate-900"
        />
        <KPICard 
          label={t.revenue} 
          value={metrics.revenue.toLocaleString()} 
          badgeText={userLanguage === 'en' ? "Today" : "Өнөөдөр"} 
          badgeColor="bg-[#EDFF8C] text-black"
          icon="fa-money-bill-wave" 
          iconBgClass="bg-white"
          iconColorClass="text-slate-900"
        />
        <KPICard 
          label={t.pendingAction} 
          value={metrics.pending} 
          badgeText={t.needsConfirm} 
          badgeColor="bg-rose-100 text-rose-600"
          icon="fa-receipt" 
          iconBgClass="bg-white"
          iconColorClass="text-slate-900"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* Recent Messages */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 h-[380px] flex flex-col">
             <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t.recentMessages}</h3>
                <button onClick={() => onNavigate('messages')} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">{t.viewInbox}</button>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {conversations.slice(0, 4).map(c => (
                   <div key={c.id} onClick={() => onNavigate('messages')} className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative shrink-0">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-lg border border-slate-100 group-hover:bg-[#EDFF8C] group-hover:text-black transition-colors">
                           {c.customerName[0]}
                         </div>
                         <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white ${c.channel === 'instagram' ? 'bg-pink-500' : 'bg-blue-600'}`}>
                           <i className={`fa-brands fa-${c.channel}`}></i>
                         </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                         <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{c.customerName}</h4>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{c.timestamp}</span>
                         </div>
                         <p className="text-[12px] text-slate-500 truncate mt-1 leading-relaxed font-medium">{c.lastMessage}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
             <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">{t.recActions}</h3>
             <div className="space-y-4">
                {actions.map((action, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-3xl border border-slate-50 hover:bg-slate-50 hover:border-slate-100 transition-all cursor-pointer" onClick={action.action}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${action.bg} ${action.color}`}>
                         <i className={`fa-solid ${action.icon} text-lg`}></i>
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-900 text-sm">{action.title}</h4>
                         <p className="text-[11px] font-medium text-slate-400 mt-0.5">{action.desc}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                         <i className="fa-solid fa-arrow-right text-[10px]"></i>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* Top Products */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t.topPerf}</h3>
                   <p className="text-[11px] text-slate-400 font-medium mt-1">{t.monthAnalytics}</p>
                </div>
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                   <button 
                    onClick={() => setTopMetric('sales')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${topMetric === 'sales' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {t.selling}
                   </button>
                   <button 
                    onClick={() => setTopMetric('views')}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${topMetric === 'views' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {t.trending}
                   </button>
                </div>
             </div>
             
             <div className="space-y-5">
                {topProducts.map((product, i) => (
                   <div key={i} className="flex items-center gap-4">
                      <span className={`text-lg font-black w-6 ${i === 0 ? 'text-[#EDFF8C] text-shadow-sm' : 'text-slate-200'}`}>0{i + 1}</span>
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                         <img src={product?.images[0]} className="w-full h-full object-cover" alt={product?.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <h4 className="font-bold text-slate-900 text-sm truncate">{product?.name}</h4>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{product?.category}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-slate-900 text-sm">{product?.price.toLocaleString()}₮</p>
                         <p className={`text-[9px] font-bold uppercase tracking-widest ${topMetric === 'sales' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                           {product?.metricLabel}
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 h-[380px] flex flex-col">
             <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t.recentOrders}</h3>
                <button onClick={() => onNavigate('orders')} className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">{t.seeAll}</button>
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {orders.slice(0, 4).map(order => {
                   const firstItem = order.items[0];
                   const product = products.find(p => p.id === firstItem?.productId);
                   const image = product?.images[0];
                   const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                   return (
                     <div key={order.id} onClick={() => onSelectOrder(order)} className="flex items-center justify-between p-4 rounded-3xl bg-slate-50 border border-slate-50 hover:bg-white hover:shadow-md hover:border-slate-100 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="relative w-12 h-12 shrink-0">
                              {image ? (
                                <img src={image} className="w-full h-full rounded-xl object-cover border border-slate-200 bg-white" alt="Product" />
                              ) : (
                                <div className="w-full h-full rounded-xl bg-slate-200 flex items-center justify-center text-slate-400"><i className="fa-solid fa-box"></i></div>
                              )}
                              {itemCount > 1 && (
                                <span className="absolute -bottom-1.5 -right-1.5 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">+{itemCount - 1}</span>
                              )}
                           </div>

                           <div className="flex flex-col">
                              <div className="flex items-center gap-2 mb-1">
                                 <span className="font-bold text-slate-900 text-sm">{order.id}</span>
                                 <div className="w-5 h-5 rounded-md bg-white border border-slate-100 flex items-center justify-center text-[10px] text-slate-500 shadow-sm" title={order.paymentMethod}>
                                    <i className={`fa-solid ${getPaymentIcon(order.paymentMethod)}`}></i>
                                 </div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">{order.customerName}</span>
                           </div>
                        </div>

                        <div className="text-right">
                           <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1 ${
                              order.status === 'paid' ? 'text-emerald-600' : 
                              order.status === 'pending' ? 'text-amber-600' : 
                              order.status === 'confirmed' ? 'text-slate-900' : 'text-slate-500'
                           }`}>
                              {order.status}
                           </span>
                           <span className="font-black text-slate-900 text-sm">{order.total.toLocaleString()}₮</span>
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;