import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import { Github, Linkedin, Whatsapp } from './SocialIcons';
import api from '../services/api';

const Footer = ({ profile: propProfile }) => {
  const [profile, setProfile] = useState(propProfile || null);

  useEffect(() => {
    if (propProfile) {
      setProfile(propProfile);
      return;
    }
    
    // Fetch profile fallback if not provided via props
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data?.data) {
          setProfile(res.data.data);
        }
      } catch (err) {
        // Silently use defaults if profile endpoint fails
      }
    };

    fetchProfile();
  }, [propProfile]);

  const email = profile?.email || 'mohammejaseel90@gmail.com';
  const phone = '9846644092';
  const githubUrl = profile?.github || 'https://github.com/mhd-jaseel';
  const linkedinUrl = profile?.linkedin || 'https://linkedin.com/in/mohammed-jaseel90';

  return (
    <footer className="w-full border-t border-[#e2e8f0] bg-white py-6 md:py-7">
      <div className="content-canvas space-y-4 md:space-y-5">
        
        {/* Top Row: MJ Logo (Left) & Contact Area (Right) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 md:pb-5 border-b border-[#edf2f7]">
          
          {/* Left: Geometric Monogram Logo "MJ" */}
          <div className="flex items-center">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity" title="Mohammed Jaseel">
              <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#1a1a1a]" viewBox="0 0 40 40" fill="none">
                {/* M: clean geometric strokes */}
                <path d="M 6 32 L 6 12 L 14.5 25 L 23 12 L 23 32" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                {/* J: vertical stem with bottom curve */}
                <path d="M 32 12 L 32 26 C 32 30 29.5 32.5 25.5 32.5" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
                {/* Blue accent: directly above the central/top area of J */}
                <path d="M 28.5 6.5 L 35.5 6.5" stroke="#1683FF" strokeWidth="2.75" strokeLinecap="round" />
              </svg>
            </Link>
          </div>

          {/* Right: Contact Area */}
          <div className="text-left sm:text-right space-y-1.5">
            <p className="text-sm sm:text-base font-bold text-[#1a1a1a] leading-tight">
              Is there a fascinating{' '}
              <span className="font-serif-italic font-normal text-base sm:text-lg">project</span> brewing in your mind?
            </p>

            <div className="flex flex-col sm:items-end gap-1 text-xs sm:text-sm font-medium">
              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-[#222222] hover:text-[#1683FF] transition-colors"
                title="Send Email"
              >
                <Mail className="w-3.5 h-3.5 text-[#1683FF] shrink-0" />
                <span>{email}</span>
              </a>

              {/* Phone · WhatsApp */}
              <div className="inline-flex items-center gap-2 text-[#222222]">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-[#1683FF] transition-colors"
                  title="Call Phone Number"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1683FF] shrink-0" />
                  <span>{phone}</span>
                </a>
                <span className="text-[#cbd5e1] text-xs">·</span>
                <a
                  href={`https://wa.me/91${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1683FF] hover:underline font-semibold"
                  title="Chat on WhatsApp"
                >
                  <Whatsapp className="w-3 h-3 text-[#1683FF]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row: Navigation (Left) & Copyright + Social Icons (Right) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-[13px] text-[#64748b]">
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 font-medium">
            <Link to="/" className="hover:text-[#1683FF] transition-colors">
              Home
            </Link>
            <Link to="/projects" className="hover:text-[#1683FF] transition-colors">
              Projects
            </Link>
            <Link to="/skills" className="hover:text-[#1683FF] transition-colors">
              Skills
            </Link>
            <Link to="/about" className="hover:text-[#1683FF] transition-colors">
              About Me
            </Link>
            <Link to="/contact" className="hover:text-[#1683FF] transition-colors">
              Contact
            </Link>
          </div>

          {/* Right: Copyright & Social Icons Group */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#64748b]">&copy; 2026 Mohammed Jaseel K</span>
            <div className="flex items-center gap-1.5">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="w-7 h-7 rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:text-[#1683FF] hover:border-[#1683FF] hover:bg-[#1683FF]/5 transition-all shadow-xs"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="w-7 h-7 rounded-full border border-[#e2e8f0] bg-white flex items-center justify-center text-[#64748b] hover:text-[#1683FF] hover:border-[#1683FF] hover:bg-[#1683FF]/5 transition-all shadow-xs"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
