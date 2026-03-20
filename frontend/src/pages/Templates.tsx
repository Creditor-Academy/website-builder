import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutTemplate, 
  Search, 
  ArrowRight, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles,
  Zap,
  Globe,
  Palette,
  Smartphone,
  MousePointer2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

// Assets
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import business from "../assets/Bussiness.jpg";
import school from "../assets/School.jpg";
import Hospital from "../assets/Hospital.jpg";
import Learning from "../assets/Learning.jpg";
import saasImg from "../assets/template_saas_1.png";
import templatesImg from "../assets/templates_showcase.png";

const Templates = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
  }, [isDark]);

  const categories = ['All', 'Business', 'Creative', 'E-commerce', 'Portfolio', 'Specialized'];

  const templates = [
    {
      id: "saas",
      title: "SaaS Pro",
      category: "Business",
      image: saasImg,
      description: "A high-conversion landing page for modern software products.",
      popular: true
    },
    {
      id: "ecommerce",
      title: "Storefront Deluxe",
      category: "E-commerce",
      image: Ecommerce,
      description: "Clean, elegant layout for jewelry and high-end fashion brands."
    },
    {
      id: "portfolio",
      title: "Minimal Studio",
      category: "Creative",
      image: Portfolio,
      description: "Showcase your work with a focus on typography and whitespace."
    },
    {
      id: "business",
      title: "Corporate Growth",
      category: "Business",
      image: business,
      description: "Professional, trust-building design for enterprise agencies."
    },
    {
      id: "educational",
      title: "Academy Hub",
      category: "Specialized",
      image: Learning,
      description: "Specifically designed for online courses and learning platforms."
    },
    {
      id: "agency",
      title: "Visual Agency",
      category: "Creative",
      image: school,
      description: "Bold, image-heavy layout for design and branding firms."
    }
  ];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <main className={cn(
      "w-full overflow-x-hidden transition-colors duration-1000",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    )}>
      <Helmet>
        <title>Templates - Buildora</title>
        <meta name="description" content="Choose from hundreds of premium, professionally designed website templates." />
      </Helmet>

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-6 flex justify-center pointer-events-none">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "w-full max-w-6xl pointer-events-auto backdrop-blur-2xl rounded-full px-6 py-3 flex items-center justify-between border transition-all duration-500",
            isDark
              ? "bg-slate-900/60 border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "bg-white/60 border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
          )}
        >
          <Link to="/" className="flex items-center gap-3 cursor-pointer group pointer-events-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">B</div>
            <span className={cn("text-xl font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>Buildora</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Features", "Templates", "Resources"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className={cn(
                "relative group transition-colors",
                isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
              )}>
                {item}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[2px] bg-blue-500 transition-all rounded-full",
                  item === "Templates" ? "w-full" : "w-0 group-hover:w-full"
                )}></span>
              </Link>
            ))}
            <div className={cn("h-4 w-px", isDark ? "bg-slate-600/50" : "bg-slate-300")} />

            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-200 text-slate-600")}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/login" className={isDark ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}>Log in</Link>
            <Link to="/contact" className={cn(
              "px-5 py-2.5 rounded-full font-semibold transition-all active:scale-95",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50" : "bg-slate-900 text-white hover:bg-blue-600"
            )}>
              Get started
            </Link>
          </div>

          <button className="md:hidden p-2 pointer-events-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "absolute top-24 left-6 right-6 p-6 rounded-3xl border backdrop-blur-3xl md:hidden pointer-events-auto",
                isDark ? "bg-slate-900/90 border-slate-700 shadow-2xl" : "bg-white/90 border-slate-200 shadow-xl"
              )}
            >
              <div className="flex flex-col gap-4">
                {["Features", "Templates", "Resources"].map((item) => (
                  <Link
                    key={item}
                    to={`/${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "text-lg font-semibold p-2 rounded-xl transition-colors",
                      isDark ? "text-slate-300 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {item}
                  </Link>
                ))}
                <div className={cn("h-px w-full my-2", isDark ? "bg-slate-800" : "bg-slate-100")} />
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={cn("text-lg font-semibold p-2", isDark ? "text-slate-300" : "text-slate-600")}>Log in</Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "mt-2 py-4 rounded-2xl text-center font-bold text-lg",
                    isDark ? "bg-white text-slate-950" : "bg-slate-900 text-white"
                  )}
                >
                  Get started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Static Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src={templatesImg} 
            alt="Templates Background" 
            className={cn(
              "w-full h-full object-cover transition-opacity duration-1000",
              isDark ? "opacity-50 scale-100" : "opacity-50 scale-100"
            )}
          />
          
          {/* Background Ambient Glow - Minimal to keep image sharp */}
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[150px] opacity-20",
            isDark ? "bg-blue-600/10" : "bg-blue-200/20"
          )} />

          {/* Minimal Gradient Fades - Only for Text Legibility */}
          <div className={cn("absolute inset-0 bg-gradient-to-b transition-colors duration-1000", isDark ? "from-slate-950/10 via-slate-950/40 to-slate-950" : "from-slate-50/10 via-slate-50/40 to-slate-50")} />
          <div className={cn("absolute inset-0 bg-gradient-to-r transition-colors duration-1000", isDark ? "from-slate-950/20 via-transparent to-slate-950/20" : "from-slate-50/20 via-transparent to-slate-50/20")} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-15">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={cn(
              "text-[4.5rem] sm:text-[6rem] md:text-[7.5rem] font-bold tracking-tighter leading-[1.1] mb-8 transition-colors duration-1000",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Start with a <br />
            <span className={cn("italic font-serif font-light relative", isDark ? "text-blue-200" : "text-blue-900")}>
              perfect foundation.
              <svg className="absolute w-[110%] h-6 -bottom-4 -left-[5%] text-blue-500 opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
                <motion.path
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                  d="M0 10 Q50 20 100 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn("text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed  font-medium", isDark ? "text-slate-400" : "text-slate-600")}
          >
            Choose from hundreds of premium, professionally designed templates. Optimized for high performance and absolute creative freedom.
          </motion.p>
        </div>
      </section>

      {/* ================= CATEGORY FILTER ================= */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95",
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30"
                    : isDark ? "bg-slate-900 text-slate-400 hover:text-white border border-slate-800" : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, idx) => (
                <motion.div
                  layout
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className={cn(
                    "group relative rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.25)]",
                    isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"
                  )}
                >
                  {template.popular && (
                    <div className="absolute top-6 left-6 z-10 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase shadow-lg shadow-blue-600/30 flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> Most Popular
                    </div>
                  )}
                  
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={template.image} 
                      alt={template.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                         onClick={() => navigate('/login')}
                         className="px-8 py-4 bg-white text-slate-950 rounded-full font-bold text-lg shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-blue-50"
                      >
                        Start with This
                      </button>
                    </div>
                  </div>

                  <div className="p-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{template.title}</h3>
                      <span className={cn("text-xs font-bold px-3 py-1 rounded-full", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
                        {template.category}
                      </span>
                    </div>
                    <p className={cn("text-base leading-relaxed mb-0", isDark ? "text-slate-400" : "text-slate-600")}>
                      {template.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= TECHNOLOGY SECTION ================= */}
      <section className={cn("py-32 px-6", isDark ? "bg-slate-900/50" : "bg-slate-100/50")}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">
                Every template is <br />
                <span className="text-blue-500">fully customizable.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <Zap className="text-blue-500" />, title: "Instant Deployment", desc: "One click to launch your site to a global edge network with automatic SSL." },
                  { icon: <Palette className="text-purple-500" />, title: "Global Design Tokens", desc: "Change fonts, colors, and spacing across the entire template instantly." },
                  { icon: <Smartphone className="text-emerald-500" />, title: "Precision Mobile Control", desc: "Fine-tune exactly how your template looks on mobile, tablet, and desktop." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className={cn(
                      "flex gap-6 p-6 rounded-3xl border transition-all duration-300 group",
                      isDark ? "bg-slate-900/50 border-slate-800 hover:border-blue-500/50" : "bg-white border-slate-200 hover:border-blue-500/30 shadow-md hover:shadow-xl"
                    )}
                  >
                    <div className={cn("shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", isDark ? "bg-slate-800" : "bg-slate-50 shadow-inner")}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-blue-500">{item.title}</h3>
                      <p className={cn("leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className={cn("absolute -inset-4 rounded-[3rem] blur-3xl opacity-20 transition-opacity group-hover:opacity-40", isDark ? "bg-blue-500" : "bg-blue-300")} />
              <img src={templatesImg} alt="Editor" className="relative rounded-[2.5rem] shadow-2xl border border-white/10 transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ONE-CLICK TRANSFORMATIONS ================= */}
      <section className={cn("py-32 px-6", isDark ? "bg-slate-900/50" : "bg-white")}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6">One-Click Transformations</h2>
            <p className={cn("text-xl max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>
              Don't just pick a template; make it yours in seconds. Our global design system allows you to overhaul your entire look instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              { 
                icon: <Palette />, 
                title: "Switch Palettes", 
                desc: "Instantly swap all site colors with designer-picked schemes.",
                details: "Access 50+ professionally curated color sets. Optimized for accessibility and brand consistency.A one-click engine that instantly swaps your site's entire color scheme while maintaining perfect contrast and brand harmony across all elements."
              },
              { 
                icon: <Sparkles />, 
                title: "Global FX", 
                desc: "Apply glassmorphism, shadows, or minimalism across all sections.",
                details: "Control global border-radius, blur intensity, and shadow depth in a single click.A central controller for visual depth that manages shadows, glassmorphism, and blurs site-wide to ensure a consistent, polished atmosphere."
              },
              { 
                icon: <MousePointer2 />, 
                title: "Font Pairings", 
                desc: "Select from curated typography sets that define your brand voice.",
                details: "Perfectly weighted headings and body text pairings from Google Fonts and Adobe.A one-click engine that instantly swaps your site's entire color scheme while maintaining perfect contrast and brand harmony across all elements."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-10 rounded-[2.5rem] border text-center transition-all duration-500 group relative overflow-hidden",
                  hoveredFeature !== null && hoveredFeature !== i ? "opacity-30 scale-[0.98] blur-[2px]" : "opacity-100",
                  isDark 
                    ? "bg-slate-950 border-slate-800 hover:border-blue-500 shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)]" 
                    : "bg-slate-50 border-slate-200 hover:border-blue-500 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]"
                )}
              >
                <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-8 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/50">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className={cn("text-lg transition-all duration-300 group-hover:mb-6", isDark ? "text-slate-400" : "text-slate-600")}>{feature.desc}</p>
                
                <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                  <div className={cn("pt-6 border-t", isDark ? "border-slate-800" : "border-slate-200")}>
                    <p className={cn("text-sm leading-relaxed italic", isDark ? "text-slate-500" : "text-slate-500")}>
                      {feature.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className={cn(
             "max-w-5xl mx-auto p-12 md:p-32 rounded-[5rem] border relative overflow-hidden group shadow-[0_32px_120px_rgba(59,130,246,0.3)]",
             isDark 
               ? "bg-slate-900 border-white/10" 
               : "bg-white border-slate-200 shadow-2xl"
           )}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
          <h2 className="text-5xl md:text-8xl font-black mb-8 relative z-10 tracking-tighter">Didn't find what <br /> you're looking for?</h2>
          <p className={cn("text-xl md:text-2xl mb-12 relative z-10 font-medium leading-relaxed", isDark ? "text-slate-200" : "text-slate-700")}>
            Start with a blank canvas and build something completely unique with our drag-and-drop tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/contact" className={cn(
              "h-20 px-12 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50 shadow-blue-500/50 shadow-2xl" : "bg-slate-900 text-white hover:bg-blue-600 shadow-2xl"
            )}>
              Start Blank Canvas <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
};

export default Templates;
