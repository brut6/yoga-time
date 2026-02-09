
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { InstructorCard, RetreatCard, VibeCheckInModal, AIConcierge } from '../components';
import { dbService, vibeService, userProfileService } from '../services';
import { Retreat, Instructor, UserDNA } from '../types';

// --- STYLES & ANIMATIONS ---
const styles = `
@keyframes slowPulse {
  0% { transform: scale(0.92); opacity: 0.8; box-shadow: 0 0 0 rgba(201, 178, 160, 0); }
  50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 30px rgba(201, 178, 160, 0.25); }
  100% { transform: scale(0.92); opacity: 0.8; box-shadow: 0 0 0 rgba(201, 178, 160, 0); }
}

.hero-gradient {
  background: linear-gradient(135deg, #FDFBF9 0%, #F2F0EB 100%);
}
`;

// --- HELPER COMPONENTS ---

const SectionHeader = ({ title, action, onAction }: { title: string, action?: string, onAction?: () => void }) => (
  <div style={{ 
    padding: '0 24px', 
    marginBottom: 20, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'baseline' 
  }}>
    <h3 className="yt-h2" style={{ fontSize: '1.4rem', margin: 0, color: 'var(--text-1)' }}>{title}</h3>
    {action && (
      <button 
        onClick={onAction} 
        style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 500, letterSpacing: '0.02em' }}
      >
        {action}
      </button>
    )}
  </div>
);

const VerticalFeed = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 24, 
    padding: '0 24px 32px'
  }}>
    {children}
  </div>
);

export const HomePage = () => {
  const { t, tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  
  // -- State --
  const [greeting, setGreeting] = useState('common.greetings.morning');
  const [userDNA, setUserDNA] = useState<UserDNA | null>(null);
  const [featuredRetreats, setFeaturedRetreats] = useState<Retreat[]>([]);
  const [featuredInstructors, setFeaturedInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [localLocation, setLocalLocation] = useState<string | null>(null);

  useEffect(() => {
    // 1. Time-based Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('common.greetings.morning');
    else if (hour < 18) setGreeting('common.greetings.afternoon');
    else setGreeting('common.greetings.evening');

    setUserDNA(vibeService.getDNA());

    // 2. Load Data & Profile Location
    const loadData = async () => {
      try {
        const [retreats, guides, profile] = await Promise.all([
          dbService.getRetreats(),
          dbService.getGuides(),
          userProfileService.loadProfile()
        ]);

        let filteredRetreats = retreats;
        let filteredGuides = guides;
        const userLoc = profile.location?.trim().toLowerCase();

        // 3. Filter by Location if set
        if (userLoc) {
          setLocalLocation(profile.location);
          
          const matchesLoc = (item: any) => {
            const itemCity = item.location?.city?.toLowerCase() || '';
            const itemCountry = item.location?.country?.toLowerCase() || '';
            
            const userParts = userLoc.split(',').map((s:string) => s.trim());
            
            return userParts.some((part:string) => 
               part === itemCity || 
               part === itemCountry ||
               (part.length > 3 && (itemCity.includes(part) || itemCountry.includes(part)))
            );
          };

          const locRetreats = retreats.filter(matchesLoc);
          const locGuides = guides.filter(matchesLoc);

          if (locRetreats.length > 0) filteredRetreats = locRetreats;
          if (locGuides.length > 0) filteredGuides = locGuides;
        }

        setFeaturedRetreats(filteredRetreats.slice(0, 3));
        setFeaturedInstructors(filteredGuides.slice(0, 3));
      } catch (e) {
        console.error("Home load error", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="yt-page" style={{ padding: 0, paddingBottom: 100 }}>
      <style>{styles}</style>

      {/* 1. HEADER & GREETING */}
      <header style={{ padding: '32px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <h1 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '2.4rem', 
            color: 'var(--text-1)', 
            margin: 0,
            lineHeight: 1.1 
          }}>
            {t(greeting)}.
          </h1>
          
          <div style={{ display: 'flex', gap: 8 }}>
            {/* AI Concierge Button */}
            <button 
              onClick={() => setIsAIOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2F2F2F 0%, #1F1F1F 100%)',
                color: '#FFFFFF',
                fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              ✦
            </button>

            {/* Vibe Check Button */}
            <button 
              onClick={() => setIsCheckInOpen(true)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '1px solid var(--border)',
                backgroundColor: '#FFFFFF',
                color: 'var(--text-2)',
                fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✨
            </button>
          </div>
        </div>
        
        <p style={{ 
          fontSize: '1.05rem', 
          color: 'var(--text-2)', 
          margin: 0, 
          fontWeight: 300,
          opacity: 0.9 
        }}>
          {userDNA 
            ? tsafe('home.subtitleDNA', `Balance for your ${userDNA.persona} flow.`) 
            : t('home.subtitle', 'Find balance: retreats, guides, breath.')}
        </p>
      </header>

      {/* 2. HERO: PREMIUM BREATHING CARD */}
      <section style={{ padding: '0 24px', marginBottom: 48 }}>
        <div 
          onClick={() => navigate('/breathing')}
          className="luxury-card hero-gradient"
          style={{ 
            position: 'relative',
            padding: '28px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 12px 32px rgba(199, 178, 160, 0.15)',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          {/* Content */}
          <div style={{ zIndex: 2, flex: 1 }}>
            <div style={{ 
              fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', 
              color: 'var(--text-3)', marginBottom: 8, fontWeight: 600 
            }}>
              {t('home.dailyRitual', 'Today')}
            </div>
            <h2 className="yt-h2" style={{ fontSize: '1.6rem', marginBottom: 8, color: 'var(--text-1)' }}>
              {t('nav.breath', 'Breath')}
            </h2>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <span style={{ 
                fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.5)', 
                padding: '4px 10px', borderRadius: 12, color: 'var(--text-2)' 
              }}>2 min</span>
              <span style={{ 
                fontSize: '0.8rem', backgroundColor: 'rgba(255,255,255,0.5)', 
                padding: '4px 10px', borderRadius: 12, color: 'var(--text-2)' 
              }}>Calm</span>
            </div>
            <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', height: 42 }}>
              {t('breathing.start', 'Start')}
            </button>
          </div>

          {/* Visual: Breathing Circle */}
          <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0, marginInlineStart: 16 }}>
            {/* Outer Static Ring */}
            <div style={{ 
              position: 'absolute', inset: 0, borderRadius: '50%', 
              border: '1px solid rgba(201, 178, 160, 0.3)' 
            }} />
            {/* Inner Pulsing Core */}
            <div style={{ 
              position: 'absolute', inset: 8, borderRadius: '50%', 
              background: 'radial-gradient(circle, #E3DACE 0%, #F5F0EB 100%)',
              animation: 'slowPulse 5s ease-in-out infinite' 
            }} />
          </div>
        </div>
      </section>

      {/* 3. FEED 1: GUIDES */}
      <section style={{ marginBottom: 32, animation: 'fadeInSoft 0.6s ease' }}>
        <SectionHeader 
          title={localLocation && featuredInstructors.length > 0 ? `${t('instructors.title', 'Guides')} (${localLocation})` : t('instructors.title', 'Guides')} 
          action={t('common.viewAll', 'All')}
          onAction={() => navigate('/instructors')} 
        />
        <VerticalFeed>
          {loading ? (
            <div style={{ color: 'var(--text-3)' }}>Loading...</div>
          ) : (
            featuredInstructors.map(instructor => (
              <div key={instructor.id}>
                <InstructorCard instructor={instructor} showMatchBadge={false} />
              </div>
            ))
          )}
        </VerticalFeed>
      </section>

      {/* 4. FEED 2: RETREATS */}
      <section style={{ animation: 'fadeInSoft 0.8s ease' }}>
        <SectionHeader 
          title={localLocation && featuredRetreats.length > 0 ? `${t('retreats.title', 'Retreats')} (${localLocation})` : t('retreats.title', 'Retreats')} 
          action={t('common.viewAll', 'All')}
          onAction={() => navigate('/retreats')} 
        />
        <VerticalFeed>
          {loading ? (
            <div style={{ color: 'var(--text-3)' }}>Loading...</div>
          ) : (
            featuredRetreats.map(retreat => (
              <div key={retreat.id}>
                <RetreatCard retreat={retreat} />
              </div>
            ))
          )}
        </VerticalFeed>
      </section>

      <VibeCheckInModal 
        isOpen={isCheckInOpen} 
        onClose={() => setIsCheckInOpen(false)}
        onComplete={(dna) => setUserDNA(dna)}
      />

      <AIConcierge 
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  );
};
