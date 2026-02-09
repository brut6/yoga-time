
import { Vibe, VibePersona, UserDNA, PracticeIntensity } from '../types';

const STORAGE_KEY = 'yt_vibe_dna';

interface PersonaDef {
  id: VibePersona;
  vibes: Vibe[];
}

export const PERSONAS: Record<VibePersona, PersonaDef> = {
  healer: {
    id: 'healer',
    vibes: ['soft_healing', 'breath_calm', 'beginner_friendly']
  },
  power: {
    id: 'power',
    vibes: ['strong_athletic', 'masculine_strength', 'transformational']
  },
  dreamer: {
    id: 'dreamer',
    vibes: ['spiritual_mindful', 'slow_luxury', 'breath_calm']
  },
  flow: {
    id: 'flow',
    vibes: ['feminine_flow', 'beginner_friendly', 'soft_healing']
  }
};

export const vibeService = {
  getDNA: (): UserDNA | null => {
    try {
      if (typeof window === 'undefined') return null;
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  calculateDNA: (answers: { energy: string; mood: string; goal: string }): UserDNA => {
    let persona: VibePersona = 'flow';
    let vibes: Vibe[] = [];
    let style = 'Vinyasa Flow';
    let intensity: PracticeIntensity = 'moderate';

    // 1. Determine Logic based on Energy (Driver) + Goal (Direction)
    
    if (answers.energy === 'low') {
      // Low Energy Cases
      if (answers.mood === 'stress' || answers.goal === 'rest') {
        persona = 'healer';
        vibes = ['soft_healing', 'breath_calm', 'therapeutic'];
        style = 'Yin & Restore';
        intensity = 'gentle';
      } else {
        persona = 'dreamer';
        vibes = ['spiritual_mindful', 'slow_luxury', 'breath_calm'];
        style = 'Meditation';
        intensity = 'gentle';
      }
    } else if (answers.energy === 'high') {
      // High Energy Cases
      if (answers.goal === 'sweat') {
        persona = 'power';
        vibes = ['strong_athletic', 'masculine_strength', 'transformational'];
        style = 'Power Yoga';
        intensity = 'fiery';
      } else {
        persona = 'flow';
        vibes = ['feminine_flow', 'advanced_level', 'strong_athletic'];
        style = 'Dynamic Vinyasa';
        intensity = 'moderate';
      }
    } else {
      // Medium Energy Cases
      if (answers.goal === 'spirit') {
        persona = 'dreamer';
        vibes = ['spiritual_mindful', 'transformational', 'advanced_level'];
        style = 'Kundalini';
        intensity = 'moderate';
      } else if (answers.mood === 'stress') {
        persona = 'healer';
        vibes = ['soft_healing', 'therapeutic', 'beginner_friendly'];
        style = 'Gentle Flow';
        intensity = 'gentle';
      } else {
        persona = 'flow';
        vibes = ['feminine_flow', 'slow_luxury', 'breath_calm'];
        style = 'Hatha Flow';
        intensity = 'moderate';
      }
    }

    const dna: UserDNA = {
      persona,
      lastCheckIn: new Date().toISOString(),
      primaryVibes: vibes,
      energyLevel: answers.energy as any,
      recommendedStyle: style,
      intensity
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dna));
    }

    return dna;
  },

  clearDNA: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }
};
