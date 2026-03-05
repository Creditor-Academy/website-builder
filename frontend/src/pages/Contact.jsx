import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Search, ShoppingBag, Home, Send, CheckCircle2 } from "lucide-react";
import Footer from "./footer";
import contact from "../assets/contact.jpg";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <section className="w-full flex flex-col min-h-screen bg-[#F8FAFC] selection:bg-blue-100">
      
      {/* NAVBAR - Sticky with Blur */}
      <nav className="sticky top-0 w-full h-20 flex items-center px-8 bg-white/80 backdrop-blur-md text-black z-50 border-b border-gray-100">
        <div className="flex items-center gap-2 mr-12 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200"
          >
            B
          </motion.div>
          <span className="text-xl font-black tracking-tighter">BUILDORA</span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[14px] font-bold text-gray-500">
          {["Home", "Pages", "Services"].map((item) => (
            <Link key={item} to="/" className="hover:text-blue-600 transition-all flex items-center gap-1 group">
              {item} 
              <span className="text-[10px] group-hover:translate-y-0.5 transition-transform">▼</span>
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100 text-sm font-bold text-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            +1 (123) 456 7890
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
            <div className="relative group cursor-pointer">
              <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO - Parallax Effect */}
      <div className="w-full h-[400px] relative flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${contact})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-6xl font-black mb-6 tracking-tight drop-shadow-2xl">
            Let's Build <span className="text-blue-400">Together</span>
          </h1>
          <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 w-fit mx-auto">
            <Home className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 font-medium">Home</span>
            <span className="text-white/30">/</span>
            <span className="font-medium">Contact Us</span>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative flex-1 flex flex-col pt-24 pb-24 items-center overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-[120px] -z-10" />

        <div className="max-w-[1240px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: INFO CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-[#0F172A] rounded-[2rem] p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full group-hover:bg-blue-500/40 transition-colors duration-700" />
            
            <div className="relative z-10">
              <span className="bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-blue-500/20">
                Contact Info
              </span>
              <h2 className="text-4xl font-bold mt-8 mb-6 leading-tight">
                Ready to elevate your <span className="text-blue-400">digital presence?</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-12">
                We don't just answer emails. We start partnerships. Drop us a line and let's create something extraordinary.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Phone, label: "Call Us", val: "+1 (123) 456 7890" },
                  { icon: Mail, label: "Email Us", val: "hello@buildora.com" },
                  { icon: MapPin, label: "Visit Us", val: "7164 Barton Terrace, North Penelope, VT" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-5 group/item"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-blue-600 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-400 group-hover/item:text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-lg font-medium text-gray-200">{item.val}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white rounded-[2rem] p-10 lg:p-14 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Send a Message</h3>
              <p className="text-gray-500">Response time: Usually within 2 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name" type="text" placeholder="John" />
                <InputField label="Last Name" type="text" placeholder="Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Email Address" type="email" placeholder="john@example.com" />
                <InputField label="Phone Number" type="tel" placeholder="+1..." />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Your Message</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your project..."
                  className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all bg-gray-50/50 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || isSent}
                className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isSent 
                    ? "bg-green-500 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loader"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : isSent ? (
                    <motion.div key="sent" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Message Sent!
                    </motion.div>
                  ) : (
                    <motion.div key="default" className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>

      <Footer />
    </section>
  );
}

// Reusable Input Component for cleaner code
function InputField({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
      <input
        {...props}
        className="w-full border-2 border-gray-50 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all bg-gray-50/50"
      />
    </div>
  );
}