import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function ServicesSection({ section, isSelected, isEditing, onContentChange, isAlternate }) {
  const { content, styles, variant = 'cards' } = section;
  const services = content.services || [];

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  const handleCardEdit = (field, index, e) => {
    if (onContentChange && isEditing) {
      const updatedServices = [...services];
      updatedServices[index] = { ...updatedServices[index], [field]: e.currentTarget.textContent || '' };
      onContentChange('services', updatedServices);
    }
  };

  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || (isAlternate ? 'var(--theme-bg-alt, #f8fafc)' : 'var(--theme-bg, #ffffff)'));
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || (isAlternate ? 'var(--theme-text-alt, #0f172a)' : 'var(--theme-text, #0f172a)');
  const paragraphColor = styles.paragraphColor || (isAlternate ? 'var(--theme-text-alt, #475569)' : 'var(--theme-text, #475569)');

  const sectionStyle = {
    background,
    padding: styles.padding,
  };

  return (
    <section 
      className={`relative transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      }`}
      style={sectionStyle}
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: headingColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('headline', e)}
          >
            {content.headline}
          </h2>
          <p 
            className="text-lg opacity-70"
            style={{ color: paragraphColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('subheadline', e)}
          >
            {content.subheadline}
          </p>
        </div>

        {/* Services - variant rendering */}
        {variant === 'list' ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {content.services?.map((service) => (
              <div key={service.id} className="flex items-start gap-4">
                <img src={service.imageUrl} alt={service.title} className="w-24 h-24 object-cover" style={{ borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '6px' }} />
                <div>
                  <h3 
                    className="font-semibold"
                    style={{ color: headingColor }}
                    contentEditable={isEditing} 
                    suppressContentEditableWarning 
                    onBlur={(e) => { 
                      if (!isEditing || !onContentChange) return; 
                      const updated = content.services.map((s) => s.id === service.id ? { ...s, title: e.currentTarget.textContent } : s); 
                      onContentChange('services', updated); 
                    }}
                  >
                    {service.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: paragraphColor }}
                    contentEditable={isEditing} 
                    suppressContentEditableWarning 
                    onBlur={(e) => { 
                      if (!isEditing || !onContentChange) return; 
                      const updated = content.services.map((s) => s.id === service.id ? { ...s, description: e.currentTarget.textContent } : s); 
                      onContentChange('services', updated); 
                    }}
                  >
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : variant === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {content.services?.map((service, index) => (
              <div 
                key={service.id}
                className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ 
                  background: styles.cardBackgroundColor || '#f8fafc',
                  borderRadius: styles.borderRadius || 'var(--radius, 16px)'
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px' }}>
                  {service.imageUrl ? (
                    <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" style={{ borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px' }} />
                  ) : (
                    <span className="text-2xl font-bold text-white">{service.title?.[0] || 'S'}</span>
                  )}
                </div>
                <h3 
                  className="font-bold mb-2"
                  style={{ color: headingColor }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.services.map((s) => s.id === service.id ? { ...s, title: e.currentTarget.textContent } : s);
                    onContentChange('services', updated);
                  }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-sm opacity-70"
                  style={{ color: paragraphColor }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.services.map((s) => s.id === service.id ? { ...s, description: e.currentTarget.textContent } : s);
                    onContentChange('services', updated);
                  }}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.services?.map((service, index) => (
              <div 
                key={service.id}
                className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  borderRadius: styles.borderRadius || 'var(--radius, 16px)'
                }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 
                    className="text-2xl font-bold mb-2"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.services.map((s) => s.id === service.id ? { ...s, title: e.currentTarget.textContent } : s);
                      onContentChange('services', updated);
                    }}
                  >
                    {service.title}
                  </h3>
                  <p 
                    className="opacity-80 mb-4 line-clamp-2"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.services.map((s) => s.id === service.id ? { ...s, description: e.currentTarget.textContent } : s);
                      onContentChange('services', updated);
                    }}
                  >
                    {service.description}
                  </p>
                  
                  <a 
                    href={service.link}
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
                  >
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updated = content.services.map((s) => s.id === service.id ? { ...s, linkText: e.currentTarget.textContent || 'Learn More' } : s);
                        onContentChange('services', updated);
                      }}
                    >
                      {service.linkText || 'Learn More'}
                    </span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>

                {/* Corner Accent */}
                <div 
                  className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '24px'
                  }}
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
