
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSafeTranslation } from '../hooks';
import { MOCK_RETREATS } from '../data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onMatch?: (results: any[]) => void;
}

type Step = 'goal' | 'difficulty' | 'silence' | 'comfort' | 'results';

interface QuizState {
  goal: string;
  difficulty: string;
  silence: string;
  comfort: string;
}

const OPTIONS_MAP: Record<string, { key: string; defaultLabel: string }[]> = {
  goal: [
    { key: 'stress', defaultLabel: 'Stress Relief' },
    { key: 'healing', defaultLabel: 'Deep Healing' },
    { key: 'spiritual', defaultLabel: 'Spiritual Growth' },
    { key: 'detox', defaultLabel: 'Detox & Health' }
  ],
  difficulty: [
    { key: 'light', defaultLabel: 'Light (Relax)' },
    { key: 'deep', defaultLabel: 'Deep (Balance)' },
    { key: 'hardcore', defaultLabel: 'Hardcore (Discipline)' }
  ],
  silence: [
    { key: 'yes', defaultLabel: 'Yes, silence' },
    { key: 'no', defaultLabel: 'No, connection' }
  ],
  comfort: [
    { key: 'simple', defaultLabel: 'Simple' },
    { key: 'comfort', defaultLabel: 'Standard' },
    { key: 'luxury', defaultLabel: 'Luxury' }
  ]
};

// Styles for Micro-Animations (Shared Definition)
const css = `
  @keyframes yt-overlay-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes yt-content-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes yt-content-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(12px); } }
  @keyframes yt-step-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes yt-stagger-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .yt-smart-overlay { animation: yt-overlay-in 0.26s ease-out forwards; }
  .yt-smart-overlay.closing { animation: yt-overlay-in 0.2s ease-in reverse forwards; }

  .yt-smart-content { animation: yt-content-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .yt-smart-content.closing { animation: yt-content-out 0.2s ease-in forwards; }

  .yt-step-container { transition: opacity 0.16s ease, transform 0.16s ease; }
  .yt-step-enter { animation: yt-step-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .yt-step-exit { opacity: 0; transform: translateY(-8px); pointer-events: none; }

  .yt-answer-btn { animation: yt-stagger-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
  .yt-answer-btn:active { transform: scale(0.98); }

  @media (prefers-reduced-motion: reduce) {
    .yt-smart-overlay, .yt-smart-content, .yt-step-enter, .yt-answer-btn { 
      animation: none; transition: none; transform: none !important; opacity: 1 !important; 
    }
    .yt-step-exit { opacity: 0; }
  }
`;

// Elegant Pulse Icon for Loading (Shared Visual)
const PulseIcon = () => (
  <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--gold-sand)', opacity: 0.3, animation: 'pulse-ring 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite' }} />
    <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', backgroundColor: 'var(--gold-sand)', opacity: 0.1 }} />
    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--gold-sand)' }} />
    <style>{`
      @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 0.5; }
        100% { transform: scale(2); opacity: 0; }
      }
    `}</style>
  </div>
);

export const RetreatSmartMatchModal: React.FC<Props> = ({ isOpen, onClose, onMatch }) => {
  const { t } = useSafeTranslation();
  const [step, setStep] = useState<Step>('goal');
  const [answers, setAnswers] = useState<QuizState>({ goal: '', difficulty: '', silence: '', comfort: '' });
  const [isCalculating, setIsCalculating] = useState(false);

  // Animation States
  const [isClosing, setIsClosing] = useState(false);
  const [isStepExiting, setIsStepExiting] = useState(false);

  const reset = () => {
    setStep('goal');
    setAnswers({ goal: '', difficulty: '', silence: '', comfort: '' });
    setIsCalculating(false);
    setIsClosing(false);
    setIsStepExiting(false);
  };

  useEffect(() => {
    if (isOpen) {
      reset();
      window.dispatchEvent(new CustomEvent('yt-toggle-nav', { detail: false }));
      document.body.style.overflow = 'hidden';
    } else {
      window.dispatchEvent(new CustomEvent('yt-toggle-nav', { detail: true }));
      document.body.style.overflow = '';
    }

    return () => {
      if (isOpen) {
        window.dispatchEvent(new CustomEvent('yt-toggle-nav', { detail: true }));
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      reset();
    }, 220);
  };

  if (!isOpen) return null;

  const getOptions = (currentStep: string) => {
    const definitions = OPTIONS_MAP[currentStep] || [];
    return definitions.map(def => ({
      key: def.key,
      label: t(`retreatSmartMatch.options.${currentStep}.${def.key}`, { defaultValue: def.defaultLabel })
    }));
  };

  const handleAnswer = (key: keyof QuizState, value: string) => {
    if (isStepExiting) return;

    setIsStepExiting(true);

    setTimeout(() => {
      const newAnswers = { ...answers, [key]: value };
      setAnswers(newAnswers);
      
      const next = getNextStep(step);
      
      if (next === 'results') {
        setIsCalculating(true);
        setIsStepExiting(false);
        setTimeout(() => {
          calculateMatches(newAnswers);
          setIsCalculating(false);
        }, 1200);
      } else {
        setStep(next);
        setIsStepExiting(false);
      }
    }, 160);
  };

  const getNextStep = (current: Step): Step => {
    switch (current) {
      case 'goal': return 'difficulty';
      case 'difficulty': return 'silence';
      case 'silence': return 'comfort';
      case 'comfort': return 'results';
      default: return 'results';
    }
  };

  const calculateMatches = (finalAnswers: QuizState) => {
    const scored = MOCK_RETREATS.map(r => {
      let score = 0;
      const maxPossibleScore = 50; 

      if (r.goals?.includes(finalAnswers.goal)) score += 20;

      const wantsSilence = finalAnswers.silence === 'yes';
      if (r.isSilence === wantsSilence) score += 15;
      else if (wantsSilence && !r.isSilence) score -= 10;

      if (r.difficulty === finalAnswers.difficulty) score += 10;
      if (r.comfortLevel === finalAnswers.comfort) score += 5;

      const percentage = Math.max(0, Math.min(100, Math.round((score / maxPossibleScore) * 100)));

      return { 
        ...r, 
        _matchScore: percentage,
        _matchReasons: [t('retreatSmartMatch.matchReason')] 
      };
    });

    const topMatches = scored
      .filter(s => s._matchScore > 40)
      .sort((a, b) => b._matchScore - a._matchScore)
      .slice(0, 3);

    setIsClosing(true);
    setTimeout(() => {
      if (onMatch) {
        onMatch(topMatches);
      } else {
        onClose();
        reset();
      }
    }, 220);
  };

  const steps: Step[] = ['goal', 'difficulty', 'silence', 'comfort'];
  const currentStepIndex = steps.indexOf(step);

  return createPortal(
    <div 
      className={`yt-smart-overlay ${isClosing ? 'closing' : ''}`}
      style={{ 
        position: 'fixed', inset: 0, zIndex: 10000, 
        display: 'flex', flexDirection: 'column', 
        backgroundColor: '#F9F8F6',
        height: '100dvh',
        overflow: 'hidden'
      }}
    >
      <style>{css}</style>
      
      {/* 1. Header */}
      <header style={{ 
        paddingTop: 'max(20px, env(safe-area-inset-top))',
        paddingBottom: 10,
        paddingLeft: 24, paddingRight: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
        height: '80px',
        minHeight: 80,
        backgroundColor: '#F9F8F6',
        zIndex: 20
      }}>
        {step !== 'results' && !isCalculating ? (
          <div style={{ display: 'flex', gap: 6 }}>
             {steps.map((s, i) => (
               <div key={s} style={{ 
                 width: 6, height: 6, borderRadius: '50%',
                 backgroundColor: 'var(--gold-sand)',
                 opacity: i === currentStepIndex ? 1 : 0.2,
                 transition: 'opacity 0.3s ease'
               }} />
             ))}
          </div>
        ) : <div style={{ width: 40 }} />}

        <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 600 }}>
          {step === 'results' ? 'YOGA TIME' : t('retreatSmartMatch.title', { defaultValue: 'SMART MATCH' })}
        </span>
        <button 
          onClick={handleClose} 
          style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--text-2)', fontWeight: 200, marginRight: -12 }}
        >
          ×
        </button>
      </header>

      {/* 2. Main Content */}
      {isCalculating ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', animation: 'fadeInSoft 0.8s ease', paddingBottom: '20vh' }}>
          <div style={{ marginBottom: 40 }}>
            <PulseIcon />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-1)', marginBottom: 12, fontWeight: 400, textAlign: 'center' }}>
            {t('smartMatch.loadingTitle', { defaultValue: 'Connecting...' })}
          </h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', letterSpacing: '0.02em', textAlign: 'center', opacity: 0.8, fontStyle: 'italic' }}>
            {t('smartMatch.analyzing', { defaultValue: 'Tuning in to your request...' })}
          </p>
        </div>
      ) : (
        <div 
          className={`yt-smart-content ${isClosing ? 'closing' : ''}`}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}
        >
          {/* ZONE 2: QUESTION */}
          <div 
            className={`yt-step-container ${isStepExiting ? 'yt-step-exit' : 'yt-step-enter'}`}
            style={{ 
              flex: 1,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: 0,
              paddingBottom: '25vh',
              position: isStepExiting ? 'absolute' : 'relative',
              top: 0, left: 0, right: 0, bottom: 0
            }}
          >
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'clamp(1.5rem, 4vh, 2.2rem)', 
              lineHeight: 1.2, 
              color: 'var(--text-1)', 
              textAlign: 'center', 
              fontWeight: 400,
              padding: '0 10px'
            }}>
              {t(`retreatSmartMatch.questions.${step}`)}
            </h2>
          </div>

          {/* ZONE 3: OPTIONS */}
          {!isStepExiting && (
            <div style={{ 
              position: 'absolute',
              bottom: 'calc(24px + env(safe-area-inset-bottom))',
              left: 0, 
              right: 0,
              padding: '0 20px',
              zIndex: 10
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr', 
                gap: 12,
                width: '100%'
              }}>
                {getOptions(step).map((opt, idx) => (
                  <button
                    key={opt.key}
                    onClick={() => handleAnswer(step as keyof QuizState, opt.key)}
                    className="yt-answer-btn"
                    style={{
                      animationDelay: `${idx * 40}ms`,
                      padding: '24px 28px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.03)',
                      borderRadius: 20,
                      color: 'var(--text-1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      textAlign: 'start'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 500, letterSpacing: '0.01em' }}>
                      {opt.label}
                    </span>
                    <span style={{ 
                      opacity: 0.2, 
                      fontSize: '1.2rem', 
                      fontWeight: 300,
                      transform: document.documentElement.dir === 'rtl' ? 'rotate(180deg)' : 'none'
                    }}>→</span>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 24, textAlign: 'center', opacity: 0.6, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {t('smartMatch.hint')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>,
    document.body
  );
};
