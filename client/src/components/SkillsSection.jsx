import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SkillIcon from './SkillIcon';

const SkillsSection = ({ skills = [] }) => {
  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Security', 'Database', 'DevOps', 'Tools'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <section className="py-20 lg:py-28 relative bg-[#EEF5FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <div className="blue-pill-badge uppercase">
            <span>TECHNICAL PROFICIENCY</span>
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1E1E1E] font-['Bebas_Neue'] tracking-tight">
            SKILLS &amp; TECHNOLOGIES
          </h2>
          <p className="text-sm text-[#667085] max-w-lg mx-auto font-normal">
            Dynamic skill stack loaded directly from MongoDB CMS with live categorization.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-1.5 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1683FF] text-white shadow-md shadow-[#1683FF]/25'
                    : 'bg-white text-[#1E1E1E] border border-[#C8D6FF] hover:border-[#1683FF]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compact White Rounded Skill Pills / Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredSkills.map((skill, idx) => {
            return (
              <motion.div
                key={skill._id || idx}
                whileHover={{ y: -3 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#C8D6FF]/70 shadow-sm shadow-[#9B8BFF]/5 hover:border-[#1683FF]/50 flex items-center gap-3 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-[#EEF5FF] text-[#1683FF] shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
                  <SkillIcon icon={skill.icon} name={skill.name} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#1E1E1E] truncate">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] text-[#1683FF] font-medium block">
                    {skill.category}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SkillsSection;
