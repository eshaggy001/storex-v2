import React, { useRef, useState, useMemo } from 'react';
import { Product, ProductCategory, ProductOption } from '../../types';
import InlineAIButton from './InlineAIButton';

interface ProductEditorProps {
    formData: any;
    setFormData: (data: any) => void;
    onSave: () => void;
    onCancel: () => void;
    onAIFieldOptimize: (field: string) => void;
    isImprovingField: string | null;
}

const CATEGORY_OPTIONS: ProductCategory[] = ["Apparel", "Food & Beverage", "Beauty & Personal Care", "Electronics", "Services", "Other"];

const ProductEditor: React.FC<ProductEditorProps> = ({
    formData,
    setFormData,
    onSave,
    onCancel,
    onAIFieldOptimize,
    isImprovingField
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newOptionName, setNewOptionName] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setFormData({ ...formData, images: [...formData.images, reader.result as string] });
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (idx: number) => {
        setFormData({ ...formData, images: formData.images.filter((_: any, i: number) => i !== idx) });
    };

    const toggleDeliveryMethod = (method: 'courier' | 'pickup') => {
        const exists = formData.deliveryOptions.includes(method);
        let newMethods = [...formData.deliveryOptions];
        if (exists) {
            if (newMethods.length > 1) {
                newMethods = newMethods.filter(m => m !== method);
            }
        } else {
            newMethods.push(method);
        }
        setFormData({ ...formData, deliveryOptions: newMethods });
    };

    const addOptionValue = (index: number, value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        const newOptions = JSON.parse(JSON.stringify(formData.options));
        if (!newOptions[index].values.includes(trimmed)) {
            newOptions[index].values.push(trimmed);
            setFormData({ ...formData, options: newOptions });
        }
    };

    const removeOptionValue = (optIndex: number, valIndex: number) => {
        const newOptions = JSON.parse(JSON.stringify(formData.options));
        newOptions[optIndex].values.splice(valIndex, 1);
        setFormData({ ...formData, options: newOptions });
    };

    const handleAddOption = () => {
        const trimmed = newOptionName.trim();
        if (!trimmed) return;
        setFormData({
            ...formData,
            options: [...formData.options, { name: trimmed, values: [] }]
        });
        setNewOptionName('');
    };

    // Calculate combinations for variant stock
    const combinations = useMemo(() => {
        if (!formData.options || formData.options.length === 0) return [];

        // Only include options that have values
        const validOptions = formData.options.filter((o: any) => o.values && o.values.length > 0);
        if (validOptions.length === 0) return [];

        let result: any[] = [{}];
        validOptions.forEach((opt: ProductOption) => {
            const temp: any[] = [];
            opt.values.forEach(val => {
                result.forEach(prev => {
                    temp.push({ ...prev, [opt.name]: val });
                });
            });
            result = temp;
        });

        return result;
    }, [formData.options]);

    const handleVariantStockChange = (key: string, value: string) => {
        const newVariants = { ...formData.variants };
        newVariants[key] = parseInt(value) || 0;
        setFormData({ ...formData, variants: newVariants });
    };

    return (
        <div className="space-y-12 animate-slide-up pb-48">
            {/* Visuals Card */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Product Gallery</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {formData.images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 relative group transition-all hover:border-slate-300 shadow-sm">
                            <img src={img} className="w-full h-full object-cover" alt={`Edit ${idx}`} />
                            <button
                                onClick={() => removeImage(idx)}
                                className="absolute top-2 right-2 w-7 h-7 bg-rose-500/90 backdrop-blur-sm text-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-90"
                            >
                                <i className="fa-solid fa-trash-can text-[10px]"></i>
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-[#EDFF8C] hover:text-slate-600 transition-all hover:bg-slate-50 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-[#EDFF8C] transition-colors">
                            <i className="fa-solid fa-plus text-lg"></i>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Add Image</span>
                    </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Identity & Description Bento */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft space-y-8 relative overflow-hidden">
                    {/* Full AI Redesign Trigger inside Editor */}
                    <div className="absolute top-0 right-0 p-8">
                        <button
                            type="button"
                            onClick={() => onAIFieldOptimize('full')}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold text-[9px] uppercase tracking-widest hover:text-slate-900 hover:border-[#EDFF8C] hover:bg-[#EDFF8C]/10 transition-all group shadow-sm"
                        >
                            <i className="fa-solid fa-wand-magic-sparkles group-hover:animate-bounce-slow text-[#EDFF8C]"></i>
                            AI Enhancement
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[#EDFF8C] shadow-lg">
                            <i className="fa-solid fa-info text-[10px]"></i>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Identity</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-slate-900">Product Name</label>
                                <InlineAIButton
                                    onClick={() => onAIFieldOptimize('name')}
                                    isLoading={isImprovingField === 'name'}
                                    tooltip="Suggest catchy name"
                                />
                            </div>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-[#EDFF8C] focus:bg-white transition-all placeholder:text-slate-300"
                                placeholder="Enter product name..."
                            />
                        </div>

                        <div className="relative group">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3 transition-colors group-focus-within:text-slate-900">Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-[#EDFF8C] focus:bg-white transition-all cursor-pointer appearance-none shadow-sm"
                                >
                                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                                    <i className="fa-solid fa-chevron-down text-xs"></i>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-slate-900">Description</label>
                                <InlineAIButton
                                    onClick={() => onAIFieldOptimize('description')}
                                    isLoading={isImprovingField === 'description'}
                                    tooltip="Improve with AI"
                                />
                            </div>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={5}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:border-[#EDFF8C] focus:bg-white transition-all resize-none placeholder:text-slate-300 leading-relaxed shadow-sm"
                                placeholder="Describe your product..."
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Discounts Bento */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-400 flex items-center justify-center text-white shadow-lg">
                            <i className="fa-solid fa-tag text-[10px]"></i>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Pricing</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="relative">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-3">Base Price (₮)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold text-3xl text-slate-900 outline-none focus:border-orange-200 focus:bg-white transition-all shadow-sm"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">MNT</div>
                                </div>
                            </div>

                            <div className={`p-8 rounded-3xl border transition-all duration-500 ${formData.applyDiscount ? 'bg-orange-50/50 border-orange-100' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] ${formData.applyDiscount ? 'bg-orange-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <i className="fa-solid fa-percent"></i>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className={`text-[11px] font-bold uppercase tracking-widest block ${formData.applyDiscount ? 'text-orange-600' : 'text-slate-400'}`}>Promotional Discount</span>
                                            <span className="text-[9px] text-slate-400 font-medium">Limited time offer pricing</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, applyDiscount: !formData.applyDiscount })}
                                        className={`w-12 h-6 rounded-full relative p-1 transition-colors duration-300 ${formData.applyDiscount ? 'bg-orange-400' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.applyDiscount ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                {formData.applyDiscount && (
                                    <div className="grid grid-cols-2 gap-4 animate-slide-up">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-orange-400 uppercase tracking-widest ml-1">Type</label>
                                            <select
                                                value={formData.discountType}
                                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                                className="w-full h-12 bg-white border border-orange-100 rounded-xl px-4 text-[11px] font-bold text-orange-900 outline-none focus:border-orange-500 transition-all shadow-sm"
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="sale_price">Fixed Sale Price</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold text-orange-400 uppercase tracking-widest ml-1">
                                                {formData.discountType === 'percentage' ? 'Value (%)' : 'Price (₮)'}
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.discountValue}
                                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                                className="w-full h-12 bg-white border border-orange-100 rounded-xl px-4 font-bold text-orange-900 outline-none focus:border-orange-500 shadow-sm"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory & Fulfillment Bento */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                            <i className="fa-solid fa-box text-[10px]"></i>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Inventory Management</h3>
                    </div>

                    <div className="space-y-10">
                        {/* Improved Inventory Layout */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Availability Logic</label>
                                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-full shadow-inner">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, availabilityType: 'ready' })}
                                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.availabilityType === 'ready' ? 'bg-white text-indigo-600 shadow-md border border-slate-100 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Ready Stock
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, availabilityType: 'made_to_order' })}
                                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${formData.availabilityType === 'made_to_order' ? 'bg-white text-indigo-600 shadow-md border border-slate-100 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Made to Order
                                    </button>
                                </div>
                            </div>

                            {formData.availabilityType === 'made_to_order' ? (
                                <div className="space-y-4 animate-slide-up p-6 bg-indigo-50/30 rounded-3xl border border-indigo-100/50">
                                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Production Lead Time</label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative group flex-1 max-w-[200px]">
                                            <input
                                                type="number"
                                                value={formData.deliveryDays}
                                                onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                                                className="w-full h-14 bg-white border border-indigo-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-indigo-400 transition-all shadow-sm"
                                                placeholder="3"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">DAYS</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium italic">Customers will see this as estimated preparation time.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100/50 transition-all">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Stock Level</label>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="relative flex-1 max-w-[150px]">
                                            <input
                                                type="number"
                                                disabled={formData.isUnlimited}
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-indigo-300 transition-all disabled:opacity-30 shadow-sm"
                                                placeholder="0"
                                            />
                                            {!formData.isUnlimited && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-200">PCS</span>}
                                        </div>
                                        <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isUnlimited: !formData.isUnlimited })}
                                            className={`flex-1 min-w-[140px] h-14 rounded-2xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${formData.isUnlimited ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <i className="fa-solid fa-infinity mr-2"></i>
                                            Unlimited
                                        </button>
                                    </div>
                                    {combinations.length > 0 && (
                                        <div className="mt-4 flex items-center gap-2 text-indigo-500 bg-indigo-50 p-3 rounded-xl border border-indigo-100/50">
                                            <i className="fa-solid fa-circle-info text-xs"></i>
                                            <p className="text-[9px] font-bold uppercase tracking-tight">Per-variant stock enabled below</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-50">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">Fulfillment Options</label>
                            <div className="flex flex-wrap gap-4">
                                {(['courier', 'pickup'] as const).map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => toggleDeliveryMethod(m)}
                                        className={`flex-1 flex items-center justify-center gap-4 py-4 rounded-2xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${formData.deliveryOptions.includes(m) ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                            }`}
                                    >
                                        <i className={`fa-solid ${m === 'courier' ? 'fa-truck-fast' : 'fa-shop'} text-[10px]`}></i>
                                        {m === 'courier' ? 'Standard Delivery' : 'Store Pickup'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Variants Bento */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[#EDFF8C] shadow-lg">
                            <i className="fa-solid fa-layer-group text-[10px]"></i>
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Options & Variants</h3>
                    </div>

                    <div className="space-y-10">
                        {/* Define Options */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                <input
                                    type="text"
                                    value={newOptionName}
                                    onChange={(e) => setNewOptionName(e.target.value)}
                                    placeholder="Option Name (e.g. Color)"
                                    className="flex-1 h-12 bg-white border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 outline-none focus:border-[#EDFF8C]"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddOption();
                                        }
                                    }}
                                />
                                <button
                                    onClick={handleAddOption}
                                    className="px-6 h-12 bg-slate-900 text-[#EDFF8C] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                                >
                                    Add
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {formData.options.map((opt: ProductOption, optIdx: number) => (
                                    <div key={optIdx} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6 relative group hover:border-[#EDFF8C] transition-all">
                                        <button
                                            onClick={() => {
                                                const newOps = JSON.parse(JSON.stringify(formData.options));
                                                newOps.splice(optIdx, 1);
                                                setFormData({ ...formData, options: newOps });
                                            }}
                                            className="absolute top-4 right-4 text-slate-200 hover:text-rose-500 transition-colors"
                                        >
                                            <i className="fa-solid fa-circle-xmark text-lg"></i>
                                        </button>

                                        <div className="space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dimension</p>
                                            <p className="text-sm font-black text-slate-900">{opt.name}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-wrap gap-2">
                                                {opt.values.map((v, valIdx) => (
                                                    <div key={valIdx} className="group/val relative animate-scale-in">
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl shadow-sm transition-all group-hover/val:bg-rose-50 group-hover/val:border-rose-100">
                                                            <span className="text-xs font-bold text-slate-700">{v}</span>
                                                            <button
                                                                onClick={() => removeOptionValue(optIdx, valIdx)}
                                                                className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white transition-all transform hover:rotate-90"
                                                            >
                                                                <i className="fa-solid fa-xmark text-[8px]"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Add value..."
                                                        className="w-32 h-9 bg-slate-50/50 border border-dashed border-slate-300 rounded-xl px-3 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white focus:w-48 transition-all"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addOptionValue(optIdx, (e.target as HTMLInputElement).value);
                                                                (e.target as HTMLInputElement).value = '';
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Variant Stock Matrix */}
                        {combinations.length > 0 && (
                            <div className="pt-8 border-t border-slate-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Stock Allocation</h4>
                                        <p className="text-[9px] text-slate-400 font-medium italic">Define availability per combination</p>
                                    </div>
                                    <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                                        <span className="text-[9px] font-bold text-indigo-600 uppercase">{combinations.length} Variants</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {combinations.map((comb, i) => {
                                        const key = Object.values(comb).join('-');
                                        const label = Object.values(comb).join(' / ');
                                        return (
                                            <div key={i} className="group flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all hover:shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform"></div>
                                                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{label}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest group-hover:text-indigo-300 transition-colors">SET STOCK</span>
                                                    <input
                                                        type="number"
                                                        value={formData.variants[key] || 0}
                                                        onChange={(e) => handleVariantStockChange(key, e.target.value)}
                                                        className="w-24 h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-400 shadow-sm"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fixed Action Bar - Redesigned for zero overlap and premium feel */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50/90 via-slate-50/50 to-transparent pointer-events-none z-[90]"></div>
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[100] animate-bounce-in-up">
                <div className="bg-slate-900/95 backdrop-blur-2xl p-2.5 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-8 h-14 rounded-[1.4rem] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all active:scale-95"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 h-14 rounded-[1.4rem] bg-[#EDFF8C] text-slate-900 font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#EDFF8C]/10 flex items-center justify-center gap-3"
                    >
                        <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                        Sync & Save Product
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductEditor;
