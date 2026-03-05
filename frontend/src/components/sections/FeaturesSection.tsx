import React from 'react';
import * as Icons from 'lucide-react';

export function FeaturesSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'grid' } = section;

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');

  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#475569';

  const sectionStyle = {
    background,
    padding: styles.padding,
  };

  // Dynamic icon component
  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  const renderGrid = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {content.features?.map((feature, index) => (
        <div
          key={feature.id}
          className="group relative p-8 transition-all duration-300 hover:shadow-soft hover:-translate-y-1"
          style={{
            background: '#f8fafc',
            borderRadius: styles.borderRadius || '16px',
            animationDelay: `${index * 0.1}s`
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff',
              borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px'
            }}
          >
            {getIcon(feature.icon)}
          </div>

          {/* Content */}
          <h3
            className="text-xl font-bold mb-3"
            style={{ color: headingColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map((f) => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.title}
          </h3>
          <p
            className="opacity-70 leading-relaxed"
            style={{ color: paragraphColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map((f) => f.id === feature.id ? { ...f, description: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.description}
          </p>

          {/* Hover Accent */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" 
            style={{ borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px' }}
          />
        </div>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-4 max-w-2xl mx-auto">
      {content.features?.map((feature) => (
        <div key={feature.id} className="flex items-start gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-primary text-white" style={{ borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '6px' }}>{getIcon(feature.icon)}</div>
          <div>
            <h3
              className="font-semibold"
              style={{ color: headingColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map((f) => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
                onContentChange('features', updated);
              }}
            >
              {feature.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (!isEditing || !onContentChange) return;
                const updated = content.features.map((f) => f.id === feature.id ? { ...f, description: e.currentTarget.textContent } : f);
                onContentChange('features', updated);
              }}
            >
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderIcons = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {content.features?.map((feature) => (
        <div key={feature.id} className="flex flex-col items-center text-center p-6 bg-white shadow-sm" style={{ borderRadius: styles.borderRadius || '8px' }}>
          <div className="w-20 h-20 flex items-center justify-center bg-primary text-white mb-4" style={{ borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px' }}>{getIcon(feature.icon)}</div>
          <h4
            className="font-semibold"
            style={{ color: headingColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isEditing || !onContentChange) return;
              const updated = content.features.map((f) => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
              onContentChange('features', updated);
            }}
          >
            {feature.title}
          </h4>
        </div>
      ))}
    </div>
  );

  const renderCards = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      {content.features?.map((feature, index) => (
        <div
          key={feature.id}
          className="group relative p-6 transition-all duration-300 hover:shadow-lg"
          style={{
            background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: styles.borderRadius || '12px'
          }}
        >
          <div className="flex items-start gap-6">
            <div
              className="w-14 h-14 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#ffffff',
                borderRadius: styles.borderRadius ? `calc(${styles.borderRadius} * 0.5)` : '8px'
              }}
            >
              {getIcon(feature.icon)}
            </div>
            <div className="flex-1">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: headingColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.features.map((f) => f.id === feature.id ? { ...f, title: e.currentTarget.textContent } : f);
                  onContentChange('features', updated);
                }}
              >
                {feature.title}
              </h3>
              <p
                className="opacity-70 leading-relaxed"
                style={{ color: paragraphColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.features.map((f) => f.id === feature.id ? { ...f, description: e.currentTarget.textContent } : f);
                  onContentChange('features', updated);
                }}
              >
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      className={`relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
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

        {/* Render by variant */}
        {variant === 'list' ? renderList() : variant === 'icons' ? renderIcons() : variant === 'cards' ? renderCards() : renderGrid()}
      </div>
    </section>
  );
}
