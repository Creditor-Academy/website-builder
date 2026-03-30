import React from 'react';
import { ArrowUpRight, ChevronRight, ArrowRight } from 'lucide-react';
import { Editable } from '@/components/ui/Editable';
import { useBuilder } from '@/contexts/BuilderContext';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap');

  @keyframes sv-up  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes sv-in  { from { opacity:0; transform:scale(0.95);      } to { opacity:1; transform:scale(1);      } }
  @keyframes sv-bar { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .sv-ce:focus { outline: none; }
  .sv-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.2);
    cursor: text; padding-bottom: 1px;
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }
  .sv-ce[data-editing="true"]:focus { outline: none; }
  .sv-inv[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.3);
    cursor: text;
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }

  /* card */
  .sv-card { transition: transform 0.4s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.4s ease; }
  .sv-card:hover { transform: translateY(-8px); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18); }
  .sv-card-img { transition: transform 0.6s ease; }
  .sv-card:hover .sv-card-img { transform: scale(1.07); }
  .sv-card-body {
    transform: translateY(10px);
    transition: transform 0.4s ease;
  }
  .sv-card:hover .sv-card-body { transform: translateY(0); }
  .sv-card-desc {
    opacity: 0; max-height: 0; overflow: hidden;
    transition: opacity 0.35s ease, max-height 0.35s ease;
  }
  .sv-card:hover .sv-card-desc { opacity: 1; max-height: 120px; }

  /* list */
  .sv-list-row { transition: background 0.2s ease, padding 0.2s ease; }
  .sv-list-row:hover { background: rgba(0,0,0,0.02); }
  .sv-list-img { filter: grayscale(1); transition: filter 0.4s ease, transform 0.4s ease; }
  .sv-list-row:hover .sv-list-img { filter: grayscale(0); transform: scale(1.04); }
  .sv-arrow-btn {
    transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
    border: 1px solid rgba(0,0,0,0.12);
  }
  .sv-list-row:hover .sv-arrow-btn {
    background: #0f172a !important;
    border-color: #0f172a;
    color: #fff;
    transform: rotate(45deg);
  }

  /* grid */
  .sv-grid-item { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .sv-grid-item:hover { transform: translateY(-4px); box-shadow: 0 20px 48px -12px rgba(0,0,0,0.12); }
  .sv-grid-chevron { transition: transform 0.25s ease; }
  .sv-grid-item:hover .sv-grid-chevron { transform: translateX(5px); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('sv2-styles')) {
    const el = document.createElement('style');
    el.id = 'sv2-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── CE helper ────────────────────────────────────────────────────────────
function CE({ as: Tag = 'span' as any, value, onSave, isEditing, style, className = '', inv = false }: any) {
  return (
    <Editable
      as={Tag}
      className={`sv-ce ${inv ? 'sv-inv' : ''} ${className}`}
      isEditing={isEditing}
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onSave={onSave}
      value={value || ''}
    />
  );
}

const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706', '#0F766E'];

// ─── Section Header ───────────────────────────────────────────────────────
function Header({ content, isEditing, onContentChange, headingColor, paragraphColor }: any) {
  return (
    <div style={{ marginBottom: 80 }}>
      <CE
        as="h2" value={content.headline} isEditing={isEditing}
        onSave={(val) => onContentChange?.('headline', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(36px, 5vw, 72px)',
          fontWeight: 600, lineHeight: 1.0, letterSpacing: '-0.02em',
          fontStyle: 'italic',
          color: headingColor, marginBottom: 24, display: 'block',
          animation: 'sv-up 0.6s ease both',
        }}
      />

      <div style={{
        width: 48, height: 3, background: '#E11D48',
        marginBottom: 24, transformOrigin: 'left',
        animation: 'sv-bar 0.7s ease 0.1s both',
      }} />

      <CE
        as="p" value={content.subheadline} isEditing={isEditing}
        onSave={(val) => onContentChange?.('subheadline', val)}
        style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 18, lineHeight: 1.7,
          color: paragraphColor, opacity: 0.72,
          maxWidth: 560, display: 'block',
        }}
      />
    </div>
  );
}

// ─── VARIANT: cards  →  Tall Overlay Cards with Reveal ──────────────────────
function CardsVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, borderRadius }: any) {
  const updateService = (id, field, val) => {
    if (!isEditing || !onContentChange) return;
    onContentChange('services', content.services.map((s) => s.id === id ? { ...s, [field]: val } : s));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {content.services?.map((service, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <div
            key={service.id}
            className="sv-card"
            style={{
              position: 'relative', height: 400, overflow: 'hidden',
              borderRadius: borderRadius,
              animation: `sv-in 0.5s ease ${index * 0.08}s both`,
            }}
          >
            <img
              src={service.imageUrl} alt={service.title}
              className="sv-card-img"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(170deg, transparent 30%, rgba(0,0,0,0.92) 100%)`,
            }} />

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

            <div style={{
              position: 'absolute', top: 22, left: 22,
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 10, letterSpacing: '0.2em',
              color: 'rgba(255,255,255,0.45)',
            }}>
              {String(index + 1).padStart(2, '0')}
            </div>

            <div
              className="sv-card-body"
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 32px' }}
            >
              <CE
                as="h3" value={service.title} isEditing={isEditing} inv
                onSave={(val) => updateService(service.id, 'title', val)}
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: 26, fontWeight: 600, fontStyle: 'italic',
                  color: '#fff', marginBottom: 12, lineHeight: 1.2, display: 'block',
                }}
              />

              <div className="sv-card-desc">
                <CE
                  as="p" value={service.description} isEditing={isEditing} inv
                  onSave={(val) => updateService(service.id, 'description', val)}
                  style={{
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 14, lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.7)', marginBottom: 20, display: 'block',
                  }}
                />
                <a
                  href={service.link || '#'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#fff', textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 2,
                  }}
                >
                  <CE
                    as="span" value={service.linkText || 'Learn More'} isEditing={isEditing} inv
                    onSave={(val) => updateService(service.id, 'linkText', val)}
                  />
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── VARIANT: list  →  Editorial Divider List ──────────────────────────────
function ListVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, borderRadius }: any) {
  const updateService = (id, field, val) => {
    if (!isEditing || !onContentChange) return;
    onContentChange('services', content.services.map((s) => s.id === id ? { ...s, [field]: val } : s));
  };

  return (
    <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
      {content.services?.map((service, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <div
            key={service.id}
            className="sv-list-row flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{
              padding: '28px 16px',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 4,
              animation: `sv-up 0.5s ease ${index * 0.07}s both`,
            }}
          >
            <div className="w-full sm:w-[200px] flex-shrink-0" style={{ overflow: 'hidden', borderRadius: `calc(${borderRadius} * 0.5)`, height: 140 }}>
              <img
                src={service.imageUrl} alt={service.title}
                className="sv-list-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginBottom: 12,
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 10, letterSpacing: '0.2em', color: accent,
              }}>
                <div style={{ width: 16, height: 2, background: accent }} />
                SERVICE {String(index + 1).padStart(2, '0')}
              </div>

              <CE
                as="h3" value={service.title} isEditing={isEditing}
                onSave={(val) => updateService(service.id, 'title', val)}
                style={{
                  fontFamily: "'Newsreader', serif",
                  fontSize: 28, fontWeight: 600, fontStyle: 'italic',
                  color: headingColor, marginBottom: 10, lineHeight: 1.2, display: 'block',
                }}
              />
              <CE
                as="p" value={service.description} isEditing={isEditing}
                onSave={(val) => updateService(service.id, 'description', val)}
                style={{
                  fontFamily: "'Cabinet Grotesk', sans-serif",
                  fontSize: 15, lineHeight: 1.7,
                  color: paragraphColor, opacity: 0.72, display: 'block',
                }}
              />
            </div>

            <a
              href={service.link || '#'}
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-slate-900 border border-slate-200 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:rotate-45"
            >
              <ArrowUpRight size={20} />
            </a>
          </div>
        );
      })}
    </div>
  );
}

// ─── VARIANT: grid  →  Clean Bordered Feature Grid ──────────────────────────
function GridVariant({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, borderRadius }: any) {
  const updateService = (id, field, val) => {
    if (!isEditing || !onContentChange) return;
    onContentChange('services', content.services.map((s) => s.id === id ? { ...s, [field]: val } : s));
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 2,
    }}>
      {content.services?.map((service, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <div
            key={service.id}
            className="sv-grid-item"
            style={{
              background: styles.cardBackgroundColor || '#fafaf9',
              padding: '44px 36px',
              position: 'relative', overflow: 'hidden',
              animation: `sv-in 0.5s ease ${index * 0.06}s both`,
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: accent,
              transformOrigin: 'left',
              animation: `sv-bar 0.6s ease ${index * 0.07}s both`,
            }} />

            <div style={{
              width: 60, height: 60,
              borderRadius: `calc(${borderRadius} * 0.4)`,
              overflow: 'hidden', marginBottom: 28,
              background: `${accent}14`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {service.imageUrl ? (
                <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: "'Newsreader', serif", fontSize: 24, fontWeight: 700, color: accent }}>
                  {service.title?.[0] || 'S'}
                </span>
              )}
            </div>

            <CE
              as="h3" value={service.title} isEditing={isEditing}
              onSave={(val) => updateService(service.id, 'title', val)}
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 22, fontWeight: 600, fontStyle: 'italic',
                color: headingColor, marginBottom: 14, lineHeight: 1.2, display: 'block',
              }}
            />

            <CE
              as="p" value={service.description} isEditing={isEditing}
              onSave={(val) => updateService(service.id, 'description', val)}
              style={{
                fontFamily: "'Cabinet Grotesk', sans-serif",
                fontSize: 14, lineHeight: 1.7,
                color: paragraphColor, opacity: 0.7,
                marginBottom: 28, display: 'block',
              }}
            />

            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: accent,
            }}>
              <span>Explore</span>
              <ChevronRight size={14} className="sv-grid-chevron" />
            </div>

            <div style={{
              position: 'absolute', bottom: -30, right: -30,
              width: 100, height: 100, borderRadius: '50%',
              background: accent, opacity: 0.05,
              pointerEvents: 'none',
            }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function ServicesSection({ section, isSelected, isEditing, onContentChange, isAlternate }: any) {
  const { content, styles, variant = 'cards' } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #ffffff)'));

  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #475569)' : 'var(--theme-text, #475569)');
  const borderRadius = styles.borderRadius || '6px';

  const shared = { content, styles, isEditing, onContentChange, headingColor, paragraphColor, borderRadius };

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <section
      className={`relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${globalClasses}`}
      style={{
        background,
        padding: styles.padding || '60px 0',
        fontFamily: "'Cabinet Grotesk', sans-serif",
        position: 'relative',
      }}
    >
      <InjectStyles />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 92% 8%, rgba(225,29,72,0.04) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <Header
          content={content} isEditing={isEditing}
          onContentChange={onContentChange}
          headingColor={headingColor} paragraphColor={paragraphColor}
        />

        {variant === 'list'  && <ListVariant  {...shared} />}
        {variant === 'grid'  && <GridVariant  {...shared} />}
        {variant === 'cards' && <CardsVariant {...shared} />}
        {!['list','grid','cards'].includes(variant) && <CardsVariant {...shared} />}
      </div>
    </section>
  );
}