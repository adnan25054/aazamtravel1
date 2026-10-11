import React from 'react';

interface LogoProps {
  className?: string;
  isDark?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'h-11 sm:h-12 w-auto', 
  isDark = false,
  showSubtitle = true 
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Official Emblem: Train, Bus, Globe, Airplane & Hotel */}
      <div className={`relative flex items-center justify-center p-1 rounded-xl transition-transform hover:scale-105 ${
        isDark ? 'bg-white/10 backdrop-blur-xs' : 'bg-transparent'
      }`}>
        <img
          src="/logo.svg"
          alt="Aazam Travel Agency Official Logo"
          className={`${className} object-contain max-h-14`}
          loading="eager"
        />
      </div>

      {/* Official Typography */}
      <div className="flex flex-col">
        <span className={`text-lg sm:text-xl font-black tracking-tight leading-none ${
          isDark ? 'text-white' : 'text-[#166534]'
        }`}>
          Aazam Travel Agency
        </span>
        {showSubtitle && (
          <span className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 ${
            isDark ? 'text-orange-400' : 'text-orange-600'
          }`}>
            Akola, Maharashtra
          </span>
        )}
      </div>
    </div>
  );
};
