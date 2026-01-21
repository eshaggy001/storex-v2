import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { updateReadinessFlags } from '../stateTransitions';

interface PaymentSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: StoreInfo;
    onUpdateStore: (updates: Partial<StoreInfo>) => void;
}

const PaymentSetupModal: React.FC<PaymentSetupModalProps> = ({ isOpen, onClose, store, onUpdateStore }) => {
    if (!isOpen) return null;

    const [bankName, setBankName] = useState(store.fulfillment.bankDetails?.bankName || '');
    const [accountNumber, setAccountNumber] = useState(store.fulfillment.bankDetails?.accountNumber || '');
    const [accountHolder, setAccountHolder] = useState(store.fulfillment.bankDetails?.accountHolder || '');

    const [qpayEnabled, setQpayEnabled] = useState(store.fulfillment.paymentMethods.includes('qpay'));
    const [socialPayEnabled, setSocialPayEnabled] = useState(store.fulfillment.paymentMethods.includes('socialpay'));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newMethods: any[] = [...store.fulfillment.paymentMethods];

        // Update methods based on toggles
        const updateMethod = (method: any, enabled: boolean) => {
            const index = newMethods.indexOf(method);
            if (enabled && index === -1) newMethods.push(method);
            else if (!enabled && index !== -1) newMethods.splice(index, 1);
        };

        updateMethod('qpay', qpayEnabled);
        updateMethod('socialpay', socialPayEnabled);

        // Automatically add bank_transfer if bank details are provided
        if (bankName && accountNumber && !newMethods.includes('bank_transfer')) {
            newMethods.push('bank_transfer');
        }

        const newFulfillment = {
            ...store.fulfillment,
            paymentMethods: newMethods,
            bankDetails: {
                bankName,
                accountNumber,
                accountHolder,
                paymentNote: store.fulfillment.bankDetails?.paymentNote || ''
            }
        };

        const tempStoreForReadiness = {
            ...store,
            fulfillment: newFulfillment
        };

        const newReadiness = updateReadinessFlags(tempStoreForReadiness);

        onUpdateStore({
            fulfillment: newFulfillment,
            readiness: {
                ...store.readiness,
                payment_enabled: newReadiness.payment_enabled
            }
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 font-['Manrope']">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-super shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-10 pb-6 shrink-0">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Payment Setup</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-all">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <p className="text-slate-500 font-medium">Configure how you receive payments from customers.</p>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-10 pt-0 no-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Digital Wallets */}
                        <div className="space-y-4">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Digital Wallets</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${qpayEnabled ? 'bg-[#EDFF8C]/10 border-[#EDFF8C]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${qpayEnabled ? 'bg-[#EDFF8C] text-black' : 'bg-white text-slate-300'}`}>
                                        <i className="fa-solid fa-qrcode"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-dark leading-tight">QPay</div>
                                        <div className="text-[11px] font-bold text-slate-500">Enable QR Payments</div>
                                    </div>
                                    <input type="checkbox" checked={qpayEnabled} onChange={(e) => setQpayEnabled(e.target.checked)} className="w-5 h-5 accent-dark" />
                                </label>

                                <label className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer ${socialPayEnabled ? 'bg-[#EDFF8C]/10 border-[#EDFF8C]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${socialPayEnabled ? 'bg-[#EDFF8C] text-black' : 'bg-white text-slate-300'}`}>
                                        <i className="fa-solid fa-mobile-screen"></i>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-black text-dark leading-tight">SocialPay</div>
                                        <div className="text-[11px] font-bold text-slate-500">Golomt Bank</div>
                                    </div>
                                    <input type="checkbox" checked={socialPayEnabled} onChange={(e) => setSocialPayEnabled(e.target.checked)} className="w-5 h-5 accent-dark" />
                                </label>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-6">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Bank Transfer Details</label>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Preferred Bank</label>
                                    <select
                                        value={bankName}
                                        onChange={(e) => setBankName(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Bank</option>
                                        <option value="khan">Khan Bank</option>
                                        <option value="golomt">Golomt Bank</option>
                                        <option value="tdb">Trade & Development Bank</option>
                                        <option value="state">State Bank</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Account Number</label>
                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            placeholder="5000xxxxxx"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Account Holder Name</label>
                                        <input
                                            type="text"
                                            value={accountHolder}
                                            onChange={(e) => setAccountHolder(e.target.value)}
                                            placeholder="Your Name"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-lg outline-none focus:border-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-dark text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl shadow-dark/10">
                            Save Payment Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentSetupModal;
