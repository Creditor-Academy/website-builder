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
  PanelBottom,
  PanelTop,
  AlignCenter,
} from 'lucide-react';
import {
  createCenteredNavbar,
  createClassicNavbar,
  createSimpleNavbar,
  createSplitNavbar,
  createBandFooter,
  createCenteredFooter,
  createContactFooter,
  createDefaultFooter,
  createMegaFooter,
  createMinimalFooter,
  createNewsletterFooter,
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
  kind: 'element' | 'container' | 'prebuilt' | 'footer' | 'navbar';
  elementType?: ElementType;
  createPrebuilt?: () => Record<string, unknown>;
  createNavbar?: () => Record<string, unknown>;
  createFooter?: () => Record<string, unknown>;
}

export const ELEMENT_CATALOG: CatalogItem[] = [
  { id: 'heading', name: 'Heading', description: 'Page or section title', icon: Type, category: 'Elements', kind: 'element', elementType: 'text' },
  { id: 'text', name: 'Text', description: 'Heading or paragraph', icon: Type, category: 'Elements', kind: 'element', elementType: 'text' },
  { id: 'paragraph', name: 'Paragraph', description: 'Body copy', icon: Type, category: 'Elements', kind: 'element', elementType: 'text' },
  { id: 'image', name: 'Image', description: 'Responsive image', icon: ImageIcon, category: 'Elements', kind: 'element', elementType: 'image' },
  { id: 'button', name: 'Button', description: 'Call to action', icon: MousePointer2, category: 'Elements', kind: 'element', elementType: 'button' },
  { id: 'icon', name: 'Icon', description: 'Lucide icon', icon: Sparkles, category: 'Elements', kind: 'element', elementType: 'icon' },
  { id: 'video', name: 'Video', description: 'YouTube or file', icon: Play, category: 'Elements', kind: 'element', elementType: 'video' },
  { id: 'divider', name: 'Divider', description: 'Horizontal rule', icon: Minus, category: 'Elements', kind: 'element', elementType: 'divider' },
  { id: 'form', name: 'Form', description: 'Reusable contact form', icon: Mail, category: 'Elements', kind: 'element', elementType: 'form' },
  { id: 'pdf', name: 'PDF Resource', description: 'Downloadable file', icon: FileText, category: 'Elements', kind: 'element', elementType: 'pdf' },
  { id: 'html', name: 'HTML', description: 'Sanitized custom markup', icon: FileText, category: 'Elements', kind: 'element', elementType: 'html' },
  { id: 'gallery', name: 'Gallery', description: 'Image grid', icon: ImageIcon, category: 'Elements', kind: 'element', elementType: 'gallery' },
  { id: 'social', name: 'Social', description: 'Social links', icon: Users, category: 'Elements', kind: 'element', elementType: 'social' },
  { id: 'container', name: 'Container', description: 'Layout wrapper', icon: Square, category: 'Layout', kind: 'container' },
];

export const PREBUILT_CATALOG: CatalogItem[] = [
  { id: 'header-simple', name: 'Simple Header', description: 'Logo, links, and outline CTA', icon: PanelTop, category: 'Header', kind: 'navbar', createNavbar: () => createSimpleNavbar() },
  { id: 'header-classic', name: 'Classic Header', description: 'White bar with a Get Started pill', icon: Layout, category: 'Header', kind: 'navbar', createNavbar: () => createClassicNavbar() },
  { id: 'header-centered', name: 'Centered Header', description: 'Logo in the middle, Contact pill', icon: AlignCenter, category: 'Header', kind: 'navbar', createNavbar: () => createCenteredNavbar() },
  { id: 'header-split', name: 'Split Header', description: 'Dark bar with a white pill CTA', icon: Columns, category: 'Header', kind: 'navbar', createNavbar: () => createSplitNavbar() },
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
  { id: 'footer', name: 'Footer', description: 'Links, social, and copyright', icon: PanelBottom, category: 'Footer', kind: 'footer', createFooter: () => createDefaultFooter() },
  { id: 'footer-minimal', name: 'Minimal bar', description: 'Logo, inline links, and copyright', icon: Minus, category: 'Footer', kind: 'footer', createFooter: () => createMinimalFooter() },
  { id: 'footer-centered', name: 'Centered stack', description: 'Centered brand, links, and social', icon: AlignCenter, category: 'Footer', kind: 'footer', createFooter: () => createCenteredFooter() },
  { id: 'footer-newsletter', name: 'Newsletter', description: 'Subscribe line with link columns', icon: Mail, category: 'Footer', kind: 'footer', createFooter: () => createNewsletterFooter() },
  { id: 'footer-contact', name: 'Contact row', description: 'Email, phone, and address', icon: Building2, category: 'Footer', kind: 'footer', createFooter: () => createContactFooter() },
  { id: 'footer-mega', name: 'Mega columns', description: 'Brand row and four link groups', icon: Columns, category: 'Footer', kind: 'footer', createFooter: () => createMegaFooter() },
  { id: 'footer-band', name: 'Card band', description: 'Dark card on a light page', icon: Layout, category: 'Footer', kind: 'footer', createFooter: () => createBandFooter() },
];

export function navbarFromCatalog(id: string) {
  const item = PREBUILT_CATALOG.find((entry) => entry.id === id && entry.kind === 'navbar');
  return item?.createNavbar?.() || createClassicNavbar();
}

export function footerFromCatalog(id: string) {
  const item = PREBUILT_CATALOG.find((entry) => entry.id === id && entry.kind === 'footer');
  return item?.createFooter?.() || createDefaultFooter();
}

export const CATALOG_CATEGORIES = [
  'Elements',
  'Layout',
  'Header',
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
  'Footer',
];
