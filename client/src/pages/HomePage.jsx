import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import TechToolbox from '../components/TechToolbox';
import PinkTechStrip from '../components/PinkTechStrip';
import ProjectsSection from '../components/ProjectsSection';
import VideoSection from '../components/VideoSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [profRes, projRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: { data: null } })),
          api.get('/projects?homeOnly=true').catch(() => ({ data: { data: [] } })),
        ]);

        if (profRes.data?.data) setProfile(profRes.data.data);
        if (projRes.data?.data) setProjects(projRes.data.data);
      } catch (err) {
        console.error('Failed to load portfolio data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#1a1a1a]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-4" />
        <p className="text-xs font-semibold tracking-widest uppercase">Loading Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="page-continuous-wrapper">
      
      {/* 1. Header / Navigation (Fixed) */}
      <Navbar />

      {/* 2. Full-Width Hero Section */}
      <Hero profile={profile} />

      <main>
        {/* 3. About Me Section: EVERYTHING ABOUT MOHAMMED JASEEL + Node Graphic */}
        <div className="content-canvas">
          <AboutSection profile={profile} />
        </div>

        {/* 4. Tech Toolbox: 2 Top Larger + 3 Bottom Smaller Cards */}
        <div className="content-canvas">
          <TechToolbox />
        </div>

        {/* 5. Pink Technology Strip - Full Width Strip */}
        <PinkTechStrip />

        {/* 6. Featured Projects: DESIGN BRANDS THAT SPEAK TO AUDIENCES */}
        <div className="content-canvas">
          <ProjectsSection projects={projects} />
        </div>

        {/* 7. Video Section: MEET ME IN 2 MINUTES */}
        <div className="content-canvas">
          <VideoSection profile={profile} />
        </div>

        {/* 8. Final CTA: Let's Build Something Amazing */}
        <div className="content-canvas">
          <ContactSection profile={profile} />
        </div>
      </main>

      {/* 9. Footer */}
      <Footer profile={profile} />

    </div>
  );
};

export default HomePage;
