import React, { useState, useMemo } from 'react';
import { Order, Product, StoreInfo } from '../types';
import DeliveryView from './DeliveryView';
import CreateOrderModal from './CreateOrderModal';

interface OrdersViewProps {
  orders: Order[];
  products: Product[];
  store: StoreInfo;
  onSelectOrder: (order: Order) => void;
  onCreateOrder: (order: Partial<Order>) => void;
  userLanguage?: 'mn' | 'en';
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders, products, store, onSelectOrder, onCreateOrder, userLanguage = 'mn' }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'pending' | 'paid' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeliveryView, setShowDeliveryView] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const t = {
    mn: {
      title: "Захиалга",
      subtitle: "Захиалга болон төлбөрийн хяналт.",
      create: "Захиалга үүсгэх",
      delivery: "Хүргэлт харах",
      search: "Хайх (Нэр, ID)...",
      filters: {
        status: "Захиалгын төлөв",
        payment: "Төлбөрийн төлөв",
        all: "Бүгд",
        pending: "Хүлээгдэж буй",
        confirmed: "Баталгаажсан",
        paid: "Төлөгдсөн",
        completed: "Дууссан",
        unpaid: "Төлөгдөөгүй",
        cancelled: "Цуцлагдсан",
        refunded: "Буцаагдсан"
      },
      showing: "Нийт",
      notFound: "Захиалга олдсонгүй",
      notFoundDesc: "Шүүлтүүрээ өөрчилж үзнэ үү.",
      cols: { order: "Захиалга", customer: "Харилцагч", source: "Эх сурвалж", total: "Дүн", status: "Төлөв", payment: "Төлбөр" },
      aiCreated: "AI Үүсгэсэн",
      manual: "Гараар"
    },
    en: {
      title: "Orders",
      subtitle: "Manage social commerce transactions and payments.",
      create: "Create Order",
      delivery: "Delivery View",
      search: "Search customer or Order ID...",
      filters: {
        status: "Order Status",
        payment: "Payment Status",
        all: "All",
        pending: "Pending",
        confirmed: "Confirmed",
        paid: "Paid",
        completed: "Completed",
        unpaid: "Unpaid",
        cancelled: "Cancelled",
        refunded: "Refunded"
      },
      showing: "Showing",
      notFound: "No orders found",
      notFoundDesc: "Try adjusting your filters or search terms.",
      cols: { order: "Order", customer: "Customer", source: "Source", total: "Total", status: "Order Status", payment: "Payment" },
      aiCreated: "AI Created",
      manual: "Manual"
    }
  };

  const lang = t[userLanguage];

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === 'all' ||
        order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  const orderStatusMap = {
    pending: { label: lang.filters.pending, color: 'bg-amber-50 text-amber-700 border-amber-100' },
    confirmed: { label: lang.filters.confirmed, color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    paid: { label: lang.filters.paid, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    completed: { label: lang.filters.completed, color: 'bg-slate-50 text-slate-600 border-slate-100' },
    cancelled: { label: lang.filters.cancelled, color: 'bg-rose-50 text-rose-700 border-rose-100' },
  };

  const paymentStatusMap = {
    paid: { label: lang.filters.paid, color: 'text-emerald-600', icon: 'fa-circle-check' },
    pending: { label: lang.filters.pending, color: 'text-amber-600', icon: 'fa-circle-notch fa-spin' },
    unpaid: { label: lang.filters.unpaid, color: 'text-slate-400', icon: 'fa-circle' },
    refunded: { label: lang.filters.refunded, color: 'text-rose-500', icon: 'fa-rotate-left' },
  };

  const getPaymentMethodConfig = (method: string) => {
    switch (method) {
      case 'qpay': return { label: 'QPAY', icon: 'fa-qrcode', style: 'bg-[#1A1A1A] text-white border-black' };
      case 'afterpay': return { label: 'Afterpay', icon: 'fa-clock', style: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
      case 'cash_on_delivery': return { label: 'COD', icon: 'fa-money-bill', style: 'bg-slate-100 text-slate-600 border-slate-200' };
      case 'bank_transfer': return { label: 'Bank', icon: 'fa-building-columns', style: 'bg-slate-100 text-slate-600 border-slate-200' };
      case 'online': return { label: 'Card', icon: 'fa-credit-card', style: 'bg-blue-50 text-blue-700 border-blue-100' };
      default: return { label: method, icon: 'fa-wallet', style: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const getSourceConfig = (channel: Order['channel']) => {
    switch (channel) {
      case 'facebook':
      case 'facebook_comment':
        return { icon: 'fa-facebook', color: 'text-blue-600 bg-blue-50 border-blue-100', label: 'Facebook' };
      case 'instagram':
        return { icon: 'fa-instagram', color: 'text-pink-600 bg-pink-50 border-pink-100', label: 'Instagram' };
      case 'web':
        return { icon: 'fa-store', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Mini Web' };
      default:
        return { icon: 'fa-circle', color: 'text-slate-600 bg-slate-50 border-slate-200', label: 'Other' };
    }
  };

  return (
    <div className="space-y-10 animate-fade-in font-sans relative">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-dark/5 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-dark tracking-tighter">{lang.title}</h1>
          <p className="text-slate-500 font-medium text-base">{lang.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary !px-8 !py-4 shadow-xl"
          >
            <i className="fa-solid fa-plus text-dark/70 mr-1"></i>
            {lang.create}
          </button>

          <button
            onClick={() => setShowDeliveryView(true)}
            className="btn-secondary !px-8 !py-4 shadow-md"
          >
            <i className="fa-solid fa-map-location-dot text-indigo-500 mr-2"></i>
            {lang.delivery}
          </button>

          <div className="relative group flex-1 min-w-[260px] lg:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-lime transition-colors"></i>
            <input
              type="text"
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-dark/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold shadow-soft focus:ring-4 focus:ring-lime/10 focus:border-lime transition-all outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between bg-white p-8 rounded-super border border-dark/5 shadow-soft animate-fade-up">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full xl:w-auto">
          {/* Order Status Segmented Control */}
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.filters.status}</label>
            <div className="flex bg-bg p-1.5 rounded-xl border border-dark/5 w-full md:w-auto overflow-x-auto no-scrollbar shadow-inner">
              {(['all', 'pending', 'confirmed', 'paid', 'completed', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${statusFilter === s ? 'bg-white text-dark shadow-sm border-dark/5' : 'text-slate-400 hover:text-dark border-transparent'
                    }`}
                >
                  {lang.filters[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-[1px] h-12 bg-dark/5 self-end mb-2"></div>

          {/* Payment Status Toggle */}
          <div className="space-y-3 w-full md:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.filters.payment}</label>
            <div className="flex gap-2">
              {(['all', 'unpaid', 'pending', 'paid', 'refunded'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPaymentFilter(p)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all uppercase tracking-widest ${paymentFilter === p
                    ? 'bg-dark text-white border-dark shadow-xl scale-105'
                    : 'bg-white text-slate-500 border-dark/5 hover:border-dark/20 shadow-sm'
                    }`}
                >
                  {lang.filters[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 bg-bg/50 px-6 py-4 rounded-2xl border border-dark/5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{lang.showing}</p>
          <p className="text-base font-bold text-dark tracking-tight">{filteredOrders.length} orders total</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-super border border-dark/5 shadow-soft overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {filteredOrders.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-24 h-24 bg-bg rounded-card flex items-center justify-center mx-auto mb-8 text-slate-200 text-4xl shadow-inner">
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h3 className="text-2xl font-bold text-dark tracking-tight">{lang.notFound}</h3>
            <p className="text-slate-500 mt-3 font-medium text-base">{lang.notFoundDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg/50 border-b border-dark/5">
                <tr>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang.cols.order}</th>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{lang.cols.customer}</th>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">{lang.cols.source}</th>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">{lang.cols.total}</th>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">{lang.cols.status}</th>
                  <th className="py-6 px-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">{lang.cols.payment}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark/5">
                {filteredOrders.map((order, i) => {
                  const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'bg-slate-50 text-slate-500' };
                  const paymentInfo = paymentStatusMap[order.paymentStatus as keyof typeof paymentStatusMap];
                  const methodConfig = getPaymentMethodConfig(order.paymentMethod);
                  const sourceConfig = getSourceConfig(order.channel);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="group hover:bg-bg/30 transition-all cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <td className="py-7 px-10">
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-dark text-base tracking-tight group-hover:text-dark transition-colors">
                            {order.id}
                          </span>
                          <div className="flex items-center gap-2">
                            {order.isAiGenerated ? (
                              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-lime text-dark uppercase tracking-widest flex items-center gap-1 shadow-sm border border-black/5 pulse-subtle">
                                <i className="fa-solid fa-wand-magic-sparkles text-[9px]"></i> {lang.aiCreated}
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-lg text-[9px] font-bold bg-bg text-slate-500 border border-dark/5 uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                <i className="fa-solid fa-user-pen text-[9px]"></i> {lang.manual}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-7 px-10">
                        <div className="font-bold text-dark text-base tracking-tight">{order.customerName}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                          <i className="fa-regular fa-calendar-days opacity-50"></i>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-7 px-10">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl w-fit text-[10px] font-bold uppercase tracking-widest border shadow-sm mx-auto ${sourceConfig.color}`}>
                          <i className={`fa-brands ${sourceConfig.icon} text-xs`}></i>
                          <span>{sourceConfig.label}</span>
                        </div>
                      </td>
                      <td className="py-7 px-10 text-right">
                        <div className="font-bold text-dark text-lg tracking-tighter">
                          {order.total.toLocaleString()}₮
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center justify-end gap-1.5">
                          <i className="fa-solid fa-bag-shopping opacity-30"></i>
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="py-7 px-10 text-center">
                        <span className={`inline-flex items-center px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border shadow-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-7 px-10">
                        <div className="flex flex-col items-end gap-2.5">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border shadow-sm ${methodConfig.style}`}>
                            <i className={`fa-solid ${methodConfig.icon}`}></i>
                            <span>{methodConfig.label}</span>
                          </div>
                          <div className="flex items-center gap-2 pr-1">
                            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${paymentInfo?.color || 'text-slate-400'}`}>
                              {paymentInfo?.label || order.paymentStatus}
                            </span>
                            <div className={`w-2 h-2 rounded-full ${paymentInfo?.color?.replace('text-', 'bg-') || 'bg-slate-300'} shadow-sm animate-pulse-slow`}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDeliveryView && (
        <DeliveryView
          orders={orders}
          onClose={() => setShowDeliveryView(false)}
          onSelectOrder={(order) => {
            setShowDeliveryView(false);
            onSelectOrder(order);
          }}
        />
      )}

      {showCreateModal && (
        <CreateOrderModal
          products={products}
          store={store}
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateOrder}
        />
      )}
    </div>
  );
};

export default OrdersView;