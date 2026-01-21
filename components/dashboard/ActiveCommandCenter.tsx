import React from 'react';
import KPICard from '../KPICard';
import { StoreInfo, Order, Conversation, Product, ActionGuidanceState, ActionTask } from '../../types';
import ActionGuidanceSection from './GuidanceSystem/ActionGuidanceSection';

interface DashboardMetrics {
    revenue: number;
    pending: number;
    aiCount: number;
    total: number;
    conversionRate: string;
    closedOrdersCount: number;
}

interface ActiveCommandCenterProps {
    store: StoreInfo;
    metrics: DashboardMetrics;
    orders: Order[];
    conversations: Conversation[];
    products: Product[];
    t: any; // Translations
    onNavigate: (view: string) => void;
    actionGuidance: ActionGuidanceState;
    onGuidanceAction: (task: ActionTask) => void;
    onTaskClick: (task: ActionTask) => void;
}

const ActiveCommandCenter: React.FC<ActiveCommandCenterProps> = ({
    store,
    metrics,
    orders,
    conversations,
    products,
    t,
    onNavigate,
    actionGuidance,
    onGuidanceAction,
    onTaskClick
}) => {
    // "Needs Attention" Logic
    const attentionItems = [];

    if (metrics.pending > 0) {
        attentionItems.push({
            type: 'order',
            priority: 'high',
            title: `${metrics.pending} Orders Pending`,
            desc: 'Waiting for confirmation',
            action: () => onNavigate('orders'),
            btnText: 'Review',
            icon: 'fa-truck-fast',
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100'
        });
    }

    const lowStock = products.filter(p => typeof p.stock === 'number' && p.stock < 5).length;
    if (lowStock > 0) {
        attentionItems.push({
            type: 'stock',
            priority: 'medium',
            title: `${lowStock} Products Low Stock`,
            desc: 'Restock soon to avoid lost sales',
            action: () => onNavigate('products'),
            btnText: 'View',
            icon: 'fa-box-open',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100'
        });
    }

    const unreadMsgs = conversations.filter(c => c.unread).length;
    if (unreadMsgs > 0) {
        attentionItems.push({
            type: 'msg',
            priority: 'medium',
            title: `${unreadMsgs} Unread Messages`,
            desc: 'Customers are waiting',
            action: () => onNavigate('messages'),
            btnText: 'Reply',
            icon: 'fa-comments',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100'
        });
    }

    return (
        <div className="space-y-8 animate-fade-up">
            {/* 1. HERO KPI & AI INSIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Momentum / AI Insight Card */}
                <div className="lg:col-span-3 bg-dark rounded-super p-10 relative overflow-hidden shadow-2xl text-white group border border-white/5">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-lime/20 to-transparent rounded-full opacity-20 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                                    <i className="fa-solid fa-wand-magic-sparkles text-lime"></i>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Daily Insight</p>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow"></span>
                                        <span className="text-xs font-bold text-white">AI Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.revenue}</p>
                                <p className="text-4xl font-bold text-white tracking-tighter mt-1">{metrics.revenue.toLocaleString()}₮</p>
                            </div>
                        </div>

                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                                {t.closedOrders(metrics.closedOrdersCount, metrics.aiCount)}
                            </h2>
                            <p className="text-slate-400 font-medium text-lg">
                                {metrics.pending > 0
                                    ? `${metrics.pending} orders are in specific sizes. Should I auto-confirm if stock exists?`
                                    : "Traffic is steady. Consider boosting a post for the weekend."
                                }
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {attentionItems.length > 0 && (
                                <button onClick={attentionItems[0].action} className="btn-primary !bg-lime !text-dark hover:shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                                    <i className="fa-solid fa-bolt mr-2 text-dark"></i>
                                    Handle High Priority
                                </button>
                            )}
                            <button onClick={() => onNavigate('orders')} className="btn-secondary !bg-white/10 !text-white !border-white/10 hover:!bg-white/20">
                                View Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Goal Status / Mini-Stat */}
                <div className="bg-white rounded-super p-8 border border-dark/10 shadow-soft flex flex-col justify-between group">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-bg border border-dark/5 flex items-center justify-center text-dark text-xl">
                                <i className="fa-solid fa-chart-line"></i>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">+14% Growth</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Token Usage</p>
                        <div className="text-3xl font-bold text-dark tracking-tighter mt-1 mb-4">
                            {Math.round((store.tokenUsage.balance / store.tokenUsage.limit) * 100)}%
                        </div>
                        <div className="w-full bg-bg h-2 rounded-full overflow-hidden">
                            <div className="bg-dark h-full rounded-full w-[82%]"></div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-dashed border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-dark mb-1">
                            <span>Limit</span>
                            <span>{store.tokenUsage.limit.toLocaleString()}</span>
                        </div>
                        <button onClick={() => onNavigate('settings')} className="w-full mt-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-dark hover:bg-bg rounded-lg transition-colors">
                            Manage Plan
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. RETAIL PERFORMANCE KPI GRID */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-dark tracking-tight">Retail Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        label={t.handledByAi}
                        value={metrics.aiCount}
                        icon="fa-robot"
                        badgeText="+100%"
                        badgeColor="bg-[#EDFF8C] text-black"
                        iconBgClass="bg-[#EDFF8C]"
                        iconColorClass="text-black"
                    />
                    <KPICard
                        label={t.chatOrders}
                        value={metrics.total}
                        icon="fa-cart-shopping"
                        badgeText={`${metrics.conversionRate}% CR`}
                        badgeColor="bg-[#EDFF8C] text-black"
                        iconBgClass="bg-slate-50"
                        iconColorClass="text-dark"
                    />
                    <KPICard
                        label={t.revenue}
                        value={`${metrics.revenue.toLocaleString()}`}
                        icon="fa-money-bill-1"
                        badgeText="Today"
                        badgeColor="bg-[#EDFF8C] text-black"
                        iconBgClass="bg-slate-50"
                        iconColorClass="text-dark"
                    />
                    <KPICard
                        label={t.pendingAction}
                        value={metrics.pending}
                        icon="fa-rectangle-list"
                        badgeText="Needs Confirmation"
                        badgeColor="bg-rose-50 text-rose-600"
                        iconBgClass="bg-slate-50"
                        iconColorClass="text-dark"
                    />
                </div>
            </div>

            {/* 3. ACTION GUIDANCE SYSTEM (The AI Coach) */}
            <ActionGuidanceSection
                guidance={actionGuidance}
                onTakeAction={onGuidanceAction}
                onTaskClick={onTaskClick}
            />
        </div>
    );
};

export default ActiveCommandCenter;
