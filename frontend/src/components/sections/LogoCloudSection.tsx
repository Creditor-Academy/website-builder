import React from 'react';

export function LogoCloudSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const logos = content.logos || [];
  const variant = section.variant || 'simple';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');
  const padding = styles.padding || '60px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';
  const logoHeight = styles.logoHeight || '40px';

  if (variant === 'scroll') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          {content.headline && (
            <h3
              className="text-center text-xl md:text-2xl font-semibold mb-3" 
              style={{ color: headingColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
            >
              {content.headline}
            </h3>
          )}
          {content.subheadline && (
            <p 
              className="text-center text-sm uppercase tracking-wider mb-8 max-w-2xl mx-auto" 
              style={{ color: paragraphColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}
            >
              {content.subheadline}
            </p>
          )}
          <div className="overflow-x-auto whitespace-nowrap py-4 hide-scrollbar">
            {logos.map((logo, index) => (
              <span 
                key={logo.id || index} 
                className="inline-block px-6 opacity-60 hover:opacity-100 transition-opacity relative group"
                title={logo.name}
              >
                <img 
                  src={logo.url} 
                  alt={logo.name || 'Company logo'} 
                  style={{ height: logoHeight }}
                  className="w-auto object-contain inline-block"
                />
                {isEditing && (
                  <div className="absolute -top-8 left-0 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {logo.name}
                  </div>
                )}
              </span>
            ))}
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
            <h3
              className="text-center text-xl md:text-2xl font-semibold mb-3" 
              style={{ color: headingColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
            >
              {content.headline}
            </h3>
          )}
          {content.subheadline && (
            <p 
              className="text-center text-sm uppercase tracking-wider mb-12 max-w-2xl mx-auto" 
              style={{ color: paragraphColor }}
              contentEditable={isEditing} 
              suppressContentEditableWarning 
              onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}
            >
              {content.subheadline}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {logos.map((logo, index) => (
              <div 
                key={logo.id || index} 
                className="opacity-60 hover:opacity-100 transition-opacity group relative min-h-16 flex items-center justify-center"
                title={logo.name}
              >
                <img 
                  src={logo.url} 
                  alt={logo.name || 'Company logo'}
                  style={{ height: logoHeight }}
                  className="w-auto object-contain mx-auto"
                />
                {isEditing && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {logo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // simple row (default)
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        {content.headline && (
          <h3
            className="text-center text-xl md:text-2xl font-semibold mb-3" 
            style={{ color: headingColor }}
            contentEditable={isEditing} 
            suppressContentEditableWarning 
            onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}
          >
            {content.headline}
          </h3>
        )}
        {content.subheadline && (
          <p 
            className="text-center text-sm uppercase tracking-wider mb-8 max-w-2xl mx-auto" 
            style={{ color: paragraphColor }}
            contentEditable={isEditing} 
            suppressContentEditableWarning 
            onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}
          >
            {content.subheadline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((logo, index) => (
            <div 
              key={logo.id || index} 
              className="opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 group relative min-h-10 flex items-center"
              title={logo.name}
            >
              <img 
                src={logo.url} 
                alt={logo.name || 'Company logo'}
                style={{ height: logoHeight }}
                className="w-auto object-contain"
              />
              {isEditing && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {logo.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
