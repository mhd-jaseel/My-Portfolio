import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../utils/mediaUtils';

const ProjectsSection = ({ projects = [] }) => {
  // Display only the first 4 projects on Home page
  const displayProjects = projects.slice(0, 4);

  if (!displayProjects || displayProjects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-10 sm:py-14 md:py-16 text-center">
      
      {/* Header matching reference */}
      <div className="mb-8 space-y-2.5">
        <span className="blue-pill-badge">
          Featured Projects
        </span>
        <h2 className="font-display text-[48px] sm:text-[60px] md:text-[70px] lg:text-[78px] font-normal text-[#1a1a1a] tracking-tight leading-none">
          DESIGN BRANDS THAT SPEAK TO AUDIENCES
        </h2>
      </div>

      {/* 2-Column Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 w-full mx-auto text-left">
        {displayProjects.map((project, index) => (
          <motion.div
            key={project._id || project.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group flex flex-col"
          >
            {/* Project Image Card */}
            <Link
              to={`/projects/${project.slug}`}
              className="block relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#dce7fa] shadow-sm aspect-[16/9] group-hover:shadow-lg transition-all duration-300"
            >
              <img
                src={getMediaUrl(project.thumbnail)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                width="600"
                height="338"
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500 ease-out"
              />
            </Link>

            {/* Title (Category) + Link Arrow */}
            <div className="flex items-center justify-between pt-4 px-1">
              <div className="min-w-0 pr-3">
                <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] group-hover:text-[#1683FF] transition-colors truncate">
                  <span>{project.title}</span>
                  <span className="font-normal text-[#666666] ml-2 text-sm sm:text-base">
                    ({project.category})
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] font-mono mt-1 truncate">
                  {project.technologies?.slice(0, 4).join(', ')}
                </p>
              </div>

              <Link
                to={`/projects/${project.slug}`}
                className="text-[#1a1a1a] hover:text-[#1683FF] transition-colors p-2 shrink-0 bg-[#f4f8ff] group-hover:bg-[#1683FF] group-hover:text-white rounded-full transition-all"
                aria-label={`View ${project.title}`}
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* LOAD MORE -> button linking to /projects */}
      <div className="text-center mt-12 sm:mt-14">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1683FF] text-[#1683FF] bg-[#1683FF]/5 hover:bg-[#1683FF] hover:text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md group"
        >
          <span>LOAD MORE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </section>
  );
};

export default ProjectsSection;
