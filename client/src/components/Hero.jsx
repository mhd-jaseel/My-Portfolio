import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = ({ profile }) => {
  const profileImg = profile?.profileImage || '/developer_hero.jpg';
  const name = profile?.name || 'MOHAMMED JASEEL';
  const bio = profile?.bio || 'A Full Stack Developer who loves building modern web applications with scalable backends to deliver meaningful digital solutions.';

  return (
    <section className="relative w-full pt-20 sm:pt-24 md:pt-28 pb-14 sm:pb-16 lg:pb-20 overflow-hidden flex flex-col justify-center bg-white">
      
      {/* Subtle Pure White Ambient Glow Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-white">
        {/* Soft Ambient Glow behind Center Portrait */}
        <div 
          className="absolute top-[20%] right-[15%] lg:right-[22%] w-[450px] lg:w-[600px] h-[450px] lg:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 32, 196, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* 
        COMPACT ASYMMETRICAL EDITORIAL COMPOSITION (3 Visual Zones):
        - LEFT: Compact condensed name (I AM MOHAMMED JASEEL) + tight bio + dual CTA buttons
        - CENTER: Balanced, proportional portrait emerging from sky clouds
        - RIGHT: "A WEB </> DEVELOPER" scaled down to match reference
      */}
      <div className="content-canvas relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-3 items-center min-h-[62vh] lg:min-h-[68vh]">
          
          {/* 1. LEFT ZONE: I AM MOHAMMED JASEEL + Bio + Buttons (Occupies ~35% width on desktop) */}
          <div className="lg:col-span-4 z-20 text-left space-y-4 sm:space-y-5 lg:pr-2">
            
            {/* Condensed Display Heading (Proportionate, compact scale) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <h1 className="font-display text-[58px] sm:text-[70px] md:text-[78px] lg:text-[86px] xl:text-[94px] font-normal leading-[0.84] text-[#111111] tracking-tight">
                I AM<br />
                MOHAMMED<br />
                JASEEL
              </h1>
            </motion.div>

            {/* Concise Bio with tight line-height and narrow width */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="text-[13.5px] sm:text-[14.5px] text-[#333333] leading-relaxed max-w-[340px] font-normal"
            >
              {bio}
            </motion.p>

            {/* Dual CTA Buttons on Same Row on Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="pt-1 flex flex-wrap items-center gap-3"
            >
              {/* Primary: LET'S WORK TOGETHER → */}
              <a 
                href="https://wa.me/919846644092?text=Hi%20Jaseel%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-blue-pill"
              >
                <span>Let's Work Together</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Secondary: ABOUT ME */}
              <a 
                href="#about" 
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white/80 hover:bg-white border border-[#1683FF]/40 hover:border-[#1683FF] text-[#1683FF] text-[12px] font-bold tracking-wide transition-all shadow-xs"
              >
                About Me
              </a>
            </motion.div>
          </div>

          {/* 2. CENTER ZONE: PROPORTIONAL BALANCED PORTRAIT (~35-40% width, seamless cloud blend) */}
          <div className="lg:col-span-5 relative z-10 flex justify-center items-center my-2 lg:my-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="relative w-full max-w-[340px] sm:max-w-[390px] lg:max-w-[430px] flex justify-center pointer-events-none select-none"
            >
              {/* Masked image container with soft curved/rounded outer shape and gentle bottom fade */}
              <div 
                className="w-full overflow-hidden"
                style={{
                  WebkitMaskImage: `
                    radial-gradient(ellipse 96% 94% at 50% 42%, black 64%, rgba(0,0,0,0.85) 78%, rgba(0,0,0,0.3) 90%, transparent 100%),
                    linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.7) 76%, rgba(0,0,0,0.15) 90%, transparent 100%)
                  `,
                  maskImage: `
                    radial-gradient(ellipse 96% 94% at 50% 42%, black 64%, rgba(0,0,0,0.85) 78%, rgba(0,0,0,0.3) 90%, transparent 100%),
                    linear-gradient(to bottom, black 0%, black 58%, rgba(0,0,0,0.7) 76%, rgba(0,0,0,0.15) 90%, transparent 100%)
                  `,
                  WebkitMaskComposite: 'source-in',
                  maskComposite: 'intersect',
                }}
              >
                <img
                  src={profileImg}
                  alt={name}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  width="430"
                  height="520"
                  className="w-full h-auto max-h-[64vh] object-contain object-top mix-blend-multiply contrast-[1.02] brightness-[1.01]"
                />
              </div>
            </motion.div>
          </div>

          {/* 3. RIGHT ZONE: A WEB </> DEVELOPER (Scaled down, elegantly positioned beside portrait) */}
          <div className="lg:col-span-3 z-20 text-left lg:pl-3 flex justify-start items-center">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-col items-start"
            >
              <div className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-[52px] xl:text-[62px] text-[#111111] leading-[0.88] flex items-center gap-1.5">
                <span>A WEB</span>
                <span className="text-[#1683FF] font-mono text-xl sm:text-2xl lg:text-[32px] font-bold">&lt;/&gt;</span>
              </div>
              <div className="font-display text-3xl sm:text-4xl md:text-4xl lg:text-[52px] xl:text-[62px] text-[#111111] leading-[0.88]">
                DEVELOPER
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
