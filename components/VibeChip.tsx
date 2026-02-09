
import React from 'react';
import { useSafeTranslation } from '../hooks';
import { Vibe } from '../types';

interface Props {
  vibe?: Vibe;
  label?: string; // Manual override for generic tags
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
  variant?: 'default' | 'glass' | 'gradient'; 
  style?: React.CSSProperties;
}

// Zen Minimal Luxury Palette (Desaturated, Earthy, Expensive)
const VIBE_STYLES: Record<string, { color: string, bg: string, border: string, gradient: string }> = {
  soft_healing:      { color: '#5A6E64', bg: '#EDF2EF', border: '#DAE3DF', gradient: 'linear-gradient(135deg, #F1F5F3 0%, #E2E8E5 100%)' }, // Sage
  therapeutic:       { color: '#6B7A82', bg: '#F0F4F6', border: '#DFE5E8', gradient: 'linear-gradient(135deg, #F3F7F9 0%, #E6ECEF 100%)' }, // Mist
  strong_athletic:   { color: '#8C6B5D', bg: '#F7F0ED', border: '#EBDDD8', gradient: 'linear-gradient(135deg, #FAF5F2 0%, #EFE6E2 100%)' }, // Clay
  spiritual_mindful: { color: '#7D7685', bg: '#F2F0F5', border: '#E4DEE8', gradient: 'linear-gradient(135deg, #F6F4F8 0%, #EBE8F0 100%)' }, // Lavender
  breath_calm:       { color: '#5A7586', bg: '#EFF5F8', border: '#DEE8ED', gradient: 'linear-gradient(135deg, #F0F6F9 0%, #E2EBF0 100%)' }, // Air
  feminine_flow:     { color: '#9C7E7E', bg: '#F9F2F2', border: '#EDE0E0', gradient: 'linear-gradient(135deg, #FBF5F5 0%, #F2E8E8 100%)' }, // Rose
  masculine_strength:{ color: '#756C65', bg: '#F0EEEB', border: '#E0DBD6', gradient: 'linear-gradient(135deg, #F5F3F1 0%, #E8E5E1 100%)' }, // Stone
  slow_luxury:       { color: '#8F7E66', bg: '#F7F4EF', border: '#EBE5DB', gradient: 'linear-gradient(135deg, #FAF8F4 0%, #F0EADF 100%)' }, // Gold
  transformational:  { color: '#5E6065', bg: '#F0F1F2', border: '#DEE0E3', gradient: 'linear-gradient(135deg, #F5F6F7 0%, #E9EBED 100%)' }, // Slate
  beginner_friendly: { color: '#6F806F', bg: '#F0F5F0', border: '#E0E8E0', gradient: 'linear-gradient(135deg, #F4F8F4 0%, #E6EFE6 100%)' }, // Moss
  advanced_level:    { color: '#8A7E68', bg: '#F5F2EB', border: '#E6DFD1', gradient: 'linear-gradient(135deg, #F9F6F0 0%, #EBE5DA 100%)' }, // Bronze
  // Generic Fallback
  neutral:           { color: '#756C65', bg: '#F5F5F5', border: '#E5E5E5', gradient: 'linear-gradient(135deg, #F5F3F1 0%, #E8E5E1 100%)' }
};

export const VibeChip: React.FC<Props> = ({ vibe, label, selected, onClick, size = 'sm', variant = 'default', style: customStyle }) => {
  const { t } = useSafeTranslation();
  const styleConfig = (vibe && VIBE_STYLES[vibe]) ? VIBE_STYLES[vibe] : VIBE_STYLES.neutral;

  let appliedStyle = {};

  if (variant === 'glass') {
    appliedStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(8px)',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
    };
  } else if (variant === 'gradient') {
    appliedStyle = {
      background: styleConfig.gradient,
      color: styleConfig.color,
      // Subtle border from the palette for definition
      border: selected ? `1px solid ${styleConfig.color}` : `1px solid ${styleConfig.border}`, 
      boxShadow: selected ? `0 0 0 1px ${styleConfig.color}, 0 4px 12px ${styleConfig.color}20` : '0 2px 8px rgba(0,0,0,0.02)',
    };
  } else {
    // Default solid
    appliedStyle = {
      backgroundColor: selected ? styleConfig.color : styleConfig.bg,
      color: selected ? '#FFFFFF' : styleConfig.color,
      border: selected ? `1px solid ${styleConfig.color}` : `1px solid ${styleConfig.border}`,
    };
  }

  // Consistent sizing
  const height = size === 'sm' ? 24 : 32;
  const padding = size === 'sm' ? '0 10px' : '0 16px';
  const fontSize = size === 'sm' ? '0.65rem' : '0.8rem';

  return (
    <button
      className="vibe-chip"
      onClick={onClick}
      disabled={!onClick}
      style={{
        ...appliedStyle,
        height,
        padding,
        fontSize,
        borderRadius: 100, // Pill
        fontWeight: 500,
        letterSpacing: '0.03em',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        // If variant is gradient, default to auto width unless overridden
        width: 'auto', 
        opacity: variant === 'gradient' && !selected && !onClick ? 0.9 : 1,
        maxWidth: '100%', // Prevent overflow
        ...customStyle // Allow overrides
      }}
    >
      {/* Tiny dot for visual texture in default mode only */}
      {variant === 'default' && !selected && (
        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: styleConfig.color, opacity: 0.6 }} />
      )}
      {label || (vibe ? t(`vibe.${vibe}`) : '')}
    </button>
  );
};
