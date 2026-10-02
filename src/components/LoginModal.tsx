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
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => { setIsLoginOpen(false); setOtpStep(false); }}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative transform overflow-hidden rounded-xl bg-[#263936] text-left shadow-forest-lg transition-all w-full max-w-2xl flex flex-col md:flex-row border border-[#355247] text-[#F1EFE5]">
          
          {/* Close button */}
          <button
            onClick={() => { setIsLoginOpen(false); setOtpStep(false); }}
            className="absolute top-3 right-3 text-[#8A9C82] hover:text-[#F1EFE5] z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Dark Forest Banner */}
          <div className="md:w-2/5 bg-[#172421] text-[#F1EFE5] p-7 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#355247]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-light tracking-tight">
                {otpStep ? 'Verify OTP' : 'Login'}
              </h2>
              <p className="text-xs sm:text-sm text-[#F1EFE5]/80 mt-3 leading-relaxed font-light">
                {otpStep
                  ? 'Please enter the 4-digit code sent to your mobile or email.'
                  : 'Get access to your Orders, Wishlist and Recommendations.'}
              </p>
            </div>

            <div className="hidden md:block pt-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1E2D2A] border border-[#355247] mx-auto flex items-center justify-center text-3xl mb-3">
                🛍️
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A9C82]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8A9C82]" />
                <span>100% Safe & Secure Login</span>
              </div>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="md:w-3/5 p-7 sm:p-8 flex flex-col justify-between space-y-6 bg-[#263936]">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!otpStep ? (
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9C82] uppercase tracking-wider block mb-1">
                    Enter Email / Mobile Number
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter Email / Mobile Number"
                    className="w-full py-2.5 px-3 border-b-2 border-[#355247] focus:border-[#8A9C82] bg-[#172421] text-sm text-[#F1EFE5] focus:outline-none placeholder-[#8A9C82]/60 rounded-t"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-semibold text-[#8A9C82] uppercase tracking-wider block mb-1">
                    Enter 4-Digit OTP (Use 1234)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full py-2.5 px-3 border-b-2 border-[#355247] focus:border-[#8A9C82] bg-[#172421] text-center tracking-widest text-lg font-mono text-[#F1EFE5] focus:outline-none rounded-t"
                    required
                  />
                </div>
              )}

              <p className="text-[11px] text-[#8A9C82] leading-relaxed font-light">
                By continuing, you agree to Chilly Flakes's{' '}
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("Terms of Use"); }} className="text-[#F1EFE5] font-semibold hover:underline">
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Privacy Policy"); }} className="text-[#F1EFE5] font-semibold hover:underline">
                  Privacy Policy
                </a>.
              </p>

              <button
                type="submit"
                className="w-full py-3 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-bold uppercase tracking-wider rounded shadow-forest transition-colors"
              >
                {otpStep ? 'VERIFY & PROCEED' : 'REQUEST OTP'}
              </button>

              {otpStep && (
                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="w-full text-center text-xs text-[#8A9C82] hover:text-[#F1EFE5] font-semibold"
                >
                  Change Email / Mobile Number
                </button>
              )}
            </form>

            <div className="pt-4 border-t border-[#355247] text-center">
              <button
                onClick={() => {
                  setInputValue('guest@chillyflakes.in');
                  loginUser('guest@chillyflakes.in');
                }}
                className="text-xs text-[#8A9C82] hover:text-[#F1EFE5] font-semibold"
              >
                New to Chilly Flakes? Quick Guest Login
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
