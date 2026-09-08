import React from 'react';
import { 
  Code, FileCode2, Layout, Palette, Atom, Zap, Compass, Wind, Box, Sparkles,
  Layers, Radio, Smartphone, Server, Cpu, Globe, Grid, Sliders, Key, Webhook,
  ShieldCheck, UserCheck, Lock, KeyRound, Shield, Gauge, Database, FileSpreadsheet,
  Filter, TrendingUp, Cloud, Network, LockKeyhole, Container, GitBranch,
  GitCommit, Send, Terminal, UploadCloud, Triangle, Flame, Image as ImageIcon,
  CreditCard, FileText
} from 'lucide-react';
import { getMediaUrl } from '../utils/mediaUtils';

const lucideIconMap = {
  Code, FileCode2, Layout, Palette, Atom, Zap, Compass, Wind, Box, Sparkles,
  Layers, Radio, Smartphone, Server, Cpu, Globe, Grid, Sliders, Key, Webhook,
  ShieldCheck, UserCheck, Lock, KeyRound, Shield, Gauge, Database, FileSpreadsheet,
  Filter, TrendingUp, Cloud, Network, LockKeyhole, Container, GitBranch,
  GitCommit, Send, Terminal, UploadCloud, Triangle, Flame, Image: ImageIcon,
  CreditCard, FileText, GitPullRequest: GitBranch
};

/**
 * Robust SkillIcon component
 * Automatically handles:
 * 1. Admin uploaded image URLs (HTTP / HTTPS / /uploads path)
 * 2. Lucide icon name matching (Atom, Server, Database, etc.)
 * 3. Specific tech brand fallbacks (React, TS, JS, Tailwind, Node, MongoDB, etc.)
 * 4. Safe default code fallback
 */
const SkillIcon = ({ icon, name = '', className = 'w-4 h-4', imgClassName = 'w-full h-full object-contain' }) => {
  const iconStr = (icon || '').trim();
  const nameLower = (name || '').toLowerCase();

  // 1. Uploaded Image / SVG URL
  if (
    iconStr.startsWith('http://') || 
    iconStr.startsWith('https://') || 
    iconStr.startsWith('/uploads') || 
    iconStr.startsWith('uploads/') || 
    iconStr.startsWith('data:image') ||
    iconStr.includes('/')
  ) {
    return (
      <img
        src={getMediaUrl(iconStr)}
        alt={name || 'Skill icon'}
        className={`${imgClassName} shrink-0`}
        loading="lazy"
        onError={(e) => {
          // If image fails to load, fallback gracefully
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  // 2. Exact Lucide Icon Match
  if (iconStr && lucideIconMap[iconStr]) {
    const LucideComponent = lucideIconMap[iconStr];
    return <LucideComponent className={className} />;
  }

  // 3. Name-based or icon-based smart tech matching
  if (nameLower.includes('react') || iconStr.toLowerCase() === 'atom') {
    return <span className="font-bold text-sky-500 text-xs select-none">⚛</span>;
  }
  if (nameLower.includes('javascript') || nameLower === 'js') {
    return <span className="font-bold text-amber-500 text-xs select-none">JS</span>;
  }
  if (nameLower.includes('typescript') || nameLower === 'ts') {
    return <span className="font-bold text-blue-600 text-xs select-none">TS</span>;
  }
  if (nameLower.includes('tailwind') || iconStr.toLowerCase() === 'wind') {
    return <span className="text-teal-500 text-xs select-none">💨</span>;
  }
  if (nameLower.includes('next') || iconStr.toLowerCase() === 'triangle' || iconStr.toLowerCase() === 'vercel') {
    return <span className="font-bold text-[#1a1a1a] text-xs select-none">▲</span>;
  }
  if (nameLower.includes('mongo') || iconStr.toLowerCase() === 'database') {
    return <span className="text-emerald-600 text-xs select-none">🍃</span>;
  }
  if (nameLower.includes('postgre') || nameLower.includes('sql')) {
    return <span className="text-blue-600 text-xs select-none">🐘</span>;
  }
  if (nameLower.includes('figma')) {
    return <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-purple-400 inline-block shrink-0 shadow-xs" />;
  }
  if (nameLower.includes('git') || nameLower.includes('github')) {
    return <span className="font-bold text-[#1a1a1a] text-[10px] select-none">GH</span>;
  }
  if (nameLower.includes('postman') || iconStr.toLowerCase() === 'send') {
    return <span className="text-xs select-none">🚀</span>;
  }
  if (nameLower.includes('firebase') || iconStr.toLowerCase() === 'flame') {
    return <span className="text-xs select-none">🔥</span>;
  }
  if (nameLower.includes('node') || iconStr.toLowerCase() === 'server') {
    return <span className="font-bold text-emerald-600 text-xs select-none">⬡</span>;
  }

  // 4. Safe Default Fallback
  return <Code className={className} />;
};

export default SkillIcon;
