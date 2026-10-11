import React from 'react';
import { Enquiry } from '../types';
import { MessageSquare, Check, X, ExternalLink, AlertTriangle, Phone } from 'lucide-react';

interface WhatsAppSuccessModalProps {
  enquiry: Enquiry;
  whatsappUrl: string;
  onClose: () => void;
}

export const WhatsAppSuccessModal: React.FC<WhatsAppSuccessModalProps> = ({
  enquiry,
  whatsappUrl,
  onClose,
}) => {
  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-[#0B2545]">
            Booking Request Ready for WhatsApp
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Booking Ref: {enquiry.id.replace('ENQ-', 'BKG-')}
          </p>
        </div>

        {/* Notice on next step */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed mb-6 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Next Step: Confirm on WhatsApp</p>
            <p>
              Your journey details have been formatted. Please tap the button below to open WhatsApp with <strong>+91 94215 56220</strong> and press <strong>Send</strong> to connect directly with our Akola booking team.
            </p>
          </div>
        </div>

        {/* Enquiry Summary Review */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500 font-medium">Customer:</span>
            <span className="font-bold text-slate-800">{enquiry.customerName} ({enquiry.customerPhone})</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500 font-medium">Requested Service:</span>
            <span className="font-bold text-orange-600 uppercase">{enquiry.serviceType} Ticket Booking</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-500 font-medium">Route:</span>
            <span className="font-bold text-slate-800">{enquiry.origin} → {enquiry.destination}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Date & Passengers:</span>
            <span className="font-bold text-slate-800">{enquiry.travelDate} ({enquiry.passengers} pax)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all hover:translate-y-[-1px]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Open WhatsApp (+91 94215 56220)</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Close & Return to Website
          </button>
        </div>
      </div>
    </div>
  );
};
