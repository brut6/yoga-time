
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { Instructor, Vibe } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { userProfileService } from '../services';
import { VibeChip } from './VibeChip';

interface Props {
  instructor: Instructor;
  showMatchBadge?: boolean;
  matchReasons?: string[];
}

const VerifiedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginInlineStart: 6, verticalAlign: 'middle', opacity: 0.8 }}>
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold-sand)" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export const InstructorCard: React.FC<Props> = ({ instructor, showMatchBadge = true, matchReasons }) => {
  const { t } = useSafeTranslation();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(userProfileService.isFavorite('instructor', instructor.id));
    const handleUpdate = (e: any) => {
      const { type, id, isFavorite } = e.detail;
      if (type === 'instructor' && id === instructor.id) {
        setIsSaved(isFavorite);
      }
    };
    window.addEventListener('yt_fav_updated', handleUpdate);
    return () => window.removeEventListener('yt_fav_updated', handleUpdate);
  }, [instructor.id]);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    userProfileService.toggleFavorite('instructor', instructor.id);
  };

  const exp = instructor.experienceYears || 5;
  const isVibes = instructor.vibes && instructor.vibes.length > 0;
  const items = isVibes ? instructor.vibes : instructor.tags;
  const visibleItems = items.slice(0, 2);
  const remaining = items.length - 2;

  const fitBadges = [];
  if (instructor.approach) fitBadges.push(t(`instructors.fit.approach.${instructor.approach}`));
  if (instructor.communicationTone) fitBadges.push(t(`instructors.fit.tone.${instructor.communicationTone}`));
  if (instructor.trialAvailable) fitBadges.push(t('instructors.fit.trialAvailable'));

  const matchScore = (instructor as any)._matchScore;

  const matchContext = useMemo(() => {
    if (!matchScore) return null;
    const parts = [];
    if (instructor.vibes?.[0]) {
      const v = t(`vibe.${instructor.vibes[0]}`);
      parts.push(v.split(' ')[0]); 
    }
    if (instructor.approach) {
      const app = t(`instructors.fit.approach.${instructor.approach}`);
      parts.push(app.split(' ')[0]);
    } else if (instructor.communicationTone) {
      parts.push(t(`instructors.fit.tone.${instructor.communicationTone}`));
    }
    return parts.join(' · ');
  }, [instructor, matchScore, t]);

  return (
    <Link 
      to={`/instructors/${instructor.id}`} 
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div 
        className="luxury-card"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div style={{ 
            width: 100, height: 100, 
            borderRadius: 20, 
            overflow: 'hidden', 
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            backgroundColor: '#EBE5DF'
          }}>
            <ImageWithFallback 
              src={instructor.photo} 
              alt={instructor.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            
            {matchScore && showMatchBadge && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                padding: '6px 12px', borderRadius: 12,
                backgroundColor: '#FDFBF7',
                border: '1px solid var(--gold-sand)',
                marginBottom: 10,
                width: 'fit-content'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--gold-sand)', fontSize: '0.75rem' }}>✦</span>
                  <span style={{ color: 'var(--text-1)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {t('smartMatch.matchPercentLabel')} {matchScore}%
                  </span>
                </div>
                
                {matchReasons && matchReasons.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                    {matchReasons.map((r, i) => (
                      <span key={i} style={{ 
                        fontSize: '0.65rem', 
                        color: 'var(--text-2)', 
                        backgroundColor: 'rgba(201, 178, 160, 0.12)', 
                        padding: '2px 6px', borderRadius: 4,
                        whiteSpace: 'nowrap'
                      }}>
                        {r}
                      </span>
                    ))}
                  </div>
                ) : matchContext && (
                  <span style={{ 
                    fontSize: '0.65rem', 
                    color: 'var(--text-2)', 
                    fontWeight: 500, 
                    opacity: 0.8,
                    marginLeft: 16,
                    marginTop: 2
                  }}>
                    {matchContext}
                  </span>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.4rem', 
                fontFamily: 'var(--font-serif)', 
                fontWeight: 500, 
                color: 'var(--text-1)',
                lineHeight: 1.2
              }}>
                {instructor.name}
                {instructor.verified && <span style={{ color: '#88A0A8' }}><VerifiedIcon /></span>}
              </h3>
              
              <button 
                onClick={handleToggleSave} 
                style={{ 
                  padding: 8,
                  marginTop: -8,
                  marginRight: -8,
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: isSaved ? 'var(--gold-sand)' : 'var(--text-3)',
                  lineHeight: 1,
                  background: 'transparent'
                }}
              >
                {isSaved ? '♥' : '♡'}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {instructor.location.city}, {instructor.location.country}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {visibleItems.map(item => (
                <VibeChip 
                  key={item as string} 
                  vibe={isVibes ? (item as Vibe) : undefined}
                  label={!isVibes ? (item as string) : undefined}
                  size="sm" 
                  variant="gradient"
                />
              ))}
              {remaining > 0 && (
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'var(--text-3)', 
                  fontWeight: 500,
                  alignSelf: 'center',
                  paddingLeft: 2
                }}>
                  +{remaining}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem', color: 'var(--text-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, color: 'var(--text-1)' }}>
                <StarIcon /> {instructor.rating.average}
              </span>
              <span style={{ width: 1, height: 12, backgroundColor: 'var(--border-strong)' }} />
              <span>{exp} {t('common.years')}</span>
            </div>

          </div>
        </div>

        {fitBadges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, marginTop: -4 }}>
            {fitBadges.slice(0, 3).map((badge, i) => (
              <span key={i} style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-2)', 
                backgroundColor: '#F7F5F3', 
                padding: '4px 10px', 
                borderRadius: 4,
                fontWeight: 500
              }}>
                {badge}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', width: '100%', marginBottom: 16 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', flexDirection: 'column' }}>
             <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{t('common.sessionFrom')}</span>
             <div style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-1)', fontWeight: 500, lineHeight: 1 }}>
               {instructor.pricePerHour ? (
                 <>
                   {instructor.pricePerHour.currency}{instructor.pricePerHour.amount}
                 </>
               ) : (
                 <span style={{ fontSize: '0.9rem' }}>---</span>
               )}
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
              letterSpacing: '0.02em'
            }}
           >
             {t('common.viewProfile')}
           </button>
        </div>

      </div>
    </Link>
  );
};
