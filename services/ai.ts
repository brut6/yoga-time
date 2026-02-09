
import { MoodState, UserDNA, Vibe } from '../types';
import { vibeService } from './vibe';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MOOD_CONFIG: Record<MoodState, { 
  relatedVibes: Vibe[], 
  timeWindows: number[][] // array of [startHour, endHour]
}> = {
  calm: {
    relatedVibes: ['soft_healing', 'breath_calm', 'slow_luxury'],
    timeWindows: [[12, 16], [20, 23]]
  },
  anxious: {
    relatedVibes: ['soft_healing', 'breath_calm', 'beginner_friendly'],
    timeWindows: [[22, 24], [0, 5]] // Late night anxiety
  },
  energetic: {
    relatedVibes: ['strong_athletic', 'masculine_strength', 'transformational'],
    timeWindows: [[6, 11]]
  },
  tired: {
    relatedVibes: ['slow_luxury', 'soft_healing', 'beginner_friendly'],
    timeWindows: [[21, 24], [0, 6]]
  },
  focused: {
    relatedVibes: ['spiritual_mindful', 'advanced_level', 'breath_calm'],
    timeWindows: [[9, 17]]
  },
  emotional: {
    relatedVibes: ['feminine_flow', 'transformational', 'soft_healing'],
    timeWindows: [[18, 22]]
  }
};

export const aiService = {
  
  determineCurrentMood: (): MoodState => {
    const dna = vibeService.getDNA();
    const hour = new Date().getHours();
    
    // 1. Check for specific DNA bias
    let moodBias: MoodState | null = null;
    if (dna) {
      if (dna.persona === 'power') moodBias = 'energetic';
      if (dna.persona === 'healer') moodBias = 'calm';
      if (dna.persona === 'dreamer') moodBias = 'focused';
    }

    // 2. Time-based determination
    let matchedMood: MoodState = 'calm'; // Default
    
    // Simple heuristic for MVP:
    // Morning (6-11): Energetic
    // Day (11-17): Focused
    // Evening (17-21): Calm / Emotional
    // Night (21-6): Tired / Anxious

    if (hour >= 6 && hour < 11) matchedMood = 'energetic';
    else if (hour >= 11 && hour < 17) matchedMood = 'focused';
    else if (hour >= 17 && hour < 21) matchedMood = dna?.persona === 'flow' ? 'emotional' : 'calm';
    else matchedMood = 'tired';

    // 3. DNA Override (50% chance to override purely time-based with Persona bias)
    if (moodBias && Math.random() > 0.5) {
      // Logic: A Power Seeker might still have energy at night, or a Healer might be calm in the morning
      if (dna?.persona === 'power' && matchedMood === 'calm') matchedMood = 'energetic';
      if (dna?.persona === 'healer' && matchedMood === 'energetic') matchedMood = 'calm';
    }

    return matchedMood;
  },

  getVibesForMood: (mood: MoodState): Vibe[] => {
    return MOOD_CONFIG[mood].relatedVibes;
  },

  getMoodGradient: (mood: MoodState): string => {
    // Zen Minimal Luxury Gradients (Subtle, Organic)
    switch (mood) {
      case 'calm': return 'linear-gradient(135deg, #EBE9E4 0%, #E3E0DB 100%)'; // Stone / Mist
      case 'anxious': return 'linear-gradient(135deg, #E0E8E9 0%, #CAD7D6 100%)'; // Sage Green
      case 'energetic': return 'linear-gradient(135deg, #F3E5D8 0%, #E6D5C3 100%)'; // Warm Sand
      case 'tired': return 'linear-gradient(135deg, #E8E6E8 0%, #DCD9DD 100%)'; // Lavender Grey
      case 'focused': return 'linear-gradient(135deg, #E1E6E8 0%, #CFD8DC 100%)'; // Blue Slate
      case 'emotional': return 'linear-gradient(135deg, #F2E6E6 0%, #E6D6D6 100%)'; // Muted Rose
      default: return 'linear-gradient(135deg, #F2F0ED 0%, #EBE5E1 100%)';
    }
  },

  // --- Gemini AI Integration ---
  createChatSession: () => {
    // Return null if API key is missing to handle graceful fallback in UI.
    // process.env.API_KEY is injected by Vite/Bundler.
    const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn("AI Service: API Key missing.");
      return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Inject user context if available
    const dna = vibeService.getDNA();
    const context = dna 
      ? `The user has a "${dna.persona}" vibe profile (Energy: ${dna.energyLevel}, Intensity: ${dna.intensity}).` 
      : "The user is a guest.";

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are Aura, a warm, knowledgeable, and premium wellness concierge for the 'Yoga Time' app. 
      Your tone is calm, supportive, and sophisticated. 
      You help users find retreats, understand yoga styles, breathing techniques, and improve their wellbeing. 
      ${context}
      Keep responses concise, conversational, and helpful. Avoid long lectures. Use emojis sparingly but effectively.`
    });

    return model.startChat({
      history: []
    });
  }
};