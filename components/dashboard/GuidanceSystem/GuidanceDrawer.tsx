import React from 'react';
import { ActionTask } from '../../../types';
import TaskTag from './TaskTag';

interface GuidanceDrawerProps {
    task: ActionTask | null;
    isOpen: boolean;
    onClose: () => void;
    onAction: (task: ActionTask) => void;
}

const GuidanceDrawer: React.FC<GuidanceDrawerProps> = ({ task, isOpen, onClose, onAction }) => {
    if (!task) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-dark/20 backdrop-blur-sm z-[70] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`
                fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-[80] shadow-2xl transition-transform duration-700 ease-out flex flex-col
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-dark text-lime flex items-center justify-center text-xl shadow-soft">
                            <i className={`fa-solid ${task.icon || 'fa-bolt'}`}></i>
                        </div>
                        <div className="pt-1">
                            <h3 className="text-2xl font-bold text-dark tracking-tight leading-none mb-2">{task.title}</h3>
                            <div className="flex gap-1.5">
                                {task.tags.map(tag => (
                                    <TaskTag key={tag} tag={tag} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-bg flex items-center justify-center text-slate-400 transition-colors">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 no-scrollbar">
                    {/* Why Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-lime" />
                            ЯАГААД ЭНЭ ЧУХАЛ ВЭ?
                        </h4>
                        <p className="text-lg font-bold text-dark tracking-tight leading-snug italic opacity-80">
                            "{task.whyMatters}"
                        </p>
                    </div>

                    {/* How Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-lime" />
                            ХЭРХЭН ГҮЙЦЭТГЭХ ВЭ?
                        </h4>
                        <div className="space-y-4">
                            {task.howTo.map((step, idx) => (
                                <div key={idx} className="flex gap-4 items-start group">
                                    <div className="w-6 h-6 rounded-lg bg-bg text-[10px] font-black text-dark flex items-center justify-center shrink-0 border border-dark/5 transition-all group-hover:bg-dark group-hover:text-white">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 mt-0.5 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Suggestion Box */}
                    <div className="bg-dark rounded-card p-6 text-white relative overflow-hidden shadow-soft">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <i className="fa-solid fa-wand-magic-sparkles text-4xl"></i>
                        </div>
                        <div className="relative z-10 space-y-3">
                            <h4 className="text-[10px] font-black text-lime uppercase tracking-widest flex items-center gap-2">
                                <i className="fa-solid fa-sparkles text-[8px]"></i>
                                AI ЗӨВЛӨГӨӨ
                            </h4>
                            <p className="text-sm italic font-medium leading-relaxed text-slate-300">
                                "{task.aiSuggestion}"
                            </p>
                        </div>
                    </div>

                    {/* Business Impact Box */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                            БИЗНЕСИЙН ҮР ДҮН
                        </h4>
                        <div className="bg-bg border border-dark/5 rounded-2xl p-5 flex items-center gap-4 group hover:bg-white hover:shadow-soft transition-all">
                            <div className="w-10 h-10 rounded-xl bg-white text-dark shadow-sm flex items-center justify-center group-hover:bg-lime group-hover:scale-110 transition-all">
                                <i className="fa-solid fa-chart-line-up"></i>
                            </div>
                            <p className="text-sm font-bold text-dark">{task.impact || 'Бизнесийн үр дүн тооцоолж байна...'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 pb-10 space-y-3 border-t border-slate-50 bg-white">
                    <button
                        onClick={() => onAction(task)}
                        className="btn-primary w-full py-4 text-sm uppercase tracking-widest shadow-soft"
                    >
                        Одоо хийх
                    </button>
                    <button
                        onClick={() => alert('AI is processing this task for you...')}
                        className="btn-secondary w-full py-4 text-sm uppercase tracking-widest"
                    >
                        <i className="fa-solid fa-wand-magic-sparkles text-dark"></i>
                        AI-аар хийлгэх
                    </button>
                </div>
            </div>
        </>
    );
};

export default GuidanceDrawer;
