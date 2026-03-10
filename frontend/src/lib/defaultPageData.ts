import { v4 as uuidv4 } from 'uuid';

// Import template-specific creators
export * from './templates/Bussiness/Business';
export * from './templates/Portfolio/Portfolio';
export * from './templates/Ecommerce/Ecommerce';
export * from './templates/consultant/Consultant';
export * from './templates/agencies/Agencies';
export * from './templates/Coach/Coach';

// --- Default Sections (Shared/Fallback) ---

export const createDefaultHeroSection = (variant = 'split') => ({
  id: uuidv4(),
  type: 'hero',
  variant,
  name: 'Hero Section',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    backgroundGradient: variant === 'gradient' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' : null,
    useGradient: variant === 'gradient',
    padding: variant === 'minimal' ? '60px 0' : '120px 0',
    minHeight: variant === 'minimal' ? '60vh' : '90vh',
  },
  content: {
    headline: 'Build Beautiful Websites Without Code',
    subheadline: 'Drag, drop, and design your dream website with our intuitive builder.',
    ctaText: 'Get Started Free',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
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
    features: [
      { id: uuidv4(), icon: 'Layers', title: 'Drag & Drop', description: 'Intuitive interface.' },
      { id: uuidv4(), icon: 'Smartphone', title: 'Responsive', description: 'Looks perfect on any device.' },
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
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: {
    headline: 'Our Services',
    services: [
      { id: uuidv4(), title: 'Web Design', description: 'Custom designs.' },
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
  styles: { padding: '80px 0', backgroundGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' },
  content: { headline: 'Ready to Get Started?', ctaText: 'Start Building Now' },
  components: [],
});

export const createDefaultTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Testimonials',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: {
    headline: 'What Our Clients Say',
    testimonials: [
      { id: uuidv4(), quote: 'Amazing tool!', name: 'Sarah J.' },
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
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: {
    headline: 'Simple, Transparent Pricing',
    plans: [
      { id: uuidv4(), name: 'Starter', price: 9, features: ['5 Projects'], ctaText: 'Get Started' },
      { id: uuidv4(), name: 'Pro', price: 29, features: ['Unlimited Projects'], ctaText: 'Get Started', popular: true },
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
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: {
    headline: 'Our Portfolio',
    images: [{ id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', title: 'Project 1' }],
  },
  components: [],
});

export const createDefaultBlogListSection = () => ({
  id: uuidv4(),
  type: 'blog',
  name: 'Blog List',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: {
    headline: 'Latest Posts',
    posts: [{ id: uuidv4(), title: 'Post 1', excerpt: 'Excerpt 1' }],
  },
  components: [],
});

export const createDefaultStatsSection = () => ({
  id: uuidv4(),
  type: 'stats',
  name: 'Stats',
  visible: true,
  locked: false,
  styles: { backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '80px 0' },
  content: { stats: [{ id: uuidv4(), value: '10K', label: 'Active Users' }] },
  components: [],
});

export const createDefaultAboutSection = (variant = 'split') => ({
  id: uuidv4(),
  type: 'about',
  variant,
  name: 'About Us',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: { headline: 'We Build Digital Experiences', description: 'Mission description' },
  components: [],
});

export const createDefaultContactSection = () => ({
  id: uuidv4(),
  type: 'contact',
  name: 'Contact',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: { headline: 'Get In Touch', email: 'hello@example.com' },
  components: [],
});

// --- Re-adding Missing Sections for Build Fix ---

export const createDefaultTeamSection = () => ({
  id: uuidv4(),
  type: 'team',
  name: 'Team',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: { headline: 'Meet Our Team', members: [{ id: uuidv4(), name: 'Alex', role: 'CEO' }] },
  components: [],
});

export const createDefaultFAQSection = () => ({
  id: uuidv4(),
  type: 'faq',
  name: 'FAQ',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0' },
  content: { headline: 'Frequently Asked Questions', faqs: [{ id: uuidv4(), question: 'Q1', answer: 'A1' }] },
  components: [],
});

export const createDefaultLogoCloudSection = () => ({
  id: uuidv4(),
  type: 'logocloud',
  name: 'Logo Cloud',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '60px 0' },
  content: { logos: [{ id: uuidv4(), name: 'Brand', url: '#' }] },
  components: [],
});

export const createDefaultMasonryGallerySection = () => ({
  id: uuidv4(),
  type: 'gallery-masonry',
  name: 'Gallery Masonry',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '80px 0' },
  content: { images: [{ id: uuidv4(), url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', title: 'Masonry 1' }] },
  components: [],
});

// --- Fallback Global Creators ---

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
    textColor: '#000000',
    sticky: true,
  },
});

export const createDefaultFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Default Footer',
  logo: { text: 'SiteBuilder', imageUrl: '' },
  description: 'Built with the world\'s most intuitive website builder.',
  socialLinks: [
    { id: uuidv4(), platform: 'facebook', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Product',
      links: [
        { id: uuidv4(), label: 'Features', href: '/features' },
        { id: uuidv4(), label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Company',
      links: [
        { id: uuidv4(), label: 'About', href: '/about' },
        { id: uuidv4(), label: 'Contact', href: '/contact' },
      ],
    },
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
  navbar: createDefaultNavbar(),
  sections: [createDefaultHeroSection(), createDefaultFeaturesSection()],
  footer: createDefaultFooter(),
  globalStyles: { fontFamily: 'Inter', primaryColor: '#3b82f6' },
});

// Deprecated or legacy creators needed for SectionsList.jsx
export const createFeaturesPage = () => ({ id: uuidv4(), sections: [createDefaultFeaturesSection()] });
export const createServicesPage = () => ({ id: uuidv4(), sections: [createDefaultServicesSection()] });
export const createPricingPage = () => ({ id: uuidv4(), sections: [createDefaultPricingSection()] });
export const createContactPage = () => ({ id: uuidv4(), sections: [createDefaultContactSection()] });
export const createAboutPage = () => ({ id: uuidv4(), sections: [createDefaultAboutSection()] });

// --- Utility Page Creators ---

export const createStartPage = () => ({ id: uuidv4(), name: 'Get Started', slug: '/start', sections: [createDefaultHeroSection()] });
export const createTemplatesPage = () => ({ id: uuidv4(), name: 'Templates', slug: '/templates', sections: [createDefaultHeroSection()] });
export const createBlogPage = () => ({ id: uuidv4(), name: 'Blog', slug: '/blog', sections: [createDefaultBlogListSection()] });
export const createCareersPage = () => ({ id: uuidv4(), name: 'Careers', slug: '/careers', sections: [createDefaultHeroSection()] });
export const createHelpPage = () => ({ id: uuidv4(), name: 'Help Center', slug: '/help', sections: [createDefaultFAQSection()] });
export const createStatusPage = () => ({ id: uuidv4(), name: 'System Status', slug: '/status', sections: [createDefaultStatsSection()] });

export const createPrivacyPolicyPage = () => ({
  id: uuidv4(),
  name: 'Privacy Policy',
  slug: '/privacy',
  navbar: createDefaultNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'content',
      name: 'Privacy Policy Content',
      visible: true,
      styles: { backgroundColor: '#ffffff', padding: '80px 0' },
      content: {
        title: 'Privacy Policy',
        lastUpdated: `Last Updated: ${new Date().toLocaleDateString()}`,
        sections: [
          {
            id: uuidv4(),
            heading: '1. Information We Collect',
            content: 'We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and any other information you choose to provide.',
          },
          {
            id: uuidv4(),
            heading: '2. How We Use Your Information',
            content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users and ourselves.',
          },
          {
            id: uuidv4(),
            heading: '3. Data Security',
            content: 'We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access.',
          }
        ]
      }
    }
  ],
  footer: createDefaultFooter(),
});

export const createTermsOfServicePage = () => ({
  id: uuidv4(),
  name: 'Terms of Service',
  slug: '/terms',
  navbar: createDefaultNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'content',
      name: 'Terms of Service Content',
      visible: true,
      styles: { backgroundColor: '#ffffff', padding: '80px 0' },
      content: {
        title: 'Terms of Service',
        lastUpdated: `Last Updated: ${new Date().toLocaleDateString()}`,
        sections: [
          {
            id: uuidv4(),
            heading: '1. Acceptance of Terms',
            content: 'By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
          },
          {
            id: uuidv4(),
            heading: '2. User Responsibilities',
            content: 'You are responsible for your use of our services and for any content you provide. You agree to comply with all applicable laws and regulations.',
          },
          {
            id: uuidv4(),
            heading: '3. Limitation of Liability',
            content: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of our services.',
          }
        ]
      }
    }
  ],
  footer: createDefaultFooter(),
});
