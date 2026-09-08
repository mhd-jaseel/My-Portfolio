import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import api from '../services/api';

const ContactPage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get('/profile').then((res) => {
      if (res.data?.data) setProfile(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="page-continuous-wrapper flex flex-col justify-between min-h-screen">
      <Navbar profile={profile} />
      
      <main className="pt-28 pb-12 flex-grow">
        {/* Header Banner */}
        <section className="pb-6 text-center">
          <div className="content-canvas space-y-2">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-normal text-[#1a1a1a] font-['Bebas_Neue'] tracking-tight">
              CONTACT
            </h1>
            <p className="text-sm sm:text-base text-[#667085] max-w-md mx-auto">
              Let's Start a Conversation About Your Next Project
            </p>
          </div>
        </section>

        <div className="content-canvas">
          <ContactSection profile={profile} />
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
};

export default ContactPage;
