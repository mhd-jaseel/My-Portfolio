import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = () => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b10] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-4" />
        <p className="text-sm tracking-wider uppercase">Verifying session...</p>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
