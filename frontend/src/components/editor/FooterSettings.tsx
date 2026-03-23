import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, GripVertical, Settings, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FooterSettingsProps {
  footer: any;
  pages: any[];
  onUpdate: (updates: any) => void;
  isExpanded?: boolean;
}

export function FooterSettings({ footer, pages, onUpdate, isExpanded = true }: FooterSettingsProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [editingLink, setEditingLink] = useState<string | null>(null);

  if (!footer) return null;

  const columns = footer.columns || [];
  const socialLinks = footer.socialLinks || [];
  const styles = footer.styles || {};

  const handleAddColumn = () => {
    const newColumn = {
      id: uuidv4(),
      title: 'New Column',
      links: [
        { id: uuidv4(), label: 'New Link', href: '/new-page' }
      ],
    };
    onUpdate({ columns: [...columns, newColumn] });
  };

  const handleSyncWithNavbar = () => {
    // Get navbar links (assuming they're passed or available globally)
    // For now, we'll create a navigation column with common links
    const navbarColumn = {
      id: uuidv4(),
      title: 'Navigation',
      links: [
        { id: uuidv4(), label: 'Home', href: '/' },
        { id: uuidv4(), label: 'About', href: '/about' },
        { id: uuidv4(), label: 'Services', href: '/services' },
        { id: uuidv4(), label: 'Contact', href: '/contact' },
      ],
    };

    // Check if a "Navigation" or "Product" column already exists and replace it
    const existingNavColumn = columns.find(c => 
      c.title.toLowerCase() === 'navigation' || 
      c.title.toLowerCase() === 'product' || 
      c.title.toLowerCase() === 'products'
    );
    
    if (existingNavColumn) {
      // Replace existing navigation/product column
      onUpdate({
        columns: columns.map(c => 
          c.id === existingNavColumn.id ? navbarColumn : c
        )
      });
    } else {
      // Add new navigation column
      onUpdate({ columns: [...columns, navbarColumn] });
    }
  };

  const handleRemoveColumn = (columnId: string) => {
    onUpdate({ columns: columns.filter((c: any) => c.id !== columnId) });
  };

  const handleUpdateColumn = (columnId: string, updates: any) => {
    onUpdate({
      columns: columns.map((c: any) =>
        c.id === columnId ? { ...c, ...updates } : c
      ),
    });
  };

  const handleAddLink = (columnId: string) => {
    const newLink = {
      id: uuidv4(),
      label: 'New Link',
      href: '/new-page',
    };
    
    onUpdate({
      columns: columns.map((c: any) =>
        c.id === columnId 
          ? { ...c, links: [...(c.links || []), newLink] }
          : c
      ),
    });
  };

  const handleRemoveLink = (columnId: string, linkId: string) => {
    onUpdate({
      columns: columns.map((c: any) =>
        c.id === columnId 
          ? { ...c, links: c.links.filter((l: any) => l.id !== linkId) }
          : c
      ),
    });
  };

  const handleUpdateLink = (columnId: string, linkId: string, updates: any) => {
    onUpdate({
      columns: columns.map((c: any) =>
        c.id === columnId 
          ? {
              ...c,
              links: c.links.map((l: any) =>
                l.id === linkId ? { ...l, ...updates } : l
              ),
            }
          : c
      ),
    });
  };

  const handleAddSocialLink = () => {
    const newSocialLink = {
      id: uuidv4(),
      platform: 'twitter',
      href: 'https://twitter.com/yourusername',
    };
    onUpdate({ socialLinks: [...socialLinks, newSocialLink] });
  };

  const handleRemoveSocialLink = (linkId: string) => {
    onUpdate({ socialLinks: socialLinks.filter((l: any) => l.id !== linkId) });
  };

  const handleUpdateSocialLink = (linkId: string, updates: any) => {
    onUpdate({
      socialLinks: socialLinks.map((l: any) =>
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
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-sm shadow-black/5">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-700">Footer Settings</h3>
              <p className="text-xs text-slate-500">Manage footer links and appearance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Global</span>
            <ChevronDown className={`w-4 h-4 transition-transform text-slate-400 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="border-t border-slate-100">
        <div className="p-4 space-y-6">
          {/* Footer Logo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Footer Logo</Label>
            <Input
              value={footer.logo?.text || ''}
              onChange={(e) => onUpdate({ logo: { ...footer.logo, text: e.target.value } })}
              placeholder="Footer logo text"
              className="text-sm"
            />
          </div>

          {/* Footer Columns */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button onClick={handleSyncWithNavbar} size="sm" variant="outline" className="text-xs h-8 border-dashed hover:border-none hover:bg-primary">
                  <Settings className="w-3 h-3 mr-1" />
                  Sync with Navbar
                </Button>
                <Button onClick={handleAddColumn} size="sm" variant="outline" className="text-xs h-8 border-dashed hover:border-none hover:bg-primary">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Column
                </Button>
              </div>
            </div>
            
            {columns.map((column: any, columnIndex: number) => (
              <div key={column.id} className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                  <Input
                    value={column.title || ''}
                    onChange={(e) => handleUpdateColumn(column.id, { title: e.target.value })}
                    placeholder="Column title"
                    className="flex-1 text-sm font-medium bg-white border-slate-200 h-8"
                  />
                  <Button
                    onClick={() => handleRemoveColumn(column.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Links in this column */}
                <div className="space-y-2 pl-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Links</span>
                    <Button
                      onClick={() => handleAddLink(column.id)}
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Link
                    </Button>
                  </div>
                  
                  {(column.links || []).map((link: any) => (
                    <div key={link.id} className="flex items-center gap-2 p-2 bg-white rounded-md border border-slate-200">
                      <GripVertical className="w-3 h-3 text-slate-300" />
                      {editingLink === link.id ? (
                        <>
                          <Input
                            value={link.label}
                            onChange={(e) => handleUpdateLink(column.id, link.id, { label: e.target.value })}
                            placeholder="Link label"
                            className="flex-1 text-xs h-7 bg-white border-slate-200"
                          />
                          <Select
                            value={link.href}
                            onValueChange={(value) => handleUpdateLink(column.id, link.id, { href: value })}
                          >
                            <SelectTrigger className="w-32 h-7 text-xs">
                              <SelectValue placeholder="Select page" />
                            </SelectTrigger>
                            <SelectContent>
                              {pages.map((page: any) => (
                                <SelectItem key={page.id} value={page.slug}>
                                  {page.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="/custom">Custom URL</SelectItem>
                            </SelectContent>
                          </Select>
                          {link.href === '/custom' && (
                            <Input
                              value={link.customHref || ''}
                              onChange={(e) => handleUpdateLink(column.id, link.id, { customHref: e.target.value })}
                              placeholder="Enter URL"
                              className="w-32 text-xs h-7"
                            />
                          )}
                          <Button
                            onClick={() => setEditingLink(null)}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2 hover:bg-slate-100"
                          >
                            Done
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-xs text-slate-600">{link.label}</span>
                          <span className="text-xs text-slate-400">{link.href}</span>
                          <Button
                            onClick={() => setEditingLink(link.id)}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2 hover:bg-slate-100"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleRemoveLink(column.id, link.id)}
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Social Links</Label>
              <Button onClick={handleAddSocialLink} size="sm" variant="outline" className="text-xs h-8 border-dashed hover:border-primary hover:bg-primary/5">
                <Plus className="w-3 h-3 mr-1" />
                Add Social
              </Button>
            </div>
            
            {socialLinks.map((social: any) => (
              <div key={social.id} className="flex items-center gap-2 p-3 bg-white rounded-md border border-slate-200">
                <Select
                  value={social.platform}
                  onValueChange={(value) => handleUpdateSocialLink(social.id, { platform: value })}
                >
                  <SelectTrigger className="w-32 h-8 text-xs bg-white border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={social.href}
                  onChange={(e) => handleUpdateSocialLink(social.id, { href: e.target.value })}
                  placeholder="Social media URL"
                  className="flex-1 text-sm h-8 bg-white border-slate-200"
                />
                <Button
                  onClick={() => handleRemoveSocialLink(social.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Footer Copyright Text</Label>
            <Input
              value={footer.copyright || ''}
              onChange={(e) => onUpdate({ copyright: e.target.value })}
              placeholder="© 2024 Your Company. All rights reserved."
              className="text-sm bg-white border-slate-200 h-8"
            />
          </div>

          {/* Footer Styles */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Footer Styles</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.backgroundColor || '#0f172a'}
                    onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                  />
                  <Input
                    value={styles.backgroundColor || '#0f172a'}
                    onChange={(e) => handleUpdateStyles({ backgroundColor: e.target.value })}
                    className="flex-1 text-xs h-8 font-mono bg-white border-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Text Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={styles.textColor || '#ffffff'}
                    onChange={(e) => handleUpdateStyles({ textColor: e.target.value })}
                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                  />
                  <Input
                    value={styles.textColor || '#ffffff'}
                    onChange={(e) => handleUpdateStyles({ textColor: e.target.value })}
                    className="flex-1 text-xs h-8 font-mono bg-white border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
