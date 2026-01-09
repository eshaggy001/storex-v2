import React, { useState, useEffect } from 'react';
import { StoreInfo, Product } from '../types';

interface OnboardingProps {
  store: StoreInfo;
  updateStore: (updates: Partial<StoreInfo>) => void;
  addProduct: (product: Product) => void;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingProps> = ({ store, updateStore, addProduct, onComplete }) => {
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const [storeName, setStoreName] = useState('');
  const [category, setCategory] = useState('Fashion & Apparel');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const nextStep = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep(prev => prev + 1);
    }, 800);
  };

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStore({ name: storeName, category });
    nextStep();
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: 'prod_init_1',
      name: productName,
      price: parseFloat(productPrice),
      description: 'Initial product added during onboarding',
      stock: 10,
      category: 'Other',
      status: 'active',
      availabilityType: 'ready',
      images: [`https://picsum.photos/seed/${productName}/200/200`],
      deliveryOptions: ['courier', 'pickup']
    };
    addProduct(newProduct);
    nextStep();
  };

  const handleChannelConnect = () => {
    updateStore({ connectedChannels: { facebook: true, instagram: true } });
    nextStep();
  };

  const handleFinish = () => {
    updateStore({ onboardingStep: 5, isLive: true });
    onComplete();
  };

  const totalSteps = 4;
  const currentProgressStep = step >= 1 && step <= 4 ? step : 0;

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center relative overflow-hidden text-white font-['Manrope']">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EDFF8C] rounded-full opacity-10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-50 rounded-full opacity-10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-lg px-8">
        
        {step > 0 && step < 5 && (
          <div className="mb-10 animate-fade-in">
            <div className="flex justify-between items-end mb-3 leading-none">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Setup Progress</span>
              <span className="text-2xl font-bold text-[#EDFF8C]">{currentProgressStep}/{totalSteps}</span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    s <= currentProgressStep ? 'bg-[#EDFF8C] shadow-[0_0_10px_#EDFF8C]' : 'bg-white/10'
                  }`} 
                />
              ))}
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-20 h-20 bg-[#EDFF8C] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(237,255,140,0.3)]">
              <i className="fa-solid fa-bolt text-4xl text-black"></i>
            </div>
            <h1 className="text-5xl font-semibold tracking-tighter">Storex AI</h1>
            <p className="text-lg text-slate-400 font-normal">Your automated retail partner.</p>
            <button 
              onClick={() => setStep(1)}
              className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-[#EDFF8C] transition-all shadow-xl mt-8"
            >
              Get Started
            </button>
            <div className="text-[14px] text-slate-500 font-normal mt-4">
              Already have an account? <span className="text-white cursor-pointer underline font-medium">Log in</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl animate-slide-up">
              <div className="flex items-center gap-3 mb-2 leading-none">
                <i className="fa-solid fa-robot text-xs"></i>
                <span className="text-[11px] font-semibold uppercase tracking-widest">AI Assistant</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Hello! I'm here to help you set up your business. It will only take a minute. ready?
              </p>
            </div>
            {!isTyping && (
              <button 
                onClick={nextStep}
                className="ml-auto block px-8 py-3 bg-white/10 border border-white/20 rounded-2xl font-medium hover:bg-white hover:text-black transition-all"
              >
                Let's go <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <p className="text-lg font-medium">First, what is the name of your store?</p>
            </div>
            
            <form onSubmit={handleBasicsSubmit} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4 animate-slide-up">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 leading-none">Store Name</label>
                <input 
                  type="text" 
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Urban Threads" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] font-normal"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 leading-none">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] font-normal cursor-pointer"
                >
                  <option>Fashion & Apparel</option>
                  <option>Home & Living</option>
                  <option>Beauty</option>
                  <option>Electronics</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                Continue
              </button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <p className="text-lg font-medium">Great name! Let's add your first product so you can start selling immediately.</p>
            </div>
            
            <form onSubmit={handleProductSubmit} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4 animate-slide-up">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 leading-none">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Summer Linen Shirt" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] font-normal"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2 leading-none">Price ($)</label>
                <input 
                  type="number" 
                  required
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="0.00" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] font-normal"
                />
              </div>
              <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                Add Product
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <p className="text-lg font-medium">Where do you want to sell {productName}?</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4 animate-slide-up">
              <button onClick={handleChannelConnect} className="w-full bg-[#1877F2] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                <i className="fa-brands fa-facebook text-xl"></i>
                Connect Facebook Page
              </button>
              <button onClick={handleChannelConnect} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity">
                <i className="fa-brands fa-instagram text-xl"></i>
                Connect Instagram
              </button>
              <button onClick={nextStep} className="w-full text-slate-400 text-[14px] font-medium hover:text-white mt-2">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-24 h-24 bg-[#EDFF8C] rounded-full mx-auto flex items-center justify-center mb-6 shadow-[0_0_50px_#EDFF8C] animate-bounce">
              <i className="fa-solid fa-check text-4xl text-black"></i>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">You're ready to sell!</h1>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-3">
              <div className="flex items-center gap-3 text-slate-300 font-normal">
                <i className="fa-solid fa-store text-[#EDFF8C] text-xs"></i>
                <span>{storeName} created</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-normal">
                <i className="fa-solid fa-box text-[#EDFF8C] text-xs"></i>
                <span>1 Product active</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 font-normal">
                <i className="fa-solid fa-wand-magic-sparkles text-[#EDFF8C] text-xs"></i>
                <span>AI Assistant activated</span>
              </div>
            </div>
            <button 
              onClick={handleFinish}
              className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-[#EDFF8C] transition-all shadow-xl"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {isTyping && (
          <div className="absolute bottom-10 left-8 flex gap-1.5 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;