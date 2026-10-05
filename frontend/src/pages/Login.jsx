import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sparkles, GraduationCap, Crown, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const roleParam = searchParams.get('role');
  const emailParam = searchParams.get('email');

  const [selectedRole, setSelectedRole] = useState(roleParam === 'organizer' ? 'organizer' : 'student');
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [formData, setFormData] = useState({
    email: emailParam || '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (roleParam === 'organizer') setSelectedRole('organizer');
    else if (roleParam === 'student') setSelectedRole('student');
    if (emailParam) setFormData((prev) => ({ ...prev, email: emailParam }));
  }, [roleParam, emailParam]);

  const handleChange = (e) => {
    setLoginFailed(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter your email and password');
      return;
    }

    try {
      setLoading(true);
      setLoginFailed(false);
      const res = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${res.user.full_name || 'User'}!`);
      if (res.user.role === 'organizer' || res.user.role === 'admin') {
        navigate('/organizer');
      } else {
        navigate(from === '/' ? '/dashboard' : from);
      }
    } catch (err) {
      setLoginFailed(true);
      const msg = err.response?.data?.detail || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    setSelectedRole(role);
    setLoginFailed(false);
    if (role === 'organizer') {
      setFormData({
        email: 'organizer@eventease.dev',
        password: 'organizer123',
      });
    } else {
      setFormData({
        email: 'student@eventease.dev',
        password: 'student123',
      });
    }
    toast.success(`Filled demo ${role} credentials`);
  };

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div
          className="card-glass"
          style={{
            padding: '2.5rem',
            border: selectedRole === 'organizer' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(6, 182, 212, 0.4)',
            boxShadow: selectedRole === 'organizer' ? '0 12px 40px rgba(245, 158, 11, 0.15)' : '0 12px 40px rgba(6, 182, 212, 0.15)',
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
                background: selectedRole === 'organizer' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                color: selectedRole === 'organizer' ? '#f59e0b' : '#06b6d4',
                marginBottom: '1rem',
                boxShadow: selectedRole === 'organizer' ? '0 0 20px rgba(245, 158, 11, 0.3)' : '0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              {selectedRole === 'organizer' ? <Crown size={30} /> : <GraduationCap size={30} />}
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: '800' }}>
              {selectedRole === 'organizer' ? 'Organizer Sign In' : 'Student Sign In'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              Sign in with your original personal or campus email ID
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: selectedRole === 'student' ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent',
                color: selectedRole === 'student' ? '#fff' : 'var(--text-secondary)',
                boxShadow: selectedRole === 'student' ? '0 4px 12px rgba(6, 182, 212, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('organizer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.55rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
                background: selectedRole === 'organizer' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'transparent',
                color: selectedRole === 'organizer' ? '#fff' : 'var(--text-secondary)',
                boxShadow: selectedRole === 'organizer' ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <Crown size={16} /> Organizer
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Email Address</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Any valid email (Gmail, etc.)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. yourname@gmail.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
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
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-lg btn-full ${selectedRole === 'organizer' ? 'btn-amber' : 'btn-primary'}`}
              disabled={loading}
              style={{ marginTop: '0.25rem' }}
            >
              {loading ? <div className="spinner" /> : <><LogIn size={18} /> Sign In as {selectedRole === 'organizer' ? 'Organizer' : 'Student'}</>}
            </button>
          </form>

          {/* First time registering with original email prompt */}
          {loginFailed && formData.email && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontSize: '0.85rem', fontWeight: '600' }}>
                <AlertCircle size={17} />
                <span>First time using this email?</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                If you haven't registered your original email <strong>{formData.email}</strong> yet, click below to register in 10 seconds:
              </p>
              <button
                type="button"
                className="btn btn-sm btn-info"
                onClick={() => navigate(`/register?email=${encodeURIComponent(formData.email)}&role=${selectedRole}`)}
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
              >
                <UserPlus size={15} /> Register &quot;{formData.email}&quot; Now
              </button>
            </div>
          )}

          {/* Quick Demo Accounts Helper */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Sparkles size={13} style={{ color: 'var(--accent-secondary)' }} />
                <span>Instant 1-Click Demo Accounts</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFill('student')}
                style={{ borderColor: 'rgba(6, 182, 212, 0.3)', justifyContent: 'center' }}
              >
                🎓 Student Demo
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFill('organizer')}
                style={{ borderColor: 'rgba(245, 158, 11, 0.3)', justifyContent: 'center' }}
              >
                👑 Organizer Demo
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link
              to={`/register?role=${selectedRole}${formData.email ? `&email=${encodeURIComponent(formData.email)}` : ''}`}
              style={{ color: selectedRole === 'organizer' ? '#f59e0b' : 'var(--accent-secondary)', fontWeight: '700', textDecoration: 'none' }}
            >
              Register with your original email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
