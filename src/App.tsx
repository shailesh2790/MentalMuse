import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import AchievementsPage from './pages/AchievementsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AcceptanceTherapy from './pages/AcceptanceTherapy';
import MindfulQuest from './components/MindfulQuest';
import Navbar from './components/layout/Navbar';
import Onboarding from './components/Onboarding';
import VoiceJournal from './components/VoiceJournal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const hasCompletedOnboarding = localStorage.getItem('onboardingComplete') === 'true';

  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

function App() {
  // Check if it's the first visit
  const isFirstVisit = !localStorage.getItem('onboardingComplete');

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route */}
        <Route
          path="/"
          element={
            isFirstVisit ? (
              <Navigate to="/onboarding" replace />
            ) : !localStorage.getItem('isAuthenticated') ? (
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        {/* Onboarding Route */}
        <Route
          path="/onboarding"
          element={
            localStorage.getItem('onboardingComplete') === 'true' ? (
              <Navigate to="/login" replace />
            ) : (
              <Onboarding />
            )
          }
        />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            !localStorage.getItem('onboardingComplete') ? (
              <Navigate to="/onboarding" replace />
            ) : localStorage.getItem('isAuthenticated') === 'true' ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/acceptance-therapy"
          element={
            <ProtectedRoute>
              <AcceptanceTherapy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <VoiceJournal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <AchievementsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mindful-quest"
          element={
            <ProtectedRoute>
              <MindfulQuest />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;