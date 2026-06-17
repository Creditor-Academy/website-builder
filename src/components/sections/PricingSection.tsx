import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Editable } from '@/components/ui/Editable';
import { sanitizeHTML } from '@/utils/sanitize';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

  @keyframes pr-up  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pr-in  { from { opacity:0; transform:scale(0.96);      } to { opacity:1; transform:scale(1);      } }
  @keyframes pr-bar { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .pr-sect * { box-sizing: border-box; }

  .pr-ce:focus { outline: none; }
  .pr-ce[contenteditable="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px;
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }
  .pr-ce-inv[contenteditable="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.28);
    cursor: text; padding-bottom: 1px;
    direction: ltr !important;
    unicode-bidi: normal !important;
    text-align: left !important;
  }

  /* Toggle */
  .pr-toggle {
    display: inline-flex;
    background: rgba(0,0,0,0.05);
    border: 1px solid rgba(0,0,0,0.09);
    border-radius: 3px; padding: 4px; gap: 3px;
    margin-top: 28px;
  }
  .pr-toggle button {
    padding: 8px 22px; border-radius: 2px;
    border: none; cursor: pointer;
    font-family: 'Geist', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase;
    transition: background 0.2s, color 0.2s;
  }
  .pr-toggle .active   { background: #0f172a; color: #fff; }
  .pr-toggle .inactive { background: transparent; color: rgba(0,0,0,0.4); }

  /* Cards */
  .pr-card {
    position: relative; overflow: hidden; border-radius: 4px;
    transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s ease;
  }
  .pr-card:hover { transform: translateY(-7px); }
  .pr-card-default {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  }
  .pr-card-default:hover { box-shadow: 0 28px 60px rgba(0,0,0,0.10); }
  .pr-card-popular {
    background: #0f172a;
    box-shadow: 0 20px 60px rgba(15,23,42,0.38);
  }
  .pr-card-popular:hover { box-shadow: 0 32px 80px rgba(15,23,42,0.48); }

  /* CTA */
  .pr-cta {
    width: 100%; padding: 14px; border-radius: 3px; border: none; cursor: pointer;
    font-family: 'Geist', sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .pr-cta:hover { opacity: 0.85; transform: translateY(-1px); }
  .pr-cta-default { background: #0f172a; color: #fff; }
  .pr-cta-popular { background: #fff;    color: #0f172a; }

  /* Table */
  .pr-trow { transition: background 0.18s ease; }
  .pr-trow:hover { background: rgba(0,0,0,0.015) !important; }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('pricing-s-styles')) {
    const el = document.createElement('style');
    el.id = 'pricing-s-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706'];

// ─── Section Header ───────────────────────────────────────────────────────
function SectionHeader({ content, isEditing, onContentChange, headingColor, paragraphColor, showToggle = false, annual = false, setAnnual = (val: boolean) => {}, centered = true }: any) {
  return (
    <div style={{ maxWidth: 560, margin: centered ? '0 auto 72px' : '0 0 64px', textAlign: centered ? 'center' : 'left' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: "'Geist', sans-serif",
        fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.3)', marginBottom: 16,
      }}>
        {centered && <div style={{ width: 18, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
        {!centered && <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
        pricing
        {centered && <div style={{ width: 18, height: 1, background: 'rgba(0,0,0,0.2)' }} />}
      </div>

      <Editable
        as="h2"
        className="pr-ce"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(30px, 4vw, 54px)',
          fontWeight: 400, fontStyle: 'italic',
          lineHeight: 1.05, letterSpacing: '-0.02em',
          color: headingColor, display: 'block', marginBottom: 0,
          animation: 'pr-up 0.6s ease both',
        }}
        isEditing={isEditing}
        value={content.headline || 'Simple, Transparent Pricing'}
        onSave={(val) => onContentChange?.('headline', val)}
      />

      <div style={{
        width: 36, height: 3, background: '#E11D48',
        margin: centered ? '18px auto' : '18px 0',
        transformOrigin: 'left', animation: 'pr-bar 0.7s ease 0.1s both',
      }} />

      <Editable
        as="p"
        className="pr-ce"
        style={{
          fontFamily: "'Geist', sans-serif",
          fontSize: 15, lineHeight: 1.75,
          color: paragraphColor, opacity: 0.7, display: 'block', margin: 0,
        }}
        isEditing={isEditing}
        value={content.subheadline || 'Choose the plan that works best for you'}
        onSave={(val) => onContentChange?.('subheadline', val)}
      />

      {showToggle && (
        <div className="pr-toggle">
          <button className={annual ? 'inactive' : 'active'} onClick={() => setAnnual(false)}>Monthly</button>
          <button className={annual ? 'active' : 'inactive'} onClick={() => setAnnual(true)}>
            Yearly
            <span style={{
              marginLeft: 6, fontSize: 9,
              background: annual ? 'rgba(255,255,255,0.18)' : '#E11D48',
              color: '#fff', padding: '2px 6px', borderRadius: 2, fontWeight: 700,
            }}>−20%</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────
function PlanCard({ plan, index, isEditing, onContentChange, content, price, period, styles }: any) {
  const isPopular = plan.popular;
  const accent = ACCENTS[index % ACCENTS.length];

  const updatePlan = (field, val) => {
    if (!isEditing || !onContentChange) return;
    onContentChange('plans', content.plans.map(p => p.id === plan.id ? { ...p, [field]: val } : p));
  };
  const updateFeature = (i, val) => {
    if (!isEditing || !onContentChange) return;
    const f = [...(plan.features || [])]; f[i] = val;
    onContentChange('plans', content.plans.map(p => p.id === plan.id ? { ...p, features: f } : p));
  };

  return (
    <div
      className={`pr-card ${isPopular ? 'pr-card-popular' : 'pr-card-default'}`}
      style={{
        zIndex: isPopular ? 2 : 1,
        borderRadius: styles.borderRadius || '4px',
        animation: `pr-in 0.5s ease ${index * 0.08}s both`,
      }}
    >
      {/* colored top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: isPopular ? '#E11D48' : accent }} />

      {/* popular badge */}
      {isPopular && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: "'Geist', sans-serif",
          fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#E11D48',
          background: 'rgba(225,29,72,0.12)',
          padding: '4px 10px', borderRadius: 2,
        }}>
          <Zap size={9} />
          <Editable
            className="pr-ce-inv"
            isEditing={isEditing}
            value={plan.popularLabel || 'Most Popular'}
            onSave={(val) => updatePlan('popularLabel', val)}
          />
        </div>
      )}

      {/* ghost watermark numeral */}
      <div style={{
        position: 'absolute', bottom: -20, right: 12,
        fontFamily: "'Instrument Serif', serif",
        fontSize: 96, fontWeight: 700,
        color: isPopular ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(String(index + 1).padStart(2, '0')) }} />

      <div style={{ padding: '36px 32px 32px' }}>
        {/* Plan name */}
        <Editable
          as="h3"
          className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 22, fontWeight: 400, fontStyle: 'italic',
            color: isPopular ? '#f8fafc' : '#0f172a',
            marginBottom: 8, display: 'block', lineHeight: 1.2,
          }}
          isEditing={isEditing}
          value={plan.name || ''}
          onSave={(val) => updatePlan('name', val)}
        />

        <Editable
          as="p"
          className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontSize: 13, lineHeight: 1.65,
            color: isPopular ? 'rgba(255,255,255,0.5)' : '#94a3b8',
            marginBottom: 28, display: 'block',
          }}
          isEditing={isEditing}
          value={plan.description || ''}
          onSave={(val) => updatePlan('description', val)}
        />

        {/* Price */}
        <div style={{
          paddingBottom: 24, marginBottom: 24,
          borderBottom: `1px solid ${isPopular ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{
              fontFamily: "'Geist', sans-serif",
              fontSize: 16, fontWeight: 500, alignSelf: 'flex-start', paddingTop: 10,
              color: isPopular ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.35)',
            }}>$</span>
            <Editable
              className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 56, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em',
                color: isPopular ? '#fff' : '#0f172a',
              }}
              isEditing={isEditing}
              value={price ?? plan.price}
              onSave={(val) => updatePlan('price', val.replace('$', '').trim())}
            />
            <Editable
              className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 12, color: isPopular ? 'rgba(255,255,255,0.35)' : '#94a3b8',
                marginLeft: 2,
              }}
              isEditing={isEditing}
              value={period || plan.pricePeriod || '/mo'}
              onSave={(val) => updatePlan('pricePeriod', val)}
            />
          </div>
        </div>

        {/* Features */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(plan.features || []).map((feature, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 18, height: 18, flexShrink: 0, borderRadius: '50%', marginTop: 1,
                background: isPopular ? 'rgba(225,29,72,0.2)' : `${accent}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={10} color={isPopular ? '#E11D48' : accent} strokeWidth={3} />
              </div>
              <Editable
                className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 13, lineHeight: 1.5,
                  color: isPopular ? 'rgba(255,255,255,0.75)' : '#475569',
                }}
                isEditing={isEditing}
                value={feature || ''}
                onSave={(val) => updateFeature(i, val)}
              />
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button className={`pr-cta ${isPopular ? 'pr-cta-popular' : 'pr-cta-default'}`}>
          <Editable
            className={isPopular ? 'pr-ce-inv' : 'pr-ce'}
            isEditing={isEditing}
            value={plan.ctaText || 'Get Started'}
            onSave={(val) => updatePlan('ctaText', val)}
          />
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── VARIANT: TABLE ───────────────────────────────────────────────────────
function TableVariant({ content, isEditing, onContentChange, headingColor, paragraphColor, plans, styles }: any) {
  const allFeatures = Array.from(new Set((plans as any[]).flatMap(p => p.features || []))) as string[];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-10">
      <SectionHeader
        content={content} isEditing={isEditing} onContentChange={onContentChange}
        headingColor={headingColor} paragraphColor={paragraphColor}
      />

      <div style={{
        overflowX: 'auto',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: styles.borderRadius || '4px',
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#fafaf9', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <th style={{
                padding: '18px 24px', textAlign: 'left',
                fontFamily: "'Geist', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.35)',
              }}>Plan</th>
              <th style={{
                padding: '18px 24px', textAlign: 'center',
                fontFamily: "'Geist', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.35)',
              }}>Price</th>
              {allFeatures.map(f => (
                <th key={f} style={{
                  padding: '18px 14px', textAlign: 'center',
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap',
                }}>{f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plans.map((p, idx) => {
              const accent = ACCENTS[idx % ACCENTS.length];
              return (
                <tr
                  key={p.id}
                  className="pr-trow"
                  style={{
                    background: p.popular ? '#fafaf9' : 'transparent',
                    borderBottom: idx < plans.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                        background: p.popular ? '#E11D48' : accent,
                      }} />
                      <div>
                        <div style={{
                          fontFamily: "'Instrument Serif', serif",
                          fontSize: 17, fontStyle: 'italic', fontWeight: 400,
                          color: '#0f172a',
                        }} dangerouslySetInnerHTML={{ __html: sanitizeHTML(p.name) }} />
                        {p.popular && (
                          <div style={{
                            fontFamily: "'Geist', sans-serif",
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: '#E11D48',
                          }}>Most Popular</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                    <span style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 22, fontWeight: 700,
                      color: '#0f172a',
                    }}>${p.price}</span>
                    <span style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: 11, color: 'rgba(0,0,0,0.35)', marginLeft: 3,
                    }}>/mo</span>
                  </td>
                  {allFeatures.map(f => (
                    <td key={f} style={{ padding: '20px 14px', textAlign: 'center' }}>
                      {(p.features || []).includes(f) ? (
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: p.popular ? '#E11D48' : `${accent}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto',
                        }}>
                          <Check size={10} color={p.popular ? '#fff' : accent} strokeWidth={3} />
                        </div>
                      ) : (
                        <span style={{ color: 'rgba(0,0,0,0.18)', fontSize: 14, fontFamily: "'Geist', sans-serif" }}>–</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────
export function PricingSection({ section, isSelected, isEditing, onContentChange, isAlternate }: any) {
  const { content, styles } = section;
  const { state } = useBuilder();
  const globalStyles = state.page?.globalStyles || {};

  const plans = content.plans || [];
  const variant = section.variant || 'cards';
  const [annual, setAnnual] = useState(false);

  const background = styles.useGradient
    ? (styles.backgroundGradient || styles.backgroundColor)
    : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #fafaf8)'));
  
  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #64748b)' : 'var(--theme-text, #64748b)');

  const buttonPrimaryBg = styles.buttonPrimaryBg || '#0f172a';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';

  const shared = { content, isEditing, onContentChange, headingColor, paragraphColor, buttonPrimaryBg, buttonPrimaryText, plans, styles };

  const globalClasses = `
    ${globalStyles.glassmorphism ? 'glass-effect' : ''}
  `.trim();

  return (
    <>
      <style>{STYLES}</style>
      <InjectStyles />
      <section
        className={`pr-sect relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} ${globalClasses}`}
        style={{
          background,
          padding: styles.padding || '60px 0',
          position: 'relative', overflow: 'hidden',
          borderRadius: variant === 'table' ? '0' : 'var(--radius, 0)',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(ellipse at 88% 8%, rgba(225,29,72,0.04) 0%, transparent 55%), radial-gradient(ellipse at 5% 92%, rgba(8,145,178,0.04) 0%, transparent 50%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {variant === 'table' && <TableVariant {...shared} />}

          {(variant === 'cards' || variant === 'toggle') && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-10">
              <SectionHeader
                content={content} isEditing={isEditing} onContentChange={onContentChange}
                headingColor={headingColor} paragraphColor={paragraphColor}
                showToggle={variant === 'toggle'} annual={annual} setAnnual={setAnnual}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {plans.map((plan, index) => {
                  const price = variant === 'toggle' && annual
                    ? Math.round(Number(plan.price) * 10 * 0.8)
                    : plan.price;
                  const period = variant === 'toggle' ? (annual ? '/yr' : '/mo') : (plan.pricePeriod || '/mo');
                  return (
                    <PlanCard
                      key={plan.id || index}
                      plan={plan} index={index} price={price} period={period}
                      isEditing={isEditing} onContentChange={onContentChange}
                      content={content} styles={styles}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}