import React, { useState, useRef, useEffect } from 'react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-24 px-10 flex items-center justify-between sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] leading-none">
        <span>{language === 'mn' ? 'Хянах самбар' : 'Retail Dashboard'}</span>
        <i className="fa-solid fa-chevron-right text-[8px] opacity-40"></i>
        <span className="text-dark font-bold">{store.category}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="flex bg-white p-1 rounded-input border border-dark/10 shadow-soft">
          <button
            onClick={() => onToggleLanguage('mn')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'mn' ? 'bg-dark text-white shadow-md' : 'text-slate-400 hover:text-dark'}`}
          >
            MN
          </button>
          <button
            onClick={() => onToggleLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${language === 'en' ? 'bg-dark text-white shadow-md' : 'text-slate-400 hover:text-dark'}`}
          >
            EN
          </button>
        </div>

        <button
          onClick={onViewStore}
          className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-white border border-dark/10 rounded-button text-dark hover:bg-bg transition-all font-bold text-[12px] uppercase tracking-wider shadow-soft"
        >
          <i className="fa-solid fa-eye text-slate-400"></i>
          {language === 'mn' ? 'Мини вэб харах' : 'View Live Store'}
        </button>

        <div className="hidden lg:flex items-center bg-white border border-dark/10 rounded-input px-4 py-2.5 gap-3 shadow-soft group transition-all focus-within:border-dark/30 focus-within:shadow-lime-focus">
          <i className="fa-solid fa-magnifying-glass text-slate-300 transition-colors group-focus-within:text-slate-500 text-[14px]"></i>
          <input
            type="text"
            placeholder={language === 'mn' ? "Хайх..." : "Search..."}
            className="bg-transparent border-none text-[14px] font-medium outline-none w-48 placeholder:text-slate-400"
          />
          <span className="text-[10px] bg-bg px-2 py-0.5 rounded font-bold text-slate-400 leading-none">⌘K</span>
        </div>

        <div className="h-10 w-[1px] bg-dark/5 mx-2"></div>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button className="w-12 h-12 rounded-xl bg-white border border-dark/10 text-dark flex items-center justify-center hover:bg-bg transition-all relative shadow-soft">
            <i className="fa-solid fa-bell text-lg"></i>
            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
          </button>

          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-12 h-12 rounded-xl bg-dark overflow-hidden p-0.5 hover:ring-4 hover:ring-lime/30 focus:ring-4 focus:ring-lime/50 transition-all shadow-lg group relative"
            title={user.fullName}
          >
            <img src={user.avatar} className="w-full h-full object-cover rounded-[0.6rem] group-hover:scale-110 transition-transform" alt="Profile" />
          </button>

          {/* User Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-card shadow-2xl border border-dark/5 py-4 z-50 animate-fade-up origin-top-right overflow-hidden">
              <div className="px-6 py-4 border-b border-dark/5 mb-2 bg-bg/30">
                <p className="text-[14px] font-bold text-dark truncate">{user.fullName}</p>
                <p className="text-[12px] font-medium text-slate-400 truncate">{user.email}</p>
              </div>

              <div className="px-2">
                <button
                  onClick={() => { onProfileClick(); setIsDropdownOpen(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-bg rounded-2xl transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <i className="fa-solid fa-user-circle text-slate-400 group-hover:text-dark transition-colors"></i>
                  </div>
                  <span className="text-[14px] font-bold text-slate-600 group-hover:text-dark">{language === 'mn' ? 'Миний профайл' : 'My Profile'}</span>
                </button>

                <div className="h-[1px] bg-dark/5 my-2 mx-4"></div>

                <button
                  onClick={() => { setIsDropdownOpen(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-rose-50 rounded-2xl transition-all flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-50/50 flex items-center justify-center group-hover:bg-white transition-colors">
                    <i className="fa-solid fa-sign-out-alt text-slate-400 group-hover:text-rose-500 transition-colors"></i>
                  </div>
                  <span className="text-[14px] font-bold text-slate-600 group-hover:text-rose-600">{language === 'mn' ? 'Гарах' : 'Log out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;