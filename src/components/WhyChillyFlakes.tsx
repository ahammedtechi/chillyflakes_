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
    description: 'From 100% plastic-free paper packaging to durable lifetime materials, our entire philosophy is built around mindful consumption.',
  },
];

export const WhyChillyFlakes: React.FC = () => {
  return (
    <section id="why-us-section" className="py-20 sm:py-28 bg-[#263936] text-[#F1EFE5] border-b border-[#2D403D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[10px] font-semibold tracking-editorial uppercase text-[#8A9C82] block mb-2">
            CONSCIOUS HOMEMAKING
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#F1EFE5] tracking-tight">
            WHY CHILLY FLAKES
          </h2>
          <p className="text-sm text-[#F1EFE5]/75 mt-2 font-light">
            An old wooden kitchen store ethos reimagined for modern, sustainable homes.
          </p>
        </div>

        {/* Four Large Feature Blocks with Large Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.number}
                className="bg-[#1E2D2A] rounded-xl p-7 border border-[#355247] hover:border-[#8A9C82]/60 transition-all duration-300 flex flex-col justify-between group shadow-forest"
              >
                <div>
                  {/* Top Bar: Large Number & Minimal Icon */}
                  <div className="flex items-start justify-between mb-8 pb-4 border-b border-[#355247]">
                    <span className="font-serif text-3xl sm:text-4xl font-light text-[#8A9C82] group-hover:text-[#F1EFE5] transition-colors">
                      {feat.number}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-[#355247] flex items-center justify-center text-[#8A9C82] group-hover:border-[#F1EFE5]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Exact Quote */}
                  <h3 className="font-serif text-base sm:text-lg font-medium tracking-luxury text-[#F1EFE5] mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F7F5ED] font-serif italic mb-3">
                    “{feat.quote}”
                  </p>

                  {/* Description */}
                  <p className="text-xs text-[#F1EFE5]/70 font-light leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#355247]/40 flex items-center text-[10px] uppercase tracking-luxury text-[#8A9C82] group-hover:text-[#F1EFE5] transition-colors">
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
