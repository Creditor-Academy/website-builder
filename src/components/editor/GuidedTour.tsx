import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronRight, ChevronLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: "Hi! I'm Buildy",
    message: "Welcome to Buildora! Let me show you how to build your masterpiece in just a few minutes.",
    target: '#tour-logo',
    mascotState: 'neutral',
    position: 'center'
  },
  {
    id: 'sections',
    title: "Start Building",
    message: "Browse our 500+ pre-designed sections and drag them onto your canvas to get started.",
    target: '#tour-nav-add',
    mascotState: 'pointing',
    position: 'right'
  },
  {
    id: 'canvas',
    title: "Your Canvas",
    message: "This is where the magic happens. Select any section to edit its content directly.",
    target: '#tour-canvas',
    mascotState: 'pointing',
    position: 'left'
  },
  {
    id: 'add-elements-tab',
    title: "Add Elements",
    message: "Customize every detail of your sections. Change colors, layout, and content here.",
    target: '#tour-nav-edit',
    mascotState: 'pointing',
    position: 'right'
  },
  {
    id: 'layers',
    title: "Layers & Outline",
    message: "View your site's structure in detail. Manage layers and fine-tune your design's composition.",
    target: '#tour-nav-layers',
    mascotState: 'idea',
    position: 'right'
  },
  {
    id: 'pages',
    title: "Manage Pages",
    message: "Organize your site's structure. Create, rename and organize your pages with ease.",
    target: '#tour-nav-pages',
    mascotState: 'pointing',
    position: 'right'
  },
  {
    id: 'publish',
    title: "Go Live!",
    message: "Once you're happy with your creation, hit publish to share it with the world.",
    target: '#tour-publish',
    mascotState: 'success',
    position: 'bottom'
  }
];

export function GuidedTour() {
  const { editor, setTourState } = useBuilderStore();
  const { tour } = editor;
  const currentStepData = TOUR_STEPS[tour.step];

  // Debug: Log tour state
  console.log('Tour state:', tour);
  console.log('Current step data:', currentStepData);

  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!tour.isActive || !currentStepData?.target) return;

    const updateSpotlight = () => {
      const element = document.querySelector(currentStepData.target);
      console.log('Looking for element:', currentStepData.target);
      console.log('Found element:', element);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log('Element rect:', rect);
        setSpotlight({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        });
        
        // Ensure targeted tab is active if needed
        if (currentStepData.id === 'pages') {
          const page = useBuilderStore.getState().getActivePage();
          if (page && page.sections.length > 0) {
            useBuilderStore.getState().selectSection(page.sections[0].id);
          }
        }
      } else {
        console.warn('Tour target element not found:', currentStepData.target);
      }
    };

    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    return () => window.removeEventListener('resize', updateSpotlight);
  }, [tour.isActive, tour.step, currentStepData]);

  const handleNext = () => {
    if (tour.step < TOUR_STEPS.length - 1) {
      setTourState({ step: tour.step + 1 });
    } else {
      setTourState({ isActive: false, isFinished: true });
    }
  };

  const handleBack = () => {
    if (tour.step > 0) {
      setTourState({ step: tour.step - 1 });
    }
  };

  if (!tour.isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Dark Overlay with Spotlight */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-all duration-500"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%, 
            ${spotlight.x}px 100%, 
            ${spotlight.x}px ${spotlight.y}px, 
            ${spotlight.x + spotlight.width}px ${spotlight.y}px, 
            ${spotlight.x + spotlight.width}px ${spotlight.y + spotlight.height}px, 
            ${spotlight.x}px ${spotlight.y + spotlight.height}px, 
            ${spotlight.x}px 100%, 
            100% 100%, 100% 0%
          )`
        }}
      />

      {/* Spotlight Glow */}
      <motion.div 
        animate={{ 
          left: spotlight.x - 10, 
          top: spotlight.y - 10, 
          width: spotlight.width + 20, 
          height: spotlight.height + 20,
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute border-2 border-primary rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] pointer-events-none"
      />

      {/* Mascot Buildy */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`mascot-${currentStepData?.mascotState}`}
          initial={{ y: 100, opacity: 0, x: 50 }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          exit={{ y: 50, opacity: 0 }}
          className="absolute bottom-10 right-10 flex flex-col items-center pointer-events-auto"
        >
          {/* Speech Bubble */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="mb-6 bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 max-w-sm relative"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary"><Sparkles className="w-5 h-5 fill-current" /></span>
              <h4 className="font-black text-slate-900 tracking-tight uppercase text-xs">Buildy Says:</h4>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{currentStepData?.title}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{currentStepData?.message}</p>
            
            <div className="flex items-center justify-between mt-8">
              <div className="flex gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === tour.step ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200'}`} 
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {tour.step > 0 && (
                  <button 
                    onClick={handleBack}
                    className="p-3 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  {tour.step === TOUR_STEPS.length - 1 ? 'Start Creating' : 'Got it!'} 
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-12 w-6 h-6 bg-white border-b border-r border-slate-100 rotate-45" />
          </motion.div>

          {/* Mascot Placeholder (SVG) */}
          <div className="relative w-40 h-40">
             <MascotSVG state={currentStepData?.mascotState} />
          </div>
        </motion.div>
      </AnimatePresence>

      <button 
        onClick={() => setTourState({ isActive: false })}
        className="absolute top-10 right-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all pointer-events-auto"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

function MascotSVG({ state }) {
  const isNeutral = state === 'neutral';
  const isPointing = state === 'pointing';
  const isIdea = state === 'idea';
  const isSuccess = state === 'success';

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
      {/* Body */}
      <motion.circle 
        animate={{ y: [0, -5, 0] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        cx="100" cy="120" r="60" fill="white" stroke="#e2e8f0" strokeWidth="2" 
      />
      {/* Face Panel */}
      <motion.rect 
        animate={{ y: [0, -5, 0] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        x="60" y="90" width="80" height="50" rx="20" fill="#0f172a" 
      />
      {/* Eyes */}
      <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}>
        <circle cx="85" cy="115" r="5" fill={isSuccess ? "#10b981" : "#3b82f6"} />
        <circle cx="115" cy="115" r="5" fill={isSuccess ? "#10b981" : "#3b82f6"} />
      </motion.g>

      {/* Mouth */}
      {isSuccess ? (
        <path d="M85 130 Q100 145 115 130" stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M90 130 H110" stroke="#3b82f6" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}

      {/* Floating Hands */}
      <motion.g animate={isPointing ? { x: -20, rotate: -10 } : { y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <circle cx="30" cy="120" r="15" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      </motion.g>
      
      <motion.g 
        initial={false}
        animate={
            isPointing ? { x: 80, y: -20, rotate: -30 } : 
            isSuccess ? { x: 40, y: -40, scale: 1.2 } : 
            isIdea ? { x: 30, y: -50, rotate: 15 } :
            { y: [0, 5, 0] }
        }
        transition={{ type: "spring", stiffness: 100 }}
      >
        <circle cx="170" cy="120" r="15" fill="white" stroke="#e2e8f0" strokeWidth="2" />
        {isPointing && <path d="M170 120 L210 100" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />}
        {isSuccess && <path d="M165 115 L170 120 L180 110" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />}
      </motion.g>

      {/* Idea Lightbulb */}
      {isIdea && (
        <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-amber-400">
           <circle cx="100" cy="50" r="15" fill="currentColor" opacity="0.2" />
           <Lightbulb x="85" y="35" width="30" height="30" className="text-amber-500" />
        </motion.g>
      )}
    </svg>
  );
}
