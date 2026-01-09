import React, { useState, useMemo } from 'react';
import { StoreInfo, Product } from '../types';

interface StorefrontViewProps {
  store: StoreInfo;
  products: Product[];
  onExit: () => void;
}

const StorefrontView: React.FC<StorefrontViewProps> = ({ store, products, onExit }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Reset variants
    const initialVariants: Record<string, string> = {};
    if (product.options) {
      product.options.forEach(opt => {
        initialVariants[opt.name] = opt.values[0];
      });
    }
    setSelectedVariant(initialVariants);
  };

  const handleVariantChange = (optionName: string, value: string) => {
    setSelectedVariant(prev => ({ ...prev, [optionName]: value }));
  };

  const handleChatAction = (action: 'buy' | 'ask') => {
    if (!selectedProduct) return;
    
    let message = action === 'buy' 
      ? `Hi! I want to buy ${selectedProduct.name}`
      : `Hi! I have a question about ${selectedProduct.name}`;

    const variants = Object.entries(selectedVariant)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
    
    if (variants) message += ` (${variants})`;

    // Simulate opening chat
    alert(`[Opening ${store.connectedChannels.instagram ? 'Instagram' : 'Facebook'}]\n\nContext Message:\n"${message}"`);
  };

  const finalPrice = (product: Product) => {
    if (!product.discount) return product.price;
    if (product.discount.type === 'percentage') {
      return product.price * (1 - product.discount.value / 100);
    }
    return product.discount.value;
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-100 flex justify-center items-start overflow-hidden font-['Manrope']">
      
      {/* Mobile Device Simulator Container */}
      <div className="w-full h-full sm:max-w-[420px] bg-white sm:my-8 sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] sm:border-[#1A1A1A]">
        
        {/* Header */}
        <div className="px-6 pt-12 pb-4 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {store.logo && (
              <img src={store.logo} alt={store.name} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
            )}
            <div>
              <h1 className="text-base font-black text-slate-900 leading-none">{store.name}</h1>
              <div className="flex items-center gap-1 mt-1">
                <i className="fa-solid fa-circle-check text-blue-500 text-[10px]"></i>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Seller</span>
              </div>
            </div>
          </div>
          <button onClick={onExit} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          
          {/* Categories */}
          <div className="px-6 py-6 overflow-x-auto no-scrollbar flex gap-3 sticky top-0 z-10 bg-white">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#1A1A1A] text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="px-6 grid grid-cols-2 gap-4 pb-10">
            {filteredProducts.map(product => {
              const price = finalPrice(product);
              return (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                      </div>
                    )}
                    {product.discount && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{price.toLocaleString()}₮</span>
                        {product.discount && (
                          <span className="text-[10px] text-slate-400 line-through decoration-slate-300 font-medium">{product.price.toLocaleString()}₮</span>
                        )}
                      </div>
                      <button className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center shadow-md">
                        <i className="fa-regular fa-comment-dots text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Footer */}
          <div className="px-10 py-8 text-center border-t border-slate-100 bg-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Powered by Storex</p>
            <div className="flex justify-center gap-4 opacity-30 grayscale">
              <i className="fa-brands fa-cc-visa text-2xl"></i>
              <i className="fa-solid fa-building-columns text-2xl"></i>
              <i className="fa-solid fa-truck-fast text-2xl"></i>
            </div>
          </div>
        </div>

        {/* Product Detail Overlay */}
        {selectedProduct && (
          <div className="absolute inset-0 z-30 bg-white flex flex-col animate-slide-up">
            <div className="relative flex-1 overflow-y-auto no-scrollbar">
              
              {/* Image Header */}
              <div className="relative aspect-square bg-slate-100">
                <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-white/40 transition-all"
                >
                  <i className="fa-solid fa-chevron-down text-sm"></i>
                </button>
                <div className="absolute bottom-6 left-6">
                  {selectedProduct.availabilityType === 'ready' ? (
                    <span className="px-3 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Ready to Ship
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Pre-order ({selectedProduct.deliveryDays} days)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-8 pb-32">
                
                {/* Title & Price */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-medium text-slate-900">{finalPrice(selectedProduct).toLocaleString()}₮</span>
                    {selectedProduct.discount && (
                      <span className="text-base text-slate-400 line-through decoration-slate-300">{selectedProduct.price.toLocaleString()}₮</span>
                    )}
                  </div>
                </div>

                {/* Variants */}
                {selectedProduct.options && selectedProduct.options.length > 0 && (
                  <div className="space-y-6">
                    {selectedProduct.options.map(opt => (
                      <div key={opt.name} className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opt.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map(val => (
                            <button
                              key={val}
                              onClick={() => handleVariantChange(opt.name, val)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                selectedVariant[opt.name] === val
                                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-lg'
                                  : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                    {selectedProduct.description || "No description available."}
                  </p>
                </div>

                {/* Delivery */}
                <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                      <i className="fa-solid fa-truck-fast text-xs"></i>
                    </div>
                    <span className="text-xs font-bold">Delivery within 24-48 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                      <i className="fa-solid fa-shield-halved text-xs"></i>
                    </div>
                    <span className="text-xs font-bold">Verified Secure Payment</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="p-6 bg-white border-t border-slate-100 flex gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => handleChatAction('ask')}
                className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all"
              >
                Ask Question
              </button>
              <button 
                onClick={() => handleChatAction('buy')}
                className="flex-[2] py-4 bg-[#1A1A1A] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-regular fa-comment-dots text-sm"></i>
                Chat to Buy
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StorefrontView;