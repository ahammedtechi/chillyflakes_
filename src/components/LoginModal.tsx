import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';

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
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all w-full max-w-2xl flex flex-col md:flex-row border border-[#ECE7DD] text-[#223B28]">
          
          {/* Close button */}
          <button
            onClick={() => { setIsLoginOpen(false); setOtpStep(false); }}
            className="absolute top-4 right-4 text-[#7E8F80] hover:text-[#223B28] hover:bg-[#FAF7F2] rounded-full p-1.5 z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Forest Green Banner */}
          <div className="md:w-2/5 bg-[#243F29] text-white p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <Logo variant="light" size="sm" showTagline={false} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Welcome Back
              </h2>
              <p className="text-xs text-[#D1DEC0] mt-3 leading-relaxed">
                Log in to access your handcrafted favorites, order tracking, and artisan rewards.
              </p>
            </div>

            <div className="pt-6 border-t border-[#35523A] space-y-2 text-[11px] text-[#D1DEC0]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#A3C4A5]" />
                <span>100% Certified Local Artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#A3C4A5]">&bull;</span>
                <span>Fast & Safe Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Login Form */}
          <div className="md:w-3/5 p-7 sm:p-8 flex flex-col justify-between bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#223B28] mb-1.5">
                  Enter Mobile Number or Email
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. maya@example.com or +1 (555) 000-0000"
                  disabled={otpStep}
                  required
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#ECE7DD] rounded-xl focus:outline-none focus:border-[#2E4D34] focus:ring-1 focus:ring-[#2E4D34] text-[#223B28]"
                />
              </div>

              {otpStep && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#223B28]">
                      Enter 4-Digit OTP
                    </label>
                    <span className="text-[10px] text-[#2E4D34] font-medium">
                      Demo OTP: 1234
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="1234"
                    autoFocus
                    required
                    className="w-full px-3.5 py-2.5 text-center tracking-widest font-mono text-base border border-[#ECE7DD] rounded-xl focus:outline-none focus:border-[#2E4D34]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#2E4D34] hover:bg-[#233B27] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors"
              >
                {otpStep ? 'Verify & Continue' : 'Request OTP'}
              </button>
            </form>

            <div className="pt-6 border-t border-[#ECE7DD] text-center text-[11px] text-[#7E8F80]">
              By continuing, you agree to ChillyFlakes{' '}
              <a href="#terms" className="text-[#2E4D34] underline">Terms of Use</a> and{' '}
              <a href="#privacy" className="text-[#2E4D34] underline">Privacy Policy</a>.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginModal;
