import React, { useState, useRef } from 'react';
import { StoreInfo } from '../types';

interface SettingsViewProps {
  store: StoreInfo;
  onViewStore: () => void;
  userLanguage?: 'mn' | 'en';
}

const SettingsView: React.FC<SettingsViewProps> = ({ store, onViewStore, userLanguage = 'mn' }) => {
  const { tokenUsage } = store;
  const usagePercent = (tokenUsage.balance / tokenUsage.limit) * 100;
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [storeData, setStoreData] = useState({
    name: store.name,
    category: store.category,
    city: store.city || "Ulaanbaatar",
    phone: store.phone || "99110000",
    logo: store.logo,
    hasPhysicalStore: false,
    physicalAddress: 'Sukhbaatar District, 1st Khoroo, Peace Avenue 12',
    workingHours: {
      weekdays: { open: '10:00', close: '20:00' },
      weekend: { open: '11:00', close: '19:00' }
    },
    connectedChannels: { ...store.connectedChannels },
    responseDetail: store.aiConfig.responseDetail,
    tone: store.aiConfig.tone,
    deliveryTypes: store.fulfillment.deliveryTypes,
    paymentMethods: store.fulfillment.paymentMethods,
    afterpayProviders: store.fulfillment.afterpayProviders || ['storepay'],
    notifications: { ...store.notifications }
  });

  const [saveStatus, setSaveStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});
  const [pending, setPending] = useState<{ field: string | null; value: any; }>({ field: null, value: null });
  const [showLogoOptions, setShowLogoOptions] = useState(false);

  const t = {
    mn: {
      title: "Тохиргоо",
      subtitle: "Дэлгүүрийн болон AI тохиргоо.",
      billing: "AI Төлбөр & Эрх",
      credits: "Үлдэгдэл эрх",
      usage: "Сарын хэрэглээ",
      packages: "Багцууд",
      business: "Бизнесийн мэдээлэл",
      channels: "Холбогдсон сувгууд",
      connected: "Холбогдсон",
      connect: "Холбох",
      disconnect: "Салгах",
      fulfillment: "Хүргэлт & Төлбөр",
      delivery: "Хүргэлтийн нөхцөл",
      payment: "Төлбөрийн нөхцөл",
      paymentDesc: "Хэрэглэгчээс хүлээн авах төлбөрийн хэлбэрүүдийг сонгоно уу.",
      notifications: "Мэдэгдэл",
      ai: "AI Тохиргоо",
      aiDesc: "AI туслахын харилцааны хэв маягийг тохируулах.",
      tone: "Харилцааны өнгө",
      detail: "Хариултын урт",
      tones: { friendly: "Нөхөрсөг", professional: "Албан ёсны" },
      details: { short: "Товч", balanced: "Тэнцвэртэй", detailed: "Дэлгэрэнгүй" },
      notif: { newOrders: "Шинэ захиалга", lowStock: "Үлдэгдэл багасах", paymentPending: "Төлбөр хүлээгдэж буй" },
      city: "Хот / Бүс",
      category: "Үйл ажиллагааны чиглэл",
      save: "Хадгалах",
      physStore: "Биет дэлгүүр",
      physStoreDesc: "Танд үйлчлүүлэгч ирэх боломжтой оффис эсвэл дэлгүүр байгаа юу?",
      address: "Хаяг",
      team: "Баг & Эрх",
      teamComingSoon: "БАГИЙН ХАНДАЛТ ТУН УДАХГҮЙ",
      helpSection: {
        faq: "Тусламж / FAQ",
        faqDesc: "Заавар болон гарын авлага.",
        support: "Холбоо барих",
        supportDesc: "Манай багтай шууд холбогдох.",
        feedback: "Санал хүсэлт",
        feedbackDesc: "Storex-ийг сайжруулахад туслаарай."
      }
    },
    en: {
      title: "Settings",
      subtitle: "Configure your retail store and AI power preferences.",
      billing: "Billing & AI Energy",
      credits: "Available Credits",
      usage: "Monthly Usage",
      packages: "Credit Packages",
      business: "Business Information",
      channels: "Connected Channels",
      connected: "Connected",
      connect: "Connect",
      disconnect: "Disconnect",
      fulfillment: "Orders & Delivery Defaults",
      delivery: "Delivery Options",
      payment: "Accepted Payment Methods",
      paymentDesc: "Select the payment methods you accept from customers.",
      notifications: "Store Notifications",
      ai: "AI Behavior",
      aiDesc: "Customize how the AI assistant interacts with your customers.",
      tone: "Communication Tone",
      detail: "Response Detail",
      tones: { friendly: "Friendly", professional: "Professional" },
      details: { short: "Short", balanced: "Balanced", detailed: "Detailed" },
      notif: { newOrders: "New Orders", lowStock: "Low Stock Alerts", paymentPending: "Payment Pending" },
      city: "City / Region",
      category: "Business Category",
      save: "Save",
      physStore: "Physical Store",
      physStoreDesc: "Do you have a physical location for customers to visit?",
      address: "Address",
      team: "Team & Access",
      teamComingSoon: "TEAM ACCESS COMING SOON",
      helpSection: {
        faq: "Help / FAQ",
        faqDesc: "Guides and documentation.",
        support: "Contact Support",
        supportDesc: "Direct help from our team.",
        feedback: "Feedback",
        feedbackDesc: "Help us improve Storex."
      }
    }
  };

  const lang = t[userLanguage];

  const triggerAutoSave = (field: string, newValue: any) => {
    setSaveStatus(prev => ({ ...prev, [field]: 'saving' }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [field]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [field]: 'idle' })), 2000);
    }, 600);
  };

  const handleLowImpactChange = (field: string, value: any) => {
    // @ts-ignore
    setStoreData(prev => ({ ...prev, [field]: value }));
    triggerAutoSave(field, value);
  };

  const handleChannelToggle = (channel: 'facebook' | 'instagram') => {
    const nextVal = !storeData.connectedChannels[channel];
    setStoreData(prev => ({
      ...prev,
      connectedChannels: { ...prev.connectedChannels, [channel]: nextVal }
    }));
    triggerAutoSave(`channel_${channel}`, nextVal);
  };

  const stageHighImpactChange = (field: string, value: any) => {
    // @ts-ignore
    const currentVal = storeData[field];
    if (JSON.stringify(currentVal) === JSON.stringify(value)) {
      setPending({ field: null, value: null });
      return;
    }
    setPending({ field, value });
    setShowLogoOptions(false); 
  };

  const applyPending = () => {
    if (!pending.field) return;
    const field = pending.field;
    const value = pending.value;
    // @ts-ignore
    setStoreData(prev => ({ ...prev, [field]: value }));
    setPending({ field: null, value: null });
    triggerAutoSave(field, value);
  };

  const cancelPending = () => setPending({ field: null, value: null });

  const handleToggleDelivery = (type: 'courier' | 'pickup') => {
    let next = [...storeData.deliveryTypes];
    if (next.includes(type)) {
      if (next.length > 1) next = next.filter(t => t !== type);
      else return; 
    } else {
      next.push(type);
    }
    stageHighImpactChange('deliveryTypes', next);
  };

  const handleTogglePayment = (method: string) => {
    let next = [...storeData.paymentMethods];
    // @ts-ignore
    if (next.includes(method)) {
      if (next.length > 1) next = next.filter(m => m !== method);
      else return;
    } else {
      // @ts-ignore
      next.push(method);
    }
    // @ts-ignore
    setStoreData(prev => ({ ...prev, paymentMethods: next }));
    triggerAutoSave('paymentMethods', next);
  };

  const handleToggleNotification = (key: keyof typeof storeData.notifications) => {
    const next = { ...storeData.notifications, [key]: !storeData.notifications[key] };
    setStoreData(prev => ({ ...prev, notifications: next }));
    triggerAutoSave('notifications', next);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      stageHighImpactChange('logo', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const paymentMethodList = [
    { id: 'qpay', label: 'QPAY', icon: 'fa-qrcode' },
    { id: 'online', label: 'SocialPay / Card', icon: 'fa-credit-card' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: 'fa-building-columns' },
    { id: 'afterpay', label: 'Afterpay (BNPL)', icon: 'fa-clock' },
    { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
  ];

  const displayLogo = pending.field === 'logo' ? pending.value : storeData.logo;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 font-['Manrope'] animate-fade-in relative">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">{lang.title}</h1>
          <p className="text-slate-500 font-normal mt-1 text-[14px]">{lang.subtitle}</p>
        </div>
        <div className="bg-[#EDFF8C] text-black px-4 py-2 rounded-2xl text-[10px] font-semibold uppercase tracking-widest shadow-sm border border-black/5">
          PLAN: RETAIL PRO
        </div>
      </div>

      <div className="space-y-10">
        
        {/* BILLING */}
        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">{lang.billing}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">{lang.credits}</p>
                  <p className="text-5xl md:text-6xl font-black text-[#1A1A1A] tracking-tighter">{tokenUsage.balance.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-end leading-none">
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{lang.usage}</p>
                     <span className="text-sm font-bold text-[#1A1A1A]">{usagePercent.toFixed(0)}%</span>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${usagePercent}%` }}
                     ></div>
                   </div>
                </div>
             </div>
             <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">{lang.packages}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 p-6 rounded-[2rem] bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all text-left group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-plus"></i>
                      </div>
                      <span className="text-sm font-bold text-[#1A1A1A]">$19.00</span>
                    </div>
                    <h3 className="font-black text-[#1A1A1A] text-sm uppercase tracking-wider">1,000 Credits</h3>
                  </button>
                  <button className="flex-1 p-6 rounded-[2rem] bg-[#1A1A1A] text-white hover:scale-[1.02] transition-all text-left shadow-xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-[#EDFF8C] rounded-full opacity-10 blur-[30px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#EDFF8C] backdrop-blur-md">
                          <i className="fa-solid fa-fire"></i>
                        </div>
                        <span className="text-sm font-bold text-[#EDFF8C]">$49.00</span>
                      </div>
                      <h3 className="font-black text-white text-sm uppercase tracking-wider">5,000 Credits</h3>
                    </div>
                  </button>
                </div>
             </div>
          </div>
        </section>

        {/* BUSINESS INFO */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm relative">
          <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-[2.5rem]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <i className="fa-solid fa-store"></i>
              </div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">{lang.business}</h2>
            </div>
            {pending.field && (
              <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200 animate-fade-in shadow-sm">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-700">Confirm?</span>
                <button onClick={applyPending} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-widest hover:bg-black transition-all">Apply</button>
                <button onClick={cancelPending} className="text-slate-400 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest hover:text-black">Cancel</button>
              </div>
            )}
          </div>

          <div className="p-10 space-y-12">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Logo Section */}
              <div className="shrink-0 flex flex-col gap-4">
                <div className="relative group w-40">
                  <div className="w-40 h-40 rounded-[2rem] border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-50 relative flex items-center justify-center">
                    {displayLogo ? (
                      <img src={displayLogo} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                      <i className="fa-solid fa-image text-3xl text-slate-300"></i>
                    )}
                  </div>
                  <div className="mt-3 relative">
                    <button onClick={() => setShowLogoOptions(!showLogoOptions)} className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:text-black transition-all shadow-sm">Change Logo</button>
                    {showLogoOptions && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-slide-up">
                        <button onClick={() => logoInputRef.current?.click()} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-[11px] font-medium text-slate-700 flex items-center gap-2"><i className="fa-solid fa-upload text-slate-400"></i> Upload New</button>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>

              {/* Basic Info Form */}
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input type="text" value={storeData.name} onChange={(e) => handleLowImpactChange('name', e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <div className="relative">
                      <input type="tel" value={pending.field === 'phone' ? pending.value : storeData.phone} onChange={(e) => stageHighImpactChange('phone', e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 font-semibold text-slate-900 outline-none focus:border-black transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">{lang.category}</label>
                    <select 
                      value={storeData.category} 
                      onChange={(e) => handleLowImpactChange('category', e.target.value)} 
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white cursor-pointer"
                    >
                      <option>Apparel</option>
                      <option>Food & Beverage</option>
                      <option>Beauty</option>
                      <option>Electronics</option>
                      <option>Services</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">{lang.city}</label>
                    <select 
                      value={storeData.city} 
                      onChange={(e) => handleLowImpactChange('city', e.target.value)} 
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white cursor-pointer"
                    >
                      <option>Ulaanbaatar</option>
                      <option>Erdenet</option>
                      <option>Darkhan</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Physical Store Section */}
                <div className="pt-6 border-t border-slate-50 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                         <span className="text-sm font-bold text-slate-900 block">{lang.physStore}</span>
                         <span className="text-[10px] font-medium text-slate-400">{lang.physStoreDesc}</span>
                      </div>
                      <button 
                         onClick={() => handleLowImpactChange('hasPhysicalStore', !storeData.hasPhysicalStore)}
                         className={`w-12 h-7 rounded-full transition-all relative ${storeData.hasPhysicalStore ? 'bg-black' : 'bg-slate-200'}`}
                      >
                         <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${storeData.hasPhysicalStore ? 'right-1' : 'left-1'}`}></div>
                      </button>
                   </div>

                   {storeData.hasPhysicalStore && (
                      <div className="animate-slide-up">
                         <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">{lang.address}</label>
                         <textarea 
                            value={storeData.physicalAddress}
                            onChange={(e) => handleLowImpactChange('physicalAddress', e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white resize-none h-24"
                            placeholder="e.g. Sukhbaatar District, 1st Khoroo..."
                         />
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONNECTED CHANNELS */}
        <section className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-link"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">{lang.channels}</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-100 transition-all gap-4">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1877F2] text-2xl group-hover:scale-110 transition-transform">
                    <i className="fa-brands fa-facebook"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-base">Facebook Page</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {storeData.connectedChannels.facebook ? 'Active' : 'Not connected'}
                    </p>
                  </div>
               </div>
               <div className="flex items-center justify-end gap-6 w-full sm:w-auto">
                 {storeData.connectedChannels.facebook ? (
                   <>
                     <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">{lang.connected}</span>
                     <button onClick={() => handleChannelToggle('facebook')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">{lang.disconnect}</button>
                   </>
                 ) : (
                   <button onClick={() => handleChannelToggle('facebook')} className="px-6 py-3 bg-[#1877F2] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">{lang.connect}</button>
                 )}
               </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-pink-100 transition-all gap-4">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-[#E1306C] text-2xl group-hover:scale-110 transition-transform">
                    <i className="fa-brands fa-instagram"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] text-base">Instagram Business</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {storeData.connectedChannels.instagram ? 'Active' : 'Not connected'}
                    </p>
                  </div>
               </div>
               <div className="flex items-center justify-end gap-6 w-full sm:w-auto">
                 {storeData.connectedChannels.instagram ? (
                   <>
                     <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">{lang.connected}</span>
                     <button onClick={() => handleChannelToggle('instagram')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">{lang.disconnect}</button>
                   </>
                 ) : (
                   <button onClick={() => handleChannelToggle('instagram')} className="px-6 py-3 bg-[#E1306C] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">{lang.connect}</button>
                 )}
               </div>
            </div>
          </div>
        </section>

        {/* FULFILLMENT */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-truck"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">{lang.fulfillment}</h2>
          </div>
          
          <div className="p-10 space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{lang.delivery}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['courier', 'pickup'] as const).map(dt => (
                  <button 
                    key={dt}
                    onClick={() => handleToggleDelivery(dt)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-bold text-sm uppercase tracking-wider ${
                      storeData.deliveryTypes.includes(dt) 
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' 
                        : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-3"><i className={`fa-solid ${dt === 'courier' ? 'fa-truck-fast' : 'fa-store'} text-lg`}></i> {dt}</span>
                    {storeData.deliveryTypes.includes(dt) && <i className="fa-solid fa-check text-[#EDFF8C]"></i>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-50">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{lang.payment}</h3>
                <p className="text-slate-500 text-xs font-medium mt-1">{lang.paymentDesc}</p>
              </div>
              <div className="space-y-3">
                {paymentMethodList.map((method) => (
                  <div key={method.id} onClick={() => handleTogglePayment(method.id)} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${storeData.paymentMethods.includes(method.id as any) ? 'bg-[#1A1A1A] text-white' : 'bg-white text-slate-400'}`}>
                        <i className={`fa-solid ${method.icon}`}></i>
                      </div>
                      <span className={`text-sm font-bold ${storeData.paymentMethods.includes(method.id as any) ? 'text-slate-900' : 'text-slate-500'}`}>
                        {method.label}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      storeData.paymentMethods.includes(method.id as any) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                    }`}>
                      {storeData.paymentMethods.includes(method.id as any) && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AI CONFIG */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">{lang.ai}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{lang.aiDesc}</p>
            </div>
          </div>
          
          <div className="p-10 space-y-10">
             <div className="space-y-4">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.tone}</label>
               <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                 {(['friendly', 'professional'] as const).map(tone => (
                   <button
                    key={tone}
                    onClick={() => handleLowImpactChange('tone', tone)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      storeData.tone === tone ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'
                    }`}
                   >
                     {lang.tones[tone]}
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-4">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.detail}</label>
               <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                 {(['short', 'balanced', 'detailed'] as const).map(detail => (
                   <button
                    key={detail}
                    onClick={() => handleLowImpactChange('responseDetail', detail)}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      storeData.responseDetail === detail ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'
                    }`}
                   >
                     {lang.details[detail]}
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-bell"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">{lang.notifications}</h2>
          </div>
          
          <div className="p-10 space-y-4">
            {Object.entries(storeData.notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-sm font-bold text-slate-900">{lang.notif[key as keyof typeof lang.notif]}</span>
                <button 
                  onClick={() => handleToggleNotification(key as any)}
                  className={`w-12 h-7 rounded-full transition-all relative ${enabled ? 'bg-black' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${enabled ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM & ACCESS */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <i className="fa-solid fa-users"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">{lang.team}</h2>
          </div>
          
          <div className="p-10">
             <div className="w-full py-16 bg-slate-50 border border-slate-100 border-dashed rounded-[2rem] flex items-center justify-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{lang.teamComingSoon}</p>
             </div>
          </div>
        </section>

        {/* HELP & SUPPORT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* FAQ */}
           <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <i className="fa-solid fa-circle-question text-lg"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.faq}</h3>
              <p className="text-xs font-medium text-slate-500">{lang.helpSection.faqDesc}</p>
           </button>

           {/* Support */}
           <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <i className="fa-solid fa-headset text-lg"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.support}</h3>
              <p className="text-xs font-medium text-slate-500">{lang.helpSection.supportDesc}</p>
           </button>

           {/* Feedback */}
           <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all text-left group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <i className="fa-solid fa-comment-dots text-lg"></i>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.feedback}</h3>
              <p className="text-xs font-medium text-slate-500">{lang.helpSection.feedbackDesc}</p>
           </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;