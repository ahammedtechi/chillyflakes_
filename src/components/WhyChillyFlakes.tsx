import React from 'react';
import { Recycle, IndianRupee, SearchCheck, Leaf } from 'lucide-react';

interface FeatureBlock {
  number: string;
  icon: React.ElementType;
  title: string;
  quote: string;
  description: string;
}

const features: FeatureBlock[] = [
  {
    number: '01',
    icon: Recycle,
    title: 'SECOND LIFE',
    quote: 'Useful products get another chance.',
    description: 'Every utensil and pan given a second home preserves energy, prevents landfill waste, and keeps good craftsmanship in active circulation.',
  },
  {
    number: '02',
    icon: IndianRupee,
    title: 'BETTER VALUE',
    quote: 'Everyday essentials without unnecessary prices.',
    description: 'Direct sourcing of pre-owned treasures and honest new homeware keeps functional everyday tools accessible without excessive brand markup.',
  },
  {
    number: '03',
    icon: SearchCheck,
    title: 'CAREFULLY SELECTED',
    quote: 'Products are reviewed before listing.',
    description: 'Our workshop technicians hand-inspect structural soundness, wash thoroughly, and sanitize every pre-owned piece before it goes live.',
  },
  {
    number: '04',
    icon: Leaf,
    title: 'LESS WASTE',
    quote: 'Shop consciously and keep useful things in use.',
    description: 'From 100% plastic-free packaging to durable lifetime materials, our entire philosophy is built around mindful consumption.',
  },
];

export const WhyChillyFlakes: React.FC = () => {
  return (
    <section id="why-us-section" className="py-16 sm:py-24 bg-white text-[#1D251E] border-b border-[#E5EAE2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#3C4A3E] block mb-2">
            CONSCIOUS HOMEMAKING
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1D251E] tracking-tight">
            Why Chilly Flakes
          </h2>
          <p className="text-sm text-[#5F6D61] mt-2 font-normal">
            An artisan kitchen ethos reimagined for modern, sustainable homes.
          </p>
        </div>

        {/* Four Large Feature Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="bg-[#FAFBF9] rounded-3xl p-7 border border-[#E5EAE2] hover:border-[#3C4A3E]/50 hover:shadow-card transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Large Number & Minimal Icon */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#EEF2EB]">
                    <span className="font-serif text-3xl sm:text-4xl font-bold text-[#3C4A3E] group-hover:scale-105 transition-transform">
                      {feat.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#F0F4EE] border border-[#D5E1D3] flex items-center justify-center text-[#3C4A3E] group-hover:bg-[#3C4A3E] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Exact Quote */}
                  <h3 className="font-serif text-base sm:text-lg font-bold tracking-wide text-[#1D251E] mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#3C4A3E] font-serif italic mb-3">
                    “{feat.quote}”
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#5F6D61] font-normal leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EEF2EB] flex items-center text-[10px] font-semibold uppercase tracking-wider text-[#3C4A3E] group-hover:text-[#2C372D] transition-colors">
                  <span>Our Promise</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
