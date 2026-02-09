
import React, { useState, useEffect } from 'react';
import { useSafeTranslation } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { MediaPicker } from '../components';
import { userProfileService, UserProfile, authService } from '../services';
import { User } from 'firebase/auth';

const LANGUAGES = [
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'he', label: 'עברית', dir: 'rtl' },
];

const COUNTRIES = [
  "Indonesia", "Costa Rica", "Japan", "India", "USA", "France", "UK", "Italy", "Greece", "Switzerland", "Singapore", "Thailand", "Mexico", "Portugal", "Spain", "Germany", "Israel", "Australia", "Canada", "Brazil", "Argentina", "Peru", "Morocco", "South Africa"
].sort();

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h3 style={{ 
    fontFamily: 'var(--font-sans)',
    marginTop: 0, 
    marginBottom: 16, 
    fontSize: '0.85rem', 
    fontWeight: 500, 
    textTransform: 'uppercase', 
    letterSpacing: '0.05em', 
    color: 'var(--text-3)' 
  }}>
    {children}
  </h3>
);

export const ProfilePage = () => {
  const { tsafe, i18n } = useSafeTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  
  useEffect(() => {
    userProfileService.loadProfile().then(p => {
      setProfile(p);
      if (p.language !== i18n.language) {
        changeAppLanguage(p.language);
      }
    });

    const savedDemo = localStorage.getItem('yt_demo_mode') === 'true';
    setDemoMode(savedDemo);

    setAuthUser(authService.getCurrentUser());
    const unsub = authService.onAuthChange(setAuthUser);

    const handleUpdate = () => {
      userProfileService.loadProfile().then(setProfile);
    };
    window.addEventListener('yt_profile_updated', handleUpdate);
    return () => {
      window.removeEventListener('yt_profile_updated', handleUpdate);
      unsub();
    };
  }, [i18n]);

  const changeAppLanguage = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    if (!lang) return;
    i18n.changeLanguage(code);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = code;
  };

  const handleLanguageChange = (code: string) => {
    if (!profile) return;
    changeAppLanguage(code);
    const updated = { ...profile, language: code };
    setProfile(updated);
    userProfileService.updateProfile({ language: code });
  };

  const handleRoleChange = (role: UserProfile['role']) => {
    if (!profile) return;
    const updated = { ...profile, role };
    setProfile(updated);
    userProfileService.updateProfile({ role });
    localStorage.setItem('yt_user_role', role); 
    window.dispatchEvent(new Event('roleChange'));
  };

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    if (!profile) return;
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    userProfileService.updateProfile({ [field]: value });
  };

  const handleBioChange = (lang: string, value: string) => {
    if (!profile) return;
    const newBio = { ...profile.bio, [lang]: value };
    setProfile({ ...profile, bio: newBio });
    userProfileService.updateProfile({ bio: newBio });
  };

  const handleAvatarChange = (url: string | null) => {
    if (!profile) return;
    setProfile({ ...profile, avatarUrl: url });
    userProfileService.updateProfile({ avatarUrl: url });
  };

  // Location Parsers
  const getLocationParts = (loc: string) => {
    if (!loc) return { city: '', country: '' };
    const parts = loc.split(',').map(s => s.trim());
    // Try to find a known country in parts
    const knownCountry = parts.find(p => COUNTRIES.some(c => c.toLowerCase() === p.toLowerCase()));
    
    if (knownCountry) {
      // Normalize casing
      const normalizedCountry = COUNTRIES.find(c => c.toLowerCase() === knownCountry.toLowerCase()) || knownCountry;
      const cityPart = parts.filter(p => p.toLowerCase() !== knownCountry.toLowerCase()).join(', ');
      return { city: cityPart, country: normalizedCountry };
    }
    
    // Fallback: If 1 part, check if it is a country. If not, assume city.
    if (parts.length === 1) {
       const p = parts[0];
       const match = COUNTRIES.find(c => c.toLowerCase() === p.toLowerCase());
       if (match) return { city: '', country: match };
       return { city: p, country: '' };
    }
    
    // Fallback: multiple parts, assume "City, Country"
    return { 
      country: parts[parts.length - 1], 
      city: parts.slice(0, -1).join(', ') 
    };
  };

  const updateLocation = (newCity: string, newCountry: string) => {
    const combined = [newCity, newCountry].filter(Boolean).join(', ');
    handleFieldChange('location', combined);
  };

  const toggleDemoMode = () => {
    const newState = !demoMode;
    setDemoMode(newState);
    localStorage.setItem('yt_demo_mode', String(newState));
  };

  if (!profile) return <div className="yt-page">Loading...</div>;

  const { city: parsedCity, country: parsedCountry } = getLocationParts(profile.location || '');

  const ROLES: { id: UserProfile['role']; label: string }[] = [
    { id: 'student', label: tsafe('profile.roles.student', 'Student') },
    { id: 'organizer', label: tsafe('profile.roles.organizer', 'Retreat Organizer') },
    { id: 'instructor', label: tsafe('profile.roles.instructor', 'Instructor / Mentor') },
  ];

  const LEVELS = ['beginner', 'intermediate', 'advanced'];

  const inputStyle = {
    width: '100%',
    padding: '12px 0',
    fontSize: '1rem',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-1)',
    outline: 'none',
    marginBottom: 16,
    fontFamily: 'inherit'
  };

  return (
    <div className="yt-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="yt-h1">
            {tsafe('profile.title', 'Profile')}
          </h1>
          <p className="yt-sub" style={{ marginBottom: 40 }}>
            {tsafe('profile.manage', 'Manage Account')}
          </p>
        </div>
        
        {!authUser ? (
          <button 
            onClick={() => navigate('/auth')}
            className="btn-primary"
            style={{ fontSize: '0.85rem', padding: '10px 20px', borderRadius: 20 }}
          >
            {tsafe('auth.ui.signIn', 'Sign In')}
          </button>
        ) : (
          <button 
            onClick={() => authService.signOutUser()}
            style={{ 
              fontSize: '0.85rem', color: '#DC2626', 
              textDecoration: 'underline', marginTop: 10 
            }}
          >
            {tsafe('auth.ui.signOut', 'Sign Out')}
          </button>
        )}
      </div>

      {authUser && (
        <div style={{ marginBottom: 32, padding: '12px 16px', backgroundColor: '#F0FDF4', borderRadius: 12, fontSize: '0.9rem', color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span> {authUser.email}
        </div>
      )}

      {/* Identity Section */}
      <div className="yt-section">
        <SectionTitle>{tsafe('profile.yourName', 'Identity')}</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
           <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--bg-elevated)', flexShrink: 0 }}>
             {profile.avatarUrl ? (
               <img src={profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '2rem' }}>☺</div>
             )}
           </div>
           <div style={{ flex: 1 }}>
              <MediaPicker 
                kind="image" 
                labelKey="" 
                value={null}
                onChange={handleAvatarChange}
                allowUrlFallback
                inputAriaLabel={tsafe('labels.uploadAvatar', 'Upload avatar')}
              />
           </div>
        </div>
        
        <input 
          type="text" 
          value={profile.name} 
          onChange={(e) => handleFieldChange('name', e.target.value)}
          placeholder={tsafe('labels.namePlaceholder', 'What should we call you?')}
          style={{
            ...inputStyle,
            fontSize: '1.25rem',
            fontFamily: 'var(--font-serif)',
            fontWeight: 500,
          }}
        />

        <button 
          onClick={() => navigate(`/students/${profile.id}`)}
          style={{ fontSize: '0.9rem', color: 'var(--text-2)', textDecoration: 'underline', cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
        >
          {tsafe('profile.viewPublic', 'View Public Profile')} →
        </button>
      </div>

      {/* Extended Profile Fields (Collapsible or Open) */}
      <div className="yt-section">
        <SectionTitle>{tsafe('common.studentProfile', 'Student Profile')}</SectionTitle>
        
        {/* Experience Level */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tsafe('common.practiceLevel', 'Practice Level')}
          </label>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => handleFieldChange('experienceLevel', lvl)}
                style={{
                  padding: '8px 16px', borderRadius: 20,
                  border: profile.experienceLevel === lvl ? '1px solid var(--text-1)' : '1px solid var(--border)',
                  backgroundColor: profile.experienceLevel === lvl ? 'var(--text-1)' : 'transparent',
                  color: profile.experienceLevel === lvl ? '#fff' : 'var(--text-2)',
                  fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                {tsafe(`profile.levels.${lvl}`, lvl)}
              </button>
            ))}
          </div>
        </div>

        {/* Location Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
          <div>
             <input 
               value={parsedCity}
               onChange={(e) => updateLocation(e.target.value, parsedCountry)}
               placeholder={tsafe('profile.locationPlaceholder', 'City')}
               style={{...inputStyle, marginBottom: 0}}
             />
             <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 4, textTransform: 'uppercase' }}>City</div>
          </div>
          <div>
             <select
               value={parsedCountry}
               onChange={(e) => updateLocation(parsedCity, e.target.value)}
               style={{...inputStyle, marginBottom: 0, appearance: 'none', cursor: 'pointer' }}
             >
               <option value="">Select Country...</option>
               {COUNTRIES.map(c => (
                 <option key={c} value={c}>{c}</option>
               ))}
             </select>
             <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', marginTop: 4, textTransform: 'uppercase' }}>Country</div>
          </div>
        </div>

        {/* Bio (Auto-detect active language for simple editing) */}
        <textarea 
          value={profile.bio?.[profile.language] || profile.bio?.['en'] || ''}
          onChange={(e) => handleBioChange(profile.language, e.target.value)}
          placeholder={tsafe('profile.bioPlaceholder', 'Share your journey...')}
          style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: -8, marginBottom: 16 }}>
          * {tsafe('common.bio', 'Bio')} ({profile.language.toUpperCase()})
        </div>

        {/* Interests (Comma separated for MVP) */}
        <input 
          value={profile.interests?.join(', ') || ''}
          onChange={(e) => handleFieldChange('interests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder={tsafe('profile.interestsPlaceholder', 'Yoga, Meditation...')}
          style={inputStyle}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: -8, marginBottom: 16 }}>
          * {tsafe('common.interests', 'Interests')} (comma separated)
        </div>

        {/* Languages */}
        <input 
          value={profile.languages?.join(', ') || ''}
          onChange={(e) => handleFieldChange('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder={tsafe('profile.languagesPlaceholder', 'English, Spanish...')}
          style={inputStyle}
        />
      </div>

      {/* Stats / Saved */}
      <div className="yt-section">
        <SectionTitle>{tsafe('profile.savedStats', 'Saved')}</SectionTitle>
        <div style={{ display: 'flex', gap: 16 }}>
          <button 
            onClick={() => navigate('/saved/retreats')}
            className="luxury-card"
            style={{ flex: 1, padding: 20, textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-1)', fontFamily: 'var(--font-serif)' }}>
              {profile.favorites.retreats.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tsafe('saved.tabs.retreats')}
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/saved/guides')}
            className="luxury-card"
            style={{ flex: 1, padding: 20, textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--text-1)', fontFamily: 'var(--font-serif)' }}>
              {profile.favorites.instructors.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tsafe('saved.tabs.teachers')}
            </div>
          </button>
        </div>
      </div>

      <div className="yt-section">
        <SectionTitle>{tsafe('profile.role', 'Your Role')}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ROLES.map((role) => {
            const isActive = profile.role === role.id;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 0',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 500 : 400,
                  width: '100%',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <span>{role.label}</span>
                {isActive && (
                  <span style={{ color: 'var(--text-1)', fontSize: '1.2rem' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="yt-section">
        <SectionTitle>{tsafe('profile.language', 'App Language')}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {LANGUAGES.map((lang) => {
            const isActive = profile.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 0',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 500 : 400,
                  width: '100%',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                <span>{lang.label}</span>
                {isActive && (
                  <span style={{ color: 'var(--text-1)', fontSize: '1.2rem' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '24px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
           <span style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>{tsafe('common.demoMode', 'Demo Mode')}</span>
           <button 
             onClick={toggleDemoMode}
             style={{
               padding: '4px 12px',
               borderRadius: 20,
               border: 'none',
               backgroundColor: demoMode ? 'var(--text-1)' : 'var(--bg-elevated)',
               color: demoMode ? '#fff' : 'var(--text-2)',
               fontWeight: 500,
               cursor: 'pointer',
               fontSize: '0.8rem'
             }}
           >
             {demoMode ? tsafe('common.on', 'ON') : tsafe('common.off', 'OFF')}
           </button>
        </div>
        
        <button 
          onClick={() => navigate('/investor')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-3)',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            cursor: 'pointer',
            padding: 0
          }}
        >
          {tsafe('common.investorDeck', 'Investor Deck')}
        </button>
      </div>
    </div>
  );
};
