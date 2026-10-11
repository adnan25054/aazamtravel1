import React from 'react';
import { WebsiteSettings } from '../types';
import { Train, MessageSquare, Phone, MapPin, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface HeroProps {
  settings: WebsiteSettings;
  onBookTrainClick: () => void;
  onExploreServicesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onBookTrainClick,
  onExploreServicesClick,
}) => {
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <section id="hero" className="relative overflow-hidden bg-[#07192F] text-white">
      {/* Background Graphic with Travel / High-Speed Railway Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2000&q=80"
          alt="Railway travel and modern journey"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07192F] via-[#0B2545]/90 to-[#07192F]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="max-w-3xl">
          {/* Official Agency Emblem & Location Kicker */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
              <img
                src="/logo.svg"
                alt="Aazam Travel Agency Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xs font-black tracking-wider uppercase text-white">
                Aazam Travel Agency
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-400 tracking-wide uppercase">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Akola, Maharashtra</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>Local Booking Desk</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white mb-6">
            Your Journey Begins with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200">
              Aazam Travel Agency
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl font-normal">
            {settings.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={onBookTrainClick}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            >
              <Train className="w-5 h-5" />
              <span>Book Train Tickets</span>
            </button>

            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Aazam Travel Agency, I want to inquire about travel tickets.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/30 transition-all hover:translate-y-[-1px]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact on WhatsApp</span>
            </a>

            <button
              onClick={onExploreServicesClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm sm:text-base text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
            >
              <span>Explore All Services</span>
            </button>
          </div>

          {/* Trust Highlights - Verified Local Claims */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Akola Junction (AK) Assistance</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Transparent Pricing & Zero Hidden Charges</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Tatkal Preparation & Route Guidance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
