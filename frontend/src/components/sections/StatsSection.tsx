import React from 'react';

export function StatsSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const stats = content.stats || [];
  const variant = section.variant || 'horizontal';
  
  // Enhanced default gradient for a more premium look
  const background = styles.useGradient 
    ? (styles.backgroundGradient || styles.backgroundColor) 
    : (styles.backgroundColor || 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)');
  
  const padding = styles.padding || '100px 0';

  // Helper to maintain your exact logic while keeping the JSX clean
  const updateField = (id, field, newValue) => {
    if (!isEditing || !onContentChange) return;
    const updated = content.stats.map((s) => 
      s.id === id ? { ...s, [field]: newValue } : s
    );
    onContentChange('stats', updated);
  };

  // --- VARIANT: CARDS (Modern Glassmorphism) ---
  if (variant === 'cards') {
    return (
      <section className="relative overflow-hidden" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.id || index} 
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 transition-all hover:bg-white/10 hover:-translate-y-2 shadow-2xl"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div 
                  className="text-5xl font-black mb-2 text-white tracking-tight"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(stat.id, 'value', e.currentTarget.textContent)}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(stat.id, 'label', e.currentTarget.textContent)}
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

  // --- VARIANT: COUNTER (Bold Focus) ---
  if (variant === 'counter') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="flex flex-col items-center">
                <div className="relative">
                  <span
                    className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-none"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField(stat.id, 'value', e.currentTarget.textContent)}
                  >
                    {stat.value}
                  </span>
                  <span 
                    className="text-3xl font-bold text-blue-500 absolute -top-2 -right-6"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField(stat.id, 'suffix', e.currentTarget.textContent)}
                  >
                    {stat.suffix || ''}
                  </span>
                </div>
                <div 
                  className="mt-4 text-slate-400 text-sm font-medium uppercase tracking-[0.3em] text-center"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(stat.id, 'label', e.currentTarget.textContent)}
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

  // --- DEFAULT: HORIZONTAL (Minimalist Split) ---
  return (
    <section className="relative border-y border-white/5" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 lg:gap-4">
          {stats.map((stat, index) => (
            <React.Fragment key={stat.id || index}>
              <div className="text-center px-8">
                <div className="flex items-center justify-center gap-1">
                  <span
                    className="text-6xl font-bold text-white tracking-tighter"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField(stat.id, 'value', e.currentTarget.textContent)}
                  >
                    {stat.value}
                  </span>
                  <span 
                    className="text-4xl font-light text-blue-400/80"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField(stat.id, 'suffix', e.currentTarget.textContent)}
                  >
                    {stat.suffix || ''}
                  </span>
                </div>
                <div 
                  className="mt-2 text-slate-500 text-xs font-black uppercase tracking-widest"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => updateField(stat.id, 'label', e.currentTarget.textContent)}
                >
                  {stat.label}
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden lg:block h-12 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}