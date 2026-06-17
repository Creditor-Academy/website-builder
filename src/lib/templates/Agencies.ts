import { v4 as uuidv4 } from 'uuid';

export const createAgenciesNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Agency Navbar',
  visible: true,
  logo: { text: 'NexusAgency', imageUrl: '', font: 'Inter' },
  links: [
    { id: uuidv4(), label: 'Services', href: '#services' },
    { id: uuidv4(), label: 'About', href: '#about' },
    { id: uuidv4(), label: 'Case Studies', href: '#work' },
    { id: uuidv4(), label: 'Contact', href: '#contact' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    height: '80px',
    borderBottom: '1px solid #e2e8f0',
  },
});

export const createAgenciesHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Agency Hero',
  visible: true,
  locked: false,
  styles: {
    useGradient: true,
    backgroundGradient: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    headingColor: '#ffffff',
    paragraphColor: '#e0e7ff',
    padding: '120px 0',
    minHeight: '80vh',
  },
  content: {
    headline: 'Scaling Brands through Innovation & Design',
    subheadline: 'We are a full-stack creative agency dedicated to transforming complex challenges into elegant digital solutions.',
    ctaText: 'Start Your Project',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
  },
  components: [],
});

export const createAgenciesServicesSection = () => ({
  id: 'services',
  type: 'services',
  name: 'Our Expertise',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Our Expertise',
    subheadline: 'We deliver end-to-end digital solutions that drive real business results.',
    services: [
      { id: uuidv4(), title: 'Digital Marketing', description: 'Data-driven strategies to grow your online presence and conversion rates.', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80' },
      { id: uuidv4(), title: 'UI/UX Design', description: 'User-centric designs that provide seamless experiences across all platforms.', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80' },
      { id: uuidv4(), title: 'Custom Development', description: 'Scalable and secure software solutions tailored to your business needs.', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80' },
    ],
  },
  components: [],
});

export const createAgenciesAboutSection = () => ({
  id: 'about',
  type: 'about',
  name: 'About Agency',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Your Partner in Digital Transformation',
    description: 'Founded on the principle of excellence, our agency brings together the brightest minds in tech and design to build products that matter. We don\'t just build websites; we build businesses.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  components: [],
});

export const createAgenciesCaseStudiesSection = () => ({
  id: 'work',
  type: 'gallery',
  name: 'Success Stories',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '120px 0',
  },
  content: {
    headline: 'Success Stories',
    subheadline: 'Take a look at how we helped our clients achieve their digital goals.',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Global E-commerce Growth' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', title: 'Fintech Mobile App Rebrand' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', title: 'SaaS Platform UX Overhaul' },
    ],
  },
  components: [],
});

export const createAgenciesContactCTASection = () => ({
  id: 'contact',
  type: 'contact',
  variant: 'centered',
  name: 'CTA & Contact',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Ready to Elevate Your Brand?',
    subheadline: 'Let\'s discuss your next project and see how we can help you grow.',
    email: 'hello@nexusagency.com',
    buttonText: 'Send Inquiry'
  },
  components: [],
});

export const createAgenciesFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Agency Footer',
  visible: true,
  logo: { text: 'NexusAgency', imageUrl: '' },
  description: 'A forward-thinking agency building the digital future.',
  socialLinks: [
    { id: uuidv4(), platform: 'linkedin', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Company',
      links: [
        { id: uuidv4(), label: 'About Us', href: '#about' },
        { id: uuidv4(), label: 'Our Work', href: '#work' },
        { id: uuidv4(), label: 'Careers', href: '#' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Services',
      links: [
        { id: uuidv4(), label: 'Marketing', href: '/marketing' },
        { id: uuidv4(), label: 'Design', href: '/design' },
        { id: uuidv4(), label: 'Dev', href: '/dev' },
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
  copyright: `© ${new Date().getFullYear()} NexusAgency. All rights reserved.`,
  styles: {
    backgroundColor: '#0f172a',
    textColor: '#94a3b8',
    padding: '80px 0',
  },
});

// --- Service Sub-Pages ---

export const createMarketingPage = () => ({
  id: uuidv4(),
  name: 'Marketing',
  slug: '/marketing',
  navbar: createAgenciesNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Marketing Hero',
      visible: true,
      locked: false,
      styles: {
        useGradient: true,
        backgroundGradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
        backgroundColor: '#f97316',
        color: '#ffffff',
        headingColor: '#ffffff',
        paragraphColor: '#fce7f3',
        padding: '120px 0',
        minHeight: '60vh',
      },
      content: {
        headline: 'Digital Marketing That Drives Results',
        subheadline: 'From SEO and content strategy to paid ads and analytics — we turn data into growth.',
        ctaText: 'Get Started',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Marketing Services',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'What We Offer',
        features: [
          { id: uuidv4(), icon: 'TrendingUp', title: 'SEO & Content', description: 'Rank higher with our data-driven SEO strategies and engaging content marketing.' },
          { id: uuidv4(), icon: 'Zap', title: 'Paid Advertising', description: 'Maximize ROI with targeted Google Ads, Meta Ads, and LinkedIn campaigns.' },
          { id: uuidv4(), icon: 'BarChart2', title: 'Analytics & Insights', description: 'Track performance with custom dashboards and actionable reporting.' },
        ],
      },
      components: [],
    },
  ],
  footer: createAgenciesFooter(),
});

export const createDesignPage = () => ({
  id: uuidv4(),
  name: 'Design',
  slug: '/design',
  navbar: createAgenciesNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Design Hero',
      visible: true,
      locked: false,
      styles: {
        useGradient: true,
        backgroundGradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        backgroundColor: '#8b5cf6',
        color: '#ffffff',
        headingColor: '#ffffff',
        paragraphColor: '#e0e7ff',
        padding: '120px 0',
        minHeight: '60vh',
      },
      content: {
        headline: 'Design That Captivates & Converts',
        subheadline: 'We craft pixel-perfect UI/UX designs that delight users and drive business outcomes.',
        ctaText: 'See Our Work',
        imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Design Services',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'Our Design Process',
        features: [
          { id: uuidv4(), icon: 'Layers', title: 'UI/UX Design', description: 'Research-driven design systems and wireframes for web and mobile products.' },
          { id: uuidv4(), icon: 'Palette', title: 'Brand Identity', description: 'Logo design, color systems, and typography that define your brand.' },
          { id: uuidv4(), icon: 'Monitor', title: 'Prototyping', description: 'Interactive prototypes in Figma and Framer to validate ideas before development.' },
        ],
      },
      components: [],
    },
  ],
  footer: createAgenciesFooter(),
});

export const createDevPage = () => ({
  id: uuidv4(),
  name: 'Development',
  slug: '/dev',
  navbar: createAgenciesNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Dev Hero',
      visible: true,
      locked: false,
      styles: {
        useGradient: true,
        backgroundGradient: 'linear-gradient(135deg, #059669 0%, #0891b2 100%)',
        backgroundColor: '#059669',
        color: '#ffffff',
        headingColor: '#ffffff',
        paragraphColor: '#d1fae5',
        padding: '120px 0',
        minHeight: '60vh',
      },
      content: {
        headline: 'Engineering Solutions Built to Scale',
        subheadline: 'Custom web apps, APIs, and cloud infrastructure — architected for performance and reliability.',
        ctaText: 'Start a Project',
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Dev Services',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'Tech Stack & Capabilities',
        features: [
          { id: uuidv4(), icon: 'Code', title: 'Full-Stack Development', description: 'React, Next.js, Node.js, and cloud-native architectures for modern web applications.' },
          { id: uuidv4(), icon: 'Database', title: 'Backend & APIs', description: 'Scalable REST and GraphQL APIs with PostgreSQL, Redis, and microservices.' },
          { id: uuidv4(), icon: 'Cloud', title: 'DevOps & Cloud', description: 'CI/CD pipelines, Docker, Kubernetes, and AWS/GCP deployment automation.' },
        ],
      },
      components: [],
    },
  ],
  footer: createAgenciesFooter(),
});

export const getAgenciesPage = () => ({
  id: uuidv4(),
  name: 'Home',
  slug: '/',
  meta: {
    title: 'NexusAgency - Creative Digital Solutions',
    description: 'Scaling brands through innovation, design, and custom development.'
  },
  navbar: createAgenciesNavbar(),
  sections: [
    createAgenciesHeroSection(),
    createAgenciesServicesSection(),
    createAgenciesAboutSection(),
    createAgenciesCaseStudiesSection(),
    createAgenciesContactCTASection(),
  ],
  footer: createAgenciesFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    primaryColor: '#4f46e5',
    backgroundColor: '#ffffff',
  },
});
