import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import api from '../services/api';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [projRes, profRes] = await Promise.all([
          api.get('/projects'),
          api.get('/profile').catch(() => ({ data: { data: null } })),
        ]);
        if (projRes.data?.data) setProjects(projRes.data.data);
        if (profRes.data?.data) setProfile(profRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-4" />
        <p className="text-xs font-semibold tracking-widest uppercase">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="page-continuous-wrapper">
      <Navbar profile={profile} />

      <main className="pt-28 pb-16">
        {/* Header Banner matching reference Projects Page screenshot */}
        <section className="pb-12 text-center">
          <div className="content-canvas space-y-3">
            <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl font-normal text-[#1a1a1a] tracking-tight leading-none uppercase">
              PROJECTS
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] max-w-md mx-auto">
              Turn Your Vision Into an Experience That Lasts
            </p>
          </div>
        </section>

        {/* Featured Section Header */}
        <section className="py-8">
          <div className="content-canvas">
            
            <div className="text-center mb-12 space-y-3">
              <span className="blue-pill-badge">
                Featured Projects
              </span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#1a1a1a] tracking-tight">
                DESIGN BRANDS THAT SPEAK TO AUDIENCES
              </h2>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {projects.map((project, index) => {
                const isVaultCo = project.slug === 'vault-co' || project.title.toUpperCase().includes('VAULT');

                return (
                  <motion.div
                    key={project._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -5 }}
                    className="group flex flex-col"
                  >
                    <Link
                      to={`/projects/${project.slug}`}
                      className="block relative rounded-3xl overflow-hidden bg-white border border-[#D6E3FC] shadow-lg shadow-[#A2B1FF]/10 aspect-[16/10] group-hover:shadow-xl transition-all duration-300"
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="375"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {isVaultCo && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[10px] font-mono font-bold text-[#1683FF] border border-[#1683FF]/40 shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>FLAGSHIP PLATFORM</span>
                        </div>
                      )}
                    </Link>

                    <div className="flex items-center justify-between pt-4 px-1">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] group-hover:text-[#1683FF] transition-colors flex items-center gap-2">
                          <span>{project.title}</span>
                          <span className="text-xs font-normal text-[#666666]">
                            ({project.category})
                          </span>
                        </h3>
                        <p className="text-xs text-[#888888] mt-1 font-mono">
                          {project.technologies?.slice(0, 5).join(', ')}
                        </p>
                      </div>

                      <Link
                        to={`/projects/${project.slug}`}
                        className="w-10 h-10 rounded-full bg-white border border-[#D6E3FC] flex items-center justify-center text-[#1a1a1a] group-hover:bg-[#1683FF] group-hover:text-white group-hover:border-[#1683FF] transition-all shadow-sm"
                        aria-label={`View ${project.title}`}
                      >
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Bottom CTA Block */}
        <div className="content-canvas">
          <ContactSection profile={profile} />
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default ProjectsPage;
