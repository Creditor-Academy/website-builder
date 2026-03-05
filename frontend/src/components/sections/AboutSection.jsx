import React from 'react';
import { Target, Eye, Heart, Award, Users } from 'lucide-react';

const iconMap = {
  Target,
  Eye,
  Heart,
  Award,
  Users,
};

export function AboutSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'split' } = section;

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  const background = styles.useGradient 
    ? (styles.backgroundGradient || styles.backgroundColor) 
    : (styles.backgroundColor || '#ffffff');

  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#475569';

  const sectionStyle = {
    background,
    padding: styles.padding || '100px 0',
  };

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Target className="w-6 h-6" />;
  };

  // Split variant - image on one side, content on the other
  const renderSplit = () => (
    <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${content.imagePosition === 'right' ? '' : 'lg:grid-flow-dense'}`}>
      {/* Content Side */}
      <div className={content.imagePosition === 'right' ? 'order-1' : 'order-2 lg:order-1'}>
        {content.badge && (
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff'
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('badge', e)}
          >
            {content.badge}
          </span>
        )}
        
        <h2 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          style={{ color: headingColor }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('headline', e)}
        >
          {content.headline}
        </h2>
        
        <p 
          className="text-lg leading-relaxed mb-8 opacity-80"
          style={{ color: paragraphColor }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('description', e)}
        >
          {content.description}
        </p>

        {/* Values/Features List */}
        {content.values && content.values.length > 0 && (
          <div className="space-y-4">
            {content.values.map((value, index) => (
              <div 
                key={value.id || index}
                className="flex items-start gap-4 group"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff'
                  }}
                >
                  {getIcon(value.icon)}
                </div>
                <div>
                  <h4 
                    className="font-semibold mb-1"
                    style={{ color: headingColor }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.values.map((v, i) =>
                        i === index ? { ...v, title: e.currentTarget.textContent } : v
                      );
                      onContentChange('values', updated);
                    }}
                  >
                    {value.title}
                  </h4>
                  <p 
                    className="text-sm opacity-70"
                    style={{ color: paragraphColor }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.values.map((v, i) =>
                        i === index ? { ...v, description: e.currentTarget.textContent } : v
                      );
                      onContentChange('values', updated);
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Image Side */}
      <div className={`relative ${content.imagePosition === 'right' ? 'order-2' : 'order-1 lg:order-2'}`}>
        <div
          className={`relative rounded-2xl overflow-hidden shadow-2xl ${isEditing ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (!isEditing || !onContentChange) return;
            const url = window.prompt('Enter image URL', content.imageUrl || 'https://');
            if (url !== null) onContentChange('imageUrl', url);
          }}
          title={isEditing ? 'Click to change image URL' : undefined}
        >
          <img 
            src={content.imageUrl}
            alt={content.imageAlt || 'About us'}
            className="w-full h-auto object-cover"
          />
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-60" />
        </div>
        
        {/* Decorative elements */}
        <div 
          className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl -z-10"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
        />
        <div 
          className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full -z-10 opacity-20"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)' }}
        />
      </div>
    </div>
  );

  // Centered variant - image above content
  const renderCentered = () => (
    <div className="max-w-4xl mx-auto text-center">
      {/* Image */}
      <div
        className={`relative mb-12 rounded-2xl overflow-hidden shadow-2xl ${isEditing ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (!isEditing || !onContentChange) return;
          const url = window.prompt('Enter image URL', content.imageUrl || 'https://');
          if (url !== null) onContentChange('imageUrl', url);
        }}
        title={isEditing ? 'Click to change image URL' : undefined}
      >
        <img 
          src={content.imageUrl}
          alt={content.imageAlt || 'About us'}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {content.badge && (
        <span 
          className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: '#ffffff'
          }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('badge', e)}
        >
          {content.badge}
        </span>
      )}
      
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
        className="text-lg leading-relaxed mb-10 opacity-80 max-w-3xl mx-auto"
        style={{ color: paragraphColor }}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={(e) => handleTextEdit('description', e)}
      >
        {content.description}
      </p>

      {/* Values Grid */}
      {content.values && content.values.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {content.values.map((value, index) => (
            <div 
              key={value.id || index}
              className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ background: '#f8fafc' }}
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#ffffff'
                }}
              >
                {getIcon(value.icon)}
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: headingColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.values.map((v, i) =>
                    i === index ? { ...v, title: e.currentTarget.textContent } : v
                  );
                  onContentChange('values', updated);
                }}
              >
                {value.title}
              </h4>
              <p 
                className="text-sm opacity-70"
                style={{ color: paragraphColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.values.map((v, i) =>
                    i === index ? { ...v, description: e.currentTarget.textContent } : v
                  );
                  onContentChange('values', updated);
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );

  // Cards variant - story cards layout
  const renderCards = () => (
    <div>
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        {content.badge && (
          <span 
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff'
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('badge', e)}
          >
            {content.badge}
          </span>
        )}
        
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
          className="text-lg opacity-80"
          style={{ color: paragraphColor }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => handleTextEdit('description', e)}
        >
          {content.description}
        </p>
      </div>

      {/* Main Content Card with Image */}
      <div className="grid lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-xl">
          <img 
            src={content.imageUrl}
            alt={content.imageAlt || 'About us'}
            className="w-full h-full object-cover min-h-[300px]"
          />
        </div>
        
        <div className="lg:col-span-2 flex flex-col justify-center">
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: headingColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('storyTitle', e)}
          >
            {content.storyTitle || 'Our Story'}
          </h3>
          <p 
            className="opacity-80 leading-relaxed"
            style={{ color: paragraphColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('storyContent', e)}
          >
            {content.storyContent || content.description}
          </p>
        </div>
      </div>

      {/* Values Cards */}
      {content.values && content.values.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.values.map((value, index) => (
            <div 
              key={value.id || index}
              className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100"
              style={{ background: '#ffffff' }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  color: '#ffffff'
                }}
              >
                {getIcon(value.icon)}
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: headingColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.values.map((v, i) =>
                    i === index ? { ...v, title: e.currentTarget.textContent } : v
                  );
                  onContentChange('values', updated);
                }}
              >
                {value.title}
              </h4>
              <p 
                className="text-sm opacity-70"
                style={{ color: paragraphColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.values.map((v, i) =>
                    i === index ? { ...v, description: e.currentTarget.textContent } : v
                  );
                  onContentChange('values', updated);
                }}
              >
                {value.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section 
      className={`relative transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
      }`}
      style={sectionStyle}
    >
      <div className="container mx-auto px-6">
        {variant === 'centered' ? renderCentered() : variant === 'cards' ? renderCards() : renderSplit()}
      </div>
    </section>
  );
}

