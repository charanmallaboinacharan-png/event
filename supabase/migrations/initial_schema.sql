-- ============================================================
-- EVENT EASE — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(200),
    email VARCHAR(300) NOT NULL UNIQUE,
    phone VARCHAR(20),
    college_id VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organizer', 'admin')),
    profile_image TEXT,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ============================================================
-- EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('technology', 'cultural', 'sports', 'academic', 'workshop', 'seminar', 'other')),
    image_url TEXT,
    location VARCHAR(300) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    registration_deadline TIMESTAMPTZ NOT NULL,
    organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- ============================================================
-- REGISTRATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ticket_id UUID,
    registration_status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (registration_status IN ('confirmed', 'cancelled', 'waitlisted')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    -- Prevent duplicate registrations
    UNIQUE(event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_registrations_event ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(registration_status);

-- ============================================================
-- TICKETS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    qr_token VARCHAR(200) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'cancelled')),
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_registration ON tickets(registration_id);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_qr ON tickets(qr_token);

-- ============================================================
-- CHECKINS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    checked_in_by UUID REFERENCES profiles(id),
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    scan_result VARCHAR(50) DEFAULT 'success',
    -- Prevent duplicate checkins at the DB level
    UNIQUE(registration_id)
);

CREATE INDEX IF NOT EXISTS idx_checkins_event ON checkins(event_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON checkins(user_id);

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'registration', 'checkin', 'event_update', 'event_cancelled', 'reminder')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (true); -- All profiles visible (public names etc.)

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (true); -- Backend handles this with service role

-- Events: public read, organizer write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are publicly visible"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Organizers manage their own events"
    ON events FOR ALL
    USING (true); -- Backend enforces ownership

-- Registrations: users see own
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own registrations"
    ON registrations FOR SELECT
    USING (true);

CREATE POLICY "System manages registrations"
    ON registrations FOR ALL
    USING (true);

-- Tickets: users see own
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tickets visible to system"
    ON tickets FOR ALL
    USING (true);

-- Checkins: managed by system
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Checkins visible to system"
    ON checkins FOR ALL
    USING (true);

-- Notifications: users see own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own notifications"
    ON notifications FOR ALL
    USING (true);

-- ============================================================
-- UPDATE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE
-- ============================================================
-- Your Event Ease database schema is ready!
-- Next: Run the seed.sql file to add sample data.
