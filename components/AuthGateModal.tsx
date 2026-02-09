
import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useSafeTranslation } from '../hooks';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthGateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { tsafe } = useSafeTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(245, 243, 240, 0.9)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
      animation: 'fadeInSoft 0.3s ease'
    }}>
      <div className="luxury-card" style={{ 
        width: '100%', maxWidth: 360, padding: 32, 
        backgroundColor: '#FFFFFF', textAlign: 'center',
        boxShadow: 'var(--shadow-2)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>✨</div>
        <h2 style={{ 
          fontFamily: 'var(--font-serif)', fontSize: '1.5rem', 
          marginBottom: 12, color: 'var(--text-1)' 
        }}>
          {tsafe('auth.ui.syncTitle', 'Sync Devices')}
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-2)', marginBottom: 32, lineHeight: 1.6 }}>
          {tsafe('auth.ui.syncDesc', 'Sign in to sync your favorites and settings across all your devices.')}
        </p>
        
        <button 
          onClick={() => { onClose(); navigate('/auth'); }}
          className="btn-primary"
          style={{ width: '100%', marginBottom: 16 }}
        >
          {tsafe('auth.ui.signIn', 'Sign In')}
        </button>
        
        <button 
          onClick={onClose}
          style={{ fontSize: '0.9rem', color: 'var(--text-3)', textDecoration: 'underline' }}
        >
          {tsafe('auth.ui.notNow', 'Later')}
        </button>
      </div>
    </div>,
    document.body
  );
};
