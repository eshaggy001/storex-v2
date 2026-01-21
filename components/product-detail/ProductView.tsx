import React from 'react';
import { Product } from '../../types';

interface ProductViewProps {
    product: Product;
    onToggleStatus: () => void;
    mainImage: string;
    setMainImage: (img: string) => void;
    onFullAIImprove: () => void;
    isImprovingFull: boolean;
}

const ProductView: React.FC<ProductViewProps> = ({ product, onToggleStatus, mainImage, setMainImage, onFullAIImprove, isImprovingFull }) => {
    const currentFinalPrice = (() => {
        if (!product.discount) return product.price;
        if (product.discount.type === 'percentage') {
            return product.price * (1 - product.discount.value / 100);
        }
        return product.discount.value;
    })();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 animate-fade-in relative">
            {/* AI Floating Suggestion Trigger (Mobile/Small screens) */}
            <button
                onClick={onFullAIImprove}
                disabled={isImprovingFull}
                className="lg:hidden absolute -top-4 right-0 w-12 h-12 bg-slate-900 text-[#EDFF8C] rounded-full shadow-2xl flex items-center justify-center z-10 active:scale-90 transition-all border border-white/10"
            >
                <i className={`fa-solid ${isImprovingFull ? 'fa-sparkles animate-spin' : 'fa-wand-magic-sparkles'}`}></i>
            </button>

            {/* Left Column: Visuals */}
            <div className="lg:col-span-2 space-y-6">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl bg-white relative group">
                    <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 ${product.status === 'ACTIVE' ? 'bg-emerald-50/90 text-emerald-800' : 'bg-slate-500/90 text-white'
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${product.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                            {product.status}
                        </span>
                        {product.discount && (
                            <span className="bg-rose-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                On Sale
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    {product.images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 active:scale-95 ${img === mainImage ? 'border-slate-900 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Info Bento */}
            <div className="lg:col-span-3 space-y-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft space-y-10 relative overflow-hidden">
                    {/* Decorative Background AI Element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#EDFF8C]/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Product Identity
                                {isImprovingFull && <span className="flex h-1.5 w-1.5 rounded-full bg-[#EDFF8C] animate-ping"></span>}
                            </p>
                            <h2 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight">{product.name}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-[#EDFF8C] text-[10px] font-bold uppercase tracking-widest border border-slate-800 shadow-sm">
                                    {product.category}
                                </span>
                                {product.options && product.options.map((opt, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-xl bg-white text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                                        {opt.name}: {opt.values.length} options
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            <button
                                onClick={onToggleStatus}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${product.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                    }`}
                            >
                                Set {product.status === 'ACTIVE' ? 'Inactive' : 'Active'}
                            </button>
                            <button
                                onClick={onFullAIImprove}
                                disabled={isImprovingFull}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-[#EDFF8C] hover:bg-[#EDFF8C]/10 transition-all font-bold text-[10px] uppercase tracking-widest group"
                            >
                                <i className={`fa-solid ${isImprovingFull ? 'fa-sparkles animate-spin' : 'fa-wand-magic-sparkles group-hover:animate-bounce-slow text-[#EDFF8C]'}`}></i>
                                AI Improve
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retail Price</p>
                            <div className="flex flex-col">
                                {product.discount ? (
                                    <div className="space-y-1">
                                        <p className="text-4xl font-bold text-slate-900 tracking-tighter">
                                            {currentFinalPrice.toLocaleString()}₮
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-400 line-through italic">{product.price.toLocaleString()}₮</p>
                                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                                                {product.discount.type === 'percentage' ? `-${product.discount.value}%` : 'PROMO'}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-4xl font-bold text-slate-900 tracking-tighter">
                                        {product.price.toLocaleString()}₮
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Status</p>
                            <p className="text-4xl font-bold text-slate-900 tracking-tighter">
                                {product.stock === 'unlimited' ? '∞' : product.stock}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-50 pt-8">
                        <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fulfillment</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                                        <i className="fa-solid fa-clock text-[10px]"></i>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">
                                        {product.availabilityType === 'ready' ? 'Ready to ship' : `Made to order (${product.deliveryDays} days)`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm">
                                        <i className="fa-solid fa-truck text-[10px]"></i>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900">
                                        {product.deliveryOptions.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' & ')} available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {product.options && product.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-50">
                            {product.options.map((opt, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">{opt.name} Options</p>
                                    <div className="flex flex-wrap gap-2">
                                        {opt.values.map((v, i) => (
                                            <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 shadow-sm">{v}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Details</p>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                            "{product.description || 'No detailed description available for this product.'}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
