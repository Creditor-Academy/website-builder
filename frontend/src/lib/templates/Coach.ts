import { v4 as uuidv4 } from 'uuid';

export const createCoachNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Coach Navbar',
  visible: true,
  logo: { text: 'ElevatePath', imageUrl: '', font: 'Inter' },
  links: [
    { id: uuidv4(), label: 'Benefits', href: '#benefits' },
    { id: uuidv4(), label: 'Curriculum', href: '#curriculum' },
    { id: uuidv4(), label: 'Instructor', href: '#instructor' },
    { id: uuidv4(), label: 'Pricing', href: '#pricing' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    height: '80px',
    borderBottom: '1px solid #f1f5f9',
  },
});

export const createCoachHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Course Hero',
  visible: true,
  locked: false,
  styles: {
    useGradient: true,
    backgroundGradient: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    backgroundColor: '#e0c3fc',
    color: '#0f172a',
    headingColor: '#0f172a',
    paragraphColor: '#475569',
    padding: '120px 0',
    minHeight: '80vh',
  },
  content: {
    headline: 'Master Your Craft Through Expert Coaching',
    subheadline: 'Join 10,000+ students in the most comprehensive online training program designed to accelerate your career and personal growth.',
    ctaText: 'Enroll Now',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  },
  components: [],
});

export const createCoachBenefitsSection = () => ({
  id: 'benefits',
  type: 'features',
  name: 'Course Benefits',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Why This Course?',
    features: [
      { id: uuidv4(), icon: 'Zap', title: 'Self-Paced Learning', description: 'Access course materials anytime, anywhere, at your own speed.' },
      { id: uuidv4(), icon: 'CheckCircle', title: 'Actionable Insights', description: 'Practical workshops and real-world projects to build your portfolio.' },
      { id: uuidv4(), icon: 'Users', title: 'Community Access', description: 'Join our private Slack community and network with peers.' },
    ],
  },
  components: [],
});

export const createCoachCurriculumSection = () => ({
  id: 'curriculum',
  type: 'faq',
  variant: 'grid',
  name: 'Course Curriculum',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    headingColor: '#ffffff',
    paragraphColor: '#94a3b8',
    padding: '100px 0',
  },
  content: {
    headline: 'The Curriculum',
    faqs: [
      { id: uuidv4(), question: 'Module 1: Foundations', answer: 'Learn the core principles and set up your success roadmap.' },
      { id: uuidv4(), question: 'Module 2: Advanced Techniques', answer: 'Dive deep into professional strategies and industry secrets.' },
      { id: uuidv4(), question: 'Module 3: Final Project', answer: 'Apply everything you’ve learned to a comprehensive capstone project.' },
    ],
  },
  components: [],
});

export const createCoachInstructorSection = () => ({
  id: 'instructor',
  type: 'about',
  name: 'Instructor Profile',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Meet Your Coach',
    description: 'Sarah Johnson is an industry leader with over 15 years of experience in business psychology and strategic growth. She has mentored hundreds of top-tier executives and entrepreneurs.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
  },
  components: [],
});

export const createCoachTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Student Success',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'What My Students Say',
    testimonials: [
      { id: uuidv4(), quote: 'This program completely changed the way I approach my business. A total game-changer!', name: 'David Lee', role: 'Agency Owner' },
      { id: uuidv4(), quote: 'The mentorship and community support are worth the investment alone.', name: 'Emma White', role: 'Freelance Designer' },
       { id: uuidv4(), quote: 'The mentorship and community support are worth the investment alone.', name: 'Emmly', role: 'Designer' },
    ],
  },
  components: [],
});

export const createCoachPricingSection = () => ({
  id: 'pricing',
  type: 'pricing',
  name: 'Course Enrollment',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Choose Your Plan',
    plans: [
      { id: uuidv4(), name: 'Self Study', price: 199, features: ['Full lifetime', 'Course materials', 'Community access'], ctaText: 'Get Started', popular: true },
      { id: uuidv4(), name: 'Premium Coaching', price: 499, features: ['All Self-Study Features', '1-on-1 Mentorship', 'Direct Feedback'], ctaText: 'Go Premium', popular: true },
      { id: uuidv4(), name: 'Premium Coaching', price: 999, features: ['All Self-Study Features', '1-on-1 Mentorship', 'Direct Feedback'], ctaText: 'Get Premium', popular: true },
    ],
  },
  components: [],
});

export const createCoachCTASection = () => ({
  id: uuidv4(),
  type: 'contact',
  variant: 'centered',
  name: 'Ready to Start?',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Ready to Elevate Your Skills?',
    subheadline: 'Enroll today and start your journey towards mastery. Have questions? Reach out below.',
    email: 'coach@elevatepath.com',
    buttonText: 'Enroll & Contact'
  },
  components: [],
});

export const createCoachFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Coach Footer',
  visible: true,
  logo: { text: 'ElevatePath', imageUrl: '' },
  description: 'Empowering the next generation of professional creators through expert-led education.',
  socialLinks: [
    { id: uuidv4(), platform: 'youtube', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Course',
      links: [
        { id: uuidv4(), label: 'Home', href: '#' },
        { id: uuidv4(), label: 'Curriculum', href: '#curriculum' },
        { id: uuidv4(), label: 'Pricing', href: '#pricing' },
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
  copyright: `© ${new Date().getFullYear()} ElevatePath. All rights reserved.`,
  styles: {
    backgroundColor: '#0f172a',
    textColor: '#94a3b8',
    padding: '80px 0',
  },
});

export const getCoachPage = () => ({
  id: uuidv4(),
  name: 'Home',
  slug: '/',
  meta: {
    title: 'ElevatePath - Expert Coaching & Training',
    description: 'Master your craft through expert-led courses and personalized mentorship.'
  },
  navbar: createCoachNavbar(),
  sections: [
    createCoachHeroSection(),
    createCoachBenefitsSection(),
    createCoachCurriculumSection(),
    createCoachInstructorSection(),
    createCoachTestimonialsSection(),
    createCoachPricingSection(),
    createCoachCTASection(),
  ],
  footer: createCoachFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
  },
});
