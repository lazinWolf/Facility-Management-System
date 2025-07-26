// src/App.js
import React from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Public pages
import Home     from './pages/Home';
import Login    from './pages/Login';
import Register from './pages/Register';

// Protected pages
import Dashboard          from './pages/Dashboard';
import ComplaintsPage     from './pages/Complaints';
import BillsPage          from './pages/Bills';
import VisitorsPage       from './pages/Visitors';
import FacilitiesPage     from './pages/Facilities';
import Announcements      from './pages/Announcements';
import CreateAnnouncement from './pages/CreateAnnouncement';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"        element={<Home />} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register"element={<Register />} />

      {/* Protected layout wrapper */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Child routes rendered inside Layout’s <Outlet> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="complaints" element={<ComplaintsPage />} />
        <Route path="bills"      element={<BillsPage />} />
        <Route path="visitors"   element={<VisitorsPage />} />
        <Route path="facilities" element={<FacilitiesPage />} />
        <Route path="announcements" element={<Announcements />} />

        {/* Admin-only under same layout */}
        <Route
          path="announcements/new"
          element={
            <PrivateRoute adminOnly>
              <CreateAnnouncement />
            </PrivateRoute>
          }
        />

        {/* Fallback for unmatched protected paths */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
