import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export function ContactSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles } = section;
  const variant = section.variant || 'split';
  const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#f8fafc');
  const padding = styles.padding || '100px 0';
  
  // Get text colors with fallbacks
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';
  
  // Get button colors with fallbacks
  const buttonPrimaryBg = styles.buttonPrimaryBg || 'linear-gradient(to right, #2563eb, #9333ea)';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';

  if (variant === 'centered') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: headingColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Get In Touch'}</h2>
            <p className="text-lg opacity-80" style={{ color: paragraphColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || "We'd love to hear from you."}</p>
          </div>

          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelFirstName', e.currentTarget.textContent)}>{content.labelFirstName || 'First Name'}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="John" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelLastName', e.currentTarget.textContent)}>{content.labelLastName || 'Last Name'}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="Doe" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelEmail', e.currentTarget.textContent)}>{content.labelEmail || 'Email'}</label><input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelMessage', e.currentTarget.textContent)}>{content.labelMessage || 'Message'}</label><textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none" placeholder="Your message..." /></div>
              <button type="submit" className="w-full py-4 font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2" style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}><Send className="w-5 h-5" /><span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('buttonText', e.currentTarget.textContent)}>{content.buttonText || 'Send Message'}</span></button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'map') {
    return (
      <section className="relative" style={{ background, padding }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: headingColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Get In Touch'}</h2>
            <p className="text-lg opacity-80" style={{ color: paragraphColor }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || "We'd love to hear from you."}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">First Name</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="John" /></div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="Doe" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Email</label><input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="john@example.com" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2">Message</label><textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none" placeholder="Your message..." /></div>
                <button type="submit" className="w-full py-4 font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2" style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}><Send className="w-5 h-5" />Send Message</button>
              </form>
            </div>
            <div className="rounded-3xl overflow-hidden bg-white/5">
              {content.mapEmbed ? (
                <iframe title="map" src={content.mapEmbed} className="w-full h-full min-h-[360px] border-0" />
              ) : (
                <div 
                  className="w-full h-[360px] flex items-center justify-center text-muted-foreground"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('mapPlaceholder', e.currentTarget.textContent)}
                >
                  {content.mapPlaceholder || 'Add a Map Embed URL in the Properties panel (e.g., Google Maps iframe URL)'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // default split
  return (
    <section className="relative" style={{ background, padding }}>
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0f172a' }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('headline', e.currentTarget.textContent)}>{content.headline || 'Get In Touch'}</h2>
          <p className="text-lg opacity-80" style={{ color: '#64748b' }} contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('subheadline', e.currentTarget.textContent)}>{content.subheadline || "We'd love to hear from you."}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail className="w-6 h-6 text-blue-600" /></div>
              <div>
                <h4 
                  className="font-semibold text-slate-900 mb-1"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('labelEmailUs', e.currentTarget.textContent)}
                >
                  {content.labelEmailUs || 'Email Us'}
                </h4>
                <p 
                  className="text-slate-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('email', e.currentTarget.textContent)}
                >
                  {content.email || 'hello@example.com'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone className="w-6 h-6 text-green-600" /></div>
              <div>
                <h4 
                  className="font-semibold text-slate-900 mb-1"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('labelCallUs', e.currentTarget.textContent)}
                >
                  {content.labelCallUs || 'Call Us'}
                </h4>
                <p 
                  className="text-slate-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('phone', e.currentTarget.textContent)}
                >
                  {content.phone || '+1 (555) 123-4567'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin className="w-6 h-6 text-purple-600" /></div>
              <div>
                <h4 
                  className="font-semibold text-slate-900 mb-1"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('labelVisitUs', e.currentTarget.textContent)}
                >
                  {content.labelVisitUs || 'Visit Us'}
                </h4>
                <p 
                  className="text-slate-600"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onContentChange?.('address', e.currentTarget.textContent)}
                >
                  {content.address || '123 Business St'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelFirstName', e.currentTarget.textContent)}>{content.labelFirstName || 'First Name'}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="John" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelLastName', e.currentTarget.textContent)}>{content.labelLastName || 'Last Name'}</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="Doe" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelEmail', e.currentTarget.textContent)}>{content.labelEmail || 'Email'}</label><input type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none" placeholder="john@example.com" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2" contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('labelMessage', e.currentTarget.textContent)}>{content.labelMessage || 'Message'}</label><textarea rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none" placeholder="Your message..." /></div>
              <button type="submit" className="w-full py-4 font-semibold rounded-xl hover:opacity-90 flex items-center justify-center gap-2" style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}><Send className="w-5 h-5" /><span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => onContentChange?.('buttonText', e.currentTarget.textContent)}>{content.buttonText || 'Send Message'}</span></button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
