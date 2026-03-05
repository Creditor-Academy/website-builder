import React from 'react';
export function LogoCloudSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const logos = content.logos || [];
  const variant = section.variant || 'simple';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');
  const padding = styles.padding || '60px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#64748b';
  const paragraphColor = styles.paragraphColor || '#64748b';

  if (variant === 'scroll') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          {content.headline && (
            <p 
              className="text-center text-sm uppercase tracking-wider mb-8" 
              style={{ color: headingColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
            >
              {content.headline}
            </p>
          )}
          <div className="overflow-x-auto whitespace-nowrap py-4 hide-scrollbar">
            {logos.map((logo, index) => (<span key={logo.id || index} className="inline-block px-6 opacity-60 hover:opacity-100 transition-opacity"><img src={logo.url} alt={logo.name} className="h-8 md:h-10 w-auto object-contain inline-block" /></span>))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'grid') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          {content.headline && (
            <p 
              className="text-center text-sm uppercase tracking-wider mb-8" 
              style={{ color: headingColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
            >
              {content.headline}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {logos.map((logo, index) => (<div key={logo.id || index} className="opacity-60 hover:opacity-100 transition-opacity"><img src={logo.url} alt={logo.name} className="h-8 md:h-10 w-auto object-contain" /></div>))}
          </div>
        </div>
      </section>
    );
  }

  // simple row (default)
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        {content.headline && (<p className="text-center text-slate-500 text-sm uppercase tracking-wider mb-8" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline}</p>)}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo, index) => (<div key={logo.id || index} className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"><img src={logo.url} alt={logo.name} className="h-8 md:h-10 w-auto object-contain" /></div>))}
        </div>
      </div>
    </section>
  );
} 
