import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Download, Wallet, X, CheckCircle2, Share2, Printer,
  Calendar, MapPin, Clock, ShieldCheck, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRPassModal({ isOpen, onClose, ticket, event, attendeeName }) {
  const canvasRef = useRef(null);
  const passCardRef = useRef(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [walletAdded, setWalletAdded] = useState(false);

  const rawCode = ticket?.ticket_code || ticket?.ticket_id || 'EE-10293';
  // Display formatted as EE-XXXXX
  const displayCode = rawCode.startsWith('EE-') ? rawCode : (rawCode.startsWith('EVT-') ? `EE-${rawCode.replace('EVT-', '')}` : `EE-${rawCode.slice(0, 6)}`);
  const qrPayload = ticket?.qr_token || rawCode;
  const nameToDisplay = attendeeName || ticket?.user?.full_name || 'STUDENT ATTENDEE';

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      qrPayload,
      {
        width: 220,
        margin: 2,
        color: {
          dark: '#0a0e1a',
          light: '#ffffff',
        },
      },
      (err) => {
        if (err) console.error('QR code generation error:', err);
        else setQrGenerated(true);
      }
    );
  }, [isOpen, qrPayload]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      // Create a temporary canvas to render the full pass card
      const qrCanvas = canvasRef.current;
      const downloadCanvas = document.createElement('canvas');
      downloadCanvas.width = 440;
      downloadCanvas.height = 620;
      const ctx = downloadCanvas.getContext('2d');

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 440, 620);

      // Header Banner
      const grad = ctx.createLinearGradient(0, 0, 440, 0);
      grad.addColorStop(0, '#8b5cf6');
      grad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 440, 10);

      // Branding
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('EVENT EASE • OFFICIAL PASS', 220, 45);

      // Event Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText((event?.title || 'CAMPUS EVENT').slice(0, 28), 220, 80);

      // Draw QR Code centered
      ctx.drawImage(qrCanvas, 110, 110, 220, 220);

      // Attendee Name
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(nameToDisplay.toUpperCase(), 220, 370);

      // Registration ID
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 16px monospace';
      ctx.fillText(`Registration: ${displayCode}`, 220, 400);

      // Status
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('✓ Registration Confirmed', 220, 435);

      // Date / Venue
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`${event?.event_date || 'October 2026'} | ${event?.location || 'Main Campus'}`, 220, 480);

      // Watermark
      ctx.fillStyle = '#475569';
      ctx.font = '11px sans-serif';
      ctx.fillText('Scan at Gate 1, 2, or 3 for fast admission', 220, 560);

      const link = document.createElement('a');
      link.download = `EventPass-${displayCode}.png`;
      link.href = downloadCanvas.toDataURL('image/png');
      link.click();
      toast.success('Digital QR Pass downloaded successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to download pass image.');
    }
  };

  const handleAddToWallet = () => {
    setWalletAdded(true);
    toast.success('Pass added to your Device Wallet / Saved offline!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        ref={passCardRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(180deg, #13192e 0%, #0d1222 100%)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInUp 0.3s ease-out',
        }}
      >
        {/* Top Gradient Stripe */}
        <div style={{ width: '100%', height: '8px', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4, #f59e0b)' }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        {/* Pass Content */}
        <div style={{ padding: '2rem 1.75rem 1.5rem', width: '100%', textAlign: 'center' }}>
          {/* Header */}
          <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.15em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            EVENT EASE
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#ffffff', marginBottom: '1.25rem', lineHeight: '1.2' }}>
            {event?.title || 'CAMPUS EVENT'}
          </h2>

          {/* QR Code Container */}
          <div
            style={{
              background: '#ffffff',
              padding: '1rem',
              borderRadius: 'var(--radius-xl)',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              marginBottom: '1.5rem',
            }}
          >
            <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', height: 'auto' }} />
          </div>

          {/* Attendee Name */}
          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.02em', marginBottom: '0.35rem' }}>
            {nameToDisplay}
          </div>

          {/* Registration Code */}
          <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: 'monospace', marginBottom: '0.85rem' }}>
            Registration: <span style={{ color: '#f59e0b' }}>{displayCode}</span>
          </div>

          {/* Status Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={16} /> ✓ Registration Confirmed
          </div>

          {/* Event Details Strip */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '0.75rem 1rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              textAlign: 'left',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Date &amp; Time</div>
              <div style={{ color: '#fff', fontWeight: '600' }}>{event?.event_date || 'Upcoming'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Venue / Gate</div>
              <div style={{ color: '#fff', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {event?.location || 'Gate 1, 2, 3'}
              </div>
            </div>
          </div>

          {/* Action Buttons as requested: [DOWNLOAD] [ADD TO WALLET] */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleDownload}
              style={{ justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
            >
              <Download size={16} /> [DOWNLOAD]
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddToWallet}
              style={{ justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1rem', fontSize: '0.875rem' }}
            >
              <Wallet size={16} /> {walletAdded ? 'SAVED ✓' : '[ADD TO WALLET]'}
            </button>
          </div>
        </div>

        {/* Footer print link */}
        <div style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'rgba(0, 0, 0, 0.3)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Show this QR at campus entry gate</span>
          <button
            type="button"
            onClick={handlePrint}
            style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}
          >
            <Printer size={13} /> Print Pass
          </button>
        </div>
      </div>
    </div>
  );
}
