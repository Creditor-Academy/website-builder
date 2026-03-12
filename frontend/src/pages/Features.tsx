import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Move, 
  LayoutTemplate, 
  Layers, 
  Palette, 
  Zap, 
  MousePointer2, 
  Sparkles, 
  Menu, 
  X, 
  Sun, 
  Moon,
  ArrowRight,
  Monitor,
  Code2,
  Cpu,
  Smartphone,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

// Assets
import dragDropImg from "../assets/drag_drop.png";
import templatesImg from "../assets/templates_showcase.png";
import componentsImg from "../assets/components_palette.png";
import uiShowcase1 from "../assets/ui_showcase_1.png";
import uiShowcase2 from "../assets/ui_showcase_2.png";

const FeaturesPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
  }, [isDark]);

  const features = [
    {
      id: "components",
      title: "Smart Components",
      description: "Access a rich library of pre-built, high-performance components. From hero sections to interactive forms, we've got you covered.",
      details: [
        "Advanced UI building blocks",
        "Customizable styles & tokens",
        "Responsive by default",
        "Interactive micro-animations"
      ],
      image: componentsImg,
      icon: <Layers className="w-6 h-6" />,
      color: "emerald"
    },
    {
      id: "templates",
      title: "Premium Templates",
      description: "Start with a professionally designed foundation. Our library features hundreds of industry-specific templates optimized for conversion.",
      details: [
        "100+ Designer layouts",
        "Industry-specific designs",
        "One-click theme switching",
        "SEO optimized structures"
      ],
      image: templatesImg,
      icon: <LayoutTemplate className="w-6 h-6" />,
      color: "purple"
    },
    {
      id: "drag-drop",
      title: "Intuitive Drag & Drop",
      description: "Build your dream website with our revolutionary drag-and-drop interface. No coding, no complexity—just pure creative freedom.",
      details: [
        "Pixel-perfect positioning",
        "Magnetic grid alignment",
        "Real-time element resizing",
        "Layer management system"
      ],
      image: dragDropImg,
      icon: <Move className="w-6 h-6" />,
      color: "blue"
    },
    {
      id: "tokens",
      title: "Global Design Tokens",
      description: "Maintain perfect brand consistency across your entire project with shared CSS variables and design systems.",
      details: ["Centralized color palettes", "Typography scales", "Spacing systems", "Dynamic theme engine"],
      image: componentsImg,
      icon: <Palette className="w-6 h-6" />,
      color: "emerald"
    },
    {
      id: "responsive",
      title: "Precision Mobile Control",
      description: "Fine-tune every single pixel for mobile, tablet, and desktop breakpoints with our dedicated responsive engine.",
      details: ["Device-specific overrides", "Fluid typography", "Grid stacking logic", "Break-point isolation"],
      image: uiShowcase1,
      icon: <Smartphone className="w-6 h-6" />,
      color: "blue"
    },
    {
      id: "deploy",
      title: "Instant Global Deployment",
      description: "Publish your masterpiece to a lightning-fast global edge network with one click. Automatic SSL and optimized CDN.",
      details: ["One-click publishing", "Global CDN edge", "Automatic SSL/HTTPS", "Versioning & rollbacks"],
      image: uiShowcase2,
      icon: <Globe className="w-6 h-6" />,
      color: "purple"
    }
  ];

  return (
    <main className={cn(
      "w-full overflow-x-hidden transition-colors duration-1000",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    )}>
      <Helmet>
        <title>Features - Buildora</title>
        <meta name="description" content="Explore Buildora's powerful features: Drag & Drop, Templates, and Smart Components." />
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
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black group-hover:scale-110 transition-transform duration-300 shadow-lg">B</div>
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
                  item === "Features" ? "w-full" : "w-0 group-hover:w-full"
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
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Tilted Cards Container */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Background Glow */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full blur-[150px]", isDark ? "bg-blue-400/30" : "bg-blue-100/50")}
          />
          
          {/* Tilted Perspective Grid */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] transform -rotate-[12deg] skew-x-[12deg] flex gap-8 justify-center items-center opacity-80 md:opacity-100 select-none">
            <div className="flex flex-col gap-8 animate-infinite-scroll-vertical">
              {[dragDropImg, templatesImg, uiShowcase1, componentsImg].map((img, i) => (
                <div key={i} className={cn("w-[250px] md:w-[450px] aspect-video rounded-3xl border overflow-hidden shadow-2xl", isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
                  <img src={img} className="w-full h-full object-cover transition-all duration-700" alt="Showcase" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-8 animate-infinite-scroll-vertical-reverse mt-40">
              {[uiShowcase2, dragDropImg, componentsImg, templatesImg].map((img, i) => (
                <div key={i} className={cn("w-[250px] md:w-[450px] aspect-video rounded-3xl border overflow-hidden shadow-2xl", isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
                  <img src={img} className="w-full h-full object-cover transition-all duration-700" alt="Showcase" />
                </div>
              ))}
            </div>
            <div className="hidden lg:flex flex-col gap-8 animate-infinite-scroll-vertical">
              {[templatesImg, uiShowcase1, dragDropImg, uiShowcase2].map((img, i) => (
                <div key={i} className={cn("w-[250px] md:w-[450px] aspect-video rounded-3xl border overflow-hidden shadow-2xl", isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
                  <img src={img} className="w-full h-full object-cover transition-all duration-700" alt="Showcase" />
                </div>
              ))}
            </div>
          </div>

          {/* Foreground Fade */}
          <div className={cn("absolute inset-0 bg-gradient-to-b transition-colors duration-1000", isDark ? "from-slate-950/20 via-slate-950/60 to-slate-950" : "from-slate-50/20 via-slate-50/60 to-slate-50")} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-15">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={cn(
              "text-[4.5rem] sm:text-[6rem] md:text-[7.5rem] font-bold tracking-tighter leading-[0.9] mb-8 transition-colors duration-1000",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Everything you need <br />
            <span className={cn("italic font-serif font-light relative", isDark ? "text-blue-200" : "text-blue-900")}>
              to create greatness.
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
            className={cn("text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-12 font-medium", isDark ? "text-slate-400" : "text-slate-600")}
          >
            Buildora combines professional-grade tools with an intuitive interface, making it simple for anyone to build high-performance websites.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/login" className={cn(
              "px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50" : "bg-slate-900 text-white hover:bg-blue-600"
            )}>
              Start Building Now
            </Link>
            <button className={cn(
              "px-8 py-4 rounded-full font-bold text-lg border backdrop-blur-md transition-all hover:scale-105 active:scale-95",
              isDark ? "bg-slate-800/50 border-slate-700 text-white hover:bg-slate-800" : "bg-white/50 border-slate-200 text-slate-900 hover:bg-white"
            )}>
              Watch Showreel
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= BENTO FEATURES SHOWCASE ================= */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
          {/* Feature 1: Large Bento */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-8 rounded-[2.5rem] p-10 border relative overflow-hidden group",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
            <div className="max-w-md relative z-10">
              <Layers className="text-emerald-500 w-10 h-10 mb-6" />
              <h2 className="text-4xl font-bold mb-4">{features[0].title}</h2>
              <p className="text-slate-400 text-lg mb-6">{features[0].description}</p>
              <Link to="/login" className="text-emerald-500 font-bold flex items-center gap-2 group">
                Explore Components <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <img src={componentsImg} className="absolute bottom-[-10%] right-[-5%] w-2/3 rounded-tl-3xl shadow-2xl transition-transform group-hover:scale-105 group-hover:-rotate-2 duration-500" />
          </motion.div>

          {/* Feature 2: Tall Bento */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-4 rounded-[2.5rem] p-10 border relative overflow-hidden",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
            <LayoutTemplate className="text-purple-500 w-10 h-10 mb-6" />
            <h2 className="text-3xl font-bold mb-4">{features[1].title}</h2>
            <p className="text-slate-400 mb-8">{features[1].description}</p>
            <img src={templatesImg} className="absolute bottom-[-5%] left-0 w-full rounded-t-3xl shadow-2xl" />
          </motion.div>

          {/* Feature 3: Full Width Minimal */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-12 rounded-[2.5rem] p-10 border flex flex-col md:flex-row items-center gap-10 overflow-hidden",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
            <div className="flex-1">
              <Move className="text-blue-500 w-10 h-10 mb-6" />
              <h2 className="text-4xl font-bold mb-4">{features[2].title}</h2>
              <p className="text-slate-400 text-lg">{features[2].description}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                 {features[2].details.map((d, i) => (
                   <span key={i} className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-semibold">{d}</span>
                 ))}
              </div>
            </div>
            <div className="flex-1 relative">
               <img src={dragDropImg} className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 w-full" />
            </div>
          </motion.div>

          {/* Feature 4: Medium Bento (Design Tokens) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-6 rounded-[2.5rem] p-10 border relative overflow-hidden group",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
            <Palette className="text-emerald-500 w-10 h-10 mb-6" />
            <h2 className="text-3xl font-bold mb-4 font-sans">{features[3].title}</h2>
            <p className="text-slate-400 mb-6">{features[3].description}</p>
            <div className="absolute bottom-0 right-0 w-1/2 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
               <div className="flex gap-2 mb-2 justify-end px-6 pb-6">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className={cn("w-10 h-10 rounded-full", i===1 ? "bg-blue-500" : i===2 ? "bg-purple-500" : i===3? "bg-emerald-500" : "bg-orange-500")} />
                 ))}
               </div>
            </div>
          </motion.div>

          {/* Feature 5: Medium Bento (Responsive) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-6 rounded-[2.5rem] p-10 border relative overflow-hidden group",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
            <Smartphone className="text-blue-500 w-10 h-10 mb-6" />
            <h2 className="text-3xl font-bold mb-4">{features[4].title}</h2>
            <p className="text-slate-400 mb-6">{features[4].description}</p>
            <div className="flex items-center gap-4 mt-auto">
              <Monitor className="w-6 h-6 text-slate-500" />
              <div className="h-px flex-1 bg-slate-800" />
              <Smartphone className="w-6 h-6 text-blue-500" />
            </div>
          </motion.div>

          {/* Feature 6: Full Width Dynamic (Deploy) */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "md:col-span-12 rounded-[2.5rem] p-10 border relative overflow-hidden group flex flex-col md:flex-row items-center",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-xl"
            )}
          >
             <div className="flex-1 relative z-10">
                <Globe className="text-purple-500 w-10 h-10 mb-6" />
                <h2 className="text-4xl font-bold mb-4">{features[5].title}</h2>
                <p className="text-slate-400 text-lg mb-8">{features[5].description}</p>
                <button className="px-8 py-3 rounded-full bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center gap-2">
                  Launch Project <Zap className="w-4 h-4 fill-white" />
                </button>
             </div>
             <div className="flex-1 relative flex justify-center items-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 border-2 border-dashed border-purple-500/30 rounded-full flex justify-center items-center"
                >
                   <Globe className="w-32 h-32 text-purple-500/50" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* ================= STATS / GRID ================= */}
      <section className={cn("py-32 px-6", isDark ? "bg-slate-900/50" : "bg-slate-100/50")}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Designed for Performance</h2>
            <p className={cn("text-xl max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>
              We don't just help you build websites; we help you build high-speed, SEO-friendly experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Zap />, title: "Lightning Fast", desc: "Optimized code for sub-second load times." },
              { icon: <Monitor />, title: "Mobile Ready", desc: "Fully responsive layouts on every device." },
              { icon: < Globe />, title: "Global CDN", desc: "Deploy to our worldwide edge network." },
              { icon: <Code2 />, title: "Clean Export", desc: "Download semantic, high-quality code." }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={cn(
                  "p-8 rounded-[2.5rem] border transition-all duration-300 group",
                  isDark 
                    ? "bg-slate-900 border-slate-800 hover:border-blue-500 hover:bg-slate-900 shadow-2xl hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]" 
                    : "bg-white border-slate-200 hover:border-blue-500 shadow-xl hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]"
                )}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/40">
                  {stat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{stat.title}</h3>
                <p className={cn(isDark ? "text-slate-400" : "text-slate-600")}>{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 text-center relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={cn(
            "max-w-5xl mx-auto p-12 md:p-32 rounded-[5rem] border relative overflow-hidden group shadow-[0_32px_120px_rgba(59,130,246,0.3)]",
            isDark 
              ? "bg-slate-900 border-white/10" 
              : "bg-white border-slate-200"
          )}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-[80px]"
            />
          </div>

          <div className="absolute top-0 right-0 p-8 md:p-12 opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
            <Cpu className="w-32 h-32 md:w-64 md:h-64 text-blue-500" />
          </div>
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 opacity-10 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
            <Zap className="w-24 h-24 md:w-48 md:h-48 text-indigo-500" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 relative z-10 tracking-tighter">Ready to start?</h2>
          <p className={cn("text-xl md:text-2xl mb-12 relative z-10 font-medium leading-relaxed", isDark ? "text-slate-200" : "text-slate-700")}>
            Join thousands of creators buildora and launch your masterpiece today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/contact" className={cn(
              "h-20 px-12 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50 shadow-blue-500/50 shadow-2xl" : "bg-slate-900 text-white hover:bg-blue-600 shadow-2xl"
            )}>
              Get Started for Free <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
};

export default FeaturesPage;
