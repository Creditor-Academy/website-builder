import React from 'react';
import { Mail, Phone, MapPin, Send, ArrowUpRight, Users, MessageSquare, Clock } from 'lucide-react';
import { Editable } from '@/components/ui/Editable';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,400;1,700&family=Geist:wght@300;400;500;600&display=swap');

  @keyframes ct-up  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ct-in  { from { opacity:0; transform:scale(0.97);      } to { opacity:1; transform:scale(1);      } }
  @keyframes ct-bar { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .ct-ce:focus { outline: none; }
  .ct-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px; min-width: 12px;
  }
  .ct-ce[data-editing="true"]:focus { outline: none; }
  .ct-inv[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.28);
    cursor: text; padding-bottom: 1px;
  }

  /* Form inputs */
  .ct-input {
    width: 100%; box-sizing: border-box;
    font-family: 'Geist', sans-serif;
    font-size: 14px; font-weight: 400;
    background: #fafaf9;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 3px;
    padding: 13px 16px;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease;
    resize: none;
  }
  .ct-input::placeholder { color: rgba(0,0,0,0.25); }
  .ct-input:focus {
    border-color: #E11D48;
    background: #fff;
  }

  /* Label */
  .ct-label {
    font-family: 'Geist', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(0,0,0,0.38);
    display: block; margin-bottom: 8px;
  }

  /* Submit button */
  .ct-submit {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Geist', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    border: none; border-radius: 3px;
    padding: 16px 32px; cursor: pointer; width: 100%;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .ct-submit:hover { opacity: 0.88; transform: translateY(-1px); }

  /* Contact info items */
  .ct-info-item {
    display: flex; gap: 18px; align-items: flex-start;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0,0,0,0.07);
    transition: padding-left 0.2s ease;
  }
  .ct-info-item:hover { padding-left: 4px; }
  .ct-info-item:last-child { border-bottom: none; }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('contact-section-styles')) {
    const el = document.createElement('style');
    el.id = 'contact-section-styles';
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
      className={`ct-ce ${inv ? 'ct-inv' : ''} ${className}`}
      isEditing={isEditing}
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onSave={onSave}
      value={value || ''}
    />
  );
}

// ─── Shared form ──────────────────────────────────────────────────────────
function ContactForm({ content, isEditing, onContentChange, buttonPrimaryBg, buttonPrimaryText }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <CE
            as="label" value={content.labelFirstName || 'First Name'} isEditing={isEditing}
            onSave={(val) => onContentChange?.('labelFirstName', val)}
            className="ct-label"
          />
          <input type="text" className="ct-input" placeholder="Jane" />
        </div>
        <div>
          <CE
            as="label" value={content.labelLastName || 'Last Name'} isEditing={isEditing}
            onSave={(val) => onContentChange?.('labelLastName', val)}
            className="ct-label"
          />
          <input type="text" className="ct-input" placeholder="Doe" />
        </div>
      </div>

      {/* Email */}
      <div>
        <CE
          as="label" value={content.labelEmail || 'Email'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('labelEmail', val)}
          className="ct-label"
        />
        <input type="email" className="ct-input" placeholder="jane@example.com" />
      </div>

      {/* Message */}
      <div>
        <CE
          as="label" value={content.labelMessage || 'Message'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('labelMessage', val)}
          className="ct-label"
        />
        <textarea rows={5} className="ct-input" placeholder="Tell us what's on your mind…" />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="ct-submit"
        style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
      >
        <Send size={14} />
        <CE
          as="span" value={content.buttonText || 'Send Message'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('buttonText', val)}
          inv={buttonPrimaryText === '#ffffff'}
        />
      </button>
    </div>
  );
}

// ─── Shared section header ────────────────────────────────────────────────
function ContactHeader({ content, isEditing, onContentChange, headingColor, paragraphColor, centered }) {
  return (
    <div style={{
      maxWidth: centered ? 600 : 520,
      margin: centered ? '0 auto' : '0',
      marginBottom: 48,
      textAlign: centered ? 'center' : 'left',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.3)', marginBottom: 16, pointerEvents: 'none',
      }}>
        <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.2)' }} />
        contact us
      </div>

      <CE
        as="h2" value={content.headline || 'Get In Touch'} isEditing={isEditing}
        onSave={(val) => onContentChange?.('headline', val)}
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 'clamp(28px, 5vw, 60px)',
          fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em',
          color: headingColor, display: 'block',
          animation: 'ct-up 0.6s ease both',
        }}
      />

      <div style={{
        width: 36, height: 3, background: '#E11D48',
        margin: centered ? '18px auto 18px' : '18px 0',
        transformOrigin: 'left', animation: 'ct-bar 0.7s ease 0.1s both',
      }} />

      <CE
        as="p" value={content.subheadline || "We'd love to hear from you."} isEditing={isEditing}
        onSave={(val) => onContentChange?.('subheadline', val)}
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 16, lineHeight: 1.75,
          color: paragraphColor, opacity: 0.7, display: 'block',
        }}
      />
    </div>
  );
}

// ─── Info items (used in split variant) ──────────────────────────────────
function InfoItems({ content, isEditing, onContentChange, headingColor, paragraphColor }) {
  // Use dynamic contact fields if available, otherwise fall back to legacy fields
  const contactFields = content.contactFields || [
    { field: 'labelEmailUs', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
    { field: 'labelCallUs', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
    { field: 'labelVisitUs', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' },
  ];

  const getIcon = (iconName) => {
    switch(iconName) {
      case 'Mail': return Mail;
      case 'Phone': return Phone;
      case 'MapPin': return MapPin;
      case 'Globe': return Users;
      case 'MessageSquare': return MessageSquare;
      case 'Clock': return Clock;
      default: return Mail;
    }
  };

  return (
    <div>
      {contactFields.map((field) => {
        const Icon = getIcon(field.icon);
        return (
          <div key={field.id || field.field} className="ct-info-item">
            {/* icon box */}
            <div style={{
              width: 44, height: 44, borderRadius: '3px', flexShrink: 0,
              background: `${field.accent}12`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: field.accent,
            }}>
              <Icon size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <CE
                as="h4" value={field.label} isEditing={isEditing}
                onSave={(val) => {
                  if (field.id) {
                    // Dynamic field - update in contactFields array
                    const updated = content.contactFields.map(x => 
                      x.id === field.id ? { ...x, label: val } : x
                    );
                    onContentChange('contactFields', updated);
                  } else {
                    // Legacy field - update directly
                    onContentChange(field.field, val);
                  }
                }}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600, fontSize: 12,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: field.accent, marginBottom: 5, display: 'block',
                }}
              />
              <CE
                as="p" value={field.value} isEditing={isEditing}
                onSave={(val) => {
                  if (field.id) {
                    // Dynamic field - update in contactFields array
                    const updated = content.contactFields.map(x => 
                      x.id === field.id ? { ...x, value: val } : x
                    );
                    onContentChange('contactFields', updated);
                  } else {
                    // Legacy field - update directly
                    const valueField = field.field.replace('label', '').toLowerCase();
                    onContentChange(valueField, val);
                  }
                }}
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18, fontWeight: 400,
                  color: headingColor, display: 'block', lineHeight: 1.3,
                }}
              />
            </div>

            <div style={{ alignSelf: 'center', color: 'rgba(0,0,0,0.18)' }}>
              <ArrowUpRight size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Form panel wrapper ───────────────────────────────────────────────────
function FormPanel({ content, isEditing, onContentChange, buttonPrimaryBg, buttonPrimaryText, dark = false }) {
  return (
    <div
      style={{
        background: dark ? '#0f172a' : '#fff',
        borderRadius: '4px',
        border: dark ? 'none' : '1px solid rgba(0,0,0,0.07)',
        animation: 'ct-in 0.6s ease 0.1s both',
      }}
      className="px-6 py-10 sm:p-10"
    >
      {dark && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
            Send us a message
          </div>
          <div style={{ width: 28, height: 2, background: '#E11D48' }} />
        </div>
      )}
      <ContactForm
        content={content} isEditing={isEditing}
        onContentChange={onContentChange}
        buttonPrimaryBg={dark ? '#E11D48' : buttonPrimaryBg}
        buttonPrimaryText={buttonPrimaryText}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: split  →  Info Left / Form Right
// ──────────────────────────────────────────────────────────────────────────
function SplitVariant({ content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText }) {
  return (
    <div>
      <ContactHeader content={content} isEditing={isEditing} onContentChange={onContentChange} headingColor={headingColor} paragraphColor={paragraphColor} centered={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        <InfoItems content={content} isEditing={isEditing} onContentChange={onContentChange} headingColor={headingColor} paragraphColor={paragraphColor} />
        <FormPanel content={content} isEditing={isEditing} onContentChange={onContentChange} buttonPrimaryBg={buttonPrimaryBg} buttonPrimaryText={buttonPrimaryText} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: centered  →  Centered Header + Single Form Card
// ──────────────────────────────────────────────────────────────────────────
function CenteredVariant({ content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText }) {
  return (
    <div>
      <ContactHeader content={content} isEditing={isEditing} onContentChange={onContentChange} headingColor={headingColor} paragraphColor={paragraphColor} centered />

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <FormPanel content={content} isEditing={isEditing} onContentChange={onContentChange} buttonPrimaryBg={buttonPrimaryBg} buttonPrimaryText={buttonPrimaryText} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: map  →  Dark Form Left / Map Right
// ──────────────────────────────────────────────────────────────────────────
function MapVariant({ content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText }) {
  return (
    <div>
      <ContactHeader content={content} isEditing={isEditing} onContentChange={onContentChange} headingColor={headingColor} paragraphColor={paragraphColor} centered={false} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Form — dark panel */}
        <FormPanel
          content={content} isEditing={isEditing}
          onContentChange={onContentChange}
          buttonPrimaryBg={buttonPrimaryBg} buttonPrimaryText={buttonPrimaryText}
          dark
        />

        {/* Map */}
        <div style={{
          borderRadius: '4px', overflow: 'hidden',
          background: '#e2e8f0',
          minHeight: 440,
          position: 'relative',
        }}>
          {content.mapEmbed ? (
            <iframe
              title="map"
              src={content.mapEmbed}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block', minHeight: 440 }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', minHeight: 440,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: '#f1f5f9',
            }}>
              <MapPin size={32} style={{ color: 'rgba(0,0,0,0.18)', marginBottom: 12 }} />
              <CE
                as="p" value={content.mapPlaceholder || 'Add a Map Embed URL in the Properties panel'} isEditing={isEditing}
                onSave={(val) => onContentChange?.('mapPlaceholder', val)}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 13, color: 'rgba(0,0,0,0.35)',
                  textAlign: 'center', maxWidth: 260, lineHeight: 1.6,
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────
export function ContactSection({ section, isSelected, isEditing, onContentChange }: any) {
  const { content, styles } = section;
  const variant = section.variant || 'split';
  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || '#fafaf8');
  const padding = styles.padding || '100px 0';

  const headingColor    = styles.headingColor    || '#0f172a';
  const paragraphColor  = styles.paragraphColor  || '#64748b';
  const buttonPrimaryBg = styles.buttonPrimaryBg || '#0f172a';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';

  const shared = { content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText };

  return (
    <section style={{
      background,
      padding: styles.padding || '60px 0 lg:100px 0',
      fontFamily: "'Geist', sans-serif",
      position: 'relative',
      outline: isSelected ? '2px solid #E11D48' : 'none',
      outlineOffset: isSelected ? '3px' : '0',
    }}>
      <InjectStyles />

      {/* ambient texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 90% 5%, rgba(225,29,72,0.04) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {variant === 'centered' && <CenteredVariant {...shared} />}
        {variant === 'map'      && <MapVariant      {...shared} />}
        {variant === 'split'    && <SplitVariant    {...shared} />}
        {!['centered','map','split'].includes(variant) && <SplitVariant {...shared} />}
      </div>
    </section>
  );
}