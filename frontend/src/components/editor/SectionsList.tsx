import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useBuilder } from "@/contexts/BuilderContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SectionItem } from "./SectionItem";
import {
  Plus,
  Layers,
  Sparkles,
  Grid3X3,
  Layout,
  MessageSquare,
  ChevronDown,
  Quote,
  DollarSign,
  Image as ImageIcon,
  Mail,
  BarChart2,
  Users,
  HelpCircle,
  Building2,
  FileText,
  Info,
  Type,
  Square,
  Columns as ColumnsIcon,
  MousePointer2,
  Share2,
  Code,
  Search,
  Settings2,
  X,
  Palette,
  Globe
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createDefaultHeroSection,
  createDefaultFeaturesSection,
  createDefaultServicesSection,
  createDefaultCTASection,
  createDefaultTestimonialsSection,
  createDefaultPricingSection,
  createDefaultGallerySection,
  createDefaultContactSection,
  createDefaultStatsSection,
  createDefaultTeamSection,
  createDefaultFAQSection,
  createDefaultLogoCloudSection,
  createDefaultBlogListSection,
  createDefaultMasonryGallerySection,
  createDefaultAboutSection,
} from "@/lib/defaultPageData";
import { Badge } from "@/components/ui/badge";

const ELEMENT_CATEGORIES = [
  {
    name: "Sections",
    color: "from-blue-500/10 to-blue-400/5",
    borderColor: "border-blue-200/50",
    badgeColor: "bg-blue-50 text-blue-700",
    items: [
      { type: "hero", name: "Hero", icon: Sparkles, description: "Full-screen hero section with CTA", create: createDefaultHeroSection },
      { type: "features", name: "Features", icon: Grid3X3, description: "Showcase key features", create: createDefaultFeaturesSection },
      { type: "services", name: "Services", icon: Layout, description: "List your services", create: createDefaultServicesSection },
      { type: "about", name: "About Us", icon: Info, description: "Tell your story", create: createDefaultAboutSection },
      { type: "cta", name: "Call to Action", icon: MousePointer2, description: "Action-oriented CTA section", create: createDefaultCTASection },
      { type: "pricing", name: "Pricing", icon: DollarSign, description: "Pricing tiers & plans", create: createDefaultPricingSection },
      { type: "testimonials", name: "Testimonials", icon: Quote, description: "Customer reviews", create: createDefaultTestimonialsSection },
    ]
  },
  {
    name: "Media & Info",
    color: "from-purple-500/10 to-purple-400/5",
    borderColor: "border-purple-200/50",
    badgeColor: "bg-purple-50 text-purple-700",
    items: [
      { type: "gallery", name: "Gallery", icon: ImageIcon, description: "Photo gallery layout", create: createDefaultGallerySection },
      { type: "blog", name: "Blog", icon: FileText, description: "Blog post listings", create: createDefaultBlogListSection },
      { type: "stats", name: "Stats", icon: BarChart2, description: "Display statistics", create: createDefaultStatsSection },
      { type: "team", name: "Team", icon: Users, description: "Team members grid", create: createDefaultTeamSection },
    ]
  },
  {
    name: "Basic Elements",
    color: "from-emerald-500/10 to-emerald-400/5",
    borderColor: "border-emerald-200/50",
    badgeColor: "bg-emerald-50 text-emerald-700",
    items: [
      { type: "text", name: "Text Block", icon: Type, description: "Rich text content", create: () => ({ id: uuidv4(), type: 'text', name: 'Text Block', content: { text: 'New text block content' }, styles: {} }) },
      { type: "button", name: "Button", icon: MousePointer2, description: "Interactive button", create: () => ({ id: uuidv4(), type: 'button', name: 'Button', content: { text: 'Click me' }, styles: {} }) },
      { type: "image", name: "Image", icon: ImageIcon, description: "Single image block", create: () => ({ id: uuidv4(), type: 'image', name: 'Image', content: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' }, styles: {} }) },
    ]
  },
  {
    name: "Creative Elements",
    color: "from-amber-500/10 to-amber-400/5",
    borderColor: "border-amber-200/50",
    badgeColor: "bg-amber-50 text-amber-700",
    items: [
      {
        type: "floating-text",
        name: "Text Box",
        icon: Type,
        description: "Floating text element",
        isComponent: true,
        create: () => ({
          type: 'text',
          content: { text: 'New Text Element' },
          position: { x: 100, y: 100 },
          style: { fontSize: '24px', fontWeight: 'bold', color: '#000000', fontFamily: 'Inter' }
        })
      },
      {
        type: "floating-image",
        name: "Sticker / Image",
        icon: ImageIcon,
        description: "Drag-and-drop image",
        isComponent: true,
        create: () => ({
          type: 'image',
          content: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
          position: { x: 150, y: 150 },
          style: { width: '200px', borderRadius: '12px' }
        })
      },
    ]
  },
  {
    name: "Advanced",
    color: "from-rose-500/10 to-rose-400/5",
    borderColor: "border-rose-200/50",
    badgeColor: "bg-rose-50 text-rose-700",
    items: [
      { type: "grid", name: "Grid Layout", icon: Grid3X3, description: "Flexible grid system", create: () => ({ id: uuidv4(), type: 'grid', name: 'Grid', content: {}, styles: {} }) },
      { type: "social", name: "Social Links", icon: Share2, description: "Social media links", create: () => ({ id: uuidv4(), type: 'social', name: 'Social', content: {}, styles: {} }) },
      { type: "html", name: "Custom HTML", icon: Code, description: "Custom code block", create: () => ({ id: uuidv4(), type: 'html', name: 'HTML Block', content: { html: '<div>Custom HTML</div>' }, styles: {} }) },
    ]
  }
];

export function SectionsList({ view = "add" }) {
  const { state, selectSection, reorderSections, addSection, deleteSection, addComponent } = useBuilder();
  const { page, editor } = state;

  if (!page) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-slate-200" />
        </div>
        <p className="text-slate-400 text-sm font-medium">Please select a page to manage elements.</p>
      </div>
    );
  }

  const [query, setQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = page.sections.findIndex((s) => s.id === active.id);
      const newIndex = page.sections.findIndex((s) => s.id === over.id);
      const newOrder = arrayMove(
        page.sections.map((s) => s.id),
        oldIndex,
        newIndex
      );
      reorderSections(newOrder);
    }
  };

  const handleAddElement = (item) => {
    if (item.isComponent) {
      const sectionId = editor.selectedSectionId || (page.sections[0]?.id);
      if (!sectionId) return;
      addComponent(sectionId, item.create());
    } else {
      const newSection = item.create();
      addSection(newSection);
      selectSection(newSection.id);
    }
  };

  const filteredLayers = page.sections.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50/80 overflow-hidden">
      {/* Modern Header */}
      <div className="relative bg-white border-b border-slate-200/60 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
        <div className="relative p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${view === 'add' ? 'from-primary to-primary/80' : 'from-slate-600 to-slate-700'} flex items-center justify-center shadow-lg`}>
              {view === 'add' ? (
                <Plus className="w-4 h-4 text-white" />
              ) : (
                <Layers className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                {view === 'add' ? 'Add Elements' : 'Layers & Outline'}
              </h2>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                {view === 'add' ? 'Build your page with components' : 'Manage page structure'}
              </p>
            </div>
          </div>
          {view === 'layers' && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <Badge className="text-[10px] font-bold px-2.5 py-1 h-6 bg-emerald-50 text-emerald-700 border-emerald-200 rounded-lg">
                {page.sections.length} sections
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-4 py-3">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"></div>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-200" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === 'add' ? "Search for elements..." : "Find sections..."}
            className="pl-10 pr-4 h-10 text-xs bg-slate-50/70 border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-all duration-200 shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {view === 'layers' ? (
            <div className="space-y-2">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredLayers.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {filteredLayers.length > 0 ? filteredLayers.map((section, index) => (
                    <SectionItem
                      key={section.id}
                      id={section.id}
                      name={section.name}
                      type={section.type}
                      visible={section.visible}
                      isSelected={editor.selectedSectionId === section.id}
                      onClick={() => selectSection(section.id)}
                      index={index}
                    />
                  )) : (
                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-gradient-to-br from-slate-50/50 to-white">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-500 font-medium mb-2">No sections yet</p>
                      <p className="text-xs text-slate-400">Switch to Add Elements to start building</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Elements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-primary/50"></div>
                  <h3 className="text-sm font-bold text-slate-900">Popular Elements</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {ELEMENT_CATEGORIES[0].items.slice(0, 4).map((item, idx) => (
                    <button
                      key={item.type}
                      onClick={() => handleAddElement(item)}
                      className="group relative bg-white border-2 border-slate-200 hover:border-primary hover:shadow-lg rounded-2xl p-4 transition-all duration-300 hover:scale-105 active:scale-95"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 text-center">{item.name}</h4>
                      <p className="text-[9px] text-slate-500 text-center mt-1 line-clamp-2">{item.description}</p>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* All Categories */}
              {ELEMENT_CATEGORIES.map((cat, catIndex) => {
                const filteredItems = cat.items.filter(item =>
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  item.description?.toLowerCase().includes(query.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={cat.name} className="space-y-4" style={{ animationDelay: `${catIndex * 100}ms` }}>
                    {/* Category Header */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} ${cat.borderColor} border flex items-center justify-center`}>
                          <div className="w-5 h-5 rounded bg-white/80"></div>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                          <p className="text-[10px] text-slate-500">{filteredItems.length} element{filteredItems.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <Badge className={`text-[9px] font-bold px-2 py-1 h-5 ${cat.badgeColor} border-0 rounded-lg`}>
                        {filteredItems.length}
                      </Badge>
                    </div>

                    {/* Elements Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {filteredItems.map((item, idx) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddElement(item)}
                          className="group relative bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md rounded-xl p-3 transition-all duration-200 hover:scale-102 active:scale-98"
                          style={{ animationDelay: `${(catIndex * 100) + (idx * 30)}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} ${cat.borderColor} border flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                              <item.icon className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <h4 className="text-[10px] font-bold text-slate-900 truncate">{item.name}</h4>
                              <p className="text-[8px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">{item.description}</p>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Plus className="w-3 h-3 text-primary" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Professional Footer */}
      <div className="relative bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200/60 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
            <p className="text-[10px] text-slate-600 font-medium">
              {view === 'add' ? 'Click any element to add it to your page' : 'Drag to reorder sections'}
            </p>
          </div>
          {view === 'add' && (
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] text-slate-500">Ready to build</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
