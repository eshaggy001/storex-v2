import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'failed';
type OTPField = 'email' | 'phoneNumber' | null;

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDanModalOpen, setIsDanModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [verificationDate, setVerificationDate] = useState<string | null>(null);

  // OTP States
  const [otpTarget, setOtpTarget] = useState<{ field: OTPField; value: string } | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isOtpError, setIsOtpError] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    notifications: { ...user.notifications }
  });

  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});
  const [editingField, setEditingField] = useState<'email' | 'phoneNumber' | null>(null);

  const triggerAutoSave = (field: string) => {
    setSaveStatus(prev => ({ ...prev, [field]: 'saving' }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [field]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [field]: 'idle' })), 2000);
    }, 600);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveField = (field: keyof typeof formData) => {
    const currentValue = (user as any)[field];
    const newValue = formData[field];

    if (newValue === currentValue) return;

    // Email and Phone Number require OTP verification
    if (field === 'email' || field === 'phoneNumber') {
      setOtpTarget({ field, value: newValue as string });
      setOtpCode('');
      setIsOtpError(false);
      setEditingField(null); // Close edit mode after triggering OTP
      return;
    }

    // Other fields (like fullName) save directly
    onUpdate({ [field]: newValue });
    triggerAutoSave(field as string);
  };

  const confirmOtp = () => {
    if (otpCode.length < 4) return;

    setIsOtpLoading(true);
    setIsOtpError(false);

    // Simulate backend verification
    setTimeout(() => {
      if (otpCode === '1234' || otpCode === '123456') { // Demo codes
        if (otpTarget) {
          onUpdate({ [otpTarget.field as string]: otpTarget.value });
          triggerAutoSave(otpTarget.field as string);
          setOtpTarget(null);
        }
      } else {
        setIsOtpError(true);
      }
      setIsOtpLoading(false);
    }, 1500);
  };

  const handleToggleNotification = (field: keyof typeof formData.notifications) => {
    const nextVal = !formData.notifications[field];
    const updatedNotifs = { ...formData.notifications, [field]: nextVal };
    setFormData(prev => ({ ...prev, notifications: updatedNotifs }));
    onUpdate({ notifications: updatedNotifs });
    triggerAutoSave(field as string);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPendingAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const confirmAvatar = () => {
    if (!pendingAvatar) return;
    onUpdate({ avatar: pendingAvatar });
    setPendingAvatar(null);
    triggerAutoSave('avatar');
  };

  const cancelAvatar = () => setPendingAvatar(null);

  // DAN Verification Flow Simulation
  const startDanVerification = () => {
    setIsDanModalOpen(true);
  };

  const processVerification = (simulateSuccess: boolean = true) => {
    setIsDanModalOpen(false);
    setVerificationStatus('pending');
    setTimeout(() => {
      if (simulateSuccess) {
        setVerificationStatus('verified');
        setVerificationDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      } else {
        setVerificationStatus('failed');
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 font-['Manrope'] animate-fade-in relative">
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Personal Profile</h1>
        <p className="text-slate-500 font-normal text-[14px]">Manage your account identity, security, and personal preferences.</p>
      </div>

      <div className="space-y-10">

        {/* 1. BASIC INFORMATION (CARD) */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-10 space-y-12">
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* Avatar section */}
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 rounded-[2.5rem] border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-50 relative">
                  <img
                    src={pendingAvatar || user.avatar}
                    className={`w-full h-full object-cover transition-all ${pendingAvatar ? 'opacity-50 blur-[2px]' : ''}`}
                    alt="Avatar"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <i className="fa-solid fa-camera text-xl"></i>
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />

                {pendingAvatar && (
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 flex gap-2 animate-fade-in z-20">
                    <button onClick={(e) => { e.stopPropagation(); confirmAvatar(); }} className="bg-black text-[#EDFF8C] p-2 rounded-xl shadow-lg hover:scale-110 transition-all"><i className="fa-solid fa-check text-sm"></i></button>
                    <button onClick={(e) => { e.stopPropagation(); cancelAvatar(); }} className="bg-white text-rose-500 p-2 rounded-xl shadow-lg border border-slate-100 hover:scale-110 transition-all"><i className="fa-solid fa-xmark text-sm"></i></button>
                  </div>
                )}
              </div>

              <div className="flex-1 grid grid-cols-1 gap-8 w-full">
                {/* Full Name */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">Full Name</label>
                    {saveStatus.fullName === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                    {saveStatus.fullName === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => saveField('fullName')}
                    placeholder="Enter your full name"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-semibold text-[#1A1A1A] outline-none focus:bg-white focus:border-black focus:ring-4 focus:ring-slate-50 transition-all"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">Phone Number</label>
                    <div className="flex items-center gap-2">
                      {saveStatus.phoneNumber === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                      {saveStatus.phoneNumber === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      {editingField !== 'phoneNumber' && (
                        <button
                          onClick={() => setEditingField('phoneNumber')}
                          className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-black transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                  {editingField === 'phoneNumber' ? (
                    <div className="flex gap-2 animate-fade-in">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        autoFocus
                        placeholder="+976 9900-0000"
                        className="flex-1 bg-white border border-black rounded-2xl px-6 py-4 text-lg font-semibold text-[#1A1A1A] outline-none shadow-sm transition-all"
                      />
                      <button
                        onClick={() => saveField('phoneNumber')}
                        className="bg-black text-[#EDFF8C] px-6 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all active:scale-95"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => { setEditingField(null); setFormData(p => ({ ...p, phoneNumber: user.phoneNumber || '' })); }}
                        className="bg-slate-100 text-slate-400 px-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingField('phoneNumber')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-semibold text-[#1A1A1A] cursor-pointer hover:bg-slate-100 transition-all"
                    >
                      {user.phoneNumber || '+976 •••• ••••'}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">Email Address</label>
                    <div className="flex items-center gap-2">
                      {saveStatus.email === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                      {saveStatus.email === 'saved' && <i className="fa-solid fa-check text-emerald-500 text-[10px]"></i>}
                      {editingField !== 'email' && (
                        <button
                          onClick={() => setEditingField('email')}
                          className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:text-black transition-colors"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                  {editingField === 'email' ? (
                    <div className="flex gap-2 animate-fade-in">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoFocus
                        placeholder="name@example.com"
                        className="flex-1 bg-white border border-black rounded-2xl px-6 py-4 text-lg font-semibold text-[#1A1A1A] outline-none shadow-sm transition-all"
                      />
                      <button
                        onClick={() => saveField('email')}
                        className="bg-black text-[#EDFF8C] px-6 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all active:scale-95"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => { setEditingField(null); setFormData(p => ({ ...p, email: user.email })); }}
                        className="bg-slate-100 text-slate-400 px-4 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingField('email')}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-semibold text-[#1A1A1A] cursor-pointer hover:bg-slate-100 transition-all flex items-center justify-between"
                    >
                      {user.email}
                      <i className="fa-solid fa-lock text-[12px] opacity-10"></i>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] text-slate-400 font-medium flex items-center gap-2">
                    <i className="fa-solid fa-circle-info text-[9px]"></i>
                    Identity update requires OTP verification
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. LANGUAGE PREFERENCE (CARD) */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 shadow-inner">
              <i className="fa-solid fa-earth-asia text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Language Selection</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">Stored at user-level, doesn't affect business data.</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-slate-100 rounded-[1.5rem] w-fit border border-slate-200 shadow-inner">
            <button
              onClick={() => onUpdate({ language: 'mn' })}
              className={`px-8 py-3.5 rounded-[1rem] text-[13px] font-bold transition-all ${user.language === 'mn' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Монгол (MN)
            </button>
            <button
              onClick={() => onUpdate({ language: 'en' })}
              className={`px-8 py-3.5 rounded-[1rem] text-[13px] font-bold transition-all ${user.language === 'en' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              English (EN)
            </button>
          </div>
        </section>

        {/* 3. IDENTITY VERIFICATION (DAN) - REMINDER CARD */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden group">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-500 shadow-inner">
                <i className="fa-solid fa-address-card text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Identity Verification (DAN)</h2>
                <p className="text-[13px] text-slate-500 font-medium mt-1">Verification is required only for payout eligibility.</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              {verificationStatus === 'unverified' && (
                <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">Not verified</span>
              )}
              {verificationStatus === 'pending' && (
                <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <i className="fa-solid fa-circle-notch fa-spin"></i> Pending
                </span>
              )}
              {verificationStatus === 'verified' && (
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-check"></i> Verified
                </span>
              )}
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group-hover:bg-slate-100/50 transition-colors">
            {verificationStatus === 'unverified' ? (
              <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex-1 space-y-2">
                  <p className="text-[14px] text-slate-700 font-semibold leading-relaxed">
                    Verify once to enable secure payouts
                  </p>
                  <p className="text-[13px] text-slate-500 font-normal leading-relaxed">
                    DAN verification confirm your identity via Mongolia's national digital system. This is mandatory for legal compliance when receiving payouts.
                  </p>
                </div>
                <button
                  onClick={startDanVerification}
                  className="px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl font-bold text-[13px] hover:bg-black transition-all shadow-lg flex items-center gap-3 shrink-0 uppercase tracking-widest active:scale-95"
                >
                  <img src="https://www.dan.gov.mn/favicon.ico" className="w-4 h-4 grayscale invert" alt="" />
                  Begin Verification
                </button>
              </div>
            ) : verificationStatus === 'verified' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Authenticated via</label>
                    <div className="flex items-center gap-2.5">
                      <img src="https://www.dan.gov.mn/favicon.ico" className="w-4 h-4" alt="" />
                      <p className="text-sm font-bold text-slate-900">DAN Digital Identity System</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Verification Date</label>
                    <p className="text-sm font-bold text-slate-900">{verificationDate || 'Jan 16, 2026'}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Verified Legal Name</label>
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">National Registration (DAN)</label>
                    <p className="text-sm font-bold text-slate-900">УП88••••••</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center space-y-5">
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mx-auto text-indigo-400 shadow-sm">
                  <i className="fa-solid fa-fingerprint text-3xl animate-pulse"></i>
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Connecting to Government Identity Node...</p>
              </div>
            )}
          </div>
        </section>

        {/* 3.1 REFERRAL PROGRAM (CARD) */}
        <section className="bg-slate-900 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#EDFF8C]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-white/5 rounded-[1.25rem] border border-white/10 flex items-center justify-center text-[#EDFF8C]">
                <i className="fa-solid fa-gift text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none">Growth & Referrals</h2>
                <p className="text-[13px] text-slate-400 font-medium mt-2">Bypass the access queue for a business partner.</p>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#EDFF8C]/10 border border-[#EDFF8C]/20 text-[#EDFF8C] rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
              1 Invite Available
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <p className="text-[14px] text-slate-300 font-medium leading-relaxed">
                Invite another store owner to join Storex. Your unique referral code allows them to skip the waiting list and start selling immediately.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[11px] text-slate-500 font-black overflow-hidden shadow-xl">
                      <i className="fa-solid fa-user"></i>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Join 2,400+ Trusted Merchants</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 flex flex-col justify-center">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 font-mono font-bold text-xl text-[#EDFF8C] tracking-[0.2em] flex items-center justify-between shadow-inner">
                  <span>SX-2921-G9</span>
                  <i className="fa-solid fa-ticket text-white/5"></i>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('SX-2921-G9');
                    alert('Referral code copied to clipboard!');
                  }}
                  className="bg-[#EDFF8C] text-black px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-[#EDFF8C]/10"
                >
                  Copy
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-bold text-center uppercase tracking-[0.2em]">Useeable only once per business</p>
            </div>
          </div>
        </section>

        {/* 4. SECURITY & SESSIONS (CARD) */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 shadow-inner">
              <i className="fa-solid fa-shield-halved text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Security & Auth Management</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">Control password and track account activities.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm group hover:border-slate-300 transition-colors">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password Settings</p>
                <p className="text-sm font-bold text-slate-900 tracking-[0.3em]">••••••••••••</p>
              </div>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="bg-white border border-slate-200 text-black px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm active:scale-95"
              >
                {isChangingPassword ? 'Cancel' : 'Change'}
              </button>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm opacity-90">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Login Activity</p>
                <div className="space-y-0.5">
                  <p className="text-[14px] font-bold text-slate-900">
                    {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">{user.lastLoginDevice || 'Unknown Device • Ulaanbaatar'}</p>
                </div>
              </div>
              <i className="fa-solid fa-clock-rotate-left text-slate-200 text-xl"></i>
            </div>
          </div>

          {isChangingPassword && (
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-10 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-black rounded-full"></div>
                <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Change Account Password</h4>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Current Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-base font-medium outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-mono" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">New Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-base font-medium outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Confirm New Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-base font-medium outline-none focus:border-black focus:ring-4 focus:ring-slate-100 transition-all font-mono" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setIsChangingPassword(false); triggerAutoSave('password'); }}
                className="w-full bg-black text-[#EDFF8C] py-5 rounded-2xl font-black text-[14px] uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-xl active:scale-[0.98]"
              >
                Confirm Security Update
              </button>
            </div>
          )}
        </section>

        {/* 5. PERSONAL NOTIFICATIONS (CARD) */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 shadow-inner">
              <i className="fa-solid fa-bell text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Personal Notifications</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">These settings affect you personally and don't override business rules.</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { id: 'personalOrders' as const, label: 'New Assigned Orders', desc: 'Get notified when an order relevant to your role changes state.' },
              { id: 'personalPayments' as const, label: 'Payment Success Alerts', desc: 'Receive personal notifications for successful payment processing.' },
              { id: 'systemAlerts' as const, label: 'System & Security Alerts', desc: 'Critical notifications about maintenance, security, and account updates.' }
            ].map(notif => (
              <div key={notif.id} className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-slate-300 transition-colors">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-[15px]">{notif.label}</h4>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-md">{notif.desc}</p>
                </div>
                <button
                  onClick={() => handleToggleNotification(notif.id)}
                  disabled={notif.id === 'systemAlerts'}
                  className={`w-16 h-9 rounded-full transition-all relative shadow-inner ${formData.notifications[notif.id] ? 'bg-indigo-600' : 'bg-slate-200'} ${notif.id === 'systemAlerts' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`absolute top-1.5 w-6 h-6 rounded-full bg-white transition-all shadow-md ${formData.notifications[notif.id] ? 'right-1.5' : 'left-1.5'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 6. ROLE & ACCESS STATUS (CENTERED CARD) */}
        <div className="flex justify-center py-6">
          <section className="bg-slate-50 w-full max-w-xl p-12 rounded-[3.5rem] border-2 border-slate-200 border-dashed text-center space-y-6 shadow-sm">
            <div className="inline-flex items-center gap-3 bg-[#1A1A1A] text-[#EDFF8C] px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl scale-110">
              <i className="fa-solid fa-crown text-[10px]"></i>
              Role: {user.role}
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Full Administrative Access</h3>
              <p className="text-slate-500 text-[15px] font-medium max-w-sm mx-auto leading-relaxed">
                As the primary owner, you have authority to manage all store members and all business settings.
              </p>
            </div>
          </section>
        </div>

        {/* 7. ACCOUNT ACTIONS (DESTRUCTIVE / LOGOUT) */}
        <div className="pt-10 flex flex-col sm:flex-row gap-6">
          <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-6 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 shadow-sm active:scale-95 group">
            <i className="fa-solid fa-sign-out-alt text-slate-400 group-hover:-translate-x-1 transition-transform"></i>
            Log Out Account
          </button>
          <button className="flex-1 bg-rose-50 border border-rose-100 text-rose-600 py-6 rounded-[2.5rem] font-black text-[13px] uppercase tracking-[0.2em] hover:bg-rose-100 transition-all active:scale-95">
            Delete Personal Account
          </button>
        </div>

      </div>

      {/* OTP VERIFICATION MODAL */}
      {otpTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in font-['Manrope']">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setOtpTarget(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                  <i className="fa-solid fa-shield-check text-lg"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Node Verification</h3>
              </div>
              <button onClick={() => setOtpTarget(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="text-center space-y-3">
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Enter the verification code dispatched to your {otpTarget.field === 'email' ? 'new email' : 'mobile'}:
                </p>
                <p className="text-lg font-bold text-slate-900 tracking-tight">{otpTarget.value}</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-3">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      setIsOtpError(false);
                    }}
                    placeholder="······"
                    className={`w-full bg-slate-50 border ${isOtpError ? 'border-rose-300 ring-rose-50' : 'border-slate-100 focus:border-black focus:ring-slate-50'} rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[0.5em] outline-none focus:ring-4 transition-all placeholder:text-slate-200`}
                  />
                </div>
                {isOtpError && (
                  <p className="text-center text-rose-500 text-xs font-bold animate-shake">Incorrect verification code. Please try again.</p>
                )}
              </div>

              <div className="space-y-4">
                <button
                  onClick={confirmOtp}
                  disabled={isOtpLoading || otpCode.length < 4}
                  className="w-full py-5 bg-[#1A1A1A] text-white rounded-2xl font-bold text-[14px] uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isOtpLoading ? (
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock-open text-[12px]"></i>
                      Verify Update
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpCode('');
                    setIsOtpError(false);
                  }}
                  className="w-full py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  Resend Code
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Security Protocol v2.4a</p>
            </div>
          </div>
        </div>
      )}

      {/* DAN MODAL - REUSED AS IS BUT SLIGHT POLISH */}
      {isDanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in font-['Manrope']">
          <div className="absolute inset-0 bg-[#1A1A1A]/95 backdrop-blur-xl" onClick={() => setIsDanModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="p-10 border-b border-slate-100 bg-white flex justify-between items-center text-center">
              <div className="w-full flex flex-col items-center gap-4">
                <div className="p-4 bg-indigo-50 rounded-[1.5rem] text-indigo-500">
                  <img src="https://www.dan.gov.mn/favicon.ico" className="w-10 h-10" alt="" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">DAN Identity Node</h3>
              </div>
              <button onClick={() => setIsDanModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-black transition-colors">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>

            <div className="p-10 space-y-10 flex-1">
              <div className="text-center space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Official Data Consent</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                  Confirm identity sharing from the DAN Digital Identity system. Storex will securely receive your <span className="text-indigo-600 font-bold">Verified Legal Name</span> and <span className="text-indigo-600 font-bold">Registration Number</span>.
                </p>
              </div>

              <div className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 text-[12px] font-bold text-slate-400 leading-relaxed">
                <i className="fa-solid fa-shield-check text-indigo-400 text-base"></i>
                <span>This is a one-time verification. Storex does not store or access your DAN password.</span>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  onClick={() => processVerification(true)}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95"
                >
                  <i className="fa-solid fa-fingerprint text-lg"></i>
                  Verify Now (Demo)
                </button>
                <button
                  onClick={() => processVerification(false)}
                  className="w-full py-5 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Simulate Failed Attempt
                </button>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">State Identity Infrastructure Integration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;