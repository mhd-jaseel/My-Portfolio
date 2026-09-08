import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      // If there is no token in localStorage and no cookie, skip network call to prevent unnecessary 401s
      if (!token) {
        setAdmin(null);
        setLoading(false);
        return;
      }
      const res = await api.get('/admin/me');
      if (res.data.success) {
        setAdmin(res.data.user);
      } else {
        localStorage.removeItem('admin_token');
        setAdmin(null);
      }
    } catch (err) {
      localStorage.removeItem('admin_token');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/admin/login', { email, password });
    if (res.data.success) {
      if (res.data.token) {
        localStorage.setItem('admin_token', res.data.token);
      }
      setAdmin(res.data.user);
      return res.data;
    }
  };

  const logout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (e) {
      // Ignore logout API network failure
    } finally {
      localStorage.removeItem('admin_token');
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
