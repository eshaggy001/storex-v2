import React, { useMemo } from 'react';
import { StoreInfo, Order, Conversation, Product, Customer } from '../types';
import OnboardingRoadmap from './dashboard/OnboardingRoadmap';
import ActiveCommandCenter from './dashboard/ActiveCommandCenter';
import DashboardRecentData from './dashboard/DashboardRecentData';
import { useTaskGenerator } from '../hooks/useTaskGenerator';
import { useTaskCompletionTracker } from '../hooks/useTaskCompletionTracker';

interface DashboardProps {
   store: StoreInfo;
   orders: Order[];
   conversations: Conversation[];
   products: Product[];
   customers: Customer[];
   userLanguage: 'mn' | 'en';
   onNavigate: (view: string) => void;
   onSelectOrder: (order: Order) => void;
   onAddProduct: () => void;
   onConnectPayment: () => void;
   onSetupDelivery: () => void;
   onConnectSocial: () => void;
   actionGuidance: any;
   onGuidanceAction: (task: any) => void;
   onTaskClick: (task: any) => void;
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
      momentum: "Өсөлтийн хурд",
      weekGrowth: "энэ долоо хоногт",
      allGood: "Бүх зүйл хэвийн",
      actionsNeeded: "Шийдвэр хүлээж буй",
      confirmAll: "Бүгдийг батлах",
      shippingReady: "Хүргэхэд бэлэн",
      setup: {
         activation: "Идэвхжүүлэх",
         addProduct: "Бүтээгдэхүүн нэмэх",
         connectSocial: "Суваг холбох",
         configurePayments: "Төлбөр тохируулах",
         completeProfile: "Дэлгүүрийн мэдээлэл",
         launchReady: "Дэлгүүртэй болоход бэлэн үү?",
         launchDesc: "Доорх алхмуудыг хийж борлуулалтаа эхлүүлээрэй.",
         systemLearning: "Систем суралцаж байна",
         awaitingData: "Өгөгдөл хүлээж байна",
         buildCatalogue: "Каталог үүсгэх",
         productDesc: "Бүтээгдэхүүнээ нэмээд борлуулалтаа эхлүүлээрэй."
      },
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
      momentum: "Growth Momentum",
      weekGrowth: "this week",
      allGood: "Everything is on track",
      actionsNeeded: "Actions Required",
      confirmAll: "Confirm All",
      shippingReady: "Ready to Ship",
      setup: {
         activation: "Activation",
         addProduct: "Add Products",
         connectSocial: "Connect Channels",
         configurePayments: "Configure Payments",
         completeProfile: "Store Profile",
         launchReady: "Ready to Launch?",
         launchDesc: "Complete these steps to start selling.",
         systemLearning: "System Learning",
         awaitingData: "Awaiting Data",
         buildCatalogue: "Build Catalogue",
         productDesc: "Add your first product to unlock AI selling."
      },
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
   onSelectOrder,
   onAddProduct,
   onConnectPayment,
   onSetupDelivery,
   onConnectSocial,
   actionGuidance,
   onGuidanceAction,
   onTaskClick
}) => {
   const t = translations[userLanguage];

   // Metrics logic
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

   // Generate dynamic tasks based on current state
   const generatedTasks = useTaskGenerator({
      store,
      orders,
      conversations,
      products,
      customers,
      actionGuidance
   });

   // Track task completion and streaks
   const { guidanceState, completeTask } = useTaskCompletionTracker({
      initialState: generatedTasks,
      onStateChange: (newState) => {
         // Optionally sync with parent component or backend
         console.log('Guidance state updated:', newState);
      }
   });

   // State Logic: Onboarding vs Active
   // We use the readiness flags. If any core flag is missing, we show Onboarding.
   const isFullyReady =
      store.readiness.products_available &&
      store.readiness.payment_enabled &&
      store.readiness.delivery_configured;

   return (
      <div className="space-y-8 pb-12">
         {/* Top Header Section (Always Visible) */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-up">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-dark flex items-center justify-center text-lime shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-lime/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <i className="fa-solid fa-bolt text-2xl relative z-10 transition-transform group-hover:scale-125 group-hover:rotate-12 duration-500"></i>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{store.name}</p>
                     <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${!isFullyReady ? 'bg-white text-dark border-dark/10 shadow-soft' : 'bg-lime/20 text-dark border-lime/30'}`}>
                        {!isFullyReady ? (
                           <>
                              <i className="fa-solid fa-sparkles text-[8px]"></i>
                              <span>Setup Mode</span>
                           </>
                        ) : (
                           <>
                              <i className="fa-solid fa-arrow-up text-[8px]"></i>
                              <span>42% {t.momentum}</span>
                           </>
                        )}
                     </div>
                  </div>
                  <h1 className="text-3xl font-bold text-dark tracking-tighter leading-none">{t.liveSelling}</h1>
               </div>
            </div>

            {/* Action Pulse Feed (Only in Active Mode) */}
            {isFullyReady && (
               <div className="flex items-center gap-4 bg-white border border-dark/10 p-2 pr-6 rounded-full shadow-soft hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="flex -space-x-3 ml-2">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-bg overflow-hidden shadow-sm relative z-10 group-hover:z-30 transition-all">
                           <img src={`https://i.pravatar.cc/150?u=a${i}`} className="w-full h-full object-cover" alt="User" />
                        </div>
                     ))}
                     <div className="w-10 h-10 rounded-full border-4 border-white bg-dark text-lime flex items-center justify-center text-[10px] font-black z-0 shadow-sm">
                        +{metrics.pending}
                     </div>
                  </div>
                  <div className="ml-2">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{metrics.pending > 0 ? t.actionsNeeded : t.allGood}</p>
                     <p className="text-xs font-bold text-dark">{metrics.pending > 0 ? `${metrics.pending} ${t.actions.waiting}` : t.allGood}</p>
                  </div>
                  <button
                     onClick={() => onNavigate('orders')}
                     className="ml-4 w-10 h-10 rounded-xl bg-dark text-white flex items-center justify-center hover:bg-lime hover:text-dark transition-all group-hover:scale-110 active:scale-95 shadow-lg"
                  >
                     <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
               </div>
            )}
         </div>

         {/* MAIN CONTENT SWITCH: Onboarding vs Active */}
         {!isFullyReady ? (
            <OnboardingRoadmap
               store={store}
               onNavigate={onNavigate}
               onAddProduct={onAddProduct}
               onConnectPayment={onConnectPayment}
               onSetupDelivery={onSetupDelivery}
               onConnectSocial={onConnectSocial}
            />
         ) : (
            <>
               <ActiveCommandCenter
                  store={store}
                  metrics={metrics}
                  orders={orders}
                  conversations={conversations}
                  products={products}
                  t={t}
                  onNavigate={onNavigate}
                  actionGuidance={guidanceState}
                  onGuidanceAction={(task) => {
                     completeTask(task.id, task.ctaAction?.split(':')[1]);
                     onGuidanceAction(task);
                  }}
                  onTaskClick={onTaskClick}
               />

               <DashboardRecentData
                  conversations={conversations}
                  products={products}
                  orders={orders}
                  t={t}
                  onNavigate={onNavigate}
               />
            </>
         )}
      </div>
   );
};

export default DashboardOverview;