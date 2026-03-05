import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
export function FAQSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const faqs = content.faqs || [];
  const [openIndex, setOpenIndex] = useState(0);
  const variant = section.variant || 'accordion';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#f8fafc');
  const padding = styles.padding || '100px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';

  if (variant === 'grid') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: headingColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Frequently Asked Questions'}</h2>
            <p className="text-lg opacity-80" style={{ color: paragraphColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={faq.id || idx} className="bg-white rounded-2xl p-6 border border-slate-200">
                <h4 
                  className="font-semibold mb-2"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, question: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.question}
                </h4>
                <div 
                  className="text-slate-600 text-sm leading-relaxed"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, answer: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'tabs') {
    // group by category (if provided)
    const categories = Array.from(new Set(faqs.map(f => f.category || 'General')));
    const [active, setActive] = useState(categories[0] || 'General');
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: headingColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Frequently Asked Questions'}</h2>
            <p className="text-lg opacity-80" style={{ color: paragraphColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline}</p>
          </div>
          <div className="mb-6 flex gap-3 justify-center">
            {categories.map(cat => <button key={cat} className={`px-4 py-2 rounded-md ${active === cat ? 'bg-primary text-white' : 'bg-secondary'}`} onClick={() => setActive(cat)}>{cat}</button>)}
          </div>
          <div>
            {(faqs.filter(f => (f.category || 'General') === active)).map((faq, idx) => (
              <div key={faq.id || idx} className="bg-white rounded-2xl p-6 border border-slate-200 mb-4">
                <h4 
                  className="font-semibold mb-2"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, question: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.question}
                </h4>
                <div 
                  className="text-slate-600 text-sm leading-relaxed"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, answer: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // default accordion
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Frequently Asked Questions'}</h2>
          <p className="text-lg opacity-80" style={{ color: '#64748b' }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline}</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id || index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
                <span 
                  className="font-semibold text-slate-900 pr-4"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, question: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.question}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <div 
                  className="px-6 pb-5 text-slate-600 leading-relaxed"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.faqs.map((f) => f.id === faq.id ? { ...f, answer: e.currentTarget.textContent } : f);
                    onContentChange('faqs', updated);
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
