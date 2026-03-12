import React from 'react';
import { Target, Eye, Heart, Award, Users } from 'lucide-react';

const iconMap = { Target, Eye, Heart, Award, Users };

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Epilogue:wght@300;400;500;600&display=swap');

  @keyframes ab-up   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ab-in   { from { opacity:0; transform:scale(0.95);      } to { opacity:1; transform:scale(1);      } }
  @keyframes ab-line { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }
  @keyframes ab-img-pan { 0%,100% { transform:scale(1.04) translateY(0); } 50% { transform:scale(1.04) translateY(-8px); } }

  .ab-ce:focus { outline: none; }
  .ab-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.22);
    cursor: text;
    padding-bottom: 1px;
    min-width: 20px;
  }
  .ab-ce[data-editing="true"]:focus { outline: none; }
  .ab-inv[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.35);
    cursor: text;
    padding-bottom: 1px;
  }
  .ab-inv[data-editing="true"]:focus { outline: none; }

  .ab-val-item { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .ab-val-item:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.13); }

  .ab-img-wrap img { animation: ab-img-pan 8s ease-in-out infinite; }

  .ab-icon-wrap { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
  .ab-val-item:hover .ab-icon-wrap { transform: scale(1.15) rotate(-4deg); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('about-section-styles')) {
    const el = document.createElement('style');
    el.id = 'about-section-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

const ACCENTS = ['#D97706', '#0891B2', '#059669', '#7C3AED', '#DB2777'];

function getIcon(name, size = 20) {
  const IC = iconMap[name] || Target;
  return <IC size={size} />;
}

// ── Single reusable editable text component ──────────────────────────────
// Key fixes:
//  1. contentEditable must be the string "true"/"false", not a boolean
//  2. data-editing attr drives CSS, not [contenteditable] attr (more reliable)
//  3. pointerEvents explicitly set to 'auto' so parent overlays don't block
//  4. No animation on the element itself (animations break re-focus)
function CE({ as: Tag = 'span', value, onSave, isEditing, style, className = '', inv = false }) {
  const editing = !!isEditing;
  return (
    <Tag
      className={`ab-ce ${inv ? 'ab-inv' : ''} ${className}`}
      data-editing={editing ? 'true' : 'false'}
      contentEditable={editing ? 'true' : 'false'}
      suppressContentEditableWarning
      style={{
        ...style,
        pointerEvents: editing ? 'auto' : 'inherit',
        userSelect: editing ? 'text' : undefined,
        WebkitUserSelect: editing ? 'text' : undefined,
        cursor: editing ? 'text' : undefined,
      }}
      onBlur={editing && onSave ? (e) => onSave(e.currentTarget.innerHTML || '') : undefined}
      onClick={editing ? (e) => e.stopPropagation() : undefined}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}

function MicroLabel({ text, light }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: "'Epilogue', sans-serif",
      fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
      color: light ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.32)',
      marginBottom: 16, pointerEvents: 'none',
    }}>
      <div style={{ width: 22, height: 1, background: light ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.22)' }} />
      {text}
    </div>
  );
}

function Badge({ text, isEditing, onSave }) {
  if (!text) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <CE
        as="span" value={text} isEditing={isEditing} onSave={onSave}
        style={{
          display: 'inline-block',
          fontFamily: "'Epilogue', sans-serif",
          fontSize: 11, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#D97706',
          border: '1px solid rgba(217,119,6,0.3)',
          borderRadius: 2, padding: '5px 14px',
        }}
      />
    </div>
  );
}

function ImageBlock({ src, alt, isEditing, onContentChange, height = 480, borderRadius = '4px' }) {
  return (
    <div
      className="ab-img-wrap"
      style={{ borderRadius, overflow: 'hidden', height, position: 'relative' }}
    >
      <img src={src} alt={alt || 'About us'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, transparent 50%, rgba(0,0,0,0.38) 100%)', pointerEvents: 'none' }} />
      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const url = window.prompt('Enter image URL', src || 'https://');
            if (url !== null && onContentChange) onContentChange('imageUrl', url);
          }}
          style={{
            position: 'absolute', bottom: 16, right: 16, zIndex: 10,
            background: 'rgba(0,0,0,0.65)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 3, padding: '6px 14px',
            fontFamily: "'Epilogue',sans-serif", fontSize: 11,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Change Image
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: split
// ──────────────────────────────────────────────────────────────────────────
function SplitVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const imgRight = content.imagePosition === 'right';

  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: 580 }}>

      {/* Content column */}
      <div style={{
        order: imgRight ? 0 : 1,
        padding: '72px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          [imgRight ? 'right' : 'left']: 0,
          top: '10%', bottom: '10%', width: 1,
          background: 'rgba(0,0,0,0.08)', pointerEvents: 'none',
        }} />

        {/* <MicroLabel text="our story" /> */}
        <Badge text={content.badge} isEditing={isEditing} onSave={(val) => onContentChange?.('badge', val)} />

        <CE
          as="h2" value={content.headline} isEditing={isEditing}
          onSave={(val) => onContentChange?.('headline', val)}
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(30px, 3.5vw, 50px)',
            fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em',
            color: headingColor, marginBottom: 22, display: 'block',
          }}
        />

        <CE
          as="p" value={content.description} isEditing={isEditing}
          onSave={(val) => onContentChange?.('description', val)}
          style={{
            fontFamily: "'Epilogue', sans-serif",
            fontSize: 16, lineHeight: 1.8,
            color: paragraphColor, opacity: 0.78,
            marginBottom: 36, display: 'block',
          }}
        />

        {content.values?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {content.values.map((value, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <div key={value.id || index} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div className="ab-icon-wrap" style={{
                    width: 44, height: 44, borderRadius: '4px', flexShrink: 0,
                    background: `${accent}15`, border: `1px solid ${accent}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
                  }}>
                    {getIcon(value.icon, 18)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <CE
                      as="h4" value={value.title} isEditing={isEditing}
                      onSave={(val) => updateValue(index, 'title', val)}
                      style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 600, fontSize: 14, color: headingColor, marginBottom: 4, display: 'block' }}
                    />
                    <CE
                      as="p" value={value.description} isEditing={isEditing}
                      onSave={(val) => updateValue(index, 'description', val)}
                      style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 13, color: paragraphColor, opacity: 0.68, lineHeight: 1.6, display: 'block' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image column */}
      <div style={{ order: imgRight ? 1 : 0, position: 'relative', minHeight: 480 }}>
        <ImageBlock
          src={content.imageUrl} alt={content.imageAlt}
          isEditing={isEditing} onContentChange={onContentChange}
          height="100%" borderRadius="0"
        />
       
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: centered
// ──────────────────────────────────────────────────────────────────────────
function CenteredVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div>
      {/* Hero image */}
      <div style={{ position: 'relative', marginBottom: 72 }}>
        <ImageBlock
          src={content.imageUrl} alt={content.imageAlt}
          isEditing={isEditing} onContentChange={onContentChange}
          height={440} borderRadius={styles.borderRadius || '4px'}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
          padding: '48px 60px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}>
          <Badge text={content.badge} isEditing={isEditing} onSave={(val) => onContentChange?.('badge', val)} />
          <CE
            as="h2" value={content.headline} isEditing={isEditing} inv
            onSave={(val) => onContentChange?.('headline', val)}
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 'clamp(28px, 3.8vw, 52px)',
              fontWeight: 700, lineHeight: 1.1,
              color: '#fff', maxWidth: 700, display: 'block',
            }}
          />
        </div>
      </div>

      <CE
        as="p" value={content.description} isEditing={isEditing}
        onSave={(val) => onContentChange?.('description', val)}
        style={{
          fontFamily: "'Epilogue', sans-serif",
          fontSize: 18, lineHeight: 1.8,
          color: paragraphColor, opacity: 0.75,
          textAlign: 'center', maxWidth: 680,
          margin: '0 auto 64px', display: 'block',
        }}
      />

      {content.values?.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(content.values.length, 3)}, 1fr)`,
          gap: 2,
        }}>
          {content.values.map((value, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={value.id || index}
                className="ab-val-item"
                style={{
                  background: styles.cardBackgroundColor || '#fafaf8',
                  padding: '36px 32px', position: 'relative',
                }}
              >
                <div style={{ height: 3, background: accent, marginBottom: 28, pointerEvents: 'none' }} />
                <div className="ab-icon-wrap" style={{ width: 46, height: 46, borderRadius: '4px', background: `${accent}12`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {getIcon(value.icon, 20)}
                </div>
                <CE
                  as="h4" value={value.title} isEditing={isEditing}
                  onSave={(val) => updateValue(index, 'title', val)}
                  style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, fontSize: 16, color: headingColor, marginBottom: 8, display: 'block' }}
                />
                <CE
                  as="p" value={value.description} isEditing={isEditing}
                  onSave={(val) => updateValue(index, 'description', val)}
                  style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 13, color: paragraphColor, opacity: 0.7, lineHeight: 1.65, display: 'block' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: cards
// ──────────────────────────────────────────────────────────────────────────
function CardsVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div>
      <div style={{ maxWidth: 600, marginBottom: 64 }}>
        <MicroLabel text="about us" />
        <Badge text={content.badge} isEditing={isEditing} onSave={(val) => onContentChange?.('badge', val)} />
        <CE
          as="h2" value={content.headline} isEditing={isEditing}
          onSave={(val) => onContentChange?.('headline', val)}
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(32px, 4vw, 54px)',
            fontWeight: 700, lineHeight: 1.1,
            color: headingColor, marginBottom: 18, display: 'block',
          }}
        />
        <CE
          as="p" value={content.description} isEditing={isEditing}
          onSave={(val) => onContentChange?.('description', val)}
          style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 16, lineHeight: 1.8, color: paragraphColor, opacity: 0.75, display: 'block' }}
        />
      </div>

      {/* Story panel */}
      <div style={{
        display: 'grid', gridTemplateColumns: '3fr 2fr',
        background: '#0f172a',
        borderRadius: styles.borderRadius || '4px',
        overflow: 'hidden', marginBottom: 24, minHeight: 320,
      }}>
        <div style={{ position: 'relative' }}>
          <ImageBlock
            src={content.imageUrl} alt={content.imageAlt}
            isEditing={isEditing} onContentChange={onContentChange}
            height="100%" borderRadius="0"
          />
        </div>
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 2, background: '#D97706', marginBottom: 24, pointerEvents: 'none' }} />
          <CE
            as="h3" value={content.storyTitle || 'Our Story'} isEditing={isEditing} inv
            onSave={(val) => onContentChange?.('storyTitle', val)}
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 22, fontWeight: 700,
              color: '#f8fafc', marginBottom: 16, lineHeight: 1.25, display: 'block',
            }}
          />
          <CE
            as="p" value={content.storyContent || content.description} isEditing={isEditing} inv
            onSave={(val) => onContentChange?.('storyContent', val)}
            style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 14, color: 'rgba(248,250,252,0.65)', lineHeight: 1.75, display: 'block' }}
          />
        </div>
      </div>

      {content.values?.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(content.values.length, 4)}, 1fr)`,
          gap: 2,
        }}>
          {content.values.map((value, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={value.id || index}
                className="ab-val-item"
                style={{
                  background: '#fff', border: '1px solid rgba(0,0,0,0.07)',
                  padding: '30px 24px', position: 'relative',
                }}
              >
                <div className="ab-icon-wrap" style={{ width: 42, height: 42, borderRadius: 3, background: `${accent}12`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {getIcon(value.icon, 18)}
                </div>
                <CE
                  as="h4" value={value.title} isEditing={isEditing}
                  onSave={(val) => updateValue(index, 'title', val)}
                  style={{ fontFamily: "'Epilogue', sans-serif", fontWeight: 600, fontSize: 14, color: headingColor, marginBottom: 6, display: 'block' }}
                />
                <CE
                  as="p" value={value.description} isEditing={isEditing}
                  onSave={(val) => updateValue(index, 'description', val)}
                  style={{ fontFamily: "'Epilogue', sans-serif", fontSize: 12, color: paragraphColor, opacity: 0.68, lineHeight: 1.65, display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: accent, pointerEvents: 'none' }} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────
export function AboutSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'split' } = section;

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || '#ffffff');

  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#475569';
  const shared = { content, styles, isEditing, onContentChange, headingColor, paragraphColor };

  return (
    <section
      style={{
        background,
        padding: styles.padding || '100px 0',
        fontFamily: "'Epilogue', sans-serif",
        position: 'relative',
        outline: isSelected ? '2px solid #D97706' : 'none',
        outlineOffset: isSelected ? '3px' : '0',
        transition: 'outline 0.2s ease',
      }}
    >
      <InjectStyles />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 85% 15%, rgba(217,119,6,0.05) 0%, transparent 55%), radial-gradient(ellipse at 10% 85%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', position: 'relative' }}>
        {variant === 'centered' && <CenteredVariant {...shared} />}
        {variant === 'cards'    && <CardsVariant    {...shared} />}
        {variant === 'split'    && <SplitVariant    {...shared} />}
        {!['centered','cards','split'].includes(variant) && <SplitVariant {...shared} />}
      </div>
    </section>
  );
}