import React, { useState } from 'react';
import { StoreInfo, BusinessReadiness } from '../types';
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

        // 1. Calculate new payment methods list
        const newMethods: string[] = [];
        if (qpayEnabled) newMethods.push('qpay');
        if (socialPayEnabled) newMethods.push('socialpay');
        if (bankName && accountNumber) newMethods.push('bank_transfer');

        // 2. Prepare fulfillment update
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

        // 3. Recalculate readiness flags
        // Create a temporary store object to check readiness
        const tempStoreForReadiness = {
            ...store,
            paymentMethods: newMethods
        };

        const newReadiness = updateReadinessFlags(tempStoreForReadiness);

        // 4. Update core store state
        onUpdateStore({
            fulfillment: newFulfillment,
            readiness: {
                ...store.readiness,
                payment_enabled: newReadiness.payment_enabled // Update this specific flag
            }
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-[#1A1A1A] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="bg-[#EDFF8C] p-6 text-black">
                    <h2 className="text-xl font-bold mb-1">Payment Setup</h2>
                    <p className="text-sm opacity-80 font-medium">Configure how you receive money.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">

                    {/* Digital Wallets Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Digital Wallets</h3>

                        <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center text-black font-bold">QP</div>
                                <div>
                                    <div className="font-semibold text-white">QPay</div>
                                    <div className="text-xs text-slate-400">QR payments</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={qpayEnabled}
                                onChange={(e) => setQpayEnabled(e.target.checked)}
                                className="w-5 h-5 accent-[#EDFF8C] rounded"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">SP</div>
                                <div>
                                    <div className="font-semibold text-white">SocialPay</div>
                                    <div className="text-xs text-slate-400">Golomt Bank</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={socialPayEnabled}
                                onChange={(e) => setSocialPayEnabled(e.target.checked)}
                                className="w-5 h-5 accent-[#EDFF8C] rounded"
                            />
                        </label>
                    </div>

                    {/* Bank Transfer Section */}
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Bank Transfer</h3>

                        <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase">Bank Name</label>
                            <select
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#EDFF8C]"
                            >
                                <option value="">Select Bank</option>
                                <option value="khan">Khan Bank</option>
                                <option value="golomt">Golomt Bank</option>
                                <option value="tdb">Trade & Development Bank</option>
                                <option value="state">State Bank</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase">Account Number</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                placeholder="0000000000"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#EDFF8C]"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1.5 uppercase">Account Holder Name</label>
                            <input
                                type="text"
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Name"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#EDFF8C]"
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 bg-[#1A1A1A] border-t border-white/5 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-[#EDFF8C] text-black rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Save Settings
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PaymentSetupModal;
