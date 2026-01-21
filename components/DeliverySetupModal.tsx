import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { updateReadinessFlags } from '../stateTransitions';

interface DeliverySetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: StoreInfo;
    onUpdateStore: (updates: Partial<StoreInfo>) => void;
}

const DeliverySetupModal: React.FC<DeliverySetupModalProps> = ({ isOpen, onClose, store, onUpdateStore }) => {
    if (!isOpen) return null;

    const [deliveryTypes, setDeliveryTypes] = useState<string[]>(store.fulfillment.deliveryTypes || ['courier']);
    const [deliveryFee, setDeliveryFee] = useState(store.fulfillment.deliveryFee || 0);
    const [physicalAddress, setPhysicalAddress] = useState(store.physical_address || '');
    const [hasPhysicalStore, setHasPhysicalStore] = useState(store.has_physical_store || false);

    const handleToggleType = (type: string) => {
        setDeliveryTypes(prev => {
            if (prev.includes(type)) {
                if (prev.length > 1) return prev.filter(t => t !== type);
                return prev;
            }
            return [...prev, type];
        });

        if (type === 'pickup' && !hasPhysicalStore) {
            setHasPhysicalStore(true);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (deliveryTypes.includes('pickup') && !physicalAddress) {
            alert('Please provide a physical address for pickup orders.');
            return;
        }

        const newFulfillment = {
            ...store.fulfillment,
            deliveryTypes: deliveryTypes as ('courier' | 'pickup')[],
            deliveryFee: Number(deliveryFee)
        };

        const updates: Partial<StoreInfo> = {
            fulfillment: newFulfillment,
            has_physical_store: hasPhysicalStore,
            physical_address: physicalAddress
        };

        // Recalculate readiness
        const tempStore = { ...store, ...updates };
        const newReadiness = updateReadinessFlags(tempStore);

        updates.readiness = {
            ...store.readiness,
            delivery_configured: newReadiness.delivery_configured
        };

        onUpdateStore(updates);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 font-['Manrope']">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-super shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-10 pb-6 shrink-0">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Delivery Setup</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-all">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <p className="text-slate-500 font-medium">Set up your shipping and pickup options.</p>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-10 pt-0 no-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Delivery Methods */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleToggleType('courier')}
                                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${deliveryTypes.includes('courier') ? 'bg-dark border-dark text-white' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${deliveryTypes.includes('courier') ? 'bg-[#EDFF8C] text-black' : 'bg-white text-slate-300'}`}>
                                    <i className="fa-solid fa-truck-fast"></i>
                                </div>
                                <div className="flex-1">
                                    <div className={`font-black tracking-tight leading-tight ${deliveryTypes.includes('courier') ? 'text-white' : 'text-slate-900'}`}>Courier Delivery</div>
                                    <div className={`text-[11px] font-bold ${deliveryTypes.includes('courier') ? 'text-slate-400' : 'text-slate-500'}`}>City & Local area</div>
                                </div>
                                {deliveryTypes.includes('courier') && <i className="fa-solid fa-check text-[#EDFF8C]"></i>}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleToggleType('pickup')}
                                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left ${deliveryTypes.includes('pickup') ? 'bg-dark border-dark text-white' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${deliveryTypes.includes('pickup') ? 'bg-[#EDFF8C] text-black' : 'bg-white text-slate-300'}`}>
                                    <i className="fa-solid fa-store"></i>
                                </div>
                                <div className="flex-1">
                                    <div className={`font-black tracking-tight leading-tight ${deliveryTypes.includes('pickup') ? 'text-white' : 'text-slate-900'}`}>Customer Pickup</div>
                                    <div className={`text-[11px] font-bold ${deliveryTypes.includes('pickup') ? 'text-slate-400' : 'text-slate-500'}`}>From your location</div>
                                </div>
                                {deliveryTypes.includes('pickup') && <i className="fa-solid fa-check text-[#EDFF8C]"></i>}
                            </button>
                        </div>

                        {/* Courier Details */}
                        {deliveryTypes.includes('courier') && (
                            <div className="space-y-4 animate-slide-up">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Courier Fee (MNT)</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={deliveryFee}
                                        onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 font-black text-2xl outline-none focus:border-black transition-all"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm uppercase tracking-widest">₮ MNT</div>
                                </div>
                                <p className="text-[11px] font-medium text-slate-400 ml-1">This will be the default shipping cost shown to your customers.</p>
                            </div>
                        )}

                        {/* Pickup / Store Details */}
                        {deliveryTypes.includes('pickup') && (
                            <div className="space-y-4 animate-slide-up">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Store Address for Pickup</label>
                                <textarea
                                    value={physicalAddress}
                                    onChange={(e) => setPhysicalAddress(e.target.value)}
                                    placeholder="Enter your detailed store address..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 font-bold text-lg outline-none focus:border-black transition-all h-32 resize-none"
                                />
                                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <i className="fa-solid fa-circle-info text-indigo-500"></i>
                                    <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">AI will share this address with customers wanting to pickup.</p>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full bg-dark text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl shadow-dark/10">
                            Save Delivery Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeliverySetupModal;
