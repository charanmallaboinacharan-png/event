import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import {
  Search, Calendar, Clock, MapPin, Filter, X,
  Sparkles, ArrowRight, Bot, CheckCircle2, AlertCircle, ChevronRight, Zap
} from 'lucide-react';
import { formatDate, formatTime, getCategoryBadgeClass } from '../utils/formatters';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathon' },
  { id: 'workshop', label: 'Workshop' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'sports', label: 'Sports' },
  { id: 'technical', label: 'Technical' },
];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // AI Event Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [category, page]);

  const fetchEvents = async (searchOverride = null, catOverride = null) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: 12,
      };
      const activeSearch = searchOverride !== null ? searchOverride : search;
      const activeCategory = catOverride !== null ? catOverride : category;

      if (activeSearch.trim()) params.search = activeSearch.trim();
      if (activeCategory !== 'all') {
        // Map UI category to backend category
        if (activeCategory === 'hackathon' || activeCategory === 'technical') {
          params.category = 'technology';
        } else {
          params.category = activeCategory;
        }
      }
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await eventsAPI.getEvents(params);
      setEvents(res.data?.events || []);
      setTotalPages(res.data?.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setDateFrom('');
    setDateTo('');
    setPage(1);
    setAiResponse(null);
    setAiPrompt('');
    fetchEvents('', 'all');
  };

  // AI Event Assistant handler
  const handleAiSearch = (customQuery = null) => {
    const query = customQuery || aiPrompt;
    if (!query.trim()) return;

    setAiThinking(true);
    setAiResponse(null);

    setTimeout(() => {
      const q = query.toLowerCase();
      let matchedCategory = 'all';
      let searchKeyword = '';

      if (q.includes('hackathon') || q.includes('coding') || q.includes('ai') || q.includes('tech')) {
        matchedCategory = 'hackathon';
        searchKeyword = q.includes('ai') ? 'AI' : (q.includes('hackathon') ? 'Hackathon' : 'code');
      } else if (q.includes('music') || q.includes('cultural') || q.includes('fest') || q.includes('dance')) {
        matchedCategory = 'cultural';
        searchKeyword = 'fest';
      } else if (q.includes('sports') || q.includes('game') || q.includes('cricket') || q.includes('tournament')) {
        matchedCategory = 'sports';
        searchKeyword = 'sports';
      } else if (q.includes('workshop') || q.includes('seminar') || q.includes('talk')) {
        matchedCategory = 'workshop';
        searchKeyword = 'workshop';
      }

      setCategory(matchedCategory);
      setSearch(searchKeyword);
      fetchEvents(searchKeyword, matchedCategory);

      setAiThinking(false);
      setAiResponse({
        query,
        message: `I found top campus events matching "${query}". Showing real-time matches below!`,
      });
    }, 600);
  };

  return (
    <div className="page" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.9rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Campus Event Discovery
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', margin: 0 }}>Upcoming Events</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Browse hackathons, workshops, cultural galas, and tournaments across university clubs
          </p>
        </div>

        {/* ─── AI EVENT ASSISTANT ──────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem 1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontWeight: '700', fontSize: '0.9rem' }}>
              <Bot size={18} />
              <span>🤖 AI Event Assistant</span>
              <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', background: 'rgba(139, 92, 246, 0.25)', color: '#c4b5fd' }}>
                Instant Smart Match
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                onClick={() => {
                  setAiPrompt('Find me AI and coding events this week');
                  handleAiSearch('Find me AI and coding events this week');
                }}
              >
                &quot;AI and coding events&quot;
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                onClick={() => {
                  setAiPrompt('Upcoming sports and esports tournaments');
                  handleAiSearch('Upcoming sports and esports tournaments');
                }}
              >
                &quot;Sports &amp; Esports&quot;
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-full)' }}
                onClick={() => {
                  setAiPrompt('Cultural fests and musical nights');
                  handleAiSearch('Cultural fests and musical nights');
                }}
              >
                &quot;Cultural fests&quot;
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAiSearch();
            }}
            style={{ display: 'flex', gap: '0.75rem' }}
          >
            <input
              type="text"
              className="form-input"
              style={{ background: 'rgba(10, 14, 26, 0.7)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem', fontSize: '0.9rem' }}
              placeholder="Ask anything: e.g. &quot;Find me AI and coding events this week&quot;..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={aiThinking || !aiPrompt.trim()}
              style={{ whiteSpace: 'nowrap', gap: '0.4rem', padding: '0 1.25rem' }}
            >
              {aiThinking ? <div className="spinner" style={{ width: '16px', height: '16px' }} /> : <><Sparkles size={16} /> Ask AI</>}
            </button>
          </form>

          {aiResponse && (
            <div style={{ marginTop: '0.85rem', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} />
                <span>{aiResponse.message}</span>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* ─── SEARCH & FILTER CHIPS ───────────────────────────────── */}
        <div className="card-glass" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="search-bar" style={{ flex: '1 1 320px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)' }}>
                <Search size={18} style={{ color: 'var(--accent-secondary)' }} />
                <input
                  type="text"
                  placeholder="Search events 🔍 by title, club, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                Search
              </button>
              {(search || category !== 'all' || dateFrom || dateTo) && (
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Category Filter Chips as specified: [All] [Hackathon] [Workshop] [Cultural] [Sports] [Technical] */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginRight: '0.25rem', fontWeight: '600' }}>
                Filter:
              </span>
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setPage(1);
                  }}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    border: category === cat.id ? '1px solid rgba(6, 182, 212, 0.6)' : '1px solid var(--border)',
                    background: category === cat.id ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.25))' : 'rgba(255, 255, 255, 0.03)',
                    color: category === cat.id ? '#38bdf8' : 'var(--text-secondary)',
                    fontWeight: category === cat.id ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: category === cat.id ? '0 4px 12px rgba(6, 182, 212, 0.25)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Optional Date Picker */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.825rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Filter size={14} /> Filter by Event Date:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="date"
                  className="form-input"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span style={{ color: 'var(--text-muted)' }}>to</span>
                <input
                  type="date"
                  className="form-input"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.825rem', width: 'auto' }}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>

        {/* ─── EVENTS GRID ─────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <div className="spinner" style={{ width: '48px', height: '48px' }} />
          </div>
        ) : events.length === 0 ? (
          <div className="card-glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <Search size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No Events Found</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              We couldn&apos;t find any events matching your criteria. Try adjusting your search query or reset the filters.
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={clearFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {events.map((evt) => {
                const regCount = evt.current_registrations || evt.registered_count || 0;
                const capacity = evt.capacity || 100;
                const availableSeats = Math.max(0, capacity - regCount);

                return (
                  <div
                    key={evt.id}
                    className="card-glass event-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: 0,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                  >
                    {/* Event Image */}
                    <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
                      <img
                        src={evt.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'}
                        alt={evt.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Category & Free/Paid Badges */}
                      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                        <span className={`badge ${getCategoryBadgeClass(evt.category)}`}>
                          {evt.category}
                        </span>
                        <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.95)', color: '#fff', fontWeight: '700' }}>
                          Free Entry
                        </span>
                      </div>

                      {/* Available Seats Badge */}
                      <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(10, 14, 26, 0.85)', backdropFilter: 'blur(10px)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', fontWeight: '700', color: availableSeats > 10 ? '#10b981' : '#f59e0b' }}>
                        {availableSeats} seats left
                      </div>
                    </div>

                    {/* Event Body */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Host College / Organizer */}
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                        🏛️ University Campus • Club Event
                      </div>

                      {/* Event Name */}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                        {evt.title}
                      </h3>

                      {/* Event Details: Date, Time, Venue, Registration Deadline */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Calendar size={15} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                          <span>{formatDate(evt.event_date)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                          <span>Time: {formatTime(evt.start_time)} - {formatTime(evt.end_time)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <MapPin size={15} style={{ color: '#ec4899', flexShrink: 0 }} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            Venue: {evt.location}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <AlertCircle size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
                          <span>Deadline: {formatDate(evt.registration_deadline)}</span>
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/events/${evt.id}`}
                        className="btn btn-primary btn-full"
                        style={{ justifyContent: 'center', gap: '0.5rem' }}
                      >
                        View Details <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Page {page} of {totalPages}
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
