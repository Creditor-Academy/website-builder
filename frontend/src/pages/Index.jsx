import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import brand from "../assets/brand.mp4";
import business from "../assets/Bussiness.jpg";
import create from "../assets/create.mp4";
import library from "../assets/Libaray.mp4";  
import Drag from "../assets/Drag.gif";
import Ecommerce from "../assets/Ecomm.jpg";
import Portfolio from "../assets/Portfolio.jpg";
import CTA from "../assets/CTA.png"; 
import bgg2 from "../assets/bgg2.png";
const features = [
  {
    id: 1,
    title: "* Drag and drop freedom",
    desc: "Drag and drop elements anywhere with complete freedom. Resize, reposition, and layer components effortlessly—no coding required.",
    image: Drag,
  },
  {
    id: 2,
    title: "* Create with us",
    desc: "Create with us using powerful tools designed to turn your ideas into stunning, high-performing websites—fast and effortlessly.",
    image: create,
  },
  {
    id: 3,
    title: "* A library of possibilities",
    desc: "A growing library of possibilities at your fingertips. Mix, match, and customize layouts, sections, and elements to build websites that truly reflect your ideas.",
    image: library,
  },
  {
    id: 4,
    title: "* Define our brand",
    desc: "At Buildora, we’re redefining how websites are built. Our platform blends flexibility with simplicity, empowering creators to turn ideas into beautiful, high-performing websites—faster than ever.",
    image: brand,
  },
];

const templates = [
  { title: "eCommerce", image: Ecommerce },
  { title: "Portfolio", image: Portfolio },
  { title: "Business", image: business },
];

export default function LandingPage() {
const carouselRef = useRef(null);
const [pauseCarousel, setPauseCarousel] = useState(false);
const [activeBtn, setActiveBtn] = useState(false);
const [active, setActive] = useState(features[0]);
useEffect(() => {
  let scrollAmount = 0;
  let rafId;

  const speed = 2.0;

  const autoScroll = () => {
    if (!pauseCarousel && carouselRef.current) {
      scrollAmount += speed;
      carouselRef.current.scrollLeft = scrollAmount;

      if (
        scrollAmount >=
        carouselRef.current.scrollWidth / 2
      ) {
        scrollAmount = 0;
        carouselRef.current.scrollLeft = 0;
      }
    }
    rafId = requestAnimationFrame(autoScroll);
  };

  autoScroll();
  return () => cancelAnimationFrame(rafId);
}, [pauseCarousel]);


const aboutImgRef = useRef(null);

const handleAboutMouseMove = (e) => {
  const el = aboutImgRef.current;
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const moveX = (x - rect.width / 2) / 20;
  const moveY = (y - rect.height / 2) / 20;

  el.style.transform = `
  translate(${moveX}px, ${moveY}px)
  rotateX(${-moveY}deg)
  rotateY(${moveX}deg)
`;
};

const handleAboutMouseLeave = () => {
  if (aboutImgRef.current) {
    aboutImgRef.current.style.transform = "translate(0px, 0px)";
  }
};

const handleViewTemplates = () => {
  const section = document.getElementById("templates");
  section?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};


   return ( 
   <main className="w-full overflow-x-hidden">
{/* ================= HERO WITH NAVBAR ================= */}
 <section id="hero"
  className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: `url(${bgg2})` }}
>
  {/* Optional dark overlay */}
  {/* <div className="absolute inset-0 bg-black/60 z-0" /> */}

  {/* NAVBAR */}
  <nav className="absolute top-0 left-0 w-full z-20">
    <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between text-black">
      <div className="flex items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
          B
        </div>
        <div className="text-xl font-bold tracking-wide">
          UILDORA
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#web" className="hover:opacity-80">Features</a>
        <a href="#extrem" className="hover:opacity-80">Resources</a>
        <Link
  to="/login"
  className="hover:opacity-80 cursor-pointer"
>
  Log in
</Link>
        <Link to="/contact" className="border border-black px-5 py-2 rounded-md hover:bg-black hover:text-white transition">
          Get started
        </Link>
      </div>
    </div>
  </nav>

  {/* HERO CONTENT */}
  <div className="max-w-[1400px] mx-auto px-6 pt-40 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
  
  {/* LEFT TEXT */}
  <div className="text-left">
    <h1 className="font-sans font-bold text-[32px] md:text-[62px] lg:text-[72px] leading-tight text-slate-900 mb-8">
      Everything you need to build a website
      <br />
      <span className="text-slate-900">is here</span>
    </h1>

    <p className="font-sans text-[18px] leading-relaxed text-slate-600 max-w-xl mb-10">
      Create modern, responsive websites using powerful tools and flexible
      layouts. Everything is designed to help you move faster from idea to
      launch.
    

</p>
     
    </div>
  </div>



</section>

  


{/* _________________________ About_____________________  */}

<section id="about" className="relative h-[520px] md:h-[620px] overflow-hidden rounded-3xl mb-10">

  <div className="pointer-events-none absolute w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-100 blur-3xl opacity-50" />

  {/* Background Image */}
  <img
    src="https://img.freepik.com/free-vector/ui-ux-designers-isometric-composition-with-small-people-creating-custom-design-web-site-3d-vector-illustration_1284-68939.jpg?semt=ais_user_personalization&w=740&q=80"
    alt="Website preview"
    className="absolute
    right-[-0px]  
    top-1/2
    -translate-y-1/2
    h-full
    object-contain"
  />


  <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

    {/* LEFT */}
    <div>
      <h2 className="text-5xl mt-20 md:text-6xl font-extrabold text-neutral-900 tracking-tight">
        Get a{" "}
        <span className="text-blue-600 relative">
          Professional
        </span>{" "}
        website
      </h2>

      <p className="mt-4 text-lg text-neutral-600 max-w-xl">
        Build a stunning online presence and grow your business with fast,
        reliable, and modern website solutions.
      </p>

      {/* feature card */}
      <div className="mt-10 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 max-w-sm shadow-xl">
        <p className="text-sm font-semibold text-blue-600 mb-4">
          Why choose us
        </p>

        <ul className="space-y-3 text-sm text-neutral-700">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Fast delivery & clean code
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Professional UI/UX design
          </li>
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Trusted & scalable solutions
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 flex gap-4">
       <button
  onMouseEnter={() => setActiveBtn(true)}
  onMouseLeave={() => setActiveBtn(false)}
  onClick={() => {
    setActiveBtn(true);
    handleViewTemplates();
  }}
  className={`px-8 py-4 rounded-full font-semibold transition-all duration-300
    ${activeBtn
      ? "bg-blue-600 text-white shadow-lg scale-105"
      : "bg-white text-neutral-900 shadow"
    }`}
>
  View Templates
</button>
      
      </div>

      {/* trust */}
      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          100+ satisfied clients
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Trusted by 1000+ users
        </div>
      </div>
    </div>

      </div>
</section>

{/* ================= WEBSITE TEMPLATES ================= */}

<section id="web" className="relative pt-36 pb-16 px-6 bg-white overflow-hidden">
  {/* ===== SUBTLE BACKGROUND DEPTH ===== */}
  <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-blue-200 via-blue-200 to-blue-200 blur-3xl opacity-50" />
  <div className="pointer-events-none absolute -bottom-48 -right-48 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-slate-200 via-slate-200 to-gray-200 blur-3xl opacity-50" /> 

  <div className="relative max-w-[1400px] mx-auto">
    <div className="flex flex-col lg:flex-row justify-between gap-24">

      {/* ===== LEFT: EDITORIAL HEADING ===== */}
      <div className="max-w-2xl">
        <span className="block mb-6 text-sm uppercase tracking-[0.2em] text-stone-500">
          Website templates
        </span>

        <h2 className="
          text-[56px] md:text-[72px]
          leading-[1.05]
          font-extrabold
          tracking-tight
          text-stone-900
        ">
          Website templates
          <br />
          <span className="text-stone-400 font-semibold">
            are another way in
          </span>
        </h2>

        {/* Editorial divider */}
        <div className="mt-10 h-[2px] w-24 bg-gradient-to-r from-stone-900 to-transparent" />
      </div>

      {/* ===== RIGHT CONTENT ===== */}
      <div className="max-w-md">
        <p className="text-lg leading-relaxed text-stone-600 mb-10">
          Our free website builder offers 2000+{" "}
          <span className="underline underline-offset-4 decoration-2 decoration-stone-400">
            website templates
          </span>
          , all fully customizable and ready for business.
        </p>

        {/* <button className="
          rounded-full px-12 py-4
          text-lg font-semibold text-white
          bg-black
          shadow-lg shadow-black/20
          hover:shadow-xl hover:-translate-y-0.5
          transition-all
        ">
          Get Started
        </button> */}
      </div>

    </div>
  </div>
</section>

{/* ================= TEMPLATES CAROUSEL ================= */}
 <section id="templates" className="relative bg-white pt-4 pb-20 -mt-24 z-10"> 
  <div
    ref={carouselRef}
    onMouseEnter={() => setPauseCarousel(true)}
    onMouseLeave={() => setPauseCarousel(false)}
    className="
      flex gap-12
      overflow-x-scroll
      scroll-smooth
      -mx-6 px-6
      py-6 bg-white
    "
    style={{ scrollbarWidth: "none" }}
  >
    <style>{`
      div::-webkit-scrollbar {
        display: none;
      }
    `}</style>

    {templates.concat(templates).map((item, index) => (
      <div key={index} className="shrink-0 w-[380px] group cursor-pointer">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={item.image}
            alt={item.title}
            className="h-[420px] w-full object-cover"
          />
          {/* subtle hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        <p className="mt-6 text-lg font-medium underline underline-offset-4">
          {item.title} →
        </p>
      </div>
    ))}
  </div>
</section>





{/* __________EXTREM SECTION___________________ */}
     
<section id="extrem" className="w-full bg-gray-50 py-16">
  <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

    {/* LEFT: TEXT ACCORDION */}
    <div className="text-black space-y-10">
      <p className="text-5xl font-extrabold tracking-tight">
        Extreme customization.<br/>Absolute control.
      </p>

      <div className="space-y-4">
        {features.map((item) => {
          const isActive = active?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActive(isActive ? null : item)}
              onMouseEnter={() => setActive(item)}
              className={`group
                cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden
                ${isActive 
                  ? 'bg-[#1e293b] border-[#334155] shadow-lg' 
                  : 'bg-[#0f172a] border-transparent hover:bg-[#1e293b]/50'
                }
              `}
            >
              <div className="p-6 flex items-center justify-between">
                <p className="font-semibold text-lg text-white">
                  {item.title.replace('* ', '')}
                </p>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'rotate-180 text-blue-500' : 'text-slate-500 group-hover:text-blue-400'}`} 
                />
              </div>

              <div
                className={`transition-all duration-500 ease-in-out px-6 ${
                  isActive
                    ? "max-h-60 opacity-100 pb-6"
                    : "max-h-0 opacity-0 pb-0"
                }`}
              >
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                  {item.desc}
                </p>
                {/* {isActive && ( */}
                
                {/* )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* RIGHT: IMAGE (sticky container) */}
    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 aspect-square lg:aspect-auto lg:h-[600px] sticky top-24">
      {typeof active.image === "string" && active.image.endsWith(".mp4") ? (
        <video
          src={active.image}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={active.image}
          alt={active.title}
          className="w-full h-full object-cover"
        />
      )}
    </div> 

  </div>
</section>
 {/* ================= FIXED BG (ONLY THIS SECTION) ================= */}

 <section className="relative h-screen bg-white overflow-hidden"> 

  {/* Sticky background */}
   <div
    className="sticky h-full bg-cover bg-center"
    style={{ backgroundImage: `url(${CTA})` }}
  /> *

  {/* Content over background */}
  <div className="absolute inset-5 flex items-center justify-end "> 
    <div className="bg-white/75 backdrop-blur-xl rounded-3xl px-16 py-20 text-center max-w-3xl"> 

      {/* HEADING */}
      <h2 className="font-sans font-bold text-[48px] md:text-[64px] leading-tight text-black mb-6">
        Your vision. Your goals.
        
        <span className="text-black">Your website.</span>
      </h2>

      {/* SUBTEXT */}
      <p className="text-lg text-neutral-600 max-w-xl mx-auto mb-10">
        Build powerful, modern websites that bring your ideas to life.
        Start today and turn your vision into a digital reality.
      </p>

      {/* CTA BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
        
        

        <Link to="/contact" className="border border-black px-10 py-4 cursor-pointer rounded-full font-medium hover:bg-black hover:text-white transition">
          Contact Us
        </Link>
      </div>

    </div>
  </div>

</section> 

   {/* ================= FOOTER ================= */}
<footer id="footer" className="bg-[#1f2a33] text-white py-16 px-6">
  <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
    {/* BRAND & DESC */}
    <div className="md:col-span-2">
      <div className="flex items-center gap-1 mb-6">
        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
          B
        </div>
        <span className="text-xl font-semibold ">uildora</span>
      </div>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
        Build modern, responsive websites with powerful tools, flexible layouts,
        and complete creative control — no coding required.
      </p>
    </div>

   

    {/* COMPANY */}
    <div>
      <h3 className="font-semibold justify-start text-lg mb-4">Company</h3>
      <ul className="space-y-3 text-sm text-gray-400">
        <li><a href="/#about" className="hover:text-white transition cursor-pointer">About Us</a></li>
        <li><Link to="/privacy-policy" className="hover:text-white transition cursor-pointer">Privacy Policy</Link></li>
        <li><Link to="/terms-of-service" className="hover:text-white transition cursor-pointer">Terms of Service</Link></li>
      </ul>
    </div>
  </div>

  {/* BOTTOM BAR */}
  <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
    <p>© {new Date().getFullYear()} Buildora Inc. All rights reserved.</p>
    <p className="mt-4 md:mt-0">
      Powered by{" "}
      <a
        href="https://lmsathena.com/"
        target="_blank"
        rel="noreferrer"
        className="text-blue-400 hover:text-blue-300 hover:underline transition"
      >
        Athena LMS
      </a>
    </p>
  </div>
</footer>
</main >
  );
}   