import React, { useState, useEffect, useMemo, ErrorInfo, ReactNode } from 'react';
import { 
  Scissors, 
  Clock, 
  MapPin, 
  Star, 
  Phone, 
  Instagram, 
  Facebook, 
  Menu, 
  X,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  Camera,
  ChevronLeft,
  User,
  Mail,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Firebase Storage (images only) ──────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Config is loaded from environment variables.
// Locally: copy .env.example → .env and fill in your values.
// On GitHub: add each value as a Repository Secret (Settings → Secrets → Actions).
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID
};

const firebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

let storage: ReturnType<typeof getStorage> | null = null;

if (firebaseConfigured) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    storage = getStorage(firebaseApp);
  } catch (e) {
    console.warn('Firebase initialization failed:', e);
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// STEP 5: Firebase Storage paths for your real barbershop images.
// Upload images to your Storage bucket and update these paths to match.
// e.g. if you uploaded "gallery/beard-fade.jpg", use that exact path.
const STORAGE_IMAGE_PATHS = {
  hero:    "site/hero.jpg",
  about:   "site/about.jpg",
  gallery: [
    "gallery/beard-and-fade.jpg",
    "gallery/clean-taper-beard.jpg",
    "gallery/textured-crop.jpg"
  ]
};

// Public fallback URLs — shown before auth or if Storage fetch fails
const FALLBACK_IMAGES = {
  hero:    "https://d2zdpiztbgorvt.cloudfront.net/region1/us/1001268/biz_photo/08f1782df59a46d783ee84a9cff59c-ashor-s-fade-biz-photo-84548761ad294f068cd8c9f04f9047-booksy.jpeg?size=640x427",
  about:   "https://d2zdpiztbgorvt.cloudfront.net/region1/us/1001268/inspiration/4a1a932ce8f3498d80438b9d00e4d6-ashor-s-fade-inspiration-ff476052c3984b18a87001b333fc43-booksy.jpeg",
  gallery: [
    "https://d2zdpiztbgorvt.cloudfront.net/region1/us/1001268/inspiration/c505172622be4146ac4a2c5253a02d-ashor-s-fade-inspiration-490d161cccd74cf1a70ad720695798-booksy.jpeg",
    "https://d2zdpiztbgorvt.cloudfront.net/region1/us/1001268/inspiration/b070222caed345f2bb4ea58e3c36be-ashor-s-fade-inspiration-93752a2797f440e796ecb03bbe6cee-booksy.jpeg",
    "https://d2zdpiztbgorvt.cloudfront.net/region1/us/1001268/inspiration/823660f3fd7344fd861547cdd3a285-ashor-s-fade-inspiration-3b314aae0bab4e278f1a64ebef2375-booksy.jpeg"
  ]
};

// Error Boundary Component
interface ErrorBoundaryProps { children: ReactNode; }
interface ErrorBoundaryState { hasError: boolean; error: any; }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.props = props;
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-black uppercase italic mb-4 text-white">Something went wrong</h2>
            <p className="text-white/60 mb-8 font-light">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <pre className="bg-[#111] p-4 rounded-xl text-left text-xs text-red-400 overflow-auto mb-8 max-h-40">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white text-black px-8 py-3 rounded-full font-bold uppercase tracking-tighter"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const REVIEWS = [
  {
    name: "Mubashir Shethwala",
    rating: 5,
    text: "I've been coming here for a while and Ashor always does an amazing job. He takes his time, pays attention to every detail, and I never feel rushed. Always leave with a clean, sharp cut. Highly recommend!",
    date: "4 months ago"
  },
  {
    name: "Belmin Husic",
    rating: 5,
    text: "I've been going to Ashor's Fade for the past few weeks, and every single cut has been fire. The barbers truly know what they're doing — clean fades, perfect shape-ups, and they take the time to get every detail right.",
    date: "4 months ago"
  },
  {
    name: "Ben Dover",
    rating: 5,
    text: "Been a client of Ashor's since before he opened his own shop here on Dempster.. 15 years of staying fresh, and he is still the best in the game.",
    date: "11 months ago"
  },
  {
    name: "Amir Abazovic",
    rating: 5,
    text: "Great barber shop with super friendly employees. Ashor is my favorite, he's a master of his craft and always makes sure you're happy with the result.",
    date: "a year ago"
  }
];

const SERVICES = [
  { name: "Beard", price: "$20.00", duration: "25min", description: "Professional beard trim and shape-up." },
  { name: "Haircut & Beard", price: "$50.00", duration: "50min", description: "Full haircut service combined with expert beard grooming." },
  { name: "Eyebrows", price: "$10.00", duration: "10min", description: "Precision eyebrow shaping and threading." },
  { name: "Ear Waxing", price: "$8.00", duration: "5min", description: "Quick and effective ear hair removal." },
  { name: "Nose Waxing", price: "$8.00", duration: "5min", description: "Professional nose hair waxing service." },
  { name: "Hair Color", price: "$30.00", duration: "30min", description: "Full hair coloring for a fresh new look." },
  { name: "Beard Color", price: "$20.00", duration: "20min", description: "Beard coloring to enhance and define your style." },
  { name: "Full Package", price: "$70.00", duration: "1h", description: "The ultimate grooming experience including haircut, beard, and waxing." }
];

// Gallery titles — URLs are resolved from Firebase Storage (step 5)
const GALLERY_TITLES = ["Beard and Fade", "Clean Taper & Beard", "Textured Crop"];

const BARBERS_DATA = [
  { id: 'ashor', name: "Ashor", role: "Owner / Master Barber" },
  { id: 'sargon', name: "Sargon", role: "Elite Barber" },
  { id: 'zaya', name: "Zaya", role: "Elite Barber" },
  { id: 'jon', name: "Jon", role: "Elite Barber" }
];

const TIME_SLOTS = [
  "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM",
  "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
];

export default function App() {
  return (
    <ErrorBoundary>
      <BarberApp />
    </ErrorBoundary>
  );
}

function BarberApp() {
  const [view, setView] = useState<'landing' | 'booking'>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ── Secure image URLs resolved from Firebase Storage ────────────────────────
  const [secureImages, setSecureImages] = useState<{
    hero: string;
    about: string;
    gallery: string[];
  }>({
    hero:    FALLBACK_IMAGES.hero,
    about:   FALLBACK_IMAGES.about,
    gallery: FALLBACK_IMAGES.gallery
  });

  const [bookings, setBookings] = useState<any[]>(() => {
    const saved = localStorage.getItem('ashors_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAvailabilityLoaded, setIsAvailabilityLoaded] = useState(false);

  // Fetch bookings from Google Sheet to sync availability
  useEffect(() => {
    const fetchBookingsFromSheet = async () => {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!scriptUrl) {
        setIsAvailabilityLoaded(true);
        return;
      }
      
      try {
        // Add timestamp to force fresh data
        const url = `${scriptUrl}?action=getBookings&t=${Date.now()}`;
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.bookings && Array.isArray(data.bookings)) {
            // Convert sheet bookings to app format
            const sheetBookings = data.bookings.map((b: any) => ({
              id: String(b.id || b[0]),
              name: String(b.name || b[1] || ''),
              email: String(b.email || b[2] || ''),
              phone: String(b.phone || b[3] || ''),
              barberId: '',
              barber: String(b.barber || b[4] || ''),
              date: String(b.date || ''),
              timeSlot: String(b.time || b[6] || ''),
              service: String(b.service || b[5] || ''),
              createdAt: new Date().toISOString()
            }));
            
            setBookings(sheetBookings);
            console.log('✅ Synced', sheetBookings.length, 'bookings from Google Sheet');
          }
        }
        setIsAvailabilityLoaded(true);
      } catch (err) {
        console.warn('⚠️ Could not fetch from Google Sheet, using local bookings:', err);
        setIsAvailabilityLoaded(true);
      }
    };
    
    fetchBookingsFromSheet();
    
    // Refresh every 30 seconds to stay in sync
    const interval = setInterval(fetchBookingsFromSheet, 30000);
    return () => clearInterval(interval);
  }, []);

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    barberId: '',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Helper functions for reminders
  const generateICSCalendar = (booking: any) => {
    const [year, month, day] = booking.date.split('-');
    const [hours, minutes] = booking.timeSlot.split(' ')[0].split(':');
    const start = `${year}${month}${day}T${hours}${minutes}00`;
    const end = `${year}${month}${day}T${String(Number(hours) + 1).padStart(2, '0')}${minutes}00`;
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ashor's Fade//Barbershop Booking//EN
BEGIN:VEVENT
UID:${booking.id}@ashorsfade.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${booking.service} with ${booking.barber} - Ashor's Fade
DESCRIPTION:Booking confirmation for ${booking.service}\\nBarber: ${booking.barber}\\nPhone: ${booking.phone}
LOCATION:Ashor's Fade Barbershop, Skokie
END:VEVENT
END:VCALENDAR`;
  };

  const downloadCalendarReminder = (booking: any) => {
    const ics = generateICSCalendar(booking);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ashor-booking-${booking.date}.ics`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateEmailContent = (booking: any) => {
    return `Hi ${booking.name},

Here's your booking confirmation for Ashor's Fade Barbershop:

📅 Date: ${booking.date}
⏰ Time: ${booking.timeSlot}
✂️ Service: ${booking.service}
💈 Barber: ${booking.barber}
📞 Phone: ${booking.phone}

To set a 1-hour reminder:
1. Add this event to your phone's calendar (download the calendar file)
2. Set a reminder for 1 hour before your appointment

Questions? Call us at (847) 555-0000

Thanks for booking with us!
Ashor's Fade Barbershop`;
  };

  const emailReminder = (booking: any) => {
    if (!booking || !booking.email) {
      alert('Email address not found. Please ensure you completed the booking.');
      return;
    }
    
    const content = generateEmailContent(booking);
    const subject = `Booking Confirmation - Ashor's Fade on ${booking.date}`;
    const mailto = `mailto:${booking.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
    
    // Open email client
    window.location.href = mailto;
    
    // Provide feedback
    setTimeout(() => {
      alert('✅ Email reminder sent! Check your email for booking details.');
    }, 300);
  };

  useEffect(() => {
    localStorage.setItem('ashors_bookings', JSON.stringify(bookings));
  }, [bookings]);


  useEffect(() => {
    if (view === 'booking') window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getUpcomingDays = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        full: formatDate(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();

  const takenSlots = useMemo(() => {
    const slots: Record<string, string[]> = {};
    const barberName = BARBERS_DATA.find(b => b.id === bookingForm.barberId)?.name || bookingForm.barberId;
    
    bookings.filter(b => b.date === bookingForm.date).forEach(b => {
      // Match by barber name (works for both local and Google Sheet bookings)
      if (b.barber === barberName) {
        if (!slots[bookingForm.barberId]) slots[bookingForm.barberId] = [];
        slots[bookingForm.barberId].push(b.timeSlot);
      }
    });
    return slots;
  }, [bookings, bookingForm.date, bookingForm.barberId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const barberName = BARBERS_DATA.find(b => b.id === bookingForm.barberId)?.name || bookingForm.barberId;
    
    // Check for conflicts: same date, time, and barber
    const hasConflict = bookings.some(b => 
      b.date === bookingForm.date && 
      b.timeSlot === bookingForm.timeSlot && 
      b.barber === barberName
    );
    
    if (hasConflict) {
      setIsSubmitting(false);
      alert('❌ This time slot is already booked! Please choose another date, time, or barber.');
      return;
    }

    const newBooking = {
      ...bookingForm,
      id: Math.random().toString(36).substr(2, 9),
      barber: barberName,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);

    // Send booking to Google Sheets
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (scriptUrl) {
      try {
        const params = new URLSearchParams({
          date: newBooking.date,
          time: newBooking.timeSlot,
          service: newBooking.service,
          name: newBooking.name,
          email: newBooking.email,
          phone: newBooking.phone,
          barber: newBooking.barber,
          bookedAt: newBooking.createdAt
        });
        
        // Use POST method with CORS to get proper response
        const response = await fetch(scriptUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString()
        });
        
        if (!response.ok) {
          console.warn('Google Sheets sync warning:', response.statusText);
        }
      } catch (err) {
        console.warn('Note: Booking saved locally. Google Sheets sync will work once configured.', err);
      }
    } else {
      console.info('Tip: Set VITE_GOOGLE_SCRIPT_URL env var to sync with Google Sheets');
    }

    setIsSubmitting(false);
    setBookingSuccess(true);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  if (false) {
    return (
      <AdminDashboard 
        bookings={bookings} 
        onDelete={deleteBooking}
        onBack={() => setView('landing')} 
      />
    );
  }

  if (view === 'booking') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button 
              onClick={() => {
                setView('landing');
                setBookingSuccess(false);
                setBookingForm({ ...bookingForm, timeSlot: '', barberId: '' });
              }}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>

          </div>

          {bookingSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 bg-[#111] rounded-3xl border border-white/5"
            >
              <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-12">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check className="w-10 h-10 text-black" />
                  </div>
                  <h2 className="text-4xl font-black uppercase italic mb-4">Booking Confirmed!</h2>
                  <p className="text-white/60">
                    Thank you, {bookingForm.name}. Your appointment is set!
                  </p>
                </div>

                {/* Booking Details */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Barber</p>
                      <p className="text-xl font-bold">{BARBERS_DATA.find(b => b.id === bookingForm.barberId)?.name}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-sm uppercase tracking-widest mb-1">Service</p>
                      <p className="text-xl font-bold">{bookingForm.service}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-sm uppercase tracking-widest mb-1">📅 Date</p>
                      <p className="text-xl font-bold">{bookingForm.date}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-sm uppercase tracking-widest mb-1">⏰ Time</p>
                      <p className="text-xl font-bold">{bookingForm.timeSlot}</p>
                    </div>
                  </div>
                </div>

                {/* Reminder Options */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold uppercase italic mb-6 text-center">Set Your Reminder</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Email Reminder */}
                    <button
                      onClick={() => {
                        const barberName = BARBERS_DATA.find(b => b.id === bookingForm.barberId)?.name || bookingForm.barberId;
                        emailReminder({
                          ...bookingForm,
                          barber: barberName,
                          timeSlot: bookingForm.timeSlot
                        });
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all text-left"
                    >
                      <Mail className="w-6 h-6 mb-3 text-white" />
                      <h4 className="font-bold uppercase italic mb-2">Email Reminder</h4>
                      <p className="text-sm text-white/60">Send booking details to your email</p>
                    </button>

                    {/* Calendar Download */}
                    <button
                      onClick={() => {
                        const barberName = BARBERS_DATA.find(b => b.id === bookingForm.barberId)?.name || bookingForm.barberId;
                        downloadCalendarReminder({
                          ...bookingForm,
                          barber: barberName,
                          id: bookings[bookings.length - 1]?.id || 'booking-' + Date.now()
                        });
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-6 transition-all text-left"
                    >
                      <Calendar className="w-6 h-6 mb-3 text-white" />
                      <h4 className="font-bold uppercase italic mb-2">Download Calendar</h4>
                      <p className="text-sm text-white/60">Add to Google Calendar, Outlook, etc.</p>
                    </button>
                  </div>
                </div>

                {/* Pro Tip */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-12 text-sm">
                  <p className="text-white/60 leading-relaxed">
                    💡 <strong>Pro Tip:</strong> After downloading, you can set a 60-minute reminder in your calendar app. We'll also display your bookings below for easy access.
                  </p>
                </div>

                <button 
                  onClick={() => setView('landing')}
                  className="w-full bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-tighter hover:scale-105 transition-transform"
                >
                  Return Home
                </button>
              </div>
            </motion.div>
          ) : (
            <div>
              <div className="mb-12">
                <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">Book Appointment</h1>
                <p className="text-white/50 font-light italic">Fill out the details below to secure your spot.</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-12">

                <section className="space-y-6">
                  <h3 className="text-xl font-bold uppercase italic border-b border-white/10 pb-4">1. What Would You Like to Book?</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SERVICES.map((service) => (
                      <button
                        key={service.name}
                        type="button"
                        onClick={() => setBookingForm({...bookingForm, service: service.name})}
                        className={`p-5 rounded-2xl border transition-all text-left ${
                          bookingForm.service === service.name
                            ? 'border-white bg-white/5'
                            : 'border-white/5 bg-[#111] hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold uppercase italic text-sm">{service.name}</span>
                          <span className="font-mono text-sm">{service.price}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-white/30 uppercase tracking-widest">
                          <Clock className="w-3 h-3" />{service.duration}
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-bold uppercase italic border-b border-white/10 pb-4">2. Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <User className="w-3 h-3" /> Full Name
                      </label>
                      <input 
                        required type="text" value={bookingForm.name}
                        onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <input 
                        required type="email" value={bookingForm.email}
                        onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Phone Number
                      </label>
                      <input 
                        required type="tel" value={bookingForm.phone}
                        onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:border-white outline-none transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold uppercase italic">3. Select Date</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                      {new Date(bookingForm.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                    {upcomingDays.map((day) => (
                      <button
                        key={day.full} type="button"
                        onClick={() => setBookingForm({...bookingForm, date: day.full, timeSlot: ''})}
                        className={`flex-shrink-0 w-20 py-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${
                          bookingForm.date === day.full 
                            ? 'bg-white border-white text-black' 
                            : 'bg-[#111] border-white/5 text-white/60 hover:border-white/20'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{day.dayName}</span>
                        <span className="text-xl font-black italic">{day.dayNum}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{day.month}</span>
                      </button>
                    ))}
                    <div className="flex-shrink-0 relative">
                      <input 
                        type="date" min={new Date().toISOString().split('T')[0]} value={bookingForm.date}
                        onChange={e => setBookingForm({...bookingForm, date: e.target.value, timeSlot: ''})}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className={`w-20 h-full py-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${
                        !upcomingDays.some(d => d.full === bookingForm.date)
                          ? 'bg-white border-white text-black' 
                          : 'bg-[#111] border-white/5 text-white/60 hover:border-white/20'
                      }`}>
                        <Calendar className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">More</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-bold uppercase italic border-b border-white/10 pb-4">4. Select Barber</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BARBERS_DATA.map(barber => (
                      <button
                        key={barber.id} type="button"
                        onClick={() => setBookingForm({...bookingForm, barberId: barber.id, timeSlot: ''})}
                        className={`p-6 rounded-2xl border transition-all text-left ${bookingForm.barberId === barber.id ? 'border-white bg-white/5' : 'border-white/5 bg-[#111] hover:border-white/20'}`}
                      >
                        <h4 className="font-bold uppercase italic text-sm mb-1">{barber.name}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter">{barber.role}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {bookingForm.barberId && (
                  <motion.section 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl font-bold uppercase italic border-b border-white/10 pb-4">5. Select Time Slot</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {TIME_SLOTS.map(slot => {
                        const isTaken = takenSlots[bookingForm.barberId]?.includes(slot);
                        return (
                          <button
                            key={slot} type="button" disabled={isTaken}
                            onClick={() => setBookingForm({...bookingForm, timeSlot: slot})}
                            className={`py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                              isTaken 
                                ? 'bg-white/5 border-transparent text-white/20 cursor-not-allowed' 
                                : bookingForm.timeSlot === slot
                                  ? 'bg-white border-white text-black'
                                  : 'bg-[#111] border-white/5 hover:border-white text-white/60'
                            }`}
                          >
                            {isTaken ? 'Taken' : slot}
                          </button>
                        );
                      })}
                    </div>
                  </motion.section>
                )}

                <button
                  type="submit"
                  disabled={!bookingForm.service || !bookingForm.timeSlot || isSubmitting}
                  className="w-full bg-white disabled:bg-white/10 disabled:text-white/20 text-black py-6 rounded-2xl text-xl font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Calendar className="w-6 h-6" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <Scissors className="w-8 h-8 text-white" />
            <span className="text-2xl font-bold tracking-tighter uppercase italic">Ashor's Fade</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Services', 'Gallery', 'Reviews', 'Location'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-sm font-medium uppercase tracking-widest hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => setView('booking')}
              aria-label="Book an appointment"
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold uppercase tracking-tighter hover:scale-105 transition-transform"
            >
              Book Now
            </button>
          </div>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {['Services', 'Gallery', 'Reviews', 'Location'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-2xl font-bold uppercase tracking-widest"
                >
                  {item}
                </button>
              ))}
              <button 
                onClick={() => { setView('booking'); setIsMenuOpen(false); }}
                aria-label="Book an appointment"
                className="bg-white text-black py-4 rounded-xl text-xl font-bold uppercase text-center"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — STEP 5: secureImages.hero */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={secureImages.hero}
            alt="Ashor's Fade Storefront" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block text-white font-mono text-sm tracking-[0.3em] uppercase mb-4">
              Est. 15 Years of Excellence
            </span>
            <h1 className="text-6xl md:text-9xl font-black uppercase italic leading-[0.85] tracking-tighter mb-8">
              Stay Fresh.<br />Stay Sharp.
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Discover Ashor's Fade, where skilled barbers deliver precision fades and exceptional grooming services. 
              Experience clean cuts, friendly atmosphere, and meticulous attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setView('booking')}
                aria-label="Book your fade"
                className="bg-white text-black px-10 py-5 rounded-full text-lg font-black uppercase tracking-tighter hover:scale-105 transition-transform flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Your Fade
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                aria-label="View our portfolio"
                className="border border-white/20 hover:bg-white/10 px-10 py-5 rounded-full text-lg font-bold uppercase tracking-tighter transition-all"
              >
                View Our Work
              </button>
            </div>
          </motion.div>
        </div>
        <motion.div 
          animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Features Bar */}
      <div className="bg-[#111] border-y border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Scissors, label: "Master Barbers", sub: "6+ Expert Chairs" },
            { icon: Award, label: "Top Rated", sub: "4.9/5 on Google" },
            { icon: Clock, label: "Efficiency", sub: "No Rushed Cuts" },
            { icon: Users, label: "Community", sub: "Family Friendly" }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <item.icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold uppercase text-sm tracking-widest">{item.label}</h3>
              <p className="text-xs text-white/40 uppercase mt-1 tracking-tighter">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About — STEP 5: secureImages.about */}
      <section id="about" className="py-32 px-6 bg-black scroll-mt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-square">
            <img 
              src={secureImages.about}
              alt="Ashor's Fade Team" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-white font-mono text-xs tracking-widest uppercase mb-2 block">Our Story</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8">About Us</h2>
            <div className="space-y-6 text-white/70 font-light leading-relaxed text-lg">
              <p>
                Ashor's Fade is a great barbershop in Skokie, Illinois. Sargon and Ashor are very skilled and take their time to give clean fades and sharp beard trims.
              </p>
              <p>
                The shop feels friendly and comfortable, so it's easy to talk and relax while getting your haircut. They pay close attention to every detail, making sure each cut looks just right for you.
              </p>
              <p>
                After 15 years, Ashor's Fade has become a place people trust. You don't just leave with a haircut—you leave feeling confident and happy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-32 px-6 bg-black scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-white font-mono text-xs tracking-widest uppercase mb-2 block">Menu</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Services</h2>
            </div>
            <p className="max-w-md text-white/50 text-right font-light italic">
              "Every cut is clean, sharp, and consistent. We take the time to get every detail right."
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-black p-10 hover:bg-[#111] transition-colors group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold uppercase italic tracking-tight group-hover:text-white transition-colors">
                      {service.name}
                    </h3>
                    <div className="text-right">
                      <span className="text-2xl font-mono text-white block">{service.price}</span>
                      <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />{service.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/40 font-light leading-relaxed mb-6">{service.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    Professional Service
                  </div>
                  <button 
                    onClick={() => { setBookingForm({ ...bookingForm, service: service.name }); setView('booking'); }}
                    className="bg-white/5 hover:bg-white hover:text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery — STEP 5: secureImages.gallery */}
      <section id="gallery" className="py-32 px-6 bg-[#111] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-white font-mono text-xs tracking-widest uppercase mb-2 block">Portfolio</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Our Work</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {secureImages.gallery.map((url, i) => (
              <motion.div 
                key={i} whileHover={{ scale: 1.02 }}
                className="relative group aspect-[3/4] overflow-hidden rounded-3xl border border-white/10"
              >
                <img 
                  src={url} alt={GALLERY_TITLES[i]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <div>
                    <Camera className="w-6 h-6 text-white mb-2" />
                    <h4 className="text-xl font-bold uppercase italic">{GALLERY_TITLES[i]}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-32 px-6 bg-[#111] overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-20">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter">Reviews</h2>
            <div className="flex-1 h-px bg-white/10" />
            <div className="flex items-center gap-1 text-white">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((review, i) => (
              <div key={i} className="bg-black p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-white fill-current" />
                    ))}
                  </div>
                  <p className="text-white/70 italic font-light leading-relaxed mb-6">"{review.text}"</p>
                </div>
                <div className="border-t border-white/5 pt-6">
                  <h4 className="font-bold uppercase text-sm tracking-tight">{review.name}</h4>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-32 px-6 bg-black scroll-mt-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-white font-mono text-xs tracking-widest uppercase mb-2 block">Visit Us</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-10">Skokie's Finest</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Address</h4>
                  <p className="text-white/60 font-light">3443 Dempster St, Skokie, IL 60076</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Hours</h4>
                  <div className="grid grid-cols-2 gap-x-8 text-white/60 font-light">
                    <span>Mon - Sat</span><span>09:30 AM - 07:00 PM</span>
                    <span>Sunday</span><span>Closed</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-1">Contact</h4>
                  <p className="text-white/60 font-light">+1 847-329-0721</p>
                </div>
              </div>
            </div>
            <div className="mt-12 flex gap-4">
              <a href="https://www.instagram.com/ashors_fade_/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/p/Ashors-Fade-100063462344046/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.647414068305!2d-87.7156!3d42.0416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fc93333333333%3A0x3333333333333333!2s3443%20Dempster%20St%2C%20Skokie%2C%20IL%2060076!5e0!3m2!1sen!2sus!4v1711111111111!5m2!1sen!2sus"
              width="100%" height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(1) opacity(0.6)' }}
              allowFullScreen={true} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ashor's Fade Location"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-black/80 backdrop-blur-md p-8 rounded-2xl text-center border border-white/10 max-w-xs pointer-events-auto">
                <MapPin className="w-10 h-10 text-white mx-auto mb-4" />
                <p className="text-sm font-bold uppercase mb-4">Located on Dempster St</p>
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=3443+Dempster+St,+Skokie,+IL+60076" 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-white" />
            <span className="text-xl font-bold tracking-tighter uppercase italic">Ashor's Fade</span>
          </div>
          <p className="text-white/30 text-xs uppercase tracking-widest">
            © 2024 Ashor's Fade Barbershop. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <button onClick={() => scrollToSection('hero')} aria-label="Scroll to top" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white">Back to Top</button>
            <a href="#" aria-label="View Privacy Policy" className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminDashboard({ bookings, onDelete, onBack }: { bookings: any[], onDelete: (id: string) => void, onBack: () => void }) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const sendConfirmation = async (booking: any) => {
    setProcessingId(booking.id);
    setTimeout(() => {
      setNotification({ message: 'Confirmation SMS sent (Demo)!', type: 'success' });
      setProcessingId(null);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      onDelete(id);
      setNotification({ message: 'Booking deleted successfully!', type: 'success' });
      setProcessingId(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl ${
              notification.type === 'success' ? 'bg-white text-black' : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
            <p className="text-white/50 font-mono text-xs mt-2 uppercase tracking-widest">Manage All Bookings (Local Demo)</p>
          </div>
          <button 
            onClick={onBack}
            className="bg-white/5 hover:bg-white hover:text-black px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Back to Site
          </button>
        </div>

        <div className="grid gap-4">
          {bookings.length === 0 ? (
            <div className="text-center py-20 bg-[#111] rounded-3xl border border-white/5">
              <p className="text-white/40 uppercase font-bold tracking-widest">No bookings found</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-[#111] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="grid md:grid-cols-4 gap-8 flex-1">
                  <div>
                    <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Client</span>
                    <p className="font-bold">{booking.name}</p>
                    <p className="text-xs text-white/50">{booking.email}</p>
                    <p className="text-xs text-white/50">{booking.phone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Service</span>
                    <p className="font-bold uppercase italic text-sm">{booking.service}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Barber</span>
                    <p className="font-bold uppercase italic text-sm">{BARBERS_DATA.find(b => b.id === booking.barberId)?.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Time</span>
                    <p className="font-bold text-sm">{booking.date}</p>
                    <p className="text-xs text-white/50">{booking.timeSlot}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    disabled={processingId === booking.id}
                    onClick={() => sendConfirmation(booking)}
                    className={`text-white/30 hover:text-white transition-colors p-2 ${processingId === booking.id ? 'animate-pulse opacity-50' : ''}`}
                    title="Send Confirmation SMS"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button 
                    disabled={processingId === booking.id}
                    onClick={() => handleDelete(booking.id)}
                    className={`text-red-500/50 hover:text-red-500 transition-colors p-2 ${processingId === booking.id ? 'animate-pulse opacity-50' : ''}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
