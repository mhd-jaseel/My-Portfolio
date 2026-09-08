import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = ({ experience = [] }) => {
  // Default fallback matching existing data if database is temporarily empty
  const defaultItems = [
    { _id: '1', company: 'FUTURE BY CATALYST', position: 'FULL STACK DEVELOPER (MERN)', duration: '2025 – PRESENT' },
    { _id: '2', company: 'ENTERPRISE E-COMMERCE', position: 'SYSTEM ARCHITECT & DEV', duration: '2025' },
    { _id: '3', company: 'REAL-TIME BOOKING CMS', position: 'FULL STACK ENGINEER', duration: '2024 – 2025' },
  ];

  const items = experience && experience.length > 0 ? experience : defaultItems;

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header: WORK EXPERIENCE with no year label above */}
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="font-display text-6xl sm:text-7xl lg:text-[5.5rem] font-normal text-[#111111] tracking-tight leading-none">
            WORK EXPERIENCE
          </h2>
        </div>

        {/* Clean 3-Column Table: Company | Role | Duration */}
        <div className="border-t border-b border-[#D6E3FC] divide-y divide-[#D6E3FC]">
          {items.map((exp) => {
            const durationText = exp.duration || (exp.startDate ? `${exp.startDate}${exp.endDate ? ` – ${exp.endDate}` : ''}` : '2025 – PRESENT');
            return (
              <div 
                key={exp._id}
                className="py-5 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 items-center text-xs sm:text-sm font-bold tracking-wider text-[#111111] uppercase"
              >
                <div className="text-left font-bold text-[#111111]">
                  {exp.company}
                </div>
                <div className="text-left md:text-center text-[#555555] font-semibold">
                  {exp.position}
                </div>
                <div className="text-left md:text-right text-[#777777] font-medium font-mono text-[11.5px] sm:text-xs">
                  {durationText}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
