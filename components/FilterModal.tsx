
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSafeTranslation } from '../hooks';

export interface FilterState {
  sortBy: string;
  duration: string;
  tags: string[]; 
  difficulty: string;
  retreatType: string;
  goals: string[];
  comfort: string;
  silence: string;
  location: string;
  dateRange: {
    start: string;
    end: string;
  };
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (newFilters: FilterState) => void;
  availableTags: string[];
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

export const FilterModal: React.FC<Props> = ({ isOpen, onClose, filters, onApply, availableTags }) => {
  const { t } = useSafeTranslation();
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);

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

  const handleArrayToggle = (key: 'tags' | 'goals', value: string) => {
    const list = localFilters[key];
    const newList = list.includes(value) ? list.filter(v => v !== value) : [...list, value];
    setLocalFilters({ ...localFilters, [key]: newList });
  };

  const handleReset = () => {
    setLocalFilters({ 
      sortBy: 'recommended', 
      duration: 'all', 
      tags: [], 
      difficulty: 'all',
      retreatType: 'all',
      goals: [],
      comfort: 'all',
      silence: 'all',
      location: '',
      dateRange: { start: '', end: '' }
    });
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const toggleQuickCategory = (type: string) => {
    if (type === 'luxury') {
      setLocalFilters(prev => ({...prev, comfort: prev.comfort === 'luxury' ? 'all' : 'luxury'}));
    } else if (type === 'beach') {
      const target = availableTags.find(tag => tag.toLowerCase().includes('beach')) || 'Beach';
      const hasT = localFilters.tags.includes(target);
      setLocalFilters(prev => ({...prev, tags: hasT ? prev.tags.filter(t => t!==target) : [...prev.tags, target]}));
    } else if (type === 'weekend') {
      setLocalFilters(prev => ({...prev, duration: prev.duration === 'short' ? 'all' : 'short'}));
    }
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
    boxShadow: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s'
  };

  return createPortal(
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 9999, 
      display: 'flex', flexDirection: 'column', 
      backgroundColor: 'var(--bg-main)',
      height: '100dvh' 
    }}>
      
      {/* 1. Header (Compact) */}
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
          {t('retreats.modal.title')}
        </span>
        <button onClick={handleReset} style={{ fontSize: '0.85rem', color: 'var(--text-2)', fontWeight: 500 }}>
          {t('common.reset')}
        </button>
      </div>

      {/* 2. Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 20px' }} className="hide-scrollbar">
        
        {/* Combined Location & Date Block */}
        <div style={{ backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 20, boxShadow: 'var(--shadow-card)' }}>
          
          <div style={{ marginBottom: 16 }}>
            <SectionLabel>{t('common.location')}</SectionLabel>
            <input 
              type="text"
              placeholder={t('instructors.modal.cityPlaceholder') || "City or Country"}
              value={localFilters.location}
              onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <SectionLabel>{t('common.dates')}</SectionLabel>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <input 
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => setLocalFilters({ 
                    ...localFilters, 
                    dateRange: { ...localFilters.dateRange, start: e.target.value } 
                  })}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => setLocalFilters({ 
                    ...localFilters, 
                    dateRange: { ...localFilters.dateRange, end: e.target.value } 
                  })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
        </div>

        {/* A. Collections (Horizontal) */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>{t('retreats.modal.quickCategories')}</SectionLabel>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {[
              { id: 'weekend', label: t('retreats.quick.weekend'), active: localFilters.duration === 'short' },
              { id: 'luxury', label: t('retreats.quick.luxury'), active: localFilters.comfort === 'luxury' },
              { id: 'beach', label: t('retreats.quick.beach'), active: localFilters.tags.some(t => t.toLowerCase().includes('beach')) }
            ].map(cat => (
              <Pill 
                key={cat.id}
                label={cat.label}
                isActive={cat.active}
                onClick={() => toggleQuickCategory(cat.id)}
                variant="accent"
              />
            ))}
          </div>
        </div>

        {/* B. Details Grid */}
        <div style={{ display: 'grid', gap: 24 }}>
          
          <div>
            <SectionTitle>{t('retreats.modal.sections.format')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <SectionLabel>{t('retreats.modal.retreatType')}</SectionLabel>
                {renderPillGroup(
                  ['all', 'vipassana', 'yoga', 'meditation', 'hybrid'], 
                  localFilters.retreatType, 
                  (v) => setLocalFilters({...localFilters, retreatType: v}), 
                  'retreats.modal.typeOptions'
                )}
              </div>
              <div>
                <SectionLabel>{t('retreats.modal.difficulty')}</SectionLabel>
                {renderPillGroup(
                  ['all', 'light', 'deep', 'hardcore'], 
                  localFilters.difficulty, 
                  (v) => setLocalFilters({...localFilters, difficulty: v}), 
                  'retreats.modal.difficultyOptions'
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <SectionTitle>{t('retreats.modal.sections.atmosphere')}</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <SectionLabel>{t('retreats.modal.comfort')}</SectionLabel>
                {renderPillGroup(
                  ['all', 'simple', 'comfort', 'luxury'], 
                  localFilters.comfort, 
                  (v) => setLocalFilters({...localFilters, comfort: v}), 
                  'retreats.modal.comfortOptions'
                )}
              </div>
              <div>
                <SectionLabel>{t('retreats.modal.silence')}</SectionLabel>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['all', 'yes', 'no'].map(opt => {
                    const label = opt === 'all' ? t('common.viewAll') : (opt === 'yes' ? t('common.on') : t('common.off'));
                    return (
                      <Pill 
                        key={opt}
                        label={label}
                        isActive={localFilters.silence === opt}
                        onClick={() => setLocalFilters({...localFilters, silence: opt})}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <SectionTitle>{t('retreats.modal.sections.vibe')}</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['stress', 'healing', 'spiritual', 'detox'].map(goal => {
                const isActive = localFilters.goals.includes(goal);
                return (
                  <Pill
                    key={goal}
                    label={t(`retreats.modal.goalOptions.${goal}`)}
                    isActive={isActive}
                    onClick={() => handleArrayToggle('goals', goal)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>{t('retreats.modal.duration')}</SectionLabel>
            {renderPillGroup(
              ['all', 'short', 'medium', 'long'], 
              localFilters.duration, 
              (v) => setLocalFilters({...localFilters, duration: v}), 
              'retreats.modal.durationOptions'
            )}
          </div>

          {/* Sort By (Compact) */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <SectionLabel>{t('retreats.modal.sortBy')}</SectionLabel>
            <select 
              value={localFilters.sortBy}
              onChange={(e) => setLocalFilters({...localFilters, sortBy: e.target.value})}
              style={{ ...inputStyle, width: '100%', appearance: 'none', backgroundImage: 'none' }}
            >
              <option value="recommended">{t('retreats.modal.sortOptions.recommended')}</option>
              <option value="priceLow">{t('retreats.modal.sortOptions.priceLow')}</option>
              <option value="priceHigh">{t('retreats.modal.sortOptions.priceHigh')}</option>
              <option value="newest">{t('retreats.modal.sortOptions.newest')}</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. Footer (Sticky Flex Item) */}
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
