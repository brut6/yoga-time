
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSafeTranslation } from '../hooks';
import { vibeService } from '../services';
import { UserDNA } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (dna: UserDNA) => void;
}

export const VibeCheckInModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const { t } = useSafeTranslation();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({ energy: '', mood: '', goal: '' });
  const [animating, setAnimating] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (key: 'energy' | 'mood' | 'goal', value: string) => {
    if (animating) return;
    
    // Optimistic UI: Flash active state then move
    setAnimating(true);
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    
    setTimeout(() => {
      if (step < 3) {
        setStep(step + 1);
        setAnimating(false);
      } else {
        // Finish
        const dna = vibeService.calculateDNA(nextAnswers);
        onComplete(dna);
        onClose();
        // Reset for next time after closing animation (simulated)
        setTimeout(() => {
          setStep(1);
          setAnswers({ energy: '', mood: '', goal: '' });
          setAnimating(false);
        }, 500);
      }
    }, 250); // Slight delay to show selection
  };

  const OptionBtn = ({ label, isSelected, onClick }: { label: string, isSelected: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%', 
        height: 56, // Fixed height for consistency
        padding: '0 24px', 
        textAlign: 'left',
        backgroundColor: isSelected ? '#1F1A16' : 'rgba(255, 255, 255, 0.7)',
        color: isSelected ? '#FFFFFF' : '#1F1A16',
        border: isSelected ? 'none' : '1px solid rgba(0,0,0,0.06)',
        borderRadius: 28, // Pill shape
        marginBottom: 12, 
        fontSize: '1rem',
        fontWeight: isSelected ? 500 : 400,
        boxShadow: isSelected ? '0 8px 20px rgba(31, 26, 22, 0.15)' : 'none',
        transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(8px)'
      }}
    >
      <span>{label}</span>
      {isSelected && <span style={{ fontSize: '1.2rem' }}>•</span>}
    </button>
  );

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return createPortal(
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      backgroundColor: '#F9F8F6', // Warm Ivory
      display: 'flex', flexDirection: 'column',
      paddingBottom: 'env(safe-area-inset-bottom)',
      height: '100dvh'
    }}>
      {/* Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ 
        padding: '24px 24px 0', 
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button 
            onClick={step === 1 ? onClose : handleBack}
            style={{ fontSize: '0.9rem', color: '#B0A8A2', padding: 12, marginLeft: -12 }}
          >
            {step === 1 ? t('common.close') : t('common.back')}
          </button>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', color: '#B0A8A2', textTransform: 'uppercase' }}>
            {t('dna.title')}
          </div>
          <div style={{ width: 40 }} /> {/* Spacer for balance */}
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: 320, height: 2, background: 'rgba(0,0,0,0.06)', borderRadius: 2, marginBottom: 40, overflow: 'hidden' }}>
          <div style={{ 
            width: `${(step / 3) * 100}%`, height: '100%', 
            background: '#1F1A16', 
            transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' 
          }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '0 24px', maxWidth: 480, margin: '0 auto', width: '100%',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ width: '100%', animation: 'fadeInSoft 0.5s ease' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.85rem', color: '#807872', marginBottom: 12 }}>
              {t('dna.subtitle')}
            </div>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#1F1A16', 
              lineHeight: 1.1, fontWeight: 400 
            }}>
              {step === 1 && t('dna.quiz.q1')}
              {step === 2 && t('dna.quiz.q2')}
              {step === 3 && t('dna.quiz.q3')}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {step === 1 && (
              <>
                <OptionBtn label={t('dna.quiz.a1_low')} isSelected={answers.energy === 'low'} onClick={() => handleSelect('energy', 'low')} />
                <OptionBtn label={t('dna.quiz.a1_med')} isSelected={answers.energy === 'medium'} onClick={() => handleSelect('energy', 'medium')} />
                <OptionBtn label={t('dna.quiz.a1_high')} isSelected={answers.energy === 'high'} onClick={() => handleSelect('energy', 'high')} />
              </>
            )}

            {step === 2 && (
              <>
                <OptionBtn label={t('dna.quiz.a2_stress')} isSelected={answers.mood === 'stress'} onClick={() => handleSelect('mood', 'stress')} />
                <OptionBtn label={t('dna.quiz.a2_good')} isSelected={answers.mood === 'good'} onClick={() => handleSelect('mood', 'good')} />
                <OptionBtn label={t('dna.quiz.a2_focus')} isSelected={answers.mood === 'focus'} onClick={() => handleSelect('mood', 'focus')} />
              </>
            )}

            {step === 3 && (
              <>
                <OptionBtn label={t('dna.quiz.a3_rest')} isSelected={answers.goal === 'rest'} onClick={() => handleSelect('goal', 'rest')} />
                <OptionBtn label={t('dna.quiz.a3_sweat')} isSelected={answers.goal === 'sweat'} onClick={() => handleSelect('goal', 'sweat')} />
                <OptionBtn label={t('dna.quiz.a3_spirit')} isSelected={answers.goal === 'spirit'} onClick={() => handleSelect('goal', 'spirit')} />
              </>
            )}
          </div>

        </div>
      </div>

      {/* Footer / Skip */}
      <div style={{ padding: '24px', textAlign: 'center', paddingBottom: 'calc(24px + env(safe-area-inset-bottom))' }}>
        <button 
          onClick={onClose} 
          style={{ fontSize: '0.9rem', color: '#B0A8A2', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {t('common.skip')}
        </button>
      </div>
    </div>,
    document.body
  );
};
