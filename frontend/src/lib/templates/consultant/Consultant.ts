import { v4 as uuidv4 } from 'uuid';

export const createConsultantNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Consultant Navbar',
  visible: true,
  logo: { text: 'Thomse Consulting', imageUrl: '', font: 'Playfair Display' },
  links: [
    { id: uuidv4(), label: 'About', href: '#about' },
    { id: uuidv4(), label: 'Services', href: '#services' },
    { id: uuidv4(), label: 'Book a Call', href: '#contact' },
  ],
  styles: {
    backgroundColor: '#0f172a',
    textColor: '#e2e8f0',
    height: '90px',
    sticky: true,
    borderBottom: '1px solid rgba(212,175,55,0.3)',
  },
});

export const createConsultantHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Consultant Hero',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    padding: '140px 0',
    minHeight: '100vh',
    color: '#ffffff',
  },
  content: {
    headline: 'Strategic Intelligence for High-Performance Leaders',
    subheadline: 'I partner with C-suite executives to navigate complex business transitions, sharpen competitive positioning, and unlock exponential growth.',
    ctaText: 'Schedule a Strategy Call',
    imageUrl: '/images/consultant/strategy.png',
    badge: 'Trusted by Fortune 500 Leaders',
  },
  components: [],
});

export const createConsultantAboutSection = () => ({
  id: 'about',
  type: 'about',
  name: 'Consultant About',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '110px 0',
    color: '#0f172a',
  },
  content: {
    badge: 'Our Philosophy',
    headline: 'Strategy Beyond the Spreadsheet',
    description: 'We believe that sustainable growth isn\'t just about numbers—it\'s about clarity of vision, alignment of leadership, and the courage to make hard decisions. Our approach combines deep analytical rigor with a human-centric focus on organizational performance.',
    imageUrl: '/images/consultant/about.png',
    imagePosition: 'right',
    values: [
      { id: uuidv4(), icon: 'Target', title: 'Precision Strategy', description: 'Zeroing in on the 20% of actions that drive 80% of your results.' },
      { id: uuidv4(), icon: 'Users', title: 'Leadership Alignment', description: 'Ensuring your executive team is moving in the same direction with total conviction.' },
      { id: uuidv4(), icon: 'Award', title: 'Calculated Risk', description: 'Making bold moves backed by data-driven intelligence.' },
    ],
  },
  components: [],
});

export const createConsultantServicesSection = () => ({
  id: 'services',
  type: 'services',
  name: 'Consultant Services',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '110px 0',
    color: '#0f172a',
  },
  variant: 'cards',
  content: {
    headline: 'Areas of Expertise',
    subheadline: 'Precision advisory services built for leaders who demand measurable outcomes.',
    accentColor: '#d4af37',
    services: [
      {
        id: uuidv4(),
        icon: 'Target',
        title: 'Executive Strategy',
        description: 'Bespoke strategic frameworks to align your leadership team, sharpen your roadmap, and accelerate decision-making at the highest level.',
        imageUrl: '/images/consultant/service_strategy.png',
        link: '#contact',
        linkText: 'Learn More'
      },
      {
        id: uuidv4(),
        icon: 'Activity',
        title: 'Organizational Transformation',
        description: 'Redesign culture, structure, and processes to create resilient, agile organizations ready for the demands of tomorrow.',
        imageUrl: '/images/consultant/service_transformation.png',
        link: '#contact',
        linkText: 'Learn More'
      },
      {
        id: uuidv4(),
        icon: 'DollarSign',
        title: 'Revenue & Growth Advisory',
        description: 'Identify hidden revenue streams, optimize pricing strategies, and build scalable go-to-market engines that compound growth.',
        imageUrl: '/images/consultant/service_revenue.png',
        link: '#contact',
        linkText: 'Learn More'
      },
      {
        id: uuidv4(),
        icon: 'Compass',
        title: 'Market Entry & Expansion',
        description: 'Navigate new geographies and verticals with confidence through deep competitive intelligence and localization strategy.',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
        link: '#contact',
        linkText: 'Learn More'
      },
    ],
  },
  components: [],
});

export const createConsultantCaseStudiesSection = () => ({
  id: 'casestudies',
  type: 'casestudies',
  name: 'Consultant Case Studies',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    padding: '110px 0',
    color: '#e2e8f0',
  },
  content: {
    headline: 'Proven Results',
    subheadline: 'Real transformations. Real numbers. No vanity metrics.',
    accentColor: '#d4af37',
    cases: [
      {
        id: uuidv4(),
        industry: 'Financial Services',
        client: 'Global Investment Bank',
        challenge: 'Struggling with declining market share and an aging operational model in a rapidly digitizing landscape.',
        result: 'Achieved 62% increase in digital revenue and reduced operational costs by $28M within 18 months.',
        metric: '+62% Revenue',
      },
      {
        id: uuidv4(),
        industry: 'Healthcare',
        client: 'Regional Hospital Network',
        challenge: 'Critical leadership gaps and fragmented patient experience across 12 hospital facilities.',
        result: 'Unified operations under a new leadership model, driving a 45-point NPS improvement and 30% cost reduction.',
        metric: '+45 NPS Points',
      },
      {
        id: uuidv4(),
        industry: 'Technology',
        client: 'Series C SaaS Company',
        challenge: 'Plateaued growth and unclear path to enterprise market penetration.',
        result: 'Repositioned product-market fit and built an enterprise sales motion, resulting in 3x ARR growth in 12 months.',
        metric: '3× ARR Growth',
      },
    ],
  },
  components: [],
});

export const createConsultantTestimonialsSection = () => ({
  id: 'testimonials',
  type: 'testimonials',
  name: 'Consultant Testimonials',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '110px 0',
    color: '#e2e8f0',
  },
  content: {
    headline: 'What Leaders Say',
    subheadline: 'Words from the executives who\'ve experienced the Thompson difference.',
    accentColor: '#d4af37',
    testimonials: [
      {
        id: uuidv4(),
        quote: 'James didn\'t just give us a strategy deck — he embedded with our leadership team, challenged our assumptions, and helped us see the business in a completely new way. The results speak for themselves.',
        name: 'Victoria Lawson',
        role: 'President & CEO, Meridian Capital Partners',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
        rating: 5,
      },
      {
        id: uuidv4(),
        quote: 'The clarity and conviction James brought to our executive off-site was remarkable. We left with a 3-year roadmap that every board member unanimously endorsed — something we\'d struggled with for years.',
        name: 'Robert Tanaka',
        role: 'Chairman, Pacific Ventures Group',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
        rating: 5,
      },
      {
        id: uuidv4(),
        quote: 'Working with Thompson Consulting was a turning point. We went from a stagnant growth curve to our best fiscal year in company history. I recommend James without reservation.',
        name: 'Elena Marchetti',
        role: 'Managing Director, Strata European Holdings',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80',
        rating: 5,
      },
    ],
  },
  components: [],
});

export const createConsultantCTASection = () => ({
  id: uuidv4(),
  type: 'cta',
  name: 'Consultant CTA',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    padding: '110px 0',
    color: '#ffffff',
    borderTop: '2px solid #d4af37',
  },
  content: {
    headline: 'Ready to Redefine What\'s Possible?',
    subheadline: 'I accept a limited number of consulting engagements per quarter to ensure every client receives my full attention and expertise.',
    ctaText: 'Reserve Your Strategy Session',
    badge: 'Limited Availability — Q2 2026',
  },
  components: [],
});

export const createConsultantContactSection = () => ({
  id: 'contact',
  type: 'contact',
  name: 'Consultant Contact',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '110px 0',
    color: '#e2e8f0',
  },
  content: {
    headline: 'Start the Conversation',
    subheadline: 'Share your challenge below. I personally review every inquiry and respond within one business day.',
    email: 'james@thompsonstrategy.com',
    phone: '+1 (212) 555-0147',
    address: '745 Fifth Avenue, Suite 1800, New York, NY 10151',
    accentColor: '#d4af37',
    fields: [
      { id: uuidv4(), label: 'Full Name', type: 'text', placeholder: 'Your Name', required: true },
      { id: uuidv4(), label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
      { id: uuidv4(), label: 'Company & Title', type: 'text', placeholder: 'CEO at Acme Corp', required: false },
      { id: uuidv4(), label: 'Revenue Range', type: 'select', options: ['Under $10M', '$10M–$50M', '$50M–$250M', '$250M+'], required: false },
      { id: uuidv4(), label: 'Your Challenge', type: 'textarea', placeholder: 'Describe what you\'re trying to achieve or the problem you\'re facing...', required: true },
    ],
    submitText: 'Send My Inquiry',
  },
  components: [],
});

export const createConsultantFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Consultant Footer',
  visible: true,
  logo: { text: 'Thompson Consulting', imageUrl: '' },
  description: 'Helping the world\'s most ambitious leaders achieve clarity, alignment, and transformative results.',
  socialLinks: [
    { id: uuidv4(), platform: 'linkedin', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Practice Areas',
      links: [
        { id: uuidv4(), label: 'Executive Strategy', href: '/executive-strategy' },
        { id: uuidv4(), label: 'Revenue Growth', href: '/revenue-growth' },
        { id: uuidv4(), label: 'Market Expansion', href: '/market-expansion' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Legal',
      links: [
        { id: uuidv4(), label: 'Privacy Policy', href: '/privacy' },
        { id: uuidv4(), label: 'Terms of Engagement', href: '/terms' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Thompson Strategic Group. All rights reserved.`,
  styles: {
    backgroundColor: '#0a0f1e',
    textColor: '#94a3b8',
    padding: '60px 0',
    borderTop: '1px solid rgba(212,175,55,0.2)',
  },
});

// --- Consultant Sub-Pages ---

export const createExecutiveStrategyPage = () => ({
  id: uuidv4(),
  name: 'Executive Strategy',
  slug: '/executive-strategy',
  navbar: createConsultantNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Strategy Hero',
      visible: true,
      locked: false,
      styles: {
        backgroundColor: '#0f172a',
        padding: '120px 0',
        color: '#ffffff',
      },
      content: {
        headline: 'Executive Strategy & Leadership Alignment',
        subheadline: 'Crafting the high-level roadmap that turns organizational vision into actionable, competitive advantage.',
        ctaText: 'Discuss Your Strategy',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Strategy Pillars',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'Our Strategic Approach',
        features: [
          { id: uuidv4(), icon: 'Compass', title: 'Vision Articulation', description: 'Defining a clear, compelling future state for the organization.' },
          { id: uuidv4(), icon: 'Users', title: 'Leadership Sync', description: 'Aligning the executive team around a single, unified roadmap.' },
          { id: uuidv4(), icon: 'Target', title: 'Execution Frameworks', description: 'Building the systems required to track and achieve strategic goals.' },
        ],
      },
      components: [],
    },
  ],
  footer: createConsultantFooter(),
});

export const createRevenueGrowthPage = () => ({
  id: uuidv4(),
  name: 'Revenue Growth',
  slug: '/revenue-growth',
  navbar: createConsultantNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Growth Hero',
      visible: true,
      locked: false,
      styles: {
        backgroundColor: '#0f172a',
        padding: '120px 0',
        color: '#ffffff',
      },
      content: {
        headline: 'Accelerate Your Revenue Engine',
        subheadline: 'Optimizing the entire revenue lifecycle to drive predictable, scalable, and sustainable growth.',
        ctaText: 'Analyze Growth Potential',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Growth Catalysts',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'Growth Methodology',
        features: [
          { id: uuidv4(), icon: 'TrendingUp', title: 'Sales Optimization', description: 'Refining the sales motion to increase win rates and deal velocity.' },
          { id: uuidv4(), icon: 'BarChart', title: 'Pricing Strategy', description: 'Leveraging value-based pricing to capture maximum market value.' },
          { id: uuidv4(), icon: 'Activity', title: 'Funnel Enhancement', description: 'Removing friction from the customer journey to boost conversion.' },
        ],
      },
      components: [],
    },
  ],
  footer: createConsultantFooter(),
});

export const createMarketExpansionPage = () => ({
  id: uuidv4(),
  name: 'Market Expansion',
  slug: '/market-expansion',
  navbar: createConsultantNavbar(),
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      name: 'Expansion Hero',
      visible: true,
      locked: false,
      styles: {
        backgroundColor: '#0f172a',
        padding: '120px 0',
        color: '#ffffff',
      },
      content: {
        headline: 'Expand Into New Horizons',
        subheadline: 'Data-driven market entry strategies to minimize risk and maximize penetration in new verticals and geographies.',
        ctaText: 'Explore New Markets',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80',
      },
      components: [],
    },
    {
      id: uuidv4(),
      type: 'features',
      name: 'Expansion Tactics',
      visible: true,
      locked: false,
      styles: { backgroundColor: '#ffffff', padding: '100px 0' },
      content: {
        headline: 'Entry Strategy',
        features: [
          { id: uuidv4(), icon: 'Globe', title: 'Geographic Expansion', description: 'Navigating local regulations and cultural nuances in new regions.' },
          { id: uuidv4(), icon: 'Layers', title: 'Vertical Penetration', description: 'Adapting your core offering for success in adjacent industries.' },
          { id: uuidv4(), icon: 'PieChart', title: 'Competitive Intelligence', description: 'Deep analysis of market leaders and white-space opportunities.' },
        ],
      },
      components: [],
    },
  ],
  footer: createConsultantFooter(),
});

export const getConsultantPage = () => ({
  id: uuidv4(),
  name: 'Home',
  navbar: createConsultantNavbar(),
  sections: [
    createConsultantHeroSection(),
    createConsultantAboutSection(),
    createConsultantServicesSection(),
    createConsultantCaseStudiesSection(),
    createConsultantTestimonialsSection(),
    createConsultantCTASection(),
    createConsultantContactSection(),
  ],
  footer: createConsultantFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    headingFont: 'Playfair Display',
    primaryColor: '#d4af37',
    backgroundColor: '#0f172a',
  },
}); 