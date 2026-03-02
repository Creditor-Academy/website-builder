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
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-slate-50/30 to-slate-50/50 overflow-hidden animate-in fade-in duration-300">
      {/* Header with Dynamic Title */}
      <div className="p-4 border-b border-slate-100/50 flex items-center justify-between bg-white/80 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight capitalize flex items-center gap-2">
            {view === 'add' ? (
              <>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Add Elements
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-slate-400" />
                Layers / Outline
              </>
            )}
          </h2>
          {view === 'add' && <p className="text-[10px] text-slate-400 mt-1 font-medium">Drag or click to add</p>}
        </div>
        {view === 'layers' && (
          <Badge variant="secondary" className="text-[10px] font-bold px-2.5 py-1 h-6 bg-primary/10 text-primary border-primary/20 rounded-lg">
            {page.sections.length}
          </Badge>
        )}
      </div>

      {/* Global Search for either View */}
      <div className="px-4 py-3 bg-white/50 border-b border-slate-100/50 backdrop-blur-sm">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === 'add' ? "Search elements..." : "Find layer..."}
            className="pl-9 h-9 text-xs bg-white border-slate-200 hover:border-slate-300 focus:ring-primary/30 rounded-xl transition-all"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {view === 'layers' ? (
            <div className="space-y-1">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredLayers.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {filteredLayers.length > 0 ? filteredLayers.map((section) => (
                    <SectionItem
                      key={section.id}
                      id={section.id}
                      name={section.name}
                      type={section.type}
                      visible={section.visible}
                      isSelected={editor.selectedSectionId === section.id}
                      onClick={() => selectSection(section.id)}
                    />
                  )) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                      <Layers className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                      <p className="text-xs text-slate-400 font-medium">No layers found</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="space-y-6">
              {ELEMENT_CATEGORIES.map((cat) => {
                const filteredItems = cat.items.filter(item =>
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  cat.name.toLowerCase().includes(query.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={cat.name} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 px-1">
                      <div className={`w-2 h-5 rounded-full bg-gradient-to-b ${cat.color} border ${cat.borderColor}`} />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{cat.name}</h3>
                        <div className="text-[9px] text-slate-400 font-medium mt-0.5">{filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    {/* Elements Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {filteredItems.map((item, idx) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddElement(item)}
                          className={`relative flex flex-col items-start justify-between p-3 rounded-xl border transition-all duration-200 group overflow-hidden text-left h-full
                            bg-gradient-to-br ${cat.color} border-slate-200 
                            hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 hover:scale-105
                            active:scale-95
                            focus:outline-none focus:ring-2 focus:ring-primary/30
                            before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-200 before:pointer-events-none
                          `}
                          style={{ animationDelay: `${idx * 30}ms` }}
                        >
                          {/* Decorative corner accent */}
                          {/* <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" /> */}

                          {/* Icon Container */}
                          <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} border ${cat.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 relative z-10 mb-2 shadow-sm`}>
                            <item.icon className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors duration-200" />
                          </div>

                          {/* Text Content */}
                          <div className="relative z-10 flex-1">
                            <span className="text-[11px] font-bold text-slate-900 group-hover:text-primary transition-colors duration-200 block">
                              {item.name}
                            </span>
                            <span className="text-[9px] text-slate-500 group-hover:text-primary/70 mt-0.5 line-clamp-2 leading-tight block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {item.description || 'Click to add'}
                            </span>
                          </div>

                          {/* Add Button */}
                          <div className="mt-2 flex items-center gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-4 h-4 rounded-full bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center transition-colors">
                              <Plus className="w-2.5 h-2.5 text-primary group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-[8px] font-semibold text-primary/70 group-hover:text-primary">Add</span>
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

      {/* Footer Helper */}
      <div className="p-3 border-t border-slate-100/50 bg-gradient-to-r from-white via-primary/5 to-white shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-start gap-2">
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic">
            {view === 'add' ? 'Tip: Search or browse categories to find elements' : 'Drag to reorder, click to edit'}
          </p>
        </div>
      </div>
    </div>
  );
}
