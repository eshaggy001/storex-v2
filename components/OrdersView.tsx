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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'paid' | 'completed'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'pending' | 'paid'>('all');
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
        unpaid: "Төлөгдөөгүй"
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
        unpaid: "Unpaid"
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
    canceled: { label: 'Canceled', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  };

  const paymentStatusMap = {
    paid: { label: lang.filters.paid, color: 'text-emerald-600', icon: 'fa-circle-check' },
    pending: { label: lang.filters.pending, color: 'text-amber-600', icon: 'fa-circle-notch fa-spin' },
    unpaid: { label: lang.filters.unpaid, color: 'text-slate-400', icon: 'fa-circle' },
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
    <div className="space-y-8 animate-fade-in font-['Manrope'] relative">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{lang.title}</h1>
          <p className="text-slate-500 font-medium text-sm">{lang.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg uppercase tracking-wide shrink-0"
          >
            <i className="fa-solid fa-plus text-[#EDFF8C]"></i>
            {lang.create}
          </button>

          <button 
            onClick={() => setShowDeliveryView(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm shrink-0"
          >
            <i className="fa-solid fa-map-location-dot text-indigo-600"></i>
            {lang.delivery}
          </button>
          
          <div className="relative group flex-1 md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"></i>
            <input 
              type="text" 
              placeholder={lang.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
          {/* Order Status Segmented Control */}
          <div className="space-y-2 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{lang.filters.status}</label>
            <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {(['all', 'pending', 'confirmed', 'paid', 'completed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                    statusFilter === s ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang.filters[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-10 bg-slate-200"></div>

          {/* Payment Status Toggle */}
          <div className="space-y-2 w-full sm:w-auto">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{lang.filters.payment}</label>
            <div className="flex gap-2">
              {(['all', 'unpaid', 'pending', 'paid'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPaymentFilter(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider ${
                    paymentFilter === p 
                      ? 'bg-black text-white border-black shadow-lg' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {lang.filters[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{lang.showing}</p>
          <p className="text-sm font-bold text-slate-900">{filteredOrders.length} orders total</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-slide-up">
        {filteredOrders.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-receipt text-slate-300 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{lang.notFound}</h3>
            <p className="text-slate-500 mt-2 font-medium text-sm">{lang.notFoundDesc}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.order}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.customer}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.source}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.total}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.cols.status}</th>
                  <th className="py-5 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{lang.cols.payment}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const statusInfo = orderStatusMap[order.status as keyof typeof orderStatusMap] || { label: order.status, color: 'bg-slate-50 text-slate-500' };
                  const paymentInfo = paymentStatusMap[order.paymentStatus as keyof typeof paymentStatusMap];
                  const methodConfig = getPaymentMethodConfig(order.paymentMethod);
                  const sourceConfig = getSourceConfig(order.channel);
                  
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => onSelectOrder(order)}
                      className="group hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <td className="py-5 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {order.id}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            {order.isAiGenerated ? (
                              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-[#EDFF8C] text-black uppercase tracking-widest flex items-center gap-1">
                                <i className="fa-solid fa-bolt text-[7px]"></i> {lang.aiCreated}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-widest flex items-center gap-1">
                                <i className="fa-solid fa-user-pen text-[7px]"></i> {lang.manual}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit text-[10px] font-bold uppercase tracking-widest border ${sourceConfig.color}`}>
                          <i className={`fa-brands ${sourceConfig.icon} text-xs`}></i>
                          <span>{sourceConfig.label}</span>
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <div className="font-bold text-slate-900 text-base">
                          {order.total.toLocaleString()}₮
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                          {order.items.length} items
                        </div>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex flex-col items-end gap-1.5">
                           <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${methodConfig.style}`}>
                              <i className={`fa-solid ${methodConfig.icon}`}></i>
                              <span>{methodConfig.label}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${paymentInfo?.color || 'text-slate-400'}`}>
                                {paymentInfo?.label || order.paymentStatus}
                              </span>
                              <i className={`fa-solid ${paymentInfo?.icon || 'fa-circle'} ${paymentInfo?.color || 'text-slate-300'} text-xs`}></i>
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