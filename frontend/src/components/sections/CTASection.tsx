import { ArrowRight, Sparkles, ChevronRight, Zap, Shield, Star } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Editable } from '@/components/ui/Editable';

// ─── Shared Tokens ─────────────────────────────────────────────────────────────
const accentGrad = 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';
const accentGradAlt = 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)';

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sora:wght@300;400;500;600;700;800&display=swap');
  .cta-section * { box-sizing: border-box; }
  .cta-section { font-family: 'Sora', sans-serif; }
  .cta-section h2, .cta-section h3, .cta-section h4 { font-family: 'DM Serif Display', Georgia, serif !important; }

  .cta-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px;
    background: var(--theme-primary, #ffffff);
    color: var(--theme-bg, #4f46e5);
    font-weight: 700; font-size: 0.95rem;
    border: none; border-radius: var(--radius, 12px); cursor: pointer;
    transition: all var(--animation-speed, 0.2s) ease;
    font-family: 'Sora', sans-serif;
    letter-spacing: -0.01em;
    white-space: nowrap;
    box-shadow: var(--shadow, none);
  }
  .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }

  .cta-btn-secondary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 32px;
    background: rgba(255,255,255,0.08);
    color: #ffffff;
    font-weight: 600; font-size: 0.95rem;
    border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius, 12px); cursor: pointer;
    transition: all var(--animation-speed, 0.2s) ease;
    font-family: 'Sora', sans-serif;
    letter-spacing: -0.01em;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }
  .cta-btn-secondary:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }

  .cta-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(255,255,255,0.9);
    margin-bottom: 1.5rem;
    font-family: 'Sora', sans-serif;
  }
  .glass-effect {
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(12px) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }
`;

// ─── VARIANT: SIMPLE (default) ─────────────────────────────────────────────────
const renderSimple = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText, handleTextEdit }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    {/* Noise texture overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
      opacity: 0.4, pointerEvents: 'none',
    }} />

    {/* Radial glow blobs */}
    <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1, textAlign: 'center' }}>

      {/* Chip */}
      <div className="cta-chip">
        <Sparkles width={10} height={10} />
        <Editable 
          isEditing={isEditing} 
          value={content.badgeText || 'Limited Time Offer'} 
          onSave={(val) => onContentChange?.('badgeText', val)} 
        />
      </div>

      {/* Headline */}
      <Editable
        as="h2"
        style={{ margin: '0 0 1.25rem', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, color: headingColor, lineHeight: 1.15, letterSpacing: '-0.03em' }}
        isEditing={isEditing} 
        value={content.headline || ''} 
        onSave={(val) => onContentChange?.('headline', val)}
      />

      {/* Divider */}
      <div style={{ width: '56px', height: '3px', background: 'rgba(255,255,255,0.35)', borderRadius: '999px', margin: '0 auto 1.5rem' }} />

      {/* Subheadline */}
      <Editable
        as="p"
        style={{ margin: '0 auto 2.5rem', maxWidth: '560px', fontSize: '1.05rem', lineHeight: 1.75, color: paragraphColor }}
        isEditing={isEditing} 
        value={content.subheadline || ''} 
        onSave={(val) => onContentChange?.('subheadline', val)}
      />

      {/* Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
        <button className="cta-btn-primary" style={{ background: buttonPrimaryBg, color: buttonPrimaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)' }}>
          <Editable 
            isEditing={isEditing} 
            value={content.ctaText || ''} 
            onSave={(val) => onContentChange?.('ctaText', val)} 
          />
          <ArrowRight width={16} height={16} />
        </button>
        <button className="cta-btn-secondary" style={{ background: buttonSecondaryBg, color: buttonSecondaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)' }}>
          <Editable 
            isEditing={isEditing} 
            value={content.ctaSecondaryText || ''} 
            onSave={(val) => onContentChange?.('ctaSecondaryText', val)} 
          />
        </button>
      </div>

      {/* Trust row */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <Editable 
          style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
          isEditing={isEditing} 
          value={content.trustLabel || 'Trusted by:'} 
          onSave={(val) => onContentChange?.('trustLabel', val)} 
        />
        {(content.trustCompanies || ['Google', 'Microsoft', 'Apple', 'Amazon']).map((company, i) => (
          <Editable 
            key={i} 
            style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}
            isEditing={isEditing} 
            value={company || ''}
            onSave={(val) => {
              if (!isEditing || !onContentChange) return;
              const updated = [...(content.trustCompanies || ['Google', 'Microsoft', 'Apple', 'Amazon'])];
              updated[i] = val;
              onContentChange('trustCompanies', updated);
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── VARIANT: SPLIT ────────────────────────────────────────────────────────────
const renderSplit = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText, handleTextEdit }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Left: Text */}
        <div>
          <div className="cta-chip" style={{ marginBottom: '1.25rem' }}>
            <Zap width={10} height={10} />
            <Editable 
              isEditing={isEditing} 
              value={content.chipLabel || 'Get Started'} 
              onSave={(val) => onContentChange?.('chipLabel', val)} 
            />
          </div>
          <Editable
            as="h2"
            style={{ margin: '0 0 1rem', fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)', fontWeight: 700, color: headingColor, lineHeight: 1.2, letterSpacing: '-0.025em' }}
            isEditing={isEditing} 
            value={content.headline || ''} 
            onSave={(val) => onContentChange?.('headline', val)}
          />
          <Editable
            as="p"
            style={{ margin: '0 0 2rem', fontSize: '1rem', lineHeight: 1.75, color: paragraphColor }}
            isEditing={isEditing} 
            value={content.subheadline || ''} 
            onSave={(val) => onContentChange?.('subheadline', val)}
          />

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
            {(content.featureBullets || ['No credit card required', 'Cancel anytime', '24/7 Support']).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield width={10} height={10} color="white" />
                </div>
                <Editable
                  isEditing={isEditing}
                  value={item || ''}
                  onSave={(val) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = [...(content.featureBullets || ['No credit card required', 'Cancel anytime', '24/7 Support'])];
                    updated[i] = val;
                    onContentChange('featureBullets', updated);
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button className="cta-btn-primary" style={{ background: buttonPrimaryBg, color: buttonPrimaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)' }}>
              <Editable 
                isEditing={isEditing} 
                value={content.ctaText || ''} 
                onSave={(val) => onContentChange?.('ctaText', val)} 
              />
              <ChevronRight width={16} height={16} />
            </button>
            <button className="cta-btn-secondary" style={{ background: buttonSecondaryBg, color: buttonSecondaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)' }}>
              <Editable 
                isEditing={isEditing} 
                value={content.ctaSecondaryText || ''} 
                onSave={(val) => onContentChange?.('ctaSecondaryText', val)} 
              />
            </button>
          </div>
        </div>

        {/* Right: Image / Placeholder card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: styles.borderRadius || 'var(--radius, 16px)',
          overflow: 'hidden',
          backdropFilter: 'blur(8px)',
          minHeight: '320px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {content.imageUrl
            ? <img src={content.imageUrl} alt="CTA" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <Star width={32} height={32} color="rgba(255,255,255,0.5)" />
                  </div>
                  <Editable 
                    style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}
                    isEditing={isEditing} 
                    value={content.imagePlaceholderText || 'Your image here'} 
                    onSave={(val) => onContentChange?.('imagePlaceholderText', val)} 
                  />
                </div>
            )
          }
          {/* Corner decorations */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderTop: '2px solid rgba(255,255,255,0.2)', borderRight: '2px solid rgba(255,255,255,0.2)', borderRadius: '0 6px 0 0' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '28px', height: '28px', borderBottom: '2px solid rgba(255,255,255,0.2)', borderLeft: '2px solid rgba(255,255,255,0.2)', borderRadius: '0 0 0 6px' }} />
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIANT: BANNER ──────────────────────────────────────────────────────────
const renderBanner = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText, handleTextEdit }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    {/* Subtle diagonal stripe pattern */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px)',
      pointerEvents: 'none',
    }} />

    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>

        {/* Left: icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '240px' }}>
          <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles width={20} height={20} color="white" />
          </div>
          <div>
            <Editable
              as="h3"
              style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700, color: headingColor, letterSpacing: '-0.01em' }}
              isEditing={isEditing} 
              value={content.headline || ''} 
              onSave={(val) => onContentChange?.('headline', val)}
            />
            <Editable
              as="p"
              style={{ margin: 0, fontSize: '0.82rem', color: paragraphColor, lineHeight: 1.4 }}
              isEditing={isEditing} 
              value={content.subheadline || ''} 
              onSave={(val) => onContentChange?.('subheadline', val)}
            />
          </div>
        </div>

        {/* Right: buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button className="cta-btn-primary" style={{ background: buttonPrimaryBg, color: buttonPrimaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)', padding: '10px 22px', fontSize: '0.875rem' }}>
            <Editable 
              isEditing={isEditing} 
              value={content.ctaText || ''} 
              onSave={(val) => onContentChange?.('ctaText', val)} 
            />
          </button>
          <button className="cta-btn-secondary" style={{ background: buttonSecondaryBg, color: buttonSecondaryText, borderRadius: styles.borderRadius || 'var(--radius, 16px)', padding: '10px 22px', fontSize: '0.875rem' }}>
            <Editable 
              isEditing={isEditing} 
              value={content.ctaSecondaryText || ''} 
              onSave={(val) => onContentChange?.('ctaSecondaryText', val)} 
            />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── VARIANT: FLOATING ────────────────────────────────────────────────────────
const renderFloating = ({ content, styles, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText, handleTextEdit }) => (
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 2rem' }}>
      <div style={{
        background: '#ffffff',
        borderRadius: styles.borderRadius || 'var(--radius, 16px)',
        boxShadow: 'var(--shadow, 0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04))',
        padding: '3.5rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Inner top gradient bar */}
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: '3px', background: accentGrad, borderRadius: '0 0 4px 4px' }} />

        {/* Soft background blob */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '999px',
          fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#6366f1',
          marginBottom: '1.5rem',
          fontFamily: 'Sora, sans-serif',
        }}>
          <Sparkles width={9} height={9} />
          <Editable 
            isEditing={isEditing} 
            value={content.floatingChipLabel || 'Special Offer'} 
            onSave={(val) => onContentChange?.('floatingChipLabel', val)} 
          />
        </div>

        <Editable
          as="h2"
          style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, color: styles.headingColor || '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.2 }}
          isEditing={isEditing} 
          value={content.headline || ''} 
          onSave={(val) => onContentChange?.('headline', val)}
        />

        <div style={{ width: '48px', height: '3px', background: accentGrad, borderRadius: '999px', margin: '0 auto 1.25rem' }} />

        <Editable
          as="p"
          style={{ margin: '0 auto 2.25rem', maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.75, color: styles.paragraphColor || '#64748b' }}
          isEditing={isEditing} 
          value={content.subheadline || ''} 
          onSave={(val) => onContentChange?.('subheadline', val)}
        />

        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px',
            background: accentGrad,
            color: '#fff',
            fontWeight: 700, fontSize: '0.92rem',
            border: 'none', borderRadius: styles.borderRadius || 'var(--radius, 16px)', cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            boxShadow: 'var(--shadow, 0 8px 24px rgba(99,102,241,0.3))',
            transition: 'transform var(--animation-speed, 0.2s), box-shadow var(--animation-speed, 0.2s)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow, 0 16px 36px rgba(99,102,241,0.35))'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow, 0 8px 24px rgba(99,102,241,0.3))'; }}
          >
            <Editable 
              isEditing={isEditing} 
              value={content.ctaText || ''} 
              onSave={(val) => onContentChange?.('ctaText', val)} 
            />
            <ArrowRight width={15} height={15} />
          </button>

          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '13px 28px',
            background: 'transparent',
            color: '#6366f1',
            fontWeight: 600, fontSize: '0.92rem',
            border: '1.5px solid rgba(99,102,241,0.25)', borderRadius: styles.borderRadius || 'var(--radius, 16px)', cursor: 'pointer',
            fontFamily: 'Sora, sans-serif',
            transition: 'border-color var(--animation-speed, 0.2s), background var(--animation-speed, 0.2s)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
          >
            <Editable 
              isEditing={isEditing} 
              value={content.ctaSecondaryText || ''} 
              onSave={(val) => onContentChange?.('ctaSecondaryText', val)} 
            />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function CTASection({ section, isSelected, isEditing, onContentChange, isAlternate }) {
  const { content, styles, variant = 'simple' } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-primary, linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%))'));

  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-bg, #ffffff)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, rgba(15, 23, 42, 0.72))' : 'var(--theme-bg, rgba(255, 255, 255, 0.72))');
  const buttonPrimaryBg = styles.buttonPrimaryBg || (isAlternate ? 'var(--theme-primary, #4f46e5)' : 'var(--theme-bg, #ffffff)');
  const buttonPrimaryText = styles.buttonPrimaryText || (isAlternate ? 'var(--theme-bg-alt, #ffffff)' : 'var(--theme-primary, #4f46e5)');
  const buttonSecondaryBg = styles.buttonSecondaryBg || 'transparent';
  const buttonSecondaryText = styles.buttonSecondaryText || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-bg, #ffffff)');

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) onContentChange(field, e.currentTarget.innerHTML || '');
  };

  const shared = { content, styles, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, buttonSecondaryBg, buttonSecondaryText, handleTextEdit };

  const isFloating = variant === 'floating';
  const isBanner = variant === 'banner';

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <>
      <style>{sharedStyles}</style>

      <section
        className={`cta-section relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${globalClasses}`}
        style={{
          background: background,
          padding: styles.padding || (isBanner ? '1.25rem 0' : isFloating ? '3rem 0' : '4rem 0'),
          position: 'relative',
          overflow: 'hidden',
          borderRadius: isFloating ? '0' : 'var(--radius, 0)',
        }}
      >
        {variant === 'simple' && renderSimple(shared)}
        {variant === 'split' && renderSplit(shared)}
        {variant === 'banner' && renderBanner(shared)}
        {variant === 'floating' && renderFloating(shared)}
      </section>
    </>
  );
}
