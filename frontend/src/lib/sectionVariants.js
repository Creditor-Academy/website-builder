// Section variant configurations for the builder

export const sectionVariants = {
  hero: [
    { id: 'split', name: 'Split Layout', description: 'Content on left, image on right' },
    { id: 'centered', name: 'Centered', description: 'Centered content with image below' },
    { id: 'video', name: 'Video Background', description: 'Full-screen video background' },
    { id: 'minimal', name: 'Minimal', description: 'Clean and simple layout' },
    { id: 'gradient', name: 'Bold Gradient', description: 'Animated gradient with large text' },
  ],
  features: [
    { id: 'grid', name: 'Grid Layout', description: '3-column grid of feature cards' },
    { id: 'list', name: 'List View', description: 'Vertical list with icons' },
    { id: 'cards', name: 'Card Stack', description: 'Stacked cards with shadows' },
    { id: 'icons', name: 'Icon Focus', description: 'Large icons with minimal text' },
  ],
  cta: [
    { id: 'simple', name: 'Simple CTA', description: 'Centered text with buttons' },
    { id: 'split', name: 'Split CTA', description: 'Text on left, form on right' },
    { id: 'banner', name: 'Banner Style', description: 'Horizontal banner layout' },
    { id: 'floating', name: 'Floating Card', description: 'Elevated card with shadow' },
  ],
  testimonials: [
    { id: 'cards', name: 'Card Grid', description: 'Multiple testimonial cards' },
    { id: 'carousel', name: 'Carousel', description: 'Sliding testimonial carousel' },
    { id: 'quote', name: 'Large Quote', description: 'Single featured testimonial' },
    { id: 'minimal', name: 'Minimal', description: 'Simple text-based layout' },
  ],
  pricing: [
    { id: 'cards', name: 'Pricing Cards', description: 'Side-by-side pricing cards' },
    { id: 'table', name: 'Comparison Table', description: 'Feature comparison table' },
    { id: 'toggle', name: 'Toggle View', description: 'Monthly/yearly toggle' },
  ],
  gallery: [
    { id: 'grid', name: 'Grid Gallery', description: 'Uniform grid layout' },
    { id: 'masonry', name: 'Masonry', description: 'Pinterest-style masonry' },
    { id: 'carousel', name: 'Carousel', description: 'Horizontal image slider' },
  ],
  services: [
    { id: 'cards', name: 'Service Cards', description: 'Image cards with descriptions' },
    { id: 'list', name: 'Service List', description: 'Vertical list layout' },
    { id: 'grid', name: 'Icon Grid', description: 'Grid with service icons' },
  ],
  stats: [
    { id: 'horizontal', name: 'Horizontal', description: 'Stats in a row' },
    { id: 'cards', name: 'Stat Cards', description: 'Individual stat cards' },
    { id: 'counter', name: 'Animated Counter', description: 'Counting animation' },
  ],
  team: [
    { id: 'grid', name: 'Team Grid', description: 'Grid of team cards' },
    { id: 'carousel', name: 'Team Carousel', description: 'Sliding team members' },
    { id: 'list', name: 'Team List', description: 'Vertical team list' },
  ],
  faq: [
    { id: 'accordion', name: 'Accordion', description: 'Expandable FAQ items' },
    { id: 'grid', name: 'FAQ Grid', description: 'Two-column FAQ grid' },
    { id: 'tabs', name: 'Tabbed FAQ', description: 'Category tabs with FAQs' },
  ],
  contact: [
    { id: 'split', name: 'Split Layout', description: 'Form and info side by side' },
    { id: 'centered', name: 'Centered', description: 'Centered contact form' },
    { id: 'map', name: 'With Map', description: 'Form with embedded map' },
  ],
  logocloud: [
    { id: 'simple', name: 'Simple Row', description: 'Logos in a single row' },
    { id: 'scroll', name: 'Scrolling', description: 'Infinite scrolling logos' },
    { id: 'grid', name: 'Logo Grid', description: 'Logos in a grid' },
  ],
  about: [
    { id: 'split', name: 'Split Layout', description: 'Content on one side, image on the other' },
    { id: 'centered', name: 'Centered', description: 'Centered content with featured image' },
    { id: 'cards', name: 'Story + Values Cards', description: 'Story with values in cards' },
  ],
};

export function getVariantsForSection(sectionType) {
  return sectionVariants[sectionType] || [];
}

export function getDefaultVariant(sectionType) {
  const variants = sectionVariants[sectionType];
  return variants?.[0]?.id || 'default';
}
