import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layouts';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import CertConnect from './pages/CertConnect';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Auth
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} /> {/* Handle /dashboard redirect */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/cert-connect" element={<CertConnect />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to dashboard if logged in, login if not (handled by ProtectedRoute logic implicitly via /) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;