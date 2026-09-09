import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';
import SkillIcon from './SkillIcon';

// Default categories ensure instant 0ms render without waiting for backend cold start
const defaultCategories = [
  {
    _id: 'c1',
    name: 'Frontend Development',
    slug: 'frontend',
    description: 'Crafting responsive, pixel-perfect user interfaces with modern reactive component architectures.',
    skills: [
      { name: 'React.js', icon: 'Atom' },
      { name: 'TypeScript', icon: 'FileCode2' },
      { name: 'JavaScript', icon: 'Code' },
      { name: 'Next.js', icon: 'Zap' },
      { name: 'Tailwind CSS', icon: 'Wind' },
    ]
  },
  {
    _id: 'c2',
    name: 'Backend Architecture',
    slug: 'backend',
    description: 'Developing scalable server-side architectures, RESTful APIs, and robust application services.',
    skills: [
      { name: 'Node.js', icon: 'Server' },
      { name: 'Express.js', icon: 'Cpu' },
      { name: 'REST API', icon: 'Globe' },
      { name: 'JWT', icon: 'Key' },
    ]
  },
  {
    _id: 'c3',
    name: 'Database Systems',
    slug: 'database',
    description: 'Managing flexible NoSQL and structured SQL database engines with transactional data integrity.',
    skills: [
      { name: 'MongoDB', icon: 'Database' },
      { name: 'PostgreSQL', icon: 'Layers' },
      { name: 'Mongoose', icon: 'FileSpreadsheet' },
      { name: 'Prisma', icon: 'Cpu' },
    ]
  },
  {
    _id: 'c4',
    name: 'Authentication & Security',
    slug: 'authentication',
    description: 'Implementing secure user authentication workflows, token validation, and granular authorization levels.',
    skills: [
      { name: 'JWT Authentication', icon: 'Key' },
      { name: 'Google OAuth', icon: 'UserCheck' },
      { name: 'Role Based Access Control', icon: 'Lock' },
    ]
  },
  {
    _id: 'c5',
    name: 'Payment & Commerce',
    slug: 'payments',
    description: 'Integrating reliable digital payment gateways, automated webhook reconciliation, and refund pipelines.',
    skills: [
      { name: 'Razorpay', icon: 'Zap' },
      { name: 'Stripe', icon: 'CreditCard' },
      { name: 'Payment Gateway Integration', icon: 'CreditCard' },
    ]
  }
];

const getInitialCategories = () => {
  try {
    const cached = localStorage.getItem('cached_toolbox_categories');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return defaultCategories;
};

const TechToolbox = () => {
  const [categories, setCategories] = useState(getInitialCategories);

  useEffect(() => {
    api.get('/skill-categories/home')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setCategories(res.data.data);
          try {
            localStorage.setItem('cached_toolbox_categories', JSON.stringify(res.data.data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Helper to render customized visual diagrams for categories with Admin-controlled dynamic icons
  const renderCategoryVisual = (catName, skills = []) => {
    const nameLower = (catName || '').toLowerCase();
    const activeSkills = (skills || []).filter(s => s.isActive !== false);

    // Fallback if no skills in category
    if (activeSkills.length === 0) {
      return (
        <div className="pt-3 pb-1 text-center text-[#8a99ad] text-xs italic">
          No tools added yet
        </div>
      );
    }

    const renderSkillBadge = (s, sizeClass = "w-9 h-9", textClass = "text-xs") => {
      if (!s) return null;
      return (
        <span 
          key={s._id || s.name}
          className={`${sizeClass} rounded-xl bg-[#f4f8ff] border border-[#dce7fa] flex items-center justify-center ${textClass} font-bold shadow-sm p-1 text-[#1683FF] hover:border-[#1683FF]/50 transition-colors overflow-hidden`} 
          title={s.name}
        >
          <SkillIcon icon={s.icon} name={s.name} className="w-4 h-4" />
        </span>
      );
    };

    if (nameLower.includes('frontend')) {
      const s1 = activeSkills[0]; // Left top (e.g. React)
      const s2 = activeSkills[1]; // Left bottom (e.g. TypeScript)
      const s3 = activeSkills[2]; // Center top (e.g. JavaScript)
      const s4 = activeSkills[3]; // Right top (e.g. Next.js)
      const s5 = activeSkills[4] || activeSkills[activeSkills.length - 1]; // Right bottom (e.g. Tailwind)

      return (
        <div className="relative pt-4 pb-2 w-full max-w-[320px] flex items-center justify-between pointer-events-none">
          {/* Left Column */}
          <div className="flex flex-col gap-5 z-10">
            {s1 ? renderSkillBadge(s1, "w-9 h-9") : <span className="w-9 h-9" />}
            {s2 ? renderSkillBadge(s2, "w-9 h-9") : <span className="w-9 h-9" />}
          </div>

          {/* Center Column with </> */}
          <div className="relative flex flex-col items-center z-10">
            {s3 ? (
              <span className="w-8 h-8 rounded-lg bg-[#f4f8ff] border border-[#dce7fa] flex items-center justify-center text-xs font-bold mb-2 shadow-sm p-1 text-[#1683FF] overflow-hidden" title={s3.name}>
                <SkillIcon icon={s3.icon} name={s3.name} className="w-3.5 h-3.5" />
              </span>
            ) : <span className="w-8 h-8 mb-2" />}
            <div className="w-14 h-14 rounded-2xl bg-[#f4f8ff] border-2 border-[#1683FF]/40 shadow-md shadow-[#1683FF]/15 flex items-center justify-center text-[#1683FF] font-mono text-lg font-bold">
              &lt;/&gt;
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 z-10">
            {s4 ? renderSkillBadge(s4, "w-9 h-9") : <span className="w-9 h-9" />}
            {s5 ? renderSkillBadge(s5, "w-9 h-9") : <span className="w-9 h-9" />}
          </div>

          {/* Connecting SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 120" fill="none">
            <path d="M 40 30 C 100 30, 120 70, 160 70" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M 40 90 C 100 90, 120 70, 160 70" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M 280 30 C 220 30, 200 70, 160 70" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.4" />
            <path d="M 280 90 C 220 90, 200 70, 160 70" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.4" />
          </svg>
        </div>
      );
    }

    if (nameLower.includes('database')) {
      const s1 = activeSkills[0]; // Left top (e.g. MongoDB)
      const s2 = activeSkills[1]; // Left bottom (e.g. PostgreSQL)
      const s3 = activeSkills[2]; // Right top (e.g. Prisma)
      const s4 = activeSkills[3] || activeSkills[activeSkills.length - 1]; // Right bottom (e.g. Mongoose)

      return (
        <div className="relative pt-4 pb-2 w-full max-w-[320px] flex items-center justify-between pointer-events-none">
          {/* Left Column */}
          <div className="flex flex-col gap-5 z-10">
            {s1 ? renderSkillBadge(s1, "w-9 h-9") : <span className="w-9 h-9" />}
            {s2 ? renderSkillBadge(s2, "w-9 h-9") : <span className="w-9 h-9" />}
          </div>

          {/* Center Column with Database Icon */}
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#f4f8ff] border-2 border-[#1683FF]/40 shadow-md shadow-[#1683FF]/15 flex flex-col items-center justify-center text-[#1683FF]">
              <span className="text-lg">🗄️</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 z-10">
            {s3 ? renderSkillBadge(s3, "w-9 h-9") : <span className="w-9 h-9" />}
            {s4 ? renderSkillBadge(s4, "w-9 h-9") : <span className="w-9 h-9" />}
          </div>

          {/* Connecting SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 120" fill="none">
            <path d="M 40 30 C 100 30, 120 60, 160 60" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.35" />
            <path d="M 40 90 C 100 90, 120 60, 160 60" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.35" />
            <path d="M 280 30 C 220 30, 200 60, 160 60" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.35" />
            <path d="M 280 90 C 220 90, 200 60, 160 60" stroke="#1683FF" strokeWidth="1.5" strokeOpacity="0.35" />
          </svg>
        </div>
      );
    }

    if (nameLower.includes('backend')) {
      return (
        <div className="pt-2 flex items-center justify-center gap-3 pointer-events-none">
          {activeSkills.slice(0, 2).map(s => renderSkillBadge(s, "w-9 h-9"))}
          <div className="w-10 h-10 rounded-xl bg-[#f4f8ff] border border-[#1683FF]/30 flex items-center justify-center text-[#1683FF] font-mono text-xs font-bold shadow-sm">
            &lt;/&gt;
          </div>
          {activeSkills.slice(2, 4).map(s => renderSkillBadge(s, "w-9 h-9"))}
        </div>
      );
    }

    if (nameLower.includes('auth')) {
      return (
        <div className="pt-2 flex items-center justify-center gap-3 pointer-events-none">
          {activeSkills.slice(0, 1).map(s => renderSkillBadge(s, "w-9 h-9"))}
          <div className="w-12 h-12 rounded-2xl bg-[#f4f8ff] border-2 border-[#1683FF]/40 shadow-sm flex items-center justify-center text-[#1683FF] text-xl">
            🔒
          </div>
          {activeSkills.slice(1, 3).map(s => renderSkillBadge(s, "w-9 h-9"))}
        </div>
      );
    }

    if (nameLower.includes('pay')) {
      return (
        <div className="pt-2 flex items-center justify-center gap-3 pointer-events-none">
          {activeSkills.slice(0, 1).map(s => renderSkillBadge(s, "w-9 h-9"))}
          <div className="w-10 h-10 rounded-xl bg-[#f4f8ff] border border-[#1683FF]/30 flex items-center justify-center text-[#1683FF] font-mono text-xs font-bold shadow-sm">
            $$
          </div>
          {activeSkills.slice(1, 3).map(s => renderSkillBadge(s, "w-9 h-9"))}
        </div>
      );
    }

    // Default icon badge row for other categories
    return (
      <div className="pt-2 flex items-center justify-center gap-2 pointer-events-none">
        {activeSkills.slice(0, 4).map(s => renderSkillBadge(s, "w-9 h-9"))}
      </div>
    );
  };

  // Split categories: top 2 larger, bottom rest
  const topCategories = categories.slice(0, 2);
  const bottomCategories = categories.slice(2);

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-[#dce7fa] text-center">
      
      {/* Header */}
      <div className="mb-8 space-y-2.5">
        <span className="blue-pill-badge">
          Skills &amp; Tech Stack
        </span>
        <h2 className="font-display text-[48px] sm:text-[60px] md:text-[70px] lg:text-[78px] font-normal text-[#1a1a1a] tracking-tight leading-none uppercase">
          MY TECH TOOLBOX
        </h2>
      </div>

      {/* Dynamic 2-Row / Multi-Row Grid */}
      <div className="space-y-6 w-full mx-auto">
        
        {/* Top Larger Cards */}
        {topCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topCategories.map((cat) => {
              const skillNames = (cat.skills || []).map(s => s.name).join(', ');

              return (
                <Link
                  key={cat._id}
                  to={`/skills/${cat.slug}`}
                  className="ref-toolbox-card p-8 sm:p-9 flex flex-col items-center text-center space-y-3 cursor-pointer group hover:-translate-y-1 transition-all"
                >
                  <h3 className="font-bold text-2xl sm:text-3xl text-[#1683FF] group-hover:text-[#0066e0] transition-colors">
                    {cat.name}
                  </h3>
                  
                  {skillNames && (
                    <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">
                      {skillNames}
                    </p>
                  )}

                  {cat.description && (
                    <p className="text-xs sm:text-sm text-[#666666] max-w-md">
                      {cat.description}
                    </p>
                  )}

                  {renderCategoryVisual(cat.name, cat.skills)}
                </Link>
              );
            })}
          </div>
        )}

        {/* Bottom Smaller Cards */}
        {bottomCategories.length > 0 && (
          <div className={`grid grid-cols-1 ${
            bottomCategories.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-6`}>
            {bottomCategories.map((cat) => {
              const skillNames = (cat.skills || []).map(s => s.name).join(', ');

              return (
                <Link
                  key={cat._id}
                  to={`/skills/${cat.slug}`}
                  className="ref-toolbox-card p-7 sm:p-8 flex flex-col items-center text-center space-y-3 cursor-pointer group hover:-translate-y-1 transition-all"
                >
                  <h3 className="font-bold text-xl sm:text-2xl text-[#1683FF] group-hover:text-[#0066e0] transition-colors">
                    {cat.name}
                  </h3>

                  {skillNames && (
                    <p className="text-sm sm:text-base font-semibold text-[#1a1a1a]">
                      {skillNames}
                    </p>
                  )}

                  {cat.description && (
                    <p className="text-xs text-[#666666]">
                      {cat.description}
                    </p>
                  )}

                  {renderCategoryVisual(cat.name, cat.skills)}
                </Link>
              );
            })}
          </div>
        )}

      </div>

      {/* VIEW MORE SKILLS BUTTON */}
      <div className="pt-10 flex justify-center">
        <Link
          to="/skills"
          className="btn-blue-pill flex items-center gap-2 group shadow-md shadow-[#1683FF]/20"
        >
          <span>VIEW MORE SKILLS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
};

export default TechToolbox;
