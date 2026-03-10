import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useBuilder } from '@/contexts/BuilderContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Type, Palette, Settings2, ChevronDown, Layout, Image as ImageIcon, Search, Users, Trash2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getVariantsForSection } from '@/lib/sectionVariants';
import { MediaLibrary } from './MediaLibrary';
import { Button } from '@/components/ui/button';

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
            <CollapsibleContent className="p-4 pt-0 space-y-4 px-6 pb-6">
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={page.navbar?.styles?.backgroundColor || '#0f172a'}
                        onChange={(e) => updateNavbar({ styles: { ...page.navbar.styles, backgroundColor: e.target.value } })}
                        className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                      />
                      <Input
                        value={page.navbar?.styles?.backgroundColor || ''}
                        onChange={(e) => updateNavbar({ styles: { ...page.navbar.styles, backgroundColor: e.target.value } })}
                        className="bg-slate-50 border-slate-200 flex-1 font-mono text-[10px] h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={page.navbar?.styles?.textColor || '#ffffff'}
                        onChange={(e) => updateNavbar({ styles: { ...page.navbar.styles, textColor: e.target.value } })}
                        className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                      />
                      <Input
                        value={page.navbar?.styles?.textColor || ''}
                        onChange={(e) => updateNavbar({ styles: { ...page.navbar.styles, textColor: e.target.value } })}
                        className="bg-slate-50 border-slate-200 flex-1 font-mono text-[10px] h-8"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Label className="text-xs font-medium">Sticky Header</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={footerOpen} onOpenChange={setFooterOpen} className="border-b border-slate-100 group">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-200 group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Palette className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-slate-700 block">Global Footer</span>
                  <span className="text-xs text-slate-500">Customize footer styling & social links</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-all duration-200 text-slate-400 ${footerOpen ? 'rotate-180 text-primary' : ''} group-hover:text-primary`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 space-y-4 px-6 pb-6">
              <div className="space-y-4 pt-2">
                {/* Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={page.footer?.styles?.backgroundColor || '#0f172a'}
                        onChange={(e) => updateFooter({ styles: { ...page.footer.styles, backgroundColor: e.target.value } })}
                        className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                      />
                      <Input
                        value={page.footer?.styles?.backgroundColor || ''}
                        onChange={(e) => updateFooter({ styles: { ...page.footer.styles, backgroundColor: e.target.value } })}
                        className="bg-slate-50 border-slate-200 flex-1 font-mono text-[10px] h-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={page.footer?.styles?.textColor || '#ffffff'}
                        onChange={(e) => updateFooter({ styles: { ...page.footer.styles, textColor: e.target.value } })}
                        className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                      />
                      <Input
                        value={page.footer?.styles?.textColor || ''}
                        onChange={(e) => updateFooter({ styles: { ...page.footer.styles, textColor: e.target.value } })}
                        className="bg-slate-50 border-slate-200 flex-1 font-mono text-[10px] h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Button Routes & Links Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Button Routes & Links
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[9px] h-7 border-dashed border-purple-300 hover:border-purple-400"
                      onClick={() => {
                        const newRoute = {
                          id: uuidv4(),
                          name: 'New Button',
                          type: 'external',
                          url: 'https://example.com',
                          target: '_blank'
                        };
                        updateFooter({
                          buttonRoutes: [...(page.footer?.buttonRoutes || []), newRoute]
                        });
                      }}
                    >
                      + Add Button Route
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(page.footer?.buttonRoutes || []).map((route) => (
                      <div key={route.id} className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 space-y-2">
                        <div className="flex gap-2 items-center">
                          <Input
                            value={route.name}
                            onChange={(e) => {
                              const updated = page.footer.buttonRoutes.map(r =>
                                r.id === route.id ? { ...r, name: e.target.value } : r
                              );
                              updateFooter({ buttonRoutes: updated });
                            }}
                            className="bg-white border-purple-200 text-xs h-8 flex-1"
                            placeholder="Button Name"
                          />
                          <Select
                            value={route.type}
                            onValueChange={(value) => {
                              const updated = page.footer.buttonRoutes.map(r =>
                                r.id === route.id ? { ...r, type: value } : r
                              );
                              updateFooter({ buttonRoutes: updated });
                            }}
                          >
                            <SelectTrigger className="bg-white border-purple-200 h-8 text-xs w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="external" className="text-xs">External</SelectItem>
                              <SelectItem value="internal" className="text-xs">Internal</SelectItem>
                              <SelectItem value="email" className="text-xs">Email</SelectItem>
                              <SelectItem value="phone" className="text-xs">Phone</SelectItem>
                              <SelectItem value="anchor" className="text-xs">Anchor</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              const updated = page.footer.buttonRoutes.filter(r => r.id !== route.id);
                              updateFooter({ buttonRoutes: updated });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input
                            value={route.url}
                            onChange={(e) => {
                              const updated = page.footer.buttonRoutes.map(r =>
                                r.id === route.id ? { ...r, url: e.target.value } : r
                              );
                              updateFooter({ buttonRoutes: updated });
                            }}
                            className="bg-white border-purple-200 text-xs h-8 flex-1"
                            placeholder={
                              route.type === 'email' ? 'mailto:example@email.com' :
                              route.type === 'phone' ? 'tel:+1234567890' :
                              route.type === 'anchor' ? '#section-id' :
                              route.type === 'internal' ? '/page-path' :
                              'https://example.com'
                            }
                          />
                          {route.type === 'external' && (
                            <Select
                              value={route.target || '_blank'}
                              onValueChange={(value) => {
                                const updated = page.footer.buttonRoutes.map(r =>
                                  r.id === route.id ? { ...r, target: value } : r
                                );
                                updateFooter({ buttonRoutes: updated });
                              }}
                            >
                              <SelectTrigger className="bg-white border-purple-200 h-8 text-xs w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="_blank" className="text-xs">New Tab</SelectItem>
                                <SelectItem value="_self" className="text-xs">Same Tab</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Social Links
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[9px] h-7 border-dashed"
                      onClick={() => {
                        const newSocialLink = {
                          id: uuidv4(),
                          platform: 'twitter',
                          href: 'https://twitter.com/yourusername'
                        };
                        updateFooter({
                          socialLinks: [...(page.footer?.socialLinks || []), newSocialLink]
                        });
                      }}
                    >
                      + Add Link
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(page.footer?.socialLinks || []).map((social) => (
                      <div key={social.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex gap-2 items-center">
                          <Select
                            value={social.platform}
                            onValueChange={(value) => {
                              const updated = page.footer.socialLinks.map(s =>
                                s.id === social.id ? { ...s, platform: value } : s
                              );
                              updateFooter({ socialLinks: updated });
                            }}
                          >
                            <SelectTrigger className="bg-white border-slate-200 h-8 text-xs flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="facebook" className="text-xs">Facebook</SelectItem>
                              <SelectItem value="twitter" className="text-xs">Twitter</SelectItem>
                              <SelectItem value="instagram" className="text-xs">Instagram</SelectItem>
                              <SelectItem value="linkedin" className="text-xs">LinkedIn</SelectItem>
                              <SelectItem value="youtube" className="text-xs">YouTube</SelectItem>
                              <SelectItem value="github" className="text-xs">GitHub</SelectItem>
                              <SelectItem value="email" className="text-xs">Email</SelectItem>
                              <SelectItem value="phone" className="text-xs">Phone</SelectItem>
                              <SelectItem value="location" className="text-xs">Address</SelectItem>
                              <SelectItem value="website" className="text-xs">Website</SelectItem>
                              <SelectItem value="discord" className="text-xs">Discord</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              const updated = page.footer.socialLinks.filter(s => s.id !== social.id);
                              updateFooter({ socialLinks: updated });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Input
                          value={social.href}
                          onChange={(e) => {
                            const updated = page.footer.socialLinks.map(s =>
                              s.id === social.id ? { ...s, href: e.target.value } : s
                            );
                            updateFooter({ socialLinks: updated });
                          }}
                          className="bg-white border-slate-200 text-xs h-8"
                          placeholder="https://..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="p-4 bg-primary/5 m-4 rounded-xl border border-primary/10">
          <h4 className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2">Publishing</h4>
          <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Changes are saved automatically to your local project. Ready to go live?</p>
          <Button className="w-full text-xs h-9 shadow-sm" onClick={() => alert('Publishing feature coming soon!')}>Publish Project</Button>
        </div>

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
