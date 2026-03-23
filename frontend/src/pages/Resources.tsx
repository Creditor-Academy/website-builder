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
    whileHover={{ y: -8, scale: 1.02 }}
    className={cn(
      "p-8 rounded-[2.5rem] border transition-all duration-300 group flex flex-col",
      isDark 
        ? "bg-slate-900 border-slate-800 hover:border-blue-500 shadow-2xl hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]" 
        : "bg-white border-slate-200 hover:border-blue-500 shadow-xl hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.1)]"
    )}
  >
    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors">{title}</h3>
    <p className={cn("text-lg mb-6 leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{description}</p>
    <div className="mt-auto flex items-center gap-2 text-blue-500 font-bold cursor-pointer group/link">
      Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
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

  const specializedTools = [
    { icon: <Zap />, title: "SEO Optimization", desc: "Automated meta tags, sitemaps, and performance tuning for search engines.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz_nRRORkxE3dDGAnpueuf7QfZNL9wPZ7UcQ&s" },
    { icon: <Layout />, title: "Predefined Sections", desc: "Access 500+ pre-built UI components and sections for any industry.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9jQrPHja6PytfgLJ_VU4u7zx52Kw0NeERRw&s" },
    { icon: <Smartphone />, title: "Performance Monitor", desc: "Track your site's speed and core web vitals in real-time.", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRysUu25sjiauVAjfw7KKIm05z2QKQWLMlcw&s" }
  ];

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
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[80vh] flex items-center">
        {/* Dedicated Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuj4zi1knuHtPt7mrna1GYDRzemqdhMrSxMw&s" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-75 transition-all duration-1000"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-b opacity-40", isDark ? "from-slate-950 via-slate-950/20 to-slate-950" : "from-slate-50 via-slate-50/20 to-slate-50")} />
        </div>

        {/* Animated Background Orbs */}
        <div className="absolute inset-0 pointer-events-none z-[1]">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full blur-[120px]", isDark ? "bg-blue-600/30" : "bg-blue-400/30")}
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className={cn("absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full blur-[100px]", isDark ? "bg-indigo-600/30" : "bg-indigo-400/30")}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold text-sm tracking-widest uppercase"
          >
            Growth Hub
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8",
              isDark ? "text-white" : "text-slate-900"
            )}
          >
            Everything tools <br />
            <span className="text-blue-500 italic font-serif font-light">you need to succeed.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn("text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12", isDark ? "text-slate-400" : "text-slate-900")}
          >
            Explore our collection of premium resources, AI tools, and professional services designed to help you build, launch, and grow your digital presence.
          </motion.p>
        </div>
      </section>

      {/* ================= RESOURCES GRID ================= */}
      <section className="pb-32 px-10 py-20 ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainResources.map((resource, i) => (
            <ResourceCard key={i} {...resource} isDark={isDark} />
          ))}
        </div>
      </section>

      {/* ================= PREDEFINED RESOURCES SHOWCASE ================= */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6">Predefined Creative Assets</h2>
          <p className={cn("text-xl max-w-2xl mx-auto", isDark ? "text-slate-400" : "text-slate-600")}>
            Access thousands of professionally curated assets directly within the Buildora editor.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "rounded-[3rem] p-10 border relative overflow-hidden group",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-2xl"
            )}
          >
            <div className="max-w-md relative z-10">
              <Layout className="text-blue-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-bold mb-4">500+ Designer Sections</h3>
              <p className={cn("text-lg mb-8", isDark ? "text-slate-400" : "text-slate-600")}>
                Drop pre-built hero sections, galleries, and footers that automatically adapt to your site's design tokens.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold">Headers</div>
                <div className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 text-sm font-bold">Showcase</div>
                <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold">Contact</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 transition-transform group-hover:scale-110">
              <div className="absolute inset-0 bg-blue-500 blur-[80px]" />
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={cn(
              "rounded-[3rem] p-10 border relative overflow-hidden group",
              isDark ? "bg-slate-900 border-white/5" : "bg-white border-black/5 shadow-2xl"
            )}
          >
            <div className="max-w-md relative z-10">
              <Brush className="text-purple-500 w-12 h-12 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Stock Media Library</h3>
              <p className={cn("text-lg mb-8", isDark ? "text-slate-400" : "text-slate-600")}>
                Free access to millions of high-resolution stock images, icons, and illustrations right at your fingertips.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-6">H</div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold transition-transform group-hover:-rotate-6">D</div>
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold transition-transform group-hover:rotate-12">Q</div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-20 transition-transform group-hover:scale-110">
              <div className="absolute inset-0 bg-purple-500 blur-[80px]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SPECIALIZED TOOLS SECTION ================= */}
      <section className={cn("py-32 px-6 relative overflow-hidden", isDark ? "bg-slate-900/20" : "bg-slate-100/40")}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[1.1]">
                Professional tools <br />
                <span className="text-blue-500 italic">built for winners.</span>
              </h2>
              <div className="space-y-6">
                {specializedTools.map((item, i) => (
                  <motion.div 
                    key={i} 
                    onMouseEnter={() => setHoveredTool(i)}
                    onMouseLeave={() => setHoveredTool(null)}
                    whileHover={{ x: 10 }}
                    className={cn(
                      "flex gap-6 p-8 rounded-[2.5rem] border transition-all duration-300 group cursor-pointer",
                      isDark 
                        ? (hoveredTool === i ? "bg-blue-600/10 border-blue-500 shadow-2xl" : "bg-slate-900/60 border-slate-800") 
                        : (hoveredTool === i ? "bg-blue-50 border-blue-500 shadow-xl" : "bg-white border-slate-200")
                    )}
                  >
                    <div className={cn(
                      "shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                      hoveredTool === i ? "bg-blue-500 text-white scale-110 rotate-3" : (isDark ? "bg-slate-800 text-blue-500" : "bg-slate-50 text-blue-500 shadow-inner")
                    )}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className={cn("text-2xl font-bold mb-2 transition-colors", hoveredTool === i ? "text-blue-500" : "")}>{item.title}</h3>
                      <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-600")}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={hoveredTool ?? 'default'}
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="absolute -inset-10 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                  <div className={cn(
                    "relative w-full h-full rounded-[4rem] border p-4 overflow-hidden shadow-2xl transition-all duration-500 group",
                    isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
                  )}>
                    <img 
                      src={hoveredTool !== null ? specializedTools[hoveredTool].image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZqWgtNsCseWzSsn1Cdy_Z3mEApSLL7MH_Sg&s"} 
                      alt="Tool Preview" 
                      className="w-full h-full object-cover rounded-[3rem] transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-10 left-10 text-white">
                      <div className="text-sm font-bold tracking-widest uppercase mb-2 text-blue-400">Preview Mode</div>
                      <div className="text-3xl font-black leading-none">{hoveredTool !== null ? specializedTools[hoveredTool].title : "Select a tool"}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className={cn(
             "max-w-5xl mx-auto p-12 md:p-32 rounded-[5rem] border relative overflow-hidden group shadow-[0_32px_120px_rgba(59,130,246,0.3)]",
             isDark 
               ? "bg-slate-900 border-white/10" 
               : "bg-white border-slate-300"
           )}
        >
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-200/20to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 p-12 opacity-20 transition-transform group-hover:scale-110">
            <Sparkles className="w-64 h-64 text-blue-500" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black mb-10 relative z-10 tracking-tighter">Ready to scale?</h2>
          <p className={cn("text-2xl mb-12 relative z-10 leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
            Join 50k+ creators using Buildora's resources to launch their professional businesses today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <Link to="/contact" className={cn(
              "h-18 px-10 py-5 rounded-full font-bold text-xl flex items-center justify-center gap-3 transition-all",
              isDark ? "bg-white text-slate-950 hover:bg-blue-50 shadow-xl" : "bg-slate-900 text-white hover:bg-blue-600 shadow-xl"
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
