import React from 'react';
import { ExternalLink } from 'lucide-react';

export function GallerySection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'grid' } = section;
  const images = content.images || [];
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';

  return (
    <section
      className="relative"
      style={{
        background,
        padding: styles.padding || '100px 0',
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
            {content.headline || 'Our Portfolio'}
          </h2>
          <p 
            className="text-lg opacity-80"
            style={{ color: paragraphColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}
          >
            {content.subheadline || 'A showcase of our finest work'}
          </p>
        </div>

        {/* Gallery - variant rendering */}
        {variant === 'carousel' ? (
          <div className="flex gap-4 overflow-x-auto py-2">
            {images.map((image, index) => (
              <div key={image.id || index} className="min-w-[320px] rounded-2xl overflow-hidden relative">
                <img src={image.url} alt={image.title} className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 text-white">
                  <h4 
                    className="font-semibold"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.images.map((img) => img.id === image.id ? { ...img, title: e.currentTarget.textContent } : img);
                      onContentChange('images', updated);
                    }}
                  >
                    {image.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        ) : variant === 'masonry' ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="relative group mb-4 break-inside-avoid overflow-hidden rounded-2xl"
              >
                <img
                  src={image.url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 
                      className="text-white font-semibold"
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updated = content.images.map((img) => img.id === image.id ? { ...img, title: e.currentTarget.textContent } : img);
                        onContentChange('images', updated);
                      }}
                    >
                      {image.title}
                    </h4>
                    <p 
                      className="text-white/70 text-sm"
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updated = content.images.map((img) => img.id === image.id ? { ...img, category: e.currentTarget.textContent } : img);
                        onContentChange('images', updated);
                      }}
                    >
                      {image.category}
                    </p>
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className={`relative group overflow-hidden rounded-2xl ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 
                      className="text-white font-semibold"
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updated = content.images.map((img) => img.id === image.id ? { ...img, title: e.currentTarget.textContent } : img);
                        onContentChange('images', updated);
                      }}
                    >
                      {image.title}
                    </h4>
                    <p 
                      className="text-white/70 text-sm"
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (!isEditing || !onContentChange) return;
                        const updated = content.images.map((img) => img.id === image.id ? { ...img, category: e.currentTarget.textContent } : img);
                        onContentChange('images', updated);
                      }}
                    >
                      {image.category}
                    </p>
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
