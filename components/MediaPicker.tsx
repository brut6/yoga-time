
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  value: string | null | undefined;
  onChange: (newUrl: string | null) => void;
  kind: 'image' | 'video';
  labelKey: string;
  helpKey?: string;
  allowUrlFallback?: boolean;
  maxSizeMB?: number;
  inputAriaLabel?: string;
}

export const MediaPicker: React.FC<Props> = ({ 
  value, 
  onChange, 
  kind, 
  labelKey, 
  helpKey, 
  allowUrlFallback = false,
  maxSizeMB = 5,
  inputAriaLabel
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState(value || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(t('errors.fileTooLarge'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onChange(ev.target.result as string);
        setShowUrlInput(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      // On buttons, prevent default helps avoid double-firing or form submission issues
      if (e.type === 'click') e.preventDefault(); 
    }
    
    if (fileInputRef.current) {
      // Reset value to allow selecting same file again
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleUrlSubmit = () => {
    if (urlInputValue.trim()) {
      onChange(urlInputValue);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setUrlInputValue('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {labelKey && (
        <label style={{ 
          display: 'block', marginBottom: 8, fontSize: '0.8rem', 
          color: 'var(--text-2)', fontWeight: 600, letterSpacing: '0.05em', 
          textTransform: 'uppercase' 
        }}>
          {t(labelKey)}
        </label>
      )}
      
      {value ? (
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: '#F9FAFB' }}>
          {kind === 'image' ? (
            <img src={value} alt="Media preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
          ) : (
            <video src={value} controls style={{ width: '100%', maxHeight: 300, display: 'block' }} />
          )}
          
          <div style={{ 
            position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8,
            backgroundColor: 'rgba(255,255,255,0.9)', padding: 6, borderRadius: 100, backdropFilter: 'blur(4px)'
          }}>
            <button 
              type="button"
              onClick={handlePick}
              style={{ fontSize: '0.8rem', padding: '6px 12px', cursor: 'pointer', fontWeight: 500, color: 'var(--text-1)' }}
            >
              {t('common.replace')}
            </button>
            <button 
              type="button"
              onClick={handleRemove}
              style={{ fontSize: '0.8rem', padding: '6px 12px', cursor: 'pointer', fontWeight: 500, color: '#DC2626' }}
            >
              {t('common.remove')}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          border: '1px dashed var(--border-strong)', borderRadius: 16, padding: 32, 
          textAlign: 'center', backgroundColor: 'var(--bg-card)', transition: 'background 0.2s',
          cursor: showUrlInput ? 'default' : 'pointer'
        }}
        onClick={() => !showUrlInput && handlePick()}
        >
          {!showUrlInput ? (
            <>
              <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.5 }}>{kind === 'image' ? '🖼️' : '📹'}</div>
              <button 
                type="button"
                onClick={handlePick}
                className="btn-secondary" 
                style={{ fontSize: '0.9rem', marginBottom: 12 }}
              >
                {t('common.uploadFromLibrary')}
              </button>
              
              {allowUrlFallback && (
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{t('common.or')} </span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowUrlInput(true); }}
                    style={{ fontSize: '0.8rem', textDecoration: 'underline', color: 'var(--text-2)', cursor: 'pointer' }}
                  >
                    {t('common.useUrl')}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                type="text" 
                value={urlInputValue}
                onChange={(e) => setUrlInputValue(e.target.value)}
                placeholder="https://..."
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid var(--border)' }}
                autoFocus
              />
              <button type="button" onClick={handleUrlSubmit} className="btn-secondary" style={{ padding: '8px 16px' }}>OK</button>
              <button type="button" onClick={() => setShowUrlInput(false)} style={{ padding: '8px', color: 'var(--text-3)' }}>✕</button>
            </div>
          )}
        </div>
      )}

      {helpKey && <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-3)' }}>{t(helpKey)}</p>}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={kind === 'image' ? "image/png, image/jpeg, image/webp" : "video/mp4, video/webm"}
        aria-label={inputAriaLabel || t('common.uploadFromLibrary')}
        style={{ 
          position: 'absolute', 
          width: 1, 
          height: 1, 
          padding: 0, 
          margin: -1, 
          overflow: 'hidden', 
          clip: 'rect(0,0,0,0)', 
          whiteSpace: 'nowrap', 
          border: 0,
          opacity: 0
        }} 
      />
    </div>
  );
};
