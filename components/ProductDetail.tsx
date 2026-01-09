import React, { useState, useMemo, useRef } from 'react';
import { Product, ProductOption } from '../types';
import { generateProductImprovements } from '../services/geminiService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onUpdate: (updates: Partial<Product>) => void;
  onEditWithAi: () => void;
}

interface AISuggestions {
  description: string;
  seoTitle: string;
  seoDescription: string;
  productType: string;
  tags: string[];
}

const CATEGORY_OPTIONS = ["Apparel", "Food & Beverage", "Beauty & Personal Care", "Electronics", "Services", "Other"] as const;

const CATEGORY_VARIANT_SUGGESTIONS: Record<string, string[]> = {
  "Apparel": ["Size", "Color", "Material"],
  "Food & Beverage": ["Size", "Flavor", "Packaging"],
  "Beauty & Personal Care": ["Size", "Skin type", "Color"],
  "Electronics": ["Storage", "Color", "Model"],
  "Services": ["Duration", "Tier", "Level"],
  "Other": ["Size", "Color", "Type"]
};

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onUpdate, onEditWithAi }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [appliedFields, setAppliedFields] = useState<Set<string>>(new Set());
  const [showTooltip, setShowTooltip] = useState(false);
  
  const [isAddingVariants, setIsAddingVariants] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [tempOptionName, setTempOptionName] = useState('');
  const [tempOptionValues, setTempOptionValues] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || '',
    category: product.category || 'Apparel',
    price: product.price.toString(),
    stock: product.stock === 'unlimited' ? '' : product.stock.toString(),
    isUnlimited: product.stock === 'unlimited',
    status: product.status,
    availabilityType: product.availabilityType || 'ready',
    deliveryDays: (product.deliveryDays || 3).toString(),
    images: [...product.images],
    applyDiscount: !!product.discount,
    discountType: product.discount?.type || 'percentage',
    discountValue: product.discount?.value.toString() || '',
    deliveryOptions: product.deliveryOptions || ['courier'],
    options: product.options || []
  });

  const [pendingCategory, setPendingCategory] = useState<typeof CATEGORY_OPTIONS[number] | null>(null);
  const [mainImage, setMainImage] = useState(product.images[0]);

  const finalPricePreview = useMemo(() => {
    const originalPrice = parseFloat(formData.price) || 0;
    if (!formData.applyDiscount || !formData.discountValue) return originalPrice;
    
    const val = parseFloat(formData.discountValue) || 0;
    if (formData.discountType === 'percentage') {
      const discountAmount = originalPrice * (Math.min(Math.max(val, 0), 100) / 100);
      return Math.max(0, originalPrice - discountAmount);
    } else {
      return Math.max(0, val);
    }
  }, [formData.price, formData.applyDiscount, formData.discountType, formData.discountValue]);

  const variantCount = useMemo(() => {
    if (!formData.options || formData.options.length === 0) return 0;
    return formData.options.reduce((acc, opt) => acc * (opt.values.length || 1), 1);
  }, [formData.options]);

  const handleSave = () => {
    const originalPrice = parseFloat(formData.price) || 0;
    const updates: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      category: formData.category as any,
      price: originalPrice,
      stock: formData.availabilityType === 'ready' 
        ? (formData.isUnlimited ? 'unlimited' : (parseInt(formData.stock) || 0))
        : 0,
      status: formData.status,
      availabilityType: formData.availabilityType as 'ready' | 'made_to_order',
      deliveryDays: formData.availabilityType === 'made_to_order' ? parseInt(formData.deliveryDays) : undefined,
      images: formData.images,
      options: formData.options,
      deliveryOptions: formData.deliveryOptions
    };

    if (formData.applyDiscount && formData.discountValue) {
      let val = parseFloat(formData.discountValue);
      if (formData.discountType === 'percentage') {
        val = Math.min(Math.max(val, 1), 100);
      } else {
        val = Math.min(val, originalPrice);
      }
      updates.discount = {
        type: formData.discountType as 'sale_price' | 'percentage',
        value: val
      };
    } else {
      updates.discount = undefined;
    }

    onUpdate(updates);
    setIsEditing(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextVal = e.target.value as typeof CATEGORY_OPTIONS[number];
    if (nextVal !== formData.category) {
      setPendingCategory(nextVal);
    }
  };

  const confirmCategoryChange = () => {
    if (pendingCategory) {
      setFormData(prev => ({ ...prev, category: pendingCategory }));
      setPendingCategory(null);
    }
  };

  const handleImproveRequest = async () => {
    setIsImproving(true);
    try {
      const result = await generateProductImprovements(product);
      setSuggestions(result);
      setAppliedFields(new Set());
    } catch (err) {
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  const applySuggestion = (field: keyof AISuggestions, value: any) => {
    onUpdate({ [field]: value });
    setAppliedFields(prev => new Set(prev).add(field));
    if (field === 'description') {
      setFormData(prev => ({ ...prev, description: value }));
    }
  };

  const toggleStatus = () => {
    const newStatus = formData.status === 'active' ? 'inactive' : 'active';
    setFormData(prev => ({ ...prev, status: newStatus }));
    onUpdate({ status: newStatus });
  };

  const addOrUpdateOption = () => {
    if (!tempOptionName.trim() || !tempOptionValues.trim()) return;
    const values = tempOptionValues.split(',').map(v => v.trim()).filter(Boolean);
    if (values.length === 0) return;

    setFormData(prev => {
      const newOptions = [...prev.options];
      if (editingOptionIndex !== null) {
        newOptions[editingOptionIndex] = { name: tempOptionName, values };
      } else {
        newOptions.push({ name: tempOptionName, values });
      }
      return { ...prev, options: newOptions };
    });

    setTempOptionName('');
    setTempOptionValues('');
    setIsAddingVariants(false);
    setEditingOptionIndex(null);
  };

  const removeOption = (index: number) => {
    if (window.confirm("Are you sure you want to remove this option and all its values?")) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (idx: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleToggleDeliveryMethod = (method: 'courier' | 'pickup') => {
    setFormData(prev => {
      const exists = prev.deliveryOptions.includes(method);
      if (exists) {
        if (prev.deliveryOptions.length === 1) return prev;
        return { ...prev, deliveryOptions: prev.deliveryOptions.filter(m => m !== method) };
      }
      return { ...prev, deliveryOptions: [...prev.deliveryOptions, method] };
    });
  };

  const currentFinalPrice = useMemo(() => {
    if (!product.discount) return product.price;
    if (product.discount.type === 'percentage') {
      return product.price * (1 - product.discount.value / 100);
    }
    return product.discount.value;
  }, [product.price, product.discount]);

  const categorySuggestions = CATEGORY_VARIANT_SUGGESTIONS[formData.category] || CATEGORY_VARIANT_SUGGESTIONS["Other"];

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in font-['Manrope']">
      <div className="flex justify-between items-center mb-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Products
        </button>

        <div className="flex gap-4">
           <button 
            onClick={onEditWithAi}
            className="flex items-center gap-2 px-6 py-3 bg-[#EDFF8C]/10 text-slate-900 border border-[#EDFF8C] rounded-2xl font-bold text-sm hover:bg-[#EDFF8C] transition-all"
           >
             <i className="fa-solid fa-wand-magic-sparkles"></i>
             Edit with AI
           </button>
           <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
              isEditing ? 'bg-rose-500 text-white' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
            }`}
           >
             {isEditing ? 'Cancel' : 'Edit Manually'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg bg-white relative group">
            <img src={isEditing ? formData.images[0] : mainImage} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 ${
                formData.status === 'active' ? 'bg-emerald-50/90 text-emerald-800' : 'bg-slate-500/90 text-white'
              }`}>
                <span className={`w-2 h-2 rounded-full ${formData.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                {formData.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              {product.discount && !isEditing && (
                <span className="bg-rose-500 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  On Sale
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {(isEditing ? formData.images : product.images).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => !isEditing && setMainImage(img)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer relative transition-all group ${
                  (isEditing ? idx === 0 : img === mainImage) ? 'border-slate-900' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                {isEditing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="fa-solid fa-xmark text-[10px]"></i>
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-slate-400 hover:text-slate-500 transition-all"
              >
                <i className="fa-solid fa-plus text-lg"></i>
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Add Image</span>
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-8">
            {isEditing ? (
              <div className="space-y-8 animate-slide-up">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 transition-all resize-none placeholder:text-slate-300"
                  />
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Product Category (Required)</label>
                        {pendingCategory && (
                          <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-200 animate-fade-in shadow-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Confirm Change?</span>
                            <button onClick={confirmCategoryChange} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-black transition-all">Apply</button>
                            <button onClick={() => setPendingCategory(null)} className="text-slate-400 px-2 py-1 text-[9px] font-bold uppercase tracking-widest hover:text-black transition-all">Cancel</button>
                          </div>
                        )}
                      </div>
                      <select 
                        value={pendingCategory || formData.category}
                        onChange={handleCategoryChange}
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                   </div>
                </div>

                {/* DELIVERY & FULFILLMENT SECTION */}
                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                        <i className="fa-solid fa-truck-fast text-xs"></i>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Delivery & Fulfillment</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Availability Type</label>
                          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                             <button 
                              onClick={() => setFormData(prev => ({ ...prev, availabilityType: 'ready' }))}
                              className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.availabilityType === 'ready' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                             >
                               Ready to ship
                             </button>
                             <button 
                              onClick={() => setFormData(prev => ({ ...prev, availabilityType: 'made_to_order' }))}
                              className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.availabilityType === 'made_to_order' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'}`}
                             >
                               Made to order
                             </button>
                          </div>
                       </div>

                       {formData.availabilityType === 'made_to_order' && (
                         <div className="space-y-4 animate-slide-up">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Lead Time (Days)</label>
                            <input 
                              type="number"
                              value={formData.deliveryDays}
                              onChange={(e) => setFormData(prev => ({ ...prev, deliveryDays: e.target.value }))}
                              className="w-full h-12 bg-white border border-slate-200 rounded-xl px-5 font-bold text-slate-900 outline-none focus:border-indigo-500 shadow-sm"
                              placeholder="e.g. 7"
                            />
                         </div>
                       )}
                    </div>

                    <div className="space-y-4">
                       <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest ml-1">Delivery Methods</label>
                       <div className="flex flex-wrap gap-4">
                          {(['courier', 'pickup'] as const).map(m => (
                            <button 
                              key={m}
                              onClick={() => handleToggleDeliveryMethod(m)}
                              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-bold text-[11px] uppercase tracking-widest transition-all ${
                                formData.deliveryOptions.includes(m) ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <i className={`fa-solid ${m === 'courier' ? 'fa-truck' : 'fa-store'}`}></i>
                              {m}
                            </button>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Variants</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Add options like size or color.</p>
                    </div>
                    {!isAddingVariants && formData.options.length < 2 && (
                      <button 
                        onClick={() => setIsAddingVariants(true)}
                        className="h-10 px-6 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:border-slate-400 transition-all"
                      >
                        Add variants
                      </button>
                    )}
                  </div>

                  {formData.options.length > 0 && (
                    <div className="space-y-4">
                      {formData.options.map((opt, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{opt.name}</p>
                            <div className="flex flex-wrap gap-2">
                              {opt.values.map((v, vi) => (
                                <span key={vi} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700">{v}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <button 
                              onClick={() => {
                                setEditingOptionIndex(i);
                                setTempOptionName(opt.name);
                                setTempOptionValues(opt.values.join(', '));
                                setIsAddingVariants(true);
                              }}
                              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-black hover:bg-slate-100 transition-all flex items-center justify-center"
                             >
                               <i className="fa-solid fa-pen text-[10px]"></i>
                             </button>
                             <button 
                              onClick={() => removeOption(i)}
                              className="w-10 h-10 rounded-xl bg-slate-50 text-rose-300 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center"
                             >
                               <i className="fa-solid fa-trash-can text-[10px]"></i>
                             </button>
                          </div>
                        </div>
                      ))}

                      <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                          <i className="fa-solid fa-layer-group mr-2"></i>
                          This will create {variantCount} variants
                        </p>
                      </div>
                    </div>
                  )}

                  {isAddingVariants && (
                    <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 space-y-8 animate-slide-up shadow-xl">
                      <div>
                        <p className="text-xs font-bold text-slate-900 mb-4">What options does this product have?</p>
                        
                        <div className="space-y-6">
                           <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Option name</label>
                             <div className="flex flex-wrap gap-2 mb-4">
                                {categorySuggestions.map(s => (
                                  <button 
                                    key={s}
                                    type="button"
                                    onClick={() => setTempOptionName(s)}
                                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                      tempOptionName === s ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-200 hover:border-black'
                                    }`}
                                  >
                                    {s}
                                  </button>
                                ))}
                             </div>
                             <input 
                              type="text" 
                              value={tempOptionName}
                              onChange={(e) => setTempOptionName(e.target.value)}
                              placeholder="e.g. Size, Color, Flavor"
                              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-black"
                             />
                           </div>

                           <div>
                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Option values</label>
                             <input 
                              type="text" 
                              value={tempOptionValues}
                              onChange={(e) => setTempOptionValues(e.target.value)}
                              placeholder="Add values (separate with commas)"
                              className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-black"
                             />
                             <p className="text-[9px] text-slate-400 font-bold mt-2 ml-1 italic">Enter S, M, L or Red, Blue</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-slate-50">
                        <button 
                          onClick={() => {
                            setIsAddingVariants(false);
                            setEditingOptionIndex(null);
                            setTempOptionName('');
                            setTempOptionValues('');
                          }}
                          className="flex-1 py-3 rounded-2xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={addOrUpdateOption}
                          disabled={!tempOptionName.trim() || !tempOptionValues.trim()}
                          className="flex-[2] py-3 rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {editingOptionIndex !== null ? 'Update Option' : 'Done'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <i className="fa-solid fa-tag text-xs"></i>
                      </div>
                      <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Promotional Discount</label>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, applyDiscount: !prev.applyDiscount }))}
                      className={`h-10 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                        formData.applyDiscount ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      {formData.applyDiscount ? 'Discount Active' : 'Apply Discount'}
                    </button>
                  </div>

                  {formData.applyDiscount && (
                    <div className="space-y-6 animate-slide-up">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Discount Type</label>
                          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, discountType: 'percentage' }))}
                              className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${formData.discountType === 'percentage' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                            >
                              Percentage (%)
                            </button>
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, discountType: 'sale_price' }))}
                              className={`flex-1 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${formData.discountType === 'sale_price' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}
                            >
                              Sale Price
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                            {formData.discountType === 'percentage' ? 'Discount %' : 'New Price (₮)'}
                          </label>
                          <input 
                            type="number"
                            value={formData.discountValue}
                            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                            className="w-full h-11 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:border-indigo-500"
                            placeholder={formData.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 80000'}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8 items-start">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Base Retail Price (₮)</label>
                    <input 
                      type="number" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Stock Level</label>
                    <div className="flex gap-4">
                      <input 
                        type="number" 
                        disabled={formData.isUnlimited}
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-lg font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      />
                      <button 
                        onClick={() => setFormData({...formData, isUnlimited: !formData.isUnlimited})}
                        className={`px-6 rounded-2xl border-2 font-bold text-[10px] uppercase tracking-widest transition-all ${
                          formData.isUnlimited ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-md' : 'bg-white text-slate-400 border-slate-200'
                        }`}
                      >
                        Unlimited
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <button 
                    onClick={handleSave}
                    className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl"
                   >
                     Save Changes
                   </button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Identity</p>
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
                  <button 
                    onClick={toggleStatus}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                      product.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {product.status === 'active' ? 'Set Inactive' : 'Set Active'}
                  </button>
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

                <div className="grid grid-cols-2 gap-12 border-t border-slate-50 pt-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fullfillment</p>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <i className="fa-solid fa-clock text-indigo-500 text-xs"></i>
                         <span className="text-sm font-bold text-slate-900">
                           {product.availabilityType === 'ready' ? 'Ready to ship' : `Made to order (${product.deliveryDays} days)`}
                         </span>
                       </div>
                       <div className="flex items-center gap-2">
                         <i className="fa-solid fa-truck text-indigo-500 text-xs"></i>
                         <span className="text-sm font-bold text-slate-900">
                           {product.deliveryOptions.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(' & ')} available
                         </span>
                       </div>
                    </div>
                  </div>
                </div>

                {product.options && product.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
                    {product.options.map((opt, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
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
            )}
          </div>

          <div className="bg-[#1A1A1A] text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl space-y-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDFF8C] rounded-full opacity-5 blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 group relative">
                    <h3 className="text-2xl font-bold text-[#EDFF8C] tracking-tight">Let AI improve this product</h3>
                    <div className="relative">
                      <button 
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-slate-400 hover:bg-white/20 transition-all"
                      >
                        <i className="fa-solid fa-info"></i>
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-slate-800 p-4 rounded-xl shadow-2xl z-50 border border-slate-700 animate-fade-in">
                          <p className="text-[10px] leading-relaxed font-bold text-slate-300">
                            Our AI helps you boost your sales by suggesting better product names, descriptions, and tags based on your product data.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Click "Improve" to get AI suggestions for your product content.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <button 
                  onClick={handleImproveRequest}
                  disabled={isImproving}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isImproving ? 'bg-white/10 text-slate-500' : 'bg-white text-black hover:bg-[#EDFF8C]'
                  }`}
                >
                  {isImproving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-wand-magic-sparkles"></i>
                      Improve Product Content
                    </>
                  )}
                </button>
              </div>

              {suggestions && (
                <div className="space-y-6 pt-6 border-t border-white/10 relative z-10 animate-slide-up">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                      <div className="flex justify-between items-start">
                        <p className="text-[10px] font-bold text-[#EDFF8C] uppercase tracking-widest">Suggested Description</p>
                        <button 
                          onClick={() => applySuggestion('description', suggestions.description)}
                          disabled={appliedFields.has('description')}
                          className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${
                            appliedFields.has('description') ? 'bg-emerald-500 text-white' : 'bg-[#EDFF8C] text-black hover:scale-105'
                          }`}
                        >
                          {appliedFields.has('description') ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{suggestions.description}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                        <p className="text-[10px] font-bold text-[#EDFF8C] uppercase tracking-widest">SEO Title</p>
                        <p className="text-xs font-bold text-white">{suggestions.seoTitle}</p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                        <p className="text-[10px] font-bold text-[#EDFF8C] uppercase tracking-widest">Product Type</p>
                        <p className="text-xs font-bold text-white">{suggestions.productType}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                      <p className="text-[10px] font-bold text-[#EDFF8C] uppercase tracking-widest">Recommended Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold text-slate-300">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;