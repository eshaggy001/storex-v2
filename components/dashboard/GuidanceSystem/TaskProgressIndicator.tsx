import React from 'react';

interface TaskProgressIndicatorProps {
    current: number;
    total: number;
    unit: string;
}

const TaskProgressIndicator: React.FC<TaskProgressIndicatorProps> = ({ current, total, unit }) => {
    const percentage = Math.min((current / total) * 100, 100);

    return (
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>ГҮЙЦЭТГЭЛ</span>
                <span className="text-dark bg-lime/20 px-1.5 py-0.5 rounded-md">{current}/{total} {unit}</span>
            </div>
            <div className="h-1.5 w-full bg-bg rounded-full overflow-hidden border border-dark/5">
                <div
                    className="h-full bg-dark transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default TaskProgressIndicator;
