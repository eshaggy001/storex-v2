import React from 'react';
import { TaskTagType } from '../../../types';

interface TaskTagProps {
    tag: TaskTagType;
}

const TAG_STYLES: Record<TaskTagType, { bg: string; text: string; label: string; border: string }> = {
    FIRST_TIME: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', label: 'First Time' },
    IMPORTANT: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', label: 'Important' },
    HOW_TO: { bg: 'bg-bg', text: 'text-dark', border: 'border-dark/5', label: 'How To' },
    AI_SUGGESTED: { bg: 'bg-lime/20', text: 'text-dark', border: 'border-lime/30', label: 'AI Suggested' },
    HABIT: { bg: 'bg-bg', text: 'text-slate-500', border: 'border-slate-100', label: 'Habit' },
    INSIGHT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', label: 'Insight' }
};

const TaskTag: React.FC<TaskTagProps> = ({ tag }) => {
    const style = TAG_STYLES[tag];

    return (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${style.bg} ${style.text} ${style.border}`}>
            {style.label}
        </span>
    );
};

export default TaskTag;
