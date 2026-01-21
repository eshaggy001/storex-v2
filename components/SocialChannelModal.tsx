import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { updateReadinessFlags } from '../stateTransitions';

interface SocialChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    store: StoreInfo;
    onUpdateStore: (updates: Partial<StoreInfo>) => void;
}

const SocialChannelModal: React.FC<SocialChannelModalProps> = ({ isOpen, onClose, store, onUpdateStore }) => {
    if (!isOpen) return null;

    const [facebook, setFacebook] = useState(store.connectedChannels?.facebook || false);
    const [instagram, setInstagram] = useState(store.connectedChannels?.instagram || false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updates: Partial<StoreInfo> = {
            connectedChannels: {
                facebook,
                instagram
            }
        };

        // Recalculate readiness (though social channels don't affect readiness flags in current logic)
        const tempStore = { ...store, ...updates };
        const newReadiness = updateReadinessFlags(tempStore);

        updates.readiness = newReadiness;

        onUpdateStore(updates);
        onClose();
    };

    const isAnyConnected = facebook || instagram;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 font-['Manrope']">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl bg-white rounded-super shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-10 pb-6 shrink-0">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tighter">Connect Channels</h2>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-black transition-all">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <p className="text-slate-500 font-medium">Link your social media accounts to enable AI selling.</p>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto p-10 pt-0 no-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Facebook */}
                        <button
                            type="button"
                            onClick={() => setFacebook(!facebook)}
                            className={`w-full flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left ${facebook ? 'bg-[#1877F2]/5 border-[#1877F2]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${facebook ? 'bg-[#1877F2] text-white' : 'bg-white text-[#1877F2]'}`}>
                                <i className="fa-brands fa-facebook"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-black text-xl text-dark leading-tight tracking-tight">Facebook Page</div>
                                <div className="text-sm font-bold text-slate-500 mt-1">
                                    {facebook ? 'Connected & Active' : 'Enable AI to respond to comments and messages'}
                                </div>
                            </div>
                            {facebook && (
                                <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                                    <i className="fa-solid fa-check mr-1"></i> Active
                                </div>
                            )}
                        </button>

                        {/* Instagram */}
                        <button
                            type="button"
                            onClick={() => setInstagram(!instagram)}
                            className={`w-full flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left ${instagram ? 'bg-[#E1306C]/5 border-[#E1306C]' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${instagram ? 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white' : 'bg-white text-[#E1306C]'}`}>
                                <i className="fa-brands fa-instagram"></i>
                            </div>
                            <div className="flex-1">
                                <div className="font-black text-xl text-dark leading-tight tracking-tight">Instagram Business</div>
                                <div className="text-sm font-bold text-slate-500 mt-1">
                                    {instagram ? 'Connected & Active' : 'Enable AI to respond to DMs and comments'}
                                </div>
                            </div>
                            {instagram && (
                                <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                                    <i className="fa-solid fa-check mr-1"></i> Active
                                </div>
                            )}
                        </button>

                        {/* Info Card */}
                        {isAnyConnected && (
                            <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 animate-slide-up">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-dark text-sm mb-1">AI Sales Enabled</h3>
                                        <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                            Your AI assistant will now monitor and respond to customer messages on the connected channels. You can review and approve AI responses anytime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full bg-dark text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-black transition-all shadow-xl shadow-dark/10">
                            Save Channel Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SocialChannelModal;
