import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = ({ profile, hideButton = false }) => {
  const about = profile?.aboutSection || {
    label: 'About Me',
    heading: 'EVERYTHING ABOUT\nMOHAMMED',
    paragraph1: 'Hi, Mohammed — a passionate Full Stack Developer who loves crafting modern web applications that are both beautiful on the surface and powerful under the hood.',
    paragraph2: 'With expertise in React, Next.js, Node.js, Express, and MongoDB, I bring together intuitive design and efficient functionality. My experience with authentication systems, payment gateways, and cloud deployment makes me confident in delivering production-ready solutions for real-world clients.',
    paragraph3: "Whether it's a Startup MVP or a scalable enterprise application, I focus on writing clean, maintainable code and creating experiences that users love.",
  };

  const headingLines = (about.heading || 'EVERYTHING ABOUT\nMOHAMMED').split('\n').filter(Boolean);

  return (
    <section id="about" className="py-8 sm:py-12 md:py-14 border-t border-[#dce7fa]/80 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        
        {/* Left Column: Pill Label, Heading, Compact Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-6 space-y-3.5 sm:space-y-4 text-left lg:pr-4"
        >
          {/* Small Pill-Shaped Outlined Label */}
          <span className="pink-pill-badge">
            {about.label || 'About Me'}
          </span>

          {/* Compact Tall Condensed Heading with multi-line support */}
          <h2 className="font-display text-[42px] sm:text-[52px] md:text-[60px] lg:text-[66px] font-normal text-[#111111] leading-[0.88] tracking-tight">
            {headingLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < headingLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h2>

          {/* Compact, Narrow Paragraphs */}
          <div className="space-y-2.5 text-[13px] sm:text-[14px] text-[#4a4a4a] leading-relaxed font-normal max-w-[440px]">
            {about.paragraph1 && <p>{about.paragraph1}</p>}
            {about.paragraph2 && <p>{about.paragraph2}</p>}
            {about.paragraph3 && <p>{about.paragraph3}</p>}
          </div>

          {/* Button rendered only when hideButton is false */}
          {!hideButton && (
            <div className="pt-1.5">
              <Link to="/about" className="btn-pink-pill-sm">
                <span>More About Me</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Right Column: Floating Developer & Network Illustration (Enlarged proportionally to balance left text block) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="lg:col-span-6 flex justify-center lg:justify-end items-center"
        >
          <div className="relative w-full max-w-[460px] sm:max-w-[510px] py-6 flex items-center justify-between">
            
            {/* 1. Central Floating Rounded Square with "</>" and soft blue glow */}
            <div className="relative z-20 flex items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/95 backdrop-blur-xs border border-[#1683FF]/40 shadow-lg shadow-[#1683FF]/15 flex items-center justify-center text-[#1683FF] font-mono text-2xl sm:text-3xl font-bold">
                &lt;/&gt;
              </div>
              {/* Soft ambient blue glow behind central box */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-radial from-[#1683FF]/20 to-transparent blur-xl pointer-events-none -z-10" />
            </div>

            {/* 2. Flowing Curved Connector Lines */}
            <svg className="w-28 sm:w-36 h-60 flex-1 mx-2 overflow-visible" viewBox="0 0 100 200" fill="none">
              {/* Subtle light blue branching connector lines */}
              <path d="M 0 100 C 45 100, 55 20, 100 20" stroke="#d5e6fb" strokeWidth="2" />
              <path d="M 0 100 C 45 100, 55 60, 100 60" stroke="#d5e6fb" strokeWidth="2" />
              <path d="M 0 100 C 50 100, 50 100, 100 100" stroke="#1683FF" strokeWidth="2.25" strokeOpacity="0.85" />
              <path d="M 0 100 C 45 100, 55 140, 100 140" stroke="#d5e6fb" strokeWidth="2" />
              <path d="M 0 100 C 45 100, 55 180, 100 180" stroke="#d5e6fb" strokeWidth="2" />

              {/* Decorative blue accent curve pulse */}
              <path d="M -40 100 C -20 100, -10 45, 0 100" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="3 3" />
            </svg>

            {/* 3. Vertically Stacked Technology Badges with recognizable brand colors */}
            <div className="flex flex-col gap-3 z-20">
              {/* React (React blue) */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 border border-[#dce7fa] shadow-xs flex items-center justify-center text-sky-500 font-bold text-base sm:text-lg hover:border-[#1683FF]/60 transition-colors" title="React">
                ⚛
              </div>
              {/* Node.js (Brand Green) */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 border border-[#dce7fa] shadow-xs flex items-center justify-center text-emerald-600 font-bold text-sm sm:text-base hover:border-[#1683FF]/60 transition-colors" title="Node.js">
                ⬡
              </div>
              {/* JavaScript (Brand Yellow/Orange) */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 border border-[#dce7fa] shadow-xs flex items-center justify-center text-amber-500 font-mono font-bold text-xs sm:text-sm hover:border-[#1683FF]/60 transition-colors" title="JavaScript">
                JS
              </div>
              {/* Express.js (Dark neutral) */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 border border-[#dce7fa] shadow-xs flex items-center justify-center text-slate-800 font-mono font-bold text-xs sm:text-sm hover:border-[#1683FF]/60 transition-colors" title="Express.js">
                ex
              </div>
              {/* Next.js (Black neutral) */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/95 border border-[#dce7fa] shadow-xs flex items-center justify-center text-[#111111] font-bold text-xs sm:text-sm hover:border-[#1683FF]/60 transition-colors" title="Next.js">
                ▲
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;
