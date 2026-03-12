import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';

// ─── Shared Tokens ─────────────────────────────────────────────────────────────
const accentGrad = 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)';

const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Sora:wght@300;400;500;600;700;800&display=swap');
  .pricing-section * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .pricing-section h2, .pricing-section h3, .pricing-section h4 {
    font-family: 'DM Serif Display', Georgia, serif !important;
  }
  .pricing-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px;
    background: rgba(99,102,241,0.1);
    border: 1px solid rgba(99,102,241,0.22);
    border-radius: 999px;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #6366f1; margin-bottom: 1.25rem;
  }
  .toggle-pill {
    display: inline-flex;
    background: rgba(99,102,241,0.08);
    border: 1px solid rgba(99,102,241,0.15);
    border-radius: 999px;
    padding: 4px;
    gap: 2px;
    margin-top: 1.5rem;
  }
  .toggle-pill button {
    padding: 8px 22px;
    border-radius: 999px;
    border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 700;
    font-family: 'Sora', sans-serif;
    letter-spacing: 0.02em;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  }
  .toggle-pill .active {
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    color: #fff;
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
  }
  .toggle-pill .inactive {
    background: transparent;
    color: #6366f1;
  }
  .plan-card {
    position: relative;
    border-radius: 24px;
    padding: 2.25rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
  }
  .plan-card:hover { transform: translateY(-6px); }
  .plan-card-default {
    background: #ffffff;
    border: 1px solid rgba(99,102,241,0.12);
    box-shadow: 0 4px 24px rgba(0,0,0,0.05);
  }
  .plan-card-default:hover { box-shadow: 0 24px 56px rgba(99,102,241,0.14); border-color: rgba(99,102,241,0.3); }
  .plan-card-popular {
    background: linear-gradient(145deg, #4f46e5 0%, #0891b2 100%);
    box-shadow: 0 20px 60px rgba(79,70,229,0.35);
  }
  .plan-card-popular:hover { box-shadow: 0 32px 72px rgba(79,70,229,0.45); }
  .pricing-cta-default {
    width: 100%; padding: 13px;
    background: transparent;
    border: 1.5px solid rgba(99,102,241,0.25);
    border-radius: 14px; cursor: pointer;
    font-weight: 700; font-size: 0.9rem;
    font-family: 'Sora', sans-serif;
    color: #6366f1;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .pricing-cta-default:hover { background: rgba(99,102,241,0.06); border-color: rgba(99,102,241,0.5); transform: translateY(-1px); }
  .pricing-cta-popular {
    width: 100%; padding: 13px;
    background: #ffffff;
    border: none; border-radius: 14px; cursor: pointer;
    font-weight: 800; font-size: 0.9rem;
    font-family: 'Sora', sans-serif;
    color: #4f46e5;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: box-shadow 0.2s, transform 0.2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  }
  .pricing-cta-popular:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.18); transform: translateY(-1px); }
`;

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ content, isEditing, onContentChange, headingColor, paragraphColor, showToggle = false, annual = false, setAnnual = () => { } }: any) => (
  <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 4rem' }}>
    <div className="pricing-chip">
      <Sparkles width={10} height={10} />
      Pricing
    </div>
    <h2 style={{ margin: '0 0 1rem', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: headingColor, lineHeight: 1.2, letterSpacing: '-0.025em' }}
      contentEditable={isEditing} suppressContentEditableWarning
      onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>
      {content.headline || 'Simple, Transparent Pricing'}
    </h2>
    <div style={{ width: '56px', height: '3px', background: accentGrad, borderRadius: '999px', margin: '0 auto 1.25rem' }} />
    <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.75, color: paragraphColor, opacity: 0.85 }}
      contentEditable={isEditing} suppressContentEditableWarning
      onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>
      {content.subheadline || 'Choose the plan that works best for you'}
    </p>
    {showToggle && (
      <div className="toggle-pill">
        <button className={annual ? 'inactive' : 'active'} onClick={() => setAnnual(false)}>Monthly</button>
        <button className={annual ? 'active' : 'inactive'} onClick={() => setAnnual(true)}>
          Yearly
          <span style={{ marginLeft: '6px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.25)', padding: '2px 7px', borderRadius: '999px', fontWeight: 700 }}>−20%</span>
        </button>
      </div>
    )}
  </div>
);

// ─── Plan Card (shared between cards + toggle) ─────────────────────────────────
const PlanCard = ({ plan, isEditing, onContentChange, content, buttonPrimaryBg, buttonPrimaryText, price, period, styles }) => {
  const isPopular = plan.popular;
  return (
    <div className={`plan-card ${isPopular ? 'plan-card-popular' : 'plan-card-default'}`}
      style={{ transform: isPopular ? 'scale(1.03)' : undefined, zIndex: isPopular ? 2 : 1 }}>

      {/* Popular badge */}
      {isPopular && (
        <div style={{
          position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: '#fff', fontSize: '0.7rem', fontWeight: 800,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '5px 16px', borderRadius: '0 0 12px 12px',
          display: 'flex', alignItems: 'center', gap: '5px',
          boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
        }}>
          <Zap width={10} height={10} />
          <span contentEditable={isEditing} suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.plans.map(p => p.id === plan.id ? { ...p, popularLabel: e.currentTarget.textContent } : p);
              onContentChange('plans', updated);
            }}>
            {plan.popularLabel || 'Most Popular'}
          </span>
        </div>
      )}

      {/* Ghost number */}
      <div style={{
        position: 'absolute', bottom: '-12px', right: '16px',
        fontSize: '7rem', fontWeight: 900, lineHeight: 1,
        color: isPopular ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.04)',
        fontFamily: '"DM Serif Display", serif',
        userSelect: 'none', pointerEvents: 'none',
      }}>
        {typeof price === 'number' || !isNaN(price) ? `$${price}` : plan.price}
      </div>

      {/* Plan name */}
      <h3 style={{ margin: '1.5rem 0 0.35rem', fontSize: '1.15rem', fontWeight: 700, color: isPopular ? '#fff' : '#0f172a', letterSpacing: '-0.01em' }}
        contentEditable={isEditing} suppressContentEditableWarning
        onBlur={(e) => {
          if (!isEditing || !onContentChange) return;
          const updated = content.plans.map(p => p.id === plan.id ? { ...p, name: e.currentTarget.textContent } : p);
          onContentChange('plans', updated);
        }}>
        {plan.name}
      </h3>

      <p style={{ margin: '0 0 1.5rem', fontSize: '0.85rem', lineHeight: 1.6, color: isPopular ? 'rgba(255,255,255,0.65)' : '#64748b' }}
        contentEditable={isEditing} suppressContentEditableWarning
        onBlur={(e) => {
          if (!isEditing || !onContentChange) return;
          const updated = content.plans.map(p => p.id === plan.id ? { ...p, description: e.currentTarget.textContent } : p);
          onContentChange('plans', updated);
        }}>
        {plan.description}
      </p>

      {/* Price */}
      <div style={{ marginBottom: '1.75rem', paddingBottom: '1.75rem', borderBottom: `1px solid ${isPopular ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.1)'}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: isPopular ? 'rgba(255,255,255,0.7)' : '#6366f1', alignSelf: 'flex-start', paddingTop: '8px' }}>$</span>
          <span style={{ fontSize: '3.25rem', fontWeight: 800, color: isPopular ? '#fff' : '#0f172a', lineHeight: 1, letterSpacing: '-0.04em' }}
            contentEditable={isEditing} suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.plans.map(p => p.id === plan.id ? { ...p, price: e.currentTarget.textContent.replace('$', '').trim() } : p);
              onContentChange('plans', updated);
            }}>
            {price ?? plan.price}
          </span>
          <span style={{ fontSize: '0.85rem', color: isPopular ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginLeft: '2px' }}
            contentEditable={isEditing} suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.plans.map(p => p.id === plan.id ? { ...p, pricePeriod: e.currentTarget.textContent } : p);
              onContentChange('plans', updated);
            }}>
            {period || plan.pricePeriod || '/mo'}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {(plan.features || []).map((feature, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '20px', height: '20px', flexShrink: 0, borderRadius: '6px',
              background: isPopular ? 'rgba(255,255,255,0.18)' : 'rgba(99,102,241,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check width={11} height={11} color={isPopular ? '#fff' : '#6366f1'} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '0.875rem', color: isPopular ? 'rgba(255,255,255,0.85)' : '#475569' }}
              contentEditable={isEditing} suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updatedFeatures = [...(plan.features || [])];
                updatedFeatures[i] = e.currentTarget.textContent;
                const updated = content.plans.map(p => p.id === plan.id ? { ...p, features: updatedFeatures } : p);
                onContentChange('plans', updated);
              }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button className={isPopular ? 'pricing-cta-popular' : 'pricing-cta-default'}>
        <span contentEditable={isEditing} suppressContentEditableWarning
          onBlur={(e) => {
            if (!isEditing || !onContentChange) return;
            const updated = content.plans.map(p => p.id === plan.id ? { ...p, ctaText: e.currentTarget.textContent } : p);
            onContentChange('plans', updated);
          }}>
          {plan.ctaText || 'Get Started'}
        </span>
        <ArrowRight width={14} height={14} />
      </button>
    </div>
  );
};

// ─── VARIANT: TABLE ────────────────────────────────────────────────────────────
const renderTable = ({ content, isEditing, onContentChange, headingColor, paragraphColor, plans }: any) => {
  const allFeatures = Array.from(new Set<string>(plans.flatMap((p: any) => p.features || [])));
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
      <SectionHeader content={content} isEditing={isEditing} onContentChange={onContentChange} headingColor={headingColor} paragraphColor={paragraphColor} />

      <div style={{ overflowX: 'auto', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.12)', background: '#fff', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(6,182,212,0.04))' }}>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                Plan
              </th>
              <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                Price
              </th>
              {allFeatures.map((f: string) => (
                <th key={f} style={{ padding: '1.25rem 1rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid rgba(99,102,241,0.1)', whiteSpace: 'nowrap' }}>
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((p, idx) => (
              <tr key={p.id} style={{ background: p.popular ? 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(6,182,212,0.03))' : 'transparent', borderBottom: idx < plans.length - 1 ? '1px solid rgba(99,102,241,0.07)' : 'none' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: p.popular ? accentGrad : 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles width={14} height={14} color={p.popular ? '#fff' : '#6366f1'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', fontFamily: '"DM Serif Display", serif' }}>{p.name}</div>
                      {p.popular && <div style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Most Popular</div>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', fontFamily: '"DM Serif Display", serif' }}>${p.price}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>/mo</span>
                </td>
                {allFeatures.map((f: string) => (
                  <td key={f} style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                    {(p.features || []).includes(f)
                      ? <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: p.popular ? accentGrad : 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                        <Check width={12} height={12} color={p.popular ? '#fff' : '#6366f1'} strokeWidth={3} />
                      </div>
                      : <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(148,163,184,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: '#cbd5e1', fontSize: '1rem' }}>–</div>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export function PricingSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles } = section;
  const plans = content.plans || [];
  const variant = section.variant || 'cards';
  const [annual, setAnnual] = useState(false);

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || '#f8fafc');

  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';
  
  // Get button colors with fallbacks
  const buttonPrimaryBg = styles.buttonPrimaryBg || '#0f172a';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';

  const shared = { content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, plans, styles };


  return (
    <>
      <style>{sharedStyles}</style>
      <section
        className={`pricing-section relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
        style={{ background, padding: styles.padding || '6rem 0', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: '-160px', right: '-160px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {variant === 'table' && renderTable(shared)}

          {(variant === 'cards' || variant === 'toggle') && (
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
              <SectionHeader
                content={content} isEditing={isEditing} onContentChange={onContentChange}
                headingColor={headingColor} paragraphColor={paragraphColor}
                showToggle={variant === 'toggle'} annual={annual} setAnnual={setAnnual}
              />

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(plans.length, 3)}, 1fr)`, gap: '1.5rem', alignItems: 'center' }}>
                {plans.map((plan, index) => {
                  const price = variant === 'toggle' && annual
                    ? Math.round(plan.price * 10 * 0.8)
                    : plan.price;
                  const period = variant === 'toggle' ? (annual ? '/yr' : '/mo') : (plan.pricePeriod || '/mo');
                  return (
                    <PlanCard
                      key={plan.id || index}
                      plan={plan} price={price} period={period}
                      isEditing={isEditing} onContentChange={onContentChange}
                      content={content} styles={styles}
                      buttonPrimaryBg={buttonPrimaryBg} buttonPrimaryText={buttonPrimaryText}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}