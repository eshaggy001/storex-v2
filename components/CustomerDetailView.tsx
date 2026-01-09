
import React from 'react';
import { Customer, Order } from '../types';

interface CustomerDetailViewProps {
  customer: Customer;
  orders: Order[];
  onBack: () => void;
  onSelectOrder: (order: Order) => void;
}

const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customer, orders, onBack, onSelectOrder }) => {
  const customerOrders = orders.filter(o => o.customerName === customer.name);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in font-['Manrope']">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-bold hover:text-black transition-colors mb-8"
      >
        <i className="fa-solid fa-arrow-left"></i>
        Back to Customers
      </button>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-3xl font-black text-slate-200 border border-slate-100">
            {customer.name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{customer.name}</h2>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                customer.status === 'returning' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {customer.status}
              </span>
            </div>
            {customer.phoneNumber && (
              <a href={`tel:${customer.phoneNumber}`} className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-2">
                <i className="fa-solid fa-phone text-xs"></i>
                {customer.phoneNumber}
              </a>
            )}
          </div>
        </div>
        
        <div className="flex gap-10 bg-slate-50 px-8 py-5 rounded-[1.5rem] border border-slate-100">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-2xl font-black text-slate-900">{customer.ordersCount}</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 my-auto"></div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
            <p className="text-2xl font-black text-indigo-600 tracking-tighter">{customer.totalSpent.toLocaleString()}₮</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white rounded-super p-8 border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Information Card</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Contact Phone</p>
                <p className="text-sm font-black text-slate-900">{customer.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Preferred Channels</p>
                <div className="flex flex-wrap gap-2 mt-2">
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-100">
                     <i className={`fa-brands ${customer.channel === 'instagram' ? 'fa-instagram text-pink-500' : customer.channel === 'facebook' ? 'fa-facebook text-blue-500' : 'fa-globe text-slate-400'}`}></i>
                     {customer.channel}
                   </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-50">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">First Seen</p>
                      <p className="text-xs font-bold text-slate-900">{new Date(customer.firstInteraction).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Active</p>
                      <p className="text-xs font-bold text-slate-900">{new Date(customer.lastInteraction).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1A1A1A] text-white rounded-[2rem] p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EDFF8C] rounded-full opacity-5 blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-[#EDFF8C] rounded-lg flex items-center justify-center text-black">
                  <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
                </div>
                <h3 className="text-lg font-black text-[#EDFF8C] tracking-tight">AI insight</h3>
              </div>
              <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                "{customer.aiInsight || "No specific insights yet for this customer."}"
              </p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <i className="fa-solid fa-clock-rotate-left text-slate-300"></i>
            Order History
          </h3>
          
          <div className="space-y-4">
            {customerOrders.length > 0 ? (
              customerOrders.map(order => (
                <div 
                  key={order.id} 
                  onClick={() => onSelectOrder(order)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{order.id}</p>
                      {order.isAiGenerated && (
                        <i className="fa-solid fa-wand-magic-sparkles text-[9px] text-indigo-400" title="AI Created"></i>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{order.total.toLocaleString()}₮</p>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {order.items.length} items
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center text-slate-400 font-medium border-dashed">
                No orders recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;
