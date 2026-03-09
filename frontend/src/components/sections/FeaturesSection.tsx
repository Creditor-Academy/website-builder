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
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
    gap: '1.25rem',
  }}>
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
            borderRadius: styles.borderRadius || '16px',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
            cursor: 'default',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
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
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.title}
          </h3>

          <p
            style={{
              margin: '0 0 1.5rem',
              fontSize: '0.875rem',
              lineHeight: 1.75,
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
            transition: 'opacity 0.22s ease',
          }} />
        </div>
      );
    })}
  </div>
);

// ─── VARIANT: LIST ─────────────────────────────────────────────────────────────

const renderList = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div style={{ maxWidth: '700px', margin: '0 auto' }}>
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
          style={{
            display: 'flex',
            gap: '1.75rem',
            padding: '1.75rem 1.25rem',
            borderBottom: index < content.features.length - 1 ? `1px solid ${ACCENT_BORDER}` : 'none',
            borderRadius: '12px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '48px' }}>
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
              <div style={{
                width: '1px', flex: 1, marginTop: '10px',
                background: `linear-gradient(to bottom, ${ACCENT_BORDER}, transparent)`,
              }} />
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
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map(f => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
                onContentChange('features', updated);
              }}
            >
              {feature.title}
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: 1.75,
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
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', paddingTop: '8px',
            color: '#d1d5db',
            flexShrink: 0,
          }}>
            <Icons.ArrowRight width={16} height={16} />
          </div>
        </div>
      );
    })}
  </div>
);

// ─── VARIANT: ICONS ─────────────────────────────────────────────────────────────

const renderIcons = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: '1rem',
  }}>
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
            borderRadius: styles.borderRadius || '16px',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.07)';
            e.currentTarget.style.borderColor = '#d1d5db';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
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
  <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {content.features?.map((feature, index) => {
      const tag = TAG_COLORS[index % TAG_COLORS.length];
      return (
        <div
          key={feature.id}
          style={{
            display: 'flex',
            alignItems: 'stretch',
            background: '#ffffff',
            border: `1px solid ${ACCENT_BORDER}`,
            borderRadius: styles.borderRadius || '16px',
            overflow: 'hidden',
            transition: 'box-shadow 0.22s ease, border-color 0.22s ease, transform 0.22s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
            e.currentTarget.style.borderColor = ACCENT_BORDER;
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <div style={{
            width: '72px', flexShrink: 0,
            background: tag.bg,
            borderRight: `1px solid ${tag.border}`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', padding: '1.5rem 0',
          }}>
            <div style={{ color: tag.text }}>{getIcon(feature.icon, 22)}</div>
            <span style={{
              color: tag.text, fontSize: '0.65rem', fontWeight: 800,
              letterSpacing: '0.1em', writingMode: 'vertical-rl',
              textOrientation: 'mixed', transform: 'rotate(180deg)', opacity: 0.7,
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div style={{ flex: 1, padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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

          <div style={{
            width: '52px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#d1d5db', borderLeft: `1px solid ${ACCENT_BORDER}`,
          }}>
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
          padding: styles.padding || '5rem 0',
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

 

        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 2rem', position: 'relative', zIndex: 1,
        }}>

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