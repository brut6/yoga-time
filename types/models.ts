
// Core Domain Models

export type Vibe = 
  | 'soft_healing'
  | 'therapeutic'
  | 'strong_athletic'
  | 'spiritual_mindful'
  | 'breath_calm'
  | 'slow_luxury'
  | 'transformational'
  | 'beginner_friendly'
  | 'advanced_level'
  | 'feminine_flow'
  | 'masculine_strength';

export type VibePersona = 'healer' | 'power' | 'dreamer' | 'flow';

export type MoodState = 'calm' | 'anxious' | 'energetic' | 'tired' | 'focused' | 'emotional';

export type PracticeIntensity = 'gentle' | 'moderate' | 'fiery';

export interface UserDNA {
  persona: VibePersona;
  lastCheckIn: string;
  primaryVibes: Vibe[]; // The top 3 vibes
  energyLevel: 'low' | 'medium' | 'high';
  // New Premium Fields
  recommendedStyle: string; // e.g. "Yin Restoration", "Power Vinyasa"
  intensity: PracticeIntensity;
}

export interface Money {
  amount: number;
  currency: string; // ISO 4217 code (e.g. "USD", "EUR")
}

export interface Location {
  country: string;
  city: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Rating {
  average: number; // 0.0 to 5.0
  count: number;
}

export interface Organizer {
  id: string;
  name: string;
  photo: string; // URL or DataURL
  rating: Rating;
  description?: string;
  descriptionI18n?: {
    en?: string;
    ru?: string;
    he?: string;
    [key: string]: string | undefined;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

export interface InstructorPackage {
  id: string;
  name: string; // e.g. "Trial", "5 Sessions"
  sessionCount: number;
  price: Money;
  discountPercentage?: number;
  features?: string[];
  bestValue?: boolean;
}

export interface DigitalProduct {
  id: string;
  title: string;
  type: 'course' | 'meditation' | 'workshop';
  price: Money;
  sales: number;
  image: string; // URL or DataURL
  status: 'active' | 'draft';
}

export interface Student {
  id: string;
  name: string;
  photo: string;
  status: 'active' | 'inactive';
  totalSessions: number;
  lastSeen: string;
}

export interface CertificationDetail {
  title: string;
  issuer?: string;
  year?: string;
}

export interface Instructor {
  id: string;
  name: string;
  photo: string; // Avatar URL or DataURL
  coverImage?: string; // Profile Cover
  introVideo?: string; // Video URL
  mediaGallery?: string[]; // Additional photos
  tagline?: string; 
  location: Location;
  languages: string[];
  tags: string[]; // Legacy tags (keep for backward compat)
  vibes: Vibe[]; // NEW VIBE SYSTEM
  rating: Rating;
  bio?: string;
  pricePerHour?: Money;
  verified?: boolean; 
  status?: 'active' | 'inactive' | 'pending'; // Admin Moderation
  
  // NEW FIELDS
  videoIntro?: string; // Legacy mapping
  experienceYears?: number;
  certifications?: string[]; // Legacy simple list
  specializations?: string[]; 
  targetAudience?: string[]; 
  testimonials?: Testimonial[];
  socials?: { instagram?: string; website?: string };
  
  // FILTERING FIELDS
  teachingMode?: 'online' | 'in_person' | 'both';
  levels?: ('beginner' | 'intermediate' | 'advanced')[];
  pace?: 'slow' | 'balanced' | 'dynamic';

  // INSTRUCTOR FIT LAYER (New)
  goals?: string[];
  teachingStyles?: string[];
  approach?: 'gentle' | 'structured' | 'energetic' | 'therapeutic';
  certificationsDetails?: CertificationDetail[];
  trialAvailable?: boolean;
  trialDurationMin?: number;
  trialPriceFrom?: Money;
  communicationTone?: 'soft' | 'neutral' | 'direct';

  // BOOKING
  packages?: InstructorPackage[];
  availability?: string[]; // ISO date strings
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  type: 'practice' | 'meal' | 'workshop' | 'leisure' | 'other';
}

export interface ProgramDay {
  day: number;
  title: string;
  description: string;
  timeStart?: string;
  timeEnd?: string;
  items?: ScheduleItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface JourneyPhase {
  title: string;
  description: string;
  tips: string[];
}

export interface Journey {
  before: JourneyPhase;
  during: JourneyPhase;
  after: JourneyPhase;
}

export interface FollowUpPractice {
  title: string;
  duration: string;
  type: 'audio' | 'video';
}

export interface SupportOption {
  title: string;
  description: string;
  price: Money;
}

export interface Aftercare {
  followUpPractices: FollowUpPractice[];
  supportOptions: SupportOption[];
}

export interface Retreat {
  id: string;
  title: string;
  photo: string; // Main Cover URL or DataURL
  gallery?: string[]; // Additional images
  introVideo?: string; // Video URL
  location: Location;
  dates: {
    start: string; // ISO 8601 Date string
    end: string;   // ISO 8601 Date string
  };
  durationDays: number;
  priceFrom: Money;
  organizer: Organizer;
  instructors?: Instructor[];
  tags: string[]; // Legacy tags
  vibes: Vibe[]; // NEW VIBE SYSTEM
  rating: Rating;
  description?: string;
  boost?: {
    type: 'featured' | 'top_list' | 'highlight';
    expiresAt: string;
  };
  status?: 'published' | 'draft' | 'archived'; // Admin Moderation
  
  // TRANSFORMATION PAGE FIELDS
  heroVideo?: string; // Mock thumbnail for video
  transformationPromise?: string[]; // List of benefits
  program?: ProgramDay[];
  dailyJourney?: ProgramDay[]; // Simplified itinerary
  suitableFor?: string[];
  notSuitableFor?: string[];
  included?: string[];
  notIncluded?: string[];
  faq?: FAQItem[];
  preparation?: string[];

  // JOURNEY FIELDS
  journey?: Journey;
  aftercare?: Aftercare;

  // NEW FILTERS
  difficulty?: 'light' | 'deep' | 'hardcore';
  retreatType?: 'vipassana' | 'yoga' | 'meditation' | 'hybrid';
  goals?: string[]; // 'stress', 'healing', 'spiritual', 'detox'
  comfortLevel?: 'simple' | 'comfort' | 'luxury';
  isSilence?: boolean;
}

export type SubscriptionPlanId = 'free' | 'premium' | 'pro';
