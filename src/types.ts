export type ServiceType = 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';

export type EnquiryStatus = 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled';

export interface EnquiryNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  serviceType: ServiceType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  origin: string;
  destination: string;
  travelDate: string;
  returnDate?: string;
  passengers: number;
  preferredClass?: string;
  specialRequests?: string;
  status: EnquiryStatus;
  notes: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface TourPackage {
  id: string;
  title: string;
  category: 'Domestic' | 'Religious' | 'Holiday' | 'Family';
  duration: string;
  destination: string;
  highlights: string[];
  inclusions: string[];
  startingPrice: string;
  image: string;
  featured: boolean;
  description: string;
}

export interface ServiceItem {
  id: string;
  key: ServiceType;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
}

export interface WebsiteSettings {
  businessName: string;
  category: string;
  tagline: string;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  heroHeadline: string;
  heroSubheadline: string;
  announcement: string;
  announcementActive: boolean;
  officeHours: string;
  verifiedClaims: string[];
}

export interface AdminStats {
  total: number;
  new: number;
  contacted: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  byService: Record<ServiceType, number>;
}

export interface CustomerRecord {
  name: string;
  phone: string;
  email?: string;
  totalEnquiries: number;
  confirmedBookings: number;
  servicesUsed: string[];
  lastEnquiryDate: string;
  enquiries: {
    id: string;
    service: string;
    date: string;
    status: string;
    destination: string;
  }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}
