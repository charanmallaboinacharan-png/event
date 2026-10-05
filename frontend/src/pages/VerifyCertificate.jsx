import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Award, Calendar, User, Building, ArrowLeft } from 'lucide-react';

export default function VerifyCertificate() {
  const { certId } = useParams();

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '580px' }}>
        <div
          className="card-glass"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            border: '2px solid #10b981',
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 14, 26, 0.95) 100%)',
            boxShadow: '0 20px 50px rgba(16, 185, 129, 0.2)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '2px solid #10b981',
              color: '#34d399',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <ShieldCheck size={36} />
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', color: '#10b981', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            OFFICIAL EVENT EASE VERIFICATION
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#fff', margin: '0 0 0.5rem' }}>
            Certificate is Authentic &amp; Valid
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            This certificate record was verified against university gate check-in logs.
          </p>

          {/* Certificate Metadata Card */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              fontSize: '0.9rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Certificate ID:</span>
              <span style={{ fontWeight: '700', fontFamily: 'monospace', color: '#f59e0b' }}>{certId || 'CERT-EE-2026-9041'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
              <span style={{ fontWeight: '700', color: '#38bdf8' }}>Arjun S. N.</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Event Title:</span>
              <span style={{ fontWeight: '700', color: '#fff' }}>AI Hackathon 2026</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status:</span>
              <span style={{ fontWeight: '700', color: '#10b981' }}>✓ Entrance Gate Check-in Confirmed</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Issuing Body:</span>
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>University Tech Committee</span>
            </div>
          </div>

          <Link to="/" className="btn btn-secondary btn-full" style={{ justifyContent: 'center' }}>
            <ArrowLeft size={16} /> Return to EventEase Home
          </Link>
        </div>
      </div>
    </div>
  );
}
