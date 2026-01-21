import React, { useState, useRef } from 'react';
import { StoreInfo } from '../types';

interface SettingsViewProps {
  store: StoreInfo;
  onUpdate: (updates: Partial<StoreInfo>) => void;
  onViewStore: () => void;
  userLanguage?: 'mn' | 'en';
}

const SettingsView: React.FC<SettingsViewProps> = ({ store, onUpdate, onViewStore, userLanguage = 'mn' }) => {
  const { tokenUsage } = store;
  const usagePercent = (tokenUsage.balance / tokenUsage.limit) * 100;
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: store.name,
    category: store.category,
    city: store.city || "Ulaanbaatar",
    phone: store.phone || "99110000",
    has_physical_store: store.has_physical_store,
    physical_address: store.physical_address || 'Sukhbaatar District, 1st Khoroo, Peace Avenue 12',
    connectedChannels: { ...store.connectedChannels },
    responseDetail: store.aiConfig.responseDetail,
    tone: store.aiConfig.tone,
    deliveryTypes: store.fulfillment.deliveryTypes,
    deliveryFee: store.fulfillment.deliveryFee || 0,
    paymentMethods: store.fulfillment.paymentMethods,
    afterpayProviders: store.fulfillment.afterpayProviders || ['storepay'],
    bankDetails: store.fulfillment.bankDetails || {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      paymentNote: ''
    },
    notifications: { ...store.notifications }
  });

  const [saveStatus, setSaveStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});
  const [pendingLogo, setPendingLogo] = useState<string | null>(null);
  const [showLogoOptions, setShowLogoOptions] = useState(false);
  const [termsModal, setTermsModal] = useState<{ show: boolean; method: string | null }>({ show: false, method: null });
  const [acceptedTerms, setAcceptedTerms] = useState<Set<string>>(new Set());
  const [bnplApplicationModal, setBnplApplicationModal] = useState<{
    show: boolean;
    step: 'terms' | 'application' | 'submitted';
  }>({ show: false, step: 'terms' });
  const [bnplFormData, setBnplFormData] = useState({
    businessName: store.name,
    businessCategory: store.category,
    monthlyRevenue: '',
    averageOrderValue: '',
    provider: 'storepay' as 'storepay' | 'lendpay' | 'simplepay'
  });
  const [bankSettingsModal, setBankSettingsModal] = useState(false);

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
      deliveryFee: "Хүргэлтийн үнэ",
      addressRequired: "Хаяг (Заавал)",
      category: "Үйл ажиллагааны чиглэл",
      save: "Хадгалах",
      physStore: "Биет дэлгүүр",
      physStoreDesc: "Танд үйлчлүүлэгч ирэх боломжтой оффис эсвэл дэлгүүр байгаа юу?",
      address: "Хаяг",
      bankDetails: "Дансны тохиргоо",
      bankDesc: "Орлого хүлээн авах дансны мэдээлэл.",
      bankName: "Банкны нэр",
      accountNumber: "Дансны дугаар",
      accountHolder: "Данс эзэмшигч",
      paymentNote: "Гүйлгээний утга (Заавал биш)",
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
      deliveryFee: "Delivery Fee",
      addressRequired: "Address (Required)",
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

  const triggerAutoSave = (field: string) => {
    setSaveStatus(prev => ({ ...prev, [field]: 'saving' }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [field]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [field]: 'idle' })), 2000);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveField = (field: string, value?: any) => {
    let finalValue = value !== undefined ? value : (formData as any)[field];

    // Convert numbers if needed
    if (field === 'deliveryFee') {
      finalValue = typeof finalValue === 'string' ? parseInt(finalValue) || 0 : finalValue;
    }

    let updatedFields: Partial<StoreInfo> = {};

    switch (field) {
      case 'name': updatedFields = { name: finalValue }; break;
      case 'phone': updatedFields = { phone: finalValue }; break;
      case 'category': updatedFields = { category: finalValue }; break;
      case 'city': updatedFields = { city: finalValue }; break;
      case 'has_physical_store': updatedFields = { has_physical_store: finalValue }; break;
      case 'physical_address': updatedFields = { physical_address: finalValue }; break;
      case 'deliveryFee':
      case 'deliveryTypes':
      case 'paymentMethods':
        updatedFields = { fulfillment: { ...store.fulfillment, [field]: finalValue } }; break;
      case 'tone':
      case 'responseDetail':
        updatedFields = { aiConfig: { ...store.aiConfig, [field]: finalValue } }; break;
      case 'notifications': updatedFields = { notifications: finalValue }; break;
      case 'connectedChannels': updatedFields = { connectedChannels: finalValue }; break;
      case 'bankDetails':
        updatedFields = { fulfillment: { ...store.fulfillment, bankDetails: finalValue } }; break;
      default:
        // @ts-ignore
        updatedFields = { [field]: finalValue };
    }

    onUpdate(updatedFields);
    triggerAutoSave(field);
  };

  const handleChannelToggle = (channel: 'facebook' | 'instagram') => {
    const nextVal = !formData.connectedChannels[channel];
    const updated = { ...formData.connectedChannels, [channel]: nextVal };
    setFormData(prev => ({ ...prev, connectedChannels: updated }));
    saveField('connectedChannels', updated);
  };

  const handleToggleDelivery = (type: 'courier' | 'pickup') => {
    let next = [...formData.deliveryTypes];
    let updates: Partial<StoreInfo> = {};

    if (next.includes(type)) {
      if (next.length > 1) next = next.filter(t => t !== type);
      else return;
    } else {
      next.push(type);
      if (type === 'pickup' && !formData.has_physical_store) {
        setFormData(prev => ({ ...prev, has_physical_store: true }));
        updates.has_physical_store = true;
      }
    }

    setFormData(prev => ({ ...prev, deliveryTypes: next }));
    updates.fulfillment = { ...store.fulfillment, deliveryTypes: next };

    onUpdate(updates);
    triggerAutoSave('deliveryTypes');
    if (updates.has_physical_store) triggerAutoSave('has_physical_store');
  };

  const handleTogglePayment = (method: StoreInfo['fulfillment']['paymentMethods'][number]) => {
    const isCurrentlyEnabled = (formData.paymentMethods as string[]).includes(method);

    // Special handling for BNPL/Afterpay
    if (method === 'afterpay' && !isCurrentlyEnabled) {
      const bnplStatus = store.fulfillment.bnplApplicationStatus;

      if (!bnplStatus || bnplStatus.status === 'not_applied') {
        setBnplApplicationModal({ show: true, step: 'terms' });
        return;
      } else if (bnplStatus.status === 'pending') {
        alert(userLanguage === 'mn'
          ? 'Таны хүсэлт хүлээгдэж байна. Батлагдсаны дараа идэвхжүүлэх боломжтой.'
          : 'Your application is pending. You can enable this after approval.');
        return;
      } else if (bnplStatus.status === 'rejected') {
        setBnplApplicationModal({ show: true, step: 'terms' });
        return;
      }
    }

    // If trying to enable and terms haven't been accepted, show modal
    if (!isCurrentlyEnabled && !acceptedTerms.has(method)) {
      setTermsModal({ show: true, method });
      return;
    }

    // Otherwise proceed with toggle
    let next = [...formData.paymentMethods];
    if ((next as string[]).includes(method)) {
      if (next.length > 1) next = next.filter(m => m !== method);
      else return;
    } else {
      next.push(method);
    }
    setFormData(prev => ({ ...prev, paymentMethods: next }));
    saveField('paymentMethods', next);
  };

  const handleAcceptTerms = () => {
    if (!termsModal.method) return;

    // Mark terms as accepted for this payment method
    setAcceptedTerms(prev => new Set(prev).add(termsModal.method!));

    // Enable the payment method
    const next = [...formData.paymentMethods, termsModal.method];
    setFormData(prev => ({ ...prev, paymentMethods: next }));
    saveField('paymentMethods', next);

    // Close modal
    setTermsModal({ show: false, method: null });
  };

  const handleDeclineTerms = () => {
    setTermsModal({ show: false, method: null });
  };

  const handleBnplTermsAccept = () => {
    setBnplApplicationModal({ show: true, step: 'application' });
  };

  const handleBnplFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBnplFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBnplSubmit = () => {
    if (!bnplFormData.monthlyRevenue || !bnplFormData.averageOrderValue) {
      alert(userLanguage === 'mn' ? 'Бүх талбарыг бөглөнө үү' : 'Please fill all fields');
      return;
    }

    const currentApps = store.fulfillment.bnplApplicationStatus?.applications || [];

    // Check if duplicate active application exists
    if (currentApps.some(app => app.provider === bnplFormData.provider && app.status !== 'rejected')) {
      alert(userLanguage === 'mn' ? 'Энэ үйлчилгээнд аль хэдийн хүсэлт илгээсэн байна.' : 'Application already exists for this provider.');
      return;
    }

    const newApp = {
      provider: bnplFormData.provider,
      status: 'pending' as const,
      appliedAt: new Date().toISOString()
    };

    onUpdate({
      fulfillment: {
        ...store.fulfillment,
        bnplApplicationStatus: {
          status: 'pending', // Update overall status
          applications: [...currentApps, newApp]
        }
      }
    });

    setBnplApplicationModal({ show: true, step: 'submitted' });
    setTimeout(() => {
      setBnplApplicationModal({ show: false, step: 'terms' });
    }, 3000);
  };

  const handleBnplModalClose = () => {
    setBnplApplicationModal({ show: false, step: 'terms' });
  };

  const handleToggleNotification = (key: keyof typeof formData.notifications) => {
    const next = { ...formData.notifications, [key]: !formData.notifications[key] };
    setFormData(prev => ({ ...prev, notifications: next }));
    saveField('notifications', next);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingLogo(reader.result as string);
      setShowLogoOptions(false);
    };
    reader.readAsDataURL(file);
  };

  const confirmLogo = () => {
    if (!pendingLogo) return;
    onUpdate({ logo_url: pendingLogo });
    setPendingLogo(null);
    triggerAutoSave('logo_url');
  };

  const cancelLogo = () => setPendingLogo(null);

  const paymentMethodList = [
    { id: 'qpay', label: 'QPAY', icon: 'fa-qrcode' },
    { id: 'online', label: 'SocialPay / Card', icon: 'fa-credit-card' },
    { id: 'afterpay', label: 'Afterpay (BNPL)', icon: 'fa-clock' },
    // Removed legacy methods as per request
    // { id: 'bank_transfer', label: 'Bank Transfer', icon: 'fa-building-columns' },
    // { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: 'fa-money-bill-wave' },
  ] as const;

  const displayLogo = pendingLogo || store.logo_url;

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
          </div>

          <div className="p-10 space-y-12">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Logo Section */}
              <div className="shrink-0 flex flex-col gap-4">
                <div className="relative group w-40">
                  <div className={`w-40 h-40 rounded-[2rem] border-4 border-slate-50 shadow-sm overflow-hidden bg-slate-50 relative flex items-center justify-center transition-all ${pendingLogo ? 'opacity-50 blur-[2px] scale-95' : ''}`}>
                    {displayLogo ? (
                      <img src={displayLogo} className="w-full h-full object-cover" alt="Logo" />
                    ) : (
                      <i className="fa-solid fa-image text-3xl text-slate-300"></i>
                    )}
                    {saveStatus.logo_url === 'saving' && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <i className="fa-solid fa-spinner fa-spin text-indigo-600 text-2xl"></i>
                      </div>
                    )}
                    {saveStatus.logo_url === 'saved' && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center z-10">
                        <i className="fa-solid fa-check text-emerald-600 text-3xl animate-bounce"></i>
                      </div>
                    )}
                  </div>
                  {pendingLogo ? (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 animate-slide-up z-20">
                      <button onClick={confirmLogo} className="bg-black text-[#EDFF8C] p-3 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all"><i className="fa-solid fa-check text-lg"></i></button>
                      <button onClick={cancelLogo} className="bg-white text-rose-500 p-3 rounded-2xl shadow-2xl border border-slate-100 hover:scale-110 active:scale-95 transition-all"><i className="fa-solid fa-xmark text-lg"></i></button>
                    </div>
                  ) : (
                    <div className="mt-3 relative">
                      <button onClick={() => setShowLogoOptions(!showLogoOptions)} className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:text-black hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2">
                        <i className="fa-solid fa-camera"></i> {lang.save}
                      </button>
                      {showLogoOptions && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-slide-up">
                          <button onClick={() => { logoInputRef.current?.click(); setShowLogoOptions(false); }} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-[11px] font-medium text-slate-700 flex items-center gap-2"><i className="fa-solid fa-upload text-slate-400"></i> Upload New</button>
                        </div>
                      )}
                    </div>
                  )}
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>

              {/* Basic Info Form */}
              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
                  {/* Name */}
                  <div className="group space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.business} Name</label>
                      <div className="flex items-center gap-2">
                        {saveStatus.name === 'saving' && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                        {saveStatus.name === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                    </div>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} onBlur={() => saveField('name')} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white focus:shadow-sm" />
                  </div>
                  {/* Phone */}
                  <div className="group space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone</label>
                      <div className="flex items-center gap-2">
                        {saveStatus.phone === 'saving' && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                        {saveStatus.phone === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                    </div>
                    <input name="phone" type="tel" value={formData.phone} onChange={handleChange} onBlur={() => saveField('phone')} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all focus:bg-white focus:shadow-sm" />
                  </div>
                  {/* Category */}
                  <div className="group space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.category}</label>
                      <div className="flex items-center gap-2">
                        {saveStatus.category === 'saving' && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                        {saveStatus.category === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                    </div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => { handleChange(e); saveField('category', e.target.value); }}
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
                  {/* City */}
                  <div className="group space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.city}</label>
                      <div className="flex items-center gap-2">
                        {saveStatus.city === 'saving' && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                        {saveStatus.city === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                    </div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={(e) => { handleChange(e); saveField('city', e.target.value); }}
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 block">{lang.physStore}</span>
                        {saveStatus.has_physical_store === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                        {saveStatus.has_physical_store === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">{lang.physStoreDesc}</span>
                    </div>
                    <button
                      onClick={() => {
                        const next = !formData.has_physical_store;
                        setFormData(p => ({ ...p, has_physical_store: next }));
                        saveField('has_physical_store', next);
                      }}
                      className={`w-12 h-7 rounded-full transition-all relative ${formData.has_physical_store ? 'bg-black' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${formData.has_physical_store ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  {formData.has_physical_store && (
                    <div className="animate-slide-up space-y-2">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.address}</label>
                        <div className="flex items-center gap-2">
                          {saveStatus.physical_address === 'saving' && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                          {saveStatus.physical_address === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                        </div>
                      </div>
                      <textarea
                        name="physical_address"
                        value={formData.physical_address}
                        onChange={handleChange}
                        onBlur={() => saveField('physical_address')}
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
            {saveStatus.connectedChannels === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 ml-4"></i>}
            {saveStatus.connectedChannels === 'saved' && <i className="fa-solid fa-check text-emerald-500 ml-4"></i>}
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
                    {formData.connectedChannels.facebook ? 'Active' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-6 w-full sm:w-auto">
                {formData.connectedChannels.facebook ? (
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
                    {formData.connectedChannels.instagram ? 'Active' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-6 w-full sm:w-auto">
                {formData.connectedChannels.instagram ? (
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
            {saveStatus.deliveryTypes === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 ml-4"></i>}
            {saveStatus.deliveryTypes === 'saved' && <i className="fa-solid fa-check text-emerald-500 ml-4"></i>}
          </div>

          <div className="p-10 space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{lang.delivery}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(['courier', 'pickup'] as const).map(dt => (
                  <button
                    key={dt}
                    onClick={() => handleToggleDelivery(dt)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all font-bold text-sm uppercase tracking-wider ${formData.deliveryTypes.includes(dt)
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <span className="flex items-center gap-3"><i className={`fa-solid ${dt === 'courier' ? 'fa-truck-fast' : 'fa-store'} text-lg`}></i> {dt}</span>
                    {formData.deliveryTypes.includes(dt) && <i className="fa-solid fa-check text-[#EDFF8C]"></i>}
                  </button>
                ))}
              </div>

              {/* Delivery Fee for Courier */}
              {formData.deliveryTypes.includes('courier') && (
                <div className="mt-6 animate-slide-up bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.deliveryFee}</label>
                      <div className="flex items-center gap-2">
                        {saveStatus.deliveryFee === 'saving' && <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>}
                        {saveStatus.deliveryFee === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Set a default cost for city delivery.</p>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <input
                      name="deliveryFee"
                      type="number"
                      value={formData.deliveryFee}
                      onChange={handleChange}
                      onBlur={() => saveField('deliveryFee')}
                      className="w-32 bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-slate-900 outline-none focus:border-black transition-all text-right"
                    />
                    <span className="text-[10px] font-bold text-slate-400">MNT</span>
                  </div>
                </div>
              )}

              {/* Physical Address for Pickup */}
              {formData.deliveryTypes.includes('pickup') && (
                <div className="mt-4 animate-slide-up bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">{lang.addressRequired}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      {saveStatus.physical_address === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                      {saveStatus.physical_address === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                    </div>
                  </div>
                  <textarea
                    name="physical_address"
                    value={formData.physical_address}
                    onChange={handleChange}
                    onBlur={() => saveField('physical_address')}
                    className={`w-full bg-white border rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none transition-all resize-none h-20 ${!formData.physical_address ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 focus:border-indigo-500 shadow-sm'
                      }`}
                    placeholder="Enter your store address for customer pickup..."
                  />
                  {!formData.physical_address && (
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest animate-pulse">
                      <i className="fa-solid fa-circle-exclamation mr-1"></i> Address is required for pickup orders
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6 pt-8 border-t border-slate-50">
              {/* BANK DETAILS (New Section) */}
              {/* PAYMENT METHODS */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{lang.payment}</h3>
                  <p className="text-slate-500 text-xs font-medium">{lang.paymentDesc}</p>
                </div>
                <div className="flex items-center gap-2">
                  {formData.bankDetails.accountNumber && (
                    <button
                      onClick={() => setBankSettingsModal(true)}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                    >
                      <i className="fa-solid fa-building-columns"></i>
                      {formData.bankDetails.bankName}
                    </button>
                  )}
                  {saveStatus.paymentMethods === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[14px]"></i>}
                  {saveStatus.paymentMethods === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[14px]"></i>}
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {!formData.bankDetails.accountNumber && (
                  <div
                    onClick={() => setBankSettingsModal(true)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-plus"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">
                          {userLanguage === 'mn' ? 'Данс холбох' : 'Add Bank Account'}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {userLanguage === 'mn' ? 'Орлого хүлээн авах данс тохируулах' : 'Configure payout account'}
                        </span>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white border border-indigo-100 flex items-center justify-center">
                      <i className="fa-solid fa-chevron-right text-[10px] text-indigo-400"></i>
                    </div>
                  </div>
                )}

                {paymentMethodList.map((method) => {
                  const isBnpl = method.id === 'afterpay';
                  const bnplStatus = isBnpl ? store.fulfillment.bnplApplicationStatus : null;
                  const applications = bnplStatus?.applications || [];
                  const hasApprovedApp = applications.some(app => app.status === 'approved');
                  const isEnabled = formData.paymentMethods.includes(method.id as any);

                  return (
                    <div
                      key={method.id}
                      className={`flex flex-col p-4 bg-slate-50 rounded-2xl border transition-all group ${isEnabled ? 'border-slate-300' : 'border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      {/* Main Row */}
                      <div
                        className="flex items-center justify-between w-full cursor-pointer"
                        onClick={() => {
                          if (isBnpl && !hasApprovedApp && applications.length === 0) {
                            if (!formData.bankDetails.accountNumber || !formData.bankDetails.bankName) {
                              alert(userLanguage === 'mn' ? 'Та эхлээд дансны мэдээллээ оруулна уу.' : 'Please configure your bank account first to apply for BNPL.');
                              return;
                            }
                            setBnplApplicationModal({ show: true, step: 'terms' });
                          } else {
                            handleTogglePayment(method.id as any);
                          }
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isEnabled ? 'bg-[#1A1A1A] text-white shadow-md' : 'bg-white text-slate-400 group-hover:text-slate-600'
                            }`}>
                            <i className={`fa-solid ${method.icon}`}></i>
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${isEnabled ? 'text-slate-900' : 'text-slate-500'}`}>
                              {method.label}
                            </span>
                            {isBnpl && applications.length > 0 && (
                              <span className="text-[10px] font-medium text-slate-400">
                                {applications.length} provider(s) connected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Action */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isEnabled
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-300 group-hover:border-slate-400'
                          }`}>
                          {isEnabled && <i className="fa-solid fa-check text-white text-[10px]"></i>}
                        </div>
                      </div>

                      {/* BNPL Applications List */}
                      {isBnpl && applications.length > 0 && (
                        <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 animate-fade-in">
                          {applications.map(app => (
                            <div key={app.provider} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 text-xs shadow-inner">
                                  {app.provider === 'storepay' && '⚡'}
                                  {app.provider === 'lendpay' && '💳'}
                                  {app.provider === 'simplepay' && '📱'}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-900 capitalize">{app.provider}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <span className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider text-[10px] border ${app.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  'bg-rose-50 text-rose-600 border-rose-100'
                                }`}>
                                {app.status === 'pending' && <i className="fa-solid fa-clock mr-1"></i>}
                                {app.status === 'approved' && <i className="fa-solid fa-check mr-1"></i>}
                                {app.status === 'rejected' && <i className="fa-solid fa-circle-exclamation mr-1"></i>}
                                {app.status}
                              </span>
                            </div>
                          ))}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!formData.bankDetails.accountNumber || !formData.bankDetails.bankName) {
                                alert(userLanguage === 'mn' ? 'Та эхлээд дансны мэдээллээ оруулна уу.' : 'Please configure your bank account first to apply for BNPL.');
                                return;
                              }
                              setBnplApplicationModal({ show: true, step: 'terms' });
                            }}
                            className="w-full py-2.5 mt-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold transition-all border border-indigo-100 border-dashed hover:border-solid flex items-center justify-center gap-2 group/btn"
                          >
                            <i className="fa-solid fa-plus group-hover/btn:rotate-90 transition-transform"></i>
                            {userLanguage === 'mn' ? 'Шинэ хүсэлт илгээх' : 'Add New Provider'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
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
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.tone}</label>
                <div className="flex items-center gap-2">
                  {saveStatus.tone === 'saving' && <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>}
                  {saveStatus.tone === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
                {(['friendly', 'professional'] as const).map(tone => (
                  <button
                    key={tone}
                    onClick={() => { setFormData(p => ({ ...p, tone })); saveField('tone', tone); }}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.tone === tone ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {lang.tones[tone]}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.detail}</label>
                <div className="flex items-center gap-2">
                  {saveStatus.responseDetail === 'saving' && <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>}
                  {saveStatus.responseDetail === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
                {(['short', 'balanced', 'detailed'] as const).map(detail => (
                  <button
                    key={detail}
                    onClick={() => { setFormData(p => ({ ...p, responseDetail: detail })); saveField('responseDetail', detail); }}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${formData.responseDetail === detail ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'
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
            {saveStatus.notifications === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 ml-4"></i>}
            {saveStatus.notifications === 'saved' && <i className="fa-solid fa-check text-emerald-500 ml-4"></i>}
          </div>

          <div className="p-10 space-y-4">
            {Object.entries(formData.notifications).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-all">
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
          <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-circle-question text-lg"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.faq}</h3>
            <p className="text-xs font-medium text-slate-500">{lang.helpSection.faqDesc}</p>
          </button>

          {/* Support */}
          <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left group">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-headset text-lg"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.support}</h3>
            <p className="text-xs font-medium text-slate-500">{lang.helpSection.supportDesc}</p>
          </button>

          {/* Feedback */}
          <button className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left group">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
              <i className="fa-solid fa-comment-dots text-lg"></i>
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{lang.helpSection.feedback}</h3>
            <p className="text-xs font-medium text-slate-500">{lang.helpSection.feedbackDesc}</p>
          </button>
        </div>

      </div>

      {/* TERMS OF USE MODAL */}
      {termsModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleDeclineTerms}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-slate-50 to-white px-8 py-6 border-b border-slate-100 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <i className="fa-solid fa-file-contract"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                      {userLanguage === 'mn' ? 'Үйлчилгээний Нөхцөл' : 'Terms of Service'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {paymentMethodList.find(m => m.id === termsModal.method)?.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDeclineTerms}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[50vh]">
              <div className="prose prose-sm max-w-none space-y-4">
                {userLanguage === 'mn' ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
                        <div>
                          <p className="text-sm font-bold text-amber-900 mb-1">Анхаар</p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            {termsModal.method === 'qpay' && 'QPay-ээр төлбөр хүлээн авахын тулд та QPay-тэй гэрээ байгуулсан байх шаардлагатай.'}
                            {termsModal.method === 'online' && 'Онлайн төлбөрийн хэрэгсэл ашиглахын тулд банкны картын үйлчилгээ идэвхжүүлсэн байх шаардлагатай.'}
                            {termsModal.method === 'bank_transfer' && 'Банк шилжүүлгээр төлбөр хүлээн авахын тулд таны бизнесийн дансны мэдээллийг зөв оруулсан эсэхийг шалгана уу.'}
                            {termsModal.method === 'afterpay' && 'Хойшлуулсан төлбөрийн систем (BNPL) ашиглахад нэмэлт шимтгэл болон хугацаа хэтрүүлсний торгууль хамаарна.'}
                            {termsModal.method === 'cash_on_delivery' && 'Бэлэн мөнгөөр ​​төлбөр авахдаа тооцоо алдаагүй хийх, баримт өгөх үүрэгтэй.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">1. Үйлчилгээний нөхцөл</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Та энэхүү төлбөрийн хэрэгслийг идэвхжүүлснээр Storex платформын үйлчилгээний нөхцөлтэй болон холбогдох төлбөрийн үйлчилгээ үзүүлэгчийн нөхцөлтэй танилцаж, зөвшөөрч байна гэсэн үг юм.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">2. Хураамж болон шимтгэл</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Төлбөрийн арга бүрт өөр өөр шимтгэл хураамж хамаарч болзошгүй. Та эдгээр хураамжийг хүлээн зөвшөөрч, хариуцлага хүлээх үүрэгтэй.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">3. Мэдээллийн нууцлал</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Таны санхүүгийн болон хувийн мэдээллийг хамгаалах нь бидний нэн тэргүүний зорилт юм. Бид мэдээллийн аюулгүй байдлын олон улсын стандартыг баримталдаг.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">4. Зөрчил болон маргаан</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Төлбөртэй холбоотой аливаа зөрчил гарсан тохиолдолд платформ дээр 48 цагийн дотор мэдэгдэх шаардлагатай. Бид шударга шийдвэрлэх, нөхөн төлөх үйл явцыг баримталдаг.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
                        <div>
                          <p className="text-sm font-bold text-amber-900 mb-1">Important Notice</p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            {termsModal.method === 'qpay' && 'To accept QPay payments, you must have a valid agreement with QPay service.'}
                            {termsModal.method === 'online' && 'Online payment methods require active banking card services and merchant agreements.'}
                            {termsModal.method === 'bank_transfer' && 'Please ensure your business bank account details are correctly configured before enabling bank transfers.'}
                            {termsModal.method === 'afterpay' && 'Buy Now Pay Later (BNPL) services may incur additional fees and late payment penalties.'}
                            {termsModal.method === 'cash_on_delivery' && 'When accepting cash payments, you are responsible for accurate accounting and providing receipts.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">1. Terms of Service</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        By enabling this payment method, you acknowledge and agree to the Storex platform's terms of service and the associated payment service provider's conditions.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">2. Fees and Charges</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Different payment methods may incur various fees and charges. You acknowledge and accept responsibility for these fees.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">3. Data Privacy</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Protecting your financial and personal information is our top priority. We adhere to international information security standards.
                      </p>

                      <h4 className="text-sm font-bold text-slate-900">4. Disputes and Resolution</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        In case of any payment-related disputes, you must report within 48 hours on the platform. We follow a fair resolution and refund process.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-slate-100">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleDeclineTerms}
                  className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
                >
                  {userLanguage === 'mn' ? 'Болих' : 'Cancel'}
                </button>
                <button
                  onClick={handleAcceptTerms}
                  className="flex-1 px-6 py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-check"></i>
                  {userLanguage === 'mn' ? 'Зөвшөөрч байна' : 'I Agree'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANK SETTINGS MODAL */}
      {bankSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBankSettingsModal(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
            <div className="sticky top-0 bg-gradient-to-br from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                    <i className="fa-solid fa-building-columns"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                      {userLanguage === 'mn' ? 'Дансны Тохиргоо' : 'Bank Settings'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {userLanguage === 'mn' ? 'Wallet тохиргоотой синхрончлогдсон' : 'Synced with Wallet Settings'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setBankSettingsModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.bankName}</label>
                <select
                  value={formData.bankDetails.bankName}
                  onChange={(e) => {
                    const newVal = { ...formData.bankDetails, bankName: e.target.value };
                    setFormData(prev => ({ ...prev, bankDetails: newVal }));
                  }}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Bank...</option>
                  <option value="Khan Bank">Khan Bank</option>
                  <option value="TDB">Trade and Development Bank</option>
                  <option value="Golomt Bank">Golomt Bank</option>
                  <option value="XacBank">XacBank</option>
                  <option value="State Bank">State Bank</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.accountNumber}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formData.bankDetails.accountNumber}
                  onChange={(e) => {
                    const newVal = { ...formData.bankDetails, accountNumber: e.target.value };
                    setFormData(prev => ({ ...prev, bankDetails: newVal }));
                  }}
                  placeholder="0000000000"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.accountHolder}</label>
                <input
                  type="text"
                  value={formData.bankDetails.accountHolder}
                  onChange={(e) => {
                    const newVal = { ...formData.bankDetails, accountHolder: e.target.value };
                    setFormData(prev => ({ ...prev, bankDetails: newVal }));
                  }}
                  placeholder="Name on account"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-info text-indigo-600 mt-0.5"></i>
                  <p className="text-xs text-indigo-800 leading-relaxed">
                    {userLanguage === 'mn'
                      ? 'Энэхүү мэдээлэл нь Wallet хуудасны тохиргоотой ижил байна. Өөрчлөлт хадгалахад хоёулаа шинэчлэгдэнэ.'
                      : 'This information updates your minimal Payout Account. For advanced settings, please visit the Wallet page.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white px-8 py-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setBankSettingsModal(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all"
              >
                {userLanguage === 'mn' ? 'Болих' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  saveField('bankDetails', formData.bankDetails);
                  setBankSettingsModal(false);
                }}
                className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                {userLanguage === 'mn' ? 'Хадгалах' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BNPL APPLICATION MODAL */}
      {bnplApplicationModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleBnplModalClose}></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
            {/* STEP 1: TERMS */}
            {bnplApplicationModal.step === 'terms' && (
              <>
                <div className="sticky top-0 bg-gradient-to-br from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                          {userLanguage === 'mn' ? 'BNPL Үйлчилгээний Нөхцөл' : 'BNPL Terms of Service'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Afterpay / Buy Now Pay Later</p>
                      </div>
                    </div>
                    <button onClick={handleBnplModalClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <div className="px-8 py-6 overflow-y-auto max-h-[50vh]">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">{userLanguage === 'mn' ? 'Анхаар' : 'Important'}</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          {userLanguage === 'mn'
                            ? 'BNPL үйлчилгээ ашиглахын тулд хүсэлт илгээж, батлагдах шаардлагатай. Нэмэлт шимтгэл болон хугацаа хэтрүүлсний торгууль хамаарна.'
                            : 'BNPL services require application and approval. Additional fees and late payment penalties may apply.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">
                        {userLanguage === 'mn' ? '1. Хүсэлтийн үйл явц' : '1. Application Process'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {userLanguage === 'mn'
                          ? 'Та хүсэлт илгээсний дараа манай баг таны бизнесийн мэдээллийг шалгаж, 1-2 хоногт хариу өгнө.'
                          : 'After submitting your application, our team will review your business information and respond within 1-2 business days.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">
                        {userLanguage === 'mn' ? '2. Хураамж болон шимтгэл' : '2. Fees and Charges'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {userLanguage === 'mn'
                          ? 'BNPL үйлчилгээ үзүүлэгч нь гүйлгээ бүрээс 2-5% хураамж авах бөгөөд хугацаа хэтрүүлсэн тохиолдолд нэмэлт торгууль хамаарна.'
                          : 'BNPL providers charge 2-5% per transaction and may apply late fees for overdue payments.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-2">
                        {userLanguage === 'mn' ? '3. Шаардлага' : '3. Requirements'}
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                        <li>{userLanguage === 'mn' ? 'Сарын орлого: 500,000₮+' : 'Monthly revenue: ₮500,000+'}</li>
                        <li>{userLanguage === 'mn' ? 'Дундаж захиалга: 20,000₮+' : 'Average order value: ₮20,000+'}</li>
                        <li>{userLanguage === 'mn' ? 'Идэвхтэй бизнес (3+ сар)' : 'Active business (3+ months)'}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <button onClick={handleBnplModalClose} className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all">
                      {userLanguage === 'mn' ? 'Болих' : 'Cancel'}
                    </button>
                    <button onClick={handleBnplTermsAccept} className="flex-1 px-6 py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <i className="fa-solid fa-arrow-right"></i>
                      {userLanguage === 'mn' ? 'Үргэлжлүүлэх' : 'Continue'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: APPLICATION FORM */}
            {bnplApplicationModal.step === 'application' && (
              <>
                <div className="sticky top-0 bg-gradient-to-br from-indigo-50 to-white px-8 py-6 border-b border-indigo-100 z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-file-lines"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
                          {userLanguage === 'mn' ? 'BNPL Хүсэлтийн Форм' : 'BNPL Application Form'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {userLanguage === 'mn' ? 'Бизнесийн мэдээлэл бөглөх' : 'Complete your business information'}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleBnplModalClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                </div>

                <div className="px-8 py-6 overflow-y-auto max-h-[50vh] space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        {userLanguage === 'mn' ? 'Бизнес' : 'Business'}
                      </label>
                      <input type="text" value={bnplFormData.businessName} disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                        {userLanguage === 'mn' ? 'Ангилал' : 'Category'}
                      </label>
                      <input type="text" value={bnplFormData.businessCategory} disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      {userLanguage === 'mn' ? 'Сарын орлого (₮)' : 'Monthly Revenue (₮)'}
                    </label>
                    <input
                      type="number"
                      name="monthlyRevenue"
                      value={bnplFormData.monthlyRevenue}
                      onChange={handleBnplFormChange}
                      placeholder="1,500,000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      {userLanguage === 'mn' ? 'Дундаж захиалгын дүн (₮)' : 'Average Order Value (₮)'}
                    </label>
                    <input
                      type="number"
                      name="averageOrderValue"
                      value={bnplFormData.averageOrderValue}
                      onChange={handleBnplFormChange}
                      placeholder="45,000"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      {userLanguage === 'mn' ? 'Үйлчилгээ үзүүлэгч' : 'BNPL Provider'}
                    </label>
                    <select
                      name="provider"
                      value={bnplFormData.provider}
                      onChange={handleBnplFormChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value="storepay">⚡ StorePay (Recommended)</option>
                      <option value="lendpay">💳 LendPay</option>
                      <option value="simplepay">📱 SimplePay</option>
                    </select>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                    <p className="text-xs text-indigo-700 leading-relaxed">
                      {userLanguage === 'mn'
                        ? '💡 Таны мэдээллийг нууцлалтай хадгална. Батлагдсаны дараа та энэ төлбөрийн аргыг идэвхжүүлэх боломжтой болно.'
                        : '💡 Your information is kept confidential. After approval, you can enable this payment method.'}
                    </p>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => setBnplApplicationModal({ show: true, step: 'terms' })}
                      className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      {userLanguage === 'mn' ? 'Буцах' : 'Back'}
                    </button>
                    <button
                      onClick={handleBnplSubmit}
                      className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      {userLanguage === 'mn' ? 'Хүсэлт илгээх' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: SUBMITTED */}
            {bnplApplicationModal.step === 'submitted' && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-check text-4xl text-emerald-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                  {userLanguage === 'mn' ? 'Амжилттай илгээлээ!' : 'Successfully Submitted!'}
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {userLanguage === 'mn'
                    ? 'Таны BNPL хүсэлт амжилттай илгээгдлээ. Манай баг 1-2 хоногт хариу өгөх болно.'
                    : 'Your BNPL application has been submitted. Our team will review and respond within 1-2 business days.'}
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 inline-block">
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">
                    ⏳ {userLanguage === 'mn' ? 'Хүлээгдэж байна' : 'Pending Review'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-6">
                  {userLanguage === 'mn' ? 'Хаагдаж байна...' : 'Closing...'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;