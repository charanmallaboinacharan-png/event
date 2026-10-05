import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import {
  GraduationCap, Crown, Sparkles, ArrowRight, QrCode, Ticket,
  Calendar, Users, Zap, Shield, CheckCircle2, ChevronRight
} from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../utils/formatters';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    eventsAPI.getEvents({ per_page: 3 })
      .then((res) => {
        setFeaturedEvents(res.data?.events || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingEvents(false));
  }, []);

  const handleStudentEntry = () => {
    if (user?.role === 'student') {
      navigate('/dashboard');
    } else {
      navigate('/events');
    }
  };

  const handleOrganizerEntry = () => {
    if (user?.role === 'organizer' || user?.role === 'admin') {
      navigate('/organizer');
    } else {
      navigate('/login?role=organizer');
    }
  };

  return (
    <div className="page" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* ─── Hero Heading ────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.1rem', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.25rem' }}>
            <Sparkles size={15} /> Welcome to EventEase • Campus Management Platform
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.25rem' }}>
            Choose Your <span className="gradient-text">Portal to Begin</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Instant access to campus life. Register with any original email, receive digital QR passes, and enjoy zero-queue entrance check-in.
          </p>
        </div>

        {/* ─── DUAL ROLE GATEWAY CARDS ─────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          {/* Card 1: Student / Attendee Portal */}
          <div className="portal-card" style={{ borderColor: 'rgba(6, 182, 212, 0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <GraduationCap size={32} />
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                For Students
              </span>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Student & Attendee
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              Browse upcoming college hackathons, music festivals, guest lectures, and sports tournaments. Sign in with your original personal or college email.
            </p>

            {/* Feature Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span>1-Click registration with your personal email</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span>Verifiable digital QR passes for fast gate entry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--accent-secondary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-secondary)' }} />
                <span>Live seat quota tracking & instant wallet</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-cyan btn-lg"
                style={{ flex: '1 1 180px' }}
                onClick={handleStudentEntry}
              >
                Enter Student Portal <ArrowRight size={18} />
              </button>
              <Link to="/login?role=student" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>

          {/* Card 2: Organizer Portal */}
          <div className="portal-card organizer-portal" style={{ borderColor: 'rgba(245, 158, 11, 0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 70, 239, 0.2))', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <Crown size={32} />
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
                For Club Leads & Faculty
              </span>
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Club Organizer & Lead
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              Host college events, upload custom banners or pick curated presets, verify attendee tickets with a camera QR scanner, and view live attendance rosters.
            </p>

            {/* Feature Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Upload high-res event banners or pick 1-click themes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--accent-amber)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>High-speed camera QR scanner with duplicate check alert</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--accent-amber)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--accent-amber)' }} />
                <span>Live attendee roster with real-time auto-refresh</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-amber btn-lg"
                style={{ flex: '1 1 180px' }}
                onClick={handleOrganizerEntry}
              >
                Enter Organizer Portal <ArrowRight size={18} />
              </button>
              <Link to="/login?role=organizer" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Fast Access Shortcuts Bar ────────────────────────────── */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Zap size={18} style={{ color: 'var(--accent-secondary)' }} />
            <h3 style={{ fontSize: '1.15rem' }}>Fast Access Feature Dock</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>— Instant 1-tap jump to any tool</span>
          </div>

          <div className="fast-access-bar">
            <Link to="/events" className="fast-shortcut-card">
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.18)', color: '#38bdf8' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Browse All Events</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Explore 12+ live campus events</div>
              </div>
            </Link>

            <Link to="/my-tickets" className="fast-shortcut-card">
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.18)', color: '#c084fc' }}>
                <Ticket size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>My QR Passes</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>View & download tickets</div>
              </div>
            </Link>

            <Link to="/organizer/scanner" className="fast-shortcut-card">
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.18)', color: '#34d399' }}>
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Gate QR Scanner</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan tickets at the entrance</div>
              </div>
            </Link>

            <Link to="/organizer/events/new" className="fast-shortcut-card">
              <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24' }}>
                <Sparkles size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Create New Event</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload banner & publish</div>
              </div>
            </Link>
          </div>
        </div>

        {/* ─── Live Campus Events Showcase ─────────────────────────── */}
        <div className="card-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem' }}>🔥 Happening on Campus Right Now</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Check out active events or view the complete catalog
              </p>
            </div>
            <Link to="/events" className="btn btn-primary btn-sm">
              View All 12 Events <ChevronRight size={15} />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="spinner-center" style={{ padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : (
            <div className="events-grid">
              {featuredEvents.map((evt) => (
                <Link to={`/events/${evt.id}`} key={evt.id} className="event-card">
                  {evt.image_url ? (
                    <img src={evt.image_url} alt={evt.title} className="event-card-img" />
                  ) : (
                    <div className="event-card-img-placeholder">
                      {evt.category === 'technology' ? '💻' : evt.category === 'cultural' ? '🎭' : '✨'}
                    </div>
                  )}
                  <div className="event-card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${getCategoryBadgeClass(evt.category)}`}>
                        {evt.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {evt.current_registrations ?? evt.registered_count ?? 0} / {evt.capacity} registered
                      </span>
                    </div>

                    <h4 className="event-card-title">{evt.title}</h4>

                    <div className="event-card-meta">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} style={{ color: 'var(--accent-secondary)' }} />
                        <span>{formatDate(evt.event_date)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={13} style={{ color: 'var(--accent-secondary)' }} />
                        <span>{evt.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
