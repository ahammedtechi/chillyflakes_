import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'dark', 
  size = 'md',
  showTagline = true,
  className = '' 
}) => {
  const isLight = variant === 'light'; // Light text for dark green footer

  // Size mapping
  const iconSize = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';
  const tagSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Vector Icon: Curved Red Chilly resting on a Plate like a smile with Green Stem/Tail */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        aria-label="ChillyFlakes Logo - Curved Chilly on Plate"
      >
        <defs>
          {/* Chilly Body Gradient */}
          <linearGradient id="chillyGrad" x1="10" y1="20" x2="54" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF4633" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          {/* Chilly Highlight Sheen */}
          <linearGradient id="chillySheen" x1="16" y1="28" x2="48" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFA399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF4633" stopOpacity="0.1" />
          </linearGradient>

          {/* Green Stem Gradient */}
          <linearGradient id="stemGrad" x1="42" y1="8" x2="56" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5BB85C" />
            <stop offset="50%" stopColor="#2E7D32" />
            <stop offset="100%" stopColor="#1B5E20" />
          </linearGradient>

          {/* Plate Gradient */}
          <linearGradient id="plateGradDark" x1="8" y1="40" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8A9D8B" />
            <stop offset="50%" stopColor="#5D735F" />
            <stop offset="100%" stopColor="#3E5440" />
          </linearGradient>

          <linearGradient id="plateGradLight" x1="8" y1="40" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#E2ECE0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C4D5C2" stopOpacity="0.6" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Ceramic Plate / Saucer Base - Gently curved smiling base */}
        {/* Plate Shadow underneath */}
        <ellipse cx="32" cy="51" rx="20" ry="3.5" fill={isLight ? 'rgba(0,0,0,0.25)' : 'rgba(46,77,52,0.15)'} />

        {/* Plate Body - smiling cradle */}
        <path
          d="M 12 40 C 18 52, 46 52, 52 40 C 47 48, 17 48, 12 40 Z"
          fill={isLight ? 'url(#plateGradLight)' : 'url(#plateGradDark)'}
        />

        {/* Plate Rim Contour - graceful smile line */}
        <path
          d="M 10 39.5 C 18 50, 46 50, 54 39.5 C 48 45, 16 45, 10 39.5 Z"
          fill={isLight ? '#FFFFFF' : '#4E6750'}
          opacity={isLight ? 0.95 : 0.8}
        />

        {/* Plate Center Groove */}
        <path
          d="M 15 41.5 C 22 48.5, 42 48.5, 49 41.5"
          stroke={isLight ? 'rgba(255,255,255,0.6)' : '#334835'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* 2. Curved Red Chilly resting inside the plate like a joyful smile */}
        <g filter="url(#softGlow)">
          {/* Main Chilly Body: tapered tip at left (smiling up), plump belly in middle, crown at top-right */}
          <path
            d="M 12 31.5 
               C 17 38.5, 29 44, 43 38.5 
               C 47.5 36.5, 50.5 32.5, 50 27.5 
               C 49.5 24.5, 47 23.5, 44 24 
               C 38 25, 26 31, 19.5 28.5 
               C 15.5 27, 12.5 25, 12 31.5 Z"
            fill="url(#chillyGrad)"
          />

          {/* Smooth Upper Crest & Smiling Curve */}
          <path
            d="M 12 31.5 
               C 16 41, 32 44.5, 44 38 
               C 48.5 35.5, 50.2 31, 49.8 26.5 
               C 48.5 29.5, 45 33, 39 34 
               C 27 36, 17 33, 12 31.5 Z"
            fill="#B91C1C"
            opacity="0.6"
          />

          {/* Glossy Curved Highlight Sheen along the inner smile curve */}
          <path
            d="M 15 32 
               C 19 36, 29 39.5, 40 35.5 
               C 44 34, 46 31.5, 47 28.5 
               C 44.5 31, 38 34, 28 34 
               C 21 34, 17 31.5, 15 32 Z"
            fill="url(#chillySheen)"
          />

          {/* Cute Pepper Tip Shine */}
          <circle cx="13.5" cy="31.8" r="1.2" fill="#FFA59E" />
        </g>

        {/* 3. Fresh Green Calyx & Stem (Tail) at top-right */}
        <g>
          {/* Leafy Calyx points hugging chilly top */}
          <path
            d="M 43.5 25.5 
               C 44.5 22.5, 47 23, 49.5 24 
               C 50.5 24.5, 52 26.5, 51.5 28.5 
               C 50.5 27, 48 26.5, 46 27 
               C 44.5 27.5, 43 27, 43.5 25.5 Z"
            fill="url(#stemGrad)"
          />

          {/* Calyx mini sepal leaves */}
          <path
            d="M 46 25.5 
               C 47.5 23.5, 49.5 24, 48.5 26.5 Z"
            fill="#388E3C"
          />
          <path
            d="M 43.5 27 
               C 42 25, 44 24, 45.5 25.5 Z"
            fill="#2E7D32"
          />

          {/* Upward curved stalk / green tail */}
          <path
            d="M 48 24.5 
               C 49.5 19, 52 14, 55.5 11 
               C 56.5 10.2, 57.5 10.8, 56.8 11.8 
               C 54.5 15, 52 20, 50.5 24.5 Z"
            fill="url(#stemGrad)"
          />

          {/* Stem Tip Leaflet */}
          <ellipse cx="56" cy="11" rx="1.5" ry="2.2" transform="rotate(35 56 11)" fill="#66BB6A" />
        </g>

        {/* 4. Little Sparkle Accent near stem / plate */}
        <path
          d="M 28 47.5 L 29 46 L 30 47.5 L 31.5 48.5 L 30 49.5 L 29 51 L 28 49.5 L 26.5 48.5 Z"
          fill={isLight ? '#FFFFFF' : '#8A9D8B'}
          opacity="0.7"
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span 
          className={`font-serif font-bold tracking-tight leading-none ${titleSize} ${
            isLight ? 'text-white' : 'text-[#223B28]'
          }`}
        >
          ChillyFlakes
        </span>
        {showTagline && (
          <span 
            className={`font-sans tracking-wider uppercase font-medium mt-1 ${tagSize} ${
              isLight ? 'text-[#D3E0D1]' : 'text-[#617463]'
            }`}
          >
            Natural • Handmade • Unique
          </span>
        )}
      </div>
    </div>
  );
};
export default Logo;
