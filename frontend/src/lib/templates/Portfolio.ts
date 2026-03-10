import { v4 as uuidv4 } from 'uuid';

export const createPortfolioNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Portfolio Navbar',
  visible: true,
  logo: { text: 'Creative Studio', imageUrl: '', font: 'Outfit' },
  links: [
    { id: uuidv4(), label: 'Works', href: '#works' },
    { id: uuidv4(), label: 'About', href: '#about' },
    { id: uuidv4(), label: 'Contact', href: '#contact' },
  ],
  styles: {
    backgroundColor: 'transparent',
    textColor: '#0f172a',
    height: '100px',
  },
});

export const createPortfolioHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Portfolio Hero',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
    minHeight: '80vh',
    textAlign: 'center',
  },
  content: {
    headline: 'Digital Craftsmanship & Minimalist Design',
    subheadline: 'I build high-end digital experiences that define modern brands.',
    ctaText: 'View Selected Works',
    imageUrl: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&q=80',
  },
  components: [],
});

export const createPortfolioGallerySection = () => ({
  id: uuidv4(),
  type: 'gallery',
  name: 'Portfolio Gallery',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '120px 0',
  },
  content: {
    headline: 'Selected Projects',
    subheadline: 'A curated showcase of digital innovation.',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Interface Design' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', title: 'Brand Identity' },
    ],
  },
  components: [],
});

export const createPortfolioFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Portfolio Footer',
  visible: true,
  logo: { text: 'Creative Studio', imageUrl: '' },
  description: 'Crafting intentional digital experiences through minimalist design.',
  socialLinks: [
    { id: uuidv4(), platform: 'instagram', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'github', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Navigation',
      links: [
        { id: uuidv4(), label: 'Selected Works', href: '#works' },
        { id: uuidv4(), label: 'About Studio', href: '#about' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Creative Studio. Crafted with intent.`,
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#64748b',
    padding: '80px 0',
    borderTop: '1px solid #e2e8f0',
  },
});

export const getPortfolioPage = () => ({
  id: uuidv4(),
  name: 'Home',
  navbar: createPortfolioNavbar(),
  sections: [
    createPortfolioHeroSection(),
    createPortfolioGallerySection(),
  ],
  footer: createPortfolioFooter(),
  globalStyles: {
    fontFamily: 'Outfit',
    primaryColor: '#0f172a',
    backgroundColor: '#ffffff',
  },
});
