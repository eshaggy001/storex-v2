import React, { useMemo, useState } from 'react';
import { Conversation, Product, Order } from '../../types';

interface DashboardRecentDataProps {
    conversations: Conversation[];
    products: Product[];
    orders: Order[];
    t: any;
    onNavigate: (view: string) => void;
}

const DashboardRecentData: React.FC<DashboardRecentDataProps> = ({
    conversations,
    products,
    orders,
    t,
    onNavigate
}) => {
    const [topMetric, setTopMetric] = useState<'sales' | 'views'>('sales');

    // Top Products Logic
    const topProducts = useMemo(() => {
        if (topMetric === 'sales') {
            const salesMap: Record<string, number> = {};
            orders.forEach(o => {
                if (o.status !== 'pending') {
                    o.items.forEach(item => {
                        salesMap[item.productId] = (salesMap[item.productId] || 0) + item.quantity;
                    });
                }
            });

            return Object.entries(salesMap)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([id, count]) => {
                    const product = products.find(p => p.id === id);
                    return {
                        ...product,
                        metricLabel: `${count} ${t.sold}`,
                        metricValue: count
                    };
                })
                .filter(p => p.id);
        } else {
            return [...products]
                .sort((a, b) => (b.price - a.price))
                .slice(0, 3)
                .map(p => ({
                    ...p,
                    metricLabel: `${Math.floor(Math.random() * 500) + 100} ${t.views}`,
                    metricValue: 0
                }));
        }
    }, [orders, products, topMetric, t]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-8">
                {/* Recent Messages */}
                <div className="bg-white rounded-super border border-dark/10 shadow-soft overflow-hidden p-8 h-[450px] flex flex-col group">
                    <div className="flex justify-between items-center mb-10 shrink-0">
                        <h3 className="text-xl font-bold text-dark tracking-tighter">{t.recentMessages}</h3>
                        <button onClick={() => onNavigate('messages')} className="flex items-center gap-2 text-[10px] font-bold text-dark uppercase tracking-widest hover:bg-bg px-4 py-2 border border-dark/10 rounded-full transition-all">{t.viewInbox} <i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                        {conversations.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                <div className="w-20 h-20 bg-bg rounded-card flex items-center justify-center text-slate-200">
                                    <i className="fa-solid fa-comments text-3xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark">No messages yet</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Connect a channel to start</p>
                                </div>
                                <button onClick={() => onNavigate('settings')} className="btn-primary !py-2.5 !text-[11px]">Connect Social</button>
                            </div>
                        ) : (
                            conversations.slice(0, 5).map(c => (
                                <div key={c.id} onClick={() => onNavigate('messages')} className="flex items-center gap-5 cursor-pointer group/item p-4 hover:bg-bg rounded-card border border-transparent hover:border-dark/5 transition-all">
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 bg-bg rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl border border-dark/5 group-hover/item:bg-lime group-hover/item:text-dark transition-colors shadow-sm">
                                            {c.customerName[0]}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white shadow-md ${c.channel === 'instagram' ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600' : 'bg-blue-600'}`}>
                                            <i className={`fa-brands fa-${c.channel}`}></i>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-dark text-sm group-hover/item:text-dark transition-colors truncate">{c.customerName}</h4>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{c.timestamp}</span>
                                        </div>
                                        <p className="text-[13px] text-slate-500 truncate leading-relaxed font-medium">{c.lastMessage}</p>
                                    </div>
                                </div>
                            )))}
                        {conversations.length > 0 && <div className="h-2 w-full"></div>}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                {/* Top Products */}
                <div className="bg-white rounded-super border border-dark/10 shadow-soft overflow-hidden p-8 h-[450px] flex flex-col group">
                    <div className="flex justify-between items-center mb-10 shrink-0">
                        <div>
                            <h3 className="text-xl font-bold text-dark tracking-tighter">{t.topPerf}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.monthAnalytics}</p>
                        </div>
                        <div className="flex bg-bg p-1 rounded-2xl border border-dark/10">
                            <button
                                onClick={() => setTopMetric('sales')}
                                className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${topMetric === 'sales' ? 'bg-white text-dark shadow-md' : 'text-slate-400 hover:text-dark'}`}
                            >
                                {t.selling}
                            </button>
                            <button
                                onClick={() => setTopMetric('views')}
                                className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${topMetric === 'views' ? 'bg-white text-dark shadow-md' : 'text-slate-400 hover:text-dark'}`}
                            >
                                {t.trending}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                        {topProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                <div className="w-20 h-20 bg-bg rounded-card flex items-center justify-center text-slate-200">
                                    <i className="fa-solid fa-box-open text-3xl"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-dark">Catalogue is empty</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Add products to see rankings</p>
                                </div>
                                <button onClick={() => onNavigate('products')} className="btn-primary !py-2.5 !text-[11px]">Add Product</button>
                            </div>
                        ) : (
                            topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-5 group/item cursor-pointer p-4 rounded-card border border-transparent hover:border-dark/5 hover:bg-bg transition-all">
                                    <span className={`text-xl font-bold w-8 ${i === 0 ? 'text-lime font-black' : 'text-slate-100'}`}>0{i + 1}</span>
                                    <div className="w-14 h-14 rounded-2xl bg-bg border border-dark/5 overflow-hidden shrink-0 shadow-sm group-hover/item:scale-105 transition-transform">
                                        {/* Using simplified image access as per previous file */}
                                        <img src={product?.images?.[0]} className="w-full h-full object-cover" alt={product?.name} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-dark text-sm truncate">{product?.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{product?.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-dark text-sm">{product?.price?.toLocaleString()}₮</p>
                                        <div className={`mt-1 flex items-center justify-end gap-1 font-bold text-[9px] uppercase tracking-widest ${topMetric === 'sales' ? 'text-emerald-500' : 'text-dark'}`}>
                                            {topMetric === 'sales' && <i className="fa-solid fa-fire text-orange-500"></i>}
                                            <span>{product?.metricValue}</span>
                                        </div>
                                    </div>
                                </div>
                            )))}
                        {conversations.length > 0 && <div className="h-2 w-full"></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardRecentData;
