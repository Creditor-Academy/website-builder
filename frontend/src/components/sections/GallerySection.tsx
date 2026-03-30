import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Editable } from '@/components/ui/Editable';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes gl-up  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gl-in  { from { opacity:0; transform:scale(0.96);      } to { opacity:1; transform:scale(1);      } }
  @keyframes gl-bar { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .gl-ce:focus { outline: none; }
  .gl-ce[data-editing="true"] {
    border-bottom: 1px dashed rgba(255,255,255,0.3);
    cursor: text; padding-bottom: 1px; min-width: 10px;
  }
  .gl-ce[data-editing="true"]:focus { outline: none; }
  .gl-ce-dark[data-editing="true"] {
    border-bottom: 1px dashed rgba(0,0,0,0.2);
    cursor: text;
  }

  /* Grid / Masonry image hover */
  .gl-item-img { transition: transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94); }
  .gl-item:hover .gl-item-img { transform: scale(1.07); }

  .gl-overlay {
    opacity: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%);
    transition: opacity 0.32s ease;
  }
  .gl-item:hover .gl-overlay { opacity: 1; }

  .gl-overlay-content {
    transform: translateY(10px);
    transition: transform 0.32s ease;
  }
  .gl-item:hover .gl-overlay-content { transform: translateY(0); }

  .gl-ext-btn {
    opacity: 0;
    transform: scale(0.8) rotate(-45deg);
    transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(8px);
  }
  .gl-item:hover .gl-ext-btn {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  .gl-ext-btn:hover { background: rgba(255,255,255,0.22) !important; }

  /* Carousel */
  .gl-car-item { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .gl-car-item:hover { transform: translateY(-5px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.25); }
  .gl-car-img { transition: transform 0.5s ease; }
  .gl-car-item:hover .gl-car-img { transform: scale(1.05); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('gallery-styles')) {
    const el = document.createElement('style');
    el.id = 'gallery-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── CE helper ────────────────────────────────────────────────────────────
function CE({ as: Tag = 'span' as any, value, onSave, isEditing, style, className = '', dark = false }: any) {
  return (
    <Editable
      as={Tag}
      className={`gl-ce ${dark ? 'gl-ce-dark' : ''} ${className}`}
      isEditing={isEditing}
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onSave={onSave}
      value={value || ''}
    />
  );
}

const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706', '#0F766E'];

// ── Shared overlay for grid/masonry items ─────────────────────────────────
function ItemOverlay({ image, index, isEditing, onContentChange, content }: any) {
  const updateImage = (field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.images.map((img) =>
      img.id === image.id ? { ...img, [field]: val } : img
    );
    onContentChange('images', updated);
  };
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div className="gl-overlay" style={{ position: 'absolute', inset: 0 }}>
      {/* accent top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 3, background: accent,
      }} />

      {/* external link btn */}
      <button
        className="gl-ext-btn"
        style={{
          position: 'absolute', top: 14, right: 14,
          width: 36, height: 36, borderRadius: '50%',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}
      >
        <ExternalLink size={15} />
      </button>

      {/* content */}
      <div className="gl-overlay-content" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
        {/* index */}
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9, letterSpacing: '0.2em', color: accent,
          marginBottom: 6,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <CE
          as="h4" value={image.title} isEditing={isEditing}
          onSave={(val) => updateImage('title', val)}
          style={{
            fontFamily: "'Cormorant', serif",
            fontSize: 18, fontWeight: 600, fontStyle: 'italic',
            color: '#fff', marginBottom: 4, display: 'block', lineHeight: 1.2,
          }}
        />
        <CE
          as="p" value={image.category} isEditing={isEditing}
          onSave={(val) => updateImage('category', val)}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: grid  →  Asymmetric Feature Grid
// ──────────────────────────────────────────────────────────────────────────
function GridVariant({ images, content, isEditing, onContentChange }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" style={{ gridAutoRows: '180px', gap: 6 }}>
      {images.map((image, index) => {
        const isFeatured = index % 5 === 0;
        return (
          <div
            key={image.id || index}
            className="gl-item"
            style={{
              position: 'relative', overflow: 'hidden',
              borderRadius: '3px',
              gridColumn: isFeatured ? 'span 2' : 'span 1',
              gridRow: isFeatured ? 'span 2' : 'span 1',
              animation: `gl-in 0.5s ease ${index * 0.06}s both`,
            }}
          >
            <img
              src={image.url}
              alt={image.title || `Gallery image ${index + 1}`}
              className="gl-item-img"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <ItemOverlay
              image={image} index={index}
              isEditing={isEditing} onContentChange={onContentChange} content={content}
            />
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: masonry  →  Editorial Masonry with Side Numbers
// ──────────────────────────────────────────────────────────────────────────
function MasonryVariant({ images, content, isEditing, onContentChange }: any) {
  return (
    <div style={{ columns: '2 180px', gap: 6 }}>
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className="gl-item"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '3px',
            marginBottom: 6,
            breakInside: 'avoid',
            animation: `gl-in 0.5s ease ${index * 0.05}s both`,
          }}
        >
          <img
            src={image.url}
            alt={image.title || `Gallery image ${index + 1}`}
            className="gl-item-img"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
          <ItemOverlay
            image={image} index={index}
            isEditing={isEditing} onContentChange={onContentChange} content={content}
          />
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: carousel  →  Dark Horizontal Film-Strip
// ──────────────────────────────────────────────────────────────────────────
function CarouselVariant({ images, content, isEditing, onContentChange }: any) {
  const updateImage = (image, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.images.map((img) =>
      img.id === image.id ? { ...img, [field]: val } : img
    );
    onContentChange('images', updated);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* edge fade left */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: 80, zIndex: 2,
        background: 'linear-gradient(to right, var(--gl-bg, #fff), transparent)',
        pointerEvents: 'none',
      }} />
      {/* edge fade right */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 80, zIndex: 2,
        background: 'linear-gradient(to left, var(--gl-bg, #fff), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'flex', gap: 16, overflowX: 'auto',
        paddingBottom: 12, paddingTop: 4,
        msOverflowStyle: 'none', scrollbarWidth: 'none',
      }}>
        {images.map((image, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div
              key={image.id || index}
              className="gl-car-item"
              style={{
                minWidth: 300, maxWidth: 300,
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0,
                background: '#0f172a',
                animation: `gl-in 0.5s ease ${index * 0.06}s both`,
              }}
            >
              {/* image */}
              <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                <img
                  src={image.url} alt={image.title}
                  className="gl-car-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* accent bottom line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: 3, background: accent,
                }} />
                {/* index */}
                <div style={{
                  position: 'absolute', top: 12, left: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 9, letterSpacing: '0.2em', color: accent,
                  background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: 2,
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* info */}
              <div style={{ padding: '18px 18px 20px' }}>
                <CE
                  as="h4" value={image.title} isEditing={isEditing}
                  onSave={(val) => updateImage(image, 'title', val)}
                  style={{
                    fontFamily: "'Cormorant', serif",
                    fontSize: 18, fontWeight: 600, fontStyle: 'italic',
                    color: '#f8fafc', marginBottom: 6, display: 'block', lineHeight: 1.2,
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 2, background: accent, flexShrink: 0 }} />
                  <CE
                    as="span" value={image.category} isEditing={isEditing}
                    onSave={(val) => updateImage(image, 'category', val)}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: accent,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────
export function GallerySection({ section, isSelected, isEditing, onContentChange }: any) {
  const { content, styles, variant = 'grid' } = section;
  const images = content.images || [];
  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || '#ffffff');

  const headingColor   = styles.headingColor   || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';

  const shared = { images, content, isEditing, onContentChange };

  return (
    <section
      style={{
        background,
        padding: styles.padding || '60px 0',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        outline: isSelected ? '2px solid #E11D48' : 'none',
        outlineOffset: isSelected ? '3px' : '0',
      }}
    >
      <InjectStyles />

      {/* ambient texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 88% 8%, rgba(225,29,72,0.04) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">

        {/* ── Header — left-aligned, asymmetric ──────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 500 }}>
            {/* micro label */}
            {/* <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.3)', marginBottom: 16, pointerEvents: 'none',
            }}>
              <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.2)' }} />
              portfolio
            </div> */}

            <CE
              as="h2" value={content.headline || 'Our Portfolio'} isEditing={isEditing} dark
              onSave={(val) => onContentChange?.('headline', val)}
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700, fontStyle: 'italic',
                lineHeight: 1.0, letterSpacing: '-0.01em',
                color: headingColor, display: 'block',
                animation: 'gl-up 0.6s ease both',
              }}
            />

            {/* accent bar */}
            <div style={{
              width: 40, height: 3, background: '#E11D48',
              margin: '18px 0',
              transformOrigin: 'left',
              animation: 'gl-bar 0.7s ease 0.1s both',
            }} />
          </div>

          <CE
            as="p" value={content.subheadline || 'A showcase of our finest work'} isEditing={isEditing} dark
            onSave={(val) => onContentChange?.('subheadline', val)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16, lineHeight: 1.75,
              color: paragraphColor, opacity: 0.7,
              maxWidth: 340, display: 'block',
              animation: 'gl-up 0.6s ease 0.08s both',
            }}
          />
        </div>

        {/* ── Variants ───────────────────────────────────────────── */}
        {variant === 'carousel' && <CarouselVariant {...shared} />}
        {variant === 'masonry'  && <MasonryVariant  {...shared} />}
        {variant === 'grid'     && <GridVariant     {...shared} />}
        {!['carousel','masonry','grid'].includes(variant) && <GridVariant {...shared} />}
      </div>
    </section>
  );
}