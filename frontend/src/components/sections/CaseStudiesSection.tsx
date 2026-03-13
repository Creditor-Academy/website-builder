import React from 'react';
import { Briefcase, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

export function CaseStudiesSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles } = section;

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  const handleCaseEdit = (index, field, value) => {
    if (onContentChange && isEditing) {
      const updatedCases = [...content.cases];
      updatedCases[index] = { ...updatedCases[index], [field]: value };
      onContentChange('cases', updatedCases);
    }
  };

  const sectionStyle = {
    backgroundColor: styles.backgroundColor || '#0f172a',
    padding: styles.padding || '110px 0',
    color: styles.color || '#e2e8f0',
  };

  const accentColor = content.accentColor || '#ffffff';

  return (
    <section 
      id={section.id}
      className={`relative transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={sectionStyle}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ color: '#ffffff', fontFamily: 'Playfair Display' }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('headline', e)}
          >
            {content.headline}
          </h2>
          <p 
            className="text-xl opacity-80"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextEdit('subheadline', e)}
          >
            {content.subheadline}
          </p>
          <div className="w-20 h-1 mt-8" style={{ backgroundColor: accentColor }}></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.cases.map((item, index) => (
            <div 
              key={item.id || index}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: accentColor }}>
                  {item.industry}
                </span>
                <span className="text-2xl font-bold" style={{ color: accentColor }}>
                  {item.metric}
                </span>
              </div>
              
              <h3 
                className="text-2xl font-bold mb-4 text-white"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleCaseEdit(index, 'client', e.currentTarget.textContent)}
              >
                {item.client}
              </h3>
              
              <div className="mb-6 flex-grow">
                <p className="text-sm opacity-50 mb-2 uppercase font-bold tracking-tighter">The Challenge</p>
                <p 
                  className="text-sm opacity-80 mb-6 leading-relaxed"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleCaseEdit(index, 'challenge', e.currentTarget.textContent)}
                >
                  {item.challenge}
                </p>
                
                <p className="text-sm opacity-50 mb-2 uppercase font-bold tracking-tighter">The Result</p>
                <p 
                  className="text-sm font-medium text-white leading-relaxed"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleCaseEdit(index, 'result', e.currentTarget.textContent)}
                >
                  {item.result}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center gap-2 group-hover:gap-4 transition-all duration-300 text-sm font-bold uppercase tracking-widest cursor-pointer" style={{ color: accentColor }}>
                Full Case Study <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
