
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { studentProfileService, StudentPublicProfile } from '../services';
import { ImageWithFallback, VibeChip } from '../components';

const InfoRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: '1rem', color: 'var(--text-1)' }}>
      {value}
    </div>
  </div>
);

export const StudentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tsafe, i18n } = useSafeTranslation();
  const [profile, setProfile] = useState<StudentPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const data = await studentProfileService.getStudentPublicProfile(id);
        if (data) {
          setProfile(data);
        } else {
          // If null returned, check connectivity
          if (!studentProfileService.isOnlineAvailableForProfiles()) {
            setIsOffline(true);
          }
        }
      } catch (e) {
        console.error("Profile load error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="yt-page" style={{ paddingTop: 100, textAlign: 'center', color: 'var(--text-3)' }}>Loading...</div>;
  }

  // Handle Offline / Unavailable State
  if (!profile) {
    return (
      <div className="yt-page" style={{ paddingTop: 100, textAlign: 'center', paddingBottom: 100 }}>
        {isOffline ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: 0.5 }}>📡</div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text-2)', fontWeight: 500 }}>
              {tsafe('common.offlineProfile', 'Profile unavailable offline')}
            </h2>
          </>
        ) : (
          <h2 style={{ fontSize: '1.2rem', color: 'var(--text-2)' }}>User not found</h2>
        )}
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginTop: 24 }}>
          {tsafe('common.back', 'Back')}
        </button>
      </div>
    );
  }

  // Choose Bio Language
  const currentLang = i18n.language;
  const bioText = profile.bio?.[currentLang] || profile.bio?.['en'] || Object.values(profile.bio || {})[0] || '';

  const joinDate = new Date(profile.joinedAt).toLocaleDateString(currentLang, { year: 'numeric', month: 'long' });

  const isRtl = i18n.language === 'he';

  return (
    <div className="yt-app" style={{ backgroundColor: '#FDFBF9', paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header with Back Button */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-2)', padding: 8 }}
        >
          ←
        </button>
        <span style={{ marginInlineStart: 16, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase' }}>
          {tsafe('common.studentProfile', 'Student Profile')}
        </span>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Avatar & Name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 120, height: 120, borderRadius: '50%', overflow: 'hidden', 
            marginBottom: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            backgroundColor: 'var(--bg-elevated)'
          }}>
            {profile.avatarUrl ? (
              <ImageWithFallback src={profile.avatarUrl} alt={profile.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--text-3)' }}>☺</div>
            )}
          </div>
          
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: 8, color: 'var(--text-1)', textAlign: 'center' }}>
            {profile.displayName || 'Anonymous Yogi'}
          </h1>
          
          {profile.location && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-2)', marginBottom: 8 }}>
              📍 {profile.location}
            </div>
          )}

          <div style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
            {tsafe('common.joined', 'Joined')}: {joinDate}
          </div>
        </div>

        {/* Info Grid */}
        <div className="luxury-card" style={{ padding: 24, backgroundColor: '#FFFFFF' }}>
          
          {profile.experienceLevel && (
            <div style={{ marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: 8 }}>
                {tsafe('common.practiceLevel', 'Practice Level')}
              </div>
              <span style={{ 
                padding: '6px 12px', backgroundColor: 'var(--bg-elevated)', borderRadius: 100, 
                fontSize: '0.9rem', color: 'var(--text-1)', border: '1px solid var(--border)',
                display: 'inline-block'
              }}>
                {tsafe(`profile.levels.${profile.experienceLevel}`, profile.experienceLevel)}
              </span>
            </div>
          )}

          {bioText && (
            <div style={{ marginBottom: 24 }}>
              <InfoRow label={tsafe('common.bio', 'Bio')} value={bioText} />
            </div>
          )}

          {profile.languages && profile.languages.length > 0 && (
            <InfoRow 
              label={tsafe('common.languages', 'Languages')} 
              value={profile.languages.join(', ')} 
            />
          )}

          {profile.interests && profile.interests.length > 0 && (
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-3)', letterSpacing: '0.05em', marginBottom: 8 }}>
                {tsafe('common.interests', 'Interests')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.interests.map((tag, i) => (
                  <VibeChip key={i} label={tag} size="sm" />
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
