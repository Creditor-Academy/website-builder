import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Zap,
  Shield,
  Layout,
  Smartphone,
  Layers,
  Palette,
  Sparkles,
  Globe,
  Dribbble,
  Github,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Buildora | Website Builder</title>
        <meta name="description" content="The ultimate no-code website builder for professionals and beginners alike." />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">SiteBuilder</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#templates" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Templates</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/dashboard')} className="rounded-full px-6">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-24 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            NEW: AI-POWERED DESIGN GENERATION
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Design your dream website <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">without writing code</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-500 mb-10 leading-relaxed">
            The power of Webflow meets the simplicity of Canva. Create, edit, and publish professional websites in minutes with our intuitive drag-and-drop platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all gap-2" onClick={() => navigate('/dashboard')}>
              Start Building Now <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
              Explore Templates
            </Button>
          </div>

          {/* Editor Preview Image */}
          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200 shadow-2xl overflow-hidden bg-slate-900 aspect-[16/10] group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
              alt="Editor Preview"
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 flex justify-between items-end">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg">
                LIVE EDITOR
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">Core Features</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to succeed online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Drag & Drop Builder", desc: "Build layouts visually with our ultra-smooth drag and drop interface. No technical skills required." },
              { icon: Palette, title: "Infinite Customization", desc: "Control every pixel from spacing and colors to custom fonts and advanced CSS properties." },
              { icon: Smartphone, title: "Truly Responsive", desc: "Edit separately for Desktop, Tablet, and Mobile to ensure perfect display on all devices." },
              { icon: Globe, title: "One-Click Publish", desc: "Launch your site instantly to our high-performance edge network with free SSL included." },
              { icon: Shield, title: "SEO Optimized", desc: "Clean HTML output and built-in SEO tools help you rank higher on Google search results." },
              { icon: Layers, title: "Template Library", desc: "Start from 100+ professionally designed templates for business, portfolio, or SaaS." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6 text-white">
              <Layout className="w-6 h-6" />
              <span className="text-2xl font-bold">SiteBuilder</span>
            </div>
            <p className="max-w-sm mb-6">
              Empowering creators to build the web without barriers. The ultimate toolkit for modern web design.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Github className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
              <Dribbble className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 italic">Product</h4>
            <ul className="space-y-4">
              <li><a href="/features" className="hover:text-white">Features</a></li>
              <li><a href="/templates" className="hover:text-white">Templates</a></li>
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/services" className="hover:text-white">Showcase</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 italic">Company</h4>
            <ul className="space-y-4">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/careers" className="hover:text-white">Careers</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/help" className="hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 text-center text-sm">
          © 2026 SiteBuilder. All rights reserved. Built with ❤️ for creators.
        </div>
      </footer>
    </div>
  );
};

export default Index;
