import React from 'react';
import { Linkedin, Twitter, Github } from 'lucide-react';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,700;0,900;1,300&family=Outfit:wght@300;400;500;600&display=swap');

  @keyframes tm-up   { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes tm-in   { from { opacity:0; transform:scale(0.94);      } to { opacity:1; transform:scale(1);      } }
  @keyframes tm-line { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .tm-ce:focus { outline: none; }
  .tm-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.2);
    cursor: text; padding-bottom: 1px; min-width: 10px;
  }
  .tm-ce[data-editing="true"]:focus { outline: none; }
  .tm-inv[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.3);
    cursor: text; padding-bottom: 1px;
  }

  /* Grid card */
  .tm-card { transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1); }
  .tm-card:hover { transform: translateY(-6px); }
  .tm-card-img { transition: transform 0.55s ease; }
  .tm-card:hover .tm-card-img { transform: scale(1.06); }
  .tm-card-overlay {
    opacity: 0; transition: opacity 0.3s ease;
    background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%);
  }
  .tm-card:hover .tm-card-overlay { opacity: 1; }
  .tm-social-links { transform: translateY(10px); transition: transform 0.3s ease 0.05s; }
  .tm-card:hover .tm-social-links { transform: translateY(0); }

  /* List row */
  .tm-list-row { transition: background 0.2s ease, padding-left 0.2s ease; }
  .tm-list-row:hover { background: rgba(0,0,0,0.025) !important; padding-left: 6px; }

  /* Carousel card */
  .tm-carousel-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .tm-carousel-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('team-section-styles')) {
    const el = document.createElement('style');
    el.id = 'team-section-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── CE helper ────────────────────────────────────────────────────────────
function CE({ as: Tag = 'span' as any, value, onSave, isEditing, style, className = '', inv = false }: any) {
  return (
    <Tag
      className={`tm-ce ${inv ? 'tm-inv' : ''} ${className}`}
      data-editing={isEditing ? 'true' : 'false'}
      contentEditable={isEditing ? 'true' : 'false'}
      suppressContentEditableWarning
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onBlur={isEditing && onSave ? (e) => onSave(e.currentTarget.innerHTML || '') : undefined}
      onClick={isEditing ? (e) => e.stopPropagation() : undefined}
      dangerouslySetInnerHTML={{ __html: value || '' }}
    />
  );
}


const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706', '#DB2777'];

function getSocialIcon(platform) {
  switch (platform) {
    case 'linkedin': return Linkedin;
    case 'twitter':  return Twitter;
    case 'github':   return Github;
    default:         return Linkedin;
  }
}

function MicroLabel({ text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontFamily: "'Outfit', sans-serif",
      fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase',
      color: 'rgba(0,0,0,0.3)', marginBottom: 16, pointerEvents: 'none',
    }}>
      <div style={{ width: 22, height: 1, background: 'rgba(0,0,0,0.2)' }} />
      {text}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: grid  →  Staggered Portrait Cards
// ──────────────────────────────────────────────────────────────────────────
function GridVariant({ members, content, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateMember = (member, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.members.map((m) => m.id === member.id ? { ...m, [field]: val } : m);
    onContentChange('members', updated);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ maxWidth: 560, marginBottom: 72 }}>
        <MicroLabel text="the team" />
        <CE
          as="h2" value={content.headline || 'Meet Our Team'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('headline', val)}
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(34px, 4.5vw, 60px)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: headingColor, marginBottom: 18, display: 'block',
          }}
        />
        <CE
          as="p" value={content.subheadline || 'The talented people behind our success'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('subheadline', val)}
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.75, color: paragraphColor, opacity: 0.72, display: 'block' }}
        />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 24,
      }}>
        {members.map((member, index) => {
          const accent = ACCENTS[index % ACCENTS.length];
          return (
            <div
              key={member.id || index}
              className="tm-card"
              style={{ animation: `tm-in 0.5s ease ${index * 0.07}s both` }}
            >
              {/* Portrait */}
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '4px', aspectRatio: '3/4', marginBottom: 20 }}>
                <img
                  src={member.avatar} alt={member.name}
                  className="tm-card-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* hover overlay */}
                <div className="tm-card-overlay" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px 20px' }}>
                  <div className="tm-social-links" style={{ display: 'flex', gap: 10 }}>
                    {(member.social || []).map((s, i) => {
                      const Icon = getSocialIcon(s.platform);
                      return (
                        <a key={i} href={s.url} style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'rgba(255,255,255,0.15)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', textDecoration: 'none',
                        }}>
                          <Icon size={15} />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* accent index badge */}
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 28, height: 28, borderRadius: '50%',
                  background: accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10, fontWeight: 600, color: '#fff',
                  pointerEvents: 'none',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Name & role */}
              <CE
                as="h4" value={member.name} isEditing={isEditing}
                onSave={(val) => updateMember(member, 'name', val)}
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18, fontWeight: 700, lineHeight: 1.2,
                  color: headingColor, marginBottom: 6, display: 'block',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 2, background: accent, flexShrink: 0 }} />
                <CE
                  as="span" value={member.role} isEditing={isEditing}
                  onSave={(val) => updateMember(member, 'role', val)}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12, fontWeight: 500,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: accent,
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

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: carousel  →  Dark Cinematic Scroll Row
// ──────────────────────────────────────────────────────────────────────────
function CarouselVariant({ members, content, isEditing, onContentChange, headingColor, paragraphColor, background }) {
  const updateMember = (member, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.members.map((m) => m.id === member.id ? { ...m, [field]: val } : m);
    onContentChange('members', updated);
  };

  return (
    <div>
      {/* Header — split layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
        <div style={{ maxWidth: 480 }}>
          <MicroLabel text="our people" />
          <CE
            as="h2" value={content.headline || 'Meet Our Team'} isEditing={isEditing}
            onSave={(val) => onContentChange?.('headline', val)}
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(32px, 4vw, 54px)',
              fontWeight: 900, lineHeight: 1.05,
              color: headingColor, display: 'block',
            }}
          />
        </div>
        <CE
          as="p" value={content.subheadline || 'The talented people behind our success'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('subheadline', val)}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15, lineHeight: 1.7,
            color: paragraphColor, opacity: 0.65,
            maxWidth: 320, display: 'block',
          }}
        />
      </div>

      {/* Scroll row */}
      <div style={{ overflowX: 'auto', paddingBottom: 16, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: 20, width: 'max-content' }}>
          {members.map((member, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={member.id || index}
                className="tm-carousel-card"
                style={{
                  width: 220,
                  background: '#0f172a',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  animation: `tm-in 0.5s ease ${index * 0.06}s both`,
                }}
              >
                {/* image */}
                <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={member.avatar} alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: accent }} />
                </div>

                {/* info */}
                <div style={{ padding: '20px 18px' }}>
                  <CE
                    as="h4" value={member.name} isEditing={isEditing} inv
                    onSave={(val) => updateMember(member, 'name', val)}
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 16, fontWeight: 700,
                      color: '#f8fafc', marginBottom: 6, display: 'block',
                    }}
                  />
                  <CE
                    as="span" value={member.role} isEditing={isEditing} inv
                    onSave={(val) => updateMember(member, 'role', val)}
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 11, fontWeight: 500,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: accent,
                    }}
                  />

                  {/* socials */}
                  {(member.social || []).length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      {(member.social || []).map((s, i) => {
                        const Icon = getSocialIcon(s.platform);
                        return (
                          <a key={i} href={s.url} style={{
                            width: 28, height: 28,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                          }}>
                            <Icon size={13} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// VARIANT: list  →  Magazine-Style Numbered Roster
// ──────────────────────────────────────────────────────────────────────────
function ListVariant({ members, content, isEditing, onContentChange, headingColor, paragraphColor }) {
  const updateMember = (member, field, val) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.members.map((m) => m.id === member.id ? { ...m, [field]: val } : m);
    onContentChange('members', updated);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 64, textAlign: 'center' }}>
        <MicroLabel text="our team" />
        <CE
          as="h2" value={content.headline || 'Meet Our Team'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('headline', val)}
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 900, lineHeight: 1.05,
            color: headingColor, marginBottom: 16, display: 'block',
          }}
        />
        <CE
          as="p" value={content.subheadline || 'The talented people behind our success'} isEditing={isEditing}
          onSave={(val) => onContentChange?.('subheadline', val)}
          style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.7, color: paragraphColor, opacity: 0.7, display: 'block' }}
        />
      </div>

      {/* Roster */}
      {members.map((member, index) => {
        const accent = ACCENTS[index % ACCENTS.length];
        return (
          <div
            key={member.id || index}
            className="tm-list-row flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6"
            style={{
              padding: '16px 0',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              animation: `tm-up 0.5s ease ${index * 0.06}s both`,
              borderRadius: 3,
            }}
          >
            {/* Ghost index */}
            <div style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 36, fontWeight: 900,
              color: 'rgba(0,0,0,0.06)',
              lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>
              {String(index + 1).padStart(2, '0')}
            </div>

            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: '4px',
              overflow: 'hidden', flexShrink: 0,
              border: `2px solid ${accent}25`,
            }}>
              <img src={member.avatar} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>

            {/* Text */}
            <div>
              <CE
                as="h4" value={member.name} isEditing={isEditing}
                onSave={(val) => updateMember(member, 'name', val)}
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 20, fontWeight: 700, lineHeight: 1.2,
                  color: headingColor, marginBottom: 5, display: 'block',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 2, background: accent, flexShrink: 0 }} />
                <CE
                  as="span" value={member.role} isEditing={isEditing}
                  onSave={(val) => updateMember(member, 'role', val)}
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 11, fontWeight: 500,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: accent,
                  }}
                />
              </div>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {(member.social || []).map((s, i) => {
                const Icon = getSocialIcon(s.platform);
                return (
                  <a key={i} href={s.url} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `${accent}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: accent, textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}>
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Main export
// ──────────────────────────────────────────────────────────────────────────
export function TeamSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const members = content.members || [];
  const variant = section.variant || 'grid';
  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || '#ffffff');
  const padding = styles.padding || '60px 0';
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';

  const shared = { members, content, isEditing, onContentChange, headingColor, paragraphColor, background };

  return (
    <section style={{ background, padding, fontFamily: "'Outfit', sans-serif", position: 'relative' }}>
      <InjectStyles />

      {/* ambient bg texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 90% 10%, rgba(225,29,72,0.04) 0%, transparent 55%), radial-gradient(ellipse at 5% 90%, rgba(8,145,178,0.04) 0%, transparent 50%)',
      }} />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {variant === 'carousel' && <CarouselVariant {...shared} />}
        {variant === 'list'     && <ListVariant     {...shared} />}
        {variant === 'grid'     && <GridVariant     {...shared} />}
        {!['carousel','list','grid'].includes(variant) && <GridVariant {...shared} />}
      </div>
    </section>
  );
}