
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  images: string[];
  onChange: (newImages: string[]) => void;
  labelKey?: string;
}

export const MediaGalleryPicker: React.FC<Props> = ({ images = [], onChange, labelKey = 'labels.gallery' }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Process all selected files
    const promises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(newBase64s => {
      onChange([...images, ...newBase64s]);
    });
  };

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleMakeCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const item = next.splice(index, 1)[0];
    next.unshift(item);
    onChange(next);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <label style={{ 
          fontSize: '0.8rem', color: 'var(--text-2)', fontWeight: 600, 
          letterSpacing: '0.05em', textTransform: 'uppercase' 
        }}>
          {t(labelKey)} ({images.length})
        </label>
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ fontSize: '0.85rem', color: 'var(--gold-sand)', fontWeight: 500, cursor: 'pointer' }}
        >
          + {t('common.addPhotos')}
        </button>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 
      }}>
        {images.map((img, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            <div style={{ 
              position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', opacity: 0, 
              transition: 'opacity 0.2s', display: 'flex', flexDirection: 'column', 
              alignItems: 'center', justifyContent: 'center', gap: 8
            }} 
            className="gallery-overlay"
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
            >
              <button 
                type="button" 
                onClick={() => handleRemove(i)}
                style={{ background: '#DC2626', color: '#fff', borderRadius: '50%', width: 24, height: 24, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
              {i > 0 && (
                <button 
                  type="button"
                  onClick={() => handleMakeCover(i)}
                  style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: 4, cursor: 'pointer' }}
                >
                  {t('common.makeCover')}
                </button>
              )}
            </div>
            
            {i === 0 && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.6rem', textAlign: 'center', padding: 2 }}>
                Cover
              </div>
            )}
          </div>
        ))}
        
        {/* Add Button Tile */}
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            aspectRatio: '1', borderRadius: 12, border: '1px dashed var(--border-strong)', 
            backgroundColor: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', color: 'var(--text-3)', cursor: 'pointer'
          }}
        >
          +
        </button>
      </div>

      <input 
        type="file" 
        multiple
        ref={fileInputRef} 
        onChange={handleFiles} 
        accept="image/png, image/jpeg, image/webp"
        style={{ display: 'none' }} 
      />
    </div>
  );
};
