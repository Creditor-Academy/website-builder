import React, { useState } from 'react';
import * as Icons from 'lucide-react';

// ─── Shared Helpers ────────────────────────────────────────────────────────────

const getIcon = (iconName, size = 22) => {
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent width={size} height={size} strokeWidth={1.7} /> : null;
};

// Clean, professional accent palette — works on white
const ACCENT = '#111827';
const ACCENT_LIGHT = '#f3f4f6';
const ACCENT_BORDER = '#e5e7eb';
const ACCENT_MUTED = '#6b7280';

const TAG_COLORS = [
  { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', dot: '#3b82f6' },
  { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', dot: '#22c55e' },
  { bg: '#fdf4ff', border: '#e9d5ff', text: '#7e22ce', dot: '#a855f7' },
  { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', dot: '#f97316' },
  { bg: '#f0f9ff', border: '#bae6fd', text: '#0369a1', dot: '#0ea5e9' },
  { bg: '#fefce8', border: '#fde68a', text: '#92400e', dot: '#eab308' },
];

// ─── VARIANT: GRID ─────────────────────────────────────────────────────────────

const renderGrid = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
          style={{
            position: 'relative',
            padding: '2rem',
            background: styles.cardBackgroundColor || '#ffffff',
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: styles.borderRadius || 'var(--radius, 16px)',
            transition: 'transform var(--animation-speed, 0.22s) ease, box-shadow var(--animation-speed, 0.22s) ease, border-color var(--animation-speed, 0.22s) ease',
            cursor: 'default',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 16px 40px rgba(0,0,0,0.08))';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 1px 3px rgba(0,0,0,0.04))';
            e.currentTarget.style.borderColor = ACCENT_BORDER;
          }}
        >
          <div style={{
            position: 'absolute', top: '1.25rem', right: '1.5rem',
            fontSize: '4rem', fontWeight: 900, lineHeight: 1,
            color: '#f9fafb',
            fontFamily: '"Playfair Display", Georgia, serif',
            userSelect: 'none',
            letterSpacing: '-0.04em',
          }}>
            {String(index + 1).padStart(2, '0')}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{
              width: '48px', height: '48px',
              background: tag.bg,
              border: `1px solid ${tag.border}`,
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: tag.text,
            }}>
              {getIcon(feature.icon, 20)}
            </div>
          </div>

          <h3
            style={{
              margin: '0 0 0.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: headingColor,
              fontFamily: '"Playfair Display", Georgia, serif',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: feature.title }}
            onInput={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.innerHTML } : f);
              onContentChange('features', updated);
            }}
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.innerHTML } : f);
              onContentChange('features', updated);
            }}
          />

          <p
            style={{
              margin: '0 0 1.5rem',
              fontSize: '0.875rem',
              lineHeight: 1.75,
              color: paragraphColor,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: feature.description }}
            onInput={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.innerHTML } : f);
              onContentChange('features', updated);
            }}
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.innerHTML } : f);
              onContentChange('features', updated);
            }}
          />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '3px 10px',
            background: tag.bg,
            border: `1px solid ${tag.border}`,
            borderRadius: '999px',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tag.dot, flexShrink: 0 }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: tag.text, letterSpacing: '0.05em' }}>Feature</span>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${tag.dot}, transparent)`,
            opacity: 0,
            transition: 'opacity var(--animation-speed, 0.22s) ease',
          }} />
        </div>
      );
    })}
  </div>
);

// ─── VARIANT: LIST ─────────────────────────────────────────────────────────────

const renderList = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div className="max-w-2xl mx-auto space-y-4">
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
            className="flex flex-col sm:flex-row gap-5 md:gap-7 p-5 md:p-6 transition-all duration-200 hover:bg-slate-50 rounded-xl"
            style={{
              borderBottom: index < content.features.length - 1 ? `1px solid ${ACCENT_BORDER}` : 'none',
            }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="flex flex-row sm:flex-col items-center flex-shrink-0 sm:w-12 gap-4 sm:gap-0">
            <div style={{
              width: '48px', height: '48px',
              background: tag.bg,
              border: `1.5px solid ${tag.border}`,
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: tag.text,
              flexShrink: 0,
            }}>
              {getIcon(feature.icon, 19)}
            </div>
            {index < content.features.length - 1 && (
              <div className="hidden sm:block w-px flex-1 mt-2.5 bg-gradient-to-b from-slate-200 to-transparent" />
            )}
          </div>

          <div style={{ flex: 1, paddingTop: '6px' }}>
            <div style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: tag.text,
              marginBottom: '0.35rem',
            }}>
              Step {String(index + 1).padStart(2, '0')}
            </div>

            <h3
              style={{
                margin: '0 0 0.45rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: headingColor,
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: '-0.01em',
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: feature.title }}
              onInput={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.innerHTML } : f);
                onContentChange('features', updated);
              }}
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.innerHTML } : f);
                onContentChange('features', updated);
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.75,
                color: paragraphColor,
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: feature.description }}
              onInput={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.innerHTML } : f);
                onContentChange('features', updated);
              }}
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.innerHTML } : f);
                onContentChange('features', updated);
              }}
            />
          </div>

          <div className="hidden sm:flex items-center pt-2 text-slate-300 flex-shrink-0">
            <Icons.ArrowRight width={16} height={16} />
          </div>
        </div>
      );
    })}
  </div>
);

// ─── VARIANT: ICONS ─────────────────────────────────────────────────────────────

const renderIcons = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem 1.25rem 1.75rem',
            background: styles.cardBackgroundColor || '#ffffff',
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: styles.borderRadius || 'var(--radius, 16px)',
            transition: 'transform var(--animation-speed, 0.22s) ease, box-shadow var(--animation-speed, 0.22s) ease, border-color var(--animation-speed, 0.22s) ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 12px 32px rgba(0,0,0,0.07))';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 1px 3px rgba(0,0,0,0.04))';
            e.currentTarget.style.borderColor = ACCENT_BORDER;
          }}
        >
          <div style={{
            position: 'absolute', bottom: '-12px', right: '-12px',
            opacity: 0.04, color: tag.dot,
            transform: 'rotate(-12deg)', pointerEvents: 'none',
          }}>
            {getIcon(feature.icon, 72)}
          </div>

          <div style={{
            width: '60px', height: '60px',
            background: tag.bg,
            border: `1.5px solid ${tag.border}`,
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: tag.text,
            marginBottom: '1.1rem',
          }}>
            {getIcon(feature.icon, 24)}
          </div>

          <h4
            style={{
              margin: '0 0 0.5rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: headingColor,
              fontFamily: '"Playfair Display", Georgia, serif',
              lineHeight: 1.3,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.title}
          </h4>

          <p
            style={{
              margin: 0,
              fontSize: '0.78rem',
              lineHeight: 1.65,
              color: paragraphColor,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.description}
          </p>

          <div style={{
            position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '2.5px',
            background: tag.dot, borderRadius: '999px', opacity: 0.4,
          }} />
        </div>
      );
    })}
  </div>
);

// ─── VARIANT: CARDS ─────────────────────────────────────────────────────────────

const renderCards = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div className="max-w-4xl mx-auto flex flex-col gap-4">
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
          className="flex flex-col sm:flex-row items-stretch bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-slate-300 hover:translate-x-1"
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 8px 30px rgba(0,0,0,0.08))';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'var(--shadow, 0 1px 3px rgba(0,0,0,0.04))';
            e.currentTarget.style.borderColor = ACCENT_BORDER;
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
            <div className={`w-full sm:w-[72px] flex-shrink-0 bg-slate-50 border-b sm:border-b-0 sm:border-r border-slate-200 flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-2 p-4 sm:py-6`} style={{ background: tag.bg, borderColor: tag.border }}>
            <div style={{ color: tag.text }}>{getIcon(feature.icon, 22)}</div>
            <span className="text-[10px] font-extrabold tracking-widest sm:rotate-180 sm:[writing-mode:vertical-rl] opacity-70" style={{ color: tag.text }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="flex-1 p-6 md:p-7 flex flex-col justify-center">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '0.6rem' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: tag.dot, flexShrink: 0 }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: tag.text }}>
                Feature {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3
              style={{
                margin: '0 0 0.5rem',
                fontSize: '1.05rem', fontWeight: 700,
                color: headingColor,
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: '-0.01em',
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
                onContentChange('features', updated);
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.72, color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, description: e.currentTarget.textContent } : f);
                onContentChange('features', updated);
              }}
            >
              {feature.description}
            </p>
          </div>

          <div className="hidden sm:flex w-12 flex-shrink-0 items-center justify-center text-slate-300 border-l border-slate-100">
            <Icons.ChevronRight width={18} height={18} />
          </div>
        </div>
      );
    })}
  </div>
);

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────

export function FeaturesSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'grid' } = section;
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  // Read bg from styles if set, otherwise default to white
  const background = (styles.backgroundColor && styles.backgroundColor !== 'transparent')
    ? styles.backgroundColor
    : '#ffffff';

  const headingColor = styles.headingColor || '#111827';
  const paragraphColor = styles.paragraphColor || '#6b7280';

  const sharedProps = { content, styles, isEditing, onContentChange, headingColor, paragraphColor };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .fs-root * { font-family: 'DM Sans', 'Helvetica Neue', sans-serif; box-sizing: border-box; }
        .fs-root h2, .fs-root h3, .fs-root h4 { font-family: 'Playfair Display', Georgia, serif !important; }

        .fs-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 13px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 1.25rem;
        }
        .fs-chip-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #111827;
          flex-shrink: 0;
        }
      `}</style>

      <section
        className={`fs-root relative transition-all duration-300 ${isSelected ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white' : ''}`}
        style={{
          background,
          padding: styles.padding || '4rem 0 md:5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle dot grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
          pointerEvents: 'none',
        }} />

        {/* Very soft top-right blob */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, #f0f9ff 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── BG Color Picker — top-right corner, edit mode only ── */}
        {isEditing && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 50 }}>
            {/* Swatch button */}
            <button
              title="Change section background color"
              onClick={(e) => { e.stopPropagation(); setShowBgPicker(p => !p); }}
              style={{
                width: '28px', height: '28px',
                borderRadius: '8px',
                border: '1.5px solid rgba(0,0,0,0.15)',
                background: background,
                cursor: 'pointer',
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow, 0 2px 6px rgba(0,0,0,0.15))',
                transition: 'transform var(--animation-speed, 0.15s)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Checkerboard so it's visible on white */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%)',
                backgroundSize: '5px 5px',
                backgroundPosition: '0 0,0 2.5px,2.5px -2.5px,-2.5px 0',
                opacity: 0.18,
              }} />
              <span style={{ fontSize: '10px', lineHeight: 1, position: 'relative', zIndex: 1 }}>🎨</span>
            </button>

            {/* Picker dropdown */}
            {showBgPicker && (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '36px', right: 0,
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: 'var(--shadow, 0 8px 30px rgba(0,0,0,0.13))',
                  zIndex: 9999,
                  minWidth: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af' }}>
                  Section Background
                </p>

                {/* Preset swatches */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    '#ffffff', '#f8fafc', '#f1f5f9', '#f9fafb',
                    '#111827', '#0f172a', '#1e3a5f', '#065f46',
                    '#7c3aed', '#be123c', '#1d4ed8', '#000000',
                  ].map(color => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => {
                        if (onContentChange) onContentChange('__styles_backgroundColor', color);
                        setShowBgPicker(false);
                      }}
                      style={{
                        width: '28px', height: '28px',
                        borderRadius: '6px',
                        border: background === color ? '2px solid #3b82f6' : '1.5px solid #e5e7eb',
                        background: color,
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: background === color ? '0 0 0 2px #bfdbfe' : 'none',
                        transition: 'transform var(--animation-speed, 0.12s)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>

                {/* Color wheel + hex input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="color"
                    value={background.startsWith('#') && background.length === 7 ? background : '#ffffff'}
                    onChange={e => onContentChange && onContentChange('__styles_backgroundColor', e.target.value)}
                    style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid #e5e7eb', padding: '2px', cursor: 'pointer', background: 'none', flexShrink: 0 }}
                  />
                  <input
                    type="text"
                    value={background}
                    placeholder="#ffffff"
                    onChange={e => onContentChange && onContentChange('__styles_backgroundColor', e.target.value)}
                    style={{ flex: 1, padding: '5px 8px', border: '1px solid #e5e7eb', borderRadius: '7px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#111827', background: '#f9fafb', outline: 'none' }}
                  />
                </div>

                <button
                  onClick={() => setShowBgPicker(false)}
                  style={{ padding: '5px', borderRadius: '7px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '0.73rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 relative z-10">

          {/* ── Section Header ── */}
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem' }}>

            <div className="fs-chip">
              <span className="fs-chip-dot" />
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('chipText', e)}
              >
                {content.chipText || 'Features'}
              </span>
            </div>

            <h2
              style={{
                margin: '0 0 1rem',
                fontSize: 'clamp(1.9rem, 4vw, 2.9rem)',
                fontWeight: 900,
                color: headingColor,
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h2>

            <div style={{
              width: '40px', height: '3px',
              background: '#111827',
              borderRadius: '999px',
              margin: '0 auto 1.25rem',
            }} />

            <p
              style={{ margin: 0, fontSize: '1rem', lineHeight: 1.75, color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>
          </div>

          {/* ── Variant Renderer ── */}
          {variant === 'list'
            ? renderList(sharedProps)
            : variant === 'icons'
              ? renderIcons(sharedProps)
              : variant === 'cards'
                ? renderCards(sharedProps)
                : renderGrid(sharedProps)
          }
        </div>
      </section>
    </>
  );
}