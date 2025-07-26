// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, adminOnly = false }) {
  // 1. Get the 'loading' state from the context
  const { user, loading } = useAuth();

  // 2. While the context is checking for a user, return nothing
  if (loading) {
    return null; // Or return a loading spinner component: <Spinner />
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // 3. (Optional) Corrected role to be case-sensitive for consistency
  if (adminOnly && user.role !== 'ADMIN') {
    // Logged in but not an admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // Authorized, render the child components
  return children;
}