import React from 'react';
import { Order, Product } from '../types';

interface OrderDetailProps {
  order: Order;
  products: Product[];
  onBack: () => void;
  onUpdate: (updates: Partial<Order>) => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, products, onBack, onUpdate }) => {
  const getProduct = (id: string) => products.find(p => p.id === id);

  const setStatus = (status: Order['status']) => {
    let updates: Partial<Order> = { status };
    if (status === 'paid') updates.paymentStatus = 'paid';
    onUpdate(updates);
  };

  const getSourceInfo = (channel: Order['channel']) => {
    switch (channel) {
      case 'facebook': 
      case 'facebook_comment':
        return { icon: 'fa-facebook', color: 'text-blue-600', label: 'Facebook' };
      case 'instagram': return { icon: 'fa-instagram', color: 'text-pink-600', label: 'Instagram' };
      case 'web': return { icon: 'fa-store', color: 'text-emerald-600', label: 'Mini Web' };
      default: return { icon: 'fa-circle', color: 'text-slate-500', label: 'Manual Entry' };
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'qpay': return { label: 'QPAY', icon: 'fa-qrcode', color: 'bg-black text-white' };
      case 'afterpay': return { label: 'Afterpay', icon: 'fa-clock', color: 'bg-indigo-600 text-white' };
      default: return { label: method.replace('_', ' '), icon: 'fa-credit-card', color: 'bg-slate-500 text-white' };
    }
  };

  const sourceInfo = getSourceInfo(order.channel);
  const paymentDisplay = getPaymentMethodDisplay(order.paymentMethod);

  const steps = ['pending', 'confirmed', 'paid', 'completed'];
  const currentStepIndex = Math.max(0, steps.indexOf(order.status));

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in font-['Manrope']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="space-y-4">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-semibold hover:text-black transition-colors text-[14px]">
            <i className="fa-solid fa-arrow-left text-[12px]"></i> Back to Orders
          </button>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight leading-none">Order {order.id}</h1>
          <div className="flex items-center gap-6 text-slate-400 text-[12px] font-medium uppercase tracking-widest leading-none">
            <div className="flex items-center gap-2">
              <i className={`fa-brands ${sourceInfo.icon} ${sourceInfo.color} text-base`}></i>
              <span>{sourceInfo.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-calendar text-[14px]"></i>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Horizontal Progress Tracker */}
          <section className="bg-white rounded-super p-10 border border-slate-100 shadow-sm relative overflow-hidden">
             {/* Progress Line Background */}
             <div className="absolute top-[3.75rem] left-[12.5%] right-[12.5%] h-0.5 -z-0">
                <div className="absolute inset-0 bg-slate-100 rounded-full"></div>
                <div 
                  className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>
             </div>
             
             {/* Steps Grid */}
             <div className="grid grid-cols-4 relative z-10">
                {steps.map((step, index) => {
                   const isCompleted = index <= currentStepIndex;
                   const isCurrent = index === currentStepIndex;
                   
                   return (
                      <div key={step} className="flex flex-col items-center gap-4">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-sm z-10 ${
                            isCurrent 
                              ? 'bg-indigo-600 border-indigo-100 text-white scale-110' 
                              : isCompleted 
                                 ? 'bg-indigo-100 border-white text-indigo-600' 
                                 : 'bg-white border-slate-100 text-slate-300'
                         }`}>
                            {index < currentStepIndex ? (
                               <i className="fa-solid fa-check text-xs"></i>
                            ) : (
                               <span className="text-xs font-bold">{index + 1}</span>
                            )}
                         </div>
                         <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                            isCurrent ? 'text-indigo-600' : isCompleted ? 'text-slate-900' : 'text-slate-300'
                         }`}>
                            {step}
                         </span>
                      </div>
                   );
                })}
             </div>
          </section>

          <section className="bg-white rounded-super p-10 border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-6 leading-none">Customer Details</h3>
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-semibold text-slate-300 border border-slate-100">{order.customerName[0]}</div>
              <div className="flex-1 space-y-3">
                <p className="text-xl font-semibold text-slate-900 tracking-tight">{order.customerName}</p>
                <div className="flex items-center gap-3 pt-2">
                  <a href={`tel:${order.phoneNumber}`} className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-none">{order.phoneNumber}</a>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-super p-10 border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-8 leading-none">Ordered Items</h3>
            <div className="space-y-8">
              {order.items.map((item, idx) => {
                const product = getProduct(item.productId);
                return (
                  <div key={idx} className="flex items-center justify-between group p-2 -mx-2 hover:bg-slate-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0"><img src={product?.images[0]} alt={product?.name} className="w-full h-full object-cover" /></div>
                      <div className="space-y-0.5">
                        <h4 className="text-lg font-semibold text-slate-900 leading-tight">{product?.name}</h4>
                        <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">{product?.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                      <p className="text-lg font-semibold text-slate-900 tracking-tight mt-0.5">{( (product?.price || 0) * item.quantity).toLocaleString()}₮</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 pt-10 border-t border-slate-50 flex justify-between items-end">
               <p className="text-slate-500 text-[14px] font-normal">{order.items.length} items total.</p>
               <div className="text-right">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1">Order Total</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight leading-none">{order.total.toLocaleString()}₮</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-super p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Actions</h3>
               <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-lg">{order.status}</span>
            </div>
            <div className="space-y-3">
              {order.status === 'pending' && <button onClick={() => setStatus('confirmed')} className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-2xl font-medium text-[14px] hover:bg-black transition-all shadow-xl">Confirm Order</button>}
              {order.status === 'confirmed' && <button onClick={() => setStatus('paid')} className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-2xl font-medium text-[14px] hover:bg-black transition-all shadow-xl">Mark as Paid</button>}
              {order.status === 'paid' && <button onClick={() => setStatus('completed')} className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-2xl font-medium text-[14px] hover:bg-black transition-all shadow-xl">Mark as Completed</button>}
              {order.status === 'completed' && <div className="w-full bg-emerald-50 text-emerald-700 py-3.5 rounded-2xl font-medium text-[14px] text-center border border-emerald-100">Order Completed</div>}
            </div>
          </section>

          {/* Payment Information Section */}
          <section className="bg-white rounded-super p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Payment Information</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : order.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                    {order.paymentStatus}
                </span>
            </div>
            
            <div className="space-y-6">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Method Used</p>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${paymentDisplay.color}`}>
                            <i className={`fa-solid ${paymentDisplay.icon}`}></i>
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 capitalize leading-none">{paymentDisplay.label}</p>
                           {order.paymentMethod === 'afterpay' && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">BNPL Service</p>}
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-slate-50">
                     <div className="flex justify-between items-end">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                         <span className="text-lg font-bold text-slate-900">{order.total.toLocaleString()}₮</span>
                     </div>
                </div>
            </div>
          </section>

          {/* Delivery Information Section */}
          <section className="bg-white rounded-super p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Delivery Information</h3>
            </div>
            
            <div className="space-y-6">
                <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Method</p>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${order.deliveryMethod === 'courier' ? 'bg-[#1A1A1A] text-white' : 'bg-white text-slate-900'}`}>
                            <i className={`fa-solid ${order.deliveryMethod === 'courier' ? 'fa-truck' : 'fa-store'}`}></i>
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 capitalize leading-none">{order.deliveryMethod}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                             {order.deliveryMethod === 'courier' ? 'Direct to Customer' : 'Customer Pickup'}
                           </p>
                        </div>
                    </div>
                </div>

                {order.deliveryMethod === 'courier' && order.deliveryAddress && (
                    <div className="pt-4 border-t border-slate-50">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Address</p>
                         <p className="text-sm font-bold text-slate-900 leading-relaxed">
                            {order.deliveryAddress}
                         </p>
                    </div>
                )}
            </div>
          </section>

          <section className="bg-[#1A1A1A] text-white rounded-super p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EDFF8C] rounded-full opacity-5 blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#EDFF8C] rounded-lg flex items-center justify-center text-black shadow-lg"><i className="fa-solid fa-wand-magic-sparkles text-[12px]"></i></div>
                <h3 className="text-base font-semibold text-[#EDFF8C] tracking-tight">AI summary</h3>
              </div>
              <p className="text-slate-400 text-[14px] font-normal leading-relaxed italic">"{order.aiSummary}"</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;