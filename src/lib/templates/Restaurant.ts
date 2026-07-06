import { v4 as uuidv4 } from 'uuid';

export const createRestaurantNavbar = () => ({
  id: uuidv4(),
  type: 'navbar',
  name: 'Restaurant Navbar',
  visible: true,
  logo: { text: 'Lumière', imageUrl: '', font: 'Playfair Display' },
  links: [
    { id: uuidv4(), label: 'Home', href: '/' },
    { id: uuidv4(), label: 'Our Menu', href: '/menu' },
    { id: uuidv4(), label: 'Reservations', href: '/reservations', isButton: true },
  ],
  styles: {
    backgroundColor: '#1c1917',
    textColor: '#f5f5f4',
    height: '90px',
  },
});

export const createRestaurantHero = () => ({
  id: uuidv4(),
  type: 'hero',
  name: 'Restaurant Hero',
  visible: true,
  locked: false,
  styles: {
    useGradient: true,
    backgroundGradient: 'linear-gradient(rgba(28, 25, 23, 0.7), rgba(28, 25, 23, 0.7))',
    backgroundColor: '#1c1917',
    color: '#ffffff',
    padding: '160px 0',
    minHeight: '80vh',
  },
  content: {
    headline: 'A Culinary Journey Through Modern French Cuisine',
    subheadline: 'Experience the perfect blend of traditional flavors and contemporary elegance at Lumière.',
    ctaText: 'View Menu',
    ctaSecondaryText: 'Book a Table',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80',
  },
});

export const createRestaurantAbout = () => ({
  id: uuidv4(),
  type: 'about',
  name: 'Restaurant About',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#fafaf9', padding: '120px 0', color: '#292524' },
  content: {
    headline: 'Our Philosophy',
    description: 'At Lumière, we believe that dining is an art form. Every dish tells a story of local ingredients, passionate preparation, and timeless culinary traditions reimagined for the modern palate.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
});

export const createRestaurantMenuSection = () => ({
  id: uuidv4(),
  type: 'services',
  name: 'Featured Menu',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#ffffff', padding: '100px 0', color: '#292524' },
  content: {
    headline: 'Signature Dishes',
    services: [
      { id: uuidv4(), title: 'Duck Confit', description: 'Slow-cooked duck leg, pomme purée, cherry reduction', imageUrl: 'https://images.unsplash.com/photo-1544025162-831e34589d75?w=600&q=80' },
      { id: uuidv4(), title: 'Seared Scallops', description: 'Cauliflower purée, brown butter, capers, lemon', imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&q=80' },
      { id: uuidv4(), title: 'Beef Tartare', description: 'Hand-cut tenderloin, quail egg, truffle toast', imageUrl: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=600&q=80' },
    ],
  },
});

export const createRestaurantGallery = () => ({
  id: uuidv4(),
  type: 'gallery',
  name: 'Ambiance',
  visible: true,
  locked: false,
  styles: { backgroundColor: '#1c1917', padding: '120px 0', color: '#ffffff' },
  content: {
    headline: 'The Atmosphere',
    images: [
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80' },
      { id: uuidv4(), url: 'https://images.unsplash.com/photo-1505826759037-1c67cb0b5220?w=800&q=80' },
    ],
  },
});

export const createRestaurantFooter = () => ({
  id: uuidv4(),
  type: 'footer',
  name: 'Restaurant Footer',
  visible: true,
  logo: { text: 'Lumière', imageUrl: '' },
  description: 'Elevating the standard of modern dining.',
  columns: [
    {
      id: uuidv4(),
      title: 'Hours',
      links: [
        { id: uuidv4(), label: 'Mon-Thu: 5pm - 10pm', href: '#' },
        { id: uuidv4(), label: 'Fri-Sat: 5pm - 11pm', href: '#' },
        { id: uuidv4(), label: 'Sun: Closed', href: '#' },
      ],
    },
  ],
  copyright: `© ${new Date().getFullYear()} Lumière Cafe & Bistro.`,
  styles: { backgroundColor: '#0c0a09', textColor: '#d6d3d1', padding: '80px 0' },
});

export const getRestaurantTemplate = () => ({
  pages: [
    {
      id: uuidv4(),
      name: 'Home',
      slug: '/',
      meta: { title: 'Lumière Cafe & Bistro', description: 'Modern French Cuisine' },
      sections: [
        createRestaurantHero(),
        createRestaurantAbout(),
        createRestaurantMenuSection(),
        createRestaurantGallery(),
      ],
    },
    {
      id: uuidv4(),
      name: 'Our Menu',
      slug: '/menu',
      meta: { title: 'Menu - Lumière', description: 'Explore our culinary offerings' },
      sections: [
        {
          id: uuidv4(),
          type: 'hero',
          visible: true,
          styles: { backgroundColor: '#1c1917', color: '#ffffff', padding: '100px 0' },
          content: { headline: 'Our Menu', subheadline: 'Seasonal ingredients, masterful preparation.' },
        },
        createRestaurantMenuSection(),
      ],
    },
    {
      id: uuidv4(),
      name: 'Reservations',
      slug: '/reservations',
      meta: { title: 'Reservations - Lumière', description: 'Book a table' },
      sections: [
        {
          id: uuidv4(),
          type: 'contact',
          visible: true,
          styles: { backgroundColor: '#fafaf9', color: '#292524', padding: '100px 0' },
          content: {
            headline: 'Book a Table',
            subheadline: 'Join us for an unforgettable dining experience.',
            email: 'reservations@lumiere.com',
            phone: '+1 (555) 123-4567',
          },
        },
      ],
    }
  ],
  navbar: createRestaurantNavbar(),
  footer: createRestaurantFooter(),
  globalStyles: {
    fontFamily: 'Inter',
    headingFont: 'Playfair Display',
    primaryColor: '#c2410c',
    backgroundColor: '#fafaf9',
  },
});
