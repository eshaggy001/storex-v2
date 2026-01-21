import React from 'react';

interface InlineAIButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    tooltip?: string;
    className?: string;
}

const InlineAIButton: React.FC<InlineAIButtonProps> = ({ onClick, isLoading, tooltip, className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    onClick();
                }}
                disabled={isLoading}
                className="group relative flex items-center justify-center"
                title={tooltip || "AI Optimize"}
            >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-[#EDFF8C] rounded-lg blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>

                {/* Main Button Body - Primary Brand Style */}
                <div className={`
                    relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isLoading
                        ? 'bg-slate-900 text-[#EDFF8C]'
                        : 'bg-[#EDFF8C] text-slate-900 group-hover:scale-110 shadow-lg shadow-[#EDFF8C]/20'
                    }
                    border border-white/20
                `}>
                    {isLoading ? (
                        <i className="fa-solid fa-sparkles animate-spin text-[10px]"></i>
                    ) : (
                        <i className="fa-solid fa-wand-magic-sparkles text-[10px] group-hover:animate-bounce-slow"></i>
                    )}
                </div>
            </button>

            {/* Premium Tooltip */}
            {tooltip && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[110]">
                    <div className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-white/10">
                        {tooltip}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InlineAIButton;
