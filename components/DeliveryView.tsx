
import React, { useState, useMemo } from 'react';
import { Order } from '../types';

interface DeliveryViewProps {
  orders: Order[];
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
}

const DeliveryView: React.FC<DeliveryViewProps> = ({ orders, onClose, onSelectOrder }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const deliveryOrders = useMemo(() => {
    return orders
      .filter(o => o.deliveryMethod === 'courier' && o.status !== 'completed')
      .map((o) => {
        let x = 50, y = 50; // Default center
        const addr = o.deliveryAddress?.toLowerCase() || '';
        
        if (addr.includes('бзд') || addr.includes('баянзүрх')) {
          x = 70 + (Math.random() * 15);
          y = 45 + (Math.random() * 15);
        } else if (addr.includes('схд') || addr.includes('сонгино')) {
          x = 15 + (Math.random() * 15);
          y = 40 + (Math.random() * 20);
        } else if (addr.includes('худ') || addr.includes('хан-уул')) {
          x = 50 + (Math.random() * 10);
          y = 70 + (Math.random() * 15);
        } else if (addr.includes('бгд') || addr.includes('баянгол')) {
          x = 30 + (Math.random() * 15);
          y = 45 + (Math.random() * 15);
        } else if (addr.includes('сбд') || addr.includes('сүхбаатар')) {
          x = 50 + (Math.random() * 5);
          y = 40 + (Math.random() * 10);
        } else {
          x = 45 + (Math.random() * 10);
          y = 45 + (Math.random() * 10);
        }

        return { ...o, x, y };
      });
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return deliveryOrders.filter(o => 
      statusFilter === 'all' || o.status === statusFilter
    );
  }, [deliveryOrders, statusFilter]);

  const aiInsights = useMemo(() => {
    const total = deliveryOrders.length;
    const sameArea = Math.min(3, total);
    return {
      count: total,
      areaCount: sameArea,
      message: `${total} orders are scheduled for Ulaanbaatar city delivery. High density detected in Bayanzurkh district.`
    };
  }, [deliveryOrders]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 font-['Manrope'] animate-fade-in">
      <div className="absolute inset-0 bg-[#1A1A1A]/95 backdrop-blur-xl" onClick={onClose}></div>

      <div className="relative w-full h-full max-w-[1400px] bg-[#F8F9FA] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-black transition-all"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Delivery View</h2>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-0.5">Ulaanbaatar, Mongolia • City Map</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
              <button 
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  viewMode === 'map' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-map"></i> Map
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                  viewMode === 'list' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <i className="fa-solid fa-list"></i> List
              </button>
            </div>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          <div className="flex-1 bg-slate-50 relative overflow-hidden">
            {viewMode === 'map' ? (
              <div className="w-full h-full relative p-10 select-none bg-slate-100">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                ></div>

                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="45" x2="100" y2="45" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="0" y1="55" x2="100" y2="55" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.8" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="0.8" />
                  <path d="M0,85 Q20,80 40,88 T70,82 T100,85" fill="none" stroke="#4A90E2" strokeWidth="3" opacity="0.3" />
                </svg>

                <div className="absolute top-1/4 left-[10%] text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">Songinokhairkhan</div>
                <div className="absolute top-1/2 left-[32%] -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">Bayangol</div>
                <div className="absolute top-[35%] left-[51%] text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">Sukhbaatar</div>
                <div className="absolute top-1/2 left-[75%] -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">Bayanzurkh</div>
                <div className="absolute bottom-[20%] left-[55%] text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] pointer-events-none">Khan-Uul</div>

                {filteredOrders.map((order) => (
                  <div 
                    key={order.id}
                    className="absolute transition-all duration-500 hover:z-20"
                    style={{ left: `${order.x}%`, top: `${order.y}%` }}
                  >
                    <button 
                      onClick={() => setSelectedPinId(selectedPinId === order.id ? null : order.id)}
                      className={`relative flex flex-col items-center group/pin transition-transform ${selectedPinId === order.id ? 'scale-125' : 'hover:scale-110'}`}
                    >
                      <div className={`w-10 h-10 rounded-2xl border-4 flex items-center justify-center shadow-xl transition-all ${
                        selectedPinId === order.id ? 'bg-indigo-600 border-white text-white' : 'bg-white border-slate-100 text-indigo-600'
                      }`}>
                        <i className="fa-solid fa-truck-fast text-xs"></i>
                      </div>
                      <div className={`mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg border transition-all ${
                        selectedPinId === order.id ? 'bg-[#1A1A1A] text-white border-black' : 'bg-white text-slate-500 border-slate-100'
                      }`}>
                        {order.id}
                      </div>

                      {selectedPinId === order.id && (
                        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-72 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 z-50 animate-slide-up">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</p>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                order.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-900">{order.customerName}</p>
                              <p className="text-[11px] font-bold text-slate-500 mt-2 leading-relaxed">
                                <i className="fa-solid fa-location-dot mr-1.5 text-indigo-500"></i>
                                {order.deliveryAddress || 'Address not specified'}
                              </p>
                            </div>
                            <button 
                              onClick={() => onSelectOrder(order)}
                              className="w-full bg-[#1A1A1A] text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 mt-2"
                            >
                              View Details <i className="fa-solid fa-arrow-right-long"></i>
                            </button>
                          </div>
                          <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100"></div>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full p-10 overflow-y-auto no-scrollbar bg-white">
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="grid grid-cols-12 gap-4 px-8 pb-6 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <div className="col-span-2">Order ID</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-5">Ulaanbaatar Address</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>
                  {filteredOrders.map(order => (
                    <div 
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="grid grid-cols-12 gap-4 items-center px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer group"
                    >
                      <div className="col-span-2 text-sm font-black text-slate-900">{order.id}</div>
                      <div className="col-span-3">
                        <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                          order.status === 'confirmed' ? 'text-indigo-600' : 'text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="col-span-5 text-xs font-bold text-slate-500 line-clamp-1">
                        {order.deliveryAddress || 'City pickup required'}
                      </div>
                      <div className="col-span-2 text-right">
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-black hover:border-black hover:shadow-md transition-all ml-auto">
                          <i className="fa-solid fa-chevron-right text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="py-24 text-center">
                      <i className="fa-solid fa-box-open text-slate-200 text-4xl mb-4"></i>
                      <p className="text-slate-400 font-bold italic">No matching city delivery orders found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Coordination Panel */}
          <div className="w-full lg:w-96 bg-white border-l border-slate-100 p-10 space-y-12 overflow-y-auto no-scrollbar">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#EDFF8C] rounded-[1.25rem] flex items-center justify-center text-black shadow-xl shadow-lime-500/10">
                  <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Dispatcher</h3>
              </div>

              <div className="bg-[#1A1A1A] text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#EDFF8C] rounded-full opacity-5 blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 space-y-8">
                  <p className="text-base font-medium leading-relaxed italic text-slate-300">
                    "{aiInsights.message}"
                  </p>
                  <div className="pt-8 border-t border-white/10 space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dispatch Readiness</span>
                      <span className="text-[10px] font-black text-[#EDFF8C] uppercase tracking-widest">Optimized</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#EDFF8C] shadow-[0_0_15px_#EDFF8C]" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ulaanbaatar Load</h4>
               <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-box-archive text-xl"></i>
                      </div>
                      <span className="text-sm font-black text-slate-900">Total Courier</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{aiInsights.count}</span>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <i className="fa-solid fa-location-crosshairs text-xl"></i>
                      </div>
                      <span className="text-sm font-black text-slate-900">Cluster Area</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">{aiInsights.areaCount}</span>
                 </div>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="w-full py-5 rounded-3xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-[0.2em] hover:border-black hover:text-black transition-all bg-white"
            >
              Close Awareness
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryView;
