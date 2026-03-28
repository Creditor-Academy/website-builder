import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { Editable } from '@/components/ui/Editable';
import { useBuilder } from '@/contexts/BuilderContext';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,600;1,400;1,600&family=Geist:wght@300;400;500;600&display=swap');

  @keyframes fq-up  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fq-in  { from { opacity:0; } to { opacity:1; } }
  @keyframes fq-bar { from { transform:scaleX(0); } to { transform:scaleX(1); } }

  .fq-sect * { box-sizing: border-box; }

  .fq-ce:focus { outline: none; }
  .fq-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px; min-width: 12px;
  }
  .fq-ce[data-editing="true"]:focus { outline: none; }

  /* Accordion row */
  .fq-acc-row {
    border-bottom: 1px solid rgba(0,0,0,0.08);
    transition: background 0.18s ease;
  }
  .fq-acc-row:first-child { border-top: 1px solid rgba(0,0,0,0.08); }

  .fq-acc-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    gap: 20px; padding: 26px 0;
    background: none; border: none; cursor: pointer; text-align: left;
    transition: opacity 0.18s;
  }
  .fq-acc-btn:hover { opacity: 0.72; }

  .fq-acc-icon {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid rgba(0,0,0,0.12);
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.3s ease;
  }

  .fq-acc-body {
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease;
  }

  /* Grid cards */
  .fq-grid-card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 4px;
    padding: 32px 28px;
    position: relative; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.3s ease;
    animation: fq-in 0.5s ease both;
  }
  .fq-grid-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.09);
  }

  /* Tabs */
  .fq-tab-btn {
    font-family: 'Geist', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    padding: 10px 20px; border-radius: 2px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .fq-tab-btn.active  { background: #0f172a; color: #fff; border-color: #0f172a; }
  .fq-tab-btn.inactive { background: transparent; color: rgba(0,0,0,0.45); border-color: rgba(0,0,0,0.1); }
  .fq-tab-btn.inactive:hover { border-color: rgba(0,0,0,0.25); color: rgba(0,0,0,0.7); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('faq-section-styles')) {
    const el = document.createElement('style');
    el.id = 'faq-section-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── CE helper ────────────────────────────────────────────────────────────
function CE({ as: Tag = 'span' as any, value, onSave, isEditing, style, className = '' }: any) {
  return (
    <Editable
      as={Tag}
      className={`fq-ce ${className}`}
      isEditing={isEditing}
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onSave={onSave}
      value={value || ''}
    />
  );
}

const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706', '#0F766E'];

// ─── Shared section header ────────────────────────────────────────────────
function Header({ content, isEditing, onContentChange, headingColor, paragraphColor, centered = true }) {
  return (
    <div style={{
      maxWidth: 560,
      margin: centered ? '0 auto 72px' : '0 0 64px',
      textAlign: centered ? 'center' : 'left',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: "'Geist', sans-serif",
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.3)', marginBottom: 16,
      }}>
        {centered && <div style={{ width: 18, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
        {!centered && <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
        faq
        {centered && <div style={{ width: 18, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
      </div>

      <CE
        as="h2" value={content.headline || 'Frequently Asked Questions'} isEditing={isEditing}
        onSave={(val) => onContentChange?.('headline', val)}
        style={{
          fontFamily: "'Newsreader', serif",
          fontSize: 'clamp(30px, 4vw, 54px)',
          fontWeight: 600, fontStyle: 'italic',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          color: headingColor, display: 'block', marginBottom: 0,
          animation: 'fq-up 0.6s ease both',
        }}
      />

      <div style={{
        width: 36, height: 3, background: '#E11D48',
        margin: centered ? '18px auto' : '18px 0',
        transformOrigin: 'left', animation: 'fq-bar 0.7s ease 0.1s both',
      }} />

      <CE
        as="p" value={content.subheadline || ''} isEditing={isEditing}
        onSave={(val) => onContentChange?.('subheadline', val)}
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 15, lineHeight: 1.75,
          color: paragraphColor, opacity: 0.7, display: 'block',
        }}
      />
    </div>
  );
}

// ─── updateFaq helper ─────────────────────────────────────────────────────
function makeUpdater(content: any, onContentChange: any) {
  return (faq, field, val) => {
    if (!onContentChange) return;
    onContentChange('faqs', content.faqs.map(f => f.id === faq.id ? { ...f, [field]: val } : f));
  };
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: accordion (default) — Editorial left-border reveal
// ──────────────────────────────────────────────────────────────────────────
function AccordionVariant({ faqs, content, isEditing, onContentChange, headingColor, paragraphColor, openIndex, setOpenIndex }) {
  const update = makeUpdater(content, onContentChange);

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const accent = ACCENTS[index % ACCENTS.length];

        return (
          <div
            key={faq.id || index}
            className="fq-acc-row"
            style={{ animation: `fq-up 0.4s ease ${index * 0.05}s both` }}
          >
            <button
              className="fq-acc-btn"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flex: 1 }}>
                <span style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.16em',
                  color: isOpen ? accent : 'rgba(0,0,0,0.25)',
                  flexShrink: 0, paddingTop: 3,
                  transition: 'color 0.2s',
                  minWidth: 24,
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                <CE
                  as="span" value={faq.question} isEditing={isEditing}
                  onSave={(val) => update(faq, 'question', val)}
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: 19, fontWeight: isOpen ? 600 : 400,
                    fontStyle: isOpen ? 'italic' : 'normal',
                    color: isOpen ? headingColor : 'rgba(0,0,0,0.65)',
                    lineHeight: 1.35,
                    transition: 'color 0.2s, font-weight 0.2s',
                  }}
                />
              </div>

              <div
                className="fq-acc-icon"
                style={{
                  background: isOpen ? '#0f172a' : 'transparent',
                  borderColor: isOpen ? '#0f172a' : 'rgba(0,0,0,0.12)',
                }}
              >
                {isOpen
                  ? <Minus size={13} color="#fff" />
                  : <Plus size={13} color="rgba(0,0,0,0.45)" />
                }
              </div>
            </button>

            <div
              className="fq-acc-body"
              style={{ maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0 }}
            >
              <div style={{ paddingLeft: 44, paddingBottom: 28 }}>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{
                    width: 2, flexShrink: 0, background: accent, borderRadius: 1,
                    alignSelf: 'stretch', opacity: 0.6,
                  }} />
                  <CE
                    as="p" value={faq.answer} isEditing={isEditing}
                    onSave={(val) => update(faq, 'answer', val)}
                    style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 15, lineHeight: 1.8,
                      color: paragraphColor, opacity: 0.78,
                      display: 'block', margin: 0,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: grid — Bordered cards with index accent
// ──────────────────────────────────────────────────────────────────────────
function GridVariant({ faqs, content, isEditing, onContentChange, headingColor, paragraphColor }) {
  const update = makeUpdater(content, onContentChange);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 16,
    }}>
      {faqs.map((faq, idx) => {
        const accent = ACCENTS[idx % ACCENTS.length];
        return (
          <div
            key={faq.id || idx}
            className="fq-grid-card"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

            <div style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: accent, marginBottom: 16,
            }}>
              {String(idx + 1).padStart(2, '0')}
            </div>

            <CE
              as="h4" value={faq.question} isEditing={isEditing}
              onSave={(val) => update(faq, 'question', val)}
              style={{
                fontFamily: "'Newsreader', serif",
                fontSize: 18, fontWeight: 600, fontStyle: 'italic',
                color: headingColor, marginBottom: 14, display: 'block', lineHeight: 1.3,
              }}
            />

            <div style={{ width: 24, height: 2, background: accent, marginBottom: 14 }} />

            <CE
              as="p" value={faq.answer} isEditing={isEditing}
              onSave={(val) => update(faq, 'answer', val)}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 14, lineHeight: 1.75,
                color: paragraphColor, opacity: 0.72, display: 'block',
              }}
            />

            <div style={{
              position: 'absolute', bottom: -8, right: 14,
              fontFamily: "'Newsreader', serif",
              fontSize: 72, fontWeight: 700, lineHeight: 1,
              color: 'rgba(0,0,0,0.03)', pointerEvents: 'none',
            }}>
              ?
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: tabs — Category filter + answer list
// ──────────────────────────────────────────────────────────────────────────
function TabsVariant({ faqs, content, isEditing, onContentChange, headingColor, paragraphColor }) {
  const update = makeUpdater(content, onContentChange);
  const categories = Array.from(new Set((faqs as any[]).map(f => f.category || 'General')));
  const [active, setActive] = useState(categories[0] || 'General');
  const filtered = (faqs as any[]).filter(f => (f.category || 'General') === active);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`fq-tab-btn ${active === cat ? 'active' : 'inactive'}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((faq, idx) => {
          const accent = ACCENTS[idx % ACCENTS.length];
          return (
            <div
              key={faq.id || idx}
              style={{
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 4,
                padding: '28px 28px 28px 24px',
                display: 'flex', gap: 20,
                position: 'relative', overflow: 'hidden',
                animation: 'fq-in 0.3s ease both',
              }}
            >
              <div style={{ width: 3, flexShrink: 0, background: accent, borderRadius: 2, alignSelf: 'stretch' }} />

              <div style={{ flex: 1 }}>
                <CE
                  as="h4" value={faq.question} isEditing={isEditing}
                  onSave={(val) => update(faq, 'question', val)}
                  style={{
                    fontFamily: "'Newsreader', serif",
                    fontSize: 18, fontWeight: 600, fontStyle: 'italic',
                    color: headingColor, marginBottom: 10, display: 'block', lineHeight: 1.3,
                  }}
                />
                <CE
                  as="p" value={faq.answer} isEditing={isEditing}
                  onSave={(val) => update(faq, 'answer', val)}
                  style={{
                    fontFamily: "'Geist', sans-serif",
                    fontSize: 14, lineHeight: 1.75,
                    color: paragraphColor, opacity: 0.72, display: 'block', margin: 0,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function FAQSection({ section, isSelected, isEditing, onContentChange, isAlternate }) {
  const { content, styles } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const faqs = content.faqs || [];
  const [openIndex, setOpenIndex] = useState(0);

  const variant = section.variant || 'accordion';

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #f8fafc)'));

          const padding = styles.padding || '60px 0';
  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #64748b)' : 'var(--theme-text, #64748b)');

  const shared = { faqs, content, styles, isEditing, onContentChange, headingColor, paragraphColor, openIndex, setOpenIndex };

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <section
      className={`fq-sect relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${globalClasses}`}
      style={{ background, padding, fontFamily: "'Geist', sans-serif" }}
    >
      <InjectStyles />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 90% 5%, rgba(225,29,72,0.03) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.03) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">
        <Header
          content={content} isEditing={isEditing} onContentChange={onContentChange}
          headingColor={headingColor} paragraphColor={paragraphColor}
          centered={variant !== 'accordion'}
        />

        {variant === 'accordion' && <AccordionVariant {...shared} />}
        {variant === 'grid'      && <GridVariant      {...shared} />}
        {variant === 'tabs'      && <TabsVariant      {...shared} />}
        {!['accordion','grid','tabs'].includes(variant) && <AccordionVariant {...shared} />}
      </div>
    </section>
  );
}