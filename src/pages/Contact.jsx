import { Link } from "react-router-dom";
import Footer from "./footer";
import contact from "../assets/contact.jpg";
import { Phone, Mail, MapPin, Search, ShoppingBag, Home } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="w-full flex flex-col min-h-screen bg-white">
      
      {/* NAVBAR */}
      <nav className="w-full h-20 flex items-center px-8 bg-white text-black shrink-0 relative z-10 border-b border-gray-100">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mr-12">
          <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-lg">
            B
          </div>
          <span className="text-xl font-bold tracking-tight">UILDORA</span>
        </div>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-gray-600">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-black transition-colors"
          >
            Home <span className="text-[10px]">▼</span>
          </Link>

          <Link
            to="/#about"
            className="hover:text-black text-blue-500 transition-colors flex items-center gap-1"
          >
            Pages <span className="text-[10px]">▼</span>
          </Link>

          <Link
            to="/#extrem"
            className="hover:text-black transition-colors flex items-center gap-1"
          >
            Services <span className="text-[10px]">▼</span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-6">
          
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Phone className="w-3 h-3" />
            </span>
            +1 (123) 456 7890
          </div>

          <div className="flex items-center gap-4">
            <button className="hover:text-blue-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <button className="hover:text-blue-500 transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div
        className="w-full h-[350px] relative flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${contact})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Contact Us
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">Home</span>
            <span className="text-gray-300">/</span>
            <span>Contact Us</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col pt-24 pb-20 items-center justify-center">
        
        <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          
          {/* LEFT CARD */}
          <div className="bg-[#111827] rounded-3xl p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 blur-3xl rounded-full"></div>

            <div>
              <div className="inline-block bg-blue-400/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                Contact Us
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                Need More Information?
                <br />
                Get in Touch
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-sm">
                Contact us today for tailored marketing strategies and expert
                advice. We're eager to help your business grow!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Phone Number</span>
                </div>
                <p className="text-gray-400 text-sm ml-8">
                  +1 (123) 456 7890
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Email Address</span>
                </div>
                <p className="text-gray-400 text-sm ml-8">
                  info@example.com
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-2 mt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Office Location</span>
                </div>

                <p className="text-gray-400 text-sm ml-8 leading-relaxed max-w-xs">
                  7164 Barton Terrace, North Penelope,
                  <br />
                  Vermont - 97879, USA
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="p-4 lg:p-6 flex flex-col justify-center">
            
            <div className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-4 py-1.5 rounded-full mb-4 w-max">
              Get in touch
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Send Message
            </h2>

            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md">
              Please fill out the form below with your details and message, and
              our team will get back to you as soon as possible.
            </p>

            <form className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <input
                  type="text"
                  placeholder="First Name*"
                  className="w-full border border-gray-200 rounded-lg px-5 py-3.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <input
                  type="text"
                  placeholder="Last Name*"
                  className="w-full border border-gray-200 rounded-lg px-5 py-3.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                <input
                  type="email"
                  placeholder="Email*"
                  className="w-full border border-gray-200 rounded-lg px-5 py-3.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />

                <input
                  type="tel"
                  placeholder="Phone*"
                  className="w-full border border-gray-200 rounded-lg px-5 py-3.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>

              <textarea
                rows="6"
                placeholder="Write Message"
                className="w-full border border-gray-200 rounded-lg px-5 py-4 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-y"
              />

              <button
                type="button"
                className="bg-[#6ab6e8] hover:bg-[#7356dd] text-gray-900 font-semibold text-sm px-8 py-3.5 rounded-full transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 bg-white">
        <Footer />
      </div>

    </section>
  );
}