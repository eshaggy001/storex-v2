import React from 'react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  language: 'mn' | 'en';
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isAssistantOpen, toggleAssistant, language }) => {
  const t = {
    mn: {
      dashboard: 'Хянах самбар',
      products: 'Бүтээгдэхүүн',
      messages: 'Зурвас',
      orders: 'Захиалга',
      customers: 'Хэрэглэгч',
      wallet: 'Хэтэвч',
      settings: 'Тохиргоо',
      profile: 'Профайл',
      assistant: 'AI Туслах'
    },
    en: {
      dashboard: 'Dashboard',
      products: 'Products',
      messages: 'Messages',
      orders: 'Orders',
      customers: 'Customers',
      wallet: 'Wallet',
      settings: 'Store Settings',
      profile: 'Personal Profile',
      assistant: 'AI Assistant'
    }
  };

  const lang = t[language];

  const businessNavItems = [
    { id: 'dashboard', label: lang.dashboard, icon: 'fa-table-columns' },
    { id: 'products', label: lang.products, icon: 'fa-boxes-stacked' },
    { id: 'messages', label: lang.messages, icon: 'fa-comment-dots' },
    { id: 'orders', label: lang.orders, icon: 'fa-receipt' },
    { id: 'customers', label: lang.customers, icon: 'fa-users' },
    { id: 'wallet', label: lang.wallet, icon: 'fa-wallet' },
    { id: 'settings', label: lang.settings, icon: 'fa-sliders' },
  ];

  const personalNavItems = [
    { id: 'profile', label: lang.profile, icon: 'fa-user-circle' },
  ];

  const renderNavItem = (item: { id: string, label: string, icon: string }) => (
    <button
      key={item.id}
      onClick={() => setActiveView(item.id)}
      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${activeView === item.id ||
        (activeView === 'product_detail' && item.id === 'products') ||
        (activeView === 'order_detail' && item.id === 'orders') ||
        (activeView === 'customer_detail' && item.id === 'customers')
        ? 'bg-white text-black shadow-lg shadow-white/10'
        : 'text-slate-500 hover:text-white hover:bg-white/10'
        }`}
      title={item.label}
    >
      <i className={`fa-solid ${item.icon} text-lg`}></i>
      <span className="absolute left-full ml-4 px-3 py-1.5 bg-black text-white text-[12px] font-medium tracking-wide rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {item.label}
      </span>
      {(activeView === item.id ||
        (activeView === 'product_detail' && item.id === 'products') ||
        (activeView === 'order_detail' && item.id === 'orders') ||
        (activeView === 'customer_detail' && item.id === 'customers')) && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#EDFF8C] rounded-l-full"></div>
        )}
    </button>
  );

  return (
    <aside className="w-20 lg:w-24 bg-dark h-[calc(100vh-2rem)] my-4 ml-4 rounded-super flex flex-col items-center py-8 shadow-2xl sticky top-4 z-40">
      <div className="mb-12">
        <div
          className="w-12 h-12 bg-lime rounded-2xl flex items-center justify-center transform rotate-12 cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-lg shadow-lime/20"
          onClick={() => setActiveView('dashboard')}
        >
          <i className="fa-solid fa-bolt text-dark text-xl"></i>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar w-full flex flex-col items-center">
        {businessNavItems.map(renderNavItem)}

        <div className="h-[1px] w-8 bg-white/5 mx-auto my-2 shrink-0"></div>

        {personalNavItems.map(renderNavItem)}

        <div className="h-[1px] w-8 bg-white/5 mx-auto my-2 shrink-0"></div>

        {/* AI Assistant Toggle in Sidebar */}
        <button
          onClick={toggleAssistant}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative group ${isAssistantOpen
            ? 'bg-lime text-dark shadow-[0_0_20px_rgba(237,255,140,0.4)] scale-110'
            : 'text-lime bg-white/5 hover:bg-white/10 hover:scale-105'
            }`}
          title={lang.assistant}
        >
          <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-dark text-white text-[12px] font-bold tracking-widest uppercase rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {lang.assistant}
          </span>
        </button>
      </nav>

      <div className="mt-auto">
        <button className="w-12 h-12 rounded-2xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <i className="fa-solid fa-sign-out-alt"></i>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;