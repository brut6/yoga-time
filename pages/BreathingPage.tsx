
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { storageService, subscriptionService } from '../services';

type BreathingStatus = 'idle' | 'running' | 'finished';
type Phase = 'inhale' | 'hold' | 'exhale' | 'hold_empty';
type PatternId = 'balance' | 'deep' | 'visama_soft' | 'visama_deep' | 'sama_square';
type SoundMode = 'zen' | 'ocean' | 'rain' | 'forest';
type VisualStyle = 'field' | 'geometry';

interface BreathingPattern {
  id: PatternId;
  cycleDuration: number;
  phases: { inhale: number; hold: number; exhale: number; holdEmpty?: number; };
  isPro: boolean;
}

const PATTERNS: Record<PatternId, BreathingPattern> = {
  balance: { 
    id: 'balance', 
    cycleDuration: 12, 
    phases: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 0 }, 
    isPro: false 
  },
  deep: { 
    id: 'deep', 
    cycleDuration: 19, 
    phases: { inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 }, 
    isPro: true 
  },
  visama_soft: { 
    id: 'visama_soft', 
    cycleDuration: 12, 
    phases: { inhale: 4, hold: 0, exhale: 8, holdEmpty: 0 }, 
    isPro: false 
  },
  visama_deep: { 
    id: 'visama_deep', 
    cycleDuration: 16, 
    phases: { inhale: 4, hold: 4, exhale: 8, holdEmpty: 0 }, 
    isPro: true 
  },
  sama_square: { 
    id: 'sama_square', 
    cycleDuration: 16, 
    phases: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 }, 
    isPro: true 
  }
};

const SOUND_MODES: {id: SoundMode; labelKey: string}[] = [
  { id: 'zen', labelKey: 'breathing.sounds.zen' },
  { id: 'ocean', labelKey: 'breathing.sounds.ocean' },
  { id: 'rain', labelKey: 'breathing.sounds.rain' },
  { id: 'forest', labelKey: 'breathing.sounds.forest' },
];

const SoundOnIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);
const SoundOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

// --- Breathing Field Component (Visama) ---
const BreathingField = ({ phase, duration, isExpanding }: { phase: Phase, duration: number, isExpanding: boolean }) => {
  const getWaveHeight = (p: Phase) => {
    switch(p) {
      case 'inhale': return '85%';
      case 'hold': return '88%';
      case 'exhale': return '15%';
      case 'hold_empty': return '12%';
      default: return '15%';
    }
  };

  const height = getWaveHeight(phase);
  const ease = isExpanding ? 'cubic-bezier(0.4, 0.0, 0.2, 1)' : 'cubic-bezier(0.4, 0.0, 0.6, 1)';

  return (
    <div style={{ 
      position: 'relative', width: 260, height: 260, 
      borderRadius: '50%', overflow: 'hidden',
      background: '#F5F0EB', 
      boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.05), 0 20px 50px rgba(199, 162, 124, 0.15)',
      border: '1px solid rgba(255,255,255,0.5)',
      transform: isExpanding ? 'scale(1.05)' : 'scale(0.95)',
      transition: `transform ${duration}s ${ease}`
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: height,
        transition: `height ${duration}s ${ease}`,
        willChange: 'height'
      }}>
        {/* Wave 1 */}
        <div style={{
          position: 'absolute', top: -40, left: '-50%', width: '200%', height: '100%',
          opacity: 0.4,
          fill: '#D7CCC8', 
          animation: 'waveMove 12s linear infinite'
        }}>
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
            <path d="M0,50 C200,80 300,20 500,50 C700,80 800,20 1000,50 V100 H0 Z" fill="#D7CCC8" />
          </svg>
          <div style={{ width: '100%', height: '100%', background: '#D7CCC8', marginTop: -1 }} />
        </div>

        {/* Wave 2 */}
        <div style={{
          position: 'absolute', top: -30, left: '-50%', width: '200%', height: '100%',
          opacity: 0.9,
          animation: 'waveMove 8s linear infinite reverse'
        }}>
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ width: '100%', height: 50 }}>
            <path d="M0,50 C250,20 350,80 500,50 C650,20 750,80 1000,50 V100 H0 Z" fill="#EBE5DF" />
          </svg>
          <div style={{ width: '100%', height: '100%', background: '#EBE5DF', marginTop: -1 }} />
        </div>
      </div>
      <style>{`@keyframes waveMove { 0% { transform: translateX(0); } 100% { transform: translateX(50%); } }`}</style>
    </div>
  );
};

// --- Ring Progress Component ---
const PhaseRing = ({ duration, phase }: { duration: number, phase: Phase }) => {
  const radius = 140; // Ring radius
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div style={{ 
      position: 'absolute', top: '50%', left: '50%', 
      transform: 'translate(-50%, -50%) rotate(-90deg)', 
      width: 300, height: 300, pointerEvents: 'none', zIndex: 0
    }}>
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle 
          cx="150" cy="150" r={radius} 
          fill="none" 
          stroke="rgba(199, 162, 124, 0.2)" 
          strokeWidth="1" 
        />
        <circle 
          key={phase} // Force re-render on phase change to restart animation
          cx="150" cy="150" r={radius} 
          fill="none" 
          stroke="var(--gold-sand)" 
          strokeWidth="1.5"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{
            animation: `progressRing ${duration}s linear forwards`
          }}
        />
      </svg>
      <style>{`
        @keyframes progressRing {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{ 
    fontSize: '0.7rem', 
    fontWeight: 600, 
    textTransform: 'uppercase', 
    letterSpacing: '0.15em', 
    color: 'var(--text-3)', 
    marginBottom: 16,
    paddingLeft: 4,
    textAlign: 'start',
    width: '100%'
  }}>
    {children}
  </h3>
);

interface StyleCardProps {
  selected: boolean;
  title: string;
  subtitle: string;
  desc: string;
  onClick: () => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ selected, title, subtitle, desc, onClick }) => (
  <div onClick={onClick} style={{
    border: selected ? '1px solid var(--gold-sand)' : '1px solid rgba(0,0,0,0.06)',
    backgroundColor: selected ? '#FFFCF9' : '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: selected ? '0 8px 24px rgba(201, 178, 160, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
    textAlign: 'start',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {selected && <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', backgroundColor: 'var(--gold-sand)' }} />}
    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: 4 }}>{title}</h4>
    <div style={{ fontSize: '0.85rem', color: 'var(--gold-sand)', marginBottom: 8, fontWeight: 500 }}>{subtitle}</div>
    <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.4, margin: 0 }}>{desc}</p>
  </div>
);

export const BreathingPage = () => {
  const { tsafe, i18n } = useSafeTranslation();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<BreathingStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [activePatternId, setActivePatternId] = useState<PatternId>('balance');
  const [activeSoundMode, setActiveSoundMode] = useState<SoundMode>('zen');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('field'); // 'field' | 'geometry'
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('yt_sound_enabled') !== 'false';
    return true;
  });

  const isRtl = i18n.language === 'he';

  useEffect(() => {
    setStreak(storageService.getBreathingStreak());
  }, []);

  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]); 

  // Audio Logic kept same as before (omitted for brevity in prompt context but included in full file below)
  // ... (Audio Synthesis Engine Code) ...
  const createNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    return buffer;
  };
  const createPinkNoiseBuffer = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; 
      b6 = white * 0.115926;
    }
    return buffer;
  };
  const initAudio = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!CtxClass) return;
      const ctx = new CtxClass();
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    } catch (e) { console.error("Audio init failed", e); }
  }, [soundEnabled]);

  const startAmbient = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const master = masterGainRef.current;
    activeNodesRef.current.forEach(node => { try { (node as any).stop?.(); node.disconnect(); } catch(e){} });
    activeNodesRef.current = [];

    if (activeSoundMode === 'zen') {
      const osc1 = ctx.createOscillator(); osc1.type = 'sine'; osc1.frequency.value = 140; 
      const osc2 = ctx.createOscillator(); osc2.type = 'sine'; osc2.frequency.value = 144; 
      const gain = ctx.createGain(); gain.gain.value = 0.1; 
      osc1.connect(gain); osc2.connect(gain); gain.connect(master);
      osc1.start(now); osc2.start(now);
      activeNodesRef.current.push(osc1, osc2, gain);
    } else if (activeSoundMode === 'ocean') {
      const buffer = createPinkNoiseBuffer(ctx);
      const src = ctx.createBufferSource(); src.buffer = buffer; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.Q.value = 1;
      const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.15; 
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 600; 
      filter.frequency.value = 800;
      lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
      const mainGain = ctx.createGain(); mainGain.gain.value = 0.3;
      src.connect(filter); filter.connect(mainGain); mainGain.connect(master);
      src.start(now); lfo.start(now);
      activeNodesRef.current.push(src, filter, lfo, lfoGain, mainGain);
    } else if (activeSoundMode === 'rain') {
      const buffer = createNoiseBuffer(ctx);
      const src = ctx.createBufferSource(); src.buffer = buffer; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800; 
      const gain = ctx.createGain(); gain.gain.value = 0.15;
      src.connect(filter); filter.connect(gain); gain.connect(master);
      src.start(now); activeNodesRef.current.push(src, filter, gain);
    } else if (activeSoundMode === 'forest') {
      const buffer = createPinkNoiseBuffer(ctx);
      const src = ctx.createBufferSource(); src.buffer = buffer; src.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 400;
      const filter2 = ctx.createBiquadFilter(); filter2.type = 'lowpass'; filter2.frequency.value = 1200;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.1;
      const mainGain = ctx.createGain(); mainGain.gain.value = 0.2;
      lfo.connect(lfoGain); lfoGain.connect(mainGain.gain);
      src.connect(filter); filter.connect(filter2); filter2.connect(mainGain); mainGain.connect(master);
      src.start(now); lfo.start(now);
      activeNodesRef.current.push(src, filter, filter2, lfo, lfoGain, mainGain);
    }
    master.gain.cancelScheduledValues(now);
    master.gain.linearRampToValueAtTime(1, now + 2); 
  }, [activeSoundMode]);

  const playCue = useCallback((type: 'start' | 'shift') => {
    if (!soundEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(masterGainRef.current);
      osc.type = 'sine'; osc.frequency.setValueAtTime(type === 'start' ? 440 : 330, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4);
      osc.start(now); osc.stop(now + 4);
    } catch (e) { console.warn("Cue play error", e); }
  }, [soundEnabled]);

  const stopAudio = useCallback(() => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      if (masterGainRef.current) {
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.linearRampToValueAtTime(0, now + 1.5);
      }
      setTimeout(() => {
        activeNodesRef.current.forEach(node => { try { (node as any).stop?.(); } catch(e){} });
        activeNodesRef.current = [];
        if (ctx.state !== 'closed') { ctx.close(); }
        audioCtxRef.current = null;
      }, 1600);
    } catch (e) { console.warn("Stop audio error", e); }
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('yt_sound_enabled', String(newState));
    if (status === 'running') {
      if (newState) { initAudio(); setTimeout(startAmbient, 50); } else { stopAudio(); }
    }
  };

  const selectPattern = (id: PatternId) => {
    const pattern = PATTERNS[id];
    if (pattern.isPro && !subscriptionService.isPremiumOrPro()) { navigate('/paywall'); return; }
    setActivePatternId(id);
  };

  const selectSound = (id: SoundMode) => { setActiveSoundMode(id); };

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { setStatus('finished'); stopAudio(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status, stopAudio]);

  useEffect(() => {
    if (status === 'finished') {
      const newStreak = storageService.markBreathingDone();
      setStreak(newStreak);
    }
  }, [status]);

  useEffect(() => {
    if (status !== 'running') return;
    const pattern = PATTERNS[activePatternId];
    const elapsed = 60 - timeLeft;
    const cycleTime = elapsed % pattern.cycleDuration;
    const { inhale, hold, exhale } = pattern.phases;
    
    let nextPhase: Phase = phase;
    if (cycleTime < inhale) nextPhase = 'inhale';
    else if (cycleTime < inhale + hold) nextPhase = 'hold';
    else if (cycleTime < inhale + hold + exhale) nextPhase = 'exhale';
    else nextPhase = 'hold_empty';

    if (nextPhase !== phase) { setPhase(nextPhase); playCue('shift'); }
  }, [timeLeft, status, phase, playCue, activePatternId]);

  const handleStart = () => {
    setTimeLeft(60); setPhase('inhale'); setStatus('running');
    initAudio(); setTimeout(() => { startAmbient(); playCue('start'); }, 50);
  };

  const handleDone = () => { setStatus('idle'); setTimeLeft(60); setPhase('inhale'); stopAudio(); };
  useEffect(() => () => stopAudio(), [stopAudio]);

  const getPhaseText = (p: Phase) => {
    switch(p) { 
      case 'inhale': return tsafe('breathing.inhale', 'Inhale'); 
      case 'hold': return tsafe('breathing.hold', 'Hold'); 
      case 'exhale': return tsafe('breathing.exhale', 'Exhale'); 
      case 'hold_empty': return tsafe('breathing.hold_empty', 'Pause');
      default: return ''; 
    }
  };
  
  const currentPattern = PATTERNS[activePatternId];
  
  const getPhaseDuration = (p: Phase) => {
    if (p === 'inhale') return currentPattern.phases.inhale;
    if (p === 'hold') return currentPattern.phases.hold;
    if (p === 'exhale') return currentPattern.phases.exhale;
    if (p === 'hold_empty') return currentPattern.phases.holdEmpty || 0;
    return 1;
  };
  const transitionDuration = getPhaseDuration(phase);

  // Visual States
  const isVisama = visualStyle === 'field';
  const isVisamaPattern = activePatternId.includes('visama');
  
  // Orb Logic
  const getOrbState = (p: Phase) => {
    // Base scale = 1.0 (260px)
    switch(p) { 
      case 'inhale': return { scale: 1.1, opacity: 0.95 }; // Expand
      case 'hold': return { scale: 1.12, opacity: 1 }; // Subtle hover peak
      case 'exhale': return { scale: 0.85, opacity: 0.8 }; // Contract
      case 'hold_empty': return { scale: 0.85, opacity: 0.7 }; // Stay contracted
    }
  };
  const orbState = getOrbState(phase);

  // Golden glow specifically for Visama patterns during exhale (long release)
  const showGoldenGlow = isVisamaPattern && phase === 'exhale';

  const containerStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'radial-gradient(circle at 50% 40%, #FFFCF9 0%, #F0EBE6 100%)',
    overflow: 'hidden', zIndex: 2000
  };

  return (
    <div style={containerStyle} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. Header (Floating) */}
      <div style={{ position: 'absolute', top: 0, width: '100%', padding: 'env(safe-area-inset-top) 24px 0', height: 80, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '2rem', fontWeight: 200, cursor: 'pointer', color: 'var(--text-2)', padding: 12, marginInlineStart: -12 }}>×</button>
        <button onClick={toggleSound} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-1)', opacity: soundEnabled ? 1 : 0.4, padding: 12, marginInlineEnd: -12, transition: 'opacity 0.2s' }}>
          {soundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </div>

      {/* 2. IDLE STATE */}
      {status === 'idle' && (
        <div style={{ width: '100%', maxWidth: 400, padding: '32px 24px 100px 24px', paddingTop: 100, textAlign: 'center', animation: 'fadeInSoft 0.8s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', overflowY: 'auto', zIndex: 10 }}>
          
          <div style={{ marginBottom: 32, color: '#A39B96', fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500 }}>
            {tsafe('breathing.streak', 'Day Streak')}: {streak}
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 400, color: 'var(--text-1)', marginBottom: 12 }}>
            {tsafe('breathing.title', 'Breath Practice')}
          </h1>
          <p style={{ fontSize: '1rem', color: '#7A726B', marginBottom: 48, lineHeight: 1.8, maxWidth: 280 }}>
            {tsafe(`breathing.patternDesc.${activePatternId}`, tsafe('breathing.subtitle', 'Select a rhythm to tune your state.'))}
          </p>

          <div style={{ width: '100%', maxWidth: 340 }}>
            
            {/* SECTION 1: STYLE */}
            <div style={{ marginBottom: 32 }}>
              <SectionHeader>{tsafe('breathing.sections.style', 'Visual Style')}</SectionHeader>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                {(['field', 'geometry'] as VisualStyle[]).map((style) => {
                  const isActive = visualStyle === style;
                  return (
                    <StyleCard
                      key={style}
                      selected={isActive}
                      title={tsafe(`breathing.styleSelection.${style}.title`, 'Style')}
                      subtitle={tsafe(`breathing.styleSelection.${style}.subtitle`, 'Type')}
                      desc={tsafe(`breathing.styleSelection.${style}.desc`, 'Description...')}
                      onClick={() => setVisualStyle(style)}
                    />
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: RHYTHM */}
            <div style={{ marginBottom: 32 }}>
              <SectionHeader>{tsafe('breathing.sections.rhythm', 'Rhythm')}</SectionHeader>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'flex-start'
              }}>
                 {Object.values(PATTERNS).map((pat) => (
                   <button key={pat.id} onClick={() => selectPattern(pat.id)}
                     style={{
                       padding: '10px 18px', borderRadius: 100, border: 'none',
                       background: activePatternId === pat.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                       color: activePatternId === pat.id ? '#5D5550' : '#A39B96',
                       boxShadow: activePatternId === pat.id ? '0 4px 12px rgba(199, 162, 124, 0.15)' : 'none',
                       fontWeight: activePatternId === pat.id ? 600 : 400, 
                       cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.85rem',
                       whiteSpace: 'nowrap'
                     }}>
                     {tsafe(`breathing.pattern.${pat.id}`, pat.id)} {pat.isPro && !subscriptionService.isPremiumOrPro() && '🔒'}
                   </button>
                 ))}
              </div>
            </div>

            {/* SECTION 3: SOUNDSCAPE */}
            <div style={{ marginBottom: 48 }}>
              <SectionHeader>{tsafe('breathing.sections.sound', 'Soundscape')}</SectionHeader>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-start', 
                gap: 8,
                flexWrap: 'wrap'
              }}>
                 {SOUND_MODES.map((mode) => (
                   <button key={mode.id} onClick={() => selectSound(mode.id)}
                     style={{
                       padding: '8px 16px', borderRadius: 16, border: '1px solid',
                       borderColor: activeSoundMode === mode.id ? 'var(--gold-sand)' : 'transparent',
                       background: activeSoundMode === mode.id ? 'rgba(199, 162, 124, 0.1)' : 'transparent',
                       color: activeSoundMode === mode.id ? 'var(--text-1)' : 'var(--text-3)',
                       fontWeight: activeSoundMode === mode.id ? 500 : 400, 
                       cursor: 'pointer', transition: 'all 0.2s ease', fontSize: '0.8rem'
                     }}>
                     {tsafe(mode.labelKey, mode.id)}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FIXED CTA (Idle) */}
      {status === 'idle' && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '20px 24px 40px',
          background: 'linear-gradient(to top, rgba(246, 241, 235, 1) 20%, rgba(246, 241, 235, 0) 100%)',
          display: 'flex', justifyContent: 'center', zIndex: 50
        }}>
          <button 
            className="btn-primary btn-gold" 
            onClick={handleStart} 
            style={{ width: '100%', maxWidth: 360, padding: '18px 0', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 12px 32px rgba(199, 162, 124, 0.25)' }}
          >
            {tsafe('breathing.start', 'Start Practice')}
          </button>
        </div>
      )}

      {/* 3. RUNNING STATE */}
      {status === 'running' && (
        <div style={{ 
          width: '100%', height: '100%', 
          display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', 
          position: 'relative' 
        }}>
          
          <div style={{ position: 'relative', width: 340, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Phase Ring (Shows progress) */}
            <PhaseRing duration={transitionDuration} phase={phase} />

            {isVisama ? (
              <BreathingField 
                phase={phase} 
                duration={transitionDuration} 
                isExpanding={phase === 'inhale' || phase === 'hold'} 
              />
            ) : (
              /* Breathing Orb (Geometry) */
              <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Aura / Glow */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: showGoldenGlow 
                    ? 'radial-gradient(circle, rgba(201, 178, 160, 0.6) 0%, rgba(255,255,255,0) 70%)' 
                    : 'radial-gradient(circle, rgba(199, 162, 124, 0.15) 0%, rgba(255,255,255,0) 70%)',
                  transform: `scale(${orbState.scale * 1.6})`,
                  opacity: showGoldenGlow ? 0.8 : orbState.opacity * 0.5,
                  transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0.0, 0.2, 1), opacity ${transitionDuration}s ease`,
                  filter: 'blur(40px)',
                  zIndex: 0
                }} />

                {/* Main Sphere */}
                <div style={{
                  position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FDFBF9 0%, #EBE5DF 100%)',
                  transform: `scale(${orbState.scale})`,
                  boxShadow: `
                    0 20px 50px rgba(163, 155, 148, 0.15),
                    inset 0 0 0 1px rgba(255,255,255,0.6),
                    inset 0 10px 40px rgba(255,255,255,0.8)
                  `,
                  transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0.0, 0.2, 1)`,
                  zIndex: 2
                }} />
              </div>
            )}
          </div>

          {/* Text Overlay (Below Circle) */}
          <div style={{ 
            marginTop: 64,
            textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            pointerEvents: 'none'
          }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '2rem', 
              fontWeight: 400, 
              color: 'var(--text-1)', 
              margin: 0, 
              opacity: phase === 'hold_empty' ? 0.7 : 0.95,
              letterSpacing: '-0.01em',
              transition: 'opacity 1s ease'
            }}>
              {getPhaseText(phase)}
            </h2>
          </div>

          <div style={{ position: 'absolute', bottom: 60, zIndex: 20 }}>
             <button 
                onClick={handleDone} 
                className="btn-secondary"
                style={{ 
                  borderColor: 'rgba(163, 155, 148, 0.3)',
                  color: '#8A817C',
                  fontSize: '0.85rem',
                  padding: '12px 36px',
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                {tsafe('breathing.stop', 'Stop')}
              </button>
          </div>
        </div>
      )}

      {/* 4. FINISHED STATE */}
      {status === 'finished' && (
        <div style={{ width: '100%', maxWidth: 400, padding: 32, textAlign: 'center', animation: 'fadeInSoft 1.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', zIndex: 10 }}>
          <div style={{ fontSize: '4rem', marginBottom: 32, opacity: 0.8, animation: 'float 3s ease-in-out infinite' }}>✨</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--text-1)', marginBottom: 16 }}>{tsafe('breathing.completeTitle', 'Practice Complete')}</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-2)', marginBottom: 56, lineHeight: 1.6, fontWeight: 300 }}>{tsafe('breathing.completeSubtitle', 'You have contributed to your peace.')}</p>
          <button className="btn-primary btn-gold" onClick={handleDone} style={{ padding: '20px 56px' }}>
            {tsafe('breathing.done', 'Done')}
          </button>
        </div>
      )}
    </div>
  );
};