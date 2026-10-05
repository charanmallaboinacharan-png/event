import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTickets from './pages/MyTickets';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import ManageEvents from './pages/organizer/ManageEvents';
import CreateEditEvent from './pages/organizer/CreateEditEvent';
import EventParticipants from './pages/organizer/EventParticipants';
import QRScanner from './pages/organizer/QRScanner';

import Welcome from './pages/Welcome';
import Certificates from './pages/Certificates';
import VerifyCertificate from './pages/VerifyCertificate';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
            <Routes>
              {/* Public Gateway & Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/verify-certificate/:certId" element={<VerifyCertificate />} />

              {/* Auth Only For Guests */}
              <Route
                path="/login"
                element={
                  <PublicOnlyRoute>
                    <Login />
                  </PublicOnlyRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicOnlyRoute>
                    <Register />
                  </PublicOnlyRoute>
                }
              />

              {/* Student Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Organizer Protected Routes */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <ManageEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/new"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <CreateEditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/:id/edit"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <CreateEditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/:id/participants"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <EventParticipants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/scanner"
                element={
                  <ProtectedRoute requireRole="organizer">
                    <QRScanner />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Clean Modern Footer */}
          <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '2.5rem 0', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="logo" style={{ fontSize: '1.2rem' }}>EventEase</span>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Next-generation campus event management & QR ticketing platform
                </p>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                &copy; {new Date().getFullYear()} Event Ease. All rights reserved.
              </div>
            </div>
          </footer>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0d1224',
                color: '#f1f5f9',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
            }}
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
