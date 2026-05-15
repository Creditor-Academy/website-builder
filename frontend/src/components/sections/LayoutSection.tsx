import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Edit, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Editable } from '@/components/ui/Editable';
import { sanitizeHTML } from '@/utils/sanitize';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Geist:wght@300;400;500;600&display=swap');

  @keyframes ly-up  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ly-in  { from { opacity:0; transform:scale(0.97);      } to { opacity:1; transform:scale(1);      } }
  @keyframes ly-bar { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .ly-sect * { box-sizing: border-box; }

  .ly-ce:focus { outline: none; }
  .ly-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px; min-width: 12px;
  }
  .ly-ce[data-editing="true"]:focus { outline: none; }

  /* Image hover overlay */
  .ly-img-wrap { position: relative; overflow: hidden; border-radius: 3px; }
  .ly-img-wrap img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.5s ease;
  }
  .ly-img-wrap:hover img { transform: scale(1.03); }
  .ly-img-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.42);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.22s ease;
    cursor: pointer;
  }
  .ly-img-wrap:hover .ly-img-overlay { opacity: 1; }

  /* Placeholder image box */
  .ly-img-placeholder {
    width: 100%; aspect-ratio: 4/3;
    background: #f1f5f9;
    border: 1px dashed rgba(0,0,0,0.15);
    border-radius: 3px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; cursor: pointer;
    transition: background 0.2s;
  }
  .ly-img-placeholder:hover { background: #e2e8f0; }

  /* Button */
  .ly-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Geist', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    background: var(--btn-bg, #0f172a) !important; color: var(--btn-color, #fff) !important;
    border: none;
    padding: 14px 28px; cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
    text-decoration: none;
    border-radius: var(--btn-radius, 6px) !important;
  }
  .ly-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  /* Editing badge */
  .ly-badge {
    position: absolute; top: 14px; left: 14px;
    font-family: 'Geist', sans-serif;
    font-size: 9px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    background: #E11D48; color: #fff;
    padding: 4px 10px; border-radius: 2px;
    z-index: 10;
  }

  /* Two-column divider */
  .ly-divider {
    width: 1px; background: rgba(0,0,0,0.08);
    align-self: stretch; flex-shrink: 0;
  }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('layout-section-styles')) {
    const el = document.createElement('style');
    el.id = 'layout-section-styles';
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
      className={`ly-ce ${className}`}
      isEditing={isEditing}
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onSave={onSave}
      value={value || ''}
      data-inv={inv ? 'true' : 'false'}
    />
  );
}

// ─── Micro label ──────────────────────────────────────────────────────────


// ─── Accent bar ───────────────────────────────────────────────────────────
function AccentBar({ center = false }: any) {
  return (
    <div style={{
      width: 32, height: 3, background: '#E11D48',
      margin: center ? '16px auto' : '16px 0',
      transformOrigin: 'left',
      animation: 'ly-bar 0.7s ease 0.1s both',
    }} />
  );
}

// ─── Image block ──────────────────────────────────────────────────────────
function ImageBlock({ content, section, isEditing, openMediaPicker, aspectRatio = '4/3' }: any) {
  if (!content.imageUrl) {
    return (
      <div
        className={isEditing ? 'ly-img-placeholder' : ''}
        style={!isEditing ? {
          width: '100%', aspectRatio,
          background: '#f1f5f9', borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        } : {}}
        onClick={isEditing ? () => openMediaPicker(section.id, 'imageUrl') : undefined}
      >
        <ImageIcon size={24} style={{ color: 'rgba(0,0,0,0.2)' }} />
        {isEditing && (
          <span style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 11, color: 'rgba(0,0,0,0.35)',
          }}>Click to add image</span>
        )}
      </div>
    );
  }

  return (
    <div
      className="ly-img-wrap"
      style={{ aspectRatio }}
      onClick={isEditing ? () => openMediaPicker(section.id, 'imageUrl') : undefined}
    >
      <img src={content.imageUrl} alt={content.imageAlt || ''} />
      {isEditing && (
        <div className="ly-img-overlay">
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Edit size={18} color="#fff" />
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANTS
// ──────────────────────────────────────────────────────────────────────────

function TextOnly({ content, isEditing, updateContent, styles }: any) { // Text-only layout variant
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <CE
        as="p" value={content.text || 'Click to edit this text…'} isEditing={isEditing}
        onSave={(val) => updateContent('text', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.8,
          fontStyle: 'italic', fontWeight: 400,
          color: styles.color || '#334155',
          display: 'block', animation: 'ly-up 0.5s ease both',
        }}
      />
    </div>
  );
}

function ImageTextLayout({ content, section, isEditing, updateContent, openMediaPicker, styles, imageRight = false }: any) { // Image-text layout variant (left/right)
  const textBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <CE
        as="h2" value={content.heading || 'Click to edit heading…'} isEditing={isEditing}
        onSave={(val) => updateContent('heading', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(28px, 3.5vw, 48px)',
          fontWeight: 700, fontStyle: 'italic',
          lineHeight: 1.1, letterSpacing: '-0.02em',
          color: styles.headingColor || '#0f172a',
          display: 'block', marginBottom: 0,
          animation: 'ly-up 0.5s ease both',
        }}
      />
      <AccentBar />
      <CE
        as="p" value={content.text || 'Click to edit this text…'} isEditing={isEditing}
        onSave={(val) => updateContent('text', val)}
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 16, lineHeight: 1.8,
          color: styles.paragraphColor || '#64748b',
          opacity: 0.8, display: 'block',
        }}
      />
    </div>
  );

  const imageBlock = (
    <ImageBlock content={content} section={section} isEditing={isEditing} openMediaPicker={openMediaPicker} />
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
      {imageRight ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
    </div>
  );
}

function TextButton({ content, isEditing, updateContent, styles }: any) { // Text-button layout variant
  const handleTextEdit = (field, e) => {
    updateContent(field, e.currentTarget.innerHTML);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
      <CE
        as="p" value={content.text || 'Click to edit this text…'} isEditing={isEditing}
        onSave={(val) => updateContent('text', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(17px, 2vw, 22px)', lineHeight: 1.8,
          fontStyle: 'italic', fontWeight: 400,
          color: styles.paragraphColor || '#475569',
          display: 'block', marginBottom: 36,
          animation: 'ly-up 0.5s ease both',
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          className="cta-btn-primary" 
          style={{ 
            background: styles.buttonBackgroundColor || '#0f172a', 
            color: styles.buttonTextColor || '#ffffff', 
            borderRadius: styles.buttonBorderRadius || '12px',
            padding: '14px 28px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Geist', sans-serif",
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          <Editable
            as="span"
            isEditing={isEditing} 
            value={content.buttonText || 'Get Started'} 
            onSave={(val) => handleTextEdit('buttonText', { currentTarget: { innerHTML: val } })}
            style={{ outline: 'none' }}
          />
          <ArrowRight width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

function HeadingTextButton({ content, isEditing, updateContent, styles }: any) { // Heading-text-button layout variant
  const handleTextEdit = (field, e) => {
    updateContent(field, e.currentTarget.innerHTML);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
      <CE
        as="h2" value={content.heading || 'Click to edit heading…'} isEditing={isEditing}
        onSave={(val) => updateContent('heading', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(30px, 4vw, 54px)',
          fontWeight: 700, fontStyle: 'italic',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          color: styles.headingColor || '#0f172a',
          display: 'block', marginBottom: 0,
          animation: 'ly-up 0.5s ease both',
        }}
      />
      <AccentBar center />
      <CE
        as="p" value={content.text || 'Click to edit this text…'} isEditing={isEditing}
        onSave={(val) => updateContent('text', val)}
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 16, lineHeight: 1.8,
          color: styles.paragraphColor || '#64748b',
          opacity: 0.78, display: 'block', marginBottom: 40,
        }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button 
          className="cta-btn-primary" 
          style={{ 
            background: styles.buttonBackgroundColor || '#0f172a', 
            color: styles.buttonTextColor || '#ffffff', 
            borderRadius: styles.buttonBorderRadius || '12px',
            padding: '14px 28px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Geist', sans-serif",
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          <Editable
            as="span"
            isEditing={isEditing} 
            value={content.buttonText || 'Get Started'} 
            onSave={(val) => handleTextEdit('buttonText', { currentTarget: { innerHTML: val } })}
            style={{ outline: 'none' }}
          />
          <ArrowRight width={16} height={16} />
        </button>
      </div>
    </div>
  );
}

function TwoColumn({ content, isEditing, updateContent, styles }: any) { // Two-column layout variant
  const cols = [
    { key: 'leftColumn',  label: '01' },
    { key: 'rightColumn', label: '02' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-5xl mx-auto items-start">
      {cols.map((col, i) => (
        <React.Fragment key={col.key}>
          <div style={{ animation: `ly-up 0.5s ease ${i * 0.08}s both` }}>
            {/* index */}
            <div style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: 10, letterSpacing: '0.2em',
              color: '#E11D48', marginBottom: 16,
            }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(col.label) }} />

            <CE
              as="h3" value={content[col.key]?.heading || 'Click to edit heading…'} isEditing={isEditing}
              onSave={(val) => updateContent(`${col.key}.heading`, val)}
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                fontWeight: 700, fontStyle: 'italic',
                lineHeight: 1.2, letterSpacing: '-0.015em',
                color: styles.headingColor || '#0f172a',
                display: 'block', marginBottom: 0,
              }}
            />

            <div style={{ width: 24, height: 2, background: '#E11D48', margin: '14px 0' }} />

            <CE
              as="p" value={content[col.key]?.text || 'Click to edit this text…'} isEditing={isEditing}
              onSave={(val) => updateContent(`${col.key}.text`, val)}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 15, lineHeight: 1.8,
                color: styles.paragraphColor || '#64748b',
                opacity: 0.78, display: 'block',
              }}
            />
          </div>

          {/* divider between columns only */}
          {i === 0 && <div className="hidden md:block" style={{ borderLeft: '1px solid rgba(0,0,0,0.08)', alignSelf: 'stretch' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────
export function LayoutSection({ section, isSelected, isEditing, onContentChange }: any) {
  const { openMediaPicker } = useBuilder();
  const { content, styles } = section;
  const variant = section.variant || 'text-only';

  const updateContent = (field, value) => onContentChange(field, value);

  const bg = styles.backgroundColor || styles.background || 'transparent';
  const shared = { content, isEditing, updateContent, styles, section, openMediaPicker };

  return (
    <section
      className="ly-sect"
      style={{
        background: bg,
        padding: styles.padding || '80px 0',
        position: 'relative',
        fontFamily: "'Geist', sans-serif",
        outline: isSelected ? '2px solid #E11D48' : 'none',
        outlineOffset: isSelected ? '3px' : '0',
      }}
    >
      <InjectStyles />

      {/* ambient texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 88% 8%, rgba(225,29,72,0.03) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.03) 0%, transparent 50%)',
      }} />

      {isEditing && <div className="ly-badge">Layout</div>}

      <div className="container mx-auto px-4 sm:px-6 relative">
        {variant === 'text-only'           && <TextOnly         {...shared} />} 
        {variant === 'image-text-left'     && <ImageTextLayout  {...shared} imageRight={false} />}          {variant === 'image-text-right'    && <ImageTextLayout  {...shared} imageRight={true}  />}
        {variant === 'text-button'         && <TextButton        {...shared} />}
        {variant === 'heading-text-button' && <HeadingTextButton {...shared} />} 
        {variant === 'two-column'          && <TwoColumn         {...shared} />} 
        {!['text-only','image-text-left','image-text-right','text-button','heading-text-button','two-column'].includes(variant)
          && <TextOnly {...shared} />} 
      </div>
    </section>
  );
}