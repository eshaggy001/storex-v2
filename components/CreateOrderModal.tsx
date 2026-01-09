
import React, { useState, useMemo } from 'react';
import { Product, Order, StoreInfo } from '../types';

interface CreateOrderModalProps {
  products: Product[];
  store: StoreInfo;
  onClose: () => void;
  onCreate: (order: Partial<Order>) => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ products, store, onClose, onCreate }) => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ productId: string; quantity: number }[]>([]);
  
  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'pickup' | 'none'>(
    store.fulfillment.deliveryTypes[0] || 'pickup'
  );
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bank_transfer' | 'online' | 'qpay' | 'afterpay'>(
    store.fulfillment.paymentMethods[0] || 'qpay'
  );
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'paid'>('unpaid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const total = useMemo(() => {
    return selectedItems.reduce((acc, item) => {
      const p = products.find(prod => prod.id === item.productId);
      const price = p ? (p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price) : 0;
      return acc + (price * item.quantity);
    }, 0);
  }, [selectedItems, products]);

  const toggleItem = (productId: string) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.productId === productId);
      if (exists) {
        return prev.filter(i => i.productId !== productId);
      } else {
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setSelectedItems(prev => prev.map(i => {
      if (i.productId === productId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || selectedItems.length === 0) return;

    const newOrder: Partial<Order> = {
      customerName,
      phoneNumber,
      items: selectedItems,
      total,
      deliveryMethod: deliveryMethod === 'none' ? 'pickup' : deliveryMethod,
      deliveryAddress: deliveryMethod === 'courier' ? deliveryAddress : '',
      paymentMethod,
      paymentStatus,
      status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      isAiGenerated: false,
      channel: 'web', 
      createdAt: new Date().toISOString()
    };

    onCreate(newOrder);
    onClose();
  };

  const getPaymentLabel = (method: string) => {
    if (method === 'afterpay') {
      const providers = store.fulfillment.afterpayProviders || [];
      if (providers.length > 0) {
        // Capitalize names
        const names = providers.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
        return `Afterpay (${names})`;
      }
      return 'Afterpay';
    }
    const labels: Record<string, string> = {
      cash_on_delivery: 'COD (Legacy)',
      bank_transfer: 'Bank Transfer (Legacy)',
      online: 'Online (Legacy)',
      qpay: 'QPAY'
    };
    return labels[method] || method;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in font-['Manrope']">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Manual Order</h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-0.5">Create a new order fallback entry</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-10">
              <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Customer Name</label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Bat-Orshikh"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 99112233"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold transition-all"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment & Payment</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-3">Delivery Type</label>
                    <div className="flex gap-3">
                      {store.fulfillment.deliveryTypes.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setDeliveryMethod(m)}
                          className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            deliveryMethod === m ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {deliveryMethod === 'courier' && (
                    <div className="animate-fade-in">
                      <label className="block text-xs font-bold text-slate-700 mb-2">Delivery Address</label>
                      <textarea 
                        required
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        placeholder="District, Street, Gate, Apartment info..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold h-24 resize-none transition-all"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-3">Payment Status</label>
                      <div className="flex bg-slate-50 p-1 rounded-xl">
                        {(['unpaid', 'paid'] as const).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setPaymentStatus(s)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                              paymentStatus === s ? 'bg-white text-black shadow-sm' : 'text-slate-400'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-3">Payment Method</label>
                      <select 
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value as any)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-black font-black text-[10px] uppercase tracking-widest"
                      >
                        {store.fulfillment.paymentMethods.map(pm => (
                          <option key={pm} value={pm}>{getPaymentLabel(pm)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Products</h3>
              
              <div className="relative mb-4">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input 
                  type="text" 
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold text-sm"
                />
              </div>

              <div className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white max-h-[500px] flex flex-col">
                <div className="overflow-y-auto p-4 space-y-2 no-scrollbar flex-1">
                  {filteredProducts.map(p => {
                    const isSelected = selectedItems.find(i => i.productId === p.id);
                    const finalPrice = p.discount ? (p.discount.type === 'percentage' ? p.price * (1 - p.discount.value/100) : p.discount.value) : p.price;
                    
                    return (
                      <div 
                        key={p.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                          isSelected ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'
                        }`}
                        onClick={() => toggleItem(p.id)}
                      >
                        <div className="flex items-center gap-4">
                          <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                          <div>
                            <p className="text-sm font-black text-slate-900">{p.name}</p>
                            <p className="text-xs font-bold text-indigo-600">{finalPrice.toLocaleString()}₮</p>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="flex items-center gap-3 bg-white p-1 rounded-xl shadow-sm border border-indigo-100" onClick={e => e.stopPropagation()}>
                            <button 
                              type="button"
                              onClick={() => updateQty(p.id, -1)}
                              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-black transition-all"
                            >
                              <i className="fa-solid fa-minus text-[10px]"></i>
                            </button>
                            <span className="text-xs font-black text-slate-900 w-4 text-center">{isSelected.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQty(p.id, 1)}
                              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-black transition-all"
                            >
                              <i className="fa-solid fa-plus text-[10px]"></i>
                            </button>
                          </div>
                        ) : (
                          <i className="fa-solid fa-circle-plus text-slate-200 text-xl group-hover:text-indigo-500"></i>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-[#1A1A1A] text-white p-8 rounded-[2rem] flex justify-between items-center shadow-2xl">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Total</p>
                  <p className="text-3xl font-black text-[#EDFF8C] tracking-tighter">{total.toLocaleString()}₮</p>
                </div>
                <button 
                  type="submit"
                  disabled={selectedItems.length === 0 || !customerName || !phoneNumber}
                  className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#EDFF8C] transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;