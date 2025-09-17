import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import NotFound from "pages/NotFound";
import AlumniProfile from './pages/alumni-profile';
import AlumniDirectory from './pages/alumni-directory';
import Login from './pages/login';
import AlumniDashboard from './pages/alumni-dashboard';
import CareerBoard from './pages/career-board';
import EventsManagement from './pages/events-management';
import Messages from './pages/messages';
import { useAuth } from './contexts/AuthContext';

const Routes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/alumni-dashboard" replace /> : <Login />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Navigate to="/alumni-dashboard" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumni-dashboard" 
          element={
            <ProtectedRoute>
              <AlumniDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumni-profile" 
          element={
            <ProtectedRoute>
              <AlumniProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumni-profile/:id" 
          element={
            <ProtectedRoute>
              <AlumniProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumni-directory" 
          element={
            <ProtectedRoute>
              <AlumniDirectory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/career-board" 
          element={
            <ProtectedRoute>
              <CareerBoard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
