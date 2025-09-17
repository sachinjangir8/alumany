import React from 'react';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';

const Login = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-lg">
            <LoginHeader />
            <LoginForm />
          </div>
        </div>

        {/* Right Section - Trust Signals & Information */}
        <div className="flex-1 bg-muted/30 p-6 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <TrustSignals />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} Government of Punjab. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;