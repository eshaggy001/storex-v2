import React from 'react';
import { StoreInfo } from '../../types';

interface OnboardingRoadmapProps {
    store: StoreInfo;
    onNavigate: (view: string) => void;
    onAddProduct: () => void;
    onConnectPayment: () => void;
    onSetupDelivery: () => void;
    onConnectSocial: () => void;
}

interface RoadmapStep {
    key: string;
    label: string;
    completed?: boolean;
    action: () => void;
    icon: string;
    desc: string;
}

const OnboardingRoadmap: React.FC<OnboardingRoadmapProps> = ({ store, onNavigate, onAddProduct, onConnectPayment, onSetupDelivery, onConnectSocial }) => {
    const isSocialConnected = store.connectedChannels?.facebook || store.connectedChannels?.instagram;

    const roadmapSteps: RoadmapStep[] = [
        {
            key: 'products',
            label: 'Add First Product',
            completed: store.readiness.products_available,
            action: onAddProduct,
            icon: 'fa-box-open',
            desc: 'Create your product catalogue'
        },
        {
            key: 'payment',
            label: 'Connect Payment',
            completed: store.readiness.payment_enabled,
            action: onConnectPayment,
            icon: 'fa-credit-card',
            desc: 'Enable secure payments'
        },
        {
            key: 'delivery',
            label: 'Setup Delivery',
            completed: store.readiness.delivery_configured,
            action: onSetupDelivery,
            icon: 'fa-truck',
            desc: 'Configure shipping rules'
        }
    ];

    const totalMissions = roadmapSteps.length + 1;
    const completedMissions = roadmapSteps.filter(s => s.completed).length + (isSocialConnected ? 1 : 0);
    const progress = Math.round((completedMissions / totalMissions) * 100);

    return (
        <div className="space-y-6 animate-fade-up">
            {/* HERO SECTION - 2-Card Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">

                {/* 1. PROGRESS HEADER (Launchpad Focus) */}
                <div className="lg:col-span-3 bg-dark rounded-[40px] p-10 relative overflow-hidden shadow-2xl group border border-white/5">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 min-h-[220px]">
                        <div className="space-y-6 max-w-xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/5 backdrop-blur-md">
                                <i className="fa-solid fa-rocket text-lime text-xs"></i>
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Store Setup Mission</span>
                            </div>

                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-none mb-4">
                                    Let's get you <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime to-emerald-400">ready for sales.</span>
                                </h2>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                                    Your store is <span className="text-white font-bold">{progress}% complete</span>.
                                    Finish the missions <br className="hidden md:block" />
                                    below to activate your AI Sales Agent.
                                </p>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300">
                                    {completedMissions} / {totalMissions} Completed
                                </div>
                                <div className="text-lime text-xs font-bold animate-pulse">
                                    Next step: {isSocialConnected ? (roadmapSteps.find(s => !s.completed)?.label || 'All Done!') : 'Connect Channels'}
                                </div>
                            </div>
                        </div>

                        {/* Large Progress Circle */}
                        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="44"
                                    fill="none"
                                    stroke="#a3e635"
                                    strokeWidth="8"
                                    strokeDasharray="276"
                                    strokeDashoffset={276 - (276 * progress) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(163,230,53,0.5)]"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white tracking-tighter">{progress}%</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ready</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SOCIAL ACTION CARD (Featured: FB + IG) */}
                <div className="lg:col-span-1 bg-lime rounded-[40px] p-10 relative overflow-hidden shadow-xl flex flex-col justify-between group h-full border border-lime-400/20">
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-dark/40 uppercase tracking-[0.2em] mb-4 block">Priority</span>
                        <h3 className="text-[28px] font-bold text-dark leading-tight tracking-tight mb-3">
                            Connect <br />
                            Channels
                        </h3>
                        <p className="text-dark/60 text-sm font-semibold leading-relaxed">
                            Link Facebook & Instagram <br />
                            to activate AI Sales.
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 mt-auto">
                        <button
                            onClick={onConnectSocial}
                            className="w-full bg-dark text-white rounded-2xl py-4 font-bold text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-lg flex items-center justify-center"
                        >
                            {isSocialConnected ? (
                                <span className="flex items-center gap-2">
                                    <i className="fa-solid fa-check"></i> Connected
                                </span>
                            ) : (
                                'Connect Now'
                            )}
                        </button>
                    </div>

                    {/* Dual Icon Background Visual */}
                    <div className="absolute -bottom-10 -right-5 flex flex-col items-center pointer-events-none grayscale opacity-10 group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">
                        <div className="text-[100px] -rotate-[15deg] translate-x-4">
                            <i className="fa-brands fa-facebook"></i>
                        </div>
                        <div className="text-[120px] rotate-[10deg] -translate-y-12">
                            <i className="fa-brands fa-instagram"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. OTHER ROADMAP STEPS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {roadmapSteps.map((step, i) => (
                    <button
                        key={step.key}
                        onClick={step.action}
                        disabled={step.completed}
                        className={`text-left p-8 rounded-[32px] border transition-all duration-300 relative group/card flex flex-col justify-between h-[200px] ${step.completed
                            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-80 shadow-inner'
                            : 'bg-white border-dark/5 hover:border-dark/10 hover:shadow-xl hover:-translate-y-1'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${step.completed ? 'bg-emerald-500 text-white' : 'bg-bg text-dark border border-dark/5'
                                }`}>
                                <i className={`fa-solid ${step.completed ? 'fa-check' : step.icon}`}></i>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg ${step.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                                }`}>
                                {step.completed ? 'Done' : `Mission 0${i + 1}`}
                            </span>
                        </div>

                        <div>
                            <h4 className={`font-bold text-xl mb-1 ${step.completed ? 'text-emerald-700' : 'text-dark'}`}>
                                {step.label}
                            </h4>
                            <p className="text-[13px] text-slate-500 font-medium leading-tight">{step.desc}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* 4. LOCKED STATS PLACEHOLDER */}
            <div className="relative rounded-[40px] overflow-hidden border border-dark/5 bg-gray-50/50">
                <div className="absolute inset-0 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8 text-center bg-white/20">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4">
                        <i className="fa-solid fa-lock text-2xl text-dark opacity-10"></i>
                    </div>
                    <h3 className="text-xl font-bold text-dark tracking-tight mb-1">Analytics Locked</h3>
                    <p className="text-slate-500 text-sm font-medium">Add products to track sales.</p>
                </div>
                <div className="grid grid-cols-4 gap-6 p-10 blur-sm pointer-events-none grayscale opacity-10">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-3xl h-32"></div>)}
                    <div className="bg-white rounded-3xl h-80 col-span-3"></div>
                    <div className="bg-white rounded-3xl h-80 col-span-1"></div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingRoadmap;
