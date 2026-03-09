import { v4 as uuidv4 } from 'uuid';

export const createEcommerceNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Ecommerce Navbar',
  visible: true,
  logo: { text: 'EcoShop', imageUrl: '', font: 'Raleway' },
  links: [
    { id: uuidv4(), label: 'Shop All', href: '/shop' },
    { id: uuidv4(), label: 'Sustainability', href: '/eco' },
    { id: uuidv4(), label: 'Cart', href: '/cart' },
  ],
  styles: {
    backgroundColor: '#ffffff',
    textColor: '#064e3b',
    height: '80px',
    borderBottom: '1px solid #d1fae5',
  },
});

export const createEcommerceHeroSection = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Ecommerce Hero',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#064e3b',
    padding: '120px 0',
    minHeight: '85vh',
    color: '#ffffff',
  },
  content: {
    headline: 'Conscious Goods for the Modern Home',
    subheadline: 'Eco-friendly, ethically sourced, and designed to last a lifetime.',
    ctaText: 'Shop New Arrivals',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80',
  },
  components: [],
});

export const createEcommerceStatsSection = () => ({
  id: uuidv4(),
  type: 'stats',
  name: 'Ecommerce Stats',
  visible: true,
  locked: false,
  styles: {
    backgroundColor: '#f0fdf4',
    padding: '80px 0',
  },
  content: {
    stats: [
      { id: uuidv4(), value: '100', suffix: '%', label: 'Sustainable' },
      { id: uuidv4(), value: '50', suffix: 'k', label: 'Trees Planted' },
    ],
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
      title: 'Shop',
      links: [
        { id: uuidv4(), label: 'New Arrivals', href: '/shop' },
        { id: uuidv4(), label: 'Eco-Line', href: '/eco' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Customer Care',
      links: [
        { id: uuidv4(), label: 'Shipping', href: '/shipping' },
        { id: uuidv4(), label: 'Returns', href: '/returns' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} EcoShop. Earth First.`,
  styles: {
    backgroundColor: '#064e3b',
    textColor: '#d1fae5',
    padding: '100px 0',
  },
});

export const getEcommercePage = () => ({
  id: uuidv4(),
  name: 'Home',
  navbar: createEcommerceNavbar(),
  sections: [
    createEcommerceHeroSection(),
    createEcommerceStatsSection(),
  ],
  footer: createEcommerceFooter(),
  globalStyles: {
    fontFamily: 'Raleway',
    primaryColor: '#059669',
    backgroundColor: '#ffffff',
  },
});
