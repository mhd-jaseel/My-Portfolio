import React from 'react';
import { ArrowRight } from 'lucide-react';

const ContactSection = ({ profile }) => {
  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 border-t border-[#dce7fa] text-center space-y-3">
      
      {/* Let's Build Something Amazing CTA Block */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal text-[#1a1a1a] leading-tight tracking-tight">
        <span className="font-['Poppins'] font-bold">Let's Build Something</span><br />
        <span className="font-serif-italic text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-normal text-[#1a1a1a] block mt-0.5">Amazing</span>
      </h2>
      
      <p className="text-[13.5px] sm:text-[15px] text-[#666666] max-w-md mx-auto leading-relaxed">
        Have a project idea, an open role, or collaboration in mind? Let's discuss it and create something impactful together.
      </p>

      <div className="pt-3">
        <a
          href="https://wa.me/919846644092?text=Hi%20Jaseel%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pink-pill"
        >
          <span>Let's Talk</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </section>
  );
};

export default ContactSection;
