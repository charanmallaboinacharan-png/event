import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrationsAPI } from '../services/api';
import {
  User, Mail, Phone, Building, BookOpen, Calendar,
  ShieldCheck, X, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DynamicRegistrationModal({ isOpen, onClose, event, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Personal Information
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',

    // College Information
    college: 'Campus University Institute of Tech',
    department: 'Computer Science & Engineering',
    year: '2nd Year',

    // Additional Information
    teamName: '',
    githubOrPortfolio: '',
    dietaryPreference: 'None / Standard',
    emergencyContact: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email');
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the event terms to register');
      return;
    }

    try {
      setLoading(true);
      const res = await registrationsAPI.register(event.id);
      toast.success('Registration Confirmed! Your QR Pass is ready.');
      onSuccess({
        ...res.data,
        attendeeName: formData.name,
        formData,
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to complete registration';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
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
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--bg-secondary)',
            zIndex: 10,
          }}
        >
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.25rem', fontSize: '0.75rem' }}>
              Official Registration
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: 0 }}>
              Register for {event?.title || 'Event'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* 1. PERSONAL INFORMATION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', paddingBottom: '0.4rem' }}>
              <User size={18} />
              <span>Personal Information</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. Arjun S. N."
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="original@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. COLLEGE INFORMATION */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '0.4rem' }}>
              <Building size={18} />
              <span>College Information</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">College / University Name *</label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="e.g. National Institute of Engineering"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="Computer Science & Engineering">CSE (Computer Science)</option>
                    <option value="Information Science & Engineering">ISE (Information Science)</option>
                    <option value="Electronics & Communication">ECE (Electronics)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Management / MBA">Business &amp; Management</option>
                    <option value="Other">Other Department</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Year of Study *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-input"
                    required
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">PG / Masters</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ADDITIONAL INFORMATION (ORGANIZER-DEFINED FIELDS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: '700', fontSize: '0.95rem', marginBottom: '1rem', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', paddingBottom: '0.4rem' }}>
              <FileText size={18} />
              <span>Additional Information</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Team Name (if participating as team)</label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. CodeWarriors"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    name="githubOrPortfolio"
                    value={formData.githubOrPortfolio}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dietary / Refreshment Preference</label>
                <select
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="None / Standard">Standard Refreshments</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. TERMS AND CONFIRMATION */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: '0.2rem', accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}
                required
              />
              <span>
                I agree to the event terms, code of conduct, and agree to present my QR pass at the entrance gate for admission.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-full"
            disabled={loading || !agreed}
            style={{ justifyContent: 'center', padding: '0.85rem' }}
          >
            {loading ? <div className="spinner" /> : <><CheckCircle2 size={18} /> [CONFIRM REGISTRATION]</>}
          </button>
        </form>
      </div>
    </div>
  );
}
