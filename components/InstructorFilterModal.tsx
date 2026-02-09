
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSafeTranslation } from '../hooks';

export interface InstructorFilterState {
  sortBy: string;
  price: string;
  languages: string[];
  tags: string[]; // styles
  levels: string[];
  mode: string;
  experience: string;
  specializations: string[];
  city: string;
  verified: boolean;
  vibe: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: InstructorFilterState;
  onApply: (newFilters: InstructorFilterState) => void;
  availableTags: string[];
  availableSpecializations?: string[];
}

// -- Components --

interface SectionTitleProps {
  children: React.ReactNode;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h3 style={{ 
    fontFamily: 'var(--font-sans)', 
    fontSize: '0.95rem', 
    color: 'var(--text-1)', 
    marginBottom: 12,
    fontWeight: 600,
    letterSpacing: '0.01em'
  }}>
    {children}
  </h3>
);

interface SectionLabelProps {
  children: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => (
  <h4 style={{ 
    fontSize: '0.7rem', 
    fontWeight: 600, 
    color: 'var(--text-3)', 
    textTransform: 'uppercase', 
    letterSpacing: '0.08em', 
    marginBottom: 8,
    marginTop: 12
  }}>
    {children}
  </h4>
);

interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'default' | 'accent';
}

const Pill: React.FC<PillProps> = ({ 
  label, 
  isActive, 
  onClick, 
  variant = 'default' 
}) => {
  const activeBg = variant === 'accent' ? 'var(--text-1)' : '#EBE5DF'; 
  const activeColor = variant === 'accent' ? '#FFF' : 'var(--text-1)';
  const activeBorder = variant === 'accent' ? 'transparent' : 'transparent';

  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: 8,
        border: isActive ? `1px solid ${activeBorder}` : '1px solid var(--border)',
        backgroundColor: isActive ? activeBg : 'transparent',
        color: isActive ? activeColor : 'var(--text-2)',
        fontSize: '0.85rem',
        fontWeight: isActive ? 500 : 400,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </button>
  );
};

export const InstructorFilterModal: React.FC<Props> = ({ isOpen, onClose, filters, onApply }) => {
  const { t } = useSafeTranslation();
  const [localFilters, setLocalFilters] = React.useState<InstructorFilterState>(filters);

  React.useEffect(() => {
    if (isOpen) setLocalFilters(filters);
  }, [isOpen, filters]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // -- Handlers --

  const handleArrayToggle = (key: keyof InstructorFilterState, value: string) => {
    const currentList = localFilters[key] as string[];
    const newList = currentList.includes(value)
      ? currentList.filter(v => v !== value)
      : [...currentList, value];
    setLocalFilters({ ...localFilters, [key]: newList });
  };

  const handleReset = () => {
    setLocalFilters({ 
      sortBy: 'recommended', 
      price: 'all', 
      languages: [], 
      tags: [], 
      levels: [], 
      mode: 'all', 
      experience: 'all', 
      specializations: [], 
      city: '', 
      verified: false, 
      vibe: []
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  // -- Render Helpers --

  const renderPillGroup = (
    options: string[], 
    current: string, 
    onChange: (val: string) => void, 
    labelPrefix: string
  ) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {options.map(opt => (
        <Pill
          key={opt}
          label={opt === 'all' ? t('common.viewAll') : t(`${labelPrefix}.${opt}`)}
          isActive={current === opt}
          onClick={() => onChange(opt)}
        />
      ))}
    </div>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid var(--border-strong)',
    backgroundColor: '#FFFFFF',
    fontSize: '0.9rem',
    color: 'var(--text-1)',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  };

  return createPortal(
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', flexDirection: 'column', 
      backgroundColor: 'var(--bg-main)',
      height: '100dvh' // Mobile fix
    }}>
      
      {/* 1. Header */}
      <div style={{ 
        flexShrink: 0,
        padding: '16px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        zIndex: 10
      }}>
        <button onClick={onClose} style={{ fontSize: '1.5rem', lineHeight: 1, color: 'var(--text-2)', padding: 4 }}>×</button>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-1)' }}>
          {t('instructors.modal.title')}
        </span>
        <button onClick={handleReset} style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 500 }}>
          {t('common.reset')}
        </button>
      </div>

      {/* 2. Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px' }} className="hide-scrollbar">
        
        {/* Location Block */}
        <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 24, boxShadow: 'var(--shadow-card)' }}>
          <SectionLabel>{t('instructors.modal.city')}</SectionLabel>
          <input 
            type="text"
            value={localFilters.city}
            onChange={(e) => setLocalFilters({...localFilters, city: e.target.value})}
            placeholder={t('instructors.modal.cityPlaceholder')}
            style={inputStyle}
          />
        </div>

        {/* The Guide */}
        <div style={{ marginBottom: 24 }}>
          <SectionTitle>{t('instructors.modal.sections.guide')}</SectionTitle>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
             <SectionLabel>{t('instructors.modal.verified')}</SectionLabel>
             <button 
               onClick={() => setLocalFilters({...localFilters, verified: !localFilters.verified})}
               style={{
                 width: 44, height: 26, borderRadius: 20,
                 backgroundColor: localFilters.verified ? 'var(--text-1)' : 'var(--border-strong)',
                 position: 'relative', transition: 'background-color 0.2s'
               }}
             >
               <div style={{ 
                 width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff',
                 position: 'absolute', top: 3, left: localFilters.verified ? 21 : 3,
                 transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
               }} />
             </button>
          </div>

          <SectionLabel>{t('instructors.modal.experience')}</SectionLabel>
          {renderPillGroup(
            ['all', 'junior', 'mid', 'senior'],
            localFilters.experience,
            (v) => setLocalFilters({...localFilters, experience: v}),
            'instructors.experienceOptions'
          )}

          <SectionLabel>{t('instructors.modal.languages')}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
             {['English', 'Spanish', 'French', 'Russian', 'Hebrew'].map(lang => (
               <Pill 
                 key={lang}
                 label={lang}
                 isActive={localFilters.languages.includes(lang)}
                 onClick={() => handleArrayToggle('languages', lang)}
               />
             ))}
          </div>
        </div>

        {/* Practice & Vibe */}
        <div style={{ marginBottom: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <SectionTitle>{t('instructors.modal.sections.practiceVibe')}</SectionTitle>
          
          <SectionLabel>{t('instructors.modal.vibe')}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
             {['soft', 'therapeutic', 'athletic', 'spiritual'].map(v => (
               <Pill 
                 key={v}
                 label={t(`instructors.vibeOptions.${v}`)}
                 isActive={localFilters.vibe.includes(v)}
                 onClick={() => handleArrayToggle('vibe', v)}
               />
             ))}
          </div>

          <SectionLabel>{t('instructors.modal.mode')}</SectionLabel>
          {renderPillGroup(
            ['all', 'online', 'in_person'],
            localFilters.mode,
            (v) => setLocalFilters({...localFilters, mode: v}),
            'instructors.modeOptions'
          )}
        </div>

        {/* Sort & Price */}
        <div style={{ marginBottom: 24, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <SectionLabel>{t('instructors.modal.price')}</SectionLabel>
          {renderPillGroup(
            ['all', 'budget', 'standard', 'premium'],
            localFilters.price,
            (v) => setLocalFilters({...localFilters, price: v}),
            'instructors.priceOptions'
          )}

          <SectionLabel>{t('instructors.modal.sortBy')}</SectionLabel>
          <select 
            value={localFilters.sortBy}
            onChange={(e) => setLocalFilters({...localFilters, sortBy: e.target.value})}
            style={{ ...inputStyle, width: '100%', appearance: 'none', backgroundImage: 'none' }}
          >
            <option value="recommended">{t('instructors.modal.sortOptions.recommended')}</option>
            <option value="rating">{t('instructors.modal.sortOptions.rating')}</option>
            <option value="priceLow">{t('instructors.modal.sortOptions.priceLow')}</option>
            <option value="priceHigh">{t('instructors.modal.sortOptions.priceHigh')}</option>
            <option value="experienceHigh">{t('instructors.modal.sortOptions.experienceHigh')}</option>
          </select>
        </div>

      </div>

      {/* 3. Footer */}
      <div style={{ 
        flexShrink: 0,
        padding: '16px 24px',
        paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'center',
        zIndex: 20
      }}>
        <button 
          onClick={handleApply}
          className="btn-primary"
          style={{ width: '100%', maxWidth: 400, height: 48, fontSize: '0.95rem' }}
        >
          {t('common.apply')}
        </button>
      </div>

    </div>,
    document.body
  );
};
