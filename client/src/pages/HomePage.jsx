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

// High-speed static defaults ensure instant 0ms first render without waiting for backend
const defaultProfile = {
  name: 'MOHAMMED JASEEL',
  title: 'Full Stack Developer',
  bio: 'A Full Stack Developer who loves building modern web applications with scalable backends to deliver meaningful digital solutions.',
  profileImage: '',
  email: 'mohammejaseel90@gmail.com',
  github: 'https://github.com/mhd-jaseel',
  linkedin: 'https://linkedin.com/in/mohammed-jaseel90',
  aboutSection: {
    label: 'About Me',
    heading: 'EVERYTHING ABOUT\nMOHAMMED',
    paragraph1: 'Hi, Mohammed — a passionate Full Stack Developer who loves crafting modern web applications that are both beautiful on the surface and powerful under the hood.',
    paragraph2: 'With expertise in React, Next.js, Node.js, Express, and MongoDB, I bring together intuitive design and efficient functionality. My experience with authentication systems, payment gateways, and cloud deployment makes me confident in delivering production-ready solutions for real-world clients.',
    paragraph3: "Whether it's a Startup MVP or a scalable enterprise application, I focus on writing clean, maintainable code and creating experiences that users love.",
  },
  meetMeVideo: {
    showOnHome: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    videoUrl: ''
  }
};

const defaultProjects = [
  {
    _id: 'p1',
    title: 'DynaVue',
    slug: 'dynavue',
    category: 'Full Stack Portfolio & Booking Platform',
    thumbnail: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'Cloudinary']
  },
  {
    _id: 'p2',
    title: 'VAULT.CO',
    slug: 'vault-co',
    category: 'Production E-Commerce Platform',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay']
  },
  {
    _id: 'p3',
    title: 'Focus Flow',
    slug: 'focus-flow',
    category: 'Smart Productivity & Task Manager',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Redux Toolkit', 'Node.js', 'Express.js', 'MongoDB']
  },
  {
    _id: 'p4',
    title: 'KM Store',
    slug: 'km-store',
    category: 'Full-Stack Electronics E-Commerce',
    thumbnail: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
    technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Razorpay', 'Tailwind CSS']
  }
];

const getInitialProfile = () => {
  try {
    const cached = localStorage.getItem('cached_profile');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.profileImage && (parsed.profileImage.includes('developer_hero') || parsed.profileImage.includes('hero.png'))) {
        parsed.profileImage = '';
      }
      return parsed;
    }
  } catch (e) {}
  return defaultProfile;
};

const getInitialProjects = () => {
  try {
    const cached = localStorage.getItem('cached_projects_home');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return defaultProjects;
};

const HomePage = () => {
  const [profile, setProfile] = useState(getInitialProfile);
  const [projects, setProjects] = useState(getInitialProjects);

  useEffect(() => {
    // Non-blocking parallel background sync
    api.get('/profile')
      .then((res) => {
        if (res.data?.data) {
          setProfile(res.data.data);
          try {
            localStorage.setItem('cached_profile', JSON.stringify(res.data.data));
          } catch (e) {}
        }
      })
      .catch(() => {});

    api.get('/projects?homeOnly=true')
      .then((res) => {
        if (res.data?.data && res.data.data.length > 0) {
          setProjects(res.data.data);
          try {
            localStorage.setItem('cached_projects_home', JSON.stringify(res.data.data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

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
