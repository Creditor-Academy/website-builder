import { FileText, Building2, Layout, ShoppingBag, Users, Globe, Sparkles } from 'lucide-react';

// Import template assets
import business from "../assets/Bussiness.jpg";
import ecommerce from "../assets/Ecomm.jpg";
import portfolio from "../assets/Portfolio.jpg";
import school from "../assets/School.jpg";
import learning from "../assets/Learning.jpg";
import cta from "../assets/CTA.png";
import placeholder from "../assets/ui_showcase_1.png";

export const templatesList = [
    { 
        id: 'blank', 
        name: 'Blank Canvas', 
        desc: 'Start from scratch with a clean slate', 
        icon: FileText, 
        color: 'bg-slate-100 text-slate-600', 
        image: placeholder, 
        category: 'All', 
        features: ['Complete creative freedom', 'No predefined structure', 'Perfect for custom designs'] 
    },
    { 
        id: 'business', 
        name: 'Business Pro', 
        desc: 'Professional corporate layout for companies', 
        icon: Building2, 
        color: 'bg-blue-100 text-blue-600', 
        image: business, 
        category: 'Business', 
        tag: 'Popular',
        features: ['Hero section', 'Services showcase', 'Contact forms', 'Professional design'] 
    },
    { 
        id: 'portfolio', 
        name: 'Creative Portfolio', 
        desc: 'Showcase your creative work beautifully', 
        icon: Layout, 
        color: 'bg-purple-100 text-purple-600', 
        image: portfolio, 
        category: 'Personal', 
        features: ['Gallery layouts', 'Project showcases', 'About section', 'Contact portfolio'] 
    },
    { 
        id: 'ecommerce', 
        name: 'E-commerce', 
        desc: 'Modern online store with shopping features', 
        icon: ShoppingBag, 
        color: 'bg-green-100 text-green-600', 
        image: ecommerce, 
        category: 'E-commerce', 
        features: ['Product catalog', 'Shopping cart', 'Payment integration', 'Product pages'] 
    },
    { 
        id: 'consultant', 
        name: 'Expert Consultant', 
        desc: 'Expert advisory layout for professionals', 
        icon: Users, 
        color: 'bg-amber-100 text-amber-600', 
        image: cta, 
        category: 'Business', 
        features: ['Services section', 'Testimonials', 'Booking forms', 'Expert profile'] 
    },
    { 
        id: 'agencies', 
        name: 'Agencies', 
        desc: 'Creative & marketing agency layout', 
        icon: Globe, 
        color: 'bg-indigo-100 text-indigo-600', 
        image: learning, 
        category: 'Business', 
        features: ['Growth metrics', 'Lead generation', 'Service tiers', 'Client logos'] 
    },
    { 
        id: 'coaching', 
        name: 'Coaching', 
        desc: 'Course & mentorship layout', 
        icon: Sparkles, 
        color: 'bg-rose-100 text-rose-600', 
        image: school, 
        category: 'Personal', 
        tag: 'New',
        features: ['Curriculum overview', 'Student success', 'Enrollment flow', 'Mentor profile'] 
    },
];
