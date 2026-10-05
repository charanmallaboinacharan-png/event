import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import {
  Calendar, MapPin, Users, ArrowRight, Sparkles, QrCode,
  ShieldCheck, Zap, Ticket, Clock, CheckCircle2, Award,
  Layers, Search, ChevronRight, BarChart3, Smartphone, ExternalLink
} from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../utils/formatters';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Events' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'sports', label: 'Sports' },
  { id: 'technical', label: 'Technical' },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');

  useEffect(() => {
    fetchFeaturedEvents();
  }, [selectedCat]);

  const fetchFeaturedEvents = async () => {
    try {
      setLoading(true);
      const params = { per_page: 6 };
      if (selectedCat !== 'all') {
        params.category = selectedCat;
      }
      const res = await eventsAPI.getEvents(params);
      setEvents(res.data?.events || []);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ paddingTop: '1rem', paddingBottom: '0' }}>
      {/* ─── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="hero" style={{ padding: '3.5rem 0 3rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: '#38bdf8',
            fontSize: '0.875rem',
            fontWeight: '700',
            marginBottom: '1.75rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.2)'
          }}>
            <Sparkles size={16} /> Campus Event Management & Zero-Queue Check-in
          </div>

          <h1 style={{
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em'
          }}>
            Every College Event. <br />
            <span className="gradient-text">One Easy Platform.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: '1.6'
          }}>
            Discover events, register in seconds, get your QR pass, and check in instantly.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link to="/events" className="btn btn-primary btn-lg" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)' }}>
              <Search size={18} /> Explore Events
            </Link>
            <Link to="/login?role=organizer" className="btn btn-amber btn-lg" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
              <Zap size={18} /> Organize an Event
            </Link>
          </div>

          {/* ─── VISUAL FLOW SHOWCASE: Event → Registration → QR → Check-in ─── */}
          <div style={{
            background: 'rgba(22, 27, 46, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem 2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
            maxWidth: '860px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: '700' }}>
              Seamless 4-Step Experience
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center'
            }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', fontWeight: '800' }}>
                  <Calendar size={22} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>1. Find Event</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Fests, Hackathons & Tech</div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ArrowRight size={20} />
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: '800' }}>
                  <Users size={22} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>2. Register</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Instant dynamic signup</div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ArrowRight size={20} />
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', fontWeight: '800' }}>
                  <Ticket size={22} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>3. QR Pass</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Unique secure token</div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ArrowRight size={20} />
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: '800' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>4. Check-in</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Sub-second gate scan</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. UPCOMING EVENTS & CATEGORIES ─────────────────────────── */}
      <section style={{ padding: '3.5rem 0', background: 'rgba(13, 17, 30, 0.6)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Discover</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>Upcoming Events</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
                Live college events accepting registrations right now
              </p>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              View All Events <ChevronRight size={16} />
            </Link>
          </div>

          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem'
          }}>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCat(tab.id)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: selectedCat === tab.id ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid var(--border)',
                  background: selectedCat === tab.id ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.25))' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCat === tab.id ? '#38bdf8' : 'var(--text-secondary)',
                  fontWeight: selectedCat === tab.id ? '700' : '500',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: selectedCat === tab.id ? '0 4px 15px rgba(6, 182, 212, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ width: '40px', height: '40px' }} />
            </div>
          ) : events.length === 0 ? (
            <div className="card-glass" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h3>No events found in this category</h3>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Check back soon or explore other categories.
              </p>
              <button onClick={() => setSelectedCat('all')} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {events.map((evt) => {
                const regCount = evt.current_registrations || evt.registered_count || 0;
                const capacity = evt.capacity || 100;
                const availableSeats = Math.max(0, capacity - regCount);

                return (
                  <div key={evt.id} className="card-glass event-card" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img
                        src={evt.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'}
                        alt={evt.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        <span className={`badge ${getCategoryBadgeClass(evt.category)}`}>
                          {evt.category}
                        </span>
                        <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#fff', fontWeight: '700' }}>
                          Free Entry
                        </span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: '600', color: '#10b981' }}>
                        {availableSeats} seats left
                      </div>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.6rem', lineHeight: '1.3' }}>
                        {evt.title}
                      </h3>

                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {evt.description}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={15} style={{ color: 'var(--accent-secondary)' }} />
                          <span>{formatDate(evt.event_date)} • {formatTime(evt.start_time)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={15} style={{ color: 'var(--accent-primary)' }} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{evt.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={15} style={{ color: 'var(--accent-amber)' }} />
                          <span>Reg Deadline: {formatDate(evt.registration_deadline)}</span>
                        </div>
                      </div>

                      <Link to={`/events/${evt.id}`} className="btn btn-primary btn-full" style={{ justifyContent: 'center' }}>
                        View Details & Register <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. HOW EVENT EASE WORKS ─────────────────────────────────── */}
      <section style={{ padding: '4.5rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Simple Workflow</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>How Event Ease Works</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
              Built specifically for university campuses to eliminate manual paper rosters and long entrance bottlenecks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {/* Step 1 */}
            <div className="card-glass" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '1rem', right: '1.5rem', lineHeight: '1' }}>
                01
              </div>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', marginBottom: '1.25rem' }}>
                <Search size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Explore Campus Events</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Browse by club, category, or date. Find hackathons, tech workshops, cultural nights, and gaming tournaments all in one central feed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-glass" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '1rem', right: '1.5rem', lineHeight: '1' }}>
                02
              </div>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', marginBottom: '1.25rem' }}>
                <Ticket size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Get Instant Digital Pass</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Register with any personal or college email. Receive a unique cryptographic QR pass immediately with full wallet and offline download support.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-glass" style={{ padding: '2rem', position: 'relative' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'rgba(255,255,255,0.05)', position: 'absolute', top: '1rem', right: '1.5rem', lineHeight: '1' }}>
                03
              </div>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-lg)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '1.25rem' }}>
                <QrCode size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Sub-Second Gate Scan</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Show your phone screen at Gate 1, 2, or 3. Organizers scan with camera or manual ID, preventing duplicates and tracking real-time headcount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. LIVE STATISTICS ──────────────────────────────────────── */}
      <section style={{ padding: '3.5rem 0', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.08))', borderTop: '1px solid rgba(139, 92, 246, 0.2)', borderBottom: '1px solid rgba(6, 182, 212, 0.2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: '900', color: '#06b6d4', lineHeight: '1.1' }}>
                12,500+
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Student Registrations
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Across campus fests</div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: '900', color: '#a78bfa', lineHeight: '1.1' }}>
                &lt; 0.8s
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                QR Scan Speed
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Zero gate waiting time</div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: '900', color: '#f59e0b', lineHeight: '1.1' }}>
                99.9%
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Duplicate Check Prevention
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anti-fraud cryptographic tokens</div>
            </div>

            <div>
              <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.2rem)', fontWeight: '900', color: '#10b981', lineHeight: '1.1' }}>
                45+
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Active College Clubs
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tech, cultural & sports leads</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BENEFITS (Students vs Organizers) ─────────────────────── */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Tailored Benefits</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>Why Campus Loves Event Ease</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* For Students */}
            <div className="card-glass" style={{ padding: '2.5rem', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', margin: 0 }}>For Students</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Frictionless event access</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Personal Email Login:</strong> Use your original Gmail, Outlook, or college ID seamlessly.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Digital Boarding Pass:</strong> Always available in your digital ticket wallet, even offline.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Fast Gate Entry:</strong> No waiting for name lookups; just flash your phone screen.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Instant Certificates:</strong> Automatic participation certificate generated right after attendance.</span>
                </li>
              </ul>

              <Link to="/events" className="btn btn-primary btn-sm" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}>
                Explore All Student Events
              </Link>
            </div>

            {/* For Organizers */}
            <div className="card-glass" style={{ padding: '2.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', margin: 0 }}>For Organizers</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Full control & live telemetry</span>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Real-time Gate Telemetry:</strong> Track Gate 1, 2, and 3 check-ins with live attendance charts.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Duplicate Prevention:</strong> Immediate warnings on re-used or invalid QR codes.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Dynamic Forms & Banner Upload:</strong> Custom registration questions and local image uploads.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>1-Click CSV Export:</strong> Download verified attendee rosters with timestamps for college records.</span>
                </li>
              </ul>

              <Link to="/login?role=organizer" className="btn btn-amber btn-sm" style={{ marginTop: '2rem', width: '100%', justifyContent: 'center' }}>
                Open Organizer Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FOOTER ───────────────────────────────────────────────── */}
      <footer style={{
        background: 'rgba(10, 14, 26, 0.95)',
        borderTop: '1px solid var(--border)',
        padding: '3.5rem 0 2rem',
        marginTop: '2rem'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
            {/* Brand */}
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                ⚡ EventEase
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                The official next-generation campus event management system. Designed for students, trusted by university organizers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Links
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li><Link to="/events" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Browse Events</Link></li>
                <li><Link to="/my-tickets" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>My QR Passes</Link></li>
                <li><Link to="/certificates" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Certificates</Link></li>
                <li><Link to="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Student Dashboard</Link></li>
              </ul>
            </div>

            {/* Organizers */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                For Organizers
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <li><Link to="/organizer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Organizer Dashboard</Link></li>
                <li><Link to="/organizer/events/new" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Create New Event</Link></li>
                <li><Link to="/organizer/scanner" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Gate QR Scanner</Link></li>
                <li><Link to="/organizer/events" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Manage Registrations</Link></li>
              </ul>
            </div>

            {/* Status & Security */}
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                System Status
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>All Systems Operational</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5' }}>
                Supabase Real-time Cloud Connected <br />
                Localhost Fast-Checkin Gate Active
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>© {new Date().getFullYear()} EventEase Platform. Built for University Excellence.</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/welcome" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Role Portal</Link>
              <Link to="/events" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Campus Directory</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
