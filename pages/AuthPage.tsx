
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';
import { authService, isFirebaseConfigured } from '../services';

type Mode = 'signin' | 'signup';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
  </svg>
);

export const AuthPage = () => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = isFirebaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfigured) {
      setError(tsafe('auth.errors.notConfigured', 'Auth service not configured'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signin') {
        await authService.signInEmail(email, password);
      } else {
        await authService.signUpEmail(email, password);
      }
      navigate(-1); // Go back on success
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isConfigured) {
      setError(tsafe('auth.errors.notConfigured', 'Auth service not configured'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authService.signInGoogle();
      navigate(-1);
    } catch (err: any) {
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    borderRadius: 0,
    border: 'none',
    borderBottom: '1px solid var(--border)',
    fontSize: '1.1rem',
    color: 'var(--text-1)',
    marginBottom: 20,
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: 'inherit',
    opacity: isConfigured ? 1 : 0.5,
    cursor: isConfigured ? 'text' : 'not-allowed'
  };

  return (
    <div className="yt-page" style={{ 
      display: 'flex', flexDirection: 'column', 
      justifyContent: 'center', alignItems: 'center', 
      minHeight: '80vh',
      paddingBottom: 0
    }}>
      <div className="luxury-card" style={{ 
        width: '100%', maxWidth: 400, padding: 32, 
        backgroundColor: '#FFFFFF',
        animation: 'fadeInSoft 0.5s ease'
      }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', marginBottom: 40, borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={() => setMode('signin')}
            style={{ 
              flex: 1, padding: '16px', fontSize: '1rem', fontWeight: 500,
              color: mode === 'signin' ? 'var(--text-1)' : 'var(--text-3)',
              borderBottom: mode === 'signin' ? '2px solid var(--text-1)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {tsafe('auth.ui.signIn', 'Sign In')}
          </button>
          <button 
            onClick={() => setMode('signup')}
            style={{ 
              flex: 1, padding: '16px', fontSize: '1rem', fontWeight: 500,
              color: mode === 'signup' ? 'var(--text-1)' : 'var(--text-3)',
              borderBottom: mode === 'signup' ? '2px solid var(--text-1)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {tsafe('auth.ui.signUp', 'Sign Up')}
          </button>
        </div>

        {/* Configuration Warning */}
        {!isConfigured && (
          <div style={{ 
            marginBottom: 24, padding: 16, borderRadius: 12, 
            backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.9rem',
            textAlign: 'center', fontWeight: 500, border: '1px solid #FCD34D'
          }}>
            <div style={{ marginBottom: 4 }}>Auth service not configured.</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 400 }}>
              Add <code>VITE_FIREBASE_API_KEY</code> to <code>.env</code> to enable login.
            </div>
          </div>
        )}

        {error && isConfigured && (
          <div style={{ 
            marginBottom: 24, padding: 12, borderRadius: 8, 
            backgroundColor: '#FEF2F2', color: '#DC2626', fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder={tsafe('auth.ui.emailPlaceholder', 'Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
            disabled={!isConfigured}
          />
          <input 
            type="password" 
            placeholder={tsafe('auth.ui.passwordPlaceholder', 'Password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
            disabled={!isConfigured}
          />

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: 24, opacity: loading || !isConfigured ? 0.7 : 1 }}
            disabled={loading || !isConfigured}
          >
            {loading ? '...' : tsafe('auth.ui.continue', 'Continue')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
          <span style={{ padding: '0 12px', fontSize: '0.85rem', color: 'var(--text-3)' }}>
            {tsafe('auth.ui.or', 'or')}
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border)' }} />
        </div>

        <button 
          onClick={handleGoogle}
          className="btn-secondary"
          style={{ width: '100%', display: 'flex', gap: 12, borderColor: 'var(--border)', opacity: !isConfigured ? 0.5 : 1 }}
          disabled={loading || !isConfigured}
        >
          <GoogleIcon /> {tsafe('auth.ui.google', 'Continue with Google')}
        </button>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              fontSize: '0.9rem', color: 'var(--text-3)', 
              textDecoration: 'underline' 
            }}
          >
            {tsafe('auth.ui.notNow', 'Not now')}
          </button>
         </div>
      </div>
    </div>
  );
};
