
import React, { useState, useRef } from 'react';
import { Product, ProductOption } from '../types';
import { analyzeProductImage } from '../services/geminiService';

interface ProductCreationWizardProps {
  onClose: () => void;
  onManualCreate: (product: Partial<Product>) => void;
  onAiStart: (image: string, suggestions: { name: string, category: string, options?: ProductOption[] }) => void;
}

const ProductCreationWizard: React.FC<ProductCreationWizardProps> = ({ onClose, onManualCreate, onAiStart }) => {
  const [view, setView] = useState<'choice' | 'manual' | 'ai_loading'>('choice');
  const [manualData, setManualData] = useState({ name: '', price: '', stock: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setView('ai_loading');
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeProductImage(base64);
      onAiStart(base64, result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    onManualCreate({
      name: manualData.name,
      price: parseFloat(manualData.price),
      stock: parseInt(manualData.stock) || 0,
      category: 'Other'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 font-['Manrope']">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>

      <div className="relative w-full max-w-2xl bg-white rounded-super shadow-2xl overflow-hidden animate-fade-in">
        {view === 'choice' && (
          <div className="p-12 text-center">
            <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter mb-4">Add New Product</h2>
            <p className="text-slate-500 font-medium mb-12">Choose how you'd like to list your item today.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="group p-8 bg-[#EDFF8C]/10 border-2 border-[#EDFF8C] rounded-[2rem] text-left hover:bg-[#EDFF8C] transition-all duration-500"
              >
                <div className="w-16 h-16 bg-[#EDFF8C] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:bg-black group-hover:scale-110 transition-all">
                  <i className="fa-solid fa-camera text-2xl group-hover:text-[#EDFF8C]"></i>
                </div>
                <h3 className="text-xl font-black text-black mb-2">Snap & Create</h3>
                <p className="text-black/60 text-sm font-bold">Upload a photo and let AI recognize your product instantly.</p>
              </button>

              <button
                onClick={() => setView('manual')}
                className="group p-8 bg-slate-50 border-2 border-transparent rounded-[2rem] text-left hover:border-slate-200 hover:bg-white transition-all duration-500"
              >
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-all">
                  <i className="fa-solid fa-keyboard text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Quick Entry</h3>
                <p className="text-slate-500 text-sm font-bold">I'll enter the details myself. No camera needed.</p>
              </button>
            </div>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </div>
        )}

        {view === 'manual' && (
          <div className="p-12">
            <div className="flex justify-between items-center mb-10">
              <button onClick={() => setView('choice')} className="text-slate-400 hover:text-black">
                <i className="fa-solid fa-arrow-left mr-2"></i> Back
              </button>
              <h2 className="text-2xl font-black text-[#1A1A1A]">Manual Entry</h2>
              <div className="w-8"></div>
            </div>

            <form onSubmit={submitManual} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Product Name</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={manualData.name}
                  onChange={e => setManualData({ ...manualData, name: e.target.value })}
                  placeholder="e.g. Vintage Denim Jacket"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={manualData.price}
                    onChange={e => setManualData({ ...manualData, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">In Stock</label>
                  <input
                    required
                    type="number"
                    value={manualData.stock}
                    onChange={e => setManualData({ ...manualData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-[#1A1A1A] text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl mt-4">
                Create Product
              </button>
            </form>
          </div>
        )}

        {view === 'ai_loading' && (
          <div className="p-16 text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-[#EDFF8C] rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-[#EDFF8C] rounded-full flex items-center justify-center shadow-[0_0_30px_#EDFF8C]">
                <i className="fa-solid fa-wand-magic-sparkles text-black text-3xl animate-pulse"></i>
              </div>
            </div>
            <h2 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Analyzing Image...</h2>
            <p className="text-slate-500 font-bold mt-2">Our AI is recognizing your product details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCreationWizard;
