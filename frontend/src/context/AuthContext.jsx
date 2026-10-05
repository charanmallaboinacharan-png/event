import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ee_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const saveAuth = (token, userData) => {
    localStorage.setItem('ee_token', token);
    localStorage.setItem('ee_user', JSON.stringify(userData));
    setUser(userData);
  };

  const clearAuth = useCallback(() => {
    localStorage.removeItem('ee_token');
    localStorage.removeItem('ee_user');
    setUser(null);
  }, []);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('ee_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI.getMe()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('ee_user', JSON.stringify(res.data));
      })
      .catch(() => clearAuth())
      .finally(() => setLoading(false));
  }, [clearAuth]);

  // Listen for global logout event (from 401 interceptor)
  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [clearAuth]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    saveAuth(res.data.access_token, res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    saveAuth(res.data.access_token, res.data.user);
    return res.data;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    clearAuth();
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateMe(data);
    const updated = res.data;
    setUser(updated);
    localStorage.setItem('ee_user', JSON.stringify(updated));
    return updated;
  };

  const isStudent = user?.role === 'student';
  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin' || user?.role === 'volunteer';
  const isVolunteer = user?.role === 'volunteer';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, isStudent, isOrganizer, isVolunteer, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
