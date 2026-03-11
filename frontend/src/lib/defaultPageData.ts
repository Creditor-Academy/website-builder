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
    backgroundColor: '#202340',
    padding: '120px 0',
    minHeight: '90vh',
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
  type: 'navbar',
  name: 'Default Navbar',
  logo: { text: 'SiteBuilder' },
  links: [{ id: uuidv4(), label: 'Home', href: '/' }],
  styles: { backgroundColor: '#ffffff', textColor: '#000000' },
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
  copyright: `© ${new Date().getFullYear()} SiteBuilder. All rights reserved.`,
  styles: { backgroundColor: '#ffffff', textColor: '#000000', padding: '40px 0' },
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
