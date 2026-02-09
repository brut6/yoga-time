
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { Retreat } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { userProfileService } from '../services';
import { VibeChip } from './VibeChip';

interface Props {
  retreat: Retreat;
}

export const RetreatCard: React.FC<Props> = ({ retreat }) => {
  const { t } = useSafeTranslation();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Initial check
    setIsSaved(userProfileService.isFavorite('retreat', retreat.id));

    // Listen for updates
    const handleUpdate = (e: any) => {
      const { type, id, isFavorite } = e.detail;
      if (type === 'retreat' && id === retreat.id) {
        setIsSaved(isFavorite);
      }
    };
    window.addEventListener('yt_fav_updated', handleUpdate);
    return () => window.removeEventListener('yt_fav_updated', handleUpdate);
  }, [retreat.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    userProfileService.toggleFavorite('retreat', retreat.id);
  };

  const localizedTitle = t(`data.retreats.${retreat.id}.title`, { defaultValue: retreat.title });
  const localizedCity = t(`cities.${retreat.location.city}`, { defaultValue: retreat.location.city });
  const localizedCountry = t(`countries.${retreat.location.country}`, { defaultValue: retreat.location.country });

  // Prioritize Vibes
  const displayVibes = retreat.vibes && retreat.vibes.length > 0 
    ? retreat.vibes.slice(0, 2) 
    : [];

  const matchScore = (retreat as any)._matchScore;

  const matchContext = useMemo(() => {
    if (!matchScore) return null;
    const parts = [];
    
    if (retreat.vibes?.[0]) {
      const v = t(`vibe.${retreat.vibes[0]}`);
      parts.push(v.split(' ')[0]); 
    }

    if (retreat.isSilence) {
      parts.push(t('retreats.modal.silence.yes').includes('Silence') ? 'Silence' : 'Quiet');
    } else if (retreat.difficulty === 'deep') {
      parts.push('Deepening'); 
    } else if (retreat.difficulty === 'light') {
      parts.push('Light Rhythm');
    } else {
      parts.push('Flow');
    }

    return parts.join(' · ');
  }, [retreat, matchScore, t]);

  return (
    <Link 
      to={`/retreats/${retreat.id}`} 
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div 
        className="luxury-card" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px', 
          overflow: 'hidden',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease',
        }}
      >
        {/* 1. Hero Image */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '66.66%', backgroundColor: '#F2F0ED' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ImageWithFallback 
              src={retreat.photo} 
              alt={localizedTitle} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0) 80%, rgba(0,0,0,0.05) 100%)', pointerEvents: 'none' }} />
          </div>
          
          {/* Match Capsule */}
          {matchScore && (
            <div style={{
              position: 'absolute', top: 16, left: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              padding: '8px 12px', borderRadius: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              border: '1px solid var(--gold-sand)',
              boxShadow: '0 4px 12px rgba(201, 178, 160, 0.2)',
              backdropFilter: 'blur(8px)',
              zIndex: 5,
              minWidth: 120
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{ color: 'var(--gold-sand)', fontSize: '0.8rem' }}>✦</span>
                <span style={{ color: 'var(--text-1)', fontSize: '0.85rem', fontWeight: 700 }}>
                  {t('smartMatch.matchPercentLabel')} {matchScore}%
                </span>
              </div>
              {matchContext && (
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-2)', 
                  fontWeight: 500, 
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  marginLeft: 18 
                }}>
                  {matchContext}
                </span>
              )}
            </div>
          )}

          {/* Heart */}
          <button 
            onClick={handleToggleSave} 
            style={{ 
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: isSaved ? 'var(--gold-sand)' : 'var(--text-3)',
              border: 'none',
              zIndex: 5
            }}
          >
            {isSaved ? '♥' : '♡'}
          </button>

          {/* Rating */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            padding: '4px 10px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 8,
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-1)',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span style={{ color: 'var(--gold-sand)' }}>★</span>
            {retreat.rating.average}
          </div>
        </div>

        {/* 2. Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
             <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
               {localizedCity}, {localizedCountry}
             </span>
             <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--border-strong)' }} />
             <span>{retreat.durationDays} {t('common.daysShort')}</span>
          </div>

          <h3 style={{ 
            margin: '0 0 16px', 
            fontSize: '1.5rem', 
            fontWeight: 500, 
            color: 'var(--text-1)', 
            lineHeight: 1.25,
            fontFamily: 'var(--font-serif)',
            letterSpacing: '-0.01em'
          }}>
            {localizedTitle}
          </h3>

          {displayVibes.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {displayVibes.map(v => (
                <VibeChip key={v} vibe={v} size="sm" variant="gradient" />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>
                {t('common.startingFrom')}
              </div>
              <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', fontWeight: 500, color: 'var(--text-1)', lineHeight: 1 }}>
                {retreat.priceFrom.currency}{retreat.priceFrom.amount}
              </div>
            </div>

            <button style={{ 
              padding: '10px 24px', 
              borderRadius: 100, 
              border: 'none',
              backgroundColor: '#F5F4F2', 
              color: 'var(--text-1)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-sans)'
            }}>
              {t('common.viewRetreat')}
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
};
