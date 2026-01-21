import React from 'react';

interface AIInsightSummaryProps {
    title: string;
    impact: string;
    onClose: () => void;
}

const AIInsightSummary: React.FC<AIInsightSummaryProps> = ({ title, impact, onClose }) => {
    return (
        <div className="bg-dark rounded-super p-10 text-white relative overflow-hidden shadow-2xl animate-fade-up">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-lime/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 text-lime flex items-center justify-center text-xl shadow-lg">
                        <i className="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Мэргэжилтний зөвлөмж</p>
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none">{title}</h3>
                    </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ҮР ДҮН</p>
                    <div className="flex items-center gap-3 text-lime font-black text-3xl tracking-tighter shadow-lime/10 text-shadow">
                        <i className="fa-solid fa-chart-line-up"></i>
                        <span>{impact}</span>
                    </div>
                </div>

                <div className="md:max-w-xs">
                    <p className="text-sm font-medium text-slate-400 italic leading-relaxed">
                        "Таны гүйцэтгэл мэдэгдэхүйц нэмэгдлээ. Энэхүү эрч хүчээ хадгалах нь дэлгүүрийн тэлэлтэд чухал ач холбогдолтой юм."
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    );
};

export default AIInsightSummary;
