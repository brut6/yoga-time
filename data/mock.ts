
import { Retreat, Instructor, Organizer, InstructorPackage, DigitalProduct, Student } from '../types';

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80";

// --- ORGANIZERS ---

const ORG_1: Organizer = {
  id: "org_1",
  name: "Zen Travels",
  photo: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=200&q=80",
  rating: { average: 4.9, count: 120 },
  description: "Curating premium wellness experiences since 2010.",
  descriptionI18n: {
    en: "Curating premium wellness experiences since 2010.",
    ru: "Создаем премиальные велнес-путешествия с 2010 года.",
    he: "יוצרים חוויות בריאות יוקרתיות מאז 2010."
  }
};

const ORG_2: Organizer = {
  id: "org_2",
  name: "Mindful Collective",
  photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
  rating: { average: 4.8, count: 85 },
  description: "A collective of teachers dedicated to mindfulness.",
  descriptionI18n: {
    en: "A collective of teachers dedicated to mindfulness.",
    ru: "Коллектив учителей, посвятивших себя практике осознанности.",
    he: "קולקטיב של מורים המוקדש למיינדפולנס."
  }
};

// Helper to create packages
const createPackages = (basePrice: number, currency: string): InstructorPackage[] => [
// ... rest of the file stays same until the end
  {
    id: 'trial',
    name: 'Trial Session',
    sessionCount: 1,
    price: { amount: Math.floor(basePrice * 0.6), currency },
    features: ['30 mins intro', 'Goal setting'],
    discountPercentage: 40
  },
  {
    id: 'single',
    name: '1 Session',
    sessionCount: 1,
    price: { amount: basePrice, currency },
    features: ['60 mins practice', 'Personal feedback']
  },
  {
    id: 'pack_5',
    name: '5 Sessions',
    sessionCount: 5,
    price: { amount: basePrice * 5 * 0.9, currency },
    discountPercentage: 10,
    features: ['Valid for 2 months', 'Priority booking']
  },
  {
    id: 'pack_10',
    name: '10 Sessions',
    sessionCount: 10,
    price: { amount: basePrice * 10 * 0.85, currency },
    discountPercentage: 15,
    features: ['Valid for 4 months', 'Video recordings'],
    bestValue: true
  }
];

// Helper to create mock availability slots (next 7 days)
const createAvailability = () => {
  const dates = [];
  const now = new Date();
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    d.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0); // Random hour between 9 and 17
    dates.push(d.toISOString());
    const d2 = new Date(d);
    d2.setHours(d.getHours() + 2); // Another slot 2 hours later
    dates.push(d2.toISOString());
  }
  return dates;
};

// --- INSTRUCTOR DASHBOARD DATA ---

export const MOCK_DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "prod_1",
    title: "7-Day Morning Flow",
    type: "course",
    price: { amount: 49, currency: "USD" },
    sales: 124,
    image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "prod_2",
    title: "Sleep Soundly Meditation",
    type: "meditation",
    price: { amount: 19, currency: "USD" },
    sales: 312,
    image: "https://images.unsplash.com/photo-1515023115689-58247348833e?auto=format&fit=crop&w=400&q=80",
    status: "active"
  },
  {
    id: "prod_3",
    title: "Inversions Workshop",
    type: "workshop",
    price: { amount: 89, currency: "USD" },
    sales: 0,
    image: "https://images.unsplash.com/photo-1599447332159-43d9e8d64485?auto=format&fit=crop&w=400&q=80",
    status: "draft"
  }
];

export const MOCK_STUDENTS: Student[] = [
  { id: "s1", name: "Alice M.", photo: "https://i.pravatar.cc/150?u=s1", status: 'active', totalSessions: 12, lastSeen: '2 days ago' },
  { id: "s2", name: "Bob D.", photo: "https://i.pravatar.cc/150?u=s2", status: 'active', totalSessions: 5, lastSeen: '5 days ago' },
  { id: "s3", name: "Charlie K.", photo: "https://i.pravatar.cc/150?u=s3", status: 'inactive', totalSessions: 24, lastSeen: '1 month ago' },
  { id: "s4", name: "Dana S.", photo: "https://i.pravatar.cc/150?u=s4", status: 'active', totalSessions: 8, lastSeen: 'Yesterday' },
];

// --- INSTRUCTOR ---

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: "inst_1",
    name: "Sarah Jenkins",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", // Higher res
    tagline: "Helping you find stillness in movement.",
    location: { country: "Indonesia", city: "Ubud" },
    languages: ["English", "German"],
    tags: ["Vinyasa", "Hatha", "Breathwork"],
    vibes: ['soft_healing', 'breath_calm', 'beginner_friendly'],
    rating: { average: 4.95, count: 210 },
    bio: "I believe yoga is more than just poses; it's a way to reconnect with your true self. With over 15 years of practice, my classes focus on alignment, breath, and emotional release. I help high-achievers slow down and find balance in a chaotic world.",
    pricePerHour: { amount: 80, currency: "USD" },
    experienceYears: 15,
    verified: true,
    certifications: ["E-RYT 500", "Trauma-Informed Yoga", "Breathwork Facilitator"],
    // New Fit Fields
    approach: 'therapeutic',
    communicationTone: 'soft',
    trialAvailable: true,
    trialDurationMin: 30,
    trialPriceFrom: { amount: 30, currency: "USD" },
    goals: ["Stress Relief", "Emotional Balance"],
    
    specializations: ["Stress Relief", "Anxiety Management", "Flexibility"],
    targetAudience: ["Busy Professionals", "Beginners", "Burnout Recovery"],
    videoIntro: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=800&q=80", // Placeholder for video thumb
    testimonials: [
      { id: "t1", name: "Jessica M.", text: "Sarah's energy is absolutely healing. I walked in stressed and left feeling like a new person.", rating: 5, date: "2024-03-10" },
      { id: "t2", name: "David K.", text: "The best Vinyasa class I've taken in years. Her cues are precise and gentle.", rating: 5, date: "2024-02-15" }
    ],
    teachingMode: 'both',
    levels: ['beginner', 'intermediate'],
    pace: 'slow',
    packages: createPackages(80, "USD"),
    availability: createAvailability()
  },
  {
    id: "inst_2",
    name: "Miguel Rodriguez",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    tagline: "Flow like the ocean, ground like the earth.",
    location: { country: "Costa Rica", city: "Nosara" },
    languages: ["English", "Spanish"],
    tags: ["Ashtanga", "Power Yoga", "Surfing"],
    vibes: ['strong_athletic', 'masculine_strength', 'transformational'],
    rating: { average: 4.90, count: 180 },
    bio: "Combining the power of Ashtanga with the flow of the ocean. My practice is dynamic, challenging, yet deeply grounding. Perfect for those looking to build strength and resilience.",
    pricePerHour: { amount: 75, currency: "USD" },
    experienceYears: 10,
    verified: true,
    certifications: ["RYT 200", "Ashtanga Authorized Level 1"],
    // Fit Fields
    approach: 'energetic',
    communicationTone: 'direct',
    trialAvailable: true,
    trialDurationMin: 20,
    trialPriceFrom: { amount: 25, currency: "USD" },
    goals: ["Strength", "Endurance"],

    specializations: ["Strength Building", "Athletic Recovery", "Men's Yoga"],
    targetAudience: ["Athletes", "Surfers", "Intermediate Yogis"],
    testimonials: [
      { id: "t3", name: "Alex P.", text: "Miguel pushes you to your limit but keeps it safe and fun. Great vibes.", rating: 5, date: "2024-01-20" }
    ],
    teachingMode: 'in_person',
    levels: ['intermediate', 'advanced'],
    pace: 'dynamic',
    packages: createPackages(75, "USD"),
    availability: createAvailability()
  },
  {
    id: "inst_3",
    name: "Hiroshi Tanaka",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    tagline: "Silence is the loudest answer.",
    location: { country: "Japan", city: "Kyoto" },
    languages: ["Japanese", "English"],
    tags: ["Zen", "Meditation", "Yin"],
    vibes: ['spiritual_mindful', 'slow_luxury', 'advanced_level'],
    rating: { average: 5.0, count: 95 },
    bio: "A monk-trained mindfulness teacher sharing the secrets of Kyoto's temples. I guide students through deep meditation and Yin Yoga to unlock inner peace.",
    pricePerHour: { amount: 120, currency: "USD" },
    experienceYears: 25,
    verified: true,
    certifications: ["Zen Master", "Yin Yoga Certified"],
    // Fit Fields
    approach: 'gentle',
    communicationTone: 'soft',
    trialAvailable: false,
    goals: ["Inner Peace", "Mindfulness"],

    specializations: ["Meditation", "Deep Rest", "Spiritual Growth"],
    targetAudience: ["Seekers", "Advanced Practitioners", "Anyone needing peace"],
    testimonials: [],
    teachingMode: 'both',
    levels: ['beginner', 'intermediate', 'advanced'],
    pace: 'slow',
    packages: createPackages(120, "USD"),
    availability: createAvailability()
  },
  {
    id: "inst_4",
    name: "Emma Clarke",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    tagline: "Gentle guidance for modern life.",
    location: { country: "UK", city: "London" },
    languages: ["English"],
    tags: ["Restorative", "Prenatal", "Wellness"],
    vibes: ['feminine_flow', 'soft_healing', 'beginner_friendly'],
    rating: { average: 4.85, count: 150 },
    bio: "Gentle guidance for modern life stress relief. Specializing in women's health and restorative practices.",
    pricePerHour: { amount: 90, currency: "GBP" },
    experienceYears: 8,
    verified: false,
    certifications: ["RYT 500", "Prenatal Certified"],
    // Fit Fields
    approach: 'therapeutic',
    communicationTone: 'soft',
    trialAvailable: true,
    trialDurationMin: 30,
    trialPriceFrom: { amount: 40, currency: "GBP" },
    goals: ["Women's Health", "Recovery"],

    specializations: ["Women's Health", "Prenatal", "Postnatal"],
    targetAudience: ["Mothers", "Pregnant Women", "Stress Relief"],
    teachingMode: 'online',
    levels: ['beginner'],
    pace: 'slow',
    packages: createPackages(90, "GBP"),
    availability: createAvailability()
  },
  {
    id: "inst_5",
    name: "Raj Patel",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    tagline: "Traditional yoga from the source.",
    location: { country: "India", city: "Rishikesh" },
    languages: ["Hindi", "English", "Sanskrit"],
    tags: ["Traditional", "Philosophy", "Mantra"],
    vibes: ['spiritual_mindful', 'transformational', 'masculine_strength'],
    rating: { average: 4.98, count: 300 },
    bio: "Deep dive into the roots of Yoga in the holy city of Rishikesh. I teach not just asana, but the philosophy of life.",
    pricePerHour: { amount: 40, currency: "USD" },
    experienceYears: 20,
    verified: true,
    certifications: ["Yoga Alliance India", "Ayurveda Practitioner"],
    // Fit Fields
    approach: 'structured',
    communicationTone: 'direct',
    trialAvailable: true,
    goals: ["Philosophy", "Tradition"],

    specializations: ["Philosophy", "Mantra Chanting", "Pranayama"],
    targetAudience: ["Teachers", "Deep Divers", "Traditionalists"],
    teachingMode: 'in_person',
    levels: ['intermediate', 'advanced'],
    pace: 'balanced',
    packages: createPackages(40, "USD"),
    availability: createAvailability()
  },
  {
    id: "inst_6",
    name: "Chloe Dubois",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    tagline: "Elegance in every breath.",
    location: { country: "France", city: "Paris" },
    languages: ["French", "English"],
    tags: ["Pilates", "Core", "Vinyasa"],
    vibes: ['feminine_flow', 'strong_athletic', 'beginner_friendly'],
    rating: { average: 4.75, count: 110 },
    bio: "Strength and elegance combined in dynamic flows. Fusion of Pilates and Yoga for a strong core.",
    pricePerHour: { amount: 85, currency: "EUR" },
    experienceYears: 6,
    verified: true,
    certifications: ["Pilates Mat 1 & 2", "RYT 200"],
    // Fit Fields
    approach: 'structured',
    communicationTone: 'neutral',
    goals: ["Core", "Posture"],

    specializations: ["Core Strength", "Posture", "Toning"],
    targetAudience: ["Dancers", "Fitness Enthusiasts"],
    teachingMode: 'both',
    levels: ['beginner', 'intermediate'],
    pace: 'dynamic',
    packages: createPackages(85, "EUR"),
    availability: createAvailability()
  },
  {
    id: "inst_7",
    name: "David Miller",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    tagline: "Unlock your energy potential.",
    location: { country: "USA", city: "Los Angeles" },
    languages: ["English"],
    tags: ["Kundalini", "Sound Healing"],
    vibes: ['spiritual_mindful', 'breath_calm', 'transformational'],
    rating: { average: 4.80, count: 130 },
    bio: "Unlocking energy potential through Kundalini and sound. Transformational experiences guaranteed.",
    pricePerHour: { amount: 110, currency: "USD" },
    experienceYears: 12,
    verified: true,
    certifications: ["KRI Level 2", "Sound Healer"],
    // Fit Fields
    approach: 'energetic',
    communicationTone: 'direct',
    goals: ["Energy", "Awakening"],

    specializations: ["Energy Work", "Chakra Balancing", "Sound Baths"],
    targetAudience: ["Spiritual Seekers", "Creative Minds"],
    teachingMode: 'in_person',
    levels: ['beginner', 'intermediate', 'advanced'],
    pace: 'balanced',
    packages: createPackages(110, "USD"),
    availability: createAvailability()
  },
  {
    id: "inst_8",
    name: "Li Wei",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    tagline: "Defy gravity, find freedom.",
    location: { country: "Singapore", city: "Singapore" },
    languages: ["Chinese", "English"],
    tags: ["Aerial", "AcroYoga", "Flexibility"],
    vibes: ['strong_athletic', 'advanced_level', 'feminine_flow'],
    rating: { average: 4.92, count: 160 },
    bio: "Taking yoga to new heights with Aerial practice. Playful, fun, and challenging.",
    pricePerHour: { amount: 100, currency: "SGD" },
    experienceYears: 7,
    verified: false,
    certifications: ["Aerial Yoga Teacher", "AcroYoga Level 1"],
    // Fit Fields
    approach: 'energetic',
    communicationTone: 'neutral',
    goals: ["Fun", "Flexibility"],

    specializations: ["Inversions", "Trust Building", "Fun Flow"],
    targetAudience: ["Adventurous Souls", "Couples"],
    teachingMode: 'in_person',
    levels: ['intermediate'],
    pace: 'dynamic',
    packages: createPackages(100, "SGD"),
    availability: createAvailability()
  }
];

export const MOCK_RETREATS: Retreat[] = [
  {
    id: "retreat_1",
    title: "Awaken in Bali: Jungle Immersion",
    photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80"
    ],
    location: { country: "Indonesia", city: "Ubud" },
    dates: { start: "2024-06-10", end: "2024-06-17" },
    durationDays: 7,
    priceFrom: { amount: 1200, currency: "USD" },
    organizer: ORG_1,
    instructors: [MOCK_INSTRUCTORS[0]], // Sarah Jenkins
    tags: ["Yoga", "Meditation", "Jungle"],
    vibes: ["soft_healing", "spiritual_mindful", "breath_calm"],
    rating: { average: 4.9, count: 45 },
    description: "Immerse yourself in the lush jungles of Bali. Reconnect with nature and your inner self through daily yoga, meditation, and cultural excursions.",
    difficulty: 'light',
    retreatType: 'yoga',
    goals: ['stress', 'healing'],
    comfortLevel: 'luxury',
    isSilence: false,
    program: [
        { day: 1, title: "Arrival & Opening Circle", description: "Welcome to Bali. Settle in and meet your tribe." },
        { day: 2, title: "Root Chakra Flow", description: "Grounding practice to connect with the earth." },
        { day: 3, title: "Water Temple Purification", description: "Traditional Balinese cleansing ritual." },
        { day: 4, title: "Silence & Reflection", description: "A day of noble silence to deepen your practice." },
        { day: 5, title: "Heart Opening Cacao Ceremony", description: "Connect with joy and love." },
        { day: 6, title: "Sunrise Volcano Hike", description: "Optional hike to witness the dawn." },
        { day: 7, title: "Closing Circle", description: "Integration and farewells." }
    ],
    dailyJourney: [
        { day: 1, title: "Arrival & Opening Circle", description: "Welcome to Bali. Settle in and meet your tribe." },
        { day: 2, title: "Root Chakra Flow", description: "Grounding practice to connect with the earth." },
        { day: 3, title: "Water Temple Purification", description: "Traditional Balinese cleansing ritual." },
        { day: 4, title: "Silence & Reflection", description: "A day of noble silence to deepen your practice." },
        { day: 5, title: "Heart Opening Cacao Ceremony", description: "Connect with joy and love." },
        { day: 6, title: "Sunrise Volcano Hike", description: "Optional hike to witness the dawn." },
        { day: 7, title: "Closing Circle", description: "Integration and farewells." }
    ],
    journey: {
        before: { title: "Preparation", description: "Set your intentions.", tips: ["Hydrate", "Journal", "Pack light"] },
        during: { title: "Immersion", description: "Be present.", tips: ["Disconnect", "Feel", "Breathe"] },
        after: { title: "Integration", description: "Bring it home.", tips: ["Practice", "Community", "Patience"] }
    },
    aftercare: {
        followUpPractices: [
            { title: "Morning Grounding", duration: "20 min", type: "video" }
        ],
        supportOptions: [
            { title: "Integration Call", description: "1-on-1 with Sarah", price: { amount: 100, currency: "USD" } }
        ]
    }
  },
  {
    id: "retreat_2",
    title: "Amalfi Coast Yoga & Culture",
    photo: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    location: { country: "Italy", city: "Positano" },
    dates: { start: "2024-07-15", end: "2024-07-21" },
    durationDays: 6,
    priceFrom: { amount: 2500, currency: "EUR" },
    organizer: ORG_2,
    instructors: [MOCK_INSTRUCTORS[5]], // Chloe Dubois
    tags: ["Yoga", "Culture", "Luxury"],
    vibes: ["slow_luxury", "feminine_flow", "breath_calm"],
    rating: { average: 4.8, count: 32 },
    description: "La Dolce Vita meets mindfulness. Enjoy sunrise yoga overlooking the Mediterranean, followed by Italian cooking classes and boat trips.",
    difficulty: 'light',
    retreatType: 'yoga',
    goals: ['stress', 'detox'],
    comfortLevel: 'luxury',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Benvenuti in Amalfi", description: "Sunset welcome drink and light restorative yoga on the terrace." },
      { day: 2, title: "Mediterranean Morning", description: "Sunrise Vinyasa overlooking the sea followed by a local breakfast." },
      { day: 3, title: "Cultural Immersion", description: "A guided walk through Positano and a private cooking class." },
      { day: 4, title: "Boat Day & Blue Grotto", description: "Exploring the coast from the water. Meditation at sea." },
      { day: 5, title: "Deep Rest & Reflection", description: "Afternoon Yin yoga and journaling session." },
      { day: 6, title: "Arrivederci Brunch", description: "Final closing circle and farewell feast." }
    ]
  },
  {
    id: "retreat_3",
    title: "Kyoto Zen Temple Experience",
    photo: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    location: { country: "Japan", city: "Kyoto" },
    dates: { start: "2024-10-01", end: "2024-10-10" },
    durationDays: 10,
    priceFrom: { amount: 3000, currency: "USD" },
    organizer: ORG_1,
    instructors: [MOCK_INSTRUCTORS[2]], // Hiroshi Tanaka
    tags: ["Zen", "Meditation", "Silence"],
    vibes: ["spiritual_mindful", "advanced_level", "breath_calm"],
    rating: { average: 5.0, count: 18 },
    description: "Stay in a traditional temple. Practice Zazen meditation with monks. Experience true silence and simplicity.",
    difficulty: 'deep',
    retreatType: 'vipassana',
    goals: ['spiritual', 'healing'],
    comfortLevel: 'simple',
    isSilence: true,
    dailyJourney: [
      { day: 1, title: "Entering the Gate", description: "Orientation and introduction to temple etiquette." },
      { day: 2, title: "Zazen Basics", description: "Learning the posture and breath of Zen meditation." },
      { day: 3, title: "Silent Walking", description: "Kinhin walking meditation in the bamboo forest." },
      { day: 4, title: "Noble Silence Begins", description: "Entering a period of deep silence for inner work." },
      { day: 5, title: "Tea Ceremony", description: "Mindful observation of the traditional tea ritual." },
      { day: 6, title: "Koan Practice", description: "Introduction to Zen riddles with the master." },
      { day: 7, title: "Day of Silence", description: "Full day of Zazen and silent reflection." },
      { day: 8, title: "Day of Silence", description: "Continuing the deep dive into consciousness." },
      { day: 9, title: "Breaking Silence", description: "Gentle reintegration and sharing circle." },
      { day: 10, title: "Departure", description: "Morning prayers and cleaning the temple before leaving." }
    ]
  },
  {
    id: "retreat_4",
    title: "Nosara Surf & Soul",
    photo: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
    location: { country: "Costa Rica", city: "Nosara" },
    dates: { start: "2024-11-10", end: "2024-11-17" },
    durationDays: 7,
    priceFrom: { amount: 1800, currency: "USD" },
    organizer: ORG_2,
    instructors: [MOCK_INSTRUCTORS[1]], // Miguel Rodriguez
    tags: ["Surf", "Yoga", "Adventure"],
    vibes: ["strong_athletic", "masculine_strength", "transformational"],
    rating: { average: 4.9, count: 60 },
    description: "Ride the waves and flow on the mat. A perfect balance of adrenaline and zen for the active soul.",
    difficulty: 'hardcore',
    retreatType: 'hybrid',
    goals: ['stress', 'detox'],
    comfortLevel: 'comfort',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Pura Vida Welcome", description: "Sunset beach gathering and introduction to the surf team." },
      { day: 2, title: "Foundations of Surf", description: "Morning surf lesson covering pop-up basics. Afternoon yoga for shoulders." },
      { day: 3, title: "Catching Green Waves", description: "Moving to the outside break. Power yoga to build core stability." },
      { day: 4, title: "Jungle Adventure", description: "Zip-lining through the canopy or ATV tour." },
      { day: 5, title: "Advanced Technique", description: "Video analysis of your surf session. Deep stretch recovery." },
      { day: 6, title: "Sunset Free Surf", description: "Putting it all together in a golden hour session." },
      { day: 7, title: "Bonfire Closing", description: "Beach bonfire and sharing stories of the week." }
    ]
  },
  {
    id: "retreat_5",
    title: "Rishikesh: Roots of Yoga",
    photo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80",
    location: { country: "India", city: "Rishikesh" },
    dates: { start: "2024-03-01", end: "2024-03-14" },
    durationDays: 14,
    priceFrom: { amount: 900, currency: "USD" },
    organizer: ORG_1,
    instructors: [MOCK_INSTRUCTORS[4]], // Raj Patel
    tags: ["Traditional", "Philosophy", "Ashram"],
    vibes: ["spiritual_mindful", "transformational", "beginner_friendly"],
    rating: { average: 4.7, count: 110 },
    description: "A deep dive into the origins of yoga by the holy Ganges river. Ashram living, philosophy lectures, and intense sadhana.",
    difficulty: 'deep',
    retreatType: 'yoga',
    goals: ['spiritual', 'healing'],
    comfortLevel: 'simple',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Arrival in the Holy City", description: "Settling into the ashram and evening Aarti by the Ganges." },
      { day: 2, title: "Introduction to Hatha", description: "Traditional Hatha Yoga practice and philosophy lecture." },
      { day: 3, title: "Pranayama Basics", description: "Learning to control the life force energy." },
      { day: 4, title: "Visit to Vashistha Cave", description: "Meditation in an ancient cave used by sages." },
      { day: 5, title: "Karma Yoga", description: "Selfless service in the ashram kitchen." },
      { day: 6, title: "Study of Sutras", description: "Discourse on Patanjali's Yoga Sutras." },
      { day: 7, title: "Rest Day", description: "Free time to explore the markets and cafes." },
      { day: 8, title: "Advanced Asana", description: "Deepening the physical practice." },
      { day: 9, title: "Mantra Chanting", description: "The power of sound and vibration." },
      { day: 10, title: "Ganga Dip", description: "Purification ritual in the river." },
      { day: 11, title: "Silence & Fasting", description: "Optional day of fasting and silence." },
      { day: 12, title: "Fire Ceremony", description: "Traditional Havan ceremony for transformation." },
      { day: 13, title: "Integration", description: "Sharing circle and future guidance." },
      { day: 14, title: "Departure", description: "Farewell and checkout." }
    ]
  },
  {
    id: "retreat_6",
    title: "Sedona Red Rocks Spiritual Journey",
    photo: "https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&w=800&q=80",
    location: { country: "USA", city: "Sedona" },
    dates: { start: "2024-05-20", end: "2024-05-25" },
    durationDays: 5,
    priceFrom: { amount: 1500, currency: "USD" },
    organizer: ORG_2,
    instructors: [MOCK_INSTRUCTORS[6]], // David Miller
    tags: ["Vortex", "Energy", "Hiking"],
    vibes: ["spiritual_mindful", "strong_athletic", "breath_calm"],
    rating: { average: 4.8, count: 40 },
    description: "Harness the vortex energy of Sedona. Daily hikes, energy work, and sunset meditations.",
    difficulty: 'deep',
    retreatType: 'meditation',
    goals: ['spiritual', 'healing'],
    comfortLevel: 'comfort',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Arrival & Grounding", description: "Welcome circle and grounding meditation on the red rocks." },
      { day: 2, title: "Bell Rock Vortex", description: "Morning hike to Bell Rock for energy work." },
      { day: 3, title: "Cathedral Rock Sunset", description: "Challenging climb rewarded by a sunset meditation." },
      { day: 4, title: "Sound Healing", description: "Crystal bowl sound bath under the stars." },
      { day: 5, title: "Closing Ceremony", description: "Integration and departure." }
    ]
  },
  {
    id: "retreat_7",
    title: "Santorini Sunset Flow",
    photo: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    location: { country: "Greece", city: "Oia" },
    dates: { start: "2024-08-01", end: "2024-08-07" },
    durationDays: 7,
    priceFrom: { amount: 2800, currency: "EUR" },
    organizer: ORG_1,
    instructors: [MOCK_INSTRUCTORS[0], MOCK_INSTRUCTORS[5]],
    tags: ["Luxury", "Views", "Relaxation"],
    vibes: ["slow_luxury", "soft_healing", "feminine_flow"],
    rating: { average: 4.9, count: 25 },
    description: "Unparalleled luxury on the cliffs of Santorini. Infinity pools, sunset flows, and exquisite Greek cuisine.",
    difficulty: 'light',
    retreatType: 'yoga',
    goals: ['stress', 'detox'],
    comfortLevel: 'luxury',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Kalimera Santorini", description: "Champagne welcome and sunset viewing." },
      { day: 2, title: "Aegean Morning Flow", description: "Gentle yoga overlooking the caldera." },
      { day: 3, title: "Volcanic Wine Tasting", description: "Visiting local vineyards and tasting unique wines." },
      { day: 4, title: "Catamaran Cruise", description: "Sailing around the island, swimming in hot springs." },
      { day: 5, title: "Rest & Spa", description: "Free day for spa treatments and relaxation." },
      { day: 6, title: "Sunset Meditation", description: "Final practice during the famous Oia sunset." },
      { day: 7, title: "Farewell Breakfast", description: "Greek yogurt, honey, and goodbyes." }
    ]
  },
  {
    id: "retreat_8",
    title: "Alpine Detox & Wellness",
    photo: "https://images.unsplash.com/photo-1504280501179-fac52dd23685?auto=format&fit=crop&w=800&q=80",
    location: { country: "Switzerland", city: "Zermatt" },
    dates: { start: "2024-09-10", end: "2024-09-15" },
    durationDays: 5,
    priceFrom: { amount: 3500, currency: "CHF" },
    organizer: ORG_2,
    instructors: [MOCK_INSTRUCTORS[3]], // Emma Clarke
    tags: ["Detox", "Mountain", "Spa"],
    vibes: ["soft_healing", "breath_calm", "slow_luxury"],
    rating: { average: 4.9, count: 15 },
    description: "Breathe the fresh mountain air. A focused detox program with spa treatments, light hiking, and restorative yoga.",
    difficulty: 'light',
    retreatType: 'hybrid',
    goals: ['detox', 'healing'],
    comfortLevel: 'luxury',
    isSilence: false,
    dailyJourney: [
      { day: 1, title: "Mountain Welcome", description: "Arrival in Zermatt and intro to the detox menu." },
      { day: 2, title: "Alpine Hike", description: "Gentle hiking with views of the Matterhorn." },
      { day: 3, title: "Thermal Spa Day", description: "Hydrotherapy and massage treatments." },
      { day: 4, title: "Restorative Yoga", description: "Deep relaxation to aid the detox process." },
      { day: 5, title: "Closing & Departure", description: "Feeling lighter and revitalized." }
    ]
  }
];