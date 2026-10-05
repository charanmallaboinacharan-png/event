import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import {
  Calendar, Bell, User, LogOut, Menu, X, Home,
  Ticket, Settings, BarChart2, QrCode, Plus, ChevronDown, Sparkles, Award
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    notificationsAPI.getNotifications()
      .then(res => {
        setNotifications(res.data || []);
        setUnreadCount((res.data || []).filter(n => !n.is_read).length);
      })
      .catch(() => {});
  }, [user, location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const studentLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/events', label: 'Discover', icon: <Calendar size={16} /> },
    { to: '/dashboard', label: 'My Events', icon: <Sparkles size={16} /> },
    { to: '/my-tickets', label: 'QR Pass', icon: <Ticket size={16} /> },
    { to: '/certificates', label: 'Certificates', icon: <Award size={16} /> },
  ];

  const organizerLinks = [
    { to: '/organizer', label: 'Dashboard', icon: <BarChart2 size={16} /> },
    { to: '/organizer/events', label: 'My Events', icon: <Calendar size={16} /> },
    { to: '/organizer/events/new', label: 'Create Event', icon: <Plus size={16} /> },
    { to: '/organizer/scanner', label: 'QR Check-in', icon: <QrCode size={16} /> },
    { to: '/certificates', label: 'Certificates', icon: <Award size={16} /> },
  ];

  const navLinks = user ? (isOrganizer ? organizerLinks : studentLinks) : [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/events', label: 'Discover', icon: <Calendar size={16} /> },
    { to: '/welcome', label: 'Role Portal', icon: <Sparkles size={16} /> },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">⚡ EventEase</Link>

        {/* Desktop Nav */}
        <div className="nav-links" style={{ display: 'flex' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
              {link.icon} {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} ref={dropRef}>
          {user ? (
            <>
              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  style={{ position: 'relative' }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: '4px', right: '4px',
                      width: '8px', height: '8px',
                      background: 'var(--accent-primary)',
                      borderRadius: '50%'
                    }} />
                  )}
                </button>

                {notifOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '320px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 2000, overflow: 'hidden'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                          No notifications yet
                        </div>
                      ) : notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '0.875rem 1rem',
                          borderBottom: '1px solid var(--border)',
                          background: n.is_read ? 'none' : 'rgba(124, 58, 237, 0.05)',
                          cursor: 'pointer'
                        }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{n.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  style={{ gap: '0.5rem', padding: '0.375rem 0.75rem' }}
                >
                  <div style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8125rem', fontWeight: 700, color: 'white'
                  }}>
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <span style={{ fontSize: '0.875rem', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.full_name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {profileOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '200px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)', zIndex: 2000, overflow: 'hidden'
                  }}>
                    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
                    </div>
                    <Link to="/profile" className="sidebar-link" style={{ borderLeft: 'none' }} onClick={() => setProfileOpen(false)}>
                      <User size={16} /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem 1.5rem', fontSize: '0.875rem', fontWeight: 500,
                        color: 'var(--error)', transition: 'var(--transition)'
                      }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="btn btn-ghost btn-icon" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
