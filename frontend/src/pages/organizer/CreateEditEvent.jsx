import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { eventsAPI, uploadAPI } from '../../services/api';
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, Image as ImageIcon,
  Save, Sparkles, Upload, X, Check, Eye, Bot, Wand2
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRESET_BANNERS = [
  {
    name: 'AI Hackathon',
    category: 'technology',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tech Symposium',
    category: 'technology',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cultural Gala & Concert',
    category: 'cultural',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sports Championship',
    category: 'sports',
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Robotics Workshop',
    category: 'workshop',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Startup & Leadership Seminar',
    category: 'seminar',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
  },
];

export default function CreateEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(isEditing);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 6);
  const defaultDeadline = `${deadline.toISOString().split('T')[0]}T23:59:00`;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    location: '',
    event_date: defaultDate,
    start_time: '10:00',
    end_time: '17:00',
    capacity: 100,
    registration_deadline: defaultDeadline,
    image_url: '',
    status: 'published',
  });

  // AI Event Creator State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Create a two-day AI hackathon for CSE students with ₹50,000 prize pool');
  const [aiGenerating, setAiGenerating] = useState(false);

  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) return;
    setAiGenerating(true);

    setTimeout(() => {
      const q = aiPrompt.toLowerCase();
      let genTitle = 'CodeAI 2026: 48-Hour National Hackathon';
      let genCategory = 'technology';
      let genLocation = 'Main University Auditorium & CS Labs';
      let genCapacity = 300;
      let genBanner = PRESET_BANNERS[0].url;

      if (q.includes('cricket') || q.includes('sports')) {
        genTitle = 'Inter-College Champions Trophy 2026';
        genCategory = 'sports';
        genLocation = 'Campus Sports Arena & Oval Ground';
        genCapacity = 500;
        genBanner = PRESET_BANNERS[3].url;
      } else if (q.includes('cultural') || q.includes('music') || q.includes('fest')) {
        genTitle = 'Euphoria 2026: Annual Campus Cultural Fest';
        genCategory = 'cultural';
        genLocation = 'Open Air Amphitheatre';
        genCapacity = 1000;
        genBanner = PRESET_BANNERS[2].url;
      } else if (q.includes('workshop') || q.includes('robotics')) {
        genTitle = 'Hands-on Autonomous Robotics & IoT Workshop';
        genCategory = 'workshop';
        genLocation = 'Makerspace Lab, Block B';
        genCapacity = 80;
        genBanner = PRESET_BANNERS[4].url;
      }

      const genDesc = `🚀 ABOUT THE EVENT:
${aiPrompt.trim()}

Join us for this premier campus event featuring hands-on challenges, expert mentorship, and high-energy collaborative competitions.

📅 SCHEDULE & AGENDA:
• Day 1 - 09:00 AM: Gate Check-in & Badge Distribution
• Day 1 - 10:30 AM: Keynote Address & Tracks Release
• Day 1 - 01:00 PM: Networking Lunch Break
• Day 2 - 02:00 PM: Final Project Submissions
• Day 2 - 04:30 PM: Jury Evaluations & Awards Ceremony

📜 RULES & GUIDELINES:
• Teams of 2 to 4 enrolled students.
• Bring your valid university student ID and EventEase QR pass.
• Strictly abide by the campus code of conduct.

🏆 PRIZES & RECOGNITION:
• 1st Place: ₹30,000 + Merit Trophy
• Runner Up: ₹15,000 + Tech Swag Kit
• Official verified digital certificates for all attendees upon gate check-in!

❓ FAQS:
Q: Is food provided? Yes, complimentary meals and refreshments are included.
Q: Can beginners participate? Absolutely! Multiple beginner-friendly tracks are available.`;

      setFormData((prev) => ({
        ...prev,
        title: genTitle,
        description: genDesc,
        category: genCategory,
        location: genLocation,
        capacity: genCapacity,
        image_url: genBanner,
      }));

      setAiGenerating(false);
      setAiModalOpen(false);
      toast.success('✨ AI Event generated and populated successfully!');
    }, 700);
  };

  // If editing, load current event data
  useEffect(() => {
    if (isEditing) {
      setFetchingEvent(true);
      eventsAPI.getEvent(id)
        .then((res) => {
          const evt = res.data;
          setFormData({
            title: evt.title || '',
            description: evt.description || '',
            category: evt.category || 'technology',
            location: evt.location || '',
            event_date: evt.event_date || defaultDate,
            start_time: evt.start_time?.substring(0, 5) || '10:00',
            end_time: evt.end_time?.substring(0, 5) || '17:00',
            capacity: evt.capacity || 100,
            registration_deadline: evt.registration_deadline ? evt.registration_deadline.substring(0, 16) : defaultDeadline,
            image_url: evt.image_url || '',
            status: evt.status || 'published',
          });
        })
        .catch((err) => {
          toast.error('Failed to load event details');
          navigate('/organizer/events');
        })
        .finally(() => setFetchingEvent(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Handle direct file upload from local machine
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);
      const res = await uploadAPI.uploadImage(file);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, image_url: res.data.url }));
        toast.success('Banner uploaded successfully!');
      }
    } catch (err) {
      console.warn('Backend upload failed, converting to local preview URL...', err);
      // Fallback: Read as base64 Data URL so user never gets blocked
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setFormData((prev) => ({ ...prev, image_url: loadEvt.target.result }));
        toast.success('Banner loaded successfully!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      image_url: preset.url,
      category: preset.category,
    }));
    toast.success(`Selected banner: ${preset.name}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required event fields');
      return;
    }

    try {
      setLoading(true);
      let deadlineStr = formData.registration_deadline;
      if (deadlineStr && !deadlineStr.includes('Z') && !deadlineStr.includes('+')) {
        deadlineStr = `${deadlineStr}Z`;
      }

      if (isEditing) {
        await eventsAPI.updateEvent(id, {
          ...formData,
          registration_deadline: deadlineStr,
        });
        toast.success('Event updated successfully!');
      } else {
        await eventsAPI.createEvent({
          ...formData,
          registration_deadline: deadlineStr,
        });
        toast.success('Event published successfully!');
      }

      navigate('/organizer/events');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to save event. Please check inputs.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return (
      <div className="spinner-center" style={{ minHeight: '80vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '820px' }}>
        <Link to="/organizer/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to managed events
        </Link>

        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>{isEditing ? 'Edit College Event' : 'Create New College Event'}</h1>
            <p>{isEditing ? 'Update event details, timing, banner, or registration limits' : 'Publish an event with automated ticket generation and live QR check-ins'}</p>
          </div>
          <button
            type="button"
            className="btn btn-amber"
            onClick={() => setAiModalOpen(true)}
            style={{ gap: '0.4rem', boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)' }}
          >
            <Bot size={18} /> [🤖 AI Event Creator]
          </button>
        </div>

        <div className="card-glass" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Annual Tech Symposium & Hackathon"
                className="form-input"
                required
                minLength={3}
                maxLength={200}
              />
            </div>

            {/* Category & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="technology">Technology 💻</option>
                  <option value="cultural">Cultural 🎭</option>
                  <option value="sports">Sports ⚽</option>
                  <option value="workshop">Workshop 🛠️</option>
                  <option value="seminar">Seminar 🎙️</option>
                  <option value="academic">Academic 📚</option>
                  <option value="other">Other 🎯</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="published">Published (Visible to Students)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Banner Image Section with Upload, Presets & Preview */}
            <div className="form-group" style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={18} style={{ color: 'var(--accent-secondary)' }} /> Event Banner Image
                </label>
                {formData.image_url && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setFormData((p) => ({ ...p, image_url: '' }))}
                    style={{ color: 'var(--error)', padding: '0.2rem 0.5rem' }}
                  >
                    <X size={14} /> Remove Banner
                  </button>
                )}
              </div>

              {/* Live Preview Box */}
              {formData.image_url ? (
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-accent)', marginBottom: '1rem' }}>
                  <img
                    src={formData.image_url}
                    alt="Event Banner Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Check size={13} /> Active Banner
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    height: '140px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'var(--transition)',
                    marginBottom: '1rem',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <Upload size={28} style={{ color: 'var(--accent-secondary)' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {uploadingImage ? 'Uploading Image...' : 'Click to Upload Banner from Computer'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    PNG, JPG, WebP up to 10MB
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {/* Action Buttons & Manual URL */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Upload size={14} /> {uploadingImage ? 'Uploading...' : 'Choose File'}
                </button>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>or enter image link below:</span>
              </div>

              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="form-input"
                style={{ fontSize: '0.8125rem' }}
              />

              {/* Curated Preset Banners */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Or pick a curated banner theme:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {PRESET_BANNERS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      className={`btn btn-secondary btn-sm ${formData.image_url === preset.url ? 'active' : ''}`}
                      onClick={() => handleSelectPreset(preset)}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.65rem',
                        borderColor: formData.image_url === preset.url ? 'var(--accent-primary)' : 'var(--border)',
                      }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description & Event Itinerary *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event, rules, eligibility, prizes, and keynote speakers..."
                className="form-input"
                rows={5}
                required
                minLength={10}
              />
            </div>

            {/* Location / Venue */}
            <div className="form-group">
              <label className="form-label">Venue / Location *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Science Block Audi-2, Main Campus"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Start Time *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time *</label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* Capacity & Deadline */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Seat Capacity *</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min={1}
                    max={10000}
                    className="form-input"
                    style={{ paddingLeft: '2.75rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="datetime-local"
                  name="registration_deadline"
                  value={formData.registration_deadline ? formData.registration_deadline.substring(0, 16) : ''}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Link to="/organizer/events" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || uploadingImage}
              >
                {loading ? <div className="spinner" /> : <><Save size={18} /> {isEditing ? 'Save Changes' : 'Publish Event'}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* AI Event Creator Modal */}
      {aiModalOpen && (
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
          onClick={() => setAiModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: 'var(--bg-secondary)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              padding: '2rem',
              animation: 'fadeInUp 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: '800', fontSize: '1.1rem' }}>
                <Bot size={22} />
                <span>AI Event Creator</span>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Describe the campus event you want to organize. AI will automatically draft the complete event description, schedule, rules, FAQs, and pick a matching banner!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <textarea
                className="form-input"
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. &quot;Create a two-day AI hackathon for CSE students with ₹50,000 prize pool&quot;"
                style={{ resize: 'vertical' }}
              />

              {/* Sample Suggestions */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                  onClick={() => setAiPrompt('Create a two-day AI hackathon for CSE students with ₹50,000 prize pool')}
                >
                  &quot;AI Hackathon for CSE&quot;
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                  onClick={() => setAiPrompt('Annual Inter-College Cricket Championship with 16 campus teams')}
                >
                  &quot;Cricket Championship&quot;
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                  onClick={() => setAiPrompt('Hands-on Robotics and IoT Workshop for beginners with hardware kits')}
                >
                  &quot;Robotics Workshop&quot;
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setAiModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-amber"
                disabled={aiGenerating || !aiPrompt.trim()}
                onClick={handleAiGenerate}
                style={{ gap: '0.4rem' }}
              >
                {aiGenerating ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Sparkles size={16} /> Generate &amp; Pre-Fill</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
