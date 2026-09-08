import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import AdminRoute from './components/AdminRoute';
import { Loader2 } from 'lucide-react';

import ErrorBoundary from './components/ErrorBoundary';

// Eager load critical home page for zero-delay first paint
import HomePage from './pages/HomePage';

// Lazy load other public pages on demand
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const SkillCategoryDetailPage = lazy(() => import('./pages/SkillCategoryDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

// Lazy load private admin pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminProfilePage = lazy(() => import('./pages/admin/AdminProfilePage'));
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'));
const AdminProjectFormPage = lazy(() => import('./pages/admin/AdminProjectFormPage'));
const AdminSkillsPage = lazy(() => import('./pages/admin/AdminSkillsPage'));
const AdminExperiencePage = lazy(() => import('./pages/admin/AdminExperiencePage'));
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage'));
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'));

const PageFallback = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#1a1a1a]">
    <Loader2 className="w-8 h-8 animate-spin text-[#1683FF] mb-3" />
    <span className="text-[11px] font-mono tracking-widest uppercase text-[#888888]">Loading View...</span>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public Visitor Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/skills/:slug" element={<SkillCategoryDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Admin Login (Hidden from public navigation) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Private Admin CMS Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="projects/new" element={<AdminProjectFormPage />} />
                <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />
                <Route path="skills" element={<AdminSkillsPage />} />
                <Route path="experience" element={<AdminExperiencePage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
              </Route>
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
