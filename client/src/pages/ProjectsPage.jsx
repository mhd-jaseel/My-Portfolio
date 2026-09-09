import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import api from '../services/api';
import { ArrowRight, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeImage from '../components/SafeImage';

// In-memory cache to prevent refetching when navigating back and forth
let cachedProjects = null;
let cachedProfile = null;

const ProjectsPage = () => {
  const [projects, setProjects] = useState(cachedProjects || []);
  const [profile, setProfile] = useState(cachedProfile || null);
  const [loading, setLoading] = useState(!cachedProjects);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (signal) => {
    setError(null);
    if (!cachedProjects) {
      setLoading(true);
    }

    try {
      const [projRes, profRes] = await Promise.all([
        api.get('/projects', { signal }),
        cachedProfile ? Promise.resolve({ data: { data: cachedProfile } }) : api.get('/profile', { signal }).catch(() => ({ data: { data: null } })),
      ]);

      if (projRes.data?.data) {
        cachedProjects = projRes.data.data;
        setProjects(projRes.data.data);
      }
      if (profRes.data?.data) {
        cachedProfile = profRes.data.data;
        setProfile(profRes.data.data);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error('Failed to load projects:', err);
      if (!cachedProjects || cachedProjects.length === 0) {
        setError('Unable to load projects. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchData]);

  return (
    <div className="page-continuous-wrapper">
      <Navbar profile={profile} />

      <main className="pt-28 pb-16">
        {/* Header Banner */}
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

            {/* Error State with Retry Button */}
            {error && (
              <div className="my-10 p-8 rounded-3xl bg-[#f8fbff] border border-[#dce7fa] max-w-md mx-auto text-center space-y-4 shadow-xs">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <p className="text-sm font-semibold text-[#1a1a1a]">{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && !error && projects.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex flex-col space-y-4 animate-pulse">
                    <div className="rounded-3xl bg-[#f0f6ff] border border-[#dce7fa] aspect-[16/10] w-full" />
                    <div className="flex items-center justify-between px-1">
                      <div className="space-y-2 flex-1 mr-4">
                        <div className="h-5 bg-[#e2eeff] rounded-md w-1/2" />
                        <div className="h-3.5 bg-[#edf4ff] rounded-md w-3/4" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-[#f0f6ff] shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2-Column Grid */}
            {projects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {projects.map((project, index) => {
                  const isVaultCo = project.slug === 'vault-co' || project.title.toUpperCase().includes('VAULT');

                  return (
                    <motion.div
                      key={project._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      whileHover={{ y: -5 }}
                      className="group flex flex-col"
                    >
                      <Link
                        to={`/projects/${project.slug}`}
                        className="block relative rounded-3xl overflow-hidden bg-white border border-[#D6E3FC] shadow-lg shadow-[#A2B1FF]/10 aspect-[16/10] group-hover:shadow-xl transition-all duration-300"
                      >
                        <SafeImage
                          src={project.thumbnail}
                          alt={project.title}
                          aspectRatio="16/10"
                          width={600}
                          height={375}
                          rounded="rounded-3xl"
                          className="group-hover:scale-105 transition-transform duration-500 ease-out"
                          fallbackLabel={project.title || 'Project Preview'}
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
            )}

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

