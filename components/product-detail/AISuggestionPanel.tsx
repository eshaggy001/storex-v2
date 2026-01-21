import React, { useState } from 'react';

interface AISuggestions {
    description: string;
    seoTitle: string;
    seoDescription: string;
    productType: string;
    tags: string[];
}

interface AISuggestionPanelProps {
    suggestions: AISuggestions;
    onApply: (field: string, value: any) => void;
    onClose: () => void;
}

const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({ suggestions, onApply, onClose }) => {
    const [appliedFields, setAppliedFields] = useState<Set<string>>(new Set());

    const handleApply = (field: string, value: any) => {
        onApply(field, value);
        setAppliedFields(prev => new Set(prev).add(field));
    };

    const sections = [
        { id: 'description', label: 'Description', content: suggestions.description },
        { id: 'seoTitle', label: 'SEO Title', content: suggestions.seoTitle },
        { id: 'seoDescription', label: 'SEO Description', content: suggestions.seoDescription },
        { id: 'tags', label: 'Tags', content: suggestions.tags.join(', '), value: suggestions.tags }
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#EDFF8C] flex items-center justify-center text-slate-900 shadow-lg shadow-[#EDFF8C]/20">
                            <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Optimization</h3>
                            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Premium Enhancements Suggested by Gemini</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {sections.map((section) => (
                        <div key={section.id} className="group relative bg-slate-50/50 rounded-3xl p-6 border border-slate-100 hover:border-[#EDFF8C] transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{section.label}</span>
                                <button
                                    disabled={appliedFields.has(section.id)}
                                    onClick={() => handleApply(section.id, section.value || section.content)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${appliedFields.has(section.id)
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-slate-900 text-[#EDFF8C] hover:scale-105 active:scale-95 shadow-lg shadow-black/10'
                                        }`}
                                >
                                    {appliedFields.has(section.id) ? (
                                        <><i className="fa-solid fa-check mr-2"></i> Applied</>
                                    ) : (
                                        'Apply Suggestion'
                                    )}
                                </button>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                                "{section.content}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        * suggestions based on current product visual and context
                    </p>
                    <button
                        onClick={onClose}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-xl"
                    >
                        Done Reviewing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AISuggestionPanel;
