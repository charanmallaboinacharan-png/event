import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Download, Wallet, Eye } from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../../utils/formatters';
import QRPassModal from '../QRPassModal';

export default function TicketCard({ ticket, onCancel }) {
  const canvasRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const event = ticket.event || {};
  const isCheckedIn = ticket.checked_in;
  const isCancelled = ticket.registration_status === 'cancelled';
  const rawCode = ticket.ticket?.ticket_code || 'EE-10293';
  const displayCode = rawCode.startsWith('EE-') ? rawCode : (rawCode.startsWith('EVT-') ? `EE-${rawCode.replace('EVT-', '')}` : `EE-${rawCode.slice(0, 6)}`);

  useEffect(() => {
    if (canvasRef.current && ticket.ticket?.qr_token) {
      QRCode.toCanvas(
        canvasRef.current,
        ticket.ticket.qr_token,
        {
          width: 170,
          margin: 1,
          color: {
            dark: '#080b18',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [ticket]);

  return (
    <>
      <div className="ticket-card animate-fade" style={{ background: 'rgba(22, 27, 46, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
        <div className="ticket-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span className={`badge ${getCategoryBadgeClass(event.category)}`} style={{ marginBottom: '0.5rem' }}>
                {event.category || 'Event'}
              </span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                {event.title || 'Event Ticket'}
              </h3>
            </div>
            <div>
              {isCheckedIn ? (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={14} /> Checked In
                </span>
              ) : isCancelled ? (
                <span className="badge badge-error">Cancelled</span>
              ) : (
                <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={14} /> Ready to Scan
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={15} style={{ color: 'var(--accent-secondary)' }} />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={15} style={{ color: 'var(--accent-secondary)' }} />
              <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={15} style={{ color: 'var(--accent-secondary)' }} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="ticket-divider">
          <div className="ticket-notch" />
        </div>

        <div style={{ padding: '0 2rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div
            className="ticket-qr"
            onClick={() => setModalOpen(true)}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)', cursor: 'pointer', transition: 'transform 0.2s' }}
            title="Click to expand official pass"
          >
            <canvas ref={canvasRef} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Registration ID
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '0.05em', color: '#f59e0b', marginTop: '0.2rem' }}>
              {displayCode}
            </div>
          </div>

          {/* Action buttons: [EXPAND PASS] [DOWNLOAD / WALLET] */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setModalOpen(true)}
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <Eye size={14} /> Open Pass
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setModalOpen(true)}
              style={{ justifyContent: 'center', gap: '0.35rem' }}
            >
              <Wallet size={14} /> Wallet
            </button>
          </div>

          {!isCheckedIn && !isCancelled && onCancel && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              style={{ color: 'var(--error)', fontSize: '0.75rem' }}
              onClick={() => onCancel(ticket.id)}
            >
              Cancel Registration
            </button>
          )}
        </div>
      </div>

      <QRPassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        ticket={ticket.ticket}
        event={event}
        attendeeName={ticket.user?.full_name}
      />
    </>
  );
}
