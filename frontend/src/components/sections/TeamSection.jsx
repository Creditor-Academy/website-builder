import React from 'react';
import { Linkedin, Twitter, Github } from 'lucide-react';
export function TeamSection({ section, isEditing, onContentChange }) {
  const { content, styles } = section;
  const members = content.members || [];
  const variant = section.variant || 'grid';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');
  const padding = styles.padding || '100px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';
  
  const getSocialIcon = (platform) => { switch (platform) { case 'linkedin': return Linkedin; case 'twitter': return Twitter; case 'github': return Github; default: return Linkedin; } };

  if (variant === 'carousel') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Meet Our Team'}</h2>
            <p className="text-lg opacity-80" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || 'The talented people behind our success'}</p>
          </div>
          <div className="overflow-x-auto whitespace-nowrap py-4 hide-scrollbar">
            {members.map((member, index) => (
              <div key={member.id || index} className="inline-block w-64 mr-4 text-center bg-white rounded-2xl p-4">
                <img src={member.avatar} alt={member.name} className="w-28 h-28 rounded-full mx-auto object-cover mb-4" />
                <h4 
                  className="font-semibold"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.members.map((m) => m.id === member.id ? { ...m, name: e.currentTarget.textContent } : m);
                    onContentChange('members', updated);
                  }}
                >
                  {member.name}
                </h4>
                <p 
                  className="text-sm text-slate-500"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    if (!isEditing || !onContentChange) return;
                    const updated = content.members.map((m) => m.id === member.id ? { ...m, role: e.currentTarget.textContent } : m);
                    onContentChange('members', updated);
                  }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'list') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Meet Our Team'}</h2>
            <p className="text-lg opacity-80" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || 'The talented people behind our success'}</p>
          </div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 bg-white rounded-xl p-4">
                <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h4 
                    className="font-semibold"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.members.map((m) => m.id === member.id ? { ...m, name: e.currentTarget.textContent } : m);
                      onContentChange('members', updated);
                    }}
                  >
                    {member.name}
                  </h4>
                  <p 
                    className="text-sm text-slate-500"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = content.members.map((m) => m.id === member.id ? { ...m, role: e.currentTarget.textContent } : m);
                      onContentChange('members', updated);
                    }}
                  >
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // default grid
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: headingColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Meet Our Team'}</h2>
          <p className="text-lg opacity-80" style={{ color: paragraphColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || 'The talented people behind our success'}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div key={member.id || index} className="group text-center">
              <div className="relative mb-6 overflow-hidden rounded-3xl">
                <img src={member.avatar} alt={member.name} className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <div className="flex gap-3">
                    {(member.social || []).map((s, i) => { 
                      const Icon = getSocialIcon(s.platform); 
                      return (
                        <a key={i} href={s.url} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30">
                          <Icon className="w-5 h-5" />
                        </a>
                      ); 
                    })}
                  </div>
                </div>
              </div>
              <h4 
                className="font-semibold text-lg text-slate-900 mb-1"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.members.map((m) => m.id === member.id ? { ...m, name: e.currentTarget.textContent } : m);
                  onContentChange('members', updated);
                }}
              >
                {member.name}
              </h4>
              <p 
                className="text-blue-600 text-sm font-medium"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  if (!isEditing || !onContentChange) return;
                  const updated = content.members.map((m) => m.id === member.id ? { ...m, role: e.currentTarget.textContent } : m);
                  onContentChange('members', updated);
                }}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
