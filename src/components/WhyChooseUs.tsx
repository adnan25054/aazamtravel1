import React from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Receipt, 
  Headphones, 
  MessageSquare,
  CheckCircle2,
  CalendarCheck,
  SendHorizontal,
  BadgeCheck
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const verifiedReasons = [
    {
      title: 'Convenient Local Assistance in Akola',
      description: 'Physical agency presence in Akola, Maharashtra for in-person consultation and direct local support.',
      icon: MapPin,
    },
    {
      title: 'Multiple Travel Services in One Place',
      description: 'Trains, flights, luxury sleeper buses, hotel reservations, and custom holiday tours under one roof.',
      icon: Layers,
    },
    {
      title: 'Personalized Trip Planning',
      description: 'Custom travel itineraries designed according to your schedule, family preferences, and budget.',
      icon: Compass,
    },
    {
      title: 'Clear Pricing & Booking Information',
      description: 'Transparent fare breakdowns, station rules, and booking timelines with no hidden consultation costs.',
      icon: Receipt,
    },
    {
      title: 'Helpful Customer Support',
      description: 'Attentive phone and WhatsApp assistance from your booking request until your journey is complete.',
      icon: Headphones,
    },
    {
      title: 'Easy WhatsApp Bookings',
      description: 'Direct messaging access via +91 94215 56220 for fast ticket bookings, fare quotes, and train timings.',
      icon: MessageSquare,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Your Travel Service',
      desc: 'Select train tickets, flight bookings, bus reservations, hotel stays, or tour packages.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Share Journey Details',
      desc: 'Provide your departure city, destination, preferred dates, travel class, and passenger count.',
      icon: CalendarCheck,
    },
    {
      step: '03',
      title: 'Receive Booking Options & Fares',
      desc: 'Our Akola team provides applicable fare options, schedule availability, and route advice.',
      icon: SendHorizontal,
    },
    {
      step: '04',
      title: 'Confirm Booking & Receive Tickets',
      desc: 'Confirm the booking with the provider and receive all relevant tickets and travel confirmations.',
      icon: BadgeCheck,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Why Choose Us Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            Local Reliability
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Why Choose Aazam Travel Agency?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Dedicated travel guidance rooted in Akola, Maharashtra with honest communication and personal attention for every passenger.
          </p>
        </div>

        {/* 6 Verified Claims Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {verifiedReasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B2545]">
                    <Icon className="w-5 h-5 text-[#0B2545]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B2545] leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works Subsection */}
        <div className="mt-12 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Simple 4-Step Process
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              How Booking Assistance Works
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Clear, step-by-step assistance from inquiry to confirmed travel documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-orange-500 font-mono">
                        {st.step}
                      </span>
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-[#0B2545] mb-2 leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {st.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simple & Assisted</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
