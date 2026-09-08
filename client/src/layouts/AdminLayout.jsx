import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Code2, 
  Briefcase, 
  User, 
  MessageSquare, 
  Image as ImageIcon,
  ExternalLink,
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { showConfirm, toastSuccess } from '../utils/alertUtils';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Grouped Navigation for Clear Organization
  const navSections = [
    {
      title: null, // Top level
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'WEBSITE & PAGES',
      items: [
        { name: 'Profile & About', href: '/admin/profile', icon: User },
        { name: 'Work Experience', href: '/admin/experience', icon: Briefcase },
        { name: 'Inquiries', href: '/admin/messages', icon: MessageSquare },
      ],
    },
    {
      title: 'CONTENT & MEDIA',
      items: [
        { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
        { name: 'Skills & Tools', href: '/admin/skills', icon: Code2 },
        { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
      ],
    },
  ];

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: 'Sign Out?',
      text: 'Are you sure you want to log out of the admin panel?',
      confirmText: 'Sign Out',
      isDestructive: false,
    });

    if (!confirmed) return;

    await logout();
    toastSuccess('Logged out successfully.');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#1a1a1a] flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#e2e8f0] sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          {/* Geometric Monogram Logo */}
          <svg className="w-7 h-7 text-[#1a1a1a]" viewBox="0 0 40 40" fill="none">
            <path d="M 6 32 L 6 12 L 14.5 25 L 23 12 L 23 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 32 12 L 32 26 C 32 30 29.5 32.5 25.5 32.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 28.5 6.5 L 35.5 6.5" stroke="#1683FF" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-xs uppercase tracking-wider text-[#1a1a1a]">Admin Panel</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl bg-[#f0f6ff] text-[#1683FF] hover:bg-[#e0efff]"
          aria-label="Toggle Navigation"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileNavOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-[#e2e8f0] shrink-0 flex flex-col justify-between p-5 z-40`}
      >
        <div className="space-y-6">
          {/* Logo & Identity */}
          <div className="hidden md:flex items-center gap-3 pb-4 border-b border-[#edf2f7]">
            <svg className="w-9 h-9 text-[#1a1a1a]" viewBox="0 0 40 40" fill="none">
              <path d="M 6 32 L 6 12 L 14.5 25 L 23 12 L 23 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 32 12 L 32 26 C 32 30 29.5 32.5 25.5 32.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M 28.5 6.5 L 35.5 6.5" stroke="#1683FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div>
              <h2 className="text-sm font-bold text-[#1a1a1a] leading-tight">Mohammed Jaseel</h2>
              <span className="text-[11px] font-mono text-[#1683FF] font-semibold">Admin Panel</span>
            </div>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-5">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {section.title && (
                  <p className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8a99ad] mb-1.5">
                    {section.title}
                  </p>
                )}

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#1683FF] text-white shadow-md shadow-[#1683FF]/20'
                          : 'text-[#555555] hover:text-[#1683FF] hover:bg-[#f0f6ff]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 border-t border-[#edf2f7] space-y-1.5 mt-6">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-[#555555] hover:text-[#1683FF] hover:bg-[#f0f6ff] transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 min-h-screen bg-[#f8fbff] p-4 sm:p-7 lg:p-9 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
