import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { useAuth } from './contexts/AuthContext';
import SplashScreen from "components/SplashScreen";

const NotFound = lazy(() => import("pages/NotFound"));
const AlumniProfile = lazy(() => import('./pages/alumni-profile'));
const AlumniDirectory = lazy(() => import('./pages/alumni-directory'));
const Login = lazy(() => import('./pages/login'));
const AlumniDashboard = lazy(() => import('./pages/alumni-dashboard'));
const CareerBoard = lazy(() => import('./pages/career-board'));
const EventsManagement = lazy(() => import('./pages/events-management'));
const Messages = lazy(() => import('./pages/messages'));

const Routes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<SplashScreen message="Loading..." />}> 
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
          path="/events-management" 
          element={
            <ProtectedRoute>
              <EventsManagement />
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
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
