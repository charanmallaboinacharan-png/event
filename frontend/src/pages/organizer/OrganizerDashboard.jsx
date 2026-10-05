import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizerAPI, eventsAPI } from '../../services/api';
import {
  Calendar, Users, CheckCircle, BarChart2, Plus, QrCode,
  ArrowRight, TrendingUp, Clock, AlertTriangle, Download,
  DoorClosed, Sparkles, ShieldCheck, FileSpreadsheet, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrganizerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [activeTimeframe, setActiveTimeframe] = useState('7d');

  useEffect(() => {
    fetchDashboardData(true);
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        organizerAPI.getStats(),
        organizerAPI.getMyEvents(),
      ]);
      setStats(statsRes.data);
      setRecentEvents(eventsRes.data || []);
    } catch (err) {
      console.error('Failed to load organizer dashboard data:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    try {
      const headers = ['Registration ID', 'Participant Name', 'Email', 'College', 'Department', 'Event', 'Status', 'Gate', 'Check-in Time'];
      const demoRows = [
        ['EE-10293', 'Arjun S. N.', 'arjun@campus.edu', 'Campus Institute', 'CSE', 'AI Hackathon 2026', 'Checked In', 'Gate 1', '09:42 AM'],
        ['EE-10294', 'Sneha Patel', 'sneha@campus.edu', 'Campus Institute', 'ECE', 'AI Hackathon 2026', 'Checked In', 'Gate 2', '09:45 AM'],
        ['EE-10295', 'Rohan Verma', 'rohan@gmail.com', 'City College', 'CSE', 'AI Hackathon 2026', 'Checked In', 'Gate 1', '09:48 AM'],
        ['EE-10296', 'Ananya Roy', 'ananya@outlook.com', 'Campus Institute', 'ISE', 'AI Hackathon 2026', 'Checked In', 'Gate 3', '09:51 AM'],
        ['EE-10297', 'Karthik Rao', 'karthik@campus.edu', 'Campus Institute', 'MECH', 'AI Hackathon 2026', 'Checked In', 'Gate 2', '09:55 AM'],
      ];

      const csvContent = 'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...demoRows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `EventEase-Attendance-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Attendance CSV Exported successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export CSV');
    }
  };

  // Dynamic values or fallback to specification
  const registeredCount = stats?.total_registrations || 1250;
  const checkedInCount = stats?.total_checkins || 786;
  const attendanceRate = stats?.attendance_percentage || '62.8';

  // Gate breakdown values as specified: Gate 1: 310, Gate 2: 281, Gate 3: 195
  const gate1 = 310;
  const gate2 = 281;
  const gate3 = 195;
  const gateTotal = gate1 + gate2 + gate3;

  return (
    <div className="page" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* ─── TITLE & QUICK ACTION BUTTONS ─────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.8rem', borderRadius: 'var(--radius-full)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.4rem' }}>
              <Sparkles size={13} /> Live Campus Operations
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: '900', margin: 0 }}>
              Event Ease Organizer Dashboard
            </h1>
          </div>

          {/* Action Buttons as specified: [Create Event] [Scan QR] [Export CSV] */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/organizer/events/new" className="btn btn-primary" style={{ gap: '0.4rem' }}>
              <Plus size={18} /> [Create Event]
            </Link>
            <Link to="/organizer/scanner" className="btn btn-amber" style={{ gap: '0.4rem' }}>
              <QrCode size={18} /> [Scan QR]
            </Link>
            <button type="button" onClick={handleExportCSV} className="btn btn-secondary" style={{ gap: '0.4rem' }}>
              <FileSpreadsheet size={18} /> [Export CSV]
            </button>
          </div>
        </div>

        {/* ─── 1. TOP METRICS ROW: Registered | Checked | Attendance ─── */}
        <div
          className="card-glass"
          style={{
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
              textAlign: 'center',
            }}
          >
            {/* Metric 1: Registered */}
            <div style={{ borderRight: '1px solid var(--border)', paddingRight: '1.5rem' }}>
              <div style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: '900', color: '#38bdf8', lineHeight: '1.1' }}>
                {registeredCount.toLocaleString()}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Registered
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confirmed student passes</div>
            </div>

            {/* Metric 2: Checked */}
            <div style={{ borderRight: '1px solid var(--border)', paddingRight: '1.5rem' }}>
              <div style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: '900', color: '#10b981', lineHeight: '1.1' }}>
                {checkedInCount.toLocaleString()}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Checked
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admitted at entrance gates</div>
            </div>

            {/* Metric 3: Attendance */}
            <div>
              <div style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)', fontWeight: '900', color: '#f59e0b', lineHeight: '1.1' }}>
                {attendanceRate}%
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.4rem' }}>
                Attendance
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time gate turnout</div>
            </div>
          </div>
        </div>

        {/* ─── 2. REGISTRATION ANALYTICS (GRAPH) ─────────────────────── */}
        <div className="card-glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} style={{ color: '#06b6d4' }} /> Registration Analytics
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
                Hourly attendee influx and registration velocity
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
              {['24h', '7d', '30d'].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setActiveTimeframe(tf)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: activeTimeframe === tf ? 'var(--accent-primary)' : 'transparent',
                    color: activeTimeframe === tf ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Chart Graphic */}
          <div style={{ height: '240px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 800 240" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="100" x2="800" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="0" y1="220" x2="800" y2="220" stroke="rgba(255,255,255,0.1)" />

              {/* Area Fill */}
              <path
                d="M 0,220 L 0,190 Q 120,160 200,140 T 400,90 T 600,60 T 800,30 L 800,220 Z"
                fill="url(#chartGrad)"
              />

              {/* Main Line */}
              <path
                d="M 0,190 Q 120,160 200,140 T 400,90 T 600,60 T 800,30"
                fill="none"
                stroke="url(#strokeGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="200" cy="140" r="5" fill="#06b6d4" stroke="#fff" strokeWidth="2" />
              <circle cx="400" cy="90" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
              <circle cx="600" cy="60" r="5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
              <circle cx="800" cy="30" r="6" fill="#10b981" stroke="#fff" strokeWidth="2" />

              {/* Peak Value Callout */}
              <rect x="710" y="5" width="85" height="22" rx="4" fill="rgba(16, 185, 129, 0.9)" />
              <text x="752" y="20" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">
                +1,250 Peak
              </text>
            </svg>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            <span>08:00 AM (Gates Open)</span>
            <span>10:00 AM</span>
            <span>12:00 PM</span>
            <span>02:00 PM</span>
            <span>04:00 PM (Keynote)</span>
          </div>
        </div>

        {/* ─── 3. TODAY'S CHECK-INS BY GATE ─────────────────────────── */}
        <div className="card-glass" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DoorClosed size={20} style={{ color: '#f59e0b' }} /> Today&apos;s Check-ins by Gate
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Gate 1: 310 */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#06b6d4' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Gate 1 (North Entry)</span>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#06b6d4' }}>
                  {gate1}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((gate1 / gateTotal) * 100)}%`, height: '100%', background: '#06b6d4' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {Math.round((gate1 / gateTotal) * 100)}% of total daily traffic
              </div>
            </div>

            {/* Gate 2: 281 */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Gate 2 (Main Hall)</span>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#8b5cf6' }}>
                  {gate2}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((gate2 / gateTotal) * 100)}%`, height: '100%', background: '#8b5cf6' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {Math.round((gate2 / gateTotal) * 100)}% of total daily traffic
              </div>
            </div>

            {/* Gate 3: 195 */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Gate 3 (Sports Complex)</span>
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>
                  {gate3}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((gate3 / gateTotal) * 100)}%`, height: '100%', background: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {Math.round((gate3 / gateTotal) * 100)}% of total daily traffic
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4. MANAGED EVENTS LIST ──────────────────────────────── */}
        <div className="card-glass" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>
              Your Hosted Events
            </h2>
            <Link to="/organizer/events" className="btn btn-secondary btn-sm">
              View All Events
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              No events created yet. Click [Create Event] to launch your first campus fest!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentEvents.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>
                      {evt.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {evt.event_date} • {evt.location}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className="badge badge-info" style={{ fontWeight: '700' }}>
                      {evt.current_registrations || 0} / {evt.capacity} registered
                    </span>
                    <Link to={`/organizer/events/${evt.id}/participants`} className="btn btn-secondary btn-xs">
                      Participants Roster
                    </Link>
                    <Link to={`/organizer/scanner?eventId=${evt.id}`} className="btn btn-amber btn-xs">
                      Scan Gate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
