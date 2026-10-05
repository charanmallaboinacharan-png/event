import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationsAPI } from '../services/api';
import { Calendar, Ticket, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await registrationsAPI.getMyRegistrations();
      setRegistrations(res.data || []);
    } catch (err) {
      console.error('Failed to load user registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRegistered = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const upcomingCount = registrations.filter((r) => !r.checked_in && r.registration_status !== 'cancelled').length;

  return (
    <div className="page">
      <div className="container">
        {/* Welcome Banner */}
        <div className="card-glass" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--accent-tertiary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Student Portal
            </div>
            <h1 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>
              Hello, {user?.full_name || 'Student'}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {user?.college_id ? `ID: ${user.college_id} • ` : ''}Manage your registered campus events and access your digital tickets
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/events" className="btn btn-secondary btn-sm">
              <Calendar size={15} /> Find Events
            </Link>
            <Link to="/my-tickets" className="btn btn-primary btn-sm">
              <Ticket size={15} /> My QR Tickets
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: 'var(--accent-secondary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-value">{totalRegistered}</div>
              <div className="stat-label">Total Events Registered</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--info)' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="stat-value">{upcomingCount}</div>
              <div className="stat-label">Upcoming Events</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div className="stat-value">{checkedInCount}</div>
              <div className="stat-label">Attended / Checked-in</div>
            </div>
          </div>
        </div>

        {/* Registered Events Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Registered Events</h2>
            <Link to="/events" style={{ fontSize: '0.8125rem', color: 'var(--accent-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Browse more <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner-center">
              <div className="spinner" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-icon">📅</div>
              <div className="empty-title">No Events Registered Yet</div>
              <div className="empty-desc">Check out upcoming workshops, sports fests, and cultural events!</div>
              <Link to="/events" className="btn btn-primary btn-sm">
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {reg.event?.title || 'Event'}
                        </div>
                        <span className={`badge ${getCategoryBadgeClass(reg.event?.category)}`} style={{ marginTop: '0.25rem' }}>
                          {reg.event?.category || 'general'}
                        </span>
                      </td>
                      <td>
                        <div>{formatDate(reg.event?.event_date)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatTime(reg.event?.start_time)}
                        </div>
                      </td>
                      <td>{reg.event?.location || 'Campus'}</td>
                      <td>
                        {reg.checked_in ? (
                          <span className="badge badge-success">Attended</span>
                        ) : reg.registration_status === 'cancelled' ? (
                          <span className="badge badge-error">Cancelled</span>
                        ) : (
                          <span className="badge badge-info">Confirmed</span>
                        )}
                      </td>
                      <td>
                        <Link to="/my-tickets" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                          View QR
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
