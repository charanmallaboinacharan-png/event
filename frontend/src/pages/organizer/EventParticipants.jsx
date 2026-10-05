import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { checkinAPI, eventsAPI } from '../../services/api';
import { ArrowLeft, Search, CheckCircle, Clock, Users, QrCode, RefreshCw, Radio } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function EventParticipants() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData(true);

    if (!autoRefresh) return;
    // Live polling every 4 seconds to maintain real-time attendee records
    const interval = setInterval(() => {
      loadData(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [id, autoRefresh]);

  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setIsRefreshing(true);

      const [evtRes, partRes] = await Promise.all([
        eventsAPI.getEvent(id),
        checkinAPI.getParticipants(id),
      ]);
      setEvent(evtRes.data);
      setParticipants(partRes.data || []);
    } catch (err) {
      console.error('Failed to load participants:', err);
      if (showLoading) toast.error('Failed to load participants');
    } finally {
      if (showLoading) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualCheckIn = async (ticketCode) => {
    if (!ticketCode) return;
    try {
      const res = await checkinAPI.checkIn(ticketCode, id);
      if (res.data?.success || res.data?.status === 'checked_in') {
        toast.success('Participant checked in successfully!');
      } else {
        toast.error(res.data?.message || 'Check-in failed');
      }
      loadData(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Check-in failed');
    }
  };

  const filtered = participants.filter((p) => {
    const q = search.toLowerCase();
    const name = (p.participant_name || p.user?.full_name || '').toLowerCase();
    const email = (p.email || p.user?.email || '').toLowerCase();
    const collegeId = (p.college_id || p.user?.college_id || '').toLowerCase();
    const code = (p.ticket_code || p.ticket?.ticket_code || '').toLowerCase();
    return name.includes(q) || email.includes(q) || collegeId.includes(q) || code.includes(q);
  });

  const checkedInCount = participants.filter((p) => p.checked_in).length;
  const attendanceRate = participants.length > 0 ? Math.round((checkedInCount / participants.length) * 100) : 0;

  return (
    <div className="page">
      <div className="container">
        <Link to="/organizer/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to managed events
        </Link>

        {/* Header & Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-purple">Live Attendee Roster</span>
              {autoRefresh ? (
                <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', textTransform: 'none', fontSize: '0.75rem' }}>
                  <Radio size={12} className="animate-pulse" /> Live Sync ON
                </span>
              ) : (
                <span className="badge badge-warning" style={{ textTransform: 'none', fontSize: '0.75rem' }}>
                  Live Sync Paused
                </span>
              )}
            </div>
            <h1>{event?.title || 'Event Attendees'}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              <strong>{participants.length}</strong> Registered &nbsp;•&nbsp; 
              <strong style={{ color: 'var(--success)' }}>{checkedInCount}</strong> Admitted &nbsp;•&nbsp; 
              <strong>{attendanceRate}%</strong> Attendance Rate
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => loadData(false)}
              disabled={isRefreshing}
              title="Refresh roster now"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> {isRefreshing ? 'Syncing...' : 'Refresh'}
            </button>
            <button
              type="button"
              className={`btn ${autoRefresh ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
              onClick={() => setAutoRefresh((p) => !p)}
            >
              {autoRefresh ? 'Pause Live Sync' : 'Resume Live Sync'}
            </button>
            <Link to={`/organizer/scanner?eventId=${id}`} className="btn btn-primary btn-sm">
              <QrCode size={16} /> Open QR Gate Scanner
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="search-bar">
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search attendee by name, student roll ID, email, or ticket code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Participants Table */}
        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner-lg" />
          </div>
        ) : participants.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">👥</div>
            <div className="empty-title">No Registrations Yet</div>
            <div className="empty-desc">
              When students register for this event, their ticket codes and profile records will populate here in real-time.
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>College / Roll ID</th>
                    <th>Email</th>
                    <th>Ticket Code</th>
                    <th>Registration Date</th>
                    <th>Check-in Status</th>
                    <th>Gate Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const participantName = item.participant_name || item.user?.full_name || 'Student Attendee';
                    const email = item.email || item.user?.email || '—';
                    const collegeId = item.college_id || item.user?.college_id || '—';
                    const ticketCode = item.ticket_code || item.ticket?.ticket_code || '—';

                    return (
                      <tr key={item.id}>
                        <td style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {participantName}
                        </td>
                        <td>{collegeId}</td>
                        <td>{email}</td>
                        <td>
                          <span style={{ fontFamily: 'monospace', color: 'var(--accent-tertiary)', fontWeight: '600' }}>
                            {ticketCode}
                          </span>
                        </td>
                        <td>{formatDate(item.registered_at)}</td>
                        <td>
                          {item.checked_in ? (
                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle size={12} /> Admitted
                            </span>
                          ) : (
                            <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              <Clock size={12} /> Not Checked In
                            </span>
                          )}
                        </td>
                        <td>
                          {!item.checked_in && ticketCode !== '—' && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleManualCheckIn(ticketCode)}
                            >
                              Check In
                            </button>
                          )}
                          {item.checked_in && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                              ✓ Checked In
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
