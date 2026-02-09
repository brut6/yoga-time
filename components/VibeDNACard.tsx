
import React from 'react';
import { useSafeTranslation } from '../hooks';
import { UserDNA, VibePersona } from '../types';
import { VibeChip } from './VibeChip';

interface Props {
  dna: UserDNA;
  onUpdate: () => void;
}

// Gentle, barely-there tints instead of full gradients
const TINTS: Record<VibePersona, string> = {
  healer: 'rgba(235, 240, 240, 0.6)', 
  power: 'rgba(240, 234, 230, 0.6)', 
  dreamer: 'rgba(235, 235, 242, 0.6)', 
  flow: 'rgba(236, 240, 232, 0.6)', 
};

export const VibeDNACard: React.FC<Props> = ({ dna, onUpdate }) => {
  const { t } = useSafeTranslation();
  
  return (
    <div style={{ 
      backgroundColor: TINTS[dna.persona] || '#F9F8F6',
      borderRadius: 24,
      padding: '24px 20px',
      marginBottom: 32,
      border: '1px solid rgba(0,0,0,0.04)',
      boxShadow: '0 8px 30px -10px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'start'
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ 
            fontSize: '0.75rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            color: 'var(--text-3)', 
            marginBottom: 4,
            fontWeight: 600
          }}>
            {t('common.yourVibe')}
          </div>
          <h2 className="yt-h1" style={{ 
            fontSize: '1.6rem', 
            margin: 0,
            color: 'var(--text-1)',
            lineHeight: 1.1
          }}>
            {t(`dna.personas.${dna.persona}.title`)}
          </h2>
        </div>
        <button 
          onClick={onUpdate}
          style={{ 
            fontSize: '0.75rem', 
            fontWeight: 500, 
            color: 'var(--text-2)', 
            border: '1px solid rgba(0,0,0,0.1)', 
            padding: '6px 12px', 
            borderRadius: 20,
            cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.5)'
          }}
        >
          {t('dna.update')}
        </button>
      </div>

      {/* Recommended Style Row */}
      {dna.recommendedStyle && (
        <div style={{ marginBottom: 20, display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{t('dna.recommendation')}</div>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-1)' }}>{dna.recommendedStyle}</div>
          </div>
          <div style={{ width: 1, backgroundColor: 'rgba(0,0,0,0.05)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{t('dna.intensity')}</div>
            <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-1)' }}>{t(`dna.intensities.${dna.intensity}`)}</div>
          </div>
        </div>
      )}

      {/* Tags Row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {dna.primaryVibes.map((vibe) => (
          <VibeChip key={vibe} vibe={vibe} size="sm" variant="gradient" />
        ))}
      </div>
    </div>
  );
};
