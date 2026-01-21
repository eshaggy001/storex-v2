import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { optimizeProductField, generateProductImprovements } from '../services/geminiService';
import ProductView from './product-detail/ProductView';
import ProductEditor from './product-detail/ProductEditor';
import AISuggestionPanel from './product-detail/AISuggestionPanel';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onUpdate: (updates: Partial<Product>) => void;
  onEditWithAi: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onUpdate, onEditWithAi }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImprovingField, setIsImprovingField] = useState<string | null>(null);
  const [isImprovingFull, setIsImprovingFull] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [mainImage, setMainImage] = useState(product.images[0]);

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
    options: product.options || [],
    variants: product.variants || {}
  });

  const handleManualSave = () => {
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
      variants: formData.variants,
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

  const handleToggleStatus = () => {
    const newStatus = product.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    onUpdate({ status: newStatus });
  };

  const handleFullAIImprove = async () => {
    setIsImprovingFull(true);
    try {
      const suggestions = await generateProductImprovements(product);
      setAiSuggestions(suggestions);
    } catch (err) {
      console.error("Full AI Improvement failed:", err);
    } finally {
      setIsImprovingFull(false);
    }
  };

  const applyAISuggestion = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // If not in editing mode, we should save directly or enter editing mode
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleAIFieldOptimize = async (field: string) => {
    if (field === 'full') {
      handleFullAIImprove();
      return;
    }
    setIsImprovingField(field);
    try {
      const optimizedText = await optimizeProductField(
        {
          name: formData.name,
          category: formData.category as any,
          description: formData.description
        },
        field
      );

      if (optimizedText) {
        setFormData(prev => ({ ...prev, [field]: optimizedText }));
      }
    } catch (err) {
      console.error("AI Optimization failed:", err);
    } finally {
      setIsImprovingField(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-fade-in font-['Manrope'] px-4 sm:px-0">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-slate-400 font-bold hover:text-slate-900 transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
          </div>
          Back to list
        </button>

        <div className="flex gap-3 w-full sm:w-auto">
          {!isEditing && (
            <button
              onClick={handleFullAIImprove}
              disabled={isImprovingFull}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-[#EDFF8C] rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-black/20"
            >
              <i className={`fa-solid ${isImprovingFull ? 'fa-sparkles animate-spin' : 'fa-wand-magic-sparkles'}`}></i>
              {isImprovingFull ? 'Consulting Gemini...' : 'Full AI Improvement'}
            </button>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex-1 sm:flex-none px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-soft border ${isEditing
              ? 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50'
              }`}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Manually'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {isEditing ? (
        <ProductEditor
          formData={formData}
          setFormData={setFormData}
          onSave={handleManualSave}
          onCancel={() => setIsEditing(false)}
          onAIFieldOptimize={handleAIFieldOptimize}
          isImprovingField={isImprovingField}
        />
      ) : (
        <ProductView
          product={product}
          onToggleStatus={handleToggleStatus}
          mainImage={mainImage}
          setMainImage={setMainImage}
          onFullAIImprove={handleFullAIImprove}
          isImprovingFull={isImprovingFull}
        />
      )}

      {/* AI Suggestion Modal */}
      {aiSuggestions && (
        <AISuggestionPanel
          suggestions={aiSuggestions}
          onApply={applyAISuggestion}
          onClose={() => setAiSuggestions(null)}
        />
      )}
    </div>
  );
};

export default ProductDetail;