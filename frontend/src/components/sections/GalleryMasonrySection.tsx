import React from 'react';

export function GalleryMasonrySection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles } = section;

  const addImage = () => {
    if (!onContentChange) return;
    const url = window.prompt('Enter image URL', 'https://images.unsplash.com/photo-');
    if (!url) return;
    const newImage = { id: Date.now().toString(), url, title: 'New Image' };
    onContentChange('images', [...(content.images || []), newImage]);
  };

  const editImage = (id) => {
    const img = content.images.find((i) => i.id === id);
    if (!img) return;
    const url = window.prompt('Edit image URL', img.url || '');
    if (url !== null) onContentChange('images', content.images.map((i) => (i.id === id ? { ...i, url } : i)));
  };

  const editTitle = (id, text) => {
    onContentChange('images', content.images.map((i) => (i.id === id ? { ...i, title: text } : i)));
  };

  const removeImage = (id) => {
    onContentChange('images', content.images.filter((i) => i.id !== id));
  };

  return (
    <section className={`${isSelected ? 'ring-2 ring-primary' : ''} py-12`} style={{ background: styles.backgroundColor, padding: styles.padding }}>
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(content.images || []).map((img) => (
              <div key={img.id} className="rounded overflow-hidden shadow-sm relative">
                <img src={img.url} alt={img.title} className="w-full h-48 object-cover" />
                {isEditing && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => editImage(img.id)} className="bg-primary text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => removeImage(img.id)} className="bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                  </div>
                )}
                <div className="p-3">
                  <p className="font-medium" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => editTitle(img.id, e.currentTarget.textContent || '')}>{img.title}</p>
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="mt-6">
              <button onClick={addImage} className="px-4 py-2 rounded bg-primary text-white">Add Image</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
