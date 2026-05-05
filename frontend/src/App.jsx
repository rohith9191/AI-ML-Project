import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ExerciseDiscovery from './pages/ExerciseDiscovery';
import SessionMode from './pages/SessionMode';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent text-slate-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/therapist" element={<TherapistDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/exercises" element={<ExerciseDiscovery />} />
          <Route path="/session/:id" element={<SessionMode />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
