import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { newsletterApi } from '../api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await newsletterApi.subscribe(email);
      setIsSubscribed(true);
      showToast(res.data?.message || 'You are subscribed to the Chilly Flakes journal.', 'success');
    } catch {
      showToast('Subscription error. Please try again.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F4F6F2] text-[#1D251E] border-t border-[#E5EAE2]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Small Label */}
        <span className="text-[10px] font-bold tracking-wider uppercase text-[#3C4A3E] block mb-2">
          CHILLY FLAKES DISPATCH
        </span>

        {/* Large Heading */}
        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1D251E] tracking-tight mb-3">
          Stay in the Loop
        </h2>

        {/* Text */}
        <p className="text-sm sm:text-base text-[#5F6D61] font-normal max-w-md mx-auto mb-8 leading-relaxed">
          Get first access to new finds, special offers and fresh arrivals. 
          New pre-owned batches cataloged every week.
        </p>

        {/* Form */}
        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EAF0E6] border border-[#D5E1D3] text-[#3C4A3E] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#3C4A3E]" />
            <span>Thank you. You have joined the Chilly Flakes circle.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-5 py-3.5 rounded-full bg-white border border-[#DFE6DD] text-xs text-[#1D251E] placeholder-[#7F8F81] focus:outline-none focus:border-[#3C4A3E] shadow-2xs transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3.5 bg-[#3C4A3E] hover:bg-[#2C372D] disabled:bg-[#7E8F81] text-white text-xs font-bold uppercase tracking-wider transition-all rounded-full flex items-center justify-center gap-2 flex-shrink-0 shadow-xs cursor-pointer"
              >
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-[#7C8B7E] mt-3 font-normal">
              No advertising clutter. Only curated updates.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
