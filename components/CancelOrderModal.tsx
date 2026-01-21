import React, { useState } from 'react';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: 'quality' | 'damaged' | 'customer_changed_mind' | 'other') => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [selectedReason, setSelectedReason] = useState<'quality' | 'damaged' | 'customer_changed_mind' | 'other' | null>(null);

    if (!isOpen) return null;

    const reasons = [
        {
            id: 'quality',
            title: 'Quality Issue',
            description: 'The product does not meet the specified quality standards.',
            icon: 'fa-shield-halved',
            color: 'bg-amber-50 text-amber-600',
        },
        {
            id: 'damaged',
            title: 'Damaged',
            description: 'The item was received damaged or became unusable.',
            icon: 'fa-box-open',
            color: 'bg-rose-50 text-rose-600',
        },
        {
            id: 'customer_changed_mind',
            title: 'Customer Changed Mind',
            description: 'The customer decided they no longer want the product.',
            icon: 'fa-user-gear',
            color: 'bg-indigo-50 text-indigo-600',
        },
        {
            id: 'other',
            title: 'Other Reason',
            description: 'Reason not listed above. Specify in order notes.',
            icon: 'fa-ellipsis',
            color: 'bg-slate-50 text-slate-600',
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-xl bg-white rounded-super shadow-2xl border border-dark/5 overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="px-10 pt-10 pb-6 border-b border-dark/5">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-3xl font-bold tracking-tight text-dark">Cancel Order</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg transition-colors"
                        >
                            <i className="fa-solid fa-xmark text-slate-400"></i>
                        </button>
                    </div>
                    <p className="text-slate-500 font-medium">Please select the most accurate reason for this cancellation. This help Storex AI improve its future business advice.</p>
                </div>

                {/* Reason Selection */}
                <div className="p-10 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {reasons.map((reason) => (
                            <button
                                key={reason.id}
                                onClick={() => setSelectedReason(reason.id as any)}
                                className={`flex items-start gap-5 p-6 rounded-2xl border-2 transition-all text-left group ${selectedReason === reason.id
                                        ? 'border-dark bg-dark text-white shadow-xl scale-[1.02]'
                                        : 'border-dark/5 bg-bg/50 hover:border-dark/20 hover:bg-bg'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${selectedReason === reason.id ? 'bg-white/10 text-white' : reason.color
                                    }`}>
                                    <i className={`fa-solid ${reason.icon}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg mb-1">{reason.title}</h4>
                                    <p className={`text-sm ${selectedReason === reason.id ? 'text-white/60' : 'text-slate-500'}`}>
                                        {reason.description}
                                    </p>
                                </div>
                                {selectedReason === reason.id && (
                                    <div className="ml-auto animate-fade-in">
                                        <i className="fa-solid fa-circle-check text-lime text-xl"></i>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="px-10 py-8 bg-bg/50 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 btn-secondary text-slate-500"
                    >
                        Keep Order
                    </button>
                    <button
                        disabled={!selectedReason}
                        onClick={() => selectedReason && onConfirm(selectedReason)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-button font-bold transition-all ${selectedReason
                                ? 'bg-[#E11D48] text-white shadow-lg hover:bg-rose-700 active:scale-95'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Confirm Cancellation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
