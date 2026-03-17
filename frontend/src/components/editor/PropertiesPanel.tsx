import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBuilder } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Type, Palette, Settings2, ChevronDown, Layout, Image as ImageIcon, Search, Users, Trash2, Plus, Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getVariantsForSection } from '@/lib/sectionVariants';
import { MediaLibrary } from './MediaLibrary';
import { Button } from '@/components/ui/button';
import { NavbarSettings } from './NavbarSettings';
import { FooterSettings } from './FooterSettings';

export function PropertiesPanel() {
  const { state, selectedSection, selectedComponent, updateSection, updateSectionStyles, selectSection, updateNavbar, updateFooter, updatePageSEO, updateComponent, deleteComponent, deleteSection } = useBuilder();
  const [contentOpen, setContentOpen] = useState(true);
  const [stylesOpen, setStylesOpen] = useState(true);
  const [layoutOpen, setLayoutOpen] = useState(true);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [footerOpen, setFooterOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(true);

  const [mediaOpen, setMediaOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState(null); // { sectionId, field, isStyle, itemId, listField }

  const variants = selectedSection ? getVariantsForSection(selectedSection.type) : [];

  const openMediaPicker = (sectionId, field, isStyle = false, itemId = null, listField = null) => {
    setActiveMediaField({ sectionId, field, isStyle, itemId, listField });
    setMediaOpen(true);
  };

  const handleMediaSelect = (url) => {
    if (!activeMediaField) return;
    const { sectionId, field, isStyle, itemId, listField } = activeMediaField;

    if (itemId === 'floating-comp') {
      updateComponent(sectionId, selectedComponent.id, {
        content: { ...selectedComponent.content, [field]: url }
      });
    } else if (isStyle) {
      updateSectionStyles(sectionId, { [field]: url });
    } else if (listField && itemId) {
      const section = sectionId === selectedSection?.id ? selectedSection : state.page.sections.find(s => s.id === sectionId);
      const updatedList = section.content[listField].map(item =>
        item.id === itemId ? { ...item, [field]: url } : item
      );
      updateSection(sectionId, { content: { ...section.content, [listField]: updatedList } });
    } else {
      const section = sectionId === selectedSection?.id ? selectedSection : state.page.sections.find(s => s.id === sectionId);
      updateSection(sectionId, { content: { ...section.content, [field]: url } });
    }
    setMediaOpen(false);
  };

  // Component Property Handlers
  const handleCompUpdate = (updates) => {
    if (selectedComponent && selectedSection) {
      updateComponent(selectedSection.id, selectedComponent.id, updates);
    }
  };

  const handleCompStyleUpdate = (styleUpdates) => {
    if (selectedComponent && selectedSection) {
      updateComponent(selectedSection.id, selectedComponent.id, {
        style: { ...(selectedComponent.style || {}), ...styleUpdates }
      });
    }
  };

  if (!selectedSection) {
    const { page } = state;
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-white to-slate-50/50">
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
              <Settings2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Page Settings</h2>
              <p className="text-xs text-slate-500 font-medium">Configure your active page</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <Collapsible open={seoOpen} onOpenChange={setSeoOpen} className="border-b border-slate-100 group">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Search className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-slate-700 block">SEO & Metadata</span>
                  <span className="text-xs text-slate-500">Optimize for search engines</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-all duration-200 text-slate-400 ${seoOpen ? 'rotate-180 text-primary' : ''} group-hover:text-primary`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 space-y-4 px-6 pb-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Page Title
                  </Label>
                  <Input
                    value={page.meta?.title || ''}
                    onChange={(e) => updatePageSEO(page.id, { title: e.target.value })}
                    className="bg-white border-slate-200 text-xs"
                    placeholder="e.g., Home | My Awesome Site"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Meta Description
                  </Label>
                  <Textarea
                    value={page.meta?.description || ''}
                    onChange={(e) => updatePageSEO(page.id, { description: e.target.value })}
                    className="bg-white border-slate-200 resize-none h-24 text-xs"
                    placeholder="Describe your page for search engines..."
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-primary/50 transition-all duration-200">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Index on Google
                      </Label>
                      <p className="text-[10px] text-slate-500">Allow search engines to find this page</p>
                    </div>
                    <Switch defaultChecked className="scale-110" />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={navbarOpen} onOpenChange={setNavbarOpen} className="border-b border-slate-100">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-slate-700">Global Navbar</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${navbarOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-0">
              <NavbarSettings
                navbar={page.navbar}
                pages={page ? [page] : []}
                onUpdate={(updates) => updateNavbar(updates)}
                isExpanded={true}
              />
            </CollapsibleContent>
          </Collapsible>

          <FooterSettings 
            footer={page.footer} 
            pages={page ? [page] : []}
            onUpdate={updateFooter}
            isExpanded={footerOpen}
          />
        </div>

        {/* <div className="p-4 bg-primary/5 m-4 rounded-xl border border-primary/10">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Publishing</h4>
          <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Changes are saved automatically to your local project. Ready to go live?</p>
          <Button className="w-full text-xs h-9 shadow-sm" onClick={() => alert('Publishing feature coming soon!')}>Publish Project</Button>
        </div> */}

        <MediaLibrary open={mediaOpen} onOpenChange={setMediaOpen} onSelect={handleMediaSelect} />
      </div>
    );
  }

  const handleContentChange = (field, value) => updateSection(selectedSection.id, { content: { ...selectedSection.content, [field]: value } });
  const handleStyleChange = (field, value) => updateSectionStyles(selectedSection.id, { [field]: value });

  const renderContentFields = () => {
    const { content } = selectedSection;
    switch (selectedSection.type) {
      case 'hero': case 'cta': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={3} /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Primary Button Text</Label><Input value={content.ctaText || ''} onChange={(e) => handleContentChange('ctaText', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          
          {/* Primary Button Routing */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Primary Button Route</Label>
            <div className="flex gap-2">
              <Select 
                value={content.primaryRouteType || 'none'} 
                onValueChange={(value) => handleContentChange('primaryRouteType', value)}
              >
                <SelectTrigger className="bg-white border-slate-200 h-8 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">None</SelectItem>
                  <SelectItem value="external" className="text-xs">External</SelectItem>
                  <SelectItem value="internal" className="text-xs">Internal</SelectItem>
                  <SelectItem value="email" className="text-xs">Email</SelectItem>
                  <SelectItem value="phone" className="text-xs">Phone</SelectItem>
                  <SelectItem value="anchor" className="text-xs">Anchor</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                value={content.primaryRouteUrl || ''} 
                onChange={(e) => handleContentChange('primaryRouteUrl', e.target.value)} 
                className="bg-white border-slate-200 text-xs flex-1 h-8" 
                placeholder={
                  content.primaryRouteType === 'email' ? 'mailto:example@email.com' :
                  content.primaryRouteType === 'phone' ? 'tel:+1234567890' :
                  content.primaryRouteType === 'anchor' ? '#section-id' :
                  content.primaryRouteType === 'internal' ? '/page-path' :
                  'https://example.com'
                }
              />
            </div>
          </div>

          <div className="space-y-2"><Label className="text-xs font-medium">Secondary Button Text</Label><Input value={content.ctaSecondaryText || ''} onChange={(e) => handleContentChange('ctaSecondaryText', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          
          {/* Secondary Button Routing */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Secondary Button Route</Label>
            <div className="flex gap-2">
              <Select 
                value={content.secondaryRouteType || 'none'} 
                onValueChange={(value) => handleContentChange('secondaryRouteType', value)}
              >
                <SelectTrigger className="bg-white border-slate-200 h-8 text-xs w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">None</SelectItem>
                  <SelectItem value="external" className="text-xs">External</SelectItem>
                  <SelectItem value="internal" className="text-xs">Internal</SelectItem>
                  <SelectItem value="email" className="text-xs">Email</SelectItem>
                  <SelectItem value="phone" className="text-xs">Phone</SelectItem>
                  <SelectItem value="anchor" className="text-xs">Anchor</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                value={content.secondaryRouteUrl || ''} 
                onChange={(e) => handleContentChange('secondaryRouteUrl', e.target.value)} 
                className="bg-white border-slate-200 text-xs flex-1 h-8" 
                placeholder={
                  content.secondaryRouteType === 'email' ? 'mailto:example@email.com' :
                  content.secondaryRouteType === 'phone' ? 'tel:+1234567890' :
                  content.secondaryRouteType === 'anchor' ? '#section-id' :
                  content.secondaryRouteType === 'internal' ? '/page-path' :
                  'https://example.com'
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Image URL</Label>
            <div className="flex gap-2">
              <Input value={content.imageUrl || ''} onChange={(e) => handleContentChange('imageUrl', e.target.value)} className="bg-white border-slate-200 flex-1 text-xs" placeholder="https://..." />
              <Button variant="outline" size="icon" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl')} className="shrink-0 h-9 w-9">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
          <div className="space-y-2"><Label className="text-xs font-medium">Video URL (Embed)</Label><Input value={content.videoUrl || ''} onChange={(e) => handleContentChange('videoUrl', e.target.value)} className="bg-white border-slate-200 text-xs" placeholder="https://www.youtube.com/embed/..." /></div>
        </div>
      );

      case 'about': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Badge</Label><Input value={content.badge || ''} onChange={(e) => handleContentChange('badge', e.target.value)} className="bg-white border-slate-200 text-xs" placeholder="About Us" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Description</Label><Textarea value={content.description || ''} onChange={(e) => handleContentChange('description', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={3} /></div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Image URL</Label>
            <div className="flex gap-2">
              <Input value={content.imageUrl || ''} onChange={(e) => handleContentChange('imageUrl', e.target.value)} className="bg-white border-slate-200 flex-1 text-xs" placeholder="https://..." />
              <Button variant="outline" size="icon" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl')} className="shrink-0 h-9 w-9">
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Image Position</Label>
            <Select value={content.imagePosition || 'right'} onValueChange={(value) => handleContentChange('imagePosition', value)}>
              <SelectTrigger className="bg-white border-slate-200 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left" className="text-xs">Left</SelectItem>
                <SelectItem value="right" className="text-xs">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

      case 'features': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={2} /></div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features List</Label>
            <div className="space-y-3">
              {(content.features || []).map((f) => (
                <div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2">
                    <Input value={f.title || ''} onChange={(e) => {
                      const updated = content.features.map(x => x.id === f.id ? { ...x, title: e.target.value } : x);
                      handleContentChange('features', updated);
                    }} placeholder="Title" className="text-xs font-bold h-8 flex-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => {
                      const updated = content.features.filter(x => x.id !== f.id);
                      handleContentChange('features', updated);
                    }}><X className="w-4 h-4" /></Button>
                  </div>
                  <Textarea value={f.description || ''} onChange={(e) => {
                    const updated = content.features.map(x => x.id === f.id ? { ...x, description: e.target.value } : x);
                    handleContentChange('features', updated);
                  }} placeholder="Description" className="text-[10px] resize-none leading-relaxed" rows={2} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8 border-dashed" onClick={() => {
                const newFeature = { id: uuidv4(), icon: 'Zap', title: 'New Feature', description: 'Feature description' };
                handleContentChange('features', [...(content.features || []), newFeature]);
              }}>+ Add Feature</Button>
            </div>
          </div>
        </div>
      );

      case 'services': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Services List</Label>
            <div className="space-y-3">
              {(content.services || []).map((s) => (
                <div key={s.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer shadow-sm relative group" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl', false, s.id, 'services')}>
                      {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 m-3 text-slate-300" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <Input value={s.title || ''} className="text-xs font-bold h-9 flex-1" onChange={(e) => {
                      const updated = content.services.map(x => x.id === s.id ? { ...x, title: e.target.value } : x);
                      handleContentChange('services', updated);
                    }} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => {
                      const updated = content.services.filter(x => x.id !== s.id);
                      handleContentChange('services', updated);
                    }}><X className="w-4 h-4" /></Button>
                  </div>
                  <Textarea value={s.description || ''} className="text-[10px] resize-none leading-relaxed" rows={2} onChange={(e) => {
                    const updated = content.services.map(x => x.id === s.id ? { ...x, description: e.target.value } : x);
                    handleContentChange('services', updated);
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8 border-dashed" onClick={() => {
                const newService = { id: uuidv4(), title: 'New Service', description: 'Sample description', imageUrl: '' };
                handleContentChange('services', [...(content.services || []), newService]);
              }}>+ Add Service</Button>
            </div>
          </div>
        </div>
      );

      case 'testimonials': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Testimonials</Label>
            <div className="space-y-3">
              {(content.testimonials || []).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer group relative" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl', false, t.id, 'testimonials')}>
                      {t.imageUrl ? <img src={t.imageUrl} className="w-full h-full object-cover" /> : <Users className="w-4 h-4 m-3 text-slate-300" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Search className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input value={t.author || ''} className="text-[10px] font-bold h-6" onChange={(e) => {
                        const updated = content.testimonials.map(x => x.id === t.id ? { ...x, author: e.target.value } : x);
                        handleContentChange('testimonials', updated);
                      }} placeholder="Author Name" />
                      <Input value={t.role || ''} className="text-[9px] h-5" onChange={(e) => {
                        const updated = content.testimonials.map(x => x.id === t.id ? { ...x, role: e.target.value } : x);
                        handleContentChange('testimonials', updated);
                      }} placeholder="Role / Company" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      const updated = content.testimonials.filter(x => x.id !== t.id);
                      handleContentChange('testimonials', updated);
                    }}><X className="w-4 h-4" /></Button>
                  </div>
                  <Textarea value={t.quote || ''} className="text-[10px] resize-none italic" rows={2} onChange={(e) => {
                    const updated = content.testimonials.map(x => x.id === t.id ? { ...x, quote: e.target.value } : x);
                    handleContentChange('testimonials', updated);
                  }} />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8 border-dashed" onClick={() => {
                const newT = { id: uuidv4(), author: 'New Person', role: 'CEO', quote: 'Stunning product!', imageUrl: '' };
                handleContentChange('testimonials', [...(content.testimonials || []), newT]);
              }}>+ Add Testimonial</Button>
            </div>
          </div>
        </div>
      );

      case 'stats': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stats Grid</Label>
            <div className="grid grid-cols-2 gap-2">
              {(content.stats || []).map((s, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded-lg border border-slate-200 space-y-1 relative group">
                  <Input value={s.value || ''} className="text-sm font-bold h-7" onChange={(e) => {
                    const updated = [...content.stats];
                    updated[idx] = { ...s, value: e.target.value };
                    handleContentChange('stats', updated);
                  }} />
                  <Input value={s.label || ''} className="text-[9px] h-6" onChange={(e) => {
                    const updated = [...content.stats];
                    updated[idx] = { ...s, label: e.target.value };
                    handleContentChange('stats', updated);
                  }} />
                  <button className="absolute -top-1 -right-1 bg-white border border-slate-200 text-destructive rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                    const updated = content.stats.filter((_, i) => i !== idx);
                    handleContentChange('stats', updated);
                  }}><X className="w-2.5 h-2.5" /></button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="col-span-2 text-[9px] h-7 border-dashed" onClick={() => {
                handleContentChange('stats', [...(content.stats || []), { value: '0', label: 'New Stat' }]);
              }}>+ Add Stat</Button>
            </div>
          </div>
        </div>
      );

      case 'team': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={2} /></div>
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Members</Label>
            <div className="space-y-3">
              {(content.members || []).map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 rounded-full border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer group relative" onClick={() => openMediaPicker(selectedSection.id, 'avatar', false, m.id, 'members')}>
                      {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 m-3.5 text-slate-300" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Search className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input value={m.name || ''} className="text-[10px] font-bold h-6" onChange={(e) => {
                        const updated = content.members.map(x => x.id === m.id ? { ...x, name: e.target.value } : x);
                        handleContentChange('members', updated);
                      }} placeholder="Name" />
                      <Input value={m.role || ''} className="text-[9px] h-5" onChange={(e) => {
                        const updated = content.members.map(x => x.id === m.id ? { ...x, role: e.target.value } : x);
                        handleContentChange('members', updated);
                      }} placeholder="Role" />
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      const updated = content.members.filter(x => x.id !== m.id);
                      handleContentChange('members', updated);
                    }}><X className="w-4 h-4" /></Button>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[9px] font-medium text-slate-500">Social Links</Label>
                    {(m.social || []).map((s, idx) => (
                      <div key={idx} className="flex gap-1 items-center">
                        <Select value={s.platform || 'linkedin'} onValueChange={(value) => {
                          const updatedMembers = content.members.map(x => x.id === m.id ? {
                            ...x,
                            social: x.social.map((soc, i) => i === idx ? { ...soc, platform: value } : soc)
                          } : x);
                          handleContentChange('members', updatedMembers);
                        }} className="h-6 text-[8px]">
                          <SelectTrigger className="w-16 h-6"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linkedin" className="text-[8px]">LinkedIn</SelectItem>
                            <SelectItem value="twitter" className="text-[8px]">Twitter</SelectItem>
                            <SelectItem value="github" className="text-[8px]">GitHub</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input value={s.url || ''} className="text-[9px] h-6 flex-1" onChange={(e) => {
                          const updatedMembers = content.members.map(x => x.id === m.id ? {
                            ...x,
                            social: x.social.map((soc, i) => i === idx ? { ...soc, url: e.target.value } : soc)
                          } : x);
                          handleContentChange('members', updatedMembers);
                        }} placeholder="URL" />
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                          const updatedMembers = content.members.map(x => x.id === m.id ? {
                            ...x,
                            social: x.social.filter((_, i) => i !== idx)
                          } : x);
                          handleContentChange('members', updatedMembers);
                        }}><X className="w-3 h-3" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full text-[9px] h-6 border-dashed" onClick={() => {
                      const updatedMembers = content.members.map(x => x.id === m.id ? {
                        ...x,
                        social: [...(x.social || []), { platform: 'linkedin', url: '' }]
                      } : x);
                      handleContentChange('members', updatedMembers);
                    }}>+ Add Link</Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold h-8 border-dashed" onClick={() => {
                const newMember = { id: uuidv4(), name: 'New Member', role: 'Role', avatar: '', social: [] };
                handleContentChange('members', [...(content.members || []), newMember]);
              }}>+ Add Member</Button>
            </div>
          </div>
        </div>
      );

      case 'gallery': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={2} /></div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gallery Images</Label>
              <Button variant="outline" size="sm" className="text-[9px] h-8 border-dashed" onClick={() => {
                const newImage = { 
                  id: uuidv4(), 
                  url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
                  title: 'New Image', 
                  category: 'Gallery' 
                };
                handleContentChange('images', [...(content.images || []), newImage]);
              }}>
                <Plus className="w-3 h-3 mr-1" /> Add Image
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(content.images || []).map((image, index) => (
                <div key={image.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer group relative" onClick={() => openMediaPicker(selectedSection.id, 'url', false, image.id, 'images')}>
                      {image.url ? <img src={image.url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 m-5 text-slate-300" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                          const updated = content.images.filter(x => x.id !== image.id);
                          handleContentChange('images', updated);
                        }}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Input 
                        value={image.title || ''} 
                        onChange={(e) => {
                          const updated = content.images.map(x => x.id === image.id ? { ...x, title: e.target.value } : x);
                          handleContentChange('images', updated);
                        }} 
                        placeholder="Image Title" 
                        className="text-xs font-bold h-7" 
                      />
                      
                      <Input 
                        value={image.category || ''} 
                        onChange={(e) => {
                          const updated = content.images.map(x => x.id === image.id ? { ...x, category: e.target.value } : x);
                          handleContentChange('images', updated);
                        }} 
                        placeholder="Category" 
                        className="text-[9px] h-6" 
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(content.images || []).length === 0 && (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No images yet. Click "Add Image" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

      case 'blog': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={2} /></div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blog Posts</Label>
              <Button variant="outline" size="sm" className="text-[9px] h-8 border-dashed" onClick={() => {
                const newPost = { 
                  id: uuidv4(), 
                  imageUrl: '',
                  title: 'New Blog Post',
                  excerpt: 'Blog post excerpt here...',
                  author: 'Author Name',
                  date: 'Today',
                  category: 'Article'
                };
                handleContentChange('posts', [...(content.posts || []), newPost]);
              }}>
                <Plus className="w-3 h-3 mr-1" /> Add Post
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(content.posts || []).map((post, index) => (
                <div key={post.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-start">
                    <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer group relative" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl', false, post.id, 'posts')}>
                      {post.imageUrl ? <img src={post.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 m-5 text-slate-300" />}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                          const updated = content.posts.filter(x => x.id !== post.id);
                          handleContentChange('posts', updated);
                        }}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Input 
                        value={post.title || ''} 
                        onChange={(e) => {
                          const updated = content.posts.map(x => x.id === post.id ? { ...x, title: e.target.value } : x);
                          handleContentChange('posts', updated);
                        }} 
                        placeholder="Post Title" 
                        className="text-xs font-bold h-7" 
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          value={post.author || ''} 
                          onChange={(e) => {
                            const updated = content.posts.map(x => x.id === post.id ? { ...x, author: e.target.value } : x);
                            handleContentChange('posts', updated);
                          }} 
                          placeholder="Author" 
                          className="text-[9px] h-6" 
                        />
                        <Input 
                          value={post.date || ''} 
                          onChange={(e) => {
                            const updated = content.posts.map(x => x.id === post.id ? { ...x, date: e.target.value } : x);
                            handleContentChange('posts', updated);
                          }} 
                          placeholder="Date" 
                          className="text-[9px] h-6" 
                        />
                      </div>
                      
                      <Input 
                        value={post.category || ''} 
                        onChange={(e) => {
                          const updated = content.posts.map(x => x.id === post.id ? { ...x, category: e.target.value } : x);
                          handleContentChange('posts', updated);
                        }} 
                        placeholder="Category" 
                        className="text-[9px] h-6" 
                      />
                      
                      <Textarea 
                        value={post.excerpt || ''} 
                        onChange={(e) => {
                          const updated = content.posts.map(x => x.id === post.id ? { ...x, excerpt: e.target.value } : x);
                          handleContentChange('posts', updated);
                        }} 
                        placeholder="Post excerpt..." 
                        className="text-[9px] resize-none h-12" 
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(content.posts || []).length === 0 && (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No blog posts yet. Click "Add Post" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

      case 'contact': return (
        <div className="space-y-4">
          <div className="space-y-2"><Label className="text-xs font-medium">Headline</Label><Input value={content.headline || ''} onChange={(e) => handleContentChange('headline', e.target.value)} className="bg-white border-slate-200 text-xs" /></div>
          <div className="space-y-2"><Label className="text-xs font-medium">Subheadline</Label><Textarea value={content.subheadline || ''} onChange={(e) => handleContentChange('subheadline', e.target.value)} className="bg-white border-slate-200 resize-none text-xs" rows={2} /></div>
          
          {/* Form Labels */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Form Labels</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[9px] text-slate-500">First Name Label</Label>
                <Input 
                  value={content.labelFirstName || ''} 
                  onChange={(e) => handleContentChange('labelFirstName', e.target.value)} 
                  className="bg-white border-slate-200 text-[10px] h-7" 
                  placeholder="First Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] text-slate-500">Last Name Label</Label>
                <Input 
                  value={content.labelLastName || ''} 
                  onChange={(e) => handleContentChange('labelLastName', e.target.value)} 
                  className="bg-white border-slate-200 text-[10px] h-7" 
                  placeholder="Last Name"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] text-slate-500">Email Label</Label>
                <Input 
                  value={content.labelEmail || ''} 
                  onChange={(e) => handleContentChange('labelEmail', e.target.value)} 
                  className="bg-white border-slate-200 text-[10px] h-7" 
                  placeholder="Email"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] text-slate-500">Message Label</Label>
                <Input 
                  value={content.labelMessage || ''} 
                  onChange={(e) => handleContentChange('labelMessage', e.target.value)} 
                  className="bg-white border-slate-200 text-[10px] h-7" 
                  placeholder="Message"
                />
              </div>
            </div>
          </div>

          {/* Button Text */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button</Label>
            <Input 
              value={content.buttonText || ''} 
              onChange={(e) => handleContentChange('buttonText', e.target.value)} 
              className="bg-white border-slate-200 text-xs" 
              placeholder="Send Message"
            />
          </div>

          {/* Contact Info Fields */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info Fields</Label>
              <Button variant="outline" size="sm" className="text-[9px] h-8 border-dashed" onClick={() => {
                const newField = { 
                  id: uuidv4(), 
                  label: 'New Field',
                  value: 'Field value here',
                  icon: 'Mail',
                  accent: '#E11D48'
                };
                handleContentChange('contactFields', [...(content.contactFields || [
                  { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                  { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                  { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
                ]), newField]);
              }}>
                <Plus className="w-3 h-3 mr-1" /> Add Field
              </Button>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(content.contactFields || [
                { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
              ]).map((field, index) => (
                <div key={field.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs"
                      style={{ background: field.accent }}
                    >
                      {field.icon === 'Mail' && <Mail className="w-4 h-4" />}
                      {field.icon === 'Phone' && <Phone className="w-4 h-4" />}
                      {field.icon === 'MapPin' && <MapPin className="w-4 h-4" />}
                      {field.icon === 'Globe' && <Users className="w-4 h-4" />}
                      {field.icon === 'MessageSquare' && <MessageSquare className="w-4 h-4" />}
                      {field.icon === 'Clock' && <Clock className="w-4 h-4" />}
                    </div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => {
                      const updated = (content.contactFields || [
                        { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                        { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                        { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
                      ]).filter(x => x.id !== field.id);
                      handleContentChange('contactFields', updated);
                    }}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-500">Label</Label>
                      <Input 
                        value={field.label || ''} 
                        onChange={(e) => {
                          const updated = (content.contactFields || [
                            { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                            { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                            { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
                          ]).map(x => x.id === field.id ? { ...x, label: e.target.value } : x);
                          handleContentChange('contactFields', updated);
                        }} 
                        placeholder="Field Label" 
                        className="text-[9px] h-6" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] text-slate-500">Icon</Label>
                      <Select 
                        value={field.icon || 'Mail'} 
                        onValueChange={(value) => {
                          const accentMap = { Mail: '#E11D48', Phone: '#0891B2', MapPin: '#059669', Globe: '#7C3AED', MessageSquare: '#D97706', Clock: '#0F766E' };
                          const updated = (content.contactFields || [
                            { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                            { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                            { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
                          ]).map(x => x.id === field.id ? { ...x, icon: value, accent: accentMap[value] } : x);
                          handleContentChange('contactFields', updated);
                        }}
                      >
                        <SelectTrigger className="bg-white border-slate-200 h-6 text-[9px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mail" className="text-[9px]">Mail</SelectItem>
                          <SelectItem value="Phone" className="text-[9px]">Phone</SelectItem>
                          <SelectItem value="MapPin" className="text-[9px]">MapPin</SelectItem>
                          <SelectItem value="Globe" className="text-[9px]">Globe</SelectItem>
                          <SelectItem value="MessageSquare" className="text-[9px]">Message</SelectItem>
                          <SelectItem value="Clock" className="text-[9px]">Clock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-[9px] text-slate-500">Value</Label>
                    <Input 
                      value={field.value || ''} 
                      onChange={(e) => {
                        const updated = (content.contactFields || [
                          { id: '1', label: content.labelEmailUs || 'Email Us', value: content.email || 'hello@example.com', icon: 'Mail', accent: '#E11D48' },
                          { id: '2', label: content.labelCallUs || 'Call Us', value: content.phone || '+1 (555) 123-4567', icon: 'Phone', accent: '#0891B2' },
                          { id: '3', label: content.labelVisitUs || 'Visit Us', value: content.address || '123 Business St', icon: 'MapPin', accent: '#059669' }
                        ]).map(x => x.id === field.id ? { ...x, value: e.target.value } : x);
                        handleContentChange('contactFields', updated);
                      }} 
                      placeholder="Field Value" 
                      className="text-[9px] h-6" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Embed for Map Variant */}
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Map Embed (Map Variant)</Label>
            <Input 
              value={content.mapEmbed || ''} 
              onChange={(e) => handleContentChange('mapEmbed', e.target.value)} 
              className="bg-white border-slate-200 text-xs" 
              placeholder="Google Maps iframe URL..."
            />
            <p className="text-[9px] text-slate-400">Add Google Maps iframe embed URL for the map variant</p>
          </div>
        </div>
      );

      case 'logocloud': return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">Headline</Label>
            <Input 
              value={content.headline || ''} 
              onChange={(e) => handleContentChange('headline', e.target.value)} 
              className="bg-white border-slate-200 text-xs" 
              placeholder="e.g., Trusted by leading companies"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Subheadline</Label>
            <Textarea 
              value={content.subheadline || ''} 
              onChange={(e) => handleContentChange('subheadline', e.target.value)} 
              className="bg-white border-slate-200 resize-none text-xs" 
              rows={2}
              placeholder="Description text (optional)"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Assets</Label>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[9px] h-8 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50" 
                onClick={() => {
                  const newLogo = { 
                    id: uuidv4(), 
                    name: 'Company Logo',
                    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=100&fit=crop'
                  };
                  handleContentChange('logos', [...(content.logos || []), newLogo]);
                }}
              >
                <Plus className="w-3 h-3 mr-1" /> Add Logo
              </Button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(content.logos || []).map((logo, index) => (
                <div key={logo.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex gap-2 items-start">
                    <div 
                      className="w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-white shrink-0 cursor-pointer group relative flex items-center justify-center" 
                      onClick={() => openMediaPicker(selectedSection.id, 'url', false, logo.id, 'logos')}
                      title="Click to change logo"
                    >
                      {logo.url ? (
                        <img src={logo.url} className="w-full h-full object-contain p-1" alt={logo.name} />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <Search className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[9px] font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-destructive hover:bg-destructive/10 ml-auto" 
                          onClick={() => {
                            const updated = content.logos.filter(x => x.id !== logo.id);
                            handleContentChange('logos', updated);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Input 
                        value={logo.name || ''} 
                        onChange={(e) => {
                          const updated = content.logos.map(x => x.id === logo.id ? { ...x, name: e.target.value } : x);
                          handleContentChange('logos', updated);
                        }} 
                        placeholder="Company name" 
                        className="text-xs font-bold h-7" 
                      />
                      
                      <Input 
                        value={logo.url || ''} 
                        onChange={(e) => {
                          const updated = content.logos.map(x => x.id === logo.id ? { ...x, url: e.target.value } : x);
                          handleContentChange('logos', updated);
                        }} 
                        placeholder="Logo image URL" 
                        className="text-[9px] h-6 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {(content.logos || []).length === 0 && (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No logos yet. Click "Add Logo" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );

      case 'layout': return (
        <div className="space-y-4">
          {/* Layout variant specific content */}
          {selectedSection.variant === 'text-only' && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">Text Content</Label>
              <Textarea 
                value={content.text || ''} 
                onChange={(e) => handleContentChange('text', e.target.value)} 
                className="bg-white border-slate-200 resize-none text-xs" 
                rows={6}
                placeholder="Enter your text content here..."
              />
            </div>
          )}

          {(selectedSection.variant === 'image-text-left' || selectedSection.variant === 'image-text-right') && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Heading</Label>
                <Input 
                  value={content.heading || ''} 
                  onChange={(e) => handleContentChange('heading', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="Enter heading..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Content</Label>
                <Textarea 
                  value={content.text || ''} 
                  onChange={(e) => handleContentChange('text', e.target.value)} 
                  className="bg-white border-slate-200 resize-none text-xs" 
                  rows={4}
                  placeholder="Enter your text content here..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Image</Label>
                <div className="flex gap-2">
                  <Input 
                    value={content.imageUrl || ''} 
                    onChange={(e) => handleContentChange('imageUrl', e.target.value)} 
                    className="bg-white border-slate-200 text-xs flex-1" 
                    placeholder="Image URL..."
                  />
                  <Button 
                    onClick={() => openMediaPicker(selectedSection.id, 'imageUrl')}
                    variant="outline" 
                    size="sm"
                    className="text-xs h-8"
                  >
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Choose
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Image Alt Text</Label>
                <Input 
                  value={content.imageAlt || ''} 
                  onChange={(e) => handleContentChange('imageAlt', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="Image description for accessibility..."
                />
              </div>
            </>
          )}

          {selectedSection.variant === 'text-button' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Content</Label>
                <Textarea 
                  value={content.text || ''} 
                  onChange={(e) => handleContentChange('text', e.target.value)} 
                  className="bg-white border-slate-200 resize-none text-xs" 
                  rows={4}
                  placeholder="Enter your text content here..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Button Text</Label>
                <Input 
                  value={content.buttonText || ''} 
                  onChange={(e) => handleContentChange('buttonText', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="Button text..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Button Link</Label>
                <Input 
                  value={content.buttonHref || ''} 
                  onChange={(e) => handleContentChange('buttonHref', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="/page-path or https://..."
                />
              </div>
            </>
          )}

          {selectedSection.variant === 'heading-text-button' && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Heading</Label>
                <Input 
                  value={content.heading || ''} 
                  onChange={(e) => handleContentChange('heading', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="Enter heading..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Content</Label>
                <Textarea 
                  value={content.text || ''} 
                  onChange={(e) => handleContentChange('text', e.target.value)} 
                  className="bg-white border-slate-200 resize-none text-xs" 
                  rows={4}
                  placeholder="Enter your text content here..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Button Text</Label>
                <Input 
                  value={content.buttonText || ''} 
                  onChange={(e) => handleContentChange('buttonText', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="Button text..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Button Link</Label>
                <Input 
                  value={content.buttonHref || ''} 
                  onChange={(e) => handleContentChange('buttonHref', e.target.value)} 
                  className="bg-white border-slate-200 text-xs" 
                  placeholder="/page-path or https://..."
                />
              </div>
            </>
          )}

          {selectedSection.variant === 'two-column' && (
            <>
              <div className="space-y-4">
                <Label className="text-xs font-medium">Left Column</Label>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Heading</Label>
                  <Input 
                    value={content.leftColumn?.heading || ''} 
                    onChange={(e) => handleContentChange('leftColumn', { ...content.leftColumn, heading: e.target.value })} 
                    className="bg-white border-slate-200 text-xs" 
                    placeholder="Left column heading..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Text Content</Label>
                  <Textarea 
                    value={content.leftColumn?.text || ''} 
                    onChange={(e) => handleContentChange('leftColumn', { ...content.leftColumn, text: e.target.value })} 
                    className="bg-white border-slate-200 resize-none text-xs" 
                    rows={3}
                    placeholder="Left column text..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-medium">Right Column</Label>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Heading</Label>
                  <Input 
                    value={content.rightColumn?.heading || ''} 
                    onChange={(e) => handleContentChange('rightColumn', { ...content.rightColumn, heading: e.target.value })} 
                    className="bg-white border-slate-200 text-xs" 
                    placeholder="Right column heading..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Text Content</Label>
                  <Textarea 
                    value={content.rightColumn?.text || ''} 
                    onChange={(e) => handleContentChange('rightColumn', { ...content.rightColumn, text: e.target.value })} 
                    className="bg-white border-slate-200 resize-none text-xs" 
                    rows={3}
                    placeholder="Right column text..."
                  />
                </div>
              </div>
            </>
          )}

          {/* Button styles for layouts with buttons */}
          {(selectedSection.variant === 'text-button' || selectedSection.variant === 'heading-text-button') && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <Label className="text-xs font-medium">Button Styles</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Border Radius</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={selectedSection.styles?.buttonBorderRadius || '6'}
                      onChange={(e) => handleStyleChange('buttonBorderRadius', `${e.target.value}px`)}
                      className="bg-white border-slate-200 text-xs h-8 w-16"
                      min="0"
                      max="50"
                    />
                    <span className="text-xs text-slate-500 self-center">px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Background Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.styles?.buttonBackgroundColor || '#0f172a'}
                      onChange={(e) => handleStyleChange('buttonBackgroundColor', e.target.value)}
                      className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                    />
                    <Input
                      value={selectedSection.styles?.buttonBackgroundColor || '#0f172a'}
                      onChange={(e) => handleStyleChange('buttonBackgroundColor', e.target.value)}
                      className="flex-1 text-xs h-8 font-mono bg-white border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Text Color</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedSection.styles?.buttonTextColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                      className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                    />
                    <Input
                      value={selectedSection.styles?.buttonTextColor || '#ffffff'}
                      onChange={(e) => handleStyleChange('buttonTextColor', e.target.value)}
                      className="flex-1 text-xs h-8 font-mono bg-white border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[9px] font-medium">Quick Options</Label>
                  <div className="flex gap-1">
                    {['0', '4', '6', '8', '12', '16'].map((radius) => (
                      <Button
                        key={radius}
                        variant="outline"
                        size="sm"
                        onClick={() => handleStyleChange('buttonBorderRadius', `${radius}px`)}
                        className={`text-xs h-6 px-2 ${selectedSection.styles?.buttonBorderRadius === `${radius}px` ? 'bg-primary text-primary-foreground' : ''}`}
                      >
                        {radius}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[9px] font-medium">Preview</Label>
                <div className="p-3 bg-slate-50 rounded-lg flex justify-center">
                  <Button 
                    style={{ 
                      borderRadius: `${selectedSection.styles?.buttonBorderRadius || 6}px`,
                      backgroundColor: selectedSection.styles?.buttonBackgroundColor || '#0f172a',
                      color: selectedSection.styles?.buttonTextColor || '#ffffff'
                    }}
                    className="text-xs"
                  >
                    {content.buttonText || 'Button'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      );

      default: return <div className="text-center py-12 px-4 space-y-3">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <Layout className="w-6 h-6" />
        </div>
        <p className="text-[11px] text-slate-500 italic max-w-[180px] mx-auto">Click components on the canvas to edit their content directly or use common style controls below.</p>
      </div>;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="font-bold text-slate-900 truncate max-w-[180px]">
            {selectedComponent ? 'Edit Element' : selectedSection.name}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {selectedComponent ? `${selectedComponent.type} component` : `${selectedSection.type} section`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedSection && !selectedComponent && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm(`Are you sure you want to delete the "${selectedSection.name}" section? This action cannot be undone.`)) {
                  deleteSection(selectedSection.id);
                  selectSection(null);
                }
              }}
              className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => selectSection(null)} className="h-8 w-8 rounded-full hover:bg-slate-200 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {selectedComponent && (
          <div className="bg-primary/5 border-b border-primary/10 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Component Properties</span>
            </div>

            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">X Position</Label>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 h-8">
                  <span className="text-[10px] text-slate-400">X</span>
                  <input
                    type="number"
                    value={Math.round(selectedComponent.position?.x || 0)}
                    onChange={(e) => handleCompUpdate({ position: { ...selectedComponent.position, x: parseInt(e.target.value) || 0 } })}
                    className="w-full bg-transparent border-none text-[11px] font-medium focus:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase">Y Position</Label>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-2 h-8">
                  <span className="text-[10px] text-slate-400">Y</span>
                  <input
                    type="number"
                    value={Math.round(selectedComponent.position?.y || 0)}
                    onChange={(e) => handleCompUpdate({ position: { ...selectedComponent.position, y: parseInt(e.target.value) || 0 } })}
                    className="w-full bg-transparent border-none text-[11px] font-medium focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Content & Specific Styles */}
            {selectedComponent.type === 'image' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={selectedComponent.content.imageUrl}
                      onChange={(e) => handleCompUpdate({ content: { ...selectedComponent.content, imageUrl: e.target.value } })}
                      className="bg-white border-slate-200 text-[10px] h-8"
                    />
                    <Button variant="outline" size="icon" onClick={() => openMediaPicker(selectedSection.id, 'imageUrl', false, 'floating-comp')} className="shrink-0 h-8 w-8 bg-white">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">Width</Label>
                  <Select value={selectedComponent.style?.width || '200px'} onValueChange={(val) => handleCompStyleUpdate({ width: val })}>
                    <SelectTrigger className="bg-white border-slate-200 text-[10px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['100px', '200px', '300px', '400px', '500px', '100%'].map(s => <SelectItem key={s} value={s} className="text-[10px]">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedComponent.type === 'text' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase">Font Size</Label>
                  <Select value={selectedComponent.style?.fontSize || '24px'} onValueChange={(val) => handleCompStyleUpdate({ fontSize: val })}>
                    <SelectTrigger className="bg-white border-slate-200 text-[10px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px', '64px'].map(s => <SelectItem key={s} value={s} className="text-[10px]">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={selectedComponent.style?.color || '#000000'} onChange={(e) => handleCompStyleUpdate({ color: e.target.value })} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                    <Input value={selectedComponent.style?.color || ''} onChange={(e) => handleCompStyleUpdate({ color: e.target.value })} className="bg-white border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Background</Label>
                  <div className="flex gap-2">
                    <input type="color" value={selectedComponent.style?.backgroundColor || 'transparent'} onChange={(e) => handleCompStyleUpdate({ backgroundColor: e.target.value })} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                    <Input value={selectedComponent.style?.backgroundColor || ''} onChange={(e) => handleCompStyleUpdate({ backgroundColor: e.target.value })} className="bg-white border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-primary/5">
              <Button variant="ghost" size="sm" className="w-full text-[10px] text-slate-400 hover:text-destructive h-7" onClick={() => deleteComponent(selectedSection.id, selectedComponent.id)}>
                <X className="w-3 h-3 mr-1" /> Delete Element
              </Button>
            </div>
          </div>
        )}

        {variants.length > 0 && (
          <Collapsible open={layoutOpen} onOpenChange={setLayoutOpen} className="border-b border-slate-100">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-slate-700">Layout Variant</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${layoutOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0">
              <Select value={selectedSection.variant || variants[0]?.id} onValueChange={(val) => updateSection(selectedSection.id, { variant: val })}>
                <SelectTrigger className="bg-slate-50 border-slate-200 text-xs h-9 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants.map(v => <SelectItem key={v.id} value={v.id} className="text-xs">{v.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </CollapsibleContent>
          </Collapsible>
        )}

        <Collapsible open={contentOpen} onOpenChange={setContentOpen} className="border-b border-slate-100">
          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-slate-700">Content & Assets</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${contentOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 px-6 pb-6">
            <div className="mt-2">{renderContentFields()}</div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={stylesOpen} onOpenChange={setStylesOpen} className="border-b border-slate-100">
          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-semibold text-slate-700">Visual Styling</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${stylesOpen ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 space-y-6 px-6 pb-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background</Label>
                <div className="flex gap-2">
                  <input type="color" value={selectedSection.styles.backgroundColor || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                  <Input value={selectedSection.styles.backgroundColor || ''} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Headings</Label>
                <div className="flex gap-2">
                  <input type="color" value={selectedSection.styles.headingColor || '#0f172a'} onChange={(e) => handleStyleChange('headingColor', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                  <Input value={selectedSection.styles.headingColor || ''} onChange={(e) => handleStyleChange('headingColor', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Body Text</Label>
                <div className="flex gap-2">
                  <input type="color" value={selectedSection.styles.paragraphColor || '#475569'} onChange={(e) => handleStyleChange('paragraphColor', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                  <Input value={selectedSection.styles.paragraphColor || ''} onChange={(e) => handleStyleChange('paragraphColor', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                </div>
              </div>
            </div>

            {/* Card Background for features, testimonials, and services sections */}
            {(selectedSection.type === 'features' || selectedSection.type === 'testimonials' || selectedSection.type === 'services') && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Card Styling</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] text-slate-500 font-bold">Card Background</Label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedSection.styles.cardBackgroundColor || (selectedSection.type === 'services' ? '#f8fafc' : '#ffffff')} onChange={(e) => handleStyleChange('cardBackgroundColor', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                      <Input value={selectedSection.styles.cardBackgroundColor || ''} onChange={(e) => handleStyleChange('cardBackgroundColor', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Button Colors for sections with buttons */}
            {(selectedSection.type === 'hero' || selectedSection.type === 'cta') && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Button Colors</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] text-slate-500 font-bold">Primary Background</Label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedSection.styles.buttonPrimaryBg || '#0f172a'} onChange={(e) => handleStyleChange('buttonPrimaryBg', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                      <Input value={selectedSection.styles.buttonPrimaryBg || ''} onChange={(e) => handleStyleChange('buttonPrimaryBg', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] text-slate-500 font-bold">Primary Text</Label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedSection.styles.buttonPrimaryText || '#ffffff'} onChange={(e) => handleStyleChange('buttonPrimaryText', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                      <Input value={selectedSection.styles.buttonPrimaryText || ''} onChange={(e) => handleStyleChange('buttonPrimaryText', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] text-slate-500 font-bold">Secondary Background</Label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedSection.styles.buttonSecondaryBg || 'transparent'} onChange={(e) => handleStyleChange('buttonSecondaryBg', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                      <Input value={selectedSection.styles.buttonSecondaryBg || ''} onChange={(e) => handleStyleChange('buttonSecondaryBg', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[9px] text-slate-500 font-bold">Secondary Text</Label>
                    <div className="flex gap-2">
                      <input type="color" value={selectedSection.styles.buttonSecondaryText || '#0f172a'} onChange={(e) => handleStyleChange('buttonSecondaryText', e.target.value)} className="w-8 h-8 rounded border p-0.5 cursor-pointer" />
                      <Input value={selectedSection.styles.buttonSecondaryText || ''} onChange={(e) => handleStyleChange('buttonSecondaryText', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono flex-1 px-1.5" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2 border-t border-slate-100 mt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-[11px] font-bold text-slate-700">Use Gradient</Label>
                  <p className="text-[9px] text-slate-400 italic">Advanced background effect</p>
                </div>
                <Switch checked={!!selectedSection.styles.useGradient} onCheckedChange={(checked) => handleStyleChange('useGradient', checked)} />
              </div>
              {selectedSection.styles.useGradient && (
                <Input value={selectedSection.styles.backgroundGradient || ''} onChange={(e) => handleStyleChange('backgroundGradient', e.target.value)} className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono" placeholder="linear-gradient(...)" />
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Border Radius</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: '0px', label: '0°', desc: 'Sharp' },
                  { value: '4px', label: '1°', desc: 'Slight' },
                  { value: '8px', label: '2°', desc: 'Medium' },
                  { value: '12px', label: '3°', desc: 'Curved' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => selectedComponent 
                      ? handleCompStyleUpdate({ borderRadius: option.value })
                      : handleStyleChange('borderRadius', option.value)
                    }
                    className={`p-2 rounded-lg border text-[10px] font-medium transition-all ${
                      (selectedComponent 
                        ? selectedComponent.style?.borderRadius 
                        : selectedSection.styles?.borderRadius) === option.value
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">{option.label}</div>
                    <div className="text-[8px] opacity-70">{option.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={selectedComponent 
                    ? selectedComponent.style?.borderRadius || ''
                    : selectedSection.styles?.borderRadius || ''
                  }
                  onChange={(e) => selectedComponent 
                    ? handleCompStyleUpdate({ borderRadius: e.target.value })
                    : handleStyleChange('borderRadius', e.target.value)
                  }
                  className="bg-slate-50 border-slate-200 text-[10px] h-8 font-mono"
                  placeholder="Custom value (e.g., 16px)"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensions & Spacing</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[9px] text-slate-500 font-bold">Padding</Label>
                  <Input value={selectedSection.styles.padding || ''} onChange={(e) => handleStyleChange('padding', e.target.value)} className="bg-slate-50 border-slate-200 h-8 text-[10px]" placeholder="120px 0" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] text-slate-500 font-bold">Min Height</Label>
                  <Input value={selectedSection.styles.minHeight || ''} onChange={(e) => handleStyleChange('minHeight', e.target.value)} className="bg-slate-50 border-slate-200 h-8 text-[10px]" placeholder="80vh" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-slate-100">
              <Label className="text-[11px] font-bold text-slate-700">Visibility</Label>
              <Switch checked={selectedSection.visible} onCheckedChange={(checked) => updateSection(selectedSection.id, { visible: checked })} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management Name</Label>
          <Input value={selectedSection.name} onChange={(e) => updateSection(selectedSection.id, { name: e.target.value })} className="bg-white border-slate-200 text-xs h-8" />
        </div>
      </div>

      <MediaLibrary
        open={mediaOpen}
        onOpenChange={setMediaOpen}
        onSelect={handleMediaSelect}
      />
    </div>
  );
}