import { v4 as uuidv4 } from 'uuid';

export const createEcommerceNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Ecommerce Navbar',
  visible: true,
  logo: { text: 'EcoShop', imageUrl: '', font: 'Raleway', href: '/#hero' },
  links: [
    { id: uuidv4(), label: 'Home', href: '/#hero' },
    { id: uuidv4(), label: 'About', href: '/about' },
    { id: uuidv4(), label: 'Contact', href: '/contact' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#0f172a',
    height: '80px',
    borderBottom: '1px solid #e2e8f0',
  },
});

export const createEcommerceHeroSection = () => ({
  id: 'hero',
  type: 'hero',
  name: 'Ecommerce Hero',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#4b5563',

    padding: '120px 0',

    minHeight: '80vh',

    color: '#0f172a',
  },
  content: {
    headline: 'Conscious Goods for the Modern Home',
    subheadline: 'Eco-friendly, ethically sourced, and designed to last a lifetime.',
    ctaText: 'Shop New Arrivals',
    imageUrl: 'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?w=800&q=80', // New hero image
  },
  components: [],
});

export const createEcommerceCategoriesSection = () => ({
  id: uuidv4(),
  type: 'features',
  name: 'Product Categories',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Shop by Category',
    features: [
      { id: uuidv4(), icon: 'ShoppingBag', title: 'Living Room', description: 'Eco-friendly furniture' },
      { id: uuidv4(), icon: 'Smartphone', title: 'Accessories', description: 'Sustainable tech gear' },
      { id: uuidv4(), icon: 'Layers', title: 'Home Decor', description: 'Artisan crafted pieces' },
    ],
  },
  components: [],
});

export const createEcommerceProductsSection = () => ({
  id: uuidv4(),
  type: 'gallery',
  name: 'Featured Products',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'Featured Collection',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', title: 'Premium Headphones' },
      { id: uuidv4(), url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaDgqqjUgpGs01gcneUe1YyKD4pP-lQL6cfw&s', title: 'Retro Camera' },
      { id: uuidv4(), url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM0TnAVV3V1VapV23zfgGxwgFLq6DgmU5RiA&s', title: 'Minimalist Watch' },
    ],
  },
  components: [],
});

export const createEcommerceOfferSection = () => ({
  id: uuidv4(),
  type: 'cta',
  name: 'Special Offer',
  visible: true,
  locked: false,
  styles: {
    padding: '80px 0',
    backgroundGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    color: '#ffffff'
  },
  content: {
    headline: 'Summer Sale: 40% OFF Everything',
    ctaText: 'Claim Your Discount'
  },
  components: [],
});

export const createEcommerceTestimonialsSection = () => ({
  id: uuidv4(),
  type: 'testimonials',
  name: 'Customer Testimonials',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f8fafc',
    padding: '100px 0',
  },
  content: {
    headline: 'What Our Customers Say',
    testimonials: [
      { id: uuidv4(), quote: 'The quality of these products is unmatched. Highly recommend!', name: 'Jane Doe' },
      { id: uuidv4(), quote: 'Fast shipping and great customer service. Will buy again.', name: 'John Smith' },
       { id: uuidv4(), quote: 'The quality of these products is unmatched. Highly recommend!', name: 'Doe' },
    ],
  },
  components: [],
});

export const createEcommerceContactSection = () => ({
  id: uuidv4(),
  type: 'contact',
  name: 'Get In Touch',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#ffffff',
    padding: '100px 0',
  },
  content: {
    headline: 'Questions?',
    email: 'shop@ecoshop.com'
  },
  components: [],
});

export const createEcommerceFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Ecommerce Footer',
  visible: true,
  logo: { text: 'EcoShop', imageUrl: '' },
  description: 'Sustainable goods for a better planet. Shop conscious.',
  socialLinks: [
    { id: uuidv4(), platform: 'facebook', href: '#' },
    { id: uuidv4(), platform: 'instagram', href: '#' },
    { id: uuidv4(), platform: 'twitter', href: '#' },
  ],
  columns: [
    {
      id: uuidv4(),
      title: 'Legal',
      links: [
        { id: uuidv4(), label: 'Privacy Policy', href: '/privacy' },
        { id: uuidv4(), label: 'Terms of Service', href: '/terms' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} EcoShop. All rights reserved.`,
  styles: {
    backgroundColor: '#0f172a',
    textColor: '#94a3b8',
    padding: '100px 0',
  },
});

export const getEcommercePage = () => ({
  id: uuidv4(),
  name: 'Home',
  slug: '/',
  meta: {
    title: 'EcoShop - Conscious Consumerism',
    description: 'Eco-friendly and ethically sourced goods for the modern home.'
  },
  navbar: createEcommerceNavbar(),
  sections: [
    createEcommerceHeroSection(),
    createEcommerceCategoriesSection(),
    createEcommerceProductsSection(),
    createEcommerceOfferSection(),
    createEcommerceTestimonialsSection(),
    createEcommerceContactSection(),
  ],
  footer: createEcommerceFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    primaryColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
});


