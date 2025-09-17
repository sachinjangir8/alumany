import React from 'react';
import Icon from './AppIcon';

const SplashScreen = ({ message = "Loading AlumniConnect..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-elevation-2">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-foreground" fill="currentColor">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            <path d="M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z" opacity="0.6"/>
          </svg>
        </div>
        
        {/* App Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">AlumniConnect</h1>
        <p className="text-sm text-muted-foreground mb-8">Government of Punjab</p>
        
        {/* Loading Animation */}
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading Message */}
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default SplashScreen;