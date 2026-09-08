import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUtils';

const VideoSection = ({ profile }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Check showOnHome setting from database profile
  const meetMeVideo = profile?.meetMeVideo;
  const showOnHome = meetMeVideo?.showOnHome !== undefined ? meetMeVideo.showOnHome : true;
  const videoUrl = getMediaUrl(meetMeVideo?.videoUrl);
  const thumbnailUrl = getMediaUrl(meetMeVideo?.thumbnailUrl, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80');

  // If Admin disables this section (showOnHome === false), do NOT render the section at all
  if (!showOnHome) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 md:py-16 border-t border-[#dce7fa] text-center space-y-3">
      
      {/* Blue Badge */}
      <span className="blue-pill-badge">
        Video Explanation Section
      </span>

      {/* Heading */}
      <h2 className="font-display text-[48px] sm:text-[60px] md:text-[70px] lg:text-[78px] font-normal text-[#1a1a1a] tracking-tight leading-none uppercase">
        MEET ME IN 2 MINUTES
      </h2>

      {/* Subtitle */}
      <p className="text-[13.5px] sm:text-[15px] text-[#666666] max-w-lg mx-auto leading-relaxed">
        Sometimes text isn't enough. Here's a quick video where I introduce myself, sharing my journey as a developer, and explain how I help clients turn ideas into reality.
      </p>

      {/* Video Screen Player Card matching reference (650-850px desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mt-4 w-full max-w-[820px] mx-auto rounded-3xl overflow-hidden aspect-video bg-[#0b0d13] border-4 border-white shadow-xl flex items-center justify-center group"
      >
        {isPlaying && videoUrl ? (
          <video
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
          >
            <source src={videoUrl} />
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <>
            <img
              src={thumbnailUrl}
              alt="Video preview thumbnail"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
            />

            {/* Central Play Button matching reference */}
            <button
              type="button"
              onClick={() => {
                if (videoUrl) {
                  setIsPlaying(true);
                } else {
                  alert('Video will be uploaded by the administrator soon!');
                }
              }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 cursor-pointer focus:outline-none"
              aria-label="Play Video"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#1a1a1a] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-[#1683FF] group-hover:text-white transition-all duration-200">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
              <span className="text-white text-sm sm:text-base font-semibold tracking-wider uppercase drop-shadow">
                Play Video
              </span>
            </button>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </>
        )}
      </motion.div>

    </section>
  );
};

export default VideoSection;
