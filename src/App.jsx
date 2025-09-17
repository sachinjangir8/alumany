import React from "react";
import Routes from "./Routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SplashScreen from "./components/SplashScreen";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <SplashScreen message="Initializing your session..." />;
  }

  return <Routes />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;