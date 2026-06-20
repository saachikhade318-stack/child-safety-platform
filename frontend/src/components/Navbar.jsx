import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, HelpCircle, BellRing } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Awareness', href: '#timeline' },
    { name: 'Report', href: '#reporter' },
    { name: 'Safety Tips', href: '#education' },
    { name: 'NGOs', href: '#ngos' },
    { name: 'SafeNest AI', href: '#chatbot' }
  ];

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-out px-4 sm:px-6 lg:px-12 ${
      isScrolled 
        ? 'py-3 bg-navy-dark/80 backdrop-blur-lg border-b border-white/5 shadow-cyan-glow/5' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-glow-cyan to-glow-purple p-[1px] shadow-cyan-glow/20 group-hover:shadow-cyan-glow/40 transition-shadow">
            <div className="w-full h-full bg-navy-dark rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-glow-cyan group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-glow-cyan to-glow-purple opacity-20 blur-md rounded-xl group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="font-sans font-extrabold text-2xl tracking-wider text-white group-hover:text-glow-cyan transition-colors">
            SAFENEST
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="relative text-sm font-medium tracking-wide text-gray-300 hover:text-white transition-colors duration-300 py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-glow-cyan to-glow-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Quick Help & Alert Badge */}
        <div className="hidden md:flex items-center gap-4">
          <a 
            href="#emergency" 
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-glow-pink/30 hover:border-glow-pink bg-glow-pink/5 hover:bg-glow-pink/15 text-glow-pink text-sm font-semibold tracking-wider transition-all duration-300 hover:-translate-y-[2px]"
          >
            <BellRing className="w-4 h-4 animate-bounce" />
            EMERGENCY SOS
          </a>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      <div className={`md:hidden fixed inset-x-0 top-[65px] glass-panel-heavy border-b border-white/10 transition-all duration-500 ease-in-out ${
        isMobileMenuOpen ? 'max-h-screen opacity-100 py-6 px-6' : 'max-h-0 opacity-0 overflow-hidden py-0'
      }`}>
        <div className="flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-glow-cyan transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="h-[1px] bg-white/10 my-2"></div>
          <a 
            href="#emergency" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-glow-pink/10 border border-glow-pink/30 text-glow-pink font-semibold text-center transition-all hover:bg-glow-pink/20"
          >
            <BellRing className="w-5 h-5 animate-pulse" />
            EMERGENCY SOS
          </a>
        </div>
      </div>
    </nav>
  );
}
