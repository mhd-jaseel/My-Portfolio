import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Skills', href: '/skills' },
    { name: 'About Me', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.04] transition-all duration-200">
      <div className="content-canvas py-3.5 sm:py-4 grid grid-cols-3 items-center">
      
      {/* 1. Left: Minimal Monogram Logo "MJ" */}
      <div className="flex justify-start">
        <Link to="/" className="flex items-center gap-1 group">
          <svg className="w-8 h-8 sm:w-9 sm:h-9 text-[#1a1a1a]" viewBox="0 0 40 40" fill="none">
            {/* M: clean geometric strokes */}
            <path d="M 6 32 L 6 12 L 14.5 25 L 23 12 L 23 32" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
            {/* J: vertical stem with bottom curve */}
            <path d="M 32 12 L 32 26 C 32 30 29.5 32.5 25.5 32.5" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
            {/* Blue accent: directly above the central/top area of J */}
            <path d="M 28.5 6.5 L 35.5 6.5" stroke="#1683FF" strokeWidth="2.75" strokeLinecap="round" />
          </svg>
        </Link>
      </div>

      {/* 2. Center: Nav links horizontally centered with blue underline on active link */}
      <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-9">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.href;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={`relative text-[13.5px] font-medium tracking-normal transition-colors py-1 ${
                isActive ? 'text-[#1683FF] font-semibold' : 'text-[#1a1a1a]/85 hover:text-[#1683FF]'
              }`}
            >
              <span>{link.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNavTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1683FF] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Right: Pill Blue Button "LET'S TALK →" aligned right */}
      <div className="flex justify-end items-center">
        <a 
          href="https://wa.me/919846644092?text=Hi%20Jaseel%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden md:inline-flex btn-blue-pill-sm"
        >
          <span>Let's Talk</span>
          <ArrowRight className="w-3 h-3" />
        </a>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white border border-[#e5e7eb] text-[#1a1a1a]"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-[#e5e7eb] px-6 py-5 space-y-3 md:hidden z-50 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold text-[#1a1a1a] hover:text-[#1683FF] py-1"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              <a
                href="https://wa.me/919846644092?text=Hi%20Jaseel%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-blue-pill w-full justify-center"
              >
                <span>Let's Talk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
