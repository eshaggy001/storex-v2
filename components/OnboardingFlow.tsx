import React, { useState } from 'react';
import { StoreInfo } from '../types';
import { validateReferralCode, transitionBusinessState } from '../stateTransitions';

interface OnboardingProps {
  store: StoreInfo;
  updateStore: (updates: Partial<StoreInfo>) => void;
  onComplete: () => void;
  language?: string;
}

/**
 * Storex Onboarding Flow - State-Driven Architecture
 * 
 * Flow Structure:
 * 1. User Onboarding (ANONYMOUS → AUTHENTICATED)
 *    - Sign Up / Log In / Password Reset
 *    - No business context at this stage
 * 
 * 2. Business Onboarding (Referral-Gated)
 *    - Referral Code Check
 *    - If valid → Business Creation → ACTIVE
 *    - If invalid/none → Access Request → Wait for approval
 * 
 * Key Principles:
 * - User can sign up without creating business
 * - Business creation requires valid referral code
 * - No setup blocks main app access
 * - Business becomes ACTIVE immediately after name + category
 */
const OnboardingFlow: React.FC<OnboardingProps> = ({ store, updateStore, onComplete, language = 'en' }) => {
  // Onboarding stage: 'user' | 'business_referral' | 'business_create' | 'access_request'
  const [stage, setStage] = useState<string>('user');
  const [isTyping, setIsTyping] = useState(false);

  // User onboarding state
  const [authMode, setAuthMode] = useState<'signup' | 'login' | 'reset'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Business onboarding state
  const [referralCode, setReferralCode] = useState('');
  const [referralError, setReferralError] = useState('');
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(language === 'mn' ? 'Хувцас & Загвар' : 'Fashion & Apparel');

  // Access request state
  const [accessRequestName, setAccessRequestName] = useState('');
  const [accessRequestCategory, setAccessRequestCategory] = useState('');
  const [accessRequestContact, setAccessRequestContact] = useState('');

  const t = (en: string, mn: string) => language === 'mn' ? mn : en;

  const nextStage = (newStage: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStage(newStage);
    }, 800);
  };

  // ============================================================================
  // USER ONBOARDING HANDLERS
  // ============================================================================

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: await api.signUp(email, password)
    // For now, mock authentication
    nextStage('business_referral');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: await api.login(email, password)
    nextStage('business_referral');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    // In production: await api.resetPassword(email)
    alert(t('Password reset link sent to your email', 'Нууц үг сэргээх холбоосыг имэйл рүү илгээлээ'));
    setAuthMode('login');
  };

  // ============================================================================
  // BUSINESS ONBOARDING HANDLERS (Referral-Gated)
  // ============================================================================

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReferralError('');
    setIsValidatingReferral(true);

    const isValid = await validateReferralCode(referralCode);
    setIsValidatingReferral(false);

    if (isValid) {
      // Valid referral → proceed to business creation
      nextStage('business_create');
    } else {
      // Invalid referral → show error
      setReferralError(t(
        'Invalid referral code. Please check and try again.',
        'Буруу урилгын код. Дахин оролдоно уу.'
      ));
    }
  };

  const handleBusinessCreate = (e: React.FormEvent) => {
    e.preventDefault();

    // Update business to ACTIVE state
    updateStore({
      name: businessName,
      category: businessCategory,
      status: 'ACTIVE', // State machine: BUSINESS_CREATED → ACTIVE
      referral_code_used: referralCode,
    });

    // Complete onboarding - user can now access main app
    onComplete();
  };

  const handleAccessRequest = (e: React.FormEvent) => {
    e.preventDefault();

    // In production: await api.submitAccessRequest({ name, category, contact })
    // For now, just show the waiting screen
    nextStage('access_requested');
  };

  const handleSkipReferral = () => {
    // User doesn't have referral code → show access request form
    nextStage('access_request');
  };

  // ============================================================================
  // RENDER STAGES
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center relative overflow-hidden text-white font-['Manrope']">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EDFF8C] rounded-full opacity-10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-50 rounded-full opacity-10 blur-[100px]"></div>

      <div className="relative z-10 w-full max-w-lg px-8">

        {/* ====================================================================== */}
        {/* STAGE: USER ONBOARDING (Sign Up / Login / Password Reset) */}
        {/* ====================================================================== */}

        {stage === 'user' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-[#EDFF8C] rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(237,255,140,0.3)]">
                <i className="fa-solid fa-bolt text-4xl text-black"></i>
              </div>
              <h1 className="text-5xl font-semibold tracking-tighter">Storex AI</h1>
              <p className="text-lg text-slate-400 font-normal">
                {t('Your AI sales person for social commerce', 'Таны AI худалдааны туслах')}
              </p>
            </div>

            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('Email or Phone', 'Имэйл эсвэл утас')}
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('your@email.com', 'your@email.com')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('Password', 'Нууц үг')}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                  />
                </div>
                <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                  {t('Sign Up', 'Бүртгүүлэх')}
                </button>
                <div className="text-center text-sm text-slate-400">
                  {t('Already have an account?', 'Бүртгэлтэй юу?')}{' '}
                  <button type="button" onClick={() => setAuthMode('login')} className="text-white underline">
                    {t('Log in', 'Нэвтрэх')}
                  </button>
                </div>
              </form>
            )}

            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('Email or Phone', 'Имэйл эсвэл утас')}
                  </label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('your@email.com', 'your@email.com')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('Password', 'Нууц үг')}
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                  />
                </div>
                <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                  {t('Log In', 'Нэвтрэх')}
                </button>
                <div className="flex justify-between text-sm">
                  <button type="button" onClick={() => setAuthMode('reset')} className="text-slate-400 hover:text-white">
                    {t('Forgot password?', 'Нууц үг мартсан?')}
                  </button>
                  <button type="button" onClick={() => setAuthMode('signup')} className="text-white underline">
                    {t('Sign up', 'Бүртгүүлэх')}
                  </button>
                </div>
              </form>
            )}

            {authMode === 'reset' && (
              <form onSubmit={handlePasswordReset} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('Email', 'Имэйл')}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('your@email.com', 'your@email.com')}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                  />
                </div>
                <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                  {t('Send Reset Link', 'Сэргээх холбоос илгээх')}
                </button>
                <div className="text-center text-sm">
                  <button type="button" onClick={() => setAuthMode('login')} className="text-slate-400 hover:text-white">
                    ← {t('Back to login', 'Нэвтрэх рүү буцах')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ====================================================================== */}
        {/* STAGE: BUSINESS REFERRAL CHECK */}
        {/* ====================================================================== */}

        {stage === 'business_referral' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <i className="fa-solid fa-robot text-xs"></i>
                <span className="text-[11px] font-semibold uppercase tracking-widest">{t('AI Assistant', 'AI Туслах')}</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                {t(
                  "Welcome! To create your business on Storex, you'll need a referral code from an existing merchant. Do you have one?",
                  "Тавтай морил! Storex дээр бизнес үүсгэхийн тулд урилгын код хэрэгтэй. Танд байгаа юу?"
                )}
              </p>
            </div>

            <form onSubmit={handleReferralSubmit} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Referral Code', 'Урилгын код')}
                </label>
                <input
                  type="text"
                  required
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                    setReferralError('');
                  }}
                  placeholder="STOREX-XXXXX"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] uppercase"
                />
                {referralError && (
                  <p className="text-red-400 text-sm mt-2">{referralError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isValidatingReferral}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors disabled:opacity-50"
              >
                {isValidatingReferral ? t('Validating...', 'Шалгаж байна...') : t('Continue', 'Үргэлжлүүлэх')}
              </button>
              <button
                type="button"
                onClick={handleSkipReferral}
                className="w-full text-slate-400 text-sm hover:text-white"
              >
                {t("I don't have a referral code", 'Надад урилгын код байхгүй')}
              </button>
            </form>
          </div>
        )}

        {/* ====================================================================== */}
        {/* STAGE: BUSINESS CREATION (Valid Referral) */}
        {/* ====================================================================== */}

        {stage === 'business_create' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <p className="text-lg font-medium">
                {t(
                  "Perfect! Let's create your business. This will only take a moment.",
                  "Гоё! Одоо бизнесээ үүсгэцгээе. Энэ хэдхэн секунд л болно."
                )}
              </p>
            </div>

            <form onSubmit={handleBusinessCreate} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Business Name', 'Бизнесийн нэр')}
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder={t('e.g. Urban Threads', 'ж.нь: Urban Threads')}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Category', 'Ангилал')}
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] cursor-pointer"
                >
                  <option>{t('Fashion & Apparel', 'Хувцас & Загвар')}</option>
                  <option>{t('Home & Living', 'Гэр ахуй')}</option>
                  <option>{t('Beauty & Personal Care', 'Гоо сайхан')}</option>
                  <option>{t('Electronics', 'Цахилгаан бараа')}</option>
                  <option>{t('Food & Beverage', 'Хоол унд')}</option>
                  <option>{t('Services', 'Үйлчилгээ')}</option>
                  <option>{t('Other', 'Бусад')}</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                {t('Create Business', 'Бизнес үүсгэх')}
              </button>
            </form>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
              <p className="text-sm text-blue-200">
                <i className="fa-solid fa-info-circle mr-2"></i>
                {t(
                  'Your business will be active immediately. You can add products and start selling right away!',
                  'Таны бизнес шууд идэвхжинэ. Та бүтээгдэхүүн нэмж, зарж эхлэх боломжтой!'
                )}
              </p>
            </div>
          </div>
        )}

        {/* ====================================================================== */}
        {/* STAGE: ACCESS REQUEST (No Referral Code) */}
        {/* ====================================================================== */}

        {stage === 'access_request' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#EDFF8C] text-black p-6 rounded-2xl rounded-tl-sm shadow-xl">
              <p className="text-lg font-medium">
                {t(
                  "No problem! Submit an access request and we'll notify you when access is available.",
                  "Асуудалгүй! Хандалтын хүсэлт илгээгээрэй, бид танд хандалт нээгдэх үед мэдэгдэх болно."
                )}
              </p>
            </div>

            <form onSubmit={handleAccessRequest} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Business Name', 'Бизнесийн нэр')}
                </label>
                <input
                  type="text"
                  required
                  value={accessRequestName}
                  onChange={(e) => setAccessRequestName(e.target.value)}
                  placeholder={t('Your business name', 'Таны бизнесийн нэр')}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Category', 'Ангилал')}
                </label>
                <select
                  value={accessRequestCategory}
                  onChange={(e) => setAccessRequestCategory(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C] cursor-pointer"
                >
                  <option value="">{t('Select category', 'Ангилал сонгох')}</option>
                  <option>{t('Fashion & Apparel', 'Хувцас & Загвар')}</option>
                  <option>{t('Home & Living', 'Гэр ахуй')}</option>
                  <option>{t('Beauty & Personal Care', 'Гоо сайхан')}</option>
                  <option>{t('Electronics', 'Цахилгаан бараа')}</option>
                  <option>{t('Food & Beverage', 'Хоол унд')}</option>
                  <option>{t('Services', 'Үйлчилгээ')}</option>
                  <option>{t('Other', 'Бусад')}</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
                  {t('Contact (Email or Phone)', 'Холбоо барих (Имэйл эсвэл утас)')}
                </label>
                <input
                  type="text"
                  required
                  value={accessRequestContact}
                  onChange={(e) => setAccessRequestContact(e.target.value)}
                  placeholder={t('your@email.com or phone', 'your@email.com эсвэл утас')}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#EDFF8C]"
                />
              </div>
              <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-[#EDFF8C] transition-colors">
                {t('Submit Request', 'Хүсэлт илгээх')}
              </button>
              <button
                type="button"
                onClick={() => setStage('business_referral')}
                className="w-full text-slate-400 text-sm hover:text-white"
              >
                ← {t('Back', 'Буцах')}
              </button>
            </form>
          </div>
        )}

        {/* ====================================================================== */}
        {/* STAGE: ACCESS REQUESTED (Waiting for Approval) */}
        {/* ====================================================================== */}

        {stage === 'access_requested' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-blue-500/30">
              <i className="fa-solid fa-clock text-4xl text-blue-300"></i>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight">
              {t('Request Submitted', 'Хүсэлт илгээгдлээ')}
            </h1>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left space-y-3">
              <p className="text-slate-300">
                {t(
                  "Your access request has been received. We'll notify you when access is available.",
                  "Таны хүсэлт хүлээн авлаа. Хандалт нээгдэх үед бид танд мэдэгдэх болно."
                )}
              </p>
              <p className="text-sm text-slate-400">
                {t(
                  "In the meantime, you can explore Storex or contact us if you have questions.",
                  "Энэ хооронд та Storex-тэй танилцах эсвэл асуулт байвал бидэнтэй холбогдож болно."
                )}
              </p>
            </div>
            <div className="text-sm text-slate-400">
              {t('Questions?', 'Асуулт байна уу?')} <a href="mailto:support@storex.mn" className="text-white underline">support@storex.mn</a>
            </div>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="absolute bottom-10 left-8 flex gap-1.5 p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[#EDFF8C] rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;