import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Data persistence
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'travel_agency.json');

interface AdminUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export interface EnquiryNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  serviceType: 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';
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
  status: 'New' | 'Contacted' | 'Pending' | 'Confirmed' | 'Cancelled';
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
  key: 'train' | 'flight' | 'bus' | 'hotel' | 'tour' | 'religious';
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

interface DatabaseSchema {
  adminUsers: AdminUser[];
  enquiries: Enquiry[];
  tourPackages: TourPackage[];
  services: ServiceItem[];
  settings: WebsiteSettings;
  sessions: { [token: string]: { userId: string; email: string; expiresAt: number } };
}

// Password hashing helpers
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(checkHash), Buffer.from(hash));
}

// Initial default seed
function getInitialData(): DatabaseSchema {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword('AazamTravels@2026', defaultSalt);

  return {
    adminUsers: [
      {
        id: 'admin-1',
        name: 'Aazam Shaikh',
        email: 'admin@aazamtravels.com',
        passwordHash: defaultHash,
        salt: defaultSalt,
        role: 'superadmin',
        createdAt: new Date().toISOString(),
      },
    ],
    settings: {
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
    },
    services: [
      {
        id: 'srv-1',
        key: 'train',
        title: 'Train Ticket Booking',
        shortDesc: 'Assistance with railway ticket enquiries, availability checks, and reservations.',
        fullDesc:
          'Expert Indian Railways booking assistance from Akola Junction (AK) and stations across India. Get help with general reservation, Tatkal timing guidance, RAC and waitlist updates, class recommendations, and senior citizen concessions.',
        features: [
          'Assistance with Indian Railways (IRCTC) route planning',
          'Akola Junction (AK) origin & destination expertise',
          'Sleeper, 3A, 2A, 1A, Chair Car & 3E class guidance',
          'Tatkal preparation assistance & route options',
          'Clear fare breakdown with zero hidden fees',
        ],
        icon: 'Train',
      },
      {
        id: 'srv-2',
        key: 'flight',
        title: 'Flight Ticket Booking',
        shortDesc: 'Domestic and international flight booking enquiries.',
        fullDesc:
          'Competitive airfares for domestic sectors across India and international flight routes worldwide. We assist with baggage allowances, web check-in, seat preference, and airline schedule comparisons.',
        features: [
          'Domestic connections via Nagpur, Mumbai, Pune & Delhi',
          'International flights to UAE, Saudi Arabia, Europe & Asia',
          'Baggage allowance guidance and special meals',
          'Web check-in and boarding pass coordination',
        ],
        icon: 'Plane',
      },
      {
        id: 'srv-3',
        key: 'bus',
        title: 'Bus Ticket Booking',
        shortDesc: 'Sleeper, seater, and luxury bus booking assistance.',
        fullDesc:
          'Reliable intercity bus bookings connecting Akola to Mumbai, Pune, Nagpur, Hyderabad, Surat, Indore, and major hubs across Maharashtra and central India. AC Sleeper, Multi-axle Volvo, and seater buses.',
        features: [
          'Daily departures to Pune, Mumbai, Nagpur & Aurangabad',
          'Multi-axle Volvo, BharatBenz & AC Sleeper coaches',
          'Convenient local boarding points in Akola',
          'Live boarding location coordination',
        ],
        icon: 'Bus',
      },
      {
        id: 'srv-4',
        key: 'hotel',
        title: 'Hotel Reservations',
        shortDesc: 'Hotel stays for family, business, and holiday travel.',
        fullDesc:
          'Verified hotel stays tailored to your budget and group requirements. From business hotels near transit hubs to peaceful holiday resorts and pilgrimage dharamshalas across India.',
        features: [
          'Budget-friendly, 3-star, 4-star, and luxury hotels',
          'Family suites, extra beds & meal plans (CP, MAP, AP)',
          'Early check-in requests & verified amenities',
          'Central locations near railway stations & airports',
        ],
        icon: 'Building2',
      },
      {
        id: 'srv-5',
        key: 'tour',
        title: 'Tour Packages',
        shortDesc: 'Customized domestic and international holiday packages.',
        fullDesc:
          'End-to-end holiday planning crafted around your schedule and budget. Includes hotel accommodations, sightseeing cabs, meal options, and transfers for families, couples, and groups.',
        features: [
          'Complete customized itineraries for family & groups',
          'Popular destinations: Kashmir, Kerala, Goa, Rajasthan, Himachal',
          'Dedicated private cab for sightseeing',
          'Full travel support throughout your journey',
        ],
        icon: 'Compass',
      },
      {
        id: 'srv-6',
        key: 'religious',
        title: 'Religious Tours',
        shortDesc: 'Travel arrangements for religious destinations and pilgrimages.',
        fullDesc:
          'Specialized assistance for pilgrimage journeys. We organize seamless travel for Umrah, Ajmer Sharif Ziyarat, Shirdi Sai Baba, Tirupati Balaji, and sacred temple tours across India with sensitive care for elders.',
        features: [
          'Complete Umrah & Ziyarat travel coordination',
          'Shirdi, Trimbakeshwar, Shegaon & Jyotirlinga circuits',
          'Elderly passenger care & wheelchair assistance requests',
          'Hotels within walking distance of sacred shrines',
        ],
        icon: 'MapPin',
      },
    ],
    tourPackages: [
      {
        id: 'pkg-1',
        title: 'Kashmir Valley Paradise Tour',
        category: 'Holiday',
        duration: '6 Nights / 7 Days',
        destination: 'Srinagar, Gulmarg, Pahalgam, Sonamarg',
        highlights: ['Dal Lake Shikara ride', 'Gulmarg Gondola cable car', 'Betaab Valley & Aru Valley excursion', 'Traditional Houseboat stay'],
        inclusions: ['Deluxe hotel & houseboat stay', 'Daily breakfast & dinner', 'Private cab for all transfers & sightseeing', 'Toll, parking & driver allowance'],
        startingPrice: 'Rs. 18,500 per person',
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'Experience heaven on earth with our curated Kashmir itinerary designed for families and honeymooners with comfortable stays and scenic private transfers.',
      },
      {
        id: 'pkg-2',
        title: 'Umrah & Madinah Pilgrimage Package',
        category: 'Religious',
        duration: '14 Nights / 15 Days',
        destination: 'Makkah & Madinah (Saudi Arabia)',
        highlights: ['Hotels close to Haram Sharif', 'Complete Ziyarat in Makkah & Madinah', 'Roundtrip airport & intercity transfers', 'Experienced guidance throughout'],
        inclusions: ['Visa assistance & medical insurance', 'Star category hotel stay', 'Daily buffet meals', 'Private AC coach transfers'],
        startingPrice: 'Rs. 78,000 per person',
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'Complete peace of mind for your sacred Umrah journey with hotel accommodations near the Holy Mosques and experienced ground coordination.',
      },
      {
        id: 'pkg-3',
        title: 'Goa Coastal Getaway',
        category: 'Holiday',
        duration: '4 Nights / 5 Days',
        destination: 'North & South Goa',
        highlights: ['Calangute, Baga & Anjuna beach access', 'Mandovi river cruise', 'Old Goa churches & spice plantation tour', 'Dudhsagar waterfall trip'],
        inclusions: ['4-star resort stay with swimming pool', 'Daily buffet breakfast', 'Airport/station pickup & drop', 'Sightseeing in private vehicle'],
        startingPrice: 'Rs. 11,500 per person',
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Relax and recharge on the sun-kissed beaches of Goa with resort comforts, water activities, and heritage sights.',
      },
      {
        id: 'pkg-4',
        title: 'Maharashtra Jyotirlinga & Shirdi Pilgrimage',
        category: 'Religious',
        duration: '4 Nights / 5 Days',
        destination: 'Shirdi, Trimbakeshwar, Grishneshwar, Bhimashankar',
        highlights: ['VIP Darshan assistance guidance', 'Special timings for senior citizens', 'Scenic Western Ghats route', 'Visit to Ellora caves & Shani Shingnapur'],
        inclusions: ['AC Deluxe hotel rooms', 'AC private sedan/Innova for entire tour', 'Daily breakfast', 'All toll, state tax & driver charges'],
        startingPrice: 'Rs. 9,800 per person',
        image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
        featured: true,
        description: 'A deeply spiritual journey connecting the revered shrines of Maharashtra with punctual pick-up from Akola or Pune/Mumbai.',
      },
      {
        id: 'pkg-5',
        title: 'Royal Rajasthan Heritage Tour',
        category: 'Domestic',
        duration: '5 Nights / 6 Days',
        destination: 'Jaipur, Jodhpur, Udaipur',
        highlights: ['Amber Fort elephant & jeep ride', 'City Palace & Lake Pichola boat ride', 'Mehrangarh Fort exploration', 'Chokhi Dhani cultural village'],
        inclusions: ['Heritage hotel accommodations', 'Daily breakfast & dinner', 'AC vehicle with knowledgeable chauffeur', 'Monument entry guidance'],
        startingPrice: 'Rs. 16,900 per person',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Discover majestic palaces, desert landscapes, and rich royal heritage with seamless hospitality.',
      },
      {
        id: 'pkg-6',
        title: 'Kerala Backwaters & Munnar Hills',
        category: 'Domestic',
        duration: '5 Nights / 6 Days',
        destination: 'Cochin, Munnar, Thekkady, Alleppey',
        highlights: ['Munnar tea gardens & waterfalls', 'Periyar wildlife boating', 'Alleppey private backwater houseboat', 'Spice plantation walk'],
        inclusions: ['Hill resort & deluxe houseboat', 'All meals on houseboat & breakfast at resorts', 'Private AC car throughout', 'Toll & parking'],
        startingPrice: 'Rs. 15,200 per person',
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        description: 'Lush greenery, mist-covered hills, and tranquil backwaters in God’s Own Country.',
      },
    ],
    enquiries: [
      {
        id: 'ENQ-1001',
        serviceType: 'train',
        customerName: 'Rajesh Sharma',
        customerPhone: '+91 98223 41029',
        customerEmail: 'rajesh.sharma@example.com',
        origin: 'Akola Junction (AK)',
        destination: 'Mumbai CSMT (CSMT)',
        travelDate: '2026-10-22',
        passengers: 3,
        preferredClass: '3A - Third AC',
        specialRequests: 'Prefer 12106 Vidarbha Express or 12810 Howrah Mail. 1 senior citizen lower berth.',
        status: 'New',
        notes: [
          {
            id: 'n-1',
            text: 'Customer requested 3A berth for family, checked timetable for Vidarbha Express.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-10T05:30:00.000Z',
          },
        ],
        createdAt: '2026-10-10T05:25:00.000Z',
        updatedAt: '2026-10-10T05:30:00.000Z',
      },
      {
        id: 'ENQ-1002',
        serviceType: 'train',
        customerName: 'Mohd Farooq',
        customerPhone: '+91 94056 12890',
        customerEmail: 'farooq.akola@example.com',
        origin: 'Akola Junction (AK)',
        destination: 'Pune Junction (PUNE)',
        travelDate: '2026-10-25',
        passengers: 2,
        preferredClass: '2A - Second AC',
        specialRequests: 'Pune Nagpur Garib Rath or Maharashtra Express.',
        status: 'Contacted',
        notes: [
          {
            id: 'n-2',
            text: 'Messaged on WhatsApp with train timings and fare details.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-10T06:15:00.000Z',
          },
        ],
        createdAt: '2026-10-09T14:10:00.000Z',
        updatedAt: '2026-10-10T06:15:00.000Z',
      },
      {
        id: 'ENQ-1003',
        serviceType: 'religious',
        customerName: 'Abdul Rashid',
        customerPhone: '+91 91584 77210',
        customerEmail: 'rashid.travel@example.com',
        origin: 'Akola',
        destination: 'Makkah & Madinah',
        travelDate: '2026-11-15',
        passengers: 4,
        preferredClass: 'Economy',
        specialRequests: 'Looking for 15-day Umrah package with elderly parents, hotel within 400m of Haram.',
        status: 'Pending',
        notes: [
          {
            id: 'n-3',
            text: 'Discussed hotel options in Makkah. Awaiting passport copies.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-09T18:00:00.000Z',
          },
        ],
        createdAt: '2026-10-09T11:45:00.000Z',
        updatedAt: '2026-10-09T18:00:00.000Z',
      },
      {
        id: 'ENQ-1004',
        serviceType: 'flight',
        customerName: 'Priya Deshmukh',
        customerPhone: '+91 97655 88912',
        customerEmail: 'priya.deshmukh@example.com',
        origin: 'Nagpur (NAG)',
        destination: 'New Delhi (DEL)',
        travelDate: '2026-10-30',
        passengers: 1,
        preferredClass: 'Economy',
        specialRequests: 'Morning flight before 11 AM. 15kg check-in baggage needed.',
        status: 'Confirmed',
        notes: [
          {
            id: 'n-4',
            text: 'Flight confirmed with IndiGo 6E-634. E-ticket sent via WhatsApp & email.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-08T16:20:00.000Z',
          },
        ],
        createdAt: '2026-10-08T09:30:00.000Z',
        updatedAt: '2026-10-08T16:20:00.000Z',
      },
      {
        id: 'ENQ-1005',
        serviceType: 'bus',
        customerName: 'Sanjay Wankhede',
        customerPhone: '+91 98901 23456',
        origin: 'Akola Bus Stand',
        destination: 'Pune Shivaji Nagar',
        travelDate: '2026-10-18',
        passengers: 2,
        preferredClass: 'AC Sleeper',
        specialRequests: 'Lower double sleeper berth preferred in luxury coach.',
        status: 'Confirmed',
        notes: [
          {
            id: 'n-5',
            text: 'Confirmed with Chintamani Travels AC Sleeper. Boarding at Ashok Vatika Akola.',
            author: 'Aazam Shaikh',
            createdAt: '2026-10-07T19:00:00.000Z',
          },
        ],
        createdAt: '2026-10-07T12:00:00.000Z',
        updatedAt: '2026-10-07T19:00:00.000Z',
      },
      {
        id: 'ENQ-1006',
        serviceType: 'tour',
        customerName: 'Girish Joshi',
        customerPhone: '+91 94228 90123',
        customerEmail: 'girish.joshi@example.com',
        origin: 'Akola',
        destination: 'Kashmir Valley',
        travelDate: '2026-11-05',
        passengers: 4,
        preferredClass: 'Deluxe',
        specialRequests: 'Family trip with 2 kids. Houseboat in Dal Lake required.',
        status: 'New',
        notes: [],
        createdAt: '2026-10-10T02:15:00.000Z',
        updatedAt: '2026-10-10T02:15:00.000Z',
      },
    ],
    sessions: {},
  };
}

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database, creating fresh backup:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveDatabase(db: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}

// Authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  const db = loadDatabase();
  const session = db.sessions[token];

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session invalid or expired' });
  }

  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    saveDatabase(db);
    return res.status(401).json({ error: 'Session expired, please log in again' });
  }

  (req as any).adminUser = session;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // ==========================================
  // Public API Endpoints
  // ==========================================

  // 1. Get Website Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.settings);
  });

  // 2. Get Services
  app.get('/api/services', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.services);
  });

  // 3. Get Tour Packages
  app.get('/api/packages', (_req: Request, res: Response) => {
    const db = loadDatabase();
    res.json(db.tourPackages);
  });

  // 4. Submit Booking Enquiry (Public)
  app.post('/api/enquiries', (req: Request, res: Response) => {
    const {
      serviceType,
      customerName,
      customerPhone,
      customerEmail,
      origin,
      destination,
      travelDate,
      returnDate,
      passengers,
      preferredClass,
      specialRequests,
    } = req.body;

    // Strict validations
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({ error: 'Phone / WhatsApp number is required' });
    }
    if (!origin || !origin.trim()) {
      return res.status(400).json({ error: 'Departure origin is required' });
    }
    if (!destination || !destination.trim()) {
      return res.status(400).json({ error: 'Destination is required' });
    }
    if (!travelDate || !travelDate.trim()) {
      return res.status(400).json({ error: 'Travel date is required' });
    }

    const validServices = ['train', 'flight', 'bus', 'hotel', 'tour', 'religious'];
    const safeService = validServices.includes(serviceType) ? serviceType : 'train';

    const db = loadDatabase();
    const newId = `ENQ-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

    const newEnquiry: Enquiry = {
      id: newId,
      serviceType: safeService as any,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      origin: origin.trim(),
      destination: destination.trim(),
      travelDate: travelDate.trim(),
      returnDate: returnDate ? returnDate.trim() : undefined,
      passengers: Number(passengers) > 0 ? Number(passengers) : 1,
      preferredClass: preferredClass ? preferredClass.trim() : undefined,
      specialRequests: specialRequests ? specialRequests.trim() : undefined,
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.enquiries.unshift(newEnquiry);
    saveDatabase(db);

    // Pre-build WhatsApp enquiry message to the Agency (+91 94215 56220)
    const agencyNumber = '919421556220';
    const messageLines = [
      `*Aazam Travel Agency Enquiry*`,
      `*Enquiry ID:* ${newId}`,
      `*Service:* ${safeService.toUpperCase()}`,
      `*Name:* ${newEnquiry.customerName}`,
      `*Phone:* ${newEnquiry.customerPhone}`,
      `*From:* ${newEnquiry.origin}`,
      `*To:* ${newEnquiry.destination}`,
      `*Travel Date:* ${newEnquiry.travelDate}`,
      newEnquiry.returnDate ? `*Return Date:* ${newEnquiry.returnDate}` : null,
      `*Passengers:* ${newEnquiry.passengers}`,
      newEnquiry.preferredClass ? `*Class / Category:* ${newEnquiry.preferredClass}` : null,
      newEnquiry.specialRequests ? `*Requirements:* ${newEnquiry.specialRequests}` : null,
      `\n_Assistance requested in Akola, Maharashtra._`,
    ].filter(Boolean);

    const whatsappText = encodeURIComponent(messageLines.join('\n'));
    const whatsappUrl = `https://wa.me/${agencyNumber}?text=${whatsappText}`;

    res.status(201).json({
      success: true,
      enquiryId: newId,
      enquiry: newEnquiry,
      whatsappUrl,
      message: 'Enquiry created successfully. Please send via WhatsApp to complete booking assistance.',
    });
  });

  // ==========================================
  // Auth Endpoints
  // ==========================================

  // Check current admin session
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false });
    }
    const token = authHeader.split(' ')[1];
    const db = loadDatabase();
    const session = db.sessions[token];

    if (!session || Date.now() > session.expiresAt) {
      return res.status(401).json({ authenticated: false });
    }

    const admin = db.adminUsers.find((u) => u.id === session.userId);
    res.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: admin?.name || 'Administrator',
        role: admin?.role || 'admin',
      },
    });
  });

  // Admin Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = loadDatabase();
    const admin = db.adminUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, admin.passwordHash, admin.salt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    db.sessions[token] = {
      userId: admin.id,
      email: admin.email,
      expiresAt,
    };
    saveDatabase(db);

    res.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  });

  // Admin Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const db = loadDatabase();
      delete db.sessions[token];
      saveDatabase(db);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Change Admin Password / Profile
  app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword, newName, newEmail } = req.body;
    const session = (req as any).adminUser;
    const db = loadDatabase();
    const admin = db.adminUsers.find((u) => u.id === session.userId);

    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      if (!verifyPassword(currentPassword, admin.passwordHash, admin.salt)) {
        return res.status(401).json({ error: 'Current password does not match' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const newSalt = crypto.randomBytes(16).toString('hex');
      admin.passwordHash = hashPassword(newPassword, newSalt);
      admin.salt = newSalt;
    }

    if (newName && newName.trim()) {
      admin.name = newName.trim();
    }

    if (newEmail && newEmail.trim()) {
      admin.email = newEmail.trim().toLowerCase();
    }

    saveDatabase(db);
    res.json({ success: true, message: 'Admin profile updated successfully', user: { name: admin.name, email: admin.email } });
  });

  // ==========================================
  // Admin Protected Enquiries Endpoints
  // ==========================================

  // Stats summary for admin dashboard
  app.get('/api/admin/enquiries/stats', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const enquiries = db.enquiries;

    const stats = {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'New').length,
      contacted: enquiries.filter((e) => e.status === 'Contacted').length,
      pending: enquiries.filter((e) => e.status === 'Pending').length,
      confirmed: enquiries.filter((e) => e.status === 'Confirmed').length,
      cancelled: enquiries.filter((e) => e.status === 'Cancelled').length,
      byService: {
        train: enquiries.filter((e) => e.serviceType === 'train').length,
        flight: enquiries.filter((e) => e.serviceType === 'flight').length,
        bus: enquiries.filter((e) => e.serviceType === 'bus').length,
        hotel: enquiries.filter((e) => e.serviceType === 'hotel').length,
        tour: enquiries.filter((e) => e.serviceType === 'tour').length,
        religious: enquiries.filter((e) => e.serviceType === 'religious').length,
      },
    };

    res.json(stats);
  });

  // List enquiries with filtering and search
  app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
    const { service, status, search, fromDate, toDate } = req.query;
    const db = loadDatabase();
    let list = [...db.enquiries];

    if (service && service !== 'all') {
      list = list.filter((e) => e.serviceType === service);
    }

    if (status && status !== 'all') {
      list = list.filter((e) => e.status === status);
    }

    if (fromDate) {
      list = list.filter((e) => e.travelDate >= (fromDate as string));
    }

    if (toDate) {
      list = list.filter((e) => e.travelDate <= (toDate as string));
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.id.toLowerCase().includes(q) ||
          e.customerName.toLowerCase().includes(q) ||
          e.customerPhone.toLowerCase().includes(q) ||
          e.origin.toLowerCase().includes(q) ||
          e.destination.toLowerCase().includes(q) ||
          (e.specialRequests && e.specialRequests.toLowerCase().includes(q))
      );
    }

    res.json(list);
  });

  // Get single enquiry
  app.get('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    res.json(item);
  });

  // Update enquiry status
  app.patch('/api/admin/enquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'Pending', 'Confirmed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    item.status = status;
    item.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ success: true, enquiry: item });
  });

  // Add internal note to enquiry
  app.post('/api/admin/enquiries/:id/notes', requireAdmin, (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Note text cannot be empty' });
    }

    const session = (req as any).adminUser;
    const db = loadDatabase();
    const item = db.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    const newNote: EnquiryNote = {
      id: `n-${Date.now()}`,
      text: text.trim(),
      author: session.email || 'Admin',
      createdAt: new Date().toISOString(),
    };

    if (!item.notes) item.notes = [];
    item.notes.push(newNote);
    item.updatedAt = new Date().toISOString();
    saveDatabase(db);

    res.json({ success: true, note: newNote, enquiry: item });
  });

  // Delete enquiry
  app.delete('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const index = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    db.enquiries.splice(index, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Enquiry deleted' });
  });

  // Export enquiries to CSV
  app.get('/api/admin/enquiries-export-csv', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const rows = [
      [
        'Enquiry ID',
        'Date Received',
        'Service',
        'Customer Name',
        'Customer Phone',
        'Customer Email',
        'Origin',
        'Destination',
        'Travel Date',
        'Return Date',
        'Passengers',
        'Class',
        'Status',
        'Special Requests',
        'Notes Count',
      ].join(','),
    ];

    for (const e of db.enquiries) {
      const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
      rows.push(
        [
          escape(e.id),
          escape(e.createdAt),
          escape(e.serviceType),
          escape(e.customerName),
          escape(e.customerPhone),
          escape(e.customerEmail || ''),
          escape(e.origin),
          escape(e.destination),
          escape(e.travelDate),
          escape(e.returnDate || ''),
          escape(e.passengers),
          escape(e.preferredClass || ''),
          escape(e.status),
          escape(e.specialRequests || ''),
          escape(e.notes?.length || 0),
        ].join(',')
      );
    }

    const csvContent = rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="aazam_travel_enquiries_${Date.now()}.csv"`);
    res.send(csvContent);
  });

  // Aggregated Customers directory
  app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
    const db = loadDatabase();
    const customerMap: {
      [phone: string]: {
        name: string;
        phone: string;
        email?: string;
        totalEnquiries: number;
        confirmedBookings: number;
        servicesUsed: string[];
        lastEnquiryDate: string;
        enquiries: { id: string; service: string; date: string; status: string; destination: string }[];
      };
    } = {};

    for (const e of db.enquiries) {
      const cleanPhone = e.customerPhone.trim();
      if (!customerMap[cleanPhone]) {
        customerMap[cleanPhone] = {
          name: e.customerName,
          phone: cleanPhone,
          email: e.customerEmail,
          totalEnquiries: 0,
          confirmedBookings: 0,
          servicesUsed: [],
          lastEnquiryDate: e.createdAt,
          enquiries: [],
        };
      }

      const c = customerMap[cleanPhone];
      c.totalEnquiries++;
      if (e.status === 'Confirmed') {
        c.confirmedBookings++;
      }
      if (!c.servicesUsed.includes(e.serviceType)) {
        c.servicesUsed.push(e.serviceType);
      }
      if (e.createdAt > c.lastEnquiryDate) {
        c.lastEnquiryDate = e.createdAt;
      }
      c.enquiries.push({
        id: e.id,
        service: e.serviceType,
        date: e.travelDate,
        status: e.status,
        destination: e.destination,
      });
    }

    const customers = Object.values(customerMap).sort((a, b) => b.lastEnquiryDate.localeCompare(a.lastEnquiryDate));
    res.json(customers);
  });

  // ==========================================
  // Admin Content Management (Settings, Services, Packages)
  // ==========================================

  // Update Settings
  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const newSettings = req.body;
    db.settings = {
      ...db.settings,
      ...newSettings,
    };
    saveDatabase(db);
    res.json({ success: true, settings: db.settings });
  });

  // Update Service Details
  app.put('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services[idx] = {
      ...db.services[idx],
      ...req.body,
      id: req.params.id,
    };
    saveDatabase(db);
    res.json({ success: true, service: db.services[idx] });
  });

  // Create Service
  app.post('/api/admin/services', requireAdmin, (req: Request, res: Response) => {
    const { key, title, shortDesc, fullDesc, features, icon } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Service title is required' });
    }
    const db = loadDatabase();
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      key: key || 'tour',
      title: title.trim(),
      shortDesc: shortDesc?.trim() || '',
      fullDesc: fullDesc?.trim() || '',
      features: Array.isArray(features) ? features : [],
      icon: icon || 'Compass',
    };
    db.services.push(newService);
    saveDatabase(db);
    res.status(201).json({ success: true, service: newService });
  });

  // Delete Service
  app.delete('/api/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Service deleted' });
  });

  // Create Tour Package
  app.post('/api/admin/packages', requireAdmin, (req: Request, res: Response) => {
    const { title, category, duration, destination, highlights, inclusions, startingPrice, image, featured, description } = req.body;
    if (!title || !duration || !destination) {
      return res.status(400).json({ error: 'Title, duration and destination are required' });
    }

    const db = loadDatabase();
    const newPkg: TourPackage = {
      id: `pkg-${Date.now()}`,
      title: title.trim(),
      category: category || 'Domestic',
      duration: duration.trim(),
      destination: destination.trim(),
      highlights: Array.isArray(highlights) ? highlights : [highlights].filter(Boolean),
      inclusions: Array.isArray(inclusions) ? inclusions : [inclusions].filter(Boolean),
      startingPrice: startingPrice || 'On Request',
      image: image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      featured: Boolean(featured),
      description: description || '',
    };

    db.tourPackages.unshift(newPkg);
    saveDatabase(db);
    res.status(201).json({ success: true, package: newPkg });
  });

  // Update Tour Package
  app.put('/api/admin/packages/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.tourPackages.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    db.tourPackages[idx] = {
      ...db.tourPackages[idx],
      ...req.body,
      id: req.params.id,
    };
    saveDatabase(db);
    res.json({ success: true, package: db.tourPackages[idx] });
  });

  // Delete Tour Package
  app.delete('/api/admin/packages/:id', requireAdmin, (req: Request, res: Response) => {
    const db = loadDatabase();
    const idx = db.tourPackages.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    db.tourPackages.splice(idx, 1);
    saveDatabase(db);
    res.json({ success: true, message: 'Package deleted' });
  });

  // Vite development vs production static serve
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Aazam Travel Agency server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
