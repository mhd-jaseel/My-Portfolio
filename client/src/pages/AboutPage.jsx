import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import PinkTechStrip from '../components/PinkTechStrip';
import VideoSection from '../components/VideoSection';
import ContactSection from '../components/ContactSection';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const AboutPage = () => {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [profRes, expRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: { data: null } })),
          api.get('/experience').catch(() => ({ data: { data: [] } })),
        ]);
        if (profRes.data?.data) setProfile(profRes.data.data);
        if (expRes.data?.data) setExperience(expRes.data.data);
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
        <p className="text-xs font-semibold tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="page-continuous-wrapper">
      <Navbar profile={profile} />

      <main className="pt-28 pb-16">
        {/* 1. Header Banner matching site standard */}
        <section className="pb-12 text-center">
          <div className="content-canvas space-y-3">
            <h1 className="font-display text-7xl sm:text-8xl lg:text-9xl font-normal text-[#1a1a1a] tracking-tight leading-none uppercase">
              ABOUT ME
            </h1>
            <p className="text-xs sm:text-sm text-[#555555] max-w-lg mx-auto leading-relaxed">
              I'm a Full Stack Developer passionate about crafting modern, scalable web applications with intuitive design and efficient architecture.
            </p>
          </div>
        </section>

        {/* 2. About Main Story: EVERYTHING ABOUT MOHAMMED with Technology Node Graphic in content-canvas */}
        <div className="content-canvas">
          <AboutSection profile={profile} hideButton={true} />
        </div>

        {/* 3. Experience 3-Column Table */}
        <div className="content-canvas">
          <ExperienceSection experience={experience} />
        </div>

        {/* 4. Blue Brand Strip matching reference */}
        <PinkTechStrip />

        {/* 5. Video Section ("Meet Me In 2 Minutes") */}
        <div className="content-canvas">
          <VideoSection profile={profile} />
        </div>

        {/* 6. Bottom CTA Block */}
        <div className="content-canvas">
          <ContactSection profile={profile} />
        </div>
      </main>

      {/* 7. Footer */}
      <Footer profile={profile} />
    </div>
  );
};

export default AboutPage;
