import { v4 as uuidv4 } from 'uuid';

export const createPortfolioNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Portfolio Navbar',
  visible: true,
  logo: { text: 'CreativeStudio', imageUrl: '', font: 'Outfit', href: '/#hero' },
  links: [
    { id: uuidv4(), label: 'Home', href: '/#hero' },
    { id: uuidv4(), label: 'About', href: '/#about' },
    { id: uuidv4(), label: 'Skills', href: '/#skills' },
    { id: uuidv4(), label: 'Work', href: '/#work' },
    { id: uuidv4(), label: 'Contact', href: '/#contact' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    height: '80px',
    borderBottom: '1px solid #e2e8f0',
  },
});

export const createPortfolioHeroSection = () => ({
  id: 'hero',
  type: 'hero',
  name: 'Portfolio Hero',
  visible: true,
  locked: false,
  styles: {
    useGradient: true,
    backgroundGradient: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
    backgroundColor: '#ffecd2',
    color: '#0f172a',
    headingColor: '#0f172a',
    paragraphColor: '#334155',
    padding: '120px 0',
    minHeight: '85vh',
  },
  content: {
    headline: 'Creative Developer & UI Designer',
    subheadline: 'Crafting high-performance digital experiences with precision and passion.',
    ctaText: 'View My Work',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
  },
  components: [],
});

export const createPortfolioAboutSection = () => ({
  id: 'about',
  type: 'about',
  name: 'About Me',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
    color: '#334155'
  },
  content: {
    headline: 'Driven by Design, Focused on Detail',
    description: 'With over 5 years of experience in the digital space, I help brands bridge the gap between complex technology and human-centric design.',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80',
    imagePosition: 'left',
  },
  components: [],
});

export const createPortfolioSkillsSection = () => ({
  id: 'skills',
  type: 'features',
  name: 'Technical Skills',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0b4469',
    padding: '80px 0',
  },
  content: {
    headline: 'My Toolkit',
    features: [
      { id: uuidv4(), icon: 'Code', title: 'Frontend Development', description: 'React, Next.js, TypeScript' },
      { id: uuidv4(), icon: 'Zap', title: 'UI/UX Design', description: 'Figma, Adobe XD, Framer' },
      { id: uuidv4(), icon: 'Layers', title: 'Backend', description: 'Node.js, PostgreSQL, Auth' },
    ],
  },
  components: [],
});

export const createPortfolioGallerySection = () => ({
  id: 'work',
  type: 'gallery',
  name: 'Selected Projects',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '120px 0',
  },
  content: {
    headline: 'Selected Works',
    subheadline: 'Curated projects reflecting my commitment to excellence.',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Fintech Dashboard' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', title: 'SaaS Platform' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80', title: 'E-commerce App' },
    ],
  },
  components: [],
});

export const createPortfolioTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Client Feedback',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'What Collaborators Say',
    testimonials: [
      { id: uuidv4(), quote: 'An exceptional eye for detail and a true professional.', name: 'Sarah Chen', role: 'Product Lead' },
      { id: uuidv4(), quote: 'Transformed our vision into a stunning digital reality.', name: 'Michael Ross', role: 'Founder' },
      { id: uuidv4(), quote: 'Transformed our vision into a stunning digital reality.', name: 'Rossy', role: 'CEO' },
    ],
  },
  components: [],
});

export const createPortfolioContactSection = () => ({
  id: 'contact',
  type: 'contact',
  name: 'Contact Me',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Let\'s Work Together',
    email: 'hello@creativestudio.com',
  },
  components: [],
});

export const createPortfolioFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Portfolio Footer',
  visible: true,
  logo: { text: 'CreativeStudio', imageUrl: '' },
  description: 'Crafting digital excellence through design and code.',
  socialLinks: [
    { id: uuidv4(), platform: 'github', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
  ],
  columns: [
     {
       id: uuidv4(),
       title: 'Quick Links',
       links: [
         
        { id: uuidv4(), label: 'About', href: '#about' },
         { id: uuidv4(), label: 'Work', href: '#work' },
       ],
     },
     {
       id: uuidv4(),
       title: 'Legal',
       links: [
         { id: uuidv4(), label: 'Privacy Policy', href: '/privacy' },
         { id: uuidv4(), label: 'Terms of Service', href: '/terms' },
       ],
     },
  ],
  copyright: `© ${new Date().getFullYear()} CreativeStudio. All rights reserved.`,
  styles: {
    backgroundColor: '#000000',
    textColor: '#94a3b8',
    padding: '80px 0',
  },
});

export const getPortfolioPage = () => ({
  id: uuidv4(),
  name: 'Portfolio Home',
  navbar: createPortfolioNavbar(),
  sections: [
    createPortfolioHeroSection(),
    createPortfolioAboutSection(),
    createPortfolioSkillsSection(),
    createPortfolioGallerySection(),
    createPortfolioTestimonialsSection(),
    createPortfolioContactSection(),
  ],
  footer: createPortfolioFooter(),
  globalStyles: {
    fontFamily: 'Outfit',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
});
