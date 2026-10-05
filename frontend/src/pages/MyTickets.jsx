import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketsAPI, registrationsAPI } from '../services/api';
import TicketCard from '../components/tickets/TicketCard';
import { Ticket, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketsAPI.getMyTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      toast.error('Failed to load your tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this event registration?')) {
      return;
    }

    try {
      await registrationsAPI.cancelRegistration(regId);
      toast.success('Registration cancelled');
      fetchTickets();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to cancel registration';
      toast.error(msg);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Event Passes & Tickets</h1>
          <p>Present these digital QR passes at the entrance gate for instant check-in</p>
        </div>

        {loading ? (
          <div className="spinner-center">
            <div className="spinner spinner-lg" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">🎟️</div>
            <div className="empty-title">No Tickets Yet</div>
            <div className="empty-desc">
              You haven't registered for any events yet. Explore upcoming campus events and secure your free spot!
            </div>
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              Explore Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onCancel={handleCancelRegistration}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
