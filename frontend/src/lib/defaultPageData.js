import { v4 as uuidv4 } from 'uuid';

export const createDefaultHeroSection = (variant = 'split') => ({
  id: uuidv4(),
  type: 'hero',
  variant,
  name: 'Hero Section',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    backgroundGradient: variant === 'gradient' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' : null,
    useGradient: variant === 'gradient',
    padding: variant === 'minimal' ? '60px 0' : '120px 0',
    minHeight: variant === 'minimal' ? '60vh' : '90vh',
  },
  content: {
    headline: 'Build Beautiful Websites Without Code',
    subheadline: 'Drag, drop, and design your dream website with our intuitive builder. No coding required.',
    ctaText: 'Get Started Free',
    ctaSecondaryText: 'Watch Demo',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  components: [],
});

export const createDefaultFeaturesSection = (variant = 'grid') => ({
  id: uuidv4(),
  type: 'features',
  variant,
  name: 'Features Section',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Powerful Features',
    subheadline: 'Everything you need to build stunning websites',
    features: [
      { id: uuidv4(), icon: 'Layers', title: 'Drag & Drop Builder', description: 'Intuitive drag and drop interface that makes building websites a breeze.' },
      { id: uuidv4(), icon: 'Palette', title: 'Beautiful Templates', description: 'Start with professionally designed templates and customize them to your needs.' },
      { id: uuidv4(), icon: 'Smartphone', title: 'Fully Responsive', description: 'Your website looks perfect on any device, from desktop to mobile.' },
      { id: uuidv4(), icon: 'Zap', title: 'Lightning Fast', description: 'Optimized for speed to ensure your visitors have the best experience.' },
      { id: uuidv4(), icon: 'Shield', title: 'Secure & Reliable', description: 'Enterprise-grade security to keep your website and data safe.' },
      { id: uuidv4(), icon: 'BarChart', title: 'Analytics Built-in', description: 'Track your website performance with integrated analytics tools.' },
    ],
  },
  components: [],
});

export const createDefaultServicesSection = () => ({
  id: uuidv4(),
  type: 'services',
  name: 'Services Section',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Our Services',
    subheadline: 'Comprehensive solutions for your digital presence',
    services: [
      { id: uuidv4(), imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80', title: 'Web Design', description: 'Beautiful, custom designs that capture your brand identity and engage your audience.', link: '#' },
      { id: uuidv4(), imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', title: 'Development', description: 'Robust, scalable web applications built with modern technologies.', link: '#' },
      { id: uuidv4(), imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&q=80', title: 'SEO Optimization', description: 'Improve your search rankings and drive organic traffic to your website.', link: '#' },
    ],
  },
  components: [],
});

export const createDefaultCTASection = (variant = 'simple') => ({
  id: uuidv4(),
  type: 'cta',
  variant,
  name: 'Call to Action',
  visible: true,
  locked: false,
  styles: {
    backgroundGradient: variant === 'banner' 
      ? 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)'
      : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    padding: variant === 'floating' ? '40px 0' : '80px 0',
  },
  content: {
    headline: 'Ready to Get Started?',
    subheadline: 'Join thousands of creators who are already building amazing websites.',
    ctaText: 'Start Building Now',
    ctaSecondaryText: 'Contact Sales',
  },
  components: [],
});

export const createDefaultTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Testimonials',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'What Our Clients Say',
    subheadline: 'Trusted by thousands of happy customers worldwide',
    testimonials: [
      { id: uuidv4(), quote: 'This builder transformed how we create websites. Incredibly intuitive and powerful!', name: 'Sarah Johnson', role: 'CEO, TechStart', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80', rating: 5 },
      { id: uuidv4(), quote: 'The best investment we made for our design workflow. Highly recommended!', name: 'Michael Chen', role: 'Design Lead, Creative Co', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', rating: 5 },
      { id: uuidv4(), quote: 'Finally a tool that lets me build professional sites without writing code.', name: 'Emily Davis', role: 'Freelancer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', rating: 5 },
    ],
  },
  components: [],
});

export const createDefaultPricingSection = () => ({
  id: uuidv4(),
  type: 'pricing',
  name: 'Pricing',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Simple, Transparent Pricing',
    subheadline: 'Choose the plan that works best for you',
    plans: [
      { id: uuidv4(), name: 'Starter', description: 'Perfect for individuals', price: 9, features: ['5 Projects', 'Basic Templates', 'Email Support', 'Custom Domain'], ctaText: 'Get Started', popular: false },
      { id: uuidv4(), name: 'Pro', description: 'Best for growing teams', price: 29, features: ['Unlimited Projects', 'Premium Templates', 'Priority Support', 'Custom Domain', 'Analytics', 'Team Collaboration'], ctaText: 'Get Started', popular: true },
      { id: uuidv4(), name: 'Enterprise', description: 'For large organizations', price: 99, features: ['Everything in Pro', 'Dedicated Support', 'SSO & Security', 'API Access', 'White Label'], ctaText: 'Contact Sales', popular: false },
    ],
  },
  components: [],
});

export const createDefaultGallerySection = () => ({
  id: uuidv4(),
  type: 'gallery',
  name: 'Gallery',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Our Portfolio',
    subheadline: 'A showcase of our finest work',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', title: 'Web App Dashboard', category: 'Web Design' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80', title: 'Team Collaboration', category: 'Branding' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&q=80', title: 'Marketing Campaign', category: 'Marketing' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&q=80', title: 'E-commerce Store', category: 'Web Design' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1522542550221-31fd8575f44a?w=600&q=80', title: 'Mobile App', category: 'UI/UX' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80', title: 'Brand Identity', category: 'Branding' },
    ],
  },
  components: [],
});

// Image section removed — it was deprecated and removed from templates. Existing image sections will still render via a fallback in the renderer.

export const createDefaultBlogListSection = () => ({
  id: uuidv4(),
  type: 'blog',
  name: 'Blog List',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Latest Posts',
    subheadline: 'Read our latest insights',
    posts: [
      { id: uuidv4(), imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', title: 'How we built our product', excerpt: 'An inside look at our design decisions and architecture.', author: 'Team', date: 'Jan 1, 2024' },
      { id: uuidv4(), imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', title: 'Design trends 2024', excerpt: 'What’s shaping design this year and beyond.', author: 'Design', date: 'Feb 15, 2024' },
    ],
  },
  components: [],
});

export const createDefaultMasonryGallerySection = () => ({
  id: uuidv4(),
  type: 'gallery-masonry',
  name: 'Gallery Masonry',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '80px 0',
  },
  content: {
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Dashboard' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80', title: 'Collaboration' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80', title: 'E-commerce' },
    ],
  },
  components: [],
});


export const createDefaultContactSection = () => ({
  id: uuidv4(),
  type: 'contact',
  name: 'Contact',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Get In Touch',
    subheadline: "We'd love to hear from you. Send us a message!",
    email: 'hello@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, City, Country',
  },
  components: [],
});

export const createDefaultStatsSection = () => ({
  id: uuidv4(),
  type: 'stats',
  name: 'Stats',
  visible: true,
  locked: false,
  styles: {
    backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '80px 0',
  },
  content: {
    stats: [
      { id: uuidv4(), value: '10K', suffix: '+', label: 'Active Users' },
      { id: uuidv4(), value: '50M', suffix: '+', label: 'Pages Built' },
      { id: uuidv4(), value: '99.9', suffix: '%', label: 'Uptime' },
      { id: uuidv4(), value: '24', suffix: '/7', label: 'Support' },
    ],
  },
  components: [],
});

export const createDefaultTeamSection = () => ({
  id: uuidv4(),
  type: 'team',
  name: 'Team',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Meet Our Team',
    subheadline: 'The talented people behind our success',
    members: [
      { id: uuidv4(), name: 'Alex Thompson', role: 'CEO & Founder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', social: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
      { id: uuidv4(), name: 'Sarah Miller', role: 'Lead Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', social: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
      { id: uuidv4(), name: 'James Wilson', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', social: [{ platform: 'linkedin', url: '#' }, { platform: 'github', url: '#' }] },
      { id: uuidv4(), name: 'Emma Davis', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80', social: [{ platform: 'linkedin', url: '#' }, { platform: 'twitter', url: '#' }] },
    ],
  },
  components: [],
});

export const createDefaultFAQSection = () => ({
  id: uuidv4(),
  type: 'faq',
  name: 'FAQ',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Frequently Asked Questions',
    subheadline: 'Everything you need to know about our product',
    faqs: [
      { id: uuidv4(), question: 'How do I get started?', answer: 'Simply sign up for a free account and start building your first website in minutes. No credit card required.' },
      { id: uuidv4(), question: 'Can I use my own domain?', answer: 'Yes! You can connect your custom domain to any project. We also provide free subdomains.' },
      { id: uuidv4(), question: 'Is there a free plan?', answer: 'We offer a generous free plan with basic features. Upgrade anytime to unlock premium features.' },
      { id: uuidv4(), question: 'Do you offer refunds?', answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.' },
    ],
  },
  components: [],
});

export const createDefaultLogoCloudSection = () => ({
  id: uuidv4(),
  type: 'logocloud',
  name: 'Logo Cloud',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '60px 0',
  },
  content: {
    headline: 'Trusted by leading companies',
    logos: [
      { id: uuidv4(), name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { id: uuidv4(), name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
      { id: uuidv4(), name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { id: uuidv4(), name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
      { id: uuidv4(), name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    ],
  },
  components: [],
});

export const createDefaultAboutSection = (variant = 'split') => ({
  id: uuidv4(),
  type: 'about',
  variant,
  name: 'About Us',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
    headingColor: '#0f172a',
    paragraphColor: '#475569',
  },
  content: {
    badge: 'About Us',
    headline: 'We Build Digital Experiences That Matter',
    description: 'Founded with a vision to revolutionize how people create and manage their digital presence, we have grown from a small startup to a trusted platform serving thousands of creators worldwide. Our mission is to make professional website creation accessible to everyone.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    imageAlt: 'Our team working together',
    imagePosition: 'right',
    storyTitle: 'Our Story',
    storyContent: 'We started with a simple idea: everyone deserves the tools to build their digital presence. Today, we help thousands of businesses and individuals create stunning websites without writing a single line of code.',
    values: [
      { id: uuidv4(), icon: 'Target', title: 'Our Mission', description: 'Empowering everyone to build beautiful websites without technical barriers.' },
      { id: uuidv4(), icon: 'Eye', title: 'Our Vision', description: 'A world where anyone can bring their digital ideas to life effortlessly.' },
      { id: uuidv4(), icon: 'Heart', title: 'Our Values', description: 'Innovation, accessibility, quality, and putting our users first in everything we do.' },
      { id: uuidv4(), icon: 'Award', title: 'Our Promise', description: 'Reliable, secure, and continuously improving tools for your success.' },
    ],
  },
  components: [],
});

export const createDefaultNavbar = () => ({
  id: uuidv4(),
  style: 'minimal',
  logo: {
    text: 'SiteBuilder',
  },
  links: [
    { id: uuidv4(), label: 'Home', href: '/' },
    { id: uuidv4(), label: 'About', href: '/about' },
    { id: uuidv4(), label: 'Services', href: '/services' },
    { id: uuidv4(), label: 'Pricing', href: '/pricing' },
    { id: uuidv4(), label: 'Contact', href: '/contact' },
    { id: uuidv4(), label: 'Get Started', href: '/start', isButton: true },
  ],
  styles: {
    backgroundColor: 'transparent',
    textColor: '#ffffff',
    sticky: true,
  },
});

export const createDefaultFooter = () => ({
  id: uuidv4(),
  style: 'columns',
  logo: {
    text: 'SiteBuilder',
  },
  columns: [
    {
      id: uuidv4(),
      title: 'Product',
      links: [
        { id: uuidv4(), label: 'About', href: '/about' },
        { id: uuidv4(), label: 'Pricing', href: '/pricing' },
        { id: uuidv4(), label: 'Templates', href: '/templates' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Company',
      links: [
        { id: uuidv4(), label: 'About', href: '/about' },
        { id: uuidv4(), label: 'Blog', href: '/blog' },
        { id: uuidv4(), label: 'Careers', href: '/careers' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Support',
      links: [
        { id: uuidv4(), label: 'Help Center', href: '/help' },
        { id: uuidv4(), label: 'Contact', href: '/contact' },
        { id: uuidv4(), label: 'Status', href: '/status' },
      ],
    },
  ],
  socialLinks: [
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'facebook', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
    { id: uuidv4(), platform: 'linkedin', href: '#' },
  ],
  copyright: '© 2024 SiteBuilder. All rights reserved.',
  styles: {
    backgroundColor: '#0f172a',
    textColor: '#94a3b8',
  },
});

export const createFeaturesPage = () => ({
  id: uuidv4(),
  name: 'Features',
  slug: '/features',
  meta: {
    title: 'Features - My Website',
    description: 'Features page',
  },
  navbar: createDefaultNavbar(),
  sections: [
    createDefaultFeaturesSection(),
    createDefaultCTASection(),
  ],
  footer: createDefaultFooter(),
  globalStyles: {
    fontFamily: 'Inter, system-ui, sans-serif',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
  },
});

export const createServicesPage = () => ({
  id: uuidv4(),
  name: 'Services',
  slug: '/services',
  navbar: createDefaultNavbar(),
  sections: [createDefaultServicesSection(), createDefaultCTASection()],
  footer: createDefaultFooter(),
});

export const createPricingPage = () => ({
  id: uuidv4(),
  name: 'Pricing',
  slug: '/pricing',
  navbar: createDefaultNavbar(),
  sections: [createDefaultPricingSection(), createDefaultCTASection()],
  footer: createDefaultFooter(),
});

export const createContactPage = () => ({
  id: uuidv4(),
  name: 'Contact',
  slug: '/contact',
  navbar: createDefaultNavbar(),
  sections: [createDefaultContactSection(), createDefaultCTASection()],
  footer: createDefaultFooter(),
});

export const createStartPage = () => ({
  id: uuidv4(),
  name: 'Get Started',
  slug: '/start',
  navbar: createDefaultNavbar(),
  sections: [createDefaultCTASection()],
  footer: createDefaultFooter(),
});

export const createTemplatesPage = () => ({
  id: uuidv4(),
  name: 'Templates',
  slug: '/templates',
  navbar: createDefaultNavbar(),
  sections: [createDefaultGallerySection(), createDefaultCTASection()],
  footer: createDefaultFooter(),
});

export const createAboutPage = () => ({
  id: uuidv4(),
  name: 'About',
  slug: '/about',
  meta: {
    title: 'About Us - My Website',
    description: 'Learn more about our company, mission, and values',
  },
  navbar: createDefaultNavbar(),
  sections: [
    createDefaultAboutSection('split'),
    createDefaultTeamSection(),
    createDefaultCTASection(),
  ],
  footer: createDefaultFooter(),
  globalStyles: {
    fontFamily: 'Inter, system-ui, sans-serif',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
  },
});

export const createBlogPage = () => ({
  id: uuidv4(),
  name: 'Blog',
  slug: '/blog',
  navbar: createDefaultNavbar(),
  sections: [],
  footer: createDefaultFooter(),
});

export const createCareersPage = () => ({
  id: uuidv4(),
  name: 'Careers',
  slug: '/careers',
  navbar: createDefaultNavbar(),
  sections: [],
  footer: createDefaultFooter(),
});

export const createHelpPage = () => ({
  id: uuidv4(),
  name: 'Help',
  slug: '/help',
  navbar: createDefaultNavbar(),
  sections: [createDefaultFAQSection(), createDefaultContactSection()],
  footer: createDefaultFooter(),
});

export const createStatusPage = () => ({
  id: uuidv4(),
  name: 'Status',
  slug: '/status',
  navbar: createDefaultNavbar(),
  sections: [createDefaultStatsSection()],
  footer: createDefaultFooter(),
});

export const createDefaultContentSection = (title, content) => ({
  id: uuidv4(),
  type: 'content',
  name: 'Content',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '80px 0',
    headingColor: '#0f172a',
    paragraphColor: '#475569',
  },
  content: {
    title,
    lastUpdated: 'Last updated: January 1, 2024',
    sections: content || [],
  },
  components: [],
});

export const createPrivacyPolicyPage = () => ({
  id: uuidv4(),
  name: 'Privacy Policy',
  slug: '/privacy',
  navbar: createDefaultNavbar(),
  sections: [
    createDefaultContentSection('Privacy Policy', [
      {
        id: uuidv4(),
        heading: 'Information We Collect',
        content: 'We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, and payment information.',
        listItems: [
          'Personal information you provide when creating an account',
          'Payment and billing information',
          'Communications with our support team',
          'Usage data and analytics',
        ],
      },
      {
        id: uuidv4(),
        heading: 'How We Use Your Information',
        content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.',
        listItems: [
          'To provide and maintain our services',
          'To process your transactions',
          'To send you updates and support messages',
          'To improve our services and user experience',
        ],
      },
      {
        id: uuidv4(),
        heading: 'Information Sharing',
        content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
        listItems: [
          'With your consent',
          'To comply with legal obligations',
          'To protect our rights and safety',
          'With service providers who assist us in operating our services',
        ],
      },
      {
        id: uuidv4(),
        heading: 'Data Security',
        content: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
      },
      {
        id: uuidv4(),
        heading: 'Your Rights',
        content: 'You have the right to access, update, or delete your personal information at any time. You can also opt-out of certain communications from us.',
      },
      {
        id: uuidv4(),
        heading: 'Contact Us',
        content: 'If you have any questions about this Privacy Policy, please contact us at privacy@example.com.',
      },
    ]),
  ],
  footer: createDefaultFooter(),
});

export const createTermsOfServicePage = () => ({
  id: uuidv4(),
  name: 'Terms of Service',
  slug: '/terms',
  navbar: createDefaultNavbar(),
  sections: [
    createDefaultContentSection('Terms of Service', [
      {
        id: uuidv4(),
        heading: 'Acceptance of Terms',
        content: 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.',
      },
      {
        id: uuidv4(),
        heading: 'Use License',
        content: 'Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:',
        listItems: [
          'Modify or copy the materials',
          'Use the materials for any commercial purpose',
          'Attempt to reverse engineer any software',
          'Remove any copyright or proprietary notations',
        ],
      },
      {
        id: uuidv4(),
        heading: 'User Accounts',
        content: 'You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.',
        listItems: [
          'You must provide accurate and complete information',
          'You are responsible for maintaining account security',
          'You must notify us immediately of any unauthorized use',
          'We reserve the right to suspend or terminate accounts',
        ],
      },
      {
        id: uuidv4(),
        heading: 'Prohibited Uses',
        content: 'You may not use our services:',
        listItems: [
          'In any way that violates any applicable law',
          'To transmit any malicious code or viruses',
          'To collect or harvest information about other users',
          'To impersonate any person or entity',
        ],
      },
      {
        id: uuidv4(),
        heading: 'Intellectual Property',
        content: 'All content, features, and functionality of our services are owned by us and are protected by international copyright, trademark, and other intellectual property laws.',
      },
      {
        id: uuidv4(),
        heading: 'Limitation of Liability',
        content: 'In no event shall we be liable for any damages arising out of the use or inability to use our services, even if we have been advised of the possibility of such damages.',
      },
      {
        id: uuidv4(),
        heading: 'Changes to Terms',
        content: 'We reserve the right to modify these terms at any time. Your continued use of our services after any changes constitutes acceptance of the new terms.',
      },
      {
        id: uuidv4(),
        heading: 'Contact Information',
        content: 'If you have any questions about these Terms of Service, please contact us at legal@example.com.',
      },
    ]),
  ],
  footer: createDefaultFooter(),
});

export const getDefaultPage = () => ({ 
  id: uuidv4(),
  name: 'Home',
  slug: '/',
  meta: {
    title: 'My Website - Built with SiteBuilder',
    description: 'A beautiful website created with the no-code website builder.',
  },
  navbar: createDefaultNavbar(),
  sections: [
    createDefaultHeroSection(),
    createDefaultFeaturesSection(),
    createDefaultServicesSection(),
    createDefaultCTASection(),
  ],
  footer: createDefaultFooter(),
  globalStyles: {
    fontFamily: 'Inter, system-ui, sans-serif',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
  },
});
