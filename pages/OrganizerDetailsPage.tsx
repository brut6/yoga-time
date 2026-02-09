
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { MOCK_RETREATS } from '../data';
import { ImageWithFallback, RetreatCard } from '../components';

export const OrganizerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useSafeTranslation();

  // Find organizer by looking through retreats
  const organizer = MOCK_RETREATS.find(r => r.organizer.id === id)?.organizer;
  
  // Find all retreats by this organizer
  const organizerRetreats = MOCK_RETREATS.filter(r => r.organizer.id === id);

  if (!organizer) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2 className="yt-h2">{t('organizer.notFound', 'Organizer not found')}</h2>
        <button onClick={() => navigate('/retreats')} style={{ marginTop: 20, textDecoration: 'underline' }}>
          {t('common.backToRetreats', 'Back to Retreats')}
        </button>
      </div>
    );
  }

  // Localized description logic
  const currentLang = i18n.language;
  const description = organizer.descriptionI18n?.[currentLang] || organizer.description || t('organizer.noDescription', 'Curating exceptional wellness experiences.');

  const isRtl = currentLang === 'he';

  return (
    <div className="yt-app" style={{ backgroundColor: '#FDFBF9', paddingBottom: 100 }} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Minimal Header */}
      <div style={{ 
        height: 140, // Sufficient height for back button and visual breathing room
        width: '100%', 
        backgroundColor: '#F3F0EB', // Soft stone neutral
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        paddingTop: 'calc(16px + env(safe-area-inset-top))', // Safe area respect
        borderBottom: '1px solid rgba(0,0,0,0.03)'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            position: 'absolute', 
            top: 'calc(16px + env(safe-area-inset-top))', 
            [isRtl ? 'right' : 'left']: 24, 
            width: 40, height: 40, 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.6)', 
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.05)', 
            color: 'var(--text-1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            cursor: 'pointer',
            transform: isRtl ? 'rotate(180deg)' : 'none',
            fontSize: '1.2rem',
            lineHeight: 1
          }}
        >
          ←
        </button>
      </div>

      {/* 2. Avatar & Info (Overlapping) */}
      <div style={{ 
        marginTop: -50, // Negative margin to pull avatar up
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '0 24px', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          width: 100, height: 100, 
          borderRadius: '24px', // Soft square for logos
          backgroundColor: '#FFFFFF', 
          padding: 4, // White frame
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#F9F8F6' }}>
            <ImageWithFallback 
              src={organizer.photo} 
              alt={organizer.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Contain ensures logos are not cropped
            />
          </div>
        </div>
        
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '2rem', 
          marginBottom: 8, 
          color: 'var(--text-1)',
          lineHeight: 1.1
        }}>
          {organizer.name}
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6, 
          marginBottom: 24,
          fontSize: '0.9rem' 
        }}>
          <span style={{ color: 'var(--gold-sand)' }}>★</span>
          <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{organizer.rating.average}</span>
          <span style={{ color: 'var(--text-3)' }}>({organizer.rating.count})</span>
        </div>

        <p style={{ 
          maxWidth: 500, 
          fontSize: '1rem', 
          color: 'var(--text-2)', 
          lineHeight: 1.6, 
          fontWeight: 300,
          marginBottom: 40
        }}>
          {description}
        </p>
      </div>

      {/* 3. Retreats List */}
      <div style={{ padding: '0 24px', maxWidth: 640, margin: '0 auto' }}>
        <h3 className="yt-h2" style={{ marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12, textAlign: isRtl ? 'right' : 'left' }}>
          {t('organizer.retreats', 'Upcoming Retreats')} ({organizerRetreats.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {organizerRetreats.length > 0 ? (
            organizerRetreats.map(retreat => (
              <RetreatCard key={retreat.id} retreat={retreat} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)', fontStyle: 'italic' }}>
              {t('organizer.noRetreats', 'No active retreats at the moment.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
