import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setIsSubscribed(true);
    showToast('You are subscribed to the Chilly Flakes journal.', 'success');
  };

  return (
    <section className="py-20 sm:py-28 bg-[#1E2D2A] text-[#F1EFE5] border-t border-[#2D403D]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Small Label */}
        <span className="text-[10px] font-semibold tracking-editorial uppercase text-[#8A9C82] block mb-3">
          CHILLY FLAKES DISPATCH
        </span>

        {/* Large Cream Heading */}
        <h2 className="text-3xl sm:text-5xl font-serif font-light text-[#F1EFE5] tracking-tight mb-3">
          STAY IN THE LOOP.
        </h2>

        {/* Text */}
        <p className="text-sm sm:text-base text-[#F1EFE5]/75 font-light max-w-md mx-auto mb-10 leading-relaxed">
          Get first access to new finds, special offers and fresh arrivals. 
          New pre-owned batches cataloged every week.
        </p>

        {/* Form with Thin Borders & Minimal Styling */}
        {isSubscribed ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#263936] border border-[#355247] text-[#F1EFE5] text-xs uppercase tracking-luxury">
            <CheckCircle2 className="w-4 h-4 text-[#8A9C82]" />
            <span>Thank you. You have joined the Chilly Flakes circle.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR EMAIL ADDRESS"
                className="flex-grow px-4 py-3.5 rounded-lg bg-[#172421] border border-[#355247] text-xs uppercase tracking-luxury text-[#F1EFE5] placeholder-[#8A9C82]/60 focus:outline-none focus:border-[#F1EFE5] transition-colors"
                required
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#F1EFE5] hover:bg-[#F7F5ED] text-[#172421] text-xs font-semibold tracking-luxury uppercase transition-all duration-200 rounded-lg flex items-center justify-center gap-2 flex-shrink-0"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] uppercase tracking-luxury text-[#8A9C82]/70 mt-3 font-light">
              No advertising clutter. Only curated updates.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
