import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

export function PricingSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles } = section;
  const plans = content.plans || [];
  const variant = section.variant || 'cards';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#f8fafc');
  const padding = styles.padding || '100px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';
  
  // Get button colors with fallbacks
  const buttonPrimaryBg = styles.buttonPrimaryBg || '#0f172a';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';
  
  const [annual, setAnnual] = useState(false);

  if (variant === 'table') {
    // simple comparison table
    const allFeatures = Array.from(new Set(plans.flatMap(p => p.features || [])));
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Simple, Transparent Pricing'}</h2>
            <p className="text-lg opacity-80" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || 'Choose the plan that works best for you'}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left">Plan</th>
                  <th className="p-4">Price</th>
                  {allFeatures.map((f) => <th key={f} className="p-4">{f}</th>)}
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4">${p.price}{p.popular ? ' • Popular' : ''}</td>
                    {allFeatures.map((f) => <td key={f} className="p-4">{(p.features || []).includes(f) ? '✓' : ''}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'toggle') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Simple, Transparent Pricing'}</h2>
            <p className="text-lg opacity-80" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || 'Choose the plan that works best for you'}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button className={`px-3 py-2 rounded-md ${annual ? 'bg-secondary' : 'bg-primary text-white'}`} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`px-3 py-2 rounded-md ${annual ? 'bg-primary text-white' : 'bg-secondary'}`} onClick={() => setAnnual(true)}>Yearly</button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={plan.id || index} className={`relative rounded-3xl p-8 transition-all duration-300 ${plan.popular ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105 z-10' : 'bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl'}`}>
                {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full flex items-center gap-1"><Sparkles className="w-4 h-4" />Most Popular</div>}
                <div className="text-center mb-8">
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-slate-500'}`}>{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>${annual ? (plan.price * 10) : plan.price}</span>
                    <span className={plan.popular ? 'text-white/70' : 'text-slate-400'}>{annual ? '/year' : '/month'}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">{(plan.features || []).map((feature, i) => (<li key={i} className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20' : 'bg-green-100'}`}><Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-green-600'}`} /></div><span className={plan.popular ? 'text-white/90' : 'text-slate-600'}>{feature}</span></li>))}</ul>
                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${plan.popular ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`} style={{ background: plan.popular ? '#ffffff' : buttonPrimaryBg, color: plan.popular ? '#3b82f6' : buttonPrimaryText }}>
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.plans.map((p) => p.id === plan.id ? { ...p, ctaText: e.currentTarget.textContent } : p);
                      onContentChange('plans', updated);
                    }}
                  >
                    {plan.ctaText || 'Get Started'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // default cards
  return (
    <section
      className="relative"
      style={{
        background: background,
        padding: padding,
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: headingColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
          >
            {content.headline || 'Simple, Transparent Pricing'}
          </h2>
          <p 
            className="text-lg opacity-80"
            style={{ color: paragraphColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}
          >
            {content.subheadline || 'Choose the plan that works best for you'}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id || index}
              className={`relative rounded-3xl p-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105 z-10'
                  : 'bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.plans.map((p) => p.id === plan.id ? { ...p, popularLabel: e.currentTarget.textContent } : p);
                      onContentChange('plans', updated);
                    }}
                  >
                    {plan.popularLabel || 'Most Popular'}
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 
                  className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.plans.map((p) => p.id === plan.id ? { ...p, name: e.currentTarget.textContent } : p);
                    onContentChange('plans', updated);
                  }}
                >
                  {plan.name}
                </h3>
                <p 
                  className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-slate-500'}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.plans.map((p) => p.id === plan.id ? { ...p, description: e.currentTarget.textContent } : p);
                    onContentChange('plans', updated);
                  }}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span 
                    className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const priceText = e.currentTarget.textContent.replace('$', '').trim();
                      const updated = content.plans.map((p) => p.id === plan.id ? { ...p, price: priceText } : p);
                      onContentChange('plans', updated);
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span 
                    className={plan.popular ? 'text-white/70' : 'text-slate-400'}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.plans.map((p) => p.id === plan.id ? { ...p, pricePeriod: e.currentTarget.textContent } : p);
                      onContentChange('plans', updated);
                    }}
                  >
                    {plan.pricePeriod || '/month'}
                  </span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {(plan.features || []).map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-green-100'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-white' : 'text-green-600'}`} />
                    </div>
                    <span 
                      className={plan.popular ? 'text-white/90' : 'text-slate-600'}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updatedFeatures = [...(plan.features || [])];
                        updatedFeatures[i] = e.currentTarget.textContent;
                        const updated = content.plans.map((p) => p.id === plan.id ? { ...p, features: updatedFeatures } : p);
                        onContentChange('plans', updated);
                      }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'hover:bg-slate-100'
                    : 'hover:bg-slate-800'
                }`}
                style={{ 
                  background: plan.popular ? '#ffffff' : buttonPrimaryBg, 
                  color: plan.popular ? '#3b82f6' : buttonPrimaryText 
                }}
              >
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.plans.map((p) => p.id === plan.id ? { ...p, ctaText: e.currentTarget.textContent } : p);
                    onContentChange('plans', updated);
                  }}
                >
                  {plan.ctaText || 'Get Started'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
