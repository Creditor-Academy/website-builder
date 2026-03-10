import { useEffect, useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ChevronDown, ArrowRight, MousePointer2, Sparkles, Menu, X, Zap, LucideIcon, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useBuilderStore, { BuilderState } from "@/store/useBuilderStore";
import Footer from "./Footer";

// Assets - Note: You may need a declarations.d.ts file to import media files in TS
import brand from "../assets/brand.mp4";
import business from "../assets/Bussiness.jpg";
import create from "../assets/create.mp4";
import library from "../assets/Libaray.mp4";  
import Drag from "../assets/Drag.gif";
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import Learning from "../assets/Learning.jpg";
import Hospital from "../assets/Hospital.jpg";
import school from "../assets/School.jpg";
import CTA from "../assets/CTA.png"; 
import bgg from "../assets/bgg.jpg";
interface Feature {
  id: number;
  title: string;
  desc: string;
  image: string;
}

interface Template {
  id: string;
  title: string;
  image: string;
}

const features: Feature[] = [
  { id: 1, title: "* Drag and drop freedom", desc: "Drag and drop elements anywhere with complete freedom. Resize, reposition, and layer components effortlessly—no coding required.", image: Drag },
  { id: 2, title: "* Create with us", desc: "Create with us using powerful tools designed to turn your ideas into stunning, high-performing websites—fast and effortlessly.", image: create },
  { id: 3, title: "* A library of possibilities", desc: "A growing library of possibilities at your fingertips. Mix, match, and customize layouts, sections, and elements to build websites that truly reflect your ideas.", image: library },
  { id: 4, title: "* Define our brand", desc: "At Buildora, we’re redefining how websites are built. Our platform blends flexibility with simplicity, empowering creators to turn ideas into beautiful, high-performing websites—faster than ever.", image: brand },
];

const templates: Template[] = [
  { id: "ecommerce", title: "eCommerce", image: Ecommerce },
  { id: "portfolio", title: "Portfolio", image: Portfolio },
  { id: "business", title: "Business", image: business },
  { id: "consultant", title: "Consultant", image: business }, 
  { id: "blank", title: "Blank Canvas", image: school },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const createWebsite = useBuilderStore((state: BuilderState) => state.createWebsite);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSelectTemplate = (templateId: string, title: string) => {
    const id = createWebsite(`My ${title}`, templateId);
    navigate(`/builder/${id}`);
  };
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [pauseCarousel, setPauseCarousel] = useState<boolean>(false);
  const [activeBtn, setActiveBtn] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 500], [0, -120]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);
  const scaleHero = useTransform(scrollY, [0, 400], [1, 0.95]);

  // 3D Tilt Logic
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const mouseXSpringTilt = useSpring(tiltX, { stiffness: 50, damping: 20 });
  const mouseYSpringTilt = useSpring(tiltY, { stiffness: 50, damping: 20 });
  
  const rotateX = useTransform(mouseYSpringTilt, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseXSpringTilt, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    tiltX.set(xPct);
    tiltY.set(yPct);
    setMousePosition({ x: mouseX, y: mouseY });
  };


  useEffect(() => {
    let scrollAmount = 0;
    let rafId: number;
    const speed = 1.5;

    const autoScroll = () => {
      if (!pauseCarousel && carouselRef.current) {
        scrollAmount += speed;
        carouselRef.current.scrollLeft = scrollAmount;
        if (scrollAmount >= carouselRef.current.scrollWidth / 2) {
          scrollAmount = 0;
          carouselRef.current.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(autoScroll);
    };

    autoScroll();
    return () => cancelAnimationFrame(rafId);
  }, [pauseCarousel]);

  useEffect(() => {
    if (hoveredId !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [hoveredId]);

  const handleViewTemplates = (): void => {
    document.getElementById("templates")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#020617] text-slate-200 selection:bg-blue-500/30">
      
      {/* ================= NAV ================= */}
      <nav className="fixed top-0 w-full z-[100] px-6 py-8 flex justify-center">
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-6xl backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-2xl"
        >
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg group-hover:rotate-6 transition-transform">B</div>
            <span className="text-xl font-black tracking-tighter text-white uppercase">Buildora</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold">
            {["Home", "About", "Resources"].map((item) => (
              <a key={item} href={`#${item.toLowerCase() === 'resources' ? 'web' : item.toLowerCase()}`} className="text-slate-400 hover:text-white transition-colors">{item}</a>
            ))}
            <div className="h-4 w-px bg-white/10" />
            <Link to="/login" className="text-slate-400 hover:text-white">Log in</Link>
            <Link to="/contact" className="bg-white text-black px-6 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl">
              Get started
            </Link>
          </div>

          <button className="md:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-24 left-6 right-6 p-8 bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex flex-col gap-6 text-center pointer-events-auto shadow-2xl"
            >
              <a href="#hero" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Home</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">About</a>
              <a href="#web" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Resources</a>
              <Link to="/login" className="text-xl font-bold">Log in</Link>
              <Link to="/contact" className="bg-blue-600 text-white py-4 rounded-2xl font-bold">Get started</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* __________________HERO_______________________  */}

 <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgg} className="w-full h-full object-cover scale-110" alt="Background" />
           
              {/* <div className="absolute inset-0 bg-gradient-to-b from-blue-200/70 via-indigo-300/50 to-[#0f172a]" />
               */}
               <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-blue-100/40 to-[#0f172a]" />
        </div>

        <motion.div style={{ y: yContent, opacity: opacityHero, scale: scaleHero }} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest"
          >
            {/* <Sparkles className="w-3 h-3" /> The Future of Web Creation */}
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 leading-[1] tracking-tight mb-10">
            Everything you need to <br /> build a website <span className="text-blue-500">is here</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed mb-12">
            Create modern, responsive websites using powerful tools and flexible layouts. Everything is designed to help you move faster from idea to launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={handleViewTemplates} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-3 hover:-translate-y-1 active:translate-y-0">
              Start Building <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="py-12 md:py-20 relative bg-white rounded-t-[2rem] text-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Get a <span className="text-blue-600">Professional</span> website
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-lg">Build a stunning online presence and grow your business with fast, reliable, and modern website solutions.</p>
            
            <div className="space-y-4 mb-8">
              {['Fast delivery & clean code', 'Professional UI/UX design', 'Trusted & scalable solutions'].map((text, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">{text}</span>
                </div>
              ))}
            </div>

            <button 
              onMouseEnter={() => setActiveBtn(true)}
              onMouseLeave={() => setActiveBtn(false)}
              onClick={handleViewTemplates}
              className={`px-12 py-6 rounded-2xl font-black text-lg transition-all shadow-2xl ${activeBtn ? "bg-blue-600 text-white -translate-y-1" : "bg-slate-900 text-white"}`}
            >
              View Templates
            </button>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            whileInView={{ scale: 1, opacity: 1 }} 
            viewport={{ once: true }}
            className="relative group cursor-crosshair"
          >
            <div className="absolute -inset-10 bg-blue-400/20 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
            <motion.div whileHover={{ rotateY: 8, rotateX: -5 }} className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-[12px] border-white">
              <img src="https://img.freepik.com/free-vector/ui-ux-designers-isometric-composition-with-small-people-creating-custom-design-web-site-3d-vector-illustration_1284-68939.jpg?semt=ais_user_personalization&w=740&q=80" alt="Professional Design" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= TEMPLATES ================= */}
      <section id="web" className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-end ">
          <div className="flex-1">
            <span className="text-blue-600 font-black uppercase tracking-widest text-3xl mb-4 block">Website Templates</span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
              Another way <span className="italic text-slate-900 font-black">in.</span>
            </h2>
          </div>
          <p className="max-w-md text-slate-500 text-lg font-lg leading-relaxed">
            Our free website builder offers 2000+ <span className="text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-4">website templates</span>, all fully customizable.
          </p>
        </div>

        <div 
            id="templates" 
            ref={carouselRef} 
            onMouseEnter={() => setPauseCarousel(true)} 
            onMouseLeave={() => setPauseCarousel(false)} 
            className="flex gap-8 overflow-x-hidden py-10 px-6 cursor-grab active:cursor-grabbing"
        >
          {templates.concat(templates).map((item, index) => (
            <div key={index} className="shrink-0 w-[85vw] sm:w-[450px] group">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-12 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-white text-3xl font-black mb-6 translate-y-4 group-hover:translate-y-0 transition-transform">{item.title}</p>
                  <button 
                    onClick={() => handleSelectTemplate(item.id, item.title)}
                    className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 w-full justify-center hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Select Template <MousePointer2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-8 px-4">
                <p className="text-3xl font-black text-slate-900">{item.title} <span className="text-blue-500">→</span></p>
                <button 
                  onClick={() => handleSelectTemplate(item.id, item.title)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXTREME CONTROL ================= */}
      <section id="extrem" className="py-12 md:py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-12">
            <div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">Extreme</h2>
              <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">customization.</h3>
            </div>
            
            <div className="space-y-6" onMouseLeave={() => setHoveredId(null)}>
              {features.map((item) => {
                const isHovered = (hoveredId === item.id);
                return (
                  <div 
                    key={item.id} 
                    onMouseEnter={() => setHoveredId(item.id)}
                    className={`p-10 rounded-[2.5rem] cursor-pointer border-2 transition-all duration-500 ${isHovered ? "bg-white border-blue-500 shadow-[0_20px_50px_rgba(59,130,246,0.1)] scale-[1.02]" : "bg-white/50 border-slate-200 opacity-60 hover:opacity-100 hover:bg-white"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black ${isHovered ? "text-slate-900" : "text-slate-800"}`}>{item.title.replace('* ', '')}</span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${isHovered ? "rotate-180 text-blue-500" : "text-slate-600"}`} />
                    </div>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="text-slate-600 mt-6 leading-relaxed text-lg font-medium">{item.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative h-[500px] lg:h-[750px] rounded-[3.5rem] overflow-hidden lg:sticky lg:top-32 border border-white/10 shadow-3xl">
            <AnimatePresence mode="wait">
              {(() => {
                const activeFeature = hoveredId !== null 
                  ? features.find(f => f.id === hoveredId) 
                  : features[activeIndex];
                
                if (!activeFeature) return null;

                return (
                  <motion.div key={activeFeature.id} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-200/40 to-transparent z-10" />
                    {activeFeature.image.endsWith(".mp4") ? (
                      <video src={activeFeature.image} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={activeFeature.image} alt="feature" className="w-full h-full object-cover" />
                    )}
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="relative py-16 flex items-center justify-center min-h-[70vh]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={CTA} className="w-full h-full object-cover brightness-[1] scale-105" alt="CTA" />
        </div>
        <motion.div 
          initial={{ y: 60, opacity: 0 }} 
          whileInView={{ y: 0, opacity: 1 }} 
          className="relative z-10 bg-white/10 backdrop-blur-3xl border border-white/20 p-8 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">Your vision. <br /> <span className="text-blue-500">Your website.</span></h2>
          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto font-medium">Build powerful, modern websites that bring your ideas to life. Start today and turn your vision into a digital reality.</p>
          <Link to="/contact" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:bg-blue-600 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-3xl">
            Contact Us <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}