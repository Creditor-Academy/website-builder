import React from 'react';
import { Editable } from '@/components/ui/Editable';

export interface StatItem {
  id?: string;
  value?: string;
  suffix?: string;
  label?: string;
  [key: string]: any;
}

export interface StatsSectionContent {
  headline?: string;
  subheadline?: string;
  stats?: StatItem[];
  [key: string]: any;
}

export interface StatsSectionStyles {
  backgroundColor?: string;
  backgroundGradient?: string;
  useGradient?: boolean;
  padding?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string | number;
  color?: string;
  textColor?: string;
  headingColor?: string;
  valueColor?: string;
  paragraphColor?: string;
  labelColor?: string;
  accentColor?: string;
  suffixColor?: string;
  cardBackgroundColor?: string;
  cardBg?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  [key: string]: any;
}

export interface StatsSectionData {
  id?: string;
  type?: string;
  name?: string;
  variant?: 'cards' | 'counter' | 'horizontal' | string;
  content?: StatsSectionContent;
  styles?: StatsSectionStyles;
  visible?: boolean;
  locked?: boolean;
  [key: string]: any;
}

export interface StatsSectionProps {
  section: StatsSectionData;
  isEditing?: boolean;
  onContentChange?: (field: string, value: any) => void;
  isSelected?: boolean;
  isAlternate?: boolean;
}

export function StatsSection({ section, isEditing = false, onContentChange }: StatsSectionProps) {
  const content = section?.content || {};
  const styles = section?.styles || {};
  const stats: StatItem[] = content.stats || [];
  const variant = section?.variant || 'horizontal';
  
  // Enhanced background (gradient or solid)
  const background = styles.useGradient 
    ? (styles.backgroundGradient || styles.backgroundColor) 
    : (styles.backgroundColor || 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)');
  
  const padding = styles.padding || '100px 0';
  const fontFamily = styles.fontFamily || undefined;
  
  // Color resolution
  const hasCustomValueColor = Boolean(styles.headingColor || styles.valueColor || styles.textColor || styles.color);
  const valueColor = styles.headingColor || styles.valueColor || styles.textColor || styles.color || '#ffffff';
  
  const hasCustomLabelColor = Boolean(styles.paragraphColor || styles.labelColor);
  const labelColor = styles.paragraphColor || styles.labelColor || (styles.textColor ? styles.textColor : undefined);
  
  const accentColor = styles.accentColor || styles.suffixColor || '#38bdf8';
  
  // Card & Border resolution
  const cardBackgroundColor = styles.cardBackgroundColor || styles.cardBg || 'rgba(255, 255, 255, 0.05)';
  const borderColor = styles.borderColor || 'rgba(255, 255, 255, 0.1)';
  const borderWidth = styles.borderWidth !== undefined ? styles.borderWidth : '1px';
  const borderStyle = styles.borderStyle || 'solid';
  const borderRadius = styles.borderRadius !== undefined ? styles.borderRadius : '1.5rem';

  // Helper to maintain exact logic while keeping the JSX clean
  const updateField = (id: string | undefined, field: string, newValue: string) => {
    if (!isEditing || !onContentChange) return;
    const currentStats = content.stats || [];
    const updated = currentStats.map((s, idx) => {
      const match = id ? s.id === id : idx === Number(id);
      return match ? { ...s, [field]: newValue } : s;
    });
    onContentChange('stats', updated);
  };

  const renderHeader = () => {
    if (!content.headline && !content.subheadline) return null;
    return (
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {content.headline && (
          <Editable
            as="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4"
            style={{
              color: valueColor,
              fontFamily,
            }}
            isEditing={isEditing}
            value={content.headline || ''}
            onSave={(val) => onContentChange && onContentChange('headline', val)}
          />
        )}
        {content.subheadline && (
          <Editable
            as="p"
            className="text-base sm:text-lg opacity-80"
            style={{
              color: labelColor || 'rgba(255, 255, 255, 0.7)',
              fontFamily,
            }}
            isEditing={isEditing}
            value={content.subheadline || ''}
            onSave={(val) => onContentChange && onContentChange('subheadline', val)}
          />
        )}
      </div>
    );
  };

  // --- VARIANT: CARDS (Modern Glassmorphism) ---
  if (variant === 'cards') {
    return (
      <section className="relative overflow-hidden" style={{ background, padding, fontFamily }}>
        <div className="container mx-auto px-6 max-w-7xl">
          {renderHeader()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.id || index} 
                className="group relative backdrop-blur-md p-8 transition-all hover:-translate-y-2 shadow-2xl"
                style={{
                  backgroundColor: cardBackgroundColor,
                  borderWidth,
                  borderStyle: borderStyle as React.CSSProperties['borderStyle'],
                  borderColor,
                  borderRadius,
                  fontFamily,
                }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity" 
                  style={{
                    borderTopLeftRadius: borderRadius,
                    borderTopRightRadius: borderRadius,
                    background: styles.accentColor ? styles.accentColor : 'linear-gradient(to right, #3b82f6, #22d3ee)',
                  }}
                />
                <div className="flex items-baseline gap-1 mb-2">
                  <Editable 
                    className="text-5xl font-black tracking-tight"
                    style={{
                      color: valueColor,
                      fontFamily,
                      ...(styles.fontWeight ? { fontWeight: styles.fontWeight } : {}),
                    }}
                    isEditing={isEditing}
                    value={stat.value || ''}
                    onSave={(val) => updateField(stat.id, 'value', val)}
                  />
                  {(stat.suffix || isEditing) && (
                    <Editable 
                      as="span"
                      className="text-2xl font-bold"
                      style={{
                        color: accentColor,
                        fontFamily,
                      }}
                      isEditing={isEditing}
                      value={stat.suffix || ''}
                      onSave={(val) => updateField(stat.id, 'suffix', val)}
                    />
                  )}
                </div>
                <Editable 
                  className="text-xs font-bold uppercase tracking-[0.2em]"
                  style={{
                    color: labelColor || '#60a5fa',
                    fontFamily,
                  }}
                  isEditing={isEditing}
                  value={stat.label || ''}
                  onSave={(val) => updateField(stat.id, 'label', val)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- VARIANT: COUNTER (Bold Focus) ---
  if (variant === 'counter') {
    return (
      <section className="relative" style={{ background, padding, fontFamily }}>
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {renderHeader()}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={stat.id || index} 
                className="flex flex-col items-center p-6"
                style={{
                  borderRadius: styles.borderRadius || undefined,
                  borderWidth: styles.borderWidth || undefined,
                  borderStyle: (styles.borderStyle as React.CSSProperties['borderStyle']) || undefined,
                  borderColor: styles.borderColor || undefined,
                  backgroundColor: styles.cardBackgroundColor || undefined,
                  fontFamily,
                }}
              >
                <div className="relative">
                  <Editable
                    className={`text-5xl sm:text-6xl md:text-8xl font-extrabold leading-none text-center ${
                      hasCustomValueColor ? '' : 'text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40'
                    }`}
                    style={{
                      color: hasCustomValueColor ? valueColor : undefined,
                      fontFamily,
                      ...(styles.fontWeight ? { fontWeight: styles.fontWeight } : {}),
                    }}
                    isEditing={isEditing}
                    value={stat.value || ''}
                    onSave={(val) => updateField(stat.id, 'value', val)}
                  />
                  <Editable 
                    as="span"
                    className="text-2xl sm:text-3xl font-bold absolute -top-1 sm:-top-2 -right-4 sm:-right-6"
                    style={{
                      color: accentColor,
                      fontFamily,
                    }}
                    isEditing={isEditing}
                    value={stat.suffix || ''}
                    onSave={(val) => updateField(stat.id, 'suffix', val)}
                  />
                </div>
                <Editable 
                  className="mt-4 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-center"
                  style={{
                    color: labelColor || '#94a3b8',
                    fontFamily,
                  }}
                  isEditing={isEditing}
                  value={stat.label || ''}
                  onSave={(val) => updateField(stat.id, 'label', val)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // --- DEFAULT: HORIZONTAL (Minimalist Split) ---
  return (
    <section 
      className="relative" 
      style={{ 
        background, 
        padding, 
        fontFamily,
        borderTopWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderTopStyle: borderStyle as React.CSSProperties['borderTopStyle'],
        borderBottomStyle: borderStyle as React.CSSProperties['borderBottomStyle'],
        borderTopColor: borderColor,
        borderBottomColor: borderColor,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {renderHeader()}
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8 sm:gap-12 lg:gap-4">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.id || index}>
              <div 
                className="text-center px-4 sm:px-8 py-2"
                style={{
                  borderRadius: styles.borderRadius || undefined,
                  backgroundColor: styles.cardBackgroundColor || undefined,
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Editable
                    as="span"
                    className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter"
                    style={{
                      color: valueColor,
                      fontFamily,
                      ...(styles.fontWeight ? { fontWeight: styles.fontWeight } : {}),
                    }}
                    isEditing={isEditing}
                    value={stat.value || ''}
                    onSave={(val) => updateField(stat.id, 'value', val)}
                  />
                  <Editable 
                    as="span"
                    className="text-3xl sm:text-4xl font-light"
                    style={{
                      color: accentColor,
                      fontFamily,
                    }}
                    isEditing={isEditing}
                    value={stat.suffix || ''}
                    onSave={(val) => updateField(stat.id, 'suffix', val)}
                  />
                </div>
                <Editable 
                  className="mt-2 text-[11px] sm:text-xs font-black uppercase tracking-widest"
                  style={{
                    color: labelColor || '#64748b',
                    fontFamily,
                  }}
                  isEditing={isEditing}
                  value={stat.label || ''}
                  onSave={(val) => updateField(stat.id, 'label', val)}
                />
              </div>
              {index < stats.length - 1 && (
                <div 
                  className="hidden lg:block h-12 w-px" 
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${borderColor}, transparent)`
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
