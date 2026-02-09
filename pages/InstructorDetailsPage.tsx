
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks'; // Updated import
import { dbService } from '../services';
import { ImageWithFallback, VibeChip } from '../components';
import { Instructor, InstructorPackage } from '../types';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  noBorder?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, noBorder }) => (
  <div className="yt-section" style={{ borderBottom: noBorder ? 'none' : '1px solid var(--border)', paddingBottom: noBorder ? 0 : 32, marginBottom: 32 }}>
    {title && (
      <h3 style={{ 
        fontFamily: 'var(--font-sans)', 
        fontSize: '0.85rem', 
        fontWeight: 600, 
        textTransform: 'uppercase', 
        letterSpacing: '0.1em', 
        color: 'var(--text-3)', 
        marginBottom: 20 
      }}>
        {title}
      </h3>
    )}
    {children}
  </div>
);

const VerifiedBadge = () => (
  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginInlineStart: 8, verticalAlign: 'middle', color: '#88A0A8' }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  </span>
);

export const InstructorDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useSafeTranslation();
  
  const [instructor, setInstructor] = useState<Instructor | null | undefined>(undefined);

  // Booking State
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await dbService.getGuideById(id);
        setInstructor(data || null);
      } catch (e) {
        console.error(e);
        setInstructor(null);
      }
    };
    fetch();
  }, [id]);

  if (instructor === undefined) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <div style={{ color: 'var(--text-3)' }}>Loading...</div>
      </div>
    );
  }

  if (instructor === null) {
    return (
      <div className="yt-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2 className="yt-h2">{t('common.notFoundInstructor', 'Instructor not found')}</h2>
        <button onClick={() => navigate('/instructors')} style={{ marginTop: 20, textDecoration: 'underline' }}>
          {t('common.backToInstructors', 'Back to Instructors')}
        </button>
      </div>
    );
  }

  const selectedPkg = instructor.packages?.find(p => p.id === selectedPackageId);
  const experience = instructor.experienceYears || 5;
  const isRtl = i18n.language === 'he';

  return (
    <div className="yt-app" style={{ backgroundColor: '#FDFBF9', paddingBottom: 100 }} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. CINEMATIC HERO */}
      <div style={{ position: 'relative', width: '100%', marginBottom: 60 }}>
        {/* Cover Image */}
        <div style={{ height: 260, width: '100%', overflow: 'hidden', position: 'relative' }}>
          <ImageWithFallback 
            src={instructor.coverImage || instructor.photo} 
            alt="Cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' }} />
          
          {/* Back Nav */}
          <button 
            onClick={() => navigate(-1)} 
            style={{ 
              position: 'absolute', top: 20, insetInlineStart: 20, 
              width: 40, height: 40, borderRadius: '50%', 
              backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transform: isRtl ? 'rotate(180deg)' : 'none'
            }}
          >
            ←
          </button>
        </div>

        {/* Overlapping Avatar */}
        <div style={{ 
          position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)',
          width: 120, height: 120, borderRadius: '30px', 
          border: '4px solid #FDFBF9', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          backgroundColor: '#EBE5DF' // Neutral background for contain fit
        }}>
          <ImageWithFallback 
            src={instructor.photo} 
            alt={instructor.name} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
      </div>

      {/* 2. IDENTITY & QUICK FACTS */}
      <div style={{ textAlign: 'center', padding: '0 24px 32px', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 400, color: 'var(--text-1)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {instructor.name} {instructor.verified && <VerifiedBadge />}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-2)', maxWidth: 400, margin: '0 auto 24px', fontWeight: 300, lineHeight: 1.5 }}>
          {instructor.tagline || t('common.verified', 'Verified Instructor')}
        </p>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, maxWidth: 400, margin: '0 auto' }}>
          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>{t('common.rating', 'Rating')}</div>
            <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>★ {instructor.rating.average}</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>{t('common.experience', 'Experience')}</div>
            <div style={{ fontWeight: 600, color: 'var(--text-1)' }}>{experience} {t('common.years', 'yrs')}</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 4 }}>{t('common.location', 'Location')}</div>
            <div style={{ fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{instructor.location.city}</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div style={{ padding: '32px 24px', maxWidth: 640, margin: '0 auto' }}>
        
        {/* BIO */}
        <Section title={t('common.about', 'About')}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-1)', fontWeight: 300 }}>
            {instructor.bio}
          </p>
        </Section>

        {/* FIT & APPROACH (New Layer) */}
        {(instructor.approach || instructor.communicationTone || instructor.goals?.length) && (
          <Section title={t('instructors.fit.title', 'Fit & Approach')}>
            <div style={{ display: 'grid', gap: 16 }}>
              {instructor.approach && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>{t('instructors.modal.sections.guide', 'Approach')}</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-1)', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: 6, fontSize: '0.9rem' }}>
                    {t(`instructors.fit.approach.${instructor.approach}`, instructor.approach)}
                  </span>
                </div>
              )}
              {instructor.communicationTone && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-2)', fontSize: '0.95rem' }}>{t('instructors.fit.toneLabel', 'Tone')}</span>
                  <span style={{ fontWeight: 500, color: 'var(--text-1)', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: 6, fontSize: '0.9rem' }}>
                    {t(`instructors.fit.tone.${instructor.communicationTone}`, instructor.communicationTone)}
                  </span>
                </div>
              )}
              {instructor.goals && instructor.goals.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  <span style={{ color: 'var(--text-3)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('instructors.modal.sections.practiceVibe', 'Focus Areas')}
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {instructor.goals.map(goal => (
                      <span key={goal} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 20, fontSize: '0.9rem', color: 'var(--text-1)' }}>
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {instructor.trialAvailable && (
                <div style={{ marginTop: 12, padding: '12px', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: 8, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>✓</span> {t('instructors.fit.trialAvailable', 'Trial Available')} 
                  {instructor.trialPriceFrom && (
                    <span style={{ fontWeight: 600 }}>({instructor.trialPriceFrom.currency}{instructor.trialPriceFrom.amount})</span>
                  )}
                </div>
              )}
            </div>
          </Section>
        )}

        {/* STYLE & MOOD (Premium Gradient Pills) */}
        {instructor.vibes && instructor.vibes.length > 0 && (
          <Section title={t('common.vibes', 'Style & Mood')}>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {instructor.vibes.map(vibe => (
                  <VibeChip key={vibe} vibe={vibe} size="md" variant="gradient" />
                ))}
             </div>
          </Section>
        )}

        {/* EXPERTISE (Tags & Certs) */}
        <Section title={t('common.specializations', 'Expertise')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {instructor.tags.map(tag => (
              <span key={tag} style={{ 
                padding: '8px 16px', borderRadius: 100, 
                backgroundColor: '#F3F4F6', color: 'var(--text-2)', border: '1px solid rgba(0,0,0,0.05)',
                fontSize: '0.85rem', fontWeight: 500
              }}>
                {tag}
              </span>
            ))}
          </div>
          
          {(instructor.certifications || instructor.certificationsDetails) && (
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {instructor.certificationsDetails ? (
                instructor.certificationsDetails.map((cert, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--gold-sand)', fontSize: '1.2rem' }}>•</span>
                    <span>
                      <strong style={{ fontWeight: 500, color: 'var(--text-1)' }}>{cert.title}</strong>
                      {cert.issuer && <span style={{ opacity: 0.7 }}> — {cert.issuer}</span>}
                    </span>
                  </li>
                ))
              ) : (
                instructor.certifications?.map((cert, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', fontSize: '0.95rem', color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--gold-sand)', fontSize: '1.2rem' }}>•</span>
                    {cert}
                  </li>
                ))
              )}
            </ul>
          )}
        </Section>

        {/* PACKAGES (Services) */}
        <Section title={t('booking.selectPackage', 'Select Package')}>
          <div style={{ display: 'grid', gap: 16 }}>
            {instructor.packages?.map(pkg => {
              const isSelected = selectedPackageId === pkg.id;
              return (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className="luxury-card"
                  style={{ 
                    padding: 24, 
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--gold-sand)' : '1px solid transparent',
                    backgroundColor: isSelected ? '#FFFCF9' : '#FFF',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    boxShadow: isSelected ? '0 8px 30px rgba(201, 178, 160, 0.15)' : 'var(--shadow-1)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 4, color: 'var(--text-1)' }}>{pkg.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>
                      {pkg.sessionCount} {t('booking.sessions', 'Sessions')} • {pkg.features?.[0]}
                    </div>
                  </div>
                  <div style={{ textAlign: 'end' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-1)' }}>
                      {pkg.price.currency}{pkg.price.amount}
                    </div>
                    {pkg.discountPercentage && (
                      <div style={{ fontSize: '0.75rem', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>
                        -{pkg.discountPercentage}%
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* CHOOSING YOUR MENTOR CHECKLIST */}
        <Section title={t('instructors.checklist.title', 'How to choose')}>
          <div className="luxury-card" style={{ padding: '28px 24px', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201, 178, 160, 0.1) 0%, rgba(255,255,255,0) 70%)' }} />
            
            <ul style={{ padding: 0, margin: '0 0 24px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['goal', 'style', 'qualifications', 'reviews', 'trial', 'comfort'].map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 20, height: 20, borderRadius: '50%', 
                    border: '1px solid var(--border-strong)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold-sand)', fontSize: '0.7rem', flexShrink: 0
                  }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.4 }}>
                    {t(`instructors.checklist.items.${item}`, item)}
                  </span>
                </li>
              ))}
            </ul>

            <button 
              className="btn-secondary" 
              style={{ width: '100%', fontSize: '0.9rem', borderColor: 'var(--border)' }}
              onClick={() => alert('Trial Booking')}
            >
              {t('instructors.checklist.cta', 'Book Trial')}
            </button>
          </div>
        </Section>

        {/* REVIEWS */}
        {instructor.testimonials && instructor.testimonials.length > 0 && (
          <Section title={t('common.reviews', 'Reviews')} noBorder>
            <div style={{ 
              display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16, 
              marginRight: -24, paddingRight: 24, marginLeft: -4, paddingLeft: 4 
            }} className="hide-scrollbar">
              {instructor.testimonials.map(t => (
                <div key={t.id} style={{ 
                  minWidth: 280, padding: 24, backgroundColor: '#FFF', 
                  borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' 
                }}>
                  <div style={{ color: 'var(--gold-sand)', marginBottom: 12 }}>★★★★★</div>
                  <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.5 }}>
                    "{t.text}"
                  </p>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-1)' }}>{t.name}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>

      {/* 4. STICKY BOOKING BAR */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: 'rgba(253, 251, 249, 0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        padding: '16px 24px 32px',
        display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.03)',
        maxWidth: 600, margin: '0 auto'
      }}>
        <button className="btn-secondary" style={{ flex: 1, backgroundColor: '#FFF' }}>
          {t('common.sendMessage', 'Message')}
        </button>
        <button 
          className="btn-primary btn-gold" 
          style={{ flex: 2 }}
          onClick={() => alert('Booking flow')}
          disabled={!selectedPackageId && !instructor.packages}
        >
          {selectedPkg 
            ? `${t('booking.book', 'Book')} (${selectedPkg.price.currency}${selectedPkg.price.amount})` 
            : t('booking.bookSession', 'Book Session')
          }
        </button>
      </div>

    </div>
  );
};
