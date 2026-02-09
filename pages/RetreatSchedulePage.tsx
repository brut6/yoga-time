
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { MOCK_RETREATS } from '../data';

export const RetreatSchedulePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tsafe, i18n, t } = useSafeTranslation();
  const retreat = MOCK_RETREATS.find(r => r.id === id);
  const [activeDay, setActiveDay] = useState(1);

  if (!retreat || !retreat.program) {
    return (
      <div className="yt-page" style={{ textAlign: 'center' }}>
        <h2>{tsafe('schedule.comingSoon', 'Program coming soon...')}</h2>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{marginTop: 20}}>{tsafe('common.back', 'Back')}</button>
      </div>
    );
  }

  const currentDay = retreat.program.find(d => d.day === activeDay);
  
  // Dynamic Content Localization (Mock Lookup)
  const retreatTitleKey = `data.retreats.${id}.title`;
  const localizedRetreatTitle = t(retreatTitleKey, { defaultValue: retreat.title });

  // Day Content Localization
  const dayTitleKey = `data.retreats.${id}.program.day${activeDay}.title`;
  const dayDescKey = `data.retreats.${id}.program.day${activeDay}.description`;
  
  const localizedDayTitle = currentDay ? t(dayTitleKey, { defaultValue: currentDay.title }) : '';
  const localizedDayDesc = currentDay ? t(dayDescKey, { defaultValue: currentDay.description }) : '';

  // Check if content is English while UI is different (heuristic for showing note)
  const isEnglishContent = currentDay && localizedDayTitle === currentDay.title && i18n.language !== 'en' && !i18n.exists(dayTitleKey);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'practice': return '🧘';
      case 'meal': return '🥗';
      case 'workshop': return '🧠';
      case 'leisure': return '☀️';
      default: return '•';
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'practice': return 'linear-gradient(135deg, #FDFBF7 0%, #F5F0EB 100%)';
      case 'meal': return '#FFFFFF';
      case 'workshop': return '#F8FAFC';
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="yt-app" style={{ backgroundColor: 'var(--bg-elevated)', minHeight: '100vh', paddingBottom: 80 }}>
      <div style={{ padding: '24px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            marginBottom: 16, 
            fontSize: '0.9rem', 
            color: 'var(--text-2)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            padding: '8px 0'
          }}
        >
          ← {tsafe('common.back', 'Back')}
        </button>
        <h1 className="yt-h1" style={{ fontSize: '1.8rem', marginBottom: 4 }}>
          {tsafe('schedule.title', 'Schedule')}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>{localizedRetreatTitle}</p>
      </div>

      <div style={{ padding: '24px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>
            {tsafe('schedule.journeyArc', 'Journey Arc')}
          </span>
        </div>
        <div style={{ display: 'flex', height: 4, width: '100%', backgroundColor: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          {retreat.program.map((day, i) => (
            <div key={day.day} style={{ 
              flex: 1, 
              backgroundColor: i < activeDay ? 'var(--gold-sand)' : 'transparent',
              opacity: i + 1 === activeDay ? 1 : 0.4
            }} />
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: '0.9rem', fontWeight: 500, color: 'var(--gold-sand)' }}>
          {tsafe('schedule.phase', 'Phase')}: {localizedDayTitle || `Day ${activeDay}`}
        </div>
      </div>

      <div style={{ 
        position: 'sticky', top: 0, zIndex: 30, 
        backgroundColor: 'rgba(252, 249, 246, 0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 0 0 0'
      }}>
        <div style={{ 
          display: 'flex', gap: 12, overflowX: 'auto', padding: '0 24px 16px', 
          scrollSnapType: 'x mandatory'
        }} className="hide-scrollbar">
          {retreat.program.map((day) => {
            const isActive = day.day === activeDay;
            return (
              <button 
                key={day.day}
                onClick={() => setActiveDay(day.day)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 100,
                  backgroundColor: isActive ? 'var(--text-1)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-1)',
                  border: isActive ? '1px solid var(--text-1)' : '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  flexShrink: 0,
                  boxShadow: isActive ? '0 4px 12px rgba(44,38,35,0.15)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  scrollSnapAlign: 'start'
                }}
              >
                {tsafe('retreatDetails.day', 'Day')} {day.day}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '24px', animation: 'fadeInSoft 0.4s ease' }}>
        {currentDay && (
          <>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)', marginBottom: 8, color: 'var(--text-1)' }}>
                {localizedDayTitle}
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
                {localizedDayDesc}
              </p>
              
              {isEnglishContent && (
                <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-3)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>ℹ️</span> {tsafe('common.contentLanguageNote', 'Content available in English')}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', insetInlineStart: 23, top: 20, bottom: 20, width: 1, backgroundColor: 'var(--border)' }} />

              {currentDay.items ? currentDay.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 2 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: '50%', backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', flexShrink: 0
                  }}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      backgroundColor: getCardColor(item.type),
                      padding: '16px 20px', borderRadius: 20,
                      boxShadow: 'var(--shadow-1)', border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>
                        {item.time}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 500, color: 'var(--text-1)', marginBottom: item.description ? 4 : 0 }}>
                        {item.title}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.5 }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40, fontStyle: 'italic' }}>
                  {tsafe('schedule.comingSoon', 'Program coming soon...')}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
