import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'failed';

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

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    notifications: { ...user.notifications }
  });
  
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<Record<string, 'idle' | 'saving' | 'saved'>>({});

  const triggerAutoSave = (field: string) => {
    setSaveStatus(prev => ({ ...prev, [field]: 'saving' }));
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, [field]: 'saved' }));
      setTimeout(() => setSaveStatus(prev => ({ ...prev, [field]: 'idle' })), 2000);
    }, 600);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setFormData(prev => ({ ...prev, fullName: nextValue }));
  };

  const saveName = () => {
    if (formData.fullName === user.fullName) return;
    onUpdate({ fullName: formData.fullName });
    triggerAutoSave('fullName');
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
        <p className="text-slate-500 font-normal text-[14px]">Manage your account details and security settings.</p>
      </div>

      <div className="space-y-10">
        
        {/* AVATAR & NAME */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-10 space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
               <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-[2rem] border-4 border-slate-50 shadow-xl overflow-hidden bg-slate-50 relative">
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

               <div className="flex-1 space-y-6 w-full">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Full Name</label>
                      {saveStatus.fullName === 'saving' && <i className="fa-solid fa-spinner fa-spin text-indigo-500 text-[10px]"></i>}
                    </div>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={handleNameChange}
                      onBlur={saveName}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-semibold text-[#1A1A1A] outline-none focus:border-black transition-all" 
                    />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block mb-2 leading-none">Email Address</label>
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-400 font-semibold text-base cursor-not-allowed flex items-center justify-between">
                      {user.email}
                      <i className="fa-solid fa-lock text-[10px]"></i>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* LANGUAGE PREFERENCE */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
              <i className="fa-solid fa-earth-asia"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">Language</h2>
              <p className="text-[12px] text-slate-500 font-medium">Choose your preferred interface language.</p>
            </div>
          </div>

          <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
             <button 
               onClick={() => onUpdate({ language: 'mn' })}
               className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${user.language === 'mn' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Mongolian (MN)
             </button>
             <button 
               onClick={() => onUpdate({ language: 'en' })}
               className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${user.language === 'en' ? 'bg-white text-black shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
             >
               English (EN)
             </button>
          </div>
        </section>

        {/* IDENTITY VERIFICATION (DAN) */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm">
                <i className="fa-solid fa-address-card"></i>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">Identity Verification</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-none">Powered by DAN</p>
                  <div className="group relative">
                    <i className="fa-solid fa-circle-info text-slate-300 text-[10px] cursor-help"></i>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-normal leading-relaxed">
                      DAN is Mongolia’s official digital identity system.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            {verificationStatus === 'unverified' && (
              <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-semibold uppercase tracking-widest">Not verified</span>
            )}
            {verificationStatus === 'pending' && (
              <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-semibold uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i> Processing
              </span>
            )}
            {verificationStatus === 'verified' && (
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <i className="fa-solid fa-circle-check"></i> Verified
              </span>
            )}
            {verificationStatus === 'failed' && (
              <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-[10px] font-semibold uppercase tracking-widest flex items-center gap-1.5">
                <i className="fa-solid fa-circle-exclamation"></i> Verification failed
              </span>
            )}
          </div>

          {/* ... Content ... */}
          <div className="relative z-10">
            {verificationStatus === 'unverified' && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex-1">
                  <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                    Verify your identity to confirm you are the business owner. This increases trust for AI-automated orders and secure payments.
                  </p>
                </div>
                <button onClick={startDanVerification} className="px-8 py-4 bg-black text-white rounded-2xl font-semibold text-[14px] hover:bg-slate-900 transition-all shadow-lg flex items-center gap-3 shrink-0">
                  <img src="https://www.dan.gov.mn/favicon.ico" className="w-4 h-4 grayscale invert" alt="" />
                  Verify with DAN
                </button>
              </div>
            )}
            {verificationStatus === 'pending' && (
              <div className="p-12 text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                   <i className="fa-solid fa-fingerprint text-3xl"></i>
                </div>
                <p className="text-slate-500 font-medium">Communicating with Identity Services...</p>
              </div>
            )}
            {verificationStatus === 'verified' && (
              <div className="p-8 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest block mb-1">Identity Provider</label>
                    <div className="flex items-center gap-2">
                       <img src="https://www.dan.gov.mn/favicon.ico" className="w-4 h-4" alt="" />
                       <p className="text-sm font-bold text-slate-900 leading-none">Verified via DAN System</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest block mb-1">Verification Date</label>
                    <p className="text-sm font-bold text-slate-900">{verificationDate}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest block mb-1">Verified Full Name</label>
                    <p className="text-sm font-bold text-slate-900">{user.fullName}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-emerald-700/50 uppercase tracking-widest block mb-1">Registration Number</label>
                    <p className="text-sm font-bold text-slate-900">УП88••••••</p>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-emerald-100 flex justify-end">
                   <button 
                    onClick={startDanVerification}
                    className="text-[11px] font-semibold text-emerald-700 uppercase tracking-widest hover:underline opacity-60 hover:opacity-100 transition-opacity"
                   >
                     Re-verify Identity
                   </button>
                </div>
              </div>
            )}
            {verificationStatus === 'failed' && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-8 bg-rose-50 rounded-[2rem] border border-rose-100 animate-fade-in">
                <div className="flex-1 space-y-1">
                  <p className="text-[14px] text-rose-900 font-bold leading-relaxed">
                    Identity mismatch or authentication cancelled.
                  </p>
                  <p className="text-[13px] text-rose-700/70 font-medium">
                    We couldn’t verify your identity. Please ensure you are using your own DAN credentials.
                  </p>
                </div>
                <button 
                  onClick={startDanVerification}
                  className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-semibold text-[14px] hover:bg-rose-700 transition-all shadow-lg flex items-center gap-3 shrink-0"
                >
                  Retry Verification
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECURITY */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">Account Access & Security</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Password</p>
                <p className="text-sm font-semibold text-slate-900 mt-1.5">••••••••••••</p>
              </div>
              <button 
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="bg-white border border-slate-200 text-black px-4 py-2 rounded-xl text-[12px] font-semibold uppercase tracking-wider hover:border-black transition-all shadow-sm"
              >
                {isChangingPassword ? 'Cancel' : 'Change'}
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between opacity-70">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Last Login</p>
                <p className="text-[13px] font-normal text-slate-900 mt-1.5">
                  {new Date(user.lastLogin).toLocaleDateString()} at {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <i className="fa-solid fa-clock-rotate-left text-slate-300"></i>
            </div>
          </div>

          {isChangingPassword && (
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-6 animate-slide-up">
              <h4 className="text-[13px] font-semibold text-slate-900 uppercase tracking-wider">Set New Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="password" placeholder="Current Password" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-black" />
                <input type="password" placeholder="New Password" className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-black" />
              </div>
              <button onClick={() => { setIsChangingPassword(false); triggerAutoSave('password'); }} className="w-full bg-black text-white py-4 rounded-2xl font-medium text-[14px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">Confirm Password Change</button>
            </div>
          )}
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm">
              <i className="fa-solid fa-user-gear"></i>
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight">Personal Notifications</h2>
          </div>

          <div className="space-y-4">
            {[
              { id: 'personalOrders' as const, label: 'Order status updates', desc: 'Get notified when an order assigned to you changes state.' },
              { id: 'personalPayments' as const, label: 'Payment confirmations', desc: 'Receive alerts when payments are verified.' },
              { id: 'systemAlerts' as const, label: 'Maintenance & news', desc: 'Stay updated on Storex platform maintenance.' }
            ].map(notif => (
              <div key={notif.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-slate-900 text-[14px]">{notif.label}</h4>
                  <p className="text-[12px] text-slate-500 font-normal leading-relaxed">{notif.desc}</p>
                </div>
                <button 
                  onClick={() => handleToggleNotification(notif.id)}
                  className={`w-14 h-8 rounded-full transition-all relative ${formData.notifications[notif.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${formData.notifications[notif.id] ? 'right-1' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ACCOUNT STATUS */}
        <section className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 border-dashed text-center space-y-4">
           <div className="inline-flex items-center gap-2 bg-black text-[#EDFF8C] px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-widest shadow-xl">
             <i className="fa-solid fa-crown text-[8px]"></i>
             Role: {user.role}
           </div>
           <h3 className="text-lg font-semibold text-slate-900">Full Administrative Access</h3>
           <p className="text-slate-500 text-[14px] font-normal max-w-sm mx-auto leading-relaxed">
             As the primary owner, you have authority to manage all store members.
           </p>
        </section>

        <div className="pt-10 flex flex-col sm:flex-row gap-4">
           <button className="flex-1 bg-white border border-slate-200 text-slate-900 py-5 rounded-[2rem] font-medium text-[14px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
             <i className="fa-solid fa-sign-out-alt text-slate-400"></i>
             Log Out Account
           </button>
           <button className="flex-1 bg-rose-50 border border-rose-100 text-rose-600 py-5 rounded-[2rem] font-medium text-[14px] uppercase tracking-widest hover:bg-rose-100 transition-all">
             Delete Personal Account
           </button>
        </div>

      </div>

      {/* DAN MODAL */}
      {isDanModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in font-['Manrope']">
          <div className="absolute inset-0 bg-[#1A1A1A]/95 backdrop-blur-xl" onClick={() => setIsDanModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
            <div className="p-8 border-b border-slate-100 bg-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="https://www.dan.gov.mn/favicon.ico" className="w-6 h-6" alt="" />
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">DAN Authentication</h3>
              </div>
              <button onClick={() => setIsDanModalOpen(false)} className="text-slate-400 hover:text-black">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>
            
            <div className="p-10 space-y-8 flex-1">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto text-indigo-500 shadow-inner">
                  <i className="fa-solid fa-user-shield text-3xl"></i>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900">Identity Consent</h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    By proceeding, you agree to share your verified full name and registration number from the DAN Digital Identity system with Storex.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[12px] font-medium text-slate-500">
                  <i className="fa-solid fa-lock text-indigo-400 mt-0.5"></i>
                  <span>This is a one-time verification. Storex does not store your DAN password.</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => processVerification(true)}
                  className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  Verify Now (Demo)
                </button>
                <button 
                  onClick={() => processVerification(false)}
                  className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-bold text-sm hover:border-rose-400 hover:text-rose-500 transition-all flex items-center justify-center gap-3"
                >
                  Simulate Failed Attempt
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mongolian Identity Infrastructure Integration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;