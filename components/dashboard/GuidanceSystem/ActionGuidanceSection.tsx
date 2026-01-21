import React, { useState } from 'react';
import { ActionGuidanceState, ActionTask } from '../../../types';
import TaskCard from './TaskCard';
import AIInsightSummary from './AIInsightSummary';

interface ActionGuidanceSectionProps {
    guidance: ActionGuidanceState;
    onTakeAction: (task: ActionTask) => void;
    onTaskClick: (task: ActionTask) => void;
}

const ActionGuidanceSection: React.FC<ActionGuidanceSectionProps> = ({ guidance, onTakeAction, onTaskClick }) => {
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
    const [dismissedSummary, setDismissedSummary] = useState(false);

    const activeTasks = guidance[activeTab] || [];

    // Check if any insight task was completed recently
    const completedWeekly = guidance.weekly.find(t => t.id === 'weekly_summary' && t.state === 'completed');
    const completedMonthly = guidance.monthly.find(t => t.id === 'monthly_summary' && t.state === 'completed');

    const showSummary = (completedWeekly || completedMonthly) && !dismissedSummary;

    // Calculate progress for active tasks
    const completedCount = activeTasks.filter(t => t.state === 'completed').length;
    const progressPercent = Math.round((completedCount / (activeTasks.length || 1)) * 100);

    return (
        <div className="space-y-8 animate-fade-up">
            {showSummary && (
                <AIInsightSummary
                    title={completedMonthly ? "Monthly Strategic Review" : "Weekly Growth Review"}
                    impact={completedMonthly ? "Store Visibility +45%" : "Order Fulfillment +22%"}
                    onClose={() => setDismissedSummary(true)}
                />
            )}

            <div className="card-premium space-y-10">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-dark text-lime flex items-center justify-center text-xl shadow-lg transition-transform hover:rotate-6 duration-500">
                            <i className="fa-solid fa-crosshairs"></i>
                        </div>
                        <div>
                            <h2 className="uppercase">Action Guidance System</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Business Habits & Growth</p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="bg-bg p-1.5 rounded-2xl flex items-center gap-1 self-start md:self-center border border-dark/5">
                        {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
                                    ${activeTab === tab
                                        ? 'bg-dark text-white shadow-lg'
                                        : 'text-slate-400 hover:text-dark hover:bg-white'}
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ГҮЙЦЭТГЭЛ</span>
                            <span className="text-[10px] font-black text-dark">{progressPercent}%</span>
                        </div>
                        <div className="h-2 bg-bg rounded-full overflow-hidden border border-dark/5">
                            <div
                                className="h-full bg-dark rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-bg border-t border-dark/5" />

                {/* Tasks Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeTasks.length > 0 ? (
                        activeTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={onTaskClick}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 py-12 flex flex-col items-center justify-center text-center space-y-3 bg-bg/50 rounded-card border border-dashed border-dark/10">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300">
                                <i className="fa-solid fa-check-double text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-dark">Бүх ажил амжилттай дууссан</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Таны дэлгүүр хэвийн ажиллаж байна</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionGuidanceSection;
