import React from 'react';
import { Target, Eye, Heart, Award, Users } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';

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

function CE({ as: Tag = 'span' as any, value, onSave, isEditing, style, className = '', inv = false }: any) {
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

function MicroLabel({ text, light = false }: { text: string; light?: boolean }) {
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

function ImageBlock({ src, alt, isEditing, onContentChange, height = 480, borderRadius = '4px' }: { src: any; alt: any; isEditing: any; onContentChange: any; height?: string | number; borderRadius?: any }) {
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

// ─── VARIANT: split ──────────────────────────────────────────────────────────
function SplitVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const imgRight = content.imagePosition === 'right';

  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 min-h-[500px] lg:min-h-[580px]">
      {/* Content column */}
      <div className={`order-2 ${imgRight ? 'lg:order-1' : 'lg:order-2'} px-6 py-12 sm:px-10 lg:px-14 flex flex-col justify-center relative`}>
        <div className={`hidden lg:block absolute ${imgRight ? 'right-0' : 'left-0'} top-[10%] bottom-[10%] w-px bg-slate-200 pointer-events-none`} />

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
      <div className={`order-1 ${imgRight ? 'lg:order-2' : 'lg:order-1'} relative h-[350px] sm:h-[450px] lg:h-auto`}>
        <ImageBlock
          src={content.imageUrl} alt={content.imageAlt}
          isEditing={isEditing} onContentChange={onContentChange}
          height="100%" borderRadius="0"
        />
      </div>
    </div>
  );
}

// ─── VARIANT: centered ───────────────────────────────────────────────────────
function CenteredVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div>
        <div className="relative mb-12 lg:mb-20">
        <ImageBlock
          src={content.imageUrl} alt={content.imageAlt}
          isEditing={isEditing} onContentChange={onContentChange}
          height={320} borderRadius={styles.borderRadius || '4px'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-10 lg:p-14 flex flex-col items-center justify-end text-center">
          <Badge text={content.badge} isEditing={isEditing} onSave={(val) => onContentChange?.('badge', val)} />
          <CE
            as="h2" value={content.headline} isEditing={isEditing} inv
            onSave={(val) => onContentChange?.('headline', val)}
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontSize: 'clamp(24px, 4vw, 52px)',
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
          margin: '0 auto 48px', display: 'block',
        }}
        className="px-4"
      />

      {content.values?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
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

// ─── VARIANT: cards ──────────────────────────────────────────────────────────
function CardsVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateValue = (index, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.values.map((v, i) => i === index ? { ...v, [field]: val } : v);
    onContentChange('values', updated);
  };

  return (
    <div>
      <div className="max-w-2xl px-4 lg:px-0 mb-12 lg:mb-16">
        <MicroLabel text="about us" />
        <Badge text={content.badge} isEditing={isEditing} onSave={(val) => onContentChange?.('badge', val)} />
        <CE
          as="h2" value={content.headline} isEditing={isEditing}
          onSave={(val) => onContentChange?.('headline', val)}
          style={{
            fontFamily: "'Libre Baskerville', serif",
            fontSize: 'clamp(28px, 5vw, 54px)',
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

      <div className="flex flex-col lg:grid lg:grid-cols-5 bg-slate-900 rounded-xl overflow-hidden mb-6 min-h-[400px]">
        <div className="lg:col-span-3 relative h-[300px] lg:h-auto">
          <ImageBlock
            src={content.imageUrl} alt={content.imageAlt}
            isEditing={isEditing} onContentChange={onContentChange}
            height="100%" borderRadius="0"
          />
        </div>
        <div className="lg:col-span-2 p-8 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-900">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
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

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function AboutSection({ section, isSelected, isEditing, onContentChange, isAlternate }) {
  const { content, styles, variant = 'split' } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #ffffff)'));

  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #475569)' : 'var(--theme-text, #475569)');
  const shared = { content, styles, isEditing, onContentChange, headingColor, paragraphColor };

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <section
      style={{
        background,
        padding: styles.padding || '60px 0 lg:100px 0',
        fontFamily: "'Epilogue', sans-serif",
        position: 'relative',
        outline: isSelected ? '2px solid #D97706' : 'none',
        outlineOffset: isSelected ? '3px' : '0',
        transition: 'outline 0.2s ease',
      }}
      className={globalClasses}
    >
      <InjectStyles />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 85% 15%, rgba(217,119,6,0.05) 0%, transparent 55%), radial-gradient(ellipse at 10% 85%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />
      <div className="container mx-auto px-4 sm:px-6 relative">
        {variant === 'centered' && <CenteredVariant {...shared} />}
        {variant === 'cards'    && <CardsVariant    {...shared} />}
        {variant === 'split'    && <SplitVariant    {...shared} />}
        {!['centered','cards','split'].includes(variant) && <SplitVariant {...shared} />}
      </div>
    </section>
  );
}