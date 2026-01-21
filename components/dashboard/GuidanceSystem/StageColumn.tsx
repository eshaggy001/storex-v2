import React from 'react';
import { ActionTask } from '../../../types';
import TaskCard from './TaskCard';

interface StageColumnProps {
    stage: 'daily' | 'weekly' | 'monthly';
    tasks: ActionTask[];
    onTaskClick: (task: ActionTask) => void;
}

const STAGE_CONFIG = {
    daily: { title: 'Daily', subtitle: 'Operational Habits' },
    weekly: { title: 'Weekly', subtitle: 'Growth Milestones' },
    monthly: { title: 'Monthly', subtitle: 'Strategic Trajectory' }
};

const StageColumn: React.FC<StageColumnProps> = ({ stage, tasks, onTaskClick }) => {
    const config = STAGE_CONFIG[stage];

    return (
        <div className="space-y-6">
            <div className="px-1">
                <h3 className="text-xl font-bold text-dark tracking-tighter">{config.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {config.subtitle}
                </p>
            </div>

            <div className="space-y-4">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))}
            </div>
        </div>
    );
};

export default StageColumn;
