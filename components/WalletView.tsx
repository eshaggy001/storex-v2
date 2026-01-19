import React, { useState, useMemo } from 'react';
import { StoreInfo, Order } from '../types';
import PaymentSetupModal from './PaymentSetupModal';

interface WalletViewProps {
  store: StoreInfo;
  orders: Order[];
  onUpdateStore: (updates: Partial<StoreInfo>) => void;
  userLanguage?: 'mn' | 'en';
}

// Mock Payout Data for UI Demonstration
const MOCK_PAYOUTS = [
  { id: 'PO-9921', date: '2026-01-01T10:00:00Z', amount: 450000, status: 'completed', bank: 'Khan Bank •••• 1234' },
  { id: 'PO-9920', date: '2025-12-25T10:00:00Z', amount: 320000, status: 'completed', bank: 'Khan Bank •••• 1234' },
  { id: 'PO-9919', date: '2025-12-18T10:00:00Z', amount: 210000, status: 'completed', bank: 'Khan Bank •••• 1234' },
];

const WalletView: React.FC<WalletViewProps> = ({ store, orders, onUpdateStore, userLanguage = 'mn' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'payouts' | 'settings'>('overview');
  const [bankForm, setBankForm] = useState(store.fulfillment.bankDetails || { bankName: '', accountNumber: '', accountHolder: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const t = {
    mn: {
      title: "Хэтэвч",
      subtitle: "Санхүүгийн тойм, гүйлгээ болон татан авалт.",
      tabs: { overview: "Тойм", transactions: "Гүйлгээ", payouts: "Таталт", settings: "Тохиргоо" },
      balance: { available: "Боломжит үлдэгдэл", pending: "Хүлээгдэж буй", lifetime: "Нийт орлого", ready: "Татахад бэлэн", processing: "Боловсруулж байна", generated: "Нийт үүссэн" },
      today: "Өнөөдөр",
      earnings: "Орлого",
      orders: "Захиалга",
      status: "Төлөв",
      active: "Идэвхтэй",
      account: "Данс",
      manage: "Дансны мэдээлэл засах",
      history: "Гүйлгээний түүх",
      cols: { date: "Огноо", type: "Төрөл", orderId: "ID", method: "Арга", amount: "Дүн", status: "Төлөв" },
      payout: { total: "Нийт татсан", next: "Дараагийн", freq: "Давтамж", history: "Татан авалтын түүх", weekly: "Долоо хоног бүр", monday: "Даваа гараг" },
      bank: { name: "Банкны нэр", number: "Дансны дугаар", holder: "Эзэмшигчийн нэр", save: "Хадгалах" },
      methods: "Төлбөрийн аргууд",
      methodsDesc: "Эдгээр аргуудыг Storex аюулгүй байдлын үүднээс хянадаг.",
      payment: "Төлбөр",
      noTx: "Гүйлгээ олдсонгүй."
    },
    en: {
      title: "Wallet",
      subtitle: "Financial overview, transactions, and payouts.",
      tabs: { overview: "Overview", transactions: "Transactions", payouts: "Payouts", settings: "Settings" },
      balance: { available: "Available Balance", pending: "Pending Balance", lifetime: "Lifetime Earnings", ready: "Ready for payout", processing: "Processing payments", generated: "Total revenue generated" },
      today: "Today's Snapshot",
      earnings: "Earnings",
      orders: "Orders",
      status: "Wallet Status",
      active: "Active",
      account: "Payout Account",
      manage: "Manage Payout Account",
      history: "Transaction History",
      cols: { date: "Date", type: "Type", orderId: "Order ID", method: "Method", amount: "Amount", status: "Status" },
      payout: { total: "Total Paid Out", next: "Next Payout", freq: "Frequency", history: "Payout History", weekly: "Weekly", monday: "Monday" },
      bank: { name: "Bank Name", number: "Account Number", holder: "Account Holder", save: "Save Changes" },
      methods: "Payment Methods",
      methodsDesc: "These payment methods are managed by Storex to ensure secure transactions for your customers.",
      payment: "Payment",
      noTx: "No transactions found."
    }
  };

  const lang = t[userLanguage];

  // -- Derived Financial Metrics --
  const financials = useMemo(() => {
    // 1. Total Revenue (All time paid orders)
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

    // 2. Pending Balance (Confirmed but not paid, or payment pending)
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending' || o.status === 'confirmed');
    const pendingBalance = pendingOrders.reduce((sum, o) => sum + o.total, 0);

    // 3. Payouts Total
    const totalPaidOut = MOCK_PAYOUTS.reduce((sum, p) => sum + p.amount, 0);

    // 4. Available Balance (Revenue - Payouts)
    const availableBalance = Math.max(0, totalRevenue - totalPaidOut);

    // 5. Today's Earnings
    const today = new Date().toDateString();
    const todayEarnings = paidOrders
      .filter(o => new Date(o.createdAt).toDateString() === today)
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalRevenue,
      availableBalance,
      pendingBalance,
      totalPaidOut,
      todayEarnings,
      transactionCount: paidOrders.length + MOCK_PAYOUTS.length
    };
  }, [orders]);

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate network delay
    setTimeout(() => {
      onUpdateStore({
        fulfillment: {
          ...store.fulfillment,
          bankDetails: {
            ...bankForm,
            paymentNote: store.fulfillment.bankDetails?.paymentNote || ''
          }
        }
      });
      setIsSaving(false);
    }, 1000);
  };

  const getPaymentLabel = (method: string) => {
    if (method === 'afterpay') {
      const providers = store.fulfillment.afterpayProviders || [];
      if (providers.length > 0) {
        const names = providers.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
        return `Afterpay (${names})`;
      }
      return 'Afterpay';
    }
    const labels: Record<string, string> = {
      cash_on_delivery: 'COD',
      bank_transfer: 'Bank Transfer',
      online: 'Online',
      qpay: 'QPAY'
    };
    return labels[method] || method;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-['Manrope']">

      {/* Header & Tabs */}
      <div className="space-y-8 mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lang.title}</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">{lang.subtitle}</p>
          </div>
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex">
            {[
              { id: 'overview', label: lang.tabs.overview },
              { id: 'transactions', label: lang.tabs.transactions },
              { id: 'payouts', label: lang.tabs.payouts },
              { id: 'settings', label: lang.tabs.settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TAB 1: OVERVIEW --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-slide-up">

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#EDFF8C] rounded-full opacity-10 blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.balance.available}</p>
                <h2 className="text-4xl font-black text-[#EDFF8C] tracking-tighter mb-4">{financials.availableBalance.toLocaleString()}₮</h2>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <i className="fa-solid fa-check text-[10px] text-[#EDFF8C]"></i>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{lang.balance.ready}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-colors">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.balance.pending}</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{financials.pendingBalance.toLocaleString()}₮</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                  <i className="fa-solid fa-clock text-[10px] text-indigo-600"></i>
                </div>
                <span className="text-[11px] font-medium text-slate-500">{lang.balance.processing}</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between group hover:border-emerald-100 transition-colors">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.balance.lifetime}</p>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{financials.totalRevenue.toLocaleString()}₮</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                  <i className="fa-solid fa-chart-line text-[10px] text-emerald-600"></i>
                </div>
                <span className="text-[11px] font-medium text-slate-500">{lang.balance.generated}</span>
              </div>
            </div>
          </div>

          {/* Activity Snapshot & Wallet Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Snapshot */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">{lang.today}</h3>
                <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.earnings}</p>
                  <p className="text-2xl font-black text-slate-900">{financials.todayEarnings.toLocaleString()}₮</p>
                </div>
                <div className="w-[1px] h-10 bg-slate-100"></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.orders}</p>
                  <p className="text-2xl font-black text-slate-900">
                    {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString() && o.paymentStatus === 'paid').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Status */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{lang.status}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-wide">{lang.active}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.account}</p>
                  <p className="text-sm font-bold text-slate-900">{store.fulfillment.bankDetails?.bankName}</p>
                  <p className="text-xs font-medium text-slate-500 font-mono">•••• {store.fulfillment.bankDetails?.accountNumber.slice(-4)}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
                >
                  {lang.manage} <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: TRANSACTIONS --- */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">{lang.history}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.date}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.type}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.orderId}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.method}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.amount}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter(o => o.paymentStatus !== 'unpaid')
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-8 text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-5 px-8">
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{lang.payment}</span>
                      </td>
                      <td className="py-5 px-8 text-sm font-medium text-indigo-600">{order.id}</td>
                      <td className="py-5 px-8 text-xs font-bold text-slate-500 uppercase">{order.paymentMethod.replace('_', ' ')}</td>
                      <td className="py-5 px-8 text-sm font-black text-emerald-600 text-right">+{order.total.toLocaleString()}₮</td>
                      <td className="py-5 px-8 text-right">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                {orders.filter(o => o.paymentStatus !== 'unpaid').length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium italic">{lang.noTx}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: PAYOUTS --- */}
      {activeTab === 'payouts' && (
        <div className="space-y-8 animate-slide-up">
          {/* Payout Summary */}
          <div className="bg-[#1A1A1A] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-bold text-[#EDFF8C] uppercase tracking-widest">{lang.payout.total}</p>
              <h2 className="text-5xl font-black text-white tracking-tighter">{financials.totalPaidOut.toLocaleString()}₮</h2>
            </div>
            <div className="relative z-10 flex gap-12 text-right">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.payout.next}</p>
                <p className="text-xl font-bold text-white">{lang.payout.monday}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.payout.freq}</p>
                <p className="text-xl font-bold text-white">{lang.payout.weekly}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDFF8C] rounded-full opacity-5 blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Actionable Payout Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm mb-8 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Available for Payout</h3>
                <p className="text-sm text-slate-500 font-medium">Earnings cleared and ready to withdraw.</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{financials.availableBalance.toLocaleString()}₮</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  {financials.pendingBalance > 0 ? `+${financials.pendingBalance.toLocaleString()}₮ Pending` : 'No pending funds'}
                </p>
              </div>
            </div>

            {store.readiness.payout_ready ? (
              <button
                disabled={financials.availableBalance <= 0}
                className="w-full py-4 bg-[#EDFF8C] text-black rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => alert("Payout request submitted! (Mock)")}
              >
                Request Payout <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-shield-halved"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-rose-800 mb-1">Identity Verification Required</h4>
                    <p className="text-xs text-rose-600 mb-4 leading-relaxed">
                      To comply with financial regulations, you must verify your identity (DAN) before requesting payouts.
                    </p>
                    <button
                      onClick={() => {
                        const confirm = window.confirm("Mock: Verify Identity via DAN system?");
                        if (confirm) {
                          onUpdateStore({
                            readiness: {
                              ...store.readiness,
                              payout_ready: true
                            }
                          });
                        }
                      }}
                      className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-sm"
                    >
                      Verify Identity
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payout History */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{lang.payout.history}</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.date}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.amount}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_PAYOUTS.map((payout) => (
                  <tr key={payout.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-5 px-8 text-xs font-bold text-slate-500">{payout.id}</td>
                    <td className="py-5 px-8 text-sm font-bold text-slate-900">{new Date(payout.date).toLocaleDateString()}</td>
                    <td className="py-5 px-8 text-sm font-medium text-slate-600 flex items-center gap-2">
                      <i className="fa-solid fa-building-columns text-slate-400 text-xs"></i>
                      {payout.bank}
                    </td>
                    <td className="py-5 px-8 text-sm font-black text-slate-900 text-right">{payout.amount.toLocaleString()}₮</td>
                    <td className="py-5 px-8 text-right">
                      <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600">
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">{lang.account}</h3>
              <form onSubmit={handleSaveBankDetails} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{lang.bank.name}</label>
                    <input
                      type="text"
                      value={bankForm.bankName}
                      onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all"
                      placeholder="e.g. Khan Bank"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{lang.bank.number}</label>
                    <input
                      type="text"
                      value={bankForm.accountNumber}
                      onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all"
                      placeholder="e.g. 5000000000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{lang.bank.holder}</label>
                  <input
                    type="text"
                    value={bankForm.accountHolder}
                    onChange={e => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-900 outline-none focus:border-black transition-all"
                    placeholder="e.g. Company Name LLC"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">Last updated: {new Date().toLocaleDateString()}</p>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-2"
                  >
                    {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                    {lang.bank.save}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">{lang.methods}</h3>
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-3">
                {(['qpay', 'afterpay', 'online', 'bank_transfer', 'cash_on_delivery'] as const).filter(m => store.fulfillment.paymentMethods.includes(m)).map((pm) => (
                  <div key={pm} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <i className={`fa-solid ${pm === 'qpay' ? 'fa-qrcode' :
                        pm === 'afterpay' ? 'fa-clock' :
                          pm === 'cash_on_delivery' ? 'fa-wallet' :
                            'fa-credit-card'
                        } text-slate-400`}></i>
                      <span className="text-sm font-bold text-slate-700">{getPaymentLabel(pm)}</span>
                    </div>
                    <i className="fa-solid fa-check-circle text-emerald-500"></i>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-medium text-slate-400 mt-6 leading-relaxed">
                {lang.methodsDesc}
              </p>
            </div>
          </div>

        </div>
      )}

      <PaymentSetupModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        store={store}
        onUpdateStore={onUpdateStore}
      />
    </div>
  );
};

export default WalletView;