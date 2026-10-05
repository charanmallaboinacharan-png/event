import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, IdCard, Sparkles, GraduationCap, Crown, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const emailParam = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: emailParam || '',
    password: '',
    college_id: '',
    phone: '',
    role: roleParam === 'organizer' ? 'organizer' : 'student',
  });

  useEffect(() => {
    if (roleParam === 'organizer' || roleParam === 'student') {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [roleParam, emailParam]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Please fill in your name, email, and password');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);
      toast.success('Registration successful! Welcome to EventEase');
      if (res.user.role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed. Please check your details.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isOrganizer = formData.role === 'organizer';

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <div
          className="card-glass"
          style={{
            padding: '2.5rem',
            border: isOrganizer ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
            boxShadow: isOrganizer ? '0 12px 40px rgba(245, 158, 11, 0.15)' : '0 12px 40px rgba(6, 182, 212, 0.15)',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                padding: '0.85rem',
                borderRadius: 'var(--radius-xl)',
                background: isOrganizer ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                color: isOrganizer ? '#f59e0b' : '#06b6d4',
                marginBottom: '1rem',
                boxShadow: isOrganizer ? '0 0 20px rgba(245, 158, 11, 0.3)' : '0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              {isOrganizer ? <Crown size={30} /> : <UserPlus size={30} />}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Register with your original email to access events & passes
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">I am joining as a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'student' }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: !isOrganizer ? 'rgba(6, 182, 212, 0.5)' : 'var(--border)',
                    background: !isOrganizer ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))' : 'rgba(255,255,255,0.03)',
                    color: !isOrganizer ? '#38bdf8' : 'var(--text-secondary)',
                    boxShadow: !isOrganizer ? '0 4px 15px rgba(6, 182, 212, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <GraduationCap size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'organizer' }))}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isOrganizer ? 'rgba(245, 158, 11, 0.5)' : 'var(--border)',
                    background: isOrganizer ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(239, 68, 68, 0.2))' : 'rgba(255,255,255,0.03)',
                    color: isOrganizer ? '#f59e0b' : 'var(--text-secondary)',
                    boxShadow: isOrganizer ? '0 4px 15px rgba(245, 158, 11, 0.25)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <Crown size={18} /> Organizer
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Email Address *</span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={12} /> Real / Original Email
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com or alex@university.edu"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
              <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                You can use any valid mail (Gmail, Outlook, Yahoo, or college domain).
              </small>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">College / Roll ID (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <IdCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="college_id"
                    value={formData.college_id}
                    onChange={handleChange}
                    placeholder="CS-2026-42"
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555-0199"
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-lg btn-full ${isOrganizer ? 'btn-amber' : 'btn-primary'}`}
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? <div className="spinner" /> : <><UserPlus size={18} /> Register as {isOrganizer ? 'Organizer' : 'Student'}</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link
              to={`/login?role=${formData.role}${formData.email ? `&email=${encodeURIComponent(formData.email)}` : ''}`}
              style={{ color: isOrganizer ? '#f59e0b' : 'var(--accent-secondary)', fontWeight: '700', textDecoration: 'none' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
