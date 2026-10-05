-- ============================================================
-- EVENT EASE — SEED DATA (Development/Demo Only)
-- ============================================================
-- WARNING: This is sample data for development and testing.
-- Do NOT run in production without changing passwords.
-- ============================================================

-- Sample Organizer (password: organizer123)
INSERT INTO profiles (id, full_name, email, phone, college_id, role, password_hash)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dr. Sarah Mitchell',
    'organizer@eventease.dev',
    '+91 9876543210',
    'FAC-001',
    'organizer',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMnmX8YFdVvSQqN2L8WwK9WpWy'
) ON CONFLICT (email) DO NOTHING;

-- Sample Student (password: student123)
INSERT INTO profiles (id, full_name, email, phone, college_id, role, password_hash)
VALUES (
    'b2c3d4e5-f6a7-8901-bcde-fa2345678901',
    'Arjun S.N.',
    'student@eventease.dev',
    '+91 9876543211',
    'CS-2024-001',
    'student',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMnmX8YFdVvSQqN2L8WwK9WpWy'
) ON CONFLICT (email) DO NOTHING;

-- Sample Events
INSERT INTO events (title, description, category, location, event_date, start_time, end_time, capacity, registration_deadline, organizer_id, status, image_url)
VALUES
(
    'AI Hackathon 2026',
    'Join us for a 24-hour hackathon focused on building innovative AI solutions. Teams of 2-4 will compete to solve real-world problems using machine learning and artificial intelligence. Prizes worth ₹1,00,000 to be won!',
    'technology',
    'Main Auditorium, Block A',
    '2026-11-15',
    '09:00',
    '18:00',
    200,
    '2026-11-10 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop'
),
(
    'Tech Fest 2026',
    'Annual technology festival featuring workshops, competitions, and keynote speakers from top tech companies. Explore the latest in web development, cybersecurity, robotics, and more!',
    'technology',
    'Engineering Block, Lab Complex',
    '2026-11-20',
    '10:00',
    '17:00',
    500,
    '2026-11-15 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop'
),
(
    'Cultural Night 2026',
    'A spectacular evening of music, dance, and drama celebrating our diverse cultural heritage. Featuring performances from 20+ student groups, live band, and much more!',
    'cultural',
    'Open Air Theatre',
    '2026-12-05',
    '18:00',
    '22:00',
    800,
    '2026-12-01 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop'
),
(
    'Robotics Workshop',
    'Hands-on workshop on building and programming robots from scratch. Learn about sensors, actuators, microcontrollers, and autonomous systems. All materials provided!',
    'workshop',
    'Electronics Lab, Block C',
    '2026-11-25',
    '09:00',
    '16:00',
    60,
    '2026-11-20 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop'
),
(
    'Annual Sports Meet',
    'Compete in cricket, football, basketball, badminton, and athletics. Open to all students. Inter-department championship trophies and medals for top performers!',
    'sports',
    'Sports Complex & Ground',
    '2026-12-10',
    '08:00',
    '18:00',
    1000,
    '2026-12-05 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop'
),
(
    'Entrepreneurship Seminar',
    'Industry leaders and successful startup founders share their journey and insights. Learn about ideation, funding, building MVPs, and scaling your startup. Q&A session included.',
    'seminar',
    'Conference Hall, Admin Block',
    '2026-11-18',
    '14:00',
    '17:00',
    150,
    '2026-11-15 23:59:59+05:30',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'published',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop'
)
ON CONFLICT DO NOTHING;
