
import React, { useState } from 'react';
import { Customer } from '../types';

interface AddCustomerModalProps {
  onClose: () => void;
  onAdd: (customer: Partial<Customer>) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [channel, setChannel] = useState<'instagram' | 'facebook' | 'phone'>('phone');
  const [note, setNote] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneNumber) return;

    setIsValidating(true);
    setTimeout(() => {
      onAdd({
        name,
        phoneNumber,
        channel: channel === 'phone' ? 'phone' : channel as any,
        note
      });
      setIsValidating(false);
      onClose();
    }, 600);
  };

  const isPhoneValid = phoneNumber.length >= 8;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-fade-in font-['Manrope']">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Add customer</h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-0.5">Manual fallback entry</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Customer Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Bat-Ireedui"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Phone Number <span className="text-rose-500">*</span></label>
              <input 
                type="tel" 
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g. 99112233"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold transition-all placeholder:text-slate-300"
              />
              {phoneNumber && !isPhoneValid && (
                <p className="text-rose-500 text-[10px] font-bold mt-2 uppercase tracking-widest">
                  <i className="fa-solid fa-circle-exclamation mr-1"></i> Invalid phone format
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-3">Preferred Channel</label>
              <div className="flex gap-3">
                {(['phone', 'instagram', 'facebook'] as const).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setChannel(c)}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${
                      channel === c ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {c === 'phone' && <i className="fa-solid fa-phone text-[8px]"></i>}
                    {c === 'instagram' && <i className="fa-brands fa-instagram text-[10px]"></i>}
                    {c === 'facebook' && <i className="fa-brands fa-facebook text-[10px]"></i>}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Note (Optional)</label>
              <input 
                type="text" 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Prefers picking up from downtown office"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-black font-bold transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
             <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-500 shrink-0">
                <i className="fa-solid fa-wand-magic-sparkles text-xs"></i>
             </div>
             <p className="text-xs font-bold text-slate-500 leading-relaxed">
               {isValidating ? "AI is checking contact details..." : "I'll save this profile for you. You can create an order for this customer immediately after saving."}
             </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-500 font-black text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!name || !phoneNumber || !isPhoneValid || isValidating}
              className="flex-[2] bg-black text-white py-4 rounded-2xl font-black text-sm hover:bg-black/90 transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                "Save Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
