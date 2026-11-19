import { v4 as uuidv4 } from 'uuid';

export const createBlogNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Blog Navbar',
  visible: true,
  logo: { text: 'Chronicle.', imageUrl: '', font: 'Merriweather' },
  links: [
    { id: uuidv4(), label: 'Home', href: '/' },
    { id: uuidv4(), label: 'Articles', href: '/articles' },
    { id: uuidv4(), label: 'About', href: '/about' },
    { id: uuidv4(), label: 'Subscribe', href: '/subscribe', isButton: true },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    height: '80px',
    borderBottom: '1px solid #f1f5f9',
  },
});

export const createBlogHero = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Blog Hero',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', color: '#0f172a', padding: '100px 0', minHeight: '60vh' },
  content: {
    headline: 'Ideas that shape the future.',
    subheadline: 'A curated collection of essays, insights, and analysis on technology, design, and culture.',
    ctaText: 'Read Latest',
  },
});

export const createBlogLatestPosts = () => ({
  id: uuidv4(),
  type: 'bloglist',
  name: 'Latest Posts',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#f8fafc', padding: '100px 0', color: '#0f172a' },
  content: {
    headline: 'Latest Writing',
    posts: [
      { id: uuidv4(), title: 'The Evolution of Interface Design', category: 'Design', author: 'Sarah Jenkins', excerpt: 'How spatial computing is changing the way we think about digital boundaries.', imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', url: '/articles/evolution-of-interface-design' },
      { id: uuidv4(), title: 'Understanding Modern AI Models', category: 'Technology', author: 'David Chen', excerpt: 'A comprehensive guide to transformer architectures and their implications.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', url: '/articles/understanding-modern-ai-models' },
      { id: uuidv4(), title: 'The Remote Work Paradox', category: 'Culture', author: 'Elena Rossi', excerpt: 'Balancing autonomy and connection in the distributed era.', imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', url: '/articles/remote-work-paradox' },
    ],
  },
});

export const createBlogFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Blog Footer',
  visible: true,
  logo: { text: 'Chronicle.', imageUrl: '' },
  description: 'Independent publishing for curious minds.',
  columns: [
    {
      id: uuidv4(),
      title: 'Navigation',
      links: [
        { id: uuidv4(), label: 'Home', href: '/' },
        { id: uuidv4(), label: 'Articles', href: '/articles' },
        { id: uuidv4(), label: 'About', href: '/about' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Chronicle Publishing.`,
  styles: { backgroundColor: '#0f172a', textColor: '#cbd5e1', padding: '80px 0' },
});

export const getBlogTemplate = () => ({
  pages: [
    {
      id: uuidv4(),
      name: 'Home',
      slug: '/',
      meta: { title: 'Chronicle Blog & Newsletter', description: 'Ideas that shape the future.' },
      sections: [
        createBlogHero(),
        createBlogLatestPosts(),
      ],
    },
    {
      id: uuidv4(),
      name: 'Articles',
      slug: '/articles',
      meta: { title: 'All Articles - Chronicle', description: 'Browse all articles.' },
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          visible: true,
          styles: { backgroundColor: '#ffffff', color: '#0f172a', padding: '80px 0' },
          content: { headline: 'All Articles', subheadline: 'Explore our entire archive.' },
        },
        createBlogLatestPosts(),
      ],
    },
    {
      id: uuidv4(),
      name: 'About',
      slug: '/about',
      meta: { title: 'About - Chronicle', description: 'About the author.' },
      sections: [
        {
          id: uuidv4(),
          type: 'about',
          visible: true,
          styles: { backgroundColor: '#ffffff', padding: '100px 0', color: '#0f172a' },
          content: { headline: 'About Chronicle', description: 'Chronicle is an independent publication dedicated to deep dives into the topics that matter. We believe in quality over quantity.' },
        }
      ],
    },
    {
      id: uuidv4(),
      name: 'Subscribe',
      slug: '/subscribe',
      meta: { title: 'Subscribe - Chronicle', description: 'Join the newsletter.' },
      sections: [
        {
          id: uuidv4(),
          type: 'contact',
          visible: true,
          styles: { backgroundColor: '#f8fafc', color: '#0f172a', padding: '120px 0' },
          content: { headline: 'Join the Newsletter', subheadline: 'Get the latest essays delivered straight to your inbox every Sunday.', buttonText: 'Subscribe Now' },
        }
      ],
    },
    {
      id: uuidv4(),
      name: 'The Evolution of Interface Design',
      slug: '/articles/evolution-of-interface-design',
      meta: { title: 'The Evolution of Interface Design — Chronicle', description: 'How spatial computing is changing digital boundaries.' },
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          visible: true,
          styles: { backgroundColor: '#ffffff', padding: '100px 0 40px', color: '#0f172a' },
          content: {
            headline: 'The Evolution of Interface Design',
            subheadline: 'How spatial computing and context-aware systems are redefining our relationship with glass screens.',
            imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
          },
        },
        {
          id: uuidv4(),
          type: 'about',
          visible: true,
          styles: { backgroundColor: '#fafaf9', padding: '80px 0', color: '#0f172a' },
          content: {
            headline: 'Beyond the Rectangular Screen',
            description: 'For three decades, user interfaces lived within strict 2D rectangular confines. Windows, buttons, forms, and icons adhered to familiar desktop and mobile physics. Today, ubiquitous computing and spatial depth demand an entirely new visual grammar—fluid, ambient, and respectful of cognitive load.',
          },
        },
        {
          id: uuidv4(),
          type: 'cta',
          visible: true,
          styles: { backgroundColor: '#0f172a', padding: '80px 0', color: '#ffffff' },
          content: {
            headline: 'Never Miss a Chronicle Deep Dive',
            subheadline: 'Subscribe to receive thoughtful essays on design, culture, and architecture directly in your inbox.',
            ctaText: 'Subscribe to Newsletter',
          },
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Understanding Modern AI Models',
      slug: '/articles/understanding-modern-ai-models',
      meta: { title: 'Understanding Modern AI Models — Chronicle', description: 'A practical, intuition-first guide to modern generative systems.' },
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          visible: true,
          styles: { backgroundColor: '#ffffff', padding: '100px 0 40px', color: '#0f172a' },
          content: {
            headline: 'Understanding Modern AI Models',
            subheadline: 'A practical, intuition-first guide to attention mechanisms, reasoning capabilities, and system architectures.',
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
          },
        },
        {
          id: uuidv4(),
          type: 'about',
          visible: true,
          styles: { backgroundColor: '#fafaf9', padding: '80px 0', color: '#0f172a' },
          content: {
            headline: 'Attention, Latent Space, and Emergent Reasoning',
            description: 'Modern language models are more than next-token predictors. The combination of dense cross-attention layers, scaling laws, and reinforcement training has unlocked structured problem solving, code generation, and multi-step reasoning capabilities.',
          },
        },
        {
          id: uuidv4(),
          type: 'cta',
          visible: true,
          styles: { backgroundColor: '#0f172a', padding: '80px 0', color: '#ffffff' },
          content: {
            headline: 'Join 25,000+ Engineers & Builders',
            subheadline: 'Get concise architecture breakdowns and AI engineering papers summarized weekly.',
            ctaText: 'Subscribe to Newsletter',
          },
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'The Remote Work Paradox',
      slug: '/articles/remote-work-paradox',
      meta: { title: 'The Remote Work Paradox — Chronicle', description: 'Balancing autonomy and connection in distributed teams.' },
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          visible: true,
          styles: { backgroundColor: '#ffffff', padding: '100px 0 40px', color: '#0f172a' },
          content: {
            headline: 'The Remote Work Paradox',
            subheadline: 'How high-performing distributed teams balance deep individual autonomy with meaningful organizational cohesion.',
            imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80',
          },
        },
        {
          id: uuidv4(),
          type: 'about',
          visible: true,
          styles: { backgroundColor: '#fafaf9', padding: '80px 0', color: '#0f172a' },
          content: {
            headline: 'Autonomy Without Isolation',
            description: 'The freedom to design one’s workday can either unlock peak productivity or degenerate into fragmented isolation. Distributed organizations that thrive treat written documentation as the primary operating system, replacing endless video meetings with thoughtful, asynchronous review cycles.',
          },
        },
        {
          id: uuidv4(),
          type: 'cta',
          visible: true,
          styles: { backgroundColor: '#0f172a', padding: '80px 0', color: '#ffffff' },
          content: {
            headline: 'Rethinking Work and Collaboration',
            subheadline: 'Subscribe to receive research-backed essays on leadership, culture, and team performance.',
            ctaText: 'Subscribe to Newsletter',
          },
        },
      ],
    }
  ],
  navbar: createBlogNavbar(),
  footer: createBlogFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    headingFont: 'Merriweather',
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
});
