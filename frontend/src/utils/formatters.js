export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    // Handles '14:30:00' or '14:30'
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    return timeStr;
  } catch {
    return timeStr;
  }
};

export const getCategoryBadgeClass = (category) => {
  switch ((category || '').toLowerCase()) {
    case 'technology':
      return 'badge-info';
    case 'cultural':
      return 'badge-purple';
    case 'sports':
      return 'badge-success';
    case 'academic':
      return 'badge-warning';
    case 'workshop':
      return 'badge-purple';
    case 'seminar':
      return 'badge-warning';
    default:
      return 'badge-info';
  }
};

export const CATEGORIES = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'technology', label: 'Technology', icon: '💻' },
  { id: 'cultural', label: 'Cultural', icon: '🎭' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'workshop', label: 'Workshops', icon: '🛠️' },
  { id: 'seminar', label: 'Seminars', icon: '🎙️' },
  { id: 'academic', label: 'Academic', icon: '📚' },
  { id: 'other', label: 'Other', icon: '🎯' },
];
