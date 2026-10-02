import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const DealsOfTheDay: React.FC = () => {
  const { products, setQuickViewProduct, setSelectedCategory } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 16, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.slice(0, 6);

  const handleViewAll = () => {
    setSelectedCategory('All');
    const el = document.getElementById('shop-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-[1360px] mx-auto px-2 sm:px-4 py-3">
      <div className="bg-[#263936] text-[#F1EFE5] rounded-xl shadow-forest border border-[#355247] p-4 sm:p-5">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-[#355247] gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-xl font-serif font-light text-[#F1EFE5]">
              Deals of the Day
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#172421] text-[#8A9C82] text-xs font-semibold border border-[#355247]">
              <Clock className="w-3.5 h-3.5 text-[#8A9C82]" />
              <span className="font-mono">
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          <button
            onClick={handleViewAll}
            className="self-start sm:self-auto px-4 py-1.5 bg-[#355247] hover:bg-[#436558] text-[#F1EFE5] border border-[#8A9C82]/30 text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs"
          >
            VIEW ALL
          </button>
        </div>

        {/* Horizontal Deals Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {dealProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setQuickViewProduct(prod)}
              className="p-3 rounded-lg border border-[#355247] hover:border-[#8A9C82]/60 hover:shadow-forest transition-all cursor-pointer flex flex-col justify-between group bg-[#1E2D2A] text-center"
            >
              <div className="relative aspect-square w-full mb-3 flex items-center justify-center p-3 bg-[#F7F5ED] rounded overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300"
                />
                <span className="absolute bottom-1 left-1 bg-[#172421] text-[#8A9C82] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-[#355247]">
                  {prod.discount}% off
                </span>
              </div>

              <div>
                <h3 className="text-xs font-medium text-[#F1EFE5] line-clamp-1 group-hover:text-[#8A9C82] transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs font-serif font-light text-[#dfab7e] mt-1">
                  From ₹{prod.price}
                </p>
                <p className="text-[11px] text-[#8A9C82] mt-0.5 truncate">
                  {prod.category}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
