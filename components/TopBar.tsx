import React from 'react';
import { StoreInfo, UserProfile } from '../types';

interface TopBarProps {
  store: StoreInfo;
  user: UserProfile;
  language: 'mn' | 'en';
  onProfileClick: () => void;
  onViewStore: () => void;
  onToggleLanguage: (lang: 'mn' | 'en') => void;
}

const TopBar: React.FC<TopBarProps> = ({ store, user, language, onProfileClick, onViewStore, onToggleLanguage }) => {
  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-[#F8F9FA]/80 backdrop-blur-md font-['Manrope']">
      <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400 uppercase tracking-widest leading-none">
        <span>{language === 'mn' ? 'Хянах самбар' : 'Retail Dashboard'}</span>
        <i className="fa-solid fa-chevron-right text-[8px] opacity-40"></i>
        <span className="text-[#1A1A1A] font-semibold">{store.category}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
           <button 
             onClick={() => onToggleLanguage('mn')}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'mn' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-slate-400 hover:text-black'}`}
           >
             MN
           </button>
           <button 
             onClick={() => onToggleLanguage('en')}
             className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-slate-400 hover:text-black'}`}
           >
             EN
           </button>
        </div>

        <button 
          onClick={onViewStore}
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 hover:bg-indigo-100 transition-all font-bold text-[12px] uppercase tracking-wider"
        >
          <i className="fa-solid fa-eye"></i>
          {language === 'mn' ? 'Мини вэб харах' : 'View Live Store'}
        </button>

        <div className="hidden lg:flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 gap-3 shadow-sm group transition-all focus-within:border-slate-400">
          <i className="fa-solid fa-magnifying-glass text-slate-300 transition-colors group-focus-within:text-slate-500 text-[14px]"></i>
          <input 
            type="text" 
            placeholder={language === 'mn' ? "Хайх..." : "Search..."}
            className="bg-transparent border-none text-[14px] font-normal outline-none w-48 placeholder:text-slate-400"
          />
          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-400 leading-none">⌘K</span>
        </div>

        <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3">
          <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#1A1A1A] flex items-center justify-center hover:bg-slate-50 transition-all relative">
            <i className="fa-solid fa-bell text-lg"></i>
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
          </button>
          <button 
            onClick={onProfileClick}
            className="w-12 h-12 rounded-2xl bg-[#1A1A1A] overflow-hidden p-0.5 hover:ring-2 hover:ring-[#EDFF8C] transition-all shadow-md group"
            title={language === 'mn' ? "Профайл" : "View Profile"}
          >
            <img src={user.avatar} className="w-full h-full object-cover rounded-[0.9rem] group-hover:scale-105 transition-transform" alt="Profile" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;