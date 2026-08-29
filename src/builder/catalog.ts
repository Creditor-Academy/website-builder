import type { LucideIcon } from 'lucide-react';
import {
  Type,
  Image as ImageIcon,
  MousePointer2,
  Sparkles,
  Play,
  Minus,
  Mail,
  FileText,
  Square,
  Grid3X3,
  Layout,
  Quote,
  DollarSign,
  HelpCircle,
  Users,
  BarChart2,
  Building2,
  Info,
  Columns,
} from 'lucide-react';
import {
  createDefaultAboutSection,
  createDefaultBlogListSection,
  createDefaultContactSection,
  createDefaultCTASection,
  createDefaultFAQSection,
  createDefaultFeaturesSection,
  createDefaultGallerySection,
  createDefaultHeroSection,
  createDefaultLogoCloudSection,
  createDefaultPricingSection,
  createDefaultServicesSection,
  createDefaultStatsSection,
  createDefaultTeamSection,
  createDefaultTestimonialsSection,
} from '@/lib/defaultPageData';
import type { ElementType } from './types';

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  kind: 'element' | 'container' | 'prebuilt';
  elementType?: ElementType;
  createPrebuilt?: () => Record<string, unknown>;
}

export const ELEMENT_CATALOG: CatalogItem[] = [
  { id: 'text', name: 'Text', description: 'Heading or paragraph', icon: Type, category: 'Elements', kind: 'element', elementType: 'text' },
  { id: 'image', name: 'Image', description: 'Responsive image', icon: ImageIcon, category: 'Elements', kind: 'element', elementType: 'image' },
  { id: 'button', name: 'Button', description: 'Call to action', icon: MousePointer2, category: 'Elements', kind: 'element', elementType: 'button' },
  { id: 'icon', name: 'Icon', description: 'Lucide icon', icon: Sparkles, category: 'Elements', kind: 'element', elementType: 'icon' },
  { id: 'video', name: 'Video', description: 'YouTube or file', icon: Play, category: 'Elements', kind: 'element', elementType: 'video' },
  { id: 'divider', name: 'Divider', description: 'Horizontal rule', icon: Minus, category: 'Elements', kind: 'element', elementType: 'divider' },
  { id: 'form', name: 'Form', description: 'Reusable contact form', icon: Mail, category: 'Elements', kind: 'element', elementType: 'form' },
  { id: 'pdf', name: 'PDF Resource', description: 'Downloadable file', icon: FileText, category: 'Elements', kind: 'element', elementType: 'pdf' },
  { id: 'container', name: 'Container', description: 'Layout wrapper', icon: Square, category: 'Layout', kind: 'container' },
];

export const PREBUILT_CATALOG: CatalogItem[] = [
  { id: 'hero', name: 'Hero', description: 'Headline, media, and CTA', icon: Sparkles, category: 'Hero', kind: 'prebuilt', createPrebuilt: () => createDefaultHeroSection() },
  { id: 'features', name: 'Features', description: 'Feature grid', icon: Grid3X3, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultFeaturesSection() },
  { id: 'about', name: 'About', description: 'Story and image', icon: Info, category: 'About', kind: 'prebuilt', createPrebuilt: () => createDefaultAboutSection() },
  { id: 'services', name: 'Services', description: 'Service cards', icon: Layout, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultServicesSection() },
  { id: 'testimonials', name: 'Testimonials', description: 'Quotes and avatars', icon: Quote, category: 'Testimonials', kind: 'prebuilt', createPrebuilt: () => createDefaultTestimonialsSection() },
  { id: 'pricing', name: 'Pricing', description: 'Plans and pricing', icon: DollarSign, category: 'Pricing', kind: 'prebuilt', createPrebuilt: () => createDefaultPricingSection() },
  { id: 'faq', name: 'FAQ', description: 'Accordion questions', icon: HelpCircle, category: 'FAQ', kind: 'prebuilt', createPrebuilt: () => createDefaultFAQSection() },
  { id: 'team', name: 'Team', description: 'Team members', icon: Users, category: 'Team', kind: 'prebuilt', createPrebuilt: () => createDefaultTeamSection() },
  { id: 'gallery', name: 'Gallery', description: 'Image gallery', icon: ImageIcon, category: 'Gallery', kind: 'prebuilt', createPrebuilt: () => createDefaultGallerySection() },
  { id: 'cta', name: 'CTA', description: 'Conversion banner', icon: MousePointer2, category: 'CTA', kind: 'prebuilt', createPrebuilt: () => createDefaultCTASection() },
  { id: 'contact', name: 'Contact', description: 'Contact details and form', icon: Mail, category: 'Contact', kind: 'prebuilt', createPrebuilt: () => createDefaultContactSection() },
  { id: 'stats', name: 'Stats', description: 'Metrics row', icon: BarChart2, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultStatsSection() },
  { id: 'logocloud', name: 'Logo cloud', description: 'Partner logos', icon: Building2, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultLogoCloudSection() },
  { id: 'blog', name: 'Blog list', description: 'Article cards', icon: FileText, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultBlogListSection() },
  { id: 'footer-note', name: 'Two column', description: 'Split layout section', icon: Columns, category: 'Features', kind: 'prebuilt', createPrebuilt: () => createDefaultAboutSection() },
];

export const CATALOG_CATEGORIES = [
  'Elements',
  'Layout',
  'Hero',
  'Features',
  'About',
  'Testimonials',
  'Pricing',
  'FAQ',
  'Team',
  'Gallery',
  'CTA',
  'Contact',
];
