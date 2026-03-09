import { v4 as uuidv4 } from 'uuid';

export const createConsultantNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Consultant Navbar',
  visible: true,
  logo: { text: 'Thompson Consulting', imageUrl: '', font: 'Playfair Display' },
  links: [
    { id: uuidv4(), label: 'Services', href: '#services' },
    { id: uuidv4(), label: 'Case Studies', href: '#casestudies' },
    { id: uuidv4(), label: 'Testimonials', href: '#testimonials' },
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
    ctaSecondaryText: 'View My Results',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
    badge: 'Trusted by Fortune 500 Leaders',
  },
  components: [],
});

export const createConsultantServicesSection = () => ({
  id: uuidv4(),
  type: 'services',
  name: 'Consultant Services',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '110px 0',
    color: '#e2e8f0',
  },
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
      },
      {
        id: uuidv4(),
        icon: 'Activity',
        title: 'Organizational Transformation',
        description: 'Redesign culture, structure, and processes to create resilient, agile organizations ready for the demands of tomorrow.',
      },
      {
        id: uuidv4(),
        icon: 'DollarSign',
        title: 'Revenue & Growth Advisory',
        description: 'Identify hidden revenue streams, optimize pricing strategies, and build scalable go-to-market engines that compound growth.',
      },
      {
        id: uuidv4(),
        icon: 'Compass',
        title: 'Market Entry & Expansion',
        description: 'Navigate new geographies and verticals with confidence through deep competitive intelligence and localization strategy.',
      },
    ],
  },
  components: [],
});

export const createConsultantCaseStudiesSection = () => ({
  id: uuidv4(),
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
  id: uuidv4(),
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
  id: uuidv4(),
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
        { id: uuidv4(), label: 'Executive Strategy', href: '#services' },
        { id: uuidv4(), label: 'Org Transformation', href: '#services' },
        { id: uuidv4(), label: 'Revenue Growth', href: '#services' },
        { id: uuidv4(), label: 'Market Expansion', href: '#services' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Explore',
      links: [
        { id: uuidv4(), label: 'Case Studies', href: '#casestudies' },
        { id: uuidv4(), label: 'Testimonials', href: '#testimonials' },
        { id: uuidv4(), label: 'Book a Call', href: '#contact' },
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

export const getConsultantPage = () => ({
  id: uuidv4(),
  name: 'Home',
  navbar: createConsultantNavbar(),
  sections: [
    createConsultantHeroSection(),
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