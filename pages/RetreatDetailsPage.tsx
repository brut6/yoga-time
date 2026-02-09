
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { dbService } from '../services';
import { Retreat } from '../types';
import { ImageWithFallback, VibeChip } from '../components';

export const RetreatDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useSafeTranslation();
  
  const [retreat, setRetreat] = useState<Retreat | null | undefined>(undefined); // undefined means loading
  
  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await dbService.getRetreatById(id);
        setRetreat(data || null); // null means not found
      } catch (e) {
        console.error(e);
        setRetreat(null);
      }
    };
    fetch();
  }, [id]);

  if (retreat === undefined) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <div style={{ color: 'var(--text-3)' }}>Loading...</div>
      </div>
    );
  }

  if (retreat === null) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2>{t('common.notFoundRetreat', 'Retreat not found')}</h2>
        <button onClick={() => navigate('/retreats')} style={{ marginTop: 20, textDecoration: 'underline' }}>
          {t('common.backToRetreats', 'Back to Retreats')}
        </button>
      </div>
    );
  }

  const localizedTitle = t(`data.retreats.${retreat.id}.title`, { defaultValue: retreat.title });
  const isRtl = i18n.language === 'he';

  return (
    <div className="yt-app" style={{ backgroundColor: '#FDFBF9', paddingBottom: 100 }} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div style={{ position: 'relative', height: '60vh', minHeight: 400 }}>
        <ImageWithFallback 
          src={retreat.photo} 
          alt={localizedTitle} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
        
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            position: 'absolute', top: 20, insetInlineStart: 20, 
            width: 40, height: 40, borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            zIndex: 10,
            transform: isRtl ? 'rotate(180deg)' : 'none'
          }}
        >
          ←
        </button>

        <div style={{ position: 'absolute', bottom: 40, left: 24, right: 24, color: '#fff' }}>
           <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
             {retreat.vibes.map(v => (
               <VibeChip key={v} vibe={v} variant="glass" size="sm" />
             ))}
           </div>
           <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: 12 }}>
             {localizedTitle}
           </h1>
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 500 }}>
             <span>📍 {retreat.location.city}, {retreat.location.country}</span>
             <span>•</span>
             <span>📅 {retreat.dates.start}</span>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px 24px', maxWidth: 800, margin: '0 auto' }}>
        
        {/* Organizer */}
        <div 
          onClick={() => retreat.organizer && navigate(`/organizers/${retreat.organizer.id}`)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, 
            cursor: retreat.organizer ? 'pointer' : 'default', 
            padding: 16, borderRadius: 16, border: '1px solid var(--border)' 
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden' }}>
             <ImageWithFallback src={retreat.organizer.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-3)' }}>
                {t('common.aboutOrganizer', 'About Organizer')}
            </div>
            <div style={{ fontWeight: 600 }}>{retreat.organizer.name}</div>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: '1.15rem', lineHeight: 1.7, color: 'var(--text-1)', marginBottom: 40, fontWeight: 300 }}>
          {retreat.description}
        </p>

        {/* Actions - Simplified Layout */}
        <div style={{ marginBottom: 40 }}>
           <button 
             onClick={() => navigate(`/retreats/${retreat.id}/schedule`)}
             className="luxury-card"
             style={{ 
               padding: 20, 
               textAlign: 'start', 
               backgroundColor: '#fff', 
               cursor: 'pointer',
               width: '100%',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'space-between'
             }}
           >
             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
               <div style={{ fontSize: '1.5rem' }}>📅</div>
               <div>
                 <div style={{ fontWeight: 600, fontSize: '1rem' }}>{t('retreatDetails.dailyJourney', 'Daily Journey')}</div>
                 <div style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{t('common.viewAll')}</div>
               </div>
             </div>
             <div style={{ opacity: 0.3, transform: isRtl ? 'rotate(180deg)' : 'none' }}>→</div>
           </button>
        </div>

        {/* Included */}
        <h3 className="yt-h2" style={{ marginBottom: 16 }}>{t('retreatDetails.included', 'Included')}</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {['Accommodation', 'Daily Yoga', 'All Meals', 'Workshops', 'Airport Transfer'].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.95rem', color: 'var(--text-2)' }}>
              <span style={{ color: 'var(--gold-sand)' }}>✓</span> {item}
            </li>
          ))}
        </ul>

      </div>

      {/* Sticky Bottom Bar */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        padding: '16px 24px 32px', backgroundColor: 'rgba(255,255,255,0.95)', 
        borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
           <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-3)' }}>{t('common.startingFrom')}</div>
           <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', lineHeight: 1 }}>
             {retreat.priceFrom.currency}{retreat.priceFrom.amount}
           </div>
        </div>
        <button 
          className="btn-primary btn-gold"
          style={{ padding: '14px 32px' }}
          onClick={() => alert('Booking Flow')}
        >
          {t('common.bookNow')}
        </button>
      </div>

    </div>
  );
};
