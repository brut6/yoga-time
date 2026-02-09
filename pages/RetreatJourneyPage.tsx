
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { MOCK_RETREATS } from '../data';

export const RetreatJourneyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tsafe, t } = useSafeTranslation();
  const retreat = MOCK_RETREATS.find(r => r.id === id);
  const [activePhase, setActivePhase] = useState<'before' | 'during' | 'after'>('before');

  if (!retreat || !retreat.journey) {
    return (
      <div className="yt-page" style={{ textAlign: 'center' }}>
        <h2>{tsafe('journey.notAvailable', 'Journey not available')}</h2>
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{marginTop: 20}}>{tsafe('common.back', 'Back')}</button>
      </div>
    );
  }

  const phases = [
    { id: 'before', label: tsafe('journey.before', 'Before') },
    { id: 'during', label: tsafe('journey.during', 'During') },
    { id: 'after', label: tsafe('journey.after', 'After') }
  ];

  const currentPhaseData = retreat.journey[activePhase];
  const localizedRetreatTitle = t(`data.retreats.${retreat.id}.title`, { defaultValue: retreat.title });

  return (
    <div className="yt-app" style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', paddingBottom: 80 }}>
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
          {tsafe('journey.title', 'Your Journey')}
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-2)' }}>{localizedRetreatTitle}</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        {phases.map(phase => (
          <button
            key={phase.id}
            onClick={() => setActivePhase(phase.id as any)}
            style={{
              flex: 1,
              padding: '16px 0',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: activePhase === phase.id ? 600 : 400,
              color: activePhase === phase.id ? 'var(--text-1)' : 'var(--text-3)',
              borderBottom: activePhase === phase.id ? '2px solid var(--gold-sand)' : '2px solid transparent',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {phase.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px', animation: 'fadeInSoft 0.5s ease', maxWidth: 600, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 40, textAlign: 'center', paddingTop: 16 }}>
          <div style={{ 
            display: 'inline-block', padding: '8px 16px', borderRadius: 20, 
            backgroundColor: 'rgba(198, 162, 126, 0.1)', color: 'var(--gold-sand)', 
            marginBottom: 16, fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' 
          }}>
            {currentPhaseData.title}
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 16, lineHeight: 1.2 }}>
            {currentPhaseData.description}
          </h2>
        </div>

        <div className="yt-card" style={{ padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-1)' }}>{tsafe('journey.keyTips', 'Key Tips')}</h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: 16 }}>
            {currentPhaseData.tips.map((tip, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--text-3)', marginTop: 9 }} />
                <span style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.5 }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {activePhase === 'during' && (
          <button 
            onClick={() => navigate(`/retreats/${retreat.id}/schedule`)}
            className="btn-primary"
            style={{ width: '100%' }}
          >
            {tsafe('schedule.viewFull', 'View Full Schedule')}
          </button>
        )}

        {activePhase === 'after' && retreat.aftercare && (
          <div style={{ animation: 'fadeInSoft 0.5s ease' }}>
            <h3 className="yt-h2" style={{ marginBottom: 24 }}>{tsafe('journey.aftercare.title', 'Integration')}</h3>
            
            <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
              {retreat.aftercare.followUpPractices.map((practice, i) => (
                <div key={i} className="luxury-card" style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/breathing')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      {practice.type === 'audio' ? '🎧' : '📹'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, color: 'var(--text-1)' }}>{practice.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{practice.duration}</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold-sand)', transform: document.documentElement.dir === 'rtl' ? 'rotate(180deg)' : 'none' }}>▶</div>
                </div>
              ))}
            </div>

            <h3 className="yt-h2" style={{ marginBottom: 16 }}>{tsafe('journey.aftercare.support', 'Support')}</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              {retreat.aftercare.supportOptions.map((opt, i) => (
                <div key={i} className="luxury-card" style={{ padding: 24, border: '1px solid var(--gold-sand)', backgroundColor: '#FFFCF9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>{opt.title}</span>
                    <span style={{ fontWeight: 600, color: 'var(--gold-sand)' }}>{opt.price.currency}{opt.price.amount}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: 16 }}>{opt.description}</p>
                  <button className="btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>{tsafe('common.bookNow', 'Book Now')}</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
