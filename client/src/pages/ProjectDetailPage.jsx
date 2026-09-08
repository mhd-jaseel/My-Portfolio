import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  Sparkles,
  Loader2 
} from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { getMediaUrl } from '../utils/mediaUtils';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjectAndProfile = async () => {
      try {
        const [projRes, profRes] = await Promise.all([
          api.get(`/projects/${slug}`),
          api.get('/profile').catch(() => ({ data: { data: null } })),
        ]);

        if (projRes.data?.data) {
          setProject(projRes.data.data);
        }
        if (profRes.data?.data) {
          setProfile(profRes.data.data);
        }
      } catch (err) {
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-4" />
        <p className="text-xs font-semibold tracking-widest uppercase">Loading Case Study...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#1a1a1a] px-4">
        <h2 className="text-3xl font-bold font-['Bebas_Neue'] text-[#1a1a1a] mb-2">Case Study Not Found</h2>
        <p className="text-sm text-[#667085] mb-6">The project you are looking for does not exist or has been moved.</p>
        <Link
          to="/projects"
          className="btn-blue-pill px-6 py-2.5 text-xs font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Projects</span>
        </Link>
      </div>
    );
  }

  const isVaultCo = project.slug === 'vault-co' || project.title.toUpperCase().includes('VAULT');

  return (
    <div className="page-continuous-wrapper">
      <Navbar profile={profile} />

      <main className="pt-28 pb-20">
        <div className="content-canvas">
          
          {/* Back Link */}
          <div className="mb-6">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#667085] hover:text-[#1683FF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all projects</span>
            </Link>
          </div>

          {/* Project Header */}
          <div className="space-y-4 mb-10 text-left">
            <div className="flex items-center gap-3">
              <span className="blue-pill-badge uppercase">
                {project.category}
              </span>
              {isVaultCo && (
                <span className="px-3.5 py-1 rounded-full bg-[#1683FF]/15 text-[#1a1a1a] border border-[#1683FF]/40 text-xs font-bold font-mono uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#1683FF]" />
                  <span>Flagship Platform</span>
                </span>
              )}
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-normal text-[#1a1a1a] font-['Bebas_Neue'] tracking-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-[#667085] font-normal max-w-3xl leading-relaxed">
              {project.description}
            </p>

            {/* Action Links */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white border border-[#C8D6FF] text-[#1a1a1a] hover:border-[#1683FF] hover:text-[#1683FF] text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>SOURCE CODE</span>
                </a>
              )}

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-blue-pill px-7 py-3 text-xs tracking-wider uppercase inline-flex items-center gap-2"
                >
                  <span>LIVE VIEW</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-3xl overflow-hidden border border-[#C8D6FF]/80 shadow-xl mb-14 aspect-[16/9] bg-white">
            <img
              src={getMediaUrl(project.thumbnail)}
              alt={project.title}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              width="1200"
              height="675"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* 2-Column Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Overview */}
              <div className="bg-white rounded-3xl border border-[#dce7fa] p-8 sm:p-10 space-y-4 shadow-sm">
                <h2 className="text-3xl font-normal text-[#1a1a1a] font-['Bebas_Neue'] tracking-tight flex items-center gap-2">
                  <span>SYSTEM OVERVIEW</span>
                </h2>
                <p className="text-[#667085] text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {project.detailedDescription || project.description}
                </p>
              </div>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div className="bg-white rounded-3xl border border-[#dce7fa] p-8 sm:p-10 space-y-5 shadow-sm">
                  <h2 className="text-3xl font-normal text-[#1a1a1a] font-['Bebas_Neue'] tracking-tight flex items-center gap-2">
                    <span>KEY TECHNICAL CAPABILITIES</span>
                  </h2>
                  <div className="space-y-3">
                    {project.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#1a1a1a]">
                        <div className="w-5 h-5 rounded-full bg-[#1683FF]/10 text-[#1683FF] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-relaxed text-[#667085]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges?.length > 0 || project.solutions?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.challenges?.length > 0 && (
                    <div className="p-7 rounded-3xl bg-white border border-[#dce7fa] shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>Challenges Overcome</span>
                      </div>
                      <ul className="space-y-2.5">
                        {project.challenges.map((c, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#444444] leading-relaxed flex items-start gap-2">
                            <span className="text-rose-400 font-bold shrink-0">&bull;</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions?.length > 0 && (
                    <div className="p-7 rounded-3xl bg-white border border-[#dce7fa] shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Architectural Solutions</span>
                      </div>
                      <ul className="space-y-2.5">
                        {project.solutions.map((s, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#444444] leading-relaxed flex items-start gap-2">
                            <span className="text-emerald-500 font-bold shrink-0">&bull;</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Visual Artifacts Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="space-y-5">
                  <h2 className="text-3xl font-normal text-[#1a1a1a] font-['Bebas_Neue']">
                    VISUAL ARTIFACTS &amp; FLOW
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((imgUrl, gIdx) => (
                      <div key={gIdx} className="rounded-2xl overflow-hidden border border-[#dce7fa] aspect-video bg-white shadow-md">
                        <img
                          src={getMediaUrl(imgUrl)}
                          alt={`${project.title} artifact ${gIdx + 1}`}
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl border border-[#dce7fa] p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#1683FF] mb-3">
                    Technologies Deployed
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-[#f4f8ff] text-[#1a1a1a] border border-[#dce7fa]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#dce7fa] space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#667085]">
                    Status
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Production Ready</span>
                  </div>
                </div>

                {project.liveUrl && (
                  <div className="pt-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-blue-pill w-full py-3 text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                    >
                      <span>Launch Live URL</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default ProjectDetailPage;
