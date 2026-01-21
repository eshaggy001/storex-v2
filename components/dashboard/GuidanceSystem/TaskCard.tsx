import React from 'react';
import { ActionTask } from '../../../types';
import TaskTag from './TaskTag';
import TaskProgressIndicator from './TaskProgressIndicator';

interface TaskCardProps {
    task: ActionTask;
    onClick: (task: ActionTask) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    const isCompleted = task.state === 'completed';

    return (
        <div
            onClick={() => onClick(task)}
            className={`
                p-6 rounded-card border transition-all duration-300 cursor-pointer group relative overflow-hidden flex items-center gap-5
                ${isCompleted
                    ? 'bg-slate-50/50 border-slate-100 opacity-60'
                    : 'bg-white border-dark/10 hover:border-dark/20'}
            `}
        >
            {/* Task Icon */}
            <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-opacity duration-300
                ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-bg text-dark border border-dark/5 group-hover:bg-lime'}
            `}>
                <i className={`fa-solid ${task.icon || 'fa-bolt'}`}></i>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex flex-wrap gap-1.5">
                    {task.tags.map(tag => (
                        <TaskTag key={tag} tag={tag} />
                    ))}
                </div>

                <h4 className={`font-bold text-sm tracking-tight leading-tight truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-dark'}`}>
                    {task.title}
                </h4>

                <p className={`text-[10px] font-bold leading-relaxed uppercase tracking-widest ${isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>
                    {task.description}
                </p>

                {task.progress && task.state === 'condition_based' && (
                    <TaskProgressIndicator
                        current={task.progress.current}
                        total={task.progress.total}
                        unit={task.progress.unit}
                    />
                )}
            </div>

            {/* Action Indicator */}
            <div className={`
                w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300
                ${isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-bg border-dark/5 text-slate-300 group-hover:bg-lime group-hover:text-dark group-hover:border-lime/30'}
            `}>
                <i className={`fa-solid ${isCompleted ? 'fa-check text-[10px]' : 'fa-chevron-right text-[10px]'}`}></i>
            </div>
        </div>
    );
};

export default TaskCard;
