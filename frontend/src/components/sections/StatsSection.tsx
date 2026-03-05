import React from 'react';
export function StatsSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const stats = content.stats || [];
  const variant = section.variant || 'horizontal';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)');
  const padding = styles.padding || '80px 0';

  if (variant === 'cards') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="bg-white rounded-2xl p-6 text-center">
                <div 
                  className="text-4xl font-bold mb-2 text-slate-900"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.stats.map((s) => s.id === stat.id ? { ...s, value: e.currentTarget.textContent } : s);
                    onContentChange('stats', updated);
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm text-slate-500 uppercase tracking-wider"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.stats.map((s) => s.id === stat.id ? { ...s, label: e.currentTarget.textContent } : s);
                    onContentChange('stats', updated);
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'counter') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-white mb-2">
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.stats.map((s) => s.id === stat.id ? { ...s, value: e.currentTarget.textContent } : s);
                      onContentChange('stats', updated);
                    }}
                  >
                    {stat.value}
                  </span>
                  <span 
                    className="text-blue-400"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.stats.map((s) => s.id === stat.id ? { ...s, suffix: e.currentTarget.textContent } : s);
                      onContentChange('stats', updated);
                    }}
                  >
                    {stat.suffix || ''}
                  </span>
                </div>
                <div 
                  className="text-slate-300 text-sm uppercase tracking-wider"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.stats.map((s) => s.id === stat.id ? { ...s, label: e.currentTarget.textContent } : s);
                    onContentChange('stats', updated);
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // default horizontal
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.id || index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.stats.map((s) => s.id === stat.id ? { ...s, value: e.currentTarget.textContent } : s);
                    onContentChange('stats', updated);
                  }}
                >
                  {stat.value}
                </span>
                <span 
                  className="text-blue-400"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.stats.map((s) => s.id === stat.id ? { ...s, suffix: e.currentTarget.textContent } : s);
                    onContentChange('stats', updated);
                  }}
                >
                  {stat.suffix || ''}
                </span>
              </div>
              <div 
                className="text-slate-400 text-sm uppercase tracking-wider"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.stats.map((s) => s.id === stat.id ? { ...s, label: e.currentTarget.textContent } : s);
                  onContentChange('stats', updated);
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
