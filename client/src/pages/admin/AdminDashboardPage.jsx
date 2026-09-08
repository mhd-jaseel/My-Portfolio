import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FolderKanban, 
  Code2, 
  Briefcase, 
  User, 
  MessageSquare, 
  ArrowUpRight, 
  Plus, 
  Loader2
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#666666]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
        <p className="text-xs font-semibold uppercase tracking-wider">Loading Dashboard...</p>
      </div>
    );
  }

  const counts = stats?.counts || { projects: 0, skills: 0, experience: 0, messages: 0 };
  const profile = stats?.profile;
  const recentProjects = stats?.recentProjects || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-7 sm:p-9 rounded-3xl bg-white border border-[#dce7fa] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f6ff] text-[#1683FF] text-xs font-semibold">
            <span>Welcome back 👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] max-w-xl leading-relaxed">
            Manage your public website content, projects, skills, and client inquiries from one clean control center.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/projects/new"
            className="px-5 py-2.5 rounded-full bg-[#1683FF] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#1371dc] transition-all flex items-center gap-2 shadow-md shadow-[#1683FF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Project</span>
          </Link>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Projects Card */}
        <Link
          to="/admin/projects"
          className="p-6 rounded-3xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-[#f0f6ff] text-[#1683FF]">
              <FolderKanban className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8a99ad] group-hover:text-[#1683FF] transition-colors" />
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{counts.projects}</p>
          <p className="text-xs text-[#666666] mt-1 font-semibold">Projects</p>
        </Link>

        {/* Skills Card */}
        <Link
          to="/admin/skills"
          className="p-6 rounded-3xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-[#f0f6ff] text-[#1683FF]">
              <Code2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8a99ad] group-hover:text-[#1683FF] transition-colors" />
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{counts.skills}</p>
          <p className="text-xs text-[#666666] mt-1 font-semibold">Skills &amp; Tools</p>
        </Link>

        {/* Experience Card */}
        <Link
          to="/admin/experience"
          className="p-6 rounded-3xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-[#f0f6ff] text-[#1683FF]">
              <Briefcase className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8a99ad] group-hover:text-[#1683FF] transition-colors" />
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{counts.experience}</p>
          <p className="text-xs text-[#666666] mt-1 font-semibold">Work Experience</p>
        </Link>

        {/* Inquiries Card */}
        <Link
          to="/admin/messages"
          className="p-6 rounded-3xl bg-white border border-[#dce7fa] hover:border-[#1683FF]/50 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-2xl bg-[#f0f6ff] text-[#1683FF]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#8a99ad] group-hover:text-[#1683FF] transition-colors" />
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{counts.messages}</p>
          <p className="text-xs text-[#666666] mt-1 font-semibold">Contact Messages</p>
        </Link>

      </div>

      {/* 2-Column Split: Active Profile & Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Status Card */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-[#dce7fa] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
              <User className="w-4 h-4 text-[#1683FF]" />
              <span>Website Identity</span>
            </h2>
            <Link
              to="/admin/profile"
              className="text-xs text-[#1683FF] hover:underline font-semibold"
            >
              Edit Profile
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <img
              src={profile?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'}
              alt={profile?.name}
              className="w-14 h-14 rounded-2xl object-cover border border-[#dce7fa]"
            />
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a]">{profile?.name}</h3>
              <p className="text-xs text-[#666666]">{profile?.title}</p>
              <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{profile?.availability || 'Available for opportunities'}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-[#edf2f7] text-xs text-[#555555]">
            <p className="truncate"><span className="font-semibold text-[#1a1a1a]">Email:</span> {profile?.email}</p>
            <p className="truncate"><span className="font-semibold text-[#1a1a1a]">GitHub:</span> {profile?.github}</p>
            <p className="truncate"><span className="font-semibold text-[#1a1a1a]">LinkedIn:</span> {profile?.linkedin}</p>
          </div>
        </div>

        {/* Recent Projects Card */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-[#dce7fa] shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1a1a1a] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#1683FF]" />
              <span>Recent Projects</span>
            </h2>
            <Link
              to="/admin/projects"
              className="text-xs text-[#1683FF] hover:underline font-semibold"
            >
              View All ({counts.projects})
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentProjects.length === 0 ? (
              <p className="text-xs text-[#888888] py-4 text-center">No projects published yet.</p>
            ) : (
              recentProjects.map((p, idx) => (
                <div
                  key={p._id || idx}
                  className="p-3 rounded-2xl bg-[#f8fbff] border border-[#dce7fa] hover:border-[#1683FF]/40 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-[#dce7fa]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#1a1a1a]">{p.title}</h4>
                        {p.showOnHome && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#1683FF]/10 text-[#1683FF] text-[9px] font-semibold">Home</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#666666] truncate max-w-[180px] sm:max-w-xs">{p.category}</p>
                    </div>
                  </div>

                  <Link
                    to={`/admin/projects/${p._id}/edit`}
                    className="px-3 py-1.5 rounded-full bg-white border border-[#dce7fa] hover:bg-[#f0f6ff] text-[#1683FF] text-xs font-semibold transition-all shadow-2xs"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
