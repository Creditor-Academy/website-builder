import { v4 as uuidv4 } from 'uuid';

export const createBusinessNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Business Navbar',
  visible: true,
  logo: { text: 'BizCorp', imageUrl: '', font: 'Inter' },
  links: [
    { id: uuidv4(), label: 'About', href: '#about' },
    { id: uuidv4(), label: 'Services', href: '#services' },
    { id: uuidv4(), label: 'Why Us', href: '#whychooseus' },
    { id: uuidv4(), label: 'Testimonials', href: '#testimonials' },
    { id: uuidv4(), label: 'Contact', href: '#contact' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#1e40af',
    height: '80px',
    sticky: true,
  },
});

export const createBusinessHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Business Hero',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#1e3a8a',
    padding: '120px 0',
    minHeight: '90vh',
    color: '#ffffff',
  },
  content: {
    headline: 'Strategic Business Solutions for Global Growth',
    subheadline: 'We empower enterprises with cutting-edge technology and strategic consulting to drive measurable results.',
    ctaText: 'Get Started Today',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  },
  components: [],
});

export const createBusinessAboutSection = () => ({
  id: uuidv4(),
  type: 'about',
  name: 'Business About',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
    color: '#1e293b',
  },
  content: {
    headline: 'Our Mission & Vision',
    description: 'Founded in 2010, BizCorp has been at the forefront of enterprise transformation. Our mission is to be the world\'s most trusted partner for business excellence — delivering strategies that create lasting value for our clients, employees, and communities.',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
  },
  components: [],
});

export const createBusinessServicesSection = () => ({
  id: uuidv4(),
  type: 'services',
  name: 'Business Services',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f0f4ff',
    padding: '100px 0',
    color: '#1e293b',
  },
  content: {
    headline: 'Our Core Services',
    subheadline: 'End-to-end solutions tailored to accelerate your business growth.',
    services: [
      {
        id: uuidv4(),
        icon: 'BarChart2',
        title: 'Business Strategy',
        description: 'Data-driven strategic planning to align your vision with market opportunities and long-term profitability.',
      },
      {
        id: uuidv4(),
        icon: 'Cpu',
        title: 'Digital Transformation',
        description: 'Modernize your operations with cloud solutions, automation, and AI-powered workflows.',
      },
      {
        id: uuidv4(),
        icon: 'Users',
        title: 'Talent & HR Solutions',
        description: 'Build high-performing teams with our recruitment, training, and organizational development services.',
      },
      {
        id: uuidv4(),
        icon: 'Globe',
        title: 'Global Expansion',
        description: 'Enter new markets confidently with our localization, compliance, and go-to-market strategies.',
      },
    ],
  },
  components: [],
});

export const createBusinessWhyChooseUsSection = () => ({
  id: uuidv4(),
  type: 'whychooseus',
  name: 'Business Why Choose Us',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#1e3a8a',
    padding: '100px 0',
    color: '#ffffff',
  },
  content: {
    headline: 'Why Industry Leaders Choose BizCorp',
    subheadline: 'Over 500 global companies trust us to deliver results that matter.',
    reasons: [
      {
        id: uuidv4(),
        icon: 'Award',
        title: '15+ Years of Expertise',
        description: 'Proven track record across finance, healthcare, retail, and technology sectors.',
      },
      {
        id: uuidv4(),
        icon: 'TrendingUp',
        title: 'Measurable ROI',
        description: 'Our clients see an average 3x ROI within the first 12 months of engagement.',
      },
      {
        id: uuidv4(),
        icon: 'Shield',
        title: 'Enterprise-Grade Security',
        description: 'ISO 27001 certified. Your data and operations are always protected.',
      },
      {
        id: uuidv4(),
        icon: 'Headphones',
        title: 'Dedicated Support',
        description: '24/7 dedicated account managers and support teams at your disposal.',
      },
    ],
  },
  components: [],
});

export const createBusinessTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Business Testimonials',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
    color: '#1e293b',
  },
  content: {
    headline: 'What Our Clients Say',
    subheadline: 'Trusted by industry leaders around the globe.',
    testimonials: [
      {
        id: uuidv4(),
        quote: 'BizCorp completely transformed how we operate. Their strategic roadmap helped us cut costs by 40% and scale internationally in under a year.',
        name: 'Sarah Johnson',
        role: 'CEO, Nexus Financial Group',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
      },
      {
        id: uuidv4(),
        quote: 'The digital transformation project was executed flawlessly. Our team productivity doubled and customer satisfaction scores are at an all-time high.',
        name: 'Michael Chen',
        role: 'CTO, Apex Retail Inc.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        rating: 5,
      },
      {
        id: uuidv4(),
        quote: 'Professional, responsive, and incredibly knowledgeable. BizCorp is the partner every enterprise needs for sustainable growth.',
        name: 'Priya Sharma',
        role: 'VP Operations, GlobalTech Solutions',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        rating: 5,
      },
    ],
  },
  components: [],
});

export const createBusinessCTASection = () => ({
  id: uuidv4(),
  type: 'cta',
  name: 'Business CTA',
  visible: true,
  locked: false,
  styles: {
    backgroundGradient: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
    padding: '100px 0',
    color: '#ffffff',
  },
  content: {
    headline: 'Ready to Transform Your Business?',
    subheadline: 'Join over 500 leading companies who trust BizCorp to deliver exceptional results. Let\'s build your future together.',
    ctaText: 'Schedule a Free Consultation',
    ctaSecondaryText: 'View Our Case Studies',
  },
  components: [],
});

export const createBusinessContactSection = () => ({
  id: uuidv4(),
  type: 'contact',
  name: 'Business Contact',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
    color: '#1e293b',
  },
  content: {
    headline: 'Get In Touch',
    subheadline: 'Tell us about your business challenges. Our experts will get back to you within 24 hours.',
    email: 'contact@bizcorp.com',
    phone: '+1 (800) 555-0199',
    address: '1200 Corporate Drive, Suite 400, New York, NY 10001',
    fields: [
      { id: uuidv4(), label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
      { id: uuidv4(), label: 'Business Email', type: 'email', placeholder: 'john@company.com', required: true },
      { id: uuidv4(), label: 'Company Name', type: 'text', placeholder: 'Your Company', required: false },
      { id: uuidv4(), label: 'Message', type: 'textarea', placeholder: 'Tell us how we can help...', required: true },
    ],
    submitText: 'Send Message',
  },
  components: [],
});

export const createBusinessFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Business Footer',
  visible: true,
  logo: { text: 'BizCorp', imageUrl: '' },
  description: 'Leading the way in enterprise consulting and digital transformation since 2010.',
  socialLinks: [
    { id: uuidv4(), platform: 'facebook', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'linkedin', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Our Company',
      links: [
        { id: uuidv4(), label: 'About Us', href: '#about' },
        { id: uuidv4(), label: 'Services', href: '#services' },
        { id: uuidv4(), label: 'Why Choose Us', href: '#whychooseus' },
        { id: uuidv4(), label: 'Careers', href: '/careers' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Resources',
      links: [
        { id: uuidv4(), label: 'Blog', href: '/blog' },
        { id: uuidv4(), label: 'Case Studies', href: '/case-studies' },
        { id: uuidv4(), label: 'Whitepapers', href: '/resources' },
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
  copyright: `© ${new Date().getFullYear()} BizCorp. All rights reserved.`,
  styles: {
    backgroundColor: '#111827',
    textColor: '#94a3b8',
    padding: '60px 0',
  },
});

export const getBusinessPage = () => ({
  id: uuidv4(),
  name: 'Home',
  navbar: createBusinessNavbar(),
  sections: [
    createBusinessHeroSection(),
    createBusinessAboutSection(),
    createBusinessServicesSection(),
    createBusinessWhyChooseUsSection(),
    createBusinessTestimonialsSection(),
    createBusinessCTASection(),
    createBusinessContactSection(),
  ],
  footer: createBusinessFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    primaryColor: '#1e40af',
    backgroundColor: '#f8fafc',
  },
});
