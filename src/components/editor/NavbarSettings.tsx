import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, GripVertical, Zap } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavbarSettingsProps {
  navbar: any;
  pages: any[];
  onUpdate: (updates: any) => void;
  isExpanded?: boolean;
}

export function NavbarSettings({ navbar, pages, onUpdate, isExpanded = true }: NavbarSettingsProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  if (!navbar) return null;

  const links = navbar.links || [];
  const styles = navbar.styles || {};

  const handleAddLink = () => {
    const newLink = {
      id: uuidv4(),
      label: 'New Link',
      href: '/new-page',
      isButton: false,
    };
    onUpdate({ links: [...links, newLink] });
  };

  const handleRemoveLink = (linkId: string) => {
    onUpdate({ links: links.filter((l: any) => l.id !== linkId) });
  };

  const handleUpdateLink = (linkId: string, updates: any) => {
    onUpdate({
      links: links.map((l: any) =>
        l.id === linkId ? { ...l, ...updates } : l
      ),
    });
  };

  const handleUpdateStyles = (styleUpdates: any) => {
    onUpdate({
      styles: { ...styles, ...styleUpdates },
    });
  };

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded} className="border-b border-slate-100">
      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">Navbar Settings</span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="p-4 pt-0 space-y-6 px-6 pb-6">
        {/* Navbar Colors */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Colors & Style</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Background</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                />
                <Input
                  value={styles.backgroundColor || ''}
                  onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                  className="bg-slate-50 border-slate-200 flex-1 font-mono text-[9px] h-8"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={styles.textColor || '#000000'}
                  onChange={(e) => handleUpdateStyles({ textColor: e.target.value })}
                  className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                />
                <Input
                  value={styles.textColor || ''}
                  onChange={(e) => handleUpdateStyles({ textColor: e.target.value })}
                  className="bg-slate-50 border-slate-200 flex-1 font-mono text-[9px] h-8"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Sticky Header</Label>
              <div className="flex items-center h-8">
                <button
                  onClick={() => handleUpdateStyles({ sticky: !styles.sticky })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    styles.sticky ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                      styles.sticky ? 'right-0.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Button Styles */}
        <div className="space-y-3 border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Button Styling</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Button BG</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={styles.buttonBg || '#0f172a'}
                  onChange={(e) => handleUpdateStyles({ buttonBg: e.target.value })}
                  className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                />
                <Input
                  value={styles.buttonBg || ''}
                  onChange={(e) => handleUpdateStyles({ buttonBg: e.target.value })}
                  className="bg-slate-50 border-slate-200 flex-1 font-mono text-[9px] h-8"
                  placeholder="#0f172a"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Button Text</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={styles.buttonText || '#ffffff'}
                  onChange={(e) => handleUpdateStyles({ buttonText: e.target.value })}
                  className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                />
                <Input
                  value={styles.buttonText || ''}
                  onChange={(e) => handleUpdateStyles({ buttonText: e.target.value })}
                  className="bg-slate-50 border-slate-200 flex-1 font-mono text-[9px] h-8"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-semibold text-slate-500">Radius</Label>
              <Input
                value={styles.buttonRadius || '2px'}
                onChange={(e) => handleUpdateStyles({ buttonRadius: e.target.value })}
                className="bg-slate-50 border-slate-200 font-mono text-[9px] h-8"
                placeholder="2px"
              />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation Links</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddLink}
              className="h-7 text-[10px] border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Link
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {links.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No links added. Click "Add Link" to create one.</p>
            ) : (
              links.map((link: any) => (
                <div
                  key={link.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex gap-2 items-start">
                    <GripVertical className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      {/* Link Label */}
                      <div className="space-y-1">
                        <Label className="text-[9px] font-semibold text-slate-500 uppercase">Label</Label>
                        <Input
                          value={link.label}
                          onChange={(e) => handleUpdateLink(link.id, { label: e.target.value })}
                          className="bg-white border-slate-200 text-xs h-7 font-medium"
                          placeholder="Link text"
                        />
                      </div>

                      {/* Link Href / Page Selection */}
                      <div className="space-y-1">
                        <Label className="text-[9px] font-semibold text-slate-500 uppercase">Route / URL</Label>
                        <div className="flex gap-2 items-center">
                          <Select
                            value={link.href || ''}
                            onValueChange={(value) => {
                              if (value === 'custom') {
                                handleUpdateLink(link.id, { href: '', isCustom: true });
                                setEditingLink(link.id);
                              } else {
                                handleUpdateLink(link.id, { href: value, isCustom: false });
                                setEditingLink(null);
                              }
                            }}
                          >
                            <SelectTrigger className="bg-white border-slate-200 h-7 text-xs flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="/">Home</SelectItem>
                              <SelectItem value="/about">About</SelectItem>
                              <SelectItem value="/services">Services</SelectItem>
                              <SelectItem value="/pricing">Pricing</SelectItem>
                              <SelectItem value="/contact">Contact</SelectItem>
                              <SelectItem value="/start">Get Started</SelectItem>
                              <SelectItem value="/features">Features</SelectItem>
                              <SelectItem value="/blog">Blog</SelectItem>
                              <SelectItem value="/templates">Templates</SelectItem>
                              <SelectItem value="/careers">Careers</SelectItem>
                              <SelectItem value="/help">Help</SelectItem>
                              <SelectItem value="custom">Custom URL</SelectItem>
                            </SelectContent>
                          </Select>

                          {link.isCustom || !link.href.startsWith('/') ? (
                            <Input
                              value={link.href || ''}
                              onChange={(e) => handleUpdateLink(link.id, { href: e.target.value })}
                              className="bg-white border-slate-200 text-xs h-7 flex-1"
                              placeholder="https://example.com or /custom-page"
                            />
                          ) : null}
                        </div>
                      </div>

                      {/* Link Type */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateLink(link.id, { isButton: !link.isButton })}
                          className={`px-2 py-1 rounded text-[9px] font-semibold transition-colors ${
                            link.isButton
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {link.isButton ? 'Button' : 'Link'}
                        </button>
                        <span className="text-[9px] text-slate-500">
                          {link.isButton ? 'Styled as button' : 'Styled as text link'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveLink(link.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logo Settings */}
        <div className="space-y-3 border-t border-slate-100 pt-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logo</h4>
          <div className="space-y-2">
            <Label className="text-[10px] font-semibold text-slate-500">Logo Text</Label>
            <Input
              value={navbar.logo?.text || ''}
              onChange={(e) => onUpdate({ logo: { ...navbar.logo, text: e.target.value } })}
              className="bg-slate-50 border-slate-200 text-xs h-8 font-semibold"
              placeholder="Your Brand Name"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
