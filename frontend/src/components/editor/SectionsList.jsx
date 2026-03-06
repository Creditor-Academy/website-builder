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
  Settings2, // Added Settings2
  X, // Added X
  Palette // Added Palette
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
    items: [
      { type: "hero", name: "Hero", icon: Sparkles, create: createDefaultHeroSection },
      { type: "features", name: "Features", icon: Grid3X3, create: createDefaultFeaturesSection },
      { type: "services", name: "Services", icon: Layout, create: createDefaultServicesSection },
      { type: "about", name: "About Us", icon: Info, create: createDefaultAboutSection },
      { type: "pricing", name: "Pricing", icon: DollarSign, create: createDefaultPricingSection },
      { type: "testimonials", name: "Testimonials", icon: Quote, create: createDefaultTestimonialsSection },
    ]
  },
  {
    name: "Media & Info",
    items: [
      { type: "gallery", name: "Gallery", icon: ImageIcon, create: createDefaultGallerySection },
      { type: "blog", name: "Blog", icon: FileText, create: createDefaultBlogListSection },
      { type: "stats", name: "Stats", icon: BarChart2, create: createDefaultStatsSection },
      { type: "team", name: "Team", icon: Users, create: createDefaultTeamSection },
    ]
  },
  {
    name: "Basic Elements",
    items: [
      { type: "text", name: "Text Block", icon: Type, create: () => ({ id: uuidv4(), type: 'text', name: 'Text Block', content: { text: 'New text block content' }, styles: {} }) },
      { type: "button", name: "Button", icon: MousePointer2, create: () => ({ id: uuidv4(), type: 'button', name: 'Button', content: { text: 'Click me' }, styles: {} }) },
      { type: "image", name: "Image", icon: ImageIcon, create: () => ({ id: uuidv4(), type: 'image', name: 'Image', content: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' }, styles: {} }) },
    ]
  },
  {
    name: "Creative Elements",
    items: [
      {
        type: "floating-text",
        name: "Text Box",
        icon: Type,
        isComponent: true,
        create: () => ({
          type: 'text',
          content: { text: 'New Text Element' },
          position: { x: 200, y: 150 },
          style: { fontSize: '24px', fontWeight: 'bold', color: '#000000', fontFamily: 'Inter' }
        })
      },
      {
        type: "floating-image",
        name: "Sticker / Image",
        icon: ImageIcon,
        isComponent: true,
        create: () => ({
          type: 'image',
          content: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
          position: { x: 150, y: 150 },
          style: { width: '200px', height: '200px', borderRadius: '12px' }
        })
      },
      {
        type: "floating-button",
        name: "Button",
        icon: MousePointer2,
        isComponent: true,
        create: () => ({
          type: 'button',
          content: { text: 'Learn More', variant: 'default', size: 'default' },
          position: { x: 100, y: 200 },
          style: { width: '150px', height: '40px', backgroundColor: '#3b82f6', color: '#ffffff', borderRadius: '8px', padding: '8px 16px' }
        })
      },
      {
        type: "section",
        name: "Section",
        icon: Layout, // Using Layout icon, as Square is already used for Basic Elements Text Block
        isComponent: false,
        create: () => ({
          id: uuidv4(),
          type: "section",
          name: "New Section",
          visible: true,
          x: 0,
          y: 0,
          width: "100%",
          minHeight: "50vh",
          rotation: 0,
          zIndex: 1,
          styles: {
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "#2211a2",
          },
          children: [],
        }),
      },
      {
        type: "floating-container",
        name: "Container",
        icon: ColumnsIcon,
        isComponent: true,
        create: () => ({
          id: uuidv4(),
          type: 'container',
          name: 'New Container',
          x: 50,
          y: 50,
          width: '300px',
          minHeight: '150px',
          rotation: 0,
          zIndex: 1,
          styles: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '20px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
          },
          children: [],
        }),
      },
    ]
  },
  {
    name: "Advanced",
    items: [
      { type: "grid", name: "Grid Layout", icon: Grid3X3, create: () => ({ id: uuidv4(), type: 'grid', name: 'Grid', content: {}, styles: {} }) },
      { type: "social", name: "Social Links", icon: Share2, create: () => ({ id: uuidv4(), type: 'social', name: 'Social', content: {}, styles: {} }) },
      { type: "html", name: "Custom HTML", icon: Code, create: () => ({ id: uuidv4(), type: 'html', name: 'HTML Block', content: { html: '<div>Custom HTML</div>' }, styles: {} }) },
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
    <div className="h-full flex flex-col bg-white overflow-hidden animate-in fade-in duration-300">
      {/* Header with Dynamic Title */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <h2 className="text-sm font-bold text-slate-900 capitalize tracking-tight">
          {view === 'add' ? 'Add Elements' : 'Layers / Outline'}
        </h2>
        {view === 'layers' && (
          <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0 h-5 bg-slate-100 text-slate-500">
            {page.sections.length}
          </Badge>
        )}
      </div>

      {/* Global Search for either View */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === 'add' ? "Search components..." : "Find layer..."}
            className="pl-9 h-9 text-xs bg-white border-slate-200 focus:ring-primary/20 rounded-xl"
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
            <div className="space-y-8">
              {ELEMENT_CATEGORIES.map((cat) => {
                const filteredItems = cat.items.filter(item =>
                  item.name.toLowerCase().includes(query.toLowerCase()) ||
                  cat.name.toLowerCase().includes(query.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={cat.name} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 bg-primary/30 rounded-full" />
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{cat.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {filteredItems.map((item) => (
                        <button
                          key={item.type}
                          onClick={() => handleAddElement(item)}
                          className="flex flex-col items-start p-4 rounded-2xl border border-slate-100 bg-white hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden text-left"
                        >
                          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="w-3 h-3 text-primary" />
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-3">
                            <item.icon className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                          </div>

                          <span className="text-[11px] font-bold text-slate-700 group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-slate-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to add
                          </span>
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
      <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <p className="text-[10px] text-slate-400 text-center font-medium italic">
          Tip: Drag elements from the Canvas to reorder
        </p>
      </div>
    </div>
  );
}
