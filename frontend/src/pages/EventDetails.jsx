import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DynamicRegistrationModal from '../components/DynamicRegistrationModal';
import QRPassModal from '../components/QRPassModal';
import {
  Calendar, Clock, MapPin, Users, CheckCircle2, ArrowLeft,
  Share2, Shield, Ticket, AlertCircle, Award, FileText,
  HelpCircle, Phone, Mail, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  // Modals
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);

  // FAQ Accordion state
  const [expandedFaq, setExpandedFaq] = useState(0);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getEvent(id);
      setEvent(res.data);
      if (res.data?.is_registered) {
        setIsRegistered(true);
      }
    } catch (err) {
      console.error('Failed to load event details:', err);
      toast.error('Event not found or failed to load');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      toast.error('Please sign in to register for this event');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }
    setRegModalOpen(true);
  };

  const handleRegistrationSuccess = (newTicketData) => {
    setRegModalOpen(false);
    setIsRegistered(true);
    setTicketData(newTicketData);
    setPassModalOpen(true);
    fetchEventDetails();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="spinner" style={{ width: '48px', height: '48px' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Event Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>The event you requested could not be found.</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const regCount = event.current_registrations || event.registered_count || 0;
  const capacity = event.capacity || 100;
  const availableSeats = Math.max(0, capacity - regCount);
  const isFull = availableSeats <= 0;

  // Mock FAQs
  const faqs = [
    {
      q: 'Do I need to carry my physical college ID card?',
      a: 'Yes, please bring your valid college ID card alongside your digital EventEase QR pass for quick gate verification.',
    },
    {
      q: 'Will participation certificates be issued?',
      a: 'Yes! Official digital certificates of participation with unique verification QR codes will be available in your EventEase student dashboard right after gate check-in.',
    },
    {
      q: 'Is there any entry fee for this event?',
      a: 'No, this event is 100% free for all registered college students.',
    },
    {
      q: 'What if I lose internet access at the venue?',
      a: 'You can download your pass in advance or add it to your device wallet. EventEase offline gates can scan your QR pass even without internet connection.',
    },
  ];

  return (
    <div className="page" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Back Link */}
        <Link
          to="/events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to All Events
        </Link>

        {/* ─── EVENT BANNER HERO ───────────────────────────────────── */}
        <div
          className="card-glass"
          style={{
            padding: 0,
            overflow: 'hidden',
            marginBottom: '2.5rem',
            border: '1px solid rgba(139, 92, 246, 0.35)',
          }}
        >
          {/* Banner Image */}
          <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden' }}>
            <img
              src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop'}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,14,26,0.2) 0%, rgba(10,14,26,0.95) 100%)' }} />

            {/* Badges on Banner */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '0.5rem' }}>
              <span className={`badge ${getCategoryBadgeClass(event.category)}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
                {event.category}
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem', background: 'rgba(16, 185, 129, 0.95)' }}>
                Free Admission
              </span>
            </div>

            <button
              onClick={handleShare}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Share Event"
            >
              <Share2 size={18} />
            </button>

            {/* Title & Quick Info on Banner Bottom */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Campus University • Official Event
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', color: '#fff', margin: 0, lineHeight: '1.2' }}>
                {event.title}
              </h1>
            </div>
          </div>

          {/* Key Details Bar & Register Action */}
          <div
            style={{
              padding: '1.75rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(13, 17, 30, 0.85)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {/* Metadata Pills: Date, Time, Venue, Participants */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', flex: 1 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Date</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', marginTop: '0.2rem' }}>
                  <Calendar size={16} style={{ color: '#06b6d4' }} />
                  <span>{formatDate(event.event_date)}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Time</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', marginTop: '0.2rem' }}>
                  <Clock size={16} style={{ color: '#8b5cf6' }} />
                  <span>{formatTime(event.start_time)}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Venue</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', marginTop: '0.2rem' }}>
                  <MapPin size={16} style={{ color: '#ec4899' }} />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{event.location}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Capacity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', marginTop: '0.2rem' }}>
                  <Users size={16} style={{ color: '#10b981' }} />
                  <span>{capacity} participants</span>
                </div>
              </div>
            </div>

            {/* REGISTER NOW Button */}
            <div>
              {isRegistered ? (
                <button
                  type="button"
                  className="btn btn-success btn-lg"
                  onClick={() => setPassModalOpen(true)}
                  style={{ gap: '0.5rem', padding: '0.85rem 1.75rem', fontSize: '1rem', boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)' }}
                >
                  <Ticket size={20} /> [VIEW MY QR PASS]
                </button>
              ) : isFull ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  disabled
                  style={{ opacity: 0.6 }}
                >
                  Registration Full
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleRegisterClick}
                  style={{ gap: '0.5rem', padding: '0.9rem 2.25rem', fontSize: '1.05rem', fontWeight: '800', boxShadow: '0 8px 30px rgba(139, 92, 246, 0.45)' }}
                >
                  <Sparkles size={18} /> [REGISTER NOW]
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── DETAILED SECTIONS AS SPECIFIED ───────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* 1. ABOUT EVENT */}
          <div className="card-glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--accent-secondary)' }} /> About Event
            </h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {event.description}
            </div>
          </div>

          {/* 2. SCHEDULE / TIMELINE */}
          <div className="card-glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} style={{ color: '#8b5cf6' }} /> Schedule &amp; Agenda
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #06b6d4' }}>
                <div style={{ fontWeight: '700', color: '#06b6d4', minWidth: '90px' }}>09:00 AM</div>
                <div>
                  <div style={{ fontWeight: '700' }}>Gate Check-in &amp; Welcome Kit</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>QR ticket scanning at Gates 1, 2, and 3. Breakfast and ID badge pickup.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #8b5cf6' }}>
                <div style={{ fontWeight: '700', color: '#8b5cf6', minWidth: '90px' }}>10:30 AM</div>
                <div>
                  <div style={{ fontWeight: '700' }}>Keynote Address &amp; Problem Statements</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Opening speech by faculty coordinators and release of challenge tracks.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontWeight: '700', color: '#f59e0b', minWidth: '90px' }}>01:00 PM</div>
                <div>
                  <div style={{ fontWeight: '700' }}>Lunch &amp; Networking Break</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Refreshments provided to all registered participants with active badges.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontWeight: '700', color: '#10b981', minWidth: '90px' }}>04:30 PM</div>
                <div>
                  <div style={{ fontWeight: '700' }}>Presentations &amp; Awards Ceremony</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Final project evaluations, trophy distribution, and digital certificates release.</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RULES & ELIGIBILITY */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Rules */}
            <div className="card-glass" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} style={{ color: '#ef4444' }} /> Rules &amp; Guidelines
              </h2>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Carry your digital QR ticket on your mobile phone or as a printout.</li>
                <li>Respect campus property and maintain professional decorum.</li>
                <li>Teams must consist of enrolled students with verifiable IDs.</li>
                <li>Plagiarized code or unauthorized materials will lead to immediate disqualification.</li>
              </ul>
            </div>

            {/* Eligibility */}
            <div className="card-glass" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Eligibility
              </h2>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Open to undergraduate and postgraduate students of all branches.</li>
                <li>Valid student email or college identity card required at check-in.</li>
                <li>Individual or team entries welcome (up to 4 members per team).</li>
                <li>No prior professional experience required; beginner-friendly tracks available.</li>
              </ul>
            </div>
          </div>

          {/* 4. PRIZE INFORMATION */}
          <div className="card-glass" style={{ padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} /> Prize Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🥇</div>
                <div style={{ fontWeight: '800', color: '#f59e0b', fontSize: '1.1rem' }}>1st Place Winner</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', marginTop: '0.25rem' }}>₹30,000 Cash</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ Trophy &amp; Merit Certificate</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>🥈</div>
                <div style={{ fontWeight: '800', color: '#a78bfa', fontSize: '1.1rem' }}>Runner Up</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', marginTop: '0.25rem' }}>₹15,000 Cash</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ Certificate &amp; Swag Kit</div>
              </div>

              <div style={{ padding: '1.25rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>📜</div>
                <div style={{ fontWeight: '800', color: '#38bdf8', fontSize: '1.1rem' }}>All Attendees</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', marginTop: '0.25rem' }}>Participation Pass</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Digital Certificate</div>
              </div>
            </div>
          </div>

          {/* 5. ORGANIZERS & CONTACT */}
          <div className="card-glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} style={{ color: 'var(--accent-secondary)' }} /> Organizers &amp; Contact
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>Club Lead: Dr. R. Sharma &amp; Student Committee</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Department of Computer Science &amp; Technology Club</div>
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Mail size={15} style={{ color: '#06b6d4' }} /> events@college.edu
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <Phone size={15} style={{ color: '#10b981' }} /> +91 (080) 2456-7890
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.35rem' }}>Helpdesk &amp; Inquiries</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  Have questions regarding team size or travel reimbursements? Drop an email to the organizing committee or contact our campus helpdesk.
                </p>
              </div>
            </div>
          </div>

          {/* 6. FAQS */}
          <div className="card-glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} style={{ color: '#38bdf8' }} /> Frequently Asked Questions (FAQs)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                    style={{
                      width: '100%',
                      padding: '1rem 1.25rem',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{faq.q}</span>
                    {expandedFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedFaq === idx && (
                    <div style={{ padding: '0 1.25rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Registration Modal */}
      <DynamicRegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        event={event}
        onSuccess={handleRegistrationSuccess}
      />

      {/* QR Pass Boarding Card Modal */}
      <QRPassModal
        isOpen={passModalOpen}
        onClose={() => setPassModalOpen(false)}
        ticket={ticketData || { ticket_code: 'EE-10293', user: { full_name: user?.full_name } }}
        event={event}
        attendeeName={ticketData?.attendeeName || user?.full_name}
      />
    </div>
  );
}
