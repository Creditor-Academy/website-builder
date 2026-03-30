import { Quote, Star } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Editable } from '@/components/ui/Editable';

// ─── Global styles injected once ──────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Syne:wght@400;500;700&display=swap');

  @keyframes t-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes t-scale-in {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes t-line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes t-float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes t-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .t-ce:focus { outline: none; }
  .t-ce[contenteditable="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text;
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }
  .t-ce-light[contenteditable="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.3);
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }

  .t-card-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .t-card-hover:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px -12px rgba(0,0,0,0.14);
  }

  .t-carousel-track {
    display: flex;
    animation: t-marquee 32s linear infinite;
  }
  .t-carousel-track:hover {
    animation-play-state: paused;
  }

  .t-hide-scroll::-webkit-scrollbar { display: none; }
  .t-hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('testimonials-styles')) {
    const el = document.createElement('style');
    el.id = 'testimonials-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── Shared editable wrappers ──────────────────────────────────────────────
function EditEl({ as: Tag = 'span', value, onBlur, isEditing, style, className, lightMode }: any) {
  return (
    <Tag
      className={`t-ce ${lightMode ? 't-ce-light' : ''} ${className || ''}`}
      style={style}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={isEditing ? (e) => onBlur(e.currentTarget.innerHTML || '') : undefined}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}

function starRow(rating = 5) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          style={{
            color: i < rating ? '#F59E0B' : 'rgba(0,0,0,0.12)',
            fill: i < rating ? '#F59E0B' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}

function avatarStyle(borderRadius: any, size = 44): React.CSSProperties {
  return {
    width: size,
    height: size,
    objectFit: 'cover',
    borderRadius: borderRadius ? `calc(${borderRadius} * 0.5)` : '50%',
    flexShrink: 0,
  };
}

// ─── Section label component ──────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: "'Syne', sans-serif",
      fontSize: 10, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: '#94a3b8',
      marginBottom: 20,
    }}>
      <div style={{ width: 20, height: 1, background: '#94a3b8' }} />
      {text}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: cards  →  Luxury Editorial Grid
// ──────────────────────────────────────────────────────────────────────────
function CardsVariant({ testimonials, content, styles, isEditing, onContentChange, background, padding, headingColor, paragraphColor }: any) {
  const updateT = (t, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.testimonials.map((test) =>
      test.id === t.id ? { ...test, [field]: val } : test
    );
    onContentChange('testimonials', updated);
  };

  return (
    <section style={{ background: background || '#fafaf8', padding, fontFamily: "'Syne', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <InjectStyles />

      {/* background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.05) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">

        {/* Header */}
        <div style={{ maxWidth: 600, marginBottom: 64 }}>
          <SectionLabel text="testimonials" />
          <Editable
            as="h2"
            className="t-ce"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4.5vw, 58px)',
              fontWeight: 600, lineHeight: 1.1,
              color: headingColor, marginBottom: 16,
              animation: 't-fade-up 0.6s ease both',
            }}
            isEditing={isEditing}
            value={content.headline || 'What Our Clients Say'}
            onSave={(val) => onContentChange?.('headline', val)}
          />
          <Editable
            as="p"
            className="t-ce"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15, lineHeight: 1.7,
              color: paragraphColor, opacity: 0.75,
              animation: 't-fade-up 0.6s ease 0.1s both',
            }}
            isEditing={isEditing}
            value={content.subheadline || 'Trusted by thousands of happy customers worldwide'}
            onSave={(val) => onContentChange?.('subheadline', val)}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.id || index}
              className="t-card-hover"
              style={{
                background: styles.cardBackgroundColor || '#ffffff',
                borderRadius: styles.borderRadius || 'var(--radius, 4px)',
                padding: '40px 36px',
                border: '1px solid rgba(0,0,0,0.07)',
                position: 'relative',
                animation: `t-scale-in 0.5s ease ${index * 0.07}s both`,
              }}
            >
              {/* accent top line */}
              <div style={{
                position: 'absolute', top: 0, left: 36, right: 36,
                height: 2,
                background: index % 3 === 0 ? '#F59E0B' : index % 3 === 1 ? '#6366f1' : '#10b981',
                borderRadius: '0 0 2px 2px',
                transformOrigin: 'left',
                animation: `t-line-grow 0.6s ease ${index * 0.1}s both`,
              }} />

              {/* quote icon */}
              <div style={{ marginBottom: 20 }}>
                <Quote size={28} style={{ color: 'rgba(0,0,0,0.08)' }} />
              </div>

              {starRow(t.rating || 5)}

              {/* quote text */}
              <Editable
                as="p"
                className="t-ce"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, lineHeight: 1.65,
                  color: paragraphColor || '#374151',
                  marginBottom: 32, fontStyle: 'italic',
                }}
                isEditing={isEditing}
                value={t.quote ? `"${t.quote}"` : '""'}
                onSave={(val) => {
                  updateT(t, 'quote', val.replace(/^"|"$/g, ''));
                }}
              />

              {/* author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={t.avatar} alt={t.name} style={avatarStyle(styles.borderRadius)} />
                <div>
                  <Editable
                    className="t-ce"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: 13,
                      color: headingColor || '#0f172a', letterSpacing: '0.05em',
                    }}
                    isEditing={isEditing}
                    value={t.name || ''}
                    onSave={(val) => updateT(t, 'name', val)}
                  />
                  <Editable
                    className="t-ce"
                    style={{ fontSize: 12, color: paragraphColor || '#64748b', marginTop: 2, letterSpacing: '0.04em' }}
                    isEditing={isEditing}
                    value={t.role || ''}
                    onSave={(val) => updateT(t, 'role', val)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: carousel  →  Infinite Dark Marquee
// ──────────────────────────────────────────────────────────────────────────
function CarouselVariant({ testimonials, content, styles, isEditing, onContentChange, background, padding, headingColor, paragraphColor }: any) {
  const updateT = (t, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.testimonials.map((test) =>
      test.id === t.id ? { ...test, [field]: val } : test
    );
    onContentChange('testimonials', updated);
  };

  const doubled = [...testimonials, ...testimonials]; // for seamless marquee

  return (
    <section style={{ background: background || '#09090b', padding, fontFamily: "'Syne', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <InjectStyles />

      {/* edge fades */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 160, zIndex: 2,
        background: `linear-gradient(to right, ${background || '#09090b'}, transparent)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 160, zIndex: 2,
        background: `linear-gradient(to left, ${background || '#09090b'}, transparent)`,
        pointerEvents: 'none',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <SectionLabel text="testimonials" />
          <Editable
            as="h2"
            className="t-ce t-ce-light"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(36px, 4.5vw, 60px)',
              fontWeight: 600, lineHeight: 1.1,
              color: headingColor || '#f8fafc', marginBottom: 16,
            }}
            isEditing={isEditing}
            value={content.headline || 'What Our Clients Say'}
            onSave={(val) => onContentChange?.('headline', val)}
          />
          <Editable
            as="p"
            className="t-ce t-ce-light"
            style={{ fontSize: 15, color: paragraphColor || '#94a3b8', lineHeight: 1.7 }}
            isEditing={isEditing}
            value={content.subheadline || 'Trusted by thousands of happy customers worldwide'}
            onSave={(val) => onContentChange?.('subheadline', val)}
          />
        </div>
      </div>

      {/* Scrolling track — full bleed */}
      <div style={{ overflow: 'hidden', width: '100%' }}>
        {isEditing ? (
          // In editing mode, show static row
          <div style={{ display: 'flex', gap: 20, padding: '0 1rem', overflowX: 'auto' }} className="t-hide-scroll">
            {testimonials.map((t, i) => (
              <CarouselCard key={t.id || i} t={t} i={i} styles={styles} isEditing={isEditing} updateT={updateT} paragraphColor={paragraphColor} headingColor={headingColor} />
            ))}
          </div>
        ) : (
          <div className="t-carousel-track" style={{ gap: 20 }}>
            {doubled.map((t, i) => (
              <CarouselCard key={`${t.id || i}-${i}`} t={t} i={i} styles={styles} isEditing={isEditing} updateT={updateT} paragraphColor={paragraphColor} headingColor={headingColor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CarouselCard({ t, i, styles, isEditing, updateT, paragraphColor, headingColor }: any) {
  return (
    <div style={{
      minWidth: 320, maxWidth: 320,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: styles.borderRadius || 'var(--radius, 4px)',
      padding: '32px 28px',
      flexShrink: 0,
    }}>
      <Quote size={22} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 16 }} />
      <Editable
        as="p"
        className="t-ce t-ce-light"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18, lineHeight: 1.65, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.75)', marginBottom: 24,
        }}
        isEditing={isEditing}
        value={t.quote ? `"${t.quote}"` : '""'}
        onSave={(val) => updateT(t, 'quote', val.replace(/^"|"$/g, ''))}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={t.avatar} alt={t.name} style={avatarStyle(styles.borderRadius, 38)} />
        <div>
          <Editable
            className="t-ce t-ce-light"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, color: '#f1f5f9', letterSpacing: '0.06em' }}
            isEditing={isEditing}
            value={t.name || ''}
            onSave={(val) => updateT(t, 'name', val)}
          />
          <Editable
            className="t-ce t-ce-light"
            style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 2, letterSpacing: '0.04em' }}
            isEditing={isEditing}
            value={t.role || ''}
            onSave={(val) => updateT(t, 'role', val)}
          />
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: quote  →  Cinematic Full-Bleed Pull Quote
// ──────────────────────────────────────────────────────────────────────────
function QuoteVariant({ testimonials, content, styles, isEditing, onContentChange, background, padding, headingColor, paragraphColor }: any) {
  const t = testimonials[0] || {};
  const updateT = (field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.testimonials.map((test) =>
      test.id === t.id ? { ...test, [field]: val } : test
    );
    onContentChange('testimonials', updated);
  };

  return (
    <section style={{ background: background || '#0f0f0f', padding, fontFamily: "'Syne', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <InjectStyles />

      {/* decorative giant quotemark */}
      <div style={{
        position: 'absolute', top: '-5%', left: '3%',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '35vw', fontWeight: 600, lineHeight: 1,
        color: 'rgba(255,255,255,0.025)',
        userSelect: 'none', pointerEvents: 'none',
      }}>
        "
      </div>

      <div style={{
        maxWidth: 860, margin: '0 auto', padding: '0 48px',
        position: 'relative', textAlign: 'center',
      }}>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 40 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
          ))}
        </div>

        {/* Quote */}
        <Editable
          as="blockquote"
          className="t-ce t-ce-light"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(28px, 4vw, 52px)',
            fontWeight: 400, fontStyle: 'italic',
            lineHeight: 1.35,
            color: headingColor || '#f8fafc',
            marginBottom: 48,
            animation: 't-fade-up 0.7s ease both',
          }}
          isEditing={isEditing}
          value={t.quote ? `"${t.quote}"` : '""'}
          onSave={(val) => updateT('quote', val.replace(/^"|"$/g, ''))}
        />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          <img src={t.avatar} alt={t.name} style={{ ...avatarStyle(styles.borderRadius, 48), animation: 't-float 3s ease-in-out infinite' }} />
          <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Name & role */}
        <Editable
          as="p"
          className="t-ce t-ce-light"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', color: headingColor || '#f8fafc', marginBottom: 6 }}
          isEditing={isEditing}
          value={t.name || ''}
          onSave={(val) => updateT('name', val)}
        />
        <Editable
          as="p"
          className="t-ce t-ce-light"
          style={{ fontSize: 12, letterSpacing: '0.08em', color: paragraphColor || '#94a3b8' }}
          isEditing={isEditing}
          value={t.role || ''}
          onSave={(val) => updateT('role', val)}
        />
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: minimal  →  Refined Left-Spine Layout
// ──────────────────────────────────────────────────────────────────────────
function MinimalVariant({ testimonials, content, styles, isEditing, onContentChange, background, padding, headingColor, paragraphColor }: any) {
  const updateT = (t, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.testimonials.map((test) =>
      test.id === t.id ? { ...test, [field]: val } : test
    );
    onContentChange('testimonials', updated);
  };

  const accents = ['#F59E0B', '#6366f1', '#10b981', '#ef4444'];

  return (
    <section style={{ background: background || '#fafaf9', padding, fontFamily: "'Syne', sans-serif", position: 'relative' }}>
      <InjectStyles />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 48px' }}>

        {/* Header — left aligned */}
        <div style={{ marginBottom: 72, maxWidth: 540 }}>
          <SectionLabel text="testimonials" />
          <Editable
            as="h2"
            className="t-ce"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 600, lineHeight: 1.1,
              color: headingColor, marginBottom: 14,
              animation: 't-fade-up 0.5s ease both',
            }}
            isEditing={isEditing}
            value={content.headline || 'What Our Clients Say'}
            onSave={(val) => onContentChange?.('headline', val)}
          />
          <Editable
            as="p"
            className="t-ce"
            style={{ fontSize: 15, color: paragraphColor, lineHeight: 1.7, opacity: 0.75 }}
            isEditing={isEditing}
            value={content.subheadline || 'Trusted by thousands of happy customers worldwide'}
            onSave={(val) => onContentChange?.('subheadline', val)}
          />
        </div>

        {/* Testimonials — indexed list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {testimonials.map((t, index) => {
            const accent = accents[index % accents.length];
            return (
              <div
                key={t.id || index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr',
                  gap: '0 32px',
                  paddingBottom: 48,
                  marginBottom: 48,
                  borderBottom: index < testimonials.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                  animation: `t-fade-up 0.5s ease ${index * 0.08}s both`,
                }}
              >
                {/* Left gutter: accent bar + index */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 2, height: '100%', minHeight: 80, background: accent, borderRadius: 2 }} />
                </div>

                {/* Content */}
                <div>
                  {starRow(t.rating || 5)}
                  <Editable
                    as="p"
                    className="t-ce"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 22, lineHeight: 1.7,
                      fontStyle: 'italic',
                      color: paragraphColor || '#374151',
                      marginBottom: 24,
                    }}
                    isEditing={isEditing}
                    value={t.quote ? `"${t.quote}"` : '""'}
                    onSave={(val) => updateT(t, 'quote', val.replace(/^"|"$/g, ''))}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {t.avatar && (
                      <img src={t.avatar} alt={t.name} style={avatarStyle(styles.borderRadius, 40)} />
                    )}
                    <div>
                      <Editable
                        className="t-ce"
                        style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: headingColor || '#0f172a' }}
                        isEditing={isEditing}
                        value={t.name || ''}
                        onSave={(val) => updateT(t, 'name', val)}
                      />
                      <Editable
                        className="t-ce"
                        style={{ fontSize: 12, color: paragraphColor || '#64748b', marginTop: 3, letterSpacing: '0.04em' }}
                        isEditing={isEditing}
                        value={t.role || ''}
                        onSave={(val) => updateT(t, 'role', val)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export — identical prop API & logic
// ──────────────────────────────────────────────────────────────────────────
export function TestimonialsSection({ section, isSelected, isEditing, onContentChange, isAlternate }: any) {
  const { content, styles } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const testimonials = content.testimonials || [];
  const variant = section.variant || 'cards';
  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #ffffff)'));
  
  const padding = styles.padding || '60px 0';
  
  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #64748b)' : 'var(--theme-text, #64748b)');

  const shared = { testimonials, content, styles, isEditing, onContentChange, background, padding, headingColor, paragraphColor };

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <div className={globalClasses}>
      {variant === 'carousel' && <CarouselVariant {...shared} />}
      {variant === 'quote'    && <QuoteVariant {...shared} />}
      {variant === 'minimal'  && <MinimalVariant {...shared} />}
      {variant === 'cards'    && <CardsVariant {...shared} />}
      {!['carousel','quote','minimal','cards'].includes(variant) && <CardsVariant {...shared} />}
    </div>
  );
}