import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setQuickViewProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const results = searchTerm.trim() === ''
    ? []
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const popularSearches = [
    'Wooden Spoon',
    'Pre-Owned',
    'Ceramic Bowl',
    'Storage Jar',
    'Stainless Steel',
    'Tray'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-[#263936] text-left shadow-2xl transition-all w-full max-w-2xl border border-[#355247]">
          
          {/* Header Input */}
          <div className="p-4 sm:p-5 border-b border-[#355247] flex items-center gap-3 bg-[#1E2D2A]">
            <Search className="w-4 h-4 text-[#8A9C82] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH PIECES, WOODEN UTENSILS, CERAMICS, JARS..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#F1EFE5] placeholder-[#8A9C82]/60 focus:outline-none uppercase tracking-luxury font-light"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#8A9C82] hover:text-[#F1EFE5] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-2 py-1 text-[10px] font-mono rounded bg-[#172421] text-[#8A9C82] border border-[#355247]"
            >
              ESC
            </button>
          </div>

          {/* Suggestions */}
          {searchTerm.trim() === '' ? (
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-[#8A9C82] uppercase tracking-editorial mb-3">
                  FREQUENTLY SOUGHT
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="px-3 py-1.5 rounded-lg bg-[#1E2D2A] border border-[#355247] text-xs font-light text-[#F1EFE5] hover:border-[#8A9C82] transition-colors flex items-center gap-1.5"
                    >
                      <Tag className="w-3 h-3 text-[#8A9C82]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#355247] text-[11px] text-[#8A9C82] font-light">
                <p>Filter by material ("wood", "brass", "ceramic") or condition ("pre-owned", "like new").</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="p-3 max-h-96 overflow-y-auto divide-y divide-[#355247]">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setQuickViewProduct(product);
                    setIsSearchOpen(false);
                  }}
                  className="py-3 px-3 rounded-lg hover:bg-[#1E2D2A] cursor-pointer flex items-center justify-between gap-4 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F7F5ED] p-1.5 flex items-center justify-center flex-shrink-0 border border-[#355247]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-light text-sm text-[#F1EFE5] group-hover:text-[#F7F5ED] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#8A9C82] uppercase tracking-luxury">
                        <span>{product.condition}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-serif font-light text-sm text-[#F1EFE5]">
                      ₹{product.price}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A9C82] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#F1EFE5]/70">
              <p className="font-light text-sm">No items matching "{searchTerm}"</p>
              <p className="text-xs text-[#8A9C82] mt-1">
                Try searching for "spoon", "tray", "bowl", or "cup".
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
