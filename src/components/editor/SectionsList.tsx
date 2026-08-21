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
  Layers,
  Sparkles,
  Grid3X3,
  Layout,
  MessageSquare,
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
  Columns as ColumnsIcon,
  MousePointer2,
  Share2,
  Code,
  Search,
  X,
  Globe,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  createDefaultAboutSection,
  createDefaultTextOnlySection,
  createDefaultImageTextLeftSection,
  createDefaultImageTextRightSection,
  createDefaultTextButtonSection,
  createDefaultHeadingTextButtonSection,
  createDefaultTwoColumnSection,
} from "@/lib/defaultPageData";

const ELEMENT_CATEGORIES = [
  {
    name: "Sections",
    items: [
      { type: "hero", name: "Hero", icon: Sparkles, description: "Full-screen hero section with CTA", create: createDefaultHeroSection },
      { type: "features", name: "Features", icon: Grid3X3, description: "Showcase key features", create: createDefaultFeaturesSection },
      { type: "services", name: "Services", icon: Layout, description: "List your services", create: createDefaultServicesSection },
      { type: "about", name: "About Us", icon: Info, description: "Tell your story", create: createDefaultAboutSection },
      { type: "cta", name: "Call to Action", icon: MousePointer2, description: "Action-oriented CTA section", create: createDefaultCTASection },
      { type: "pricing", name: "Pricing", icon: DollarSign, description: "Pricing tiers & plans", create: createDefaultPricingSection },
      { type: "testimonials", name: "Testimonials", icon: Quote, description: "Customer reviews", create: createDefaultTestimonialsSection },
      // { type: "casestudies", name: "Case Studies", icon: BarChart2, description: "Display client success stories", create: createDefaultCaseStudiesSection },
      { type: "contact", name: "Contact", icon: Mail, description: "Contact form & information", create: createDefaultContactSection },
      { type: "faq", name: "FAQ", icon: HelpCircle, description: "Frequently asked questions", create: createDefaultFAQSection },
    ]
  },
  // {
  //   name: "Full Templates",
  //   color: "from-indigo-500/10 to-indigo-400/5",
  //   borderColor: "border-indigo-200/50",
  //   badgeColor: "bg-indigo-50 text-indigo-700",
  //   items: [
  //     { type: "business", name: "Business", icon: Building2, description: "Professional business site template", create: getBusinessPage, isFullPage: true },
  //     { type: "portfolio", name: "Portfolio", icon: Layout, description: "Clean portfolio template", create: getPortfolioPage, isFullPage: true },
  //     { type: "ecommerce", name: "Ecommerce", icon: ShoppingBag, description: "Modern shop template", create: getEcommercePage, isFullPage: true },
  //     { type: "consultant", name: "Consultant", icon: Users, description: "Personal consultant template", create: getConsultantPage, isFullPage: true },
  //   ]
  // },
  {
    name: "Media & Info",
    items: [
      { type: "gallery", name: "Gallery", icon: ImageIcon, description: "Photo gallery layout", create: createDefaultGallerySection },
      { type: "blog", name: "Blog", icon: FileText, description: "Blog post listings", create: createDefaultBlogListSection },
      { type: "logocloud", name: "Logo Cloud", icon: Building2, description: "Display partner/client logos", create: createDefaultLogoCloudSection },
      { type: "stats", name: "Stats", icon: BarChart2, description: "Display statistics", create: createDefaultStatsSection },
      { type: "team", name: "Team", icon: Users, description: "Team members grid", create: createDefaultTeamSection },
    ]
  },
  {
    name: "Layouts",
    items: [
      { type: "layout", name: "Text Only", icon: Type, description: "Simple text paragraph layout", create: createDefaultTextOnlySection },
      { type: "layout", name: "Image + Text (Left)", icon: Layout, description: "Image on left, text on right", create: createDefaultImageTextLeftSection },
      { type: "layout", name: "Image + Text (Right)", icon: Layout, description: "Text on left, image on right", create: createDefaultImageTextRightSection },
      { type: "layout", name: "Text + Button", icon: MousePointer2, description: "Text content with call-to-action button", create: createDefaultTextButtonSection },
      { type: "layout", name: "Heading + Text + Button", icon: Sparkles, description: "Full layout with heading, description, and button", create: createDefaultHeadingTextButtonSection },
      { type: "layout", name: "Two Column", icon: ColumnsIcon, description: "Split content into two columns", create: createDefaultTwoColumnSection },
    ]
  },
  {
    name: "Basic Elements",
    items: [
      { type: "text", name: "Text Block", icon: Type, description: "Rich text content", create: () => ({ id: uuidv4(), type: 'text', name: 'Text Block', content: { text: 'New text block content' }, styles: {} }) },
      { type: "button", name: "Button", icon: MousePointer2, description: "Interactive button", create: () => ({ id: uuidv4(), type: 'button', name: 'Button', content: { text: 'Click me' }, styles: {} }) },
      { type: "image", name: "Image", icon: ImageIcon, description: "Single image block", create: () => ({ id: uuidv4(), type: 'image', name: 'Image', content: { imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80' }, styles: {} }) },
    ]
  },
  {
    name: "Creative Elements",
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

  if (!page) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
          <Globe className="w-5 h-5 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm">Please select a page to manage elements.</p>
      </div>
    );
  }

  const filteredLayers = page.sections.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
  });

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-semibold text-slate-900">
          {view === "add" ? "Add Elements" : "Layers"}
        </h2>
        {view === "layers" && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
            {page.sections.length}
          </span>
        )}
      </div>

      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={view === "add" ? "Find an element..." : "Find a section..."}
            className="pl-9 pr-8 h-9 text-xs bg-slate-100 border-transparent rounded-lg shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md hover:bg-slate-200/80 flex items-center justify-center"
            >
              <X className="w-3 h-3 text-slate-500" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1" id="tour-elements-list">
        <div className="px-2 pb-3">
          {view === "layers" ? (
            <div className="space-y-0.5">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredLayers.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  {filteredLayers.length > 0 ? (
                    filteredLayers.map((section) => (
                      <SectionItem
                        key={section.id}
                        id={section.id}
                        name={section.name}
                        type={section.type}
                        visible={section.visible}
                        isSelected={editor.selectedSectionId === section.id}
                        onClick={() => selectSection(section.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Layers className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No sections yet</p>
                      <p className="text-xs text-slate-400 mt-1">Switch to Add Elements to start building</p>
                    </div>
                  )}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="space-y-4">
              {ELEMENT_CATEGORIES.map((cat) => {
                const filteredItems = cat.items.filter(
                  (item) =>
                    item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.description?.toLowerCase().includes(query.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={cat.name}>
                    <h3 className="px-2 pb-1.5 text-[11px] font-semibold text-slate-800 pl-2 uppercase tracking-wider flex items-center justify-start mb-1">
                      <span className="text-slate-800 px-1 py-0.5 border-b-2 border-slate-800">{cat.name}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {filteredItems.map((item) => (
                        <button
                          key={`${cat.name}-${item.type}-${item.name}`}
                          type="button"
                          onClick={() => handleAddElement(item)}
                          className="flex flex-col gap-1.5 p-2.5 rounded-lg border border-slate-100 bg-white text-left hover:shadow-[0_4px_4px_-2px_rgba(8,12,22,0.28)] transition-shadow"
                        >
                          <div className="flex items-center gap-2 min-w-0 w-full">
                            <div className="w-7 h-7 rounded-md bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                              <item.icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                            </div>
                            <p className="text-xs font-medium text-slate-800 truncate">{item.name}</p>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-snug">{item.description}</p>
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

      <div className="px-4 py-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic">
          {view === "add"
            ? "Tip: Click any element to add it to your page"
            : "Tip: Drag to reorder sections"}
        </p>
      </div>
    </div>
  );
}