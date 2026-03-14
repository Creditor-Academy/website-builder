import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  LifeBuoy, 
  Brush, 
  Sparkles, 
  UserCheck, 
  Target, 
  Eye, 
  Wrench,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Layout,
  Cpu,
  Smartphone,
  Code,
  Palette,
  Grid
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

const ResourceCard = ({ icon, title, description, isDark }: { icon: React.ReactNode, title: string, description: string, isDark: boolean }) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.03 }}
    className={cn(
      "p-10 rounded-[3rem] border transition-all duration-500 group flex flex-col relative overflow-hidden",
      isDark 
        ? "bg-slate-900/40 border-white/5 backdrop-blur-xl hover:border-blue-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-blue-500/20" 
        : "bg-white/80 border-slate-200 backdrop-blur-md hover:border-blue-500 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-blue-500/10"
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 transform group-hover:rotate-12 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 group-hover:text-blue-500 transition-colors tracking-tight">{title}</h3>
    <p className={cn("text-lg mb-8 leading-relaxed font-medium", isDark ? "text-slate-400" : "text-slate-600")}>{description}</p>
    <div className="mt-auto flex items-center gap-3 text-blue-500 font-bold cursor-pointer group/link uppercase text-xs tracking-[0.2em]">
      Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-2" />
    </div>
  </motion.div>
);

const Resources = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const isDark = theme === 'dark';

  useEffect(() => {
    document.body.style.backgroundColor = isDark ? '#020617' : '#f8fafc';
  }, [isDark]);

  const mainResources = [
    {
      icon: <Grid className="w-6 h-6" />,
      title: "Template Library",
      description: "Explore 500+ designer-made templates for any industry."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Developer Hub",
      description: "Access APIs, documentation, and tools for advanced customization."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Design Assets",
      description: "Unlock millions of high-quality icons, fonts, and stock images."
    },
    {
      icon: <LifeBuoy className="w-6 h-6" />,
      title: "Help Center",
      description: "Find the answers and support you need."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Predefine Professionally",
      description: "Access curated configurations and professional setups for your site."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Business Name Generator",
      description: "Get name ideas for your business."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Web design inspiration",
      description: "Explore designs by other Buildora users."
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Free business tools",
      description: "Explore tools to help you run & grow your business."
    }
  ];

  const [hoveredTool, setHoveredTool] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const specializedTools = [
    { icon: <Zap />, title: "SEO Optimization", desc: "Automated meta tags, sitemaps, and performance tuning for search engines.", image: "/assets/SEO.jpg" },
    { icon: <Layout />, title: "Predefined Sections", desc: "Access 500+ pre-built UI components and sections for any industry.", image: "/assets/predefine.jpg" },
    { icon: <Smartphone />, title: "Performance Monitor", desc: "Track your site's speed and core web vitals in real-time.", image: "/assets/monitor.jpg" }
  ];

  useEffect(() => {
    if (hoveredTool !== null) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % specializedTools.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hoveredTool, specializedTools.length]);

  return (
    <main className={cn(
      "w-full min-h-screen transition-colors duration-1000 selection:bg-blue-500/30 relative",
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    )}>
      <Helmet>
        <title>Resources - Buildora</title>
        <meta name="description" content="Explore Buildora's collection of resources, tools, and guides to help you build better websites." />
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
                  item === "Resources" ? "w-full" : "w-0 group-hover:w-full"
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
      <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="/assets/res.png" 
            alt="Hero Background" 
            className={cn(
              "w-full h-full object-cover transition-all duration-1000",
              isDark ? "brightness-[0.5]" : "brightness-[0.8]"
            )}
          />
          <div className={cn("absolute inset-0 bg-gradient-to-r via-transparent to-transparent opacity-80", isDark ? "from-slate-950" : "from-slate-50")} />
          <div className={cn("absolute inset-0 bg-gradient-to-b via-transparent opacity-60", isDark ? "to-slate-950" : "to-slate-50")} />
        </div>

        <div className="max-w-7xl mx-auto text-left relative z-10 w-full px-8">
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className={cn(
              "text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.9] mb-8",
              isDark ? "text-white" : "text-white"
            )}
          >
            <span className="font-sans">Master the</span><br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">Digital Realm.</span>
          </motion.h1>

          {/* <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
            className="h-1.5 w-full max-w-4xl bg-blue-600 mb-10 rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.4)] origin-left"
          /> */}
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={cn("text-xl md:text-3xl max-w-2xl leading-relaxed mb-10 font-medium", isDark ? "text-slate-300" : "text-white")}
          >
            Leverage elite resources, AI-driven tools, and high-performance assets curated specifically for industry leaders.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-8"
          >
            <Link to="/templates" className={cn(
              "h-20 px-10 rounded-full font-black text-xl flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50" : "bg-slate-900 text-white hover:bg-blue-600"
            )}>
              Start Building <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= RESOURCES GRID ================= */}
      <section className="py-24 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainResources.map((resource, i) => (
            <ResourceCard key={i} {...resource} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ================= PREDEFINED RESOURCES SHOWCASE ================= */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">Predefined Creative Assets</h2>
          <p className={cn("text-xl md:text-2xl max-w-2xl mx-auto font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
            Access thousands of professionally curated assets directly within the Buildora editor.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -10 }}
            className={cn(
              "rounded-[4rem] p-16 border relative overflow-hidden group transition-all duration-500",
              isDark ? "bg-slate-900/50 border-white/5 backdrop-blur-xl" : "bg-white border-slate-200 shadow-2xl shadow-blue-500/5"
            )}
          >
            <div className="max-w-md relative z-10">
              <Layout className="text-blue-500 w-16 h-16 mb-10" />
              <h3 className="text-4xl font-black mb-6 tracking-tight">500+ Designer Sections</h3>
              <p className={cn("text-xl mb-10 leading-relaxed font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
                Drop pre-built hero sections, galleries, and footers that automatically adapt to your site's design tokens.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Headers", "Showcase", "Contact", "Pricing"].map(tag => (
                  <div key={tag} className="px-5 py-2 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest">{tag}</div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 transition-transform group-hover:scale-125 duration-1000">
              <div className="absolute inset-0 bg-blue-500 blur-[100px]" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className={cn(
              "rounded-[4rem] p-16 border relative overflow-hidden group transition-all duration-500",
              isDark ? "bg-slate-900/50 border-white/5 backdrop-blur-xl" : "bg-white border-slate-200 shadow-2xl shadow-blue-500/5"
            )}
          >
            <div className="max-w-md relative z-10">
              <Brush className="text-purple-500 w-16 h-16 mb-10" />
              <h3 className="text-4xl font-black mb-6 tracking-tight">Stock Media Library</h3>
              <p className={cn("text-xl mb-10 leading-relaxed font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
                Free access to millions of high-resolution stock images, icons, and illustrations right at your fingertips.
              </p>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-white font-black transition-transform group-hover:rotate-12 shadow-xl">HD</div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black transition-transform group-hover:-rotate-12 shadow-xl">4K</div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10 transition-transform group-hover:scale-125 duration-1000">
              <div className="absolute inset-0 bg-purple-500 blur-[100px]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SPECIALIZED TOOLS SECTION ================= */}
      <section className={cn("py-20 px-6 relative overflow-hidden", isDark ? "bg-slate-950" : "bg-slate-50")}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'white' : 'black'} 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-4 py-1 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-black text-[10px] tracking-widest uppercase">
                Pro Console
              </div>
              <h2 className="text-5xl md:text-8xl font-black mb-12 leading-[0.9] tracking-tighter">
                Professional tools <br />
                <span className="text-blue-500 italic font-serif font-light">built for winners.</span>
              </h2>
              <div className="space-y-4">
                {specializedTools.map((item, i) => (
                  <motion.div 
                    key={i} 
                    onMouseEnter={() => setHoveredTool(i)}
                    onMouseLeave={() => setHoveredTool(null)}
                    className={cn(
                      "flex gap-8 p-10 rounded-[3rem] border transition-all duration-500 group cursor-pointer relative overflow-hidden",
                      (hoveredTool === i || (hoveredTool === null && activeIndex === i))
                        ? (isDark ? "bg-blue-600/10 border-blue-500/50 shadow-2xl scale-[1.02]" : "bg-blue-50 border-blue-500 shadow-xl scale-[1.02]") 
                        : (isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200")
                    )}
                  >
                    <div className={cn(
                      "shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg",
                      (hoveredTool === i || (hoveredTool === null && activeIndex === i)) ? "bg-blue-500 text-white rotate-6 scale-110" : (isDark ? "bg-slate-800 text-blue-500" : "bg-slate-50 text-blue-500")
                    )}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={cn("text-3xl font-black transition-colors tracking-tight", (hoveredTool === i || (hoveredTool === null && activeIndex === i)) ? "text-blue-500" : "")}>{item.title}</h3>
                        <div className={cn("text-[10px] uppercase tracking-widest font-black py-1 px-3 rounded-full transition-colors", (hoveredTool === i || (hoveredTool === null && activeIndex === i)) ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500")}>Active</div>
                      </div>
                      <p className={cn("text-lg font-medium", isDark ? "text-slate-400" : "text-slate-600")}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-20 bg-blue-500/20 rounded-full blur-[150px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredTool !== null ? `hover-${hoveredTool}` : `auto-${activeIndex}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="relative"
                >
                  <div className={cn(
                    "relative w-full rounded-[4.5rem] border p-6 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.4)] group transition-all duration-700",
                    isDark ? "bg-slate-900 border-white/5" : "bg-white border-slate-200"
                  )}>
                    <div className="aspect-[4/3] rounded-[3.5rem] overflow-hidden relative">
                      <img 
                        src={hoveredTool !== null ? specializedTools[hoveredTool].image : specializedTools[activeIndex].image} 
                        alt="Tool Preview" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent h-1/2 mt-auto" />
                    </div>
                    <div className="pt-8 px-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase mb-2 text-blue-500">Live Simulation</div>
                        <div className="text-4xl font-black leading-none">{hoveredTool !== null ? specializedTools[hoveredTool].title : specializedTools[activeIndex].title}</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-slate-800/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                        <Zap className="w-6 h-6 fill-blue-500 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[200px] bg-blue-500/10 blur-[150px] pointer-events-none" />
        
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={cn(
              "max-w-4xl mx-auto p-12 md:p-24 rounded-[4rem] border relative overflow-hidden group shadow-[0_32px_100px_rgba(59,130,246,0.2)]",
              isDark 
                ? "bg-slate-900 border-white/10 bg-gradient-to-br from-slate-900 to-slate-950" 
                : "bg-white border-slate-300 shadow-2xl"
            )}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110">
            <Sparkles className="w-64 h-64 text-blue-500" />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-8 relative z-10 tracking-tight leading-[1.1]">Ready to scale?</h2>
          <p className={cn("text-xl mb-12 relative z-10 leading-relaxed max-w-2xl mx-auto font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
            Join 50k+ creators using Buildora's resources to launch their professional businesses today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/contact" className={cn(
              "h-18 px-10 py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/10",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50" : "bg-slate-900 text-white hover:bg-blue-600"
            )}>
              Explore All Tools <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer isDark={isDark} />
    </main>
  );
};

export default Resources;
