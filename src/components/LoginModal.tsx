import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LoginModal: React.FC = () => {
  const { isLoginOpen, setIsLoginOpen, loginUser, showToast } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  if (!isLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      showToast('Please enter your Mobile number or Email ID', 'warning');
      return;
    }

    if (!otpStep) {
      setOtpStep(true);
      showToast('OTP sent to ' + inputValue + '. Enter 1234 to verify.', 'info');
    } else {
      if (otpValue.trim() === '1234' || otpValue.length === 4) {
        loginUser(inputValue);
        setOtpStep(false);
        setInputValue('');
        setOtpValue('');
      } else {
        showToast('Invalid OTP. Please enter 1234', 'warning');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => { setIsLoginOpen(false); setOtpStep(false); }}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6">
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl flex flex-col md:flex-row border border-[#E2E7DF] text-[#1D251E]">
          
          {/* Close button */}
          <button
            onClick={() => { setIsLoginOpen(false); setOtpStep(false); }}
            className="absolute top-4 right-4 text-[#5F6D61] hover:text-[#1D251E] hover:bg-[#F4F6F2] rounded-full p-1.5 z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Deep Olive Banner */}
          <div className="md:w-2/5 bg-[#3C4A3E] text-white p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm mb-4">
                🌿
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                {otpStep ? 'Verify OTP' : 'Log In'}
              </h2>
              <p className="text-xs sm:text-sm text-[#E4EBE2]/90 mt-3 leading-relaxed font-light">
                {otpStep
                  ? 'Please enter the 4-digit code sent to your mobile or email.'
                  : 'Access your orders, wishlist, verified pre-owned items, and special member pricing.'}
              </p>
            </div>

            <div className="hidden md:block pt-8 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#C4D3C2]">
                <ShieldCheck className="w-4 h-4 text-[#C4D3C2]" />
                <span>100% Encrypted & Safe Login</span>
              </div>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="md:w-3/5 p-7 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!otpStep ? (
                <div>
                  <label className="text-[11px] font-bold text-[#5F6D61] uppercase tracking-wider block mb-1.5">
                    Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full py-2.5 px-3.5 border border-[#DFE6DD] focus:border-[#3C4A3E] bg-[#F4F6F2] text-sm text-[#1D251E] focus:outline-none placeholder-[#7F8F81] rounded-xl"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-bold text-[#5F6D61] uppercase tracking-wider block mb-1.5">
                    Enter 4-Digit OTP (Use 1234)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="1234"
                    className="w-full py-2.5 px-3 border border-[#DFE6DD] focus:border-[#3C4A3E] bg-[#F4F6F2] text-center tracking-widest text-lg font-mono text-[#1D251E] focus:outline-none rounded-xl"
                    required
                  />
                </div>
              )}

              <p className="text-[11px] text-[#7C8B7E] leading-relaxed font-normal">
                By continuing, you agree to Chilly Flakes's{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use"); }} className="text-[#3C4A3E] font-semibold hover:underline">
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }} className="text-[#3C4A3E] font-semibold hover:underline">
                  Privacy Policy
                </a>.
              </p>

              <button
                type="submit"
                className="w-full py-3 bg-[#3C4A3E] hover:bg-[#2C372D] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs transition-colors"
              >
                {otpStep ? 'VERIFY & PROCEED' : 'REQUEST OTP'}
              </button>

              {otpStep && (
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-full text-center text-xs text-[#5F6D61] hover:text-[#1D251E] font-medium"
                >
                  Change Email / Mobile Number
                </button>
              )}
            </form>

            <div className="pt-4 border-t border-[#EEF2EB] text-center">
              <button
                onClick={() => {
                  setInputValue('guest@chillyflakes.in');
                  loginUser('guest@chillyflakes.in');
                }}
                className="text-xs text-[#3C4A3E] hover:underline font-semibold"
              >
                New to Chilly Flakes? One-Click Guest Login
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
