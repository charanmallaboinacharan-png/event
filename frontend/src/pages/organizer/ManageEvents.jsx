import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizerAPI, eventsAPI } from '../../services/api';
import { Plus, Calendar, Users, QrCode, Edit2, Trash2, Eye } from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents(true);
    // Real-time polling every 5 seconds to keep attendee records up to date
    const interval = setInterval(() => {
      fetchEvents(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await organizerAPI.getMyEvents();
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
      if (showLoading) toast.error('Failed to load events');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel and delete "${title}"?`)) {
      return;
    }

    try {
      await eventsAPI.deleteEvent(id);
      toast.success('Event cancelled successfully');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel event');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="page-header" style={{ marginBottom: 0 }}>
            <h1>My Managed Events</h1>
            <p>View attendee rosters, edit event parameters, and check in participants</p>
          </div>
          <Link to="/organizer/events/new" className="btn btn-primary">
            <Plus size={18} /> Create New Event
          </Link>
        </div>

        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner-lg" />
          </div>
        ) : events.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🎪</div>
            <div className="empty-title">No Events Created Yet</div>
            <div className="empty-desc">
              Get started by creating your first college fest, workshop, or tech conference!
            </div>
            <Link to="/organizer/events/new" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date & Time</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id}>
                      <td>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {evt.title}
                        </div>
                        <span className={`badge ${getCategoryBadgeClass(evt.category)}`} style={{ marginTop: '0.25rem' }}>
                          {evt.category}
                        </span>
                      </td>
                      <td>
                        <div>{formatDate(evt.event_date)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatTime(evt.start_time)}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>
                          {evt.current_registrations ?? evt.registered_count ?? 0} / {evt.capacity}
                        </div>
                        <div style={{ width: '80px', height: '4px', background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', marginTop: '0.35rem', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, Math.round(((evt.current_registrations ?? evt.registered_count ?? 0) / evt.capacity) * 100))}%`,
                              height: '100%',
                              background: 'var(--accent-primary)',
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${evt.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <Link
                            to={`/events/${evt.id}`}
                            className="btn btn-ghost btn-sm"
                            title="View Public Page"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            to={`/organizer/events/${evt.id}/edit`}
                            className="btn btn-secondary btn-sm"
                            title="Edit Event & Banner"
                          >
                            <Edit2 size={15} /> Edit
                          </Link>
                          <Link
                            to={`/organizer/events/${evt.id}/participants`}
                            className="btn btn-secondary btn-sm"
                            title="View Attendees Roster"
                          >
                            <Users size={15} /> Attendees
                          </Link>
                          <Link
                            to={`/organizer/scanner?eventId=${evt.id}`}
                            className="btn btn-secondary btn-sm"
                            title="Scan QR Tickets"
                          >
                            <QrCode size={15} /> Scan
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            title="Cancel Event"
                            onClick={() => handleDelete(evt.id, evt.title)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
