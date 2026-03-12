import React from 'react';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { ServicesSection } from './ServicesSection';
import { CTASection } from './CTASection';
import { TestimonialsSection } from './TestimonialsSection';
import { PricingSection } from './PricingSection';
import { GallerySection } from './GallerySection';
import { GalleryMasonrySection } from './GalleryMasonrySection';
import { BlogListSection } from './BlogListSection';
import { ContactSection } from './ContactSection';
import { StatsSection } from './StatsSection';
import { TeamSection } from './TeamSection';
import { FAQSection } from './FAQSection';
import { LogoCloudSection } from './LogoCloudSection';
import { ContentSection } from './ContentSection';
import { AboutSection } from './AboutSection';
import { LayoutSection } from './LayoutSection';
import { TextBlock } from './TextBlock';
import { ButtonBlock } from './ButtonBlock';
import { HTMLBlock } from './HTMLBlock';
import { useBuilder } from '@/contexts/BuilderContext';
import { Trash2, ChevronUp, ChevronDown, Bold, Italic, Palette, Type } from 'lucide-react';

const FloatingComponent = ({ component, section, isSelected, isEditing, editor, updateComponent, deleteComponent, selectComponent, selectSection }) => {
  const [isEditingText, setIsEditingText] = React.useState(false);
  const contentRef = React.useRef(null);
  const dragInfo = React.useRef({ startX: 0, startY: 0, moved: false });

  const handleDragStart = (e) => {
    if (editor.previewMode || isEditingText) return;

    // Check if clicking a select/button in the toolbar
    if (e.target.closest('button') || e.target.closest('select')) return;

    e.stopPropagation();
    selectSection(section.id);
    selectComponent(component.id);

    dragInfo.current = {
      startX: e.clientX - (component.position?.x || 0),
      startY: e.clientY - (component.position?.y || 0),
      moved: false
    };

    const handleDragMove = (moveEvent) => {
      dragInfo.current.moved = true;
      const newX = moveEvent.clientX - dragInfo.current.startX;
      const newY = moveEvent.clientY - dragInfo.current.startY;
      updateComponent(section.id, component.id, {
        position: { x: newX, y: newY }
      });
    };

    const handleDragEnd = (endEvent) => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);

      // If we didn't move much, treat it as a click
      const deltaX = Math.abs(endEvent.clientX - (dragInfo.current.startX + (component.position?.x || 0)));
      const deltaY = Math.abs(endEvent.clientY - (dragInfo.current.startY + (component.position?.y || 0)));

      if (!dragInfo.current.moved || (deltaX < 5 && deltaY < 5)) {
        // If already selected, enter edit mode
        if (editor.selectedComponentId === component.id && component.type === 'text') {
          setIsEditingText(true);
          setTimeout(() => contentRef.current?.focus(), 10);
        }
      }
    };

    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  };

  const handleStyleChange = (updates) => {
    updateComponent(section.id, component.id, {
      style: { ...(component.style || {}), ...updates }
    });
  };

  return (
    <div
      onMouseDown={handleDragStart}
      onClick={(e) => {
        e.stopPropagation(); // CRITICAL: Prevent SectionRenderer from clearing selection
        selectSection(section.id);
        selectComponent(component.id);
      }}
      onDoubleClick={() => {
        if (component.type === 'text') {
          setIsEditingText(true);
          setTimeout(() => {
            contentRef.current?.focus();
            // Put cursor at end
            const range = document.createRange();
            const sel = window.getSelection();
            if (contentRef.current.childNodes.length > 0) {
              range.setStartAfter(contentRef.current.lastChild);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }
          }, 10);
        }
      }}
      className={`absolute group/comp transition-shadow duration-200 ${!editor.previewMode ? 'cursor-move' : ''} ${isSelected && !editor.previewMode ? 'ring-2 ring-primary ring-offset-4 rounded-sm shadow-xl' : ''
        }`}
      style={{
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        zIndex: isSelected ? 50 : 10,
        ...(component.style || {})
      }}
    >
      {component.type === 'text' && (
        <div
          ref={contentRef}
          className={`outline-none min-w-[50px] whitespace-nowrap p-1 transition-all ${isEditingText ? 'cursor-text bg-white/50 backdrop-blur-sm rounded' : 'cursor-move'}`}
          contentEditable={isEditing && isSelected && isEditingText}
          suppressContentEditableWarning
          onBlur={(e) => {
            // Check if we blurred to something in the toolbar
            const relatedTarget = e.relatedTarget;
            if (relatedTarget?.closest('.comp-toolbar')) return;

            setIsEditingText(false);
            updateComponent(section.id, component.id, {
              content: { ...component.content, text: e.target.innerHTML }
            });
          }}
          onMouseDown={(e) => {
            if (isEditingText) e.stopPropagation();
          }}
          style={{
            color: component.style?.color || 'inherit',
            fontSize: component.style?.fontSize || '24px',
            fontWeight: component.style?.fontWeight || 'normal',
            fontFamily: component.style?.fontFamily || 'Inter',
            fontStyle: component.style?.fontStyle || 'normal',
            letterSpacing: component.style?.letterSpacing || 'normal',
          }}
          dangerouslySetInnerHTML={{ __html: component.content?.text || 'Edit text' }}
        />
      )}
      {component.type === 'image' && (
        <img
          src={component.content?.imageUrl}
          alt="Component"
          className="max-w-full h-auto pointer-events-none select-none"
          style={{
            width: component.style?.width || 'auto',
            borderRadius: component.style?.borderRadius || '0px'
          }}
        />
      )}

      {isEditing && isSelected && (
        <div
          className="comp-toolbar absolute -top-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-200 p-2.5 flex items-center gap-2 z-[70] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300 ring-1 ring-black/5"
          onMouseDown={(e) => e.stopPropagation()} // Prevent dragging
          onClick={(e) => e.stopPropagation()} // Prevent clearing selection
        >
          {component.type === 'text' && (
            <>
              <div className="flex flex-col gap-0.5 px-2 text-left border-r border-slate-100 pr-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Typography</span>
                <select
                  className="text-[11px] font-bold bg-slate-50 hover:bg-slate-100 rounded-lg px-2 h-8 border-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors"
                  value={component.style?.fontFamily || 'Inter'}
                  onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
                >
                  {['Inter', 'Poppins', 'Playfair Display', 'Bebas Neue', 'Montserrat', 'Pacifico', 'JetBrains Mono'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-0.5 px-1 border-r border-slate-100 pr-3">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Size</span>
                <select
                  className="text-[11px] font-bold bg-slate-50 hover:bg-slate-100 rounded-lg px-2 h-8 border-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors"
                  value={component.style?.fontSize || '24px'}
                  onChange={(e) => handleStyleChange({ fontSize: e.target.value })}
                >
                  {['12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px', '64px', '96px'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleStyleChange({ fontWeight: component.style?.fontWeight === 'bold' ? 'normal' : 'bold' })}
                  className={`p-2 rounded-lg transition-all ${component.style?.fontWeight === 'bold' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'}`}
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleStyleChange({ fontStyle: component.style?.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`p-2 rounded-lg transition-all ${component.style?.fontStyle === 'italic' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:bg-white/50'}`}
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
              </div>

              <div className="relative group/color">
                <button
                  className="p-2 rounded-xl hover:bg-slate-50 text-slate-500 flex items-center gap-2 border border-slate-100 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: component.style?.color || '#000000' }} />
                  <Palette className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 hidden group-hover/color:grid grid-cols-5 gap-2.5 z-[80] animate-in fade-in slide-in-from-top-2 duration-200">
                  {['#000000', '#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#64748b', '#ec4899', '#f43f5e', '#14b8a6', '#475569', '#06b6d4', '#84cc16', '#fb7185'].map(c => (
                    <div
                      key={c}
                      onClick={() => handleStyleChange({ color: c })}
                      className="w-6 h-6 rounded-lg hover:scale-125 transition-transform cursor-pointer border border-slate-200 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {component.type === 'image' && (
            <div className="flex flex-col gap-0.5 px-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Image Width</span>
              <select
                className="text-[11px] font-bold bg-slate-50 hover:bg-slate-100 rounded-lg px-2 h-8 border-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-colors"
                value={component.style?.width || '200px'}
                onChange={(e) => handleStyleChange({ width: e.target.value })}
              >
                {['100px', '200px', '300px', '400px', '500px', '600px', '800px', '100%'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="w-px h-8 bg-slate-100 mx-1" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStyleChange({ zIndex: (component.style?.zIndex || 10) + 10 })}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
              title="Bring to Front"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleStyleChange({ zIndex: Math.max(0, (component.style?.zIndex || 10) - 10) })}
              className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
              title="Send to Back"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); deleteComponent(section.id, component.id); }}
              className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {isEditingText && (
            <button
              onClick={() => {
                setIsEditingText(false);
                contentRef.current?.blur();
              }}
              className="ml-2 px-3 py-1.5 bg-primary text-white text-[11px] font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Done
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export function SectionRenderer({ section, isSelected, isEditing, onContentChange }) {
  const { updateComponent, deleteComponent, selectComponent, selectSection, state } = useBuilder();
  const { editor } = state;

  const commonProps = { section, isSelected, isEditing, onContentChange };

  const renderBaseSection = () => {
    switch (section.type) {
      case 'hero': return <HeroSection {...commonProps} />;
      case 'features': return <FeaturesSection {...commonProps} />;
      case 'services': return <ServicesSection {...commonProps} />;
      case 'cta': return <CTASection {...commonProps} />;
      case 'testimonials': return <TestimonialsSection {...commonProps} />;
      case 'pricing': return <PricingSection {...commonProps} />;
      case 'gallery': return <GallerySection {...commonProps} />;
      case 'gallery-masonry': return <GalleryMasonrySection {...commonProps} />;
      case 'blog': return <BlogListSection {...commonProps} />;
      case 'contact': return <ContactSection {...commonProps} />;
      case 'stats': return <StatsSection {...commonProps} />;
      case 'team': return <TeamSection {...commonProps} />;
      case 'faq': return <FAQSection {...commonProps} />;
      case 'logocloud': return <LogoCloudSection {...commonProps} />;
      case 'content': return <ContentSection {...commonProps} />;
      case 'about': return <AboutSection {...commonProps} />;
      case 'layout': return <LayoutSection {...commonProps} />;
      case 'text': return <TextBlock {...commonProps} />;
      case 'button': return <ButtonBlock {...commonProps} />;
      case 'html': return <HTMLBlock {...commonProps} />;
      default: return <div className="p-10 text-center">Section: {section.name}</div>;
    }
  };

  return (
    <div className="relative group/section">
      {renderBaseSection()}

      {/* Absolute components overlay */}
      {!editor.previewMode && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {(section.components || []).map(comp => (
            <div key={comp.id} className="pointer-events-auto">
              <FloatingComponent
                component={comp}
                section={section}
                isSelected={editor.selectedComponentId === comp.id}
                isEditing={isEditing}
                editor={editor}
                updateComponent={updateComponent}
                deleteComponent={deleteComponent}
                selectComponent={selectComponent}
                selectSection={selectSection}
              />
            </div>
          ))}
        </div>
      )}
      {editor.previewMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {(section.components || []).map(comp => (
            <div key={comp.id} style={{
              position: 'absolute',
              left: `${(comp.position.x / 1200) * 100}%`,
              top: `${(comp.position.y / 600) * 100}%`,
              zIndex: comp.style?.zIndex || 10,
              ...(comp.style || {})
            }}>
              {comp.type === 'text' && (
                <div
                  style={{
                    color: comp.style?.color || 'inherit',
                    fontSize: comp.style?.fontSize || '24px',
                    fontWeight: comp.style?.fontWeight || 'normal',
                    fontFamily: comp.style?.fontFamily || 'Inter',
                    fontStyle: comp.style?.fontStyle || 'normal',
                  }}
                  dangerouslySetInnerHTML={{ __html: comp.content.text }}
                />
              )}
              {comp.type === 'image' && (
                <img
                  src={comp.content.imageUrl}
                  style={{
                    width: comp.style?.width || 'auto',
                    borderRadius: comp.style?.borderRadius || '0px'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
