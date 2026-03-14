import { v4 as uuidv4 } from 'uuid';

// Import template-specific creators
export * from './templates/Business';
export * from './templates/Portfolio';
export * from './templates/Ecommerce';
export * from './templates/Consultant';
export * from './templates/Agencies';
export * from './templates/Coach';

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
    padding: variant === 'minimal' ? '15px 0' : '15px 0',
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
  variant: 'simple',
  name: 'Logo Cloud',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '80px 0',
    headingColor: '#0f172a',
    paragraphColor: '#64748b',
    logoHeight: '40px',
  },
  content: {
    headline: 'Trusted by leading companies',
    subheadline: 'Join thousands of organizations using our platform',
    logos: [
      { id: uuidv4(), name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
      { id: uuidv4(), name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
      { id: uuidv4(), name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
      { id: uuidv4(), name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },
      { id: uuidv4(), name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
    ],
  },
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
    buttonBg: '#0f172a',
    buttonText: '#ffffff',
    buttonRadius: '2px',
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

// Layout Sections
export const createDefaultTextOnlySection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Text Only Layout',
  variant: 'text-only',
  visible: true,
  content: {
    text: 'This is a sample text paragraph that can be edited to include your own content. You can add multiple paragraphs, lists, or any other text content you need for your website.',
  },
  styles: {
    padding: '60px 0',
    textAlign: 'left',
    fontSize: '16px',
    lineHeight: '1.6',
  },
});

export const createDefaultImageTextLeftSection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Image + Text (Left)',
  variant: 'image-text-left',
  visible: true,
  content: {
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    imageAlt: 'Sample image',
    heading: 'Beautiful Design',
    text: 'This layout features an image on the left side with text content on the right. Perfect for showcasing products, services, or any content that benefits from visual support.',
  },
  styles: {
    padding: '80px 0',
    backgroundColor: '#ffffff',
  },
});

export const createDefaultImageTextRightSection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Image + Text (Right)',
  variant: 'image-text-right',
  visible: true,
  content: {
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    imageAlt: 'Sample image',
    heading: 'Flexible Layout',
    text: 'This layout places text on the left side with an image on the right. Great for creating visual interest while maintaining readability and professional appearance.',
  },
  styles: {
    padding: '80px 0',
    backgroundColor: '#f8fafc',
  },
});

export const createDefaultTextButtonSection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Text + Button',
  variant: 'text-button',
  visible: true,
  content: {
    text: 'This is a text-only layout with a call-to-action button. Perfect for simple announcements, newsletter signups, or directing users to important content.',
    buttonText: 'Learn More',
    buttonHref: '/learn-more',
  },
  styles: {
    padding: '60px 0',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
});

export const createDefaultHeadingTextButtonSection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Heading + Text + Button',
  variant: 'heading-text-button',
  visible: true,
  content: {
    heading: 'Complete Layout Solution',
    text: 'This comprehensive layout includes a compelling heading, descriptive text, and a clear call-to-action button. It\'s perfect for landing pages, feature sections, or any content that needs to drive user action.',
    buttonText: 'Get Started',
    buttonHref: '/get-started',
  },
  styles: {
    padding: '80px 0',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
});

export const createDefaultTwoColumnSection = () => ({
  id: uuidv4(),
  type: 'layout',
  name: 'Two Column Layout',
  variant: 'two-column',
  visible: true,
  content: {
    leftColumn: {
      heading: 'Left Column',
      text: 'This is the left column content. You can add text, images, or any other content here. Perfect for comparing features or showing related information.',
    },
    rightColumn: {
      heading: 'Right Column',
      text: 'This is the right column content. It mirrors the left column structure and can be used for complementary information or additional details.',
    },
  },
  styles: {
    padding: '80px 0',
    backgroundColor: '#ffffff',
    gap: '40px',
  },
});

