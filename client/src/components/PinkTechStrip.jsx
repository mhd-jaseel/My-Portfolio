import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { getMediaUrl } from '../utils/mediaUtils';

const PinkTechStrip = () => {
  const [tools, setTools] = useState([]);

  // Fallback tools matching existing static items if API is empty
  const defaultTools = [
    { _id: '1', name: 'Figma', icon: 'Figma' },
    { _id: '2', name: 'Vercel', icon: 'Triangle' },
    { _id: '3', name: 'GitHub', icon: 'GitPullRequest' },
    { _id: '4', name: 'Netlify', icon: 'Globe' },
    { _id: '5', name: 'Postman', icon: 'Send' },
    { _id: '6', name: 'VS Code', icon: 'Code' },
    { _id: '7', name: 'Firebase', icon: 'Flame' },
    { _id: '8', name: 'Render', icon: 'UploadCloud' },
  ];

  useEffect(() => {
    const fetchMarqueeTools = async () => {
      try {
        const res = await api.get('/marquee-tools');
        if (res.data?.data && res.data.data.length > 0) {
          setTools(res.data.data);
        } else {
          setTools(defaultTools);
        }
      } catch (err) {
        console.error('Failed to load marquee tools', err);
        setTools(defaultTools);
      }
    };

    fetchMarqueeTools();
  }, []);

  const items = tools.length > 0 ? tools : defaultTools;

  // Helper to render tool icon based on icon string or uploaded image
  const renderToolIcon = (tool) => {
    const iconStr = (tool.icon || '').trim();
    const nameLower = (tool.name || '').toLowerCase();

    // If it's an uploaded image URL (starts with http or / or uploads/)
    if (iconStr.startsWith('http://') || iconStr.startsWith('https://') || iconStr.startsWith('/') || iconStr.startsWith('uploads/')) {
      const resolved = getMediaUrl(iconStr, '');
      if (resolved) {
        return (
          <img
            src={resolved}
            alt={tool.name}
            loading="lazy"
            decoding="async"
            width="16"
            height="16"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-4 h-4 object-contain brightness-0 invert inline-block shrink-0"
          />
        );
      }
    }

    if (nameLower.includes('figma') || iconStr.toLowerCase() === 'figma') {
      return <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-r from-red-400 to-purple-400 inline-block shrink-0 shadow-xs" />;
    }

    if (nameLower.includes('vercel') || iconStr.toLowerCase() === 'triangle' || iconStr.toLowerCase() === 'vercel') {
      return <span className="text-base leading-none font-bold">▲</span>;
    }

    if (nameLower.includes('github') || iconStr.toLowerCase() === 'github' || iconStr.toLowerCase() === 'gitpullrequest') {
      return <span className="text-sm font-bold tracking-wider">GH</span>;
    }

    if (nameLower.includes('netlify') || iconStr.toLowerCase() === 'netlify' || iconStr.toLowerCase() === 'globe') {
      return <span className="text-xs opacity-75">🌐</span>;
    }

    if (nameLower.includes('postman') || iconStr.toLowerCase() === 'send') {
      return <span className="text-xs">🚀</span>;
    }

    if (nameLower.includes('vscode') || nameLower.includes('vs code') || iconStr.toLowerCase() === 'code') {
      return <span className="font-mono text-xs font-bold">&lt;/&gt;</span>;
    }

    if (nameLower.includes('firebase') || iconStr.toLowerCase() === 'flame') {
      return <span className="text-xs">🔥</span>;
    }

    if (nameLower.includes('render') || iconStr.toLowerCase() === 'uploadcloud' || iconStr.toLowerCase() === 'cloud') {
      return <span className="text-xs">☁️</span>;
    }

    // Default icon pill
    return <span className="w-2.5 h-2.5 rounded-full bg-white/70 inline-block shrink-0" />;
  };

  return (
    <div className="w-full bg-[#1683FF] py-4 sm:py-5 text-white select-none shadow-xs overflow-hidden relative">

      {/* Continuous Right to Left Moving Track */}
      <div className="animate-marquee-track flex items-center">

        {/* First Set of Items */}
        <div className="flex items-center gap-10 sm:gap-16 shrink-0 px-6 sm:px-10">
          {items.map((tool, idx) => (
            <div
              key={`tool-1-${tool._id || idx}`}
              className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm whitespace-nowrap tracking-wide hover:opacity-90 transition-opacity"
            >
              {renderToolIcon(tool)}
              <span>{tool.name}</span>
            </div>
          ))}
        </div>

        {/* Duplicate Set for Infinite Seamless Loop */}
        <div className="flex items-center gap-10 sm:gap-16 shrink-0 px-6 sm:px-10" aria-hidden="true">
          {items.map((tool, idx) => (
            <div
              key={`tool-2-${tool._id || idx}`}
              className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm whitespace-nowrap tracking-wide hover:opacity-90 transition-opacity"
            >
              {renderToolIcon(tool)}
              <span>{tool.name}</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default PinkTechStrip;
