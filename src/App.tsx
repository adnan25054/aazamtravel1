import React, { useState, useEffect } from 'react';
import { 
  checkAdminSession, 
  fetchPackages, 
  fetchServices, 
  fetchSettings, 
  logoutAdmin 
} from './api';
import { 
  AdminUser, 
  Enquiry, 
  ServiceItem, 
  ServiceType, 
  TourPackage, 
  WebsiteSettings 
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrainBookingSection } from './components/TrainBookingSection';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TourPackagesSection } from './components/TourPackagesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppSuccessModal } from './components/WhatsAppSuccessModal';
import { PolicyModals } from './components/PolicyModals';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  Phone, 
  MessageSquare, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Train,
  ArrowUp
} from 'lucide-react';

const DEFAULT_SETTINGS: WebsiteSettings = {
  businessName: 'Aazam Travel Agency',
  category: 'Travel Agent',
  tagline: 'Your Trusted Travel Partner in Akola',
  location: 'Akola, Maharashtra, India',
  address: 'Near Railway Station Road, Old City, Akola, Maharashtra - 444001, India',
  phone: '+91 94215 56220',
  whatsapp: '+91 94215 56220',
  email: 'saazamshaikh@gmail.com',
  heroHeadline: 'Your Journey Begins with Aazam Travel Agency',
  heroSubheadline:
    'Book train tickets, flights, buses, hotels, and holiday packages with reliable travel assistance in Akola, Maharashtra.',
  announcement: 'IRCTC Train Ticket Reservation & Tatkal Booking Assistance Available for All Routes!',
  announcementActive: true,
  officeHours: 'Monday to Sunday: 8:00 AM – 10:00 PM',
  verifiedClaims: [
    'Convenient local travel assistance in Akola.',
    'Multiple travel services in one place.',
    'Personalized trip planning.',
    'Clear pricing and booking information.',
    'Helpful customer support.',
    'Easy WhatsApp enquiries.',
  ],
};

export default function App() {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth & Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Interactive modals
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
  const [submittedEnquiryData, setSubmittedEnquiryData] = useState<{
    enquiry: Enquiry;
    whatsappUrl: string;
  } | null>(null);

  const [preselectedContactService, setPreselectedContactService] = useState<ServiceType | undefined>(undefined);

  // Fetch initial public data
  const loadPublicData = async () => {
    try {
      const [sData, srvData, pkgData] = await Promise.all([
        fetchSettings(),
        fetchServices(),
        fetchPackages(),
      ]);
      setSettings(sData);
      setServices(srvData);
      setPackages(pkgData);
    } catch (err) {
      console.error('Error fetching public agency data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session
  const verifySession = async () => {
    try {
      const session = await checkAdminSession();
      if (session.authenticated && session.user) {
        setIsAdminLoggedIn(true);
        setAdminUser(session.user);
      } else {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    } catch {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    loadPublicData();
    verifySession();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setShowAdminDashboard(false);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceForBooking = (serviceKey: string) => {
    if (serviceKey === 'train') {
      handleScrollToSection('train-booking');
    } else {
      setPreselectedContactService(serviceKey as ServiceType);
      handleScrollToSection('contact');
    }
  };

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-[#0B2545]">
        <div className="p-4 rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="font-bold text-sm tracking-wide">Loading Aazam Travel Agency...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        settings={settings}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setShowAdminLogin(true)}
        onOpenAdminDashboard={() => setShowAdminDashboard(true)}
        onNavigateSection={handleScrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          settings={settings}
          onBookTrainClick={() => handleScrollToSection('train-booking')}
          onExploreServicesClick={() => handleScrollToSection('services')}
        />

        {/* 2. Train Booking Section (Primary focus per requirement) */}
        <TrainBookingSection
          agencyPhone={settings.phone}
          agencyWhatsApp={settings.whatsapp}
          onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
        />

        {/* 3. Our Services Section */}
        <ServicesSection
          services={services}
          agencyWhatsApp={settings.whatsapp}
          onSelectServiceForBooking={handleSelectServiceForBooking}
        />

        {/* 4. Why Choose Us & How It Works */}
        <WhyChooseUs />

        {/* 5. Tour Packages Section */}
        <TourPackagesSection
          packages={packages}
          agencyWhatsApp={settings.whatsapp}
          agencyPhone={settings.phone}
          onBookPackage={(pkg) => {
            setPreselectedContactService(pkg.category === 'Religious' ? 'religious' : 'tour');
            handleScrollToSection('contact');
          }}
        />

        {/* 6. Universal Contact & Booking Section */}
        <ContactSection
          settings={settings}
          preselectedService={preselectedContactService}
          onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
        />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenPrivacy={() => setPolicyModal('privacy')}
        onOpenTerms={() => setPolicyModal('terms')}
        onOpenAdminLogin={() => {
          if (isAdminLoggedIn) setShowAdminDashboard(true);
          else setShowAdminLogin(true);
        }}
        onNavigateSection={handleScrollToSection}
      />

      {/* Floating Action Buttons (Sticky Quick WhatsApp & Call) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Admin Quick Switch (if logged in) */}
        {isAdminLoggedIn && (
          <button
            onClick={() => setShowAdminDashboard(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#0B2545] text-white text-xs font-bold shadow-xl border border-blue-800 hover:bg-blue-900 transition-all hover:scale-105"
            title="Open Admin Dashboard"
          >
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="hidden sm:inline">Admin Active</span>
          </button>
        )}

        {/* Quick WhatsApp Floating Button */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
            'Hello Aazam Travel Agency (Akola), I need assistance with travel booking.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-700/30 transition-all hover:scale-105 active:scale-95"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp Booking</span>
        </a>
      </div>

      {/* WhatsApp Modal after Enquiry Submission (Notice requirement) */}
      {submittedEnquiryData && (
        <WhatsAppSuccessModal
          enquiry={submittedEnquiryData.enquiry}
          whatsappUrl={submittedEnquiryData.whatsappUrl}
          onClose={() => setSubmittedEnquiryData(null)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      <PolicyModals
        type={policyModal}
        onClose={() => setPolicyModal(null)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={(user) => {
          setIsAdminLoggedIn(true);
          setAdminUser(user);
          setShowAdminDashboard(true);
        }}
      />

      {/* Full Admin Dashboard Modal/Panel */}
      {showAdminDashboard && adminUser && (
        <AdminDashboard
          adminUser={adminUser}
          initialSettings={settings}
          initialServices={services}
          initialPackages={packages}
          onLogout={handleLogout}
          onClose={() => setShowAdminDashboard(false)}
          onRefreshPublicData={loadPublicData}
        />
      )}
    </div>
  );
}
