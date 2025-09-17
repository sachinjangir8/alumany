import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-elevation-2">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-foreground" fill="currentColor">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              <path d="M12 16L13.09 22.26L22 23L13.09 23.74L12 30L10.91 23.74L2 23L10.91 22.26L12 16Z" opacity="0.6"/>
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground">AlumniConnect</h1>
            <p className="text-sm text-muted-foreground">Government of Punjab</p>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Welcome to Punjab's Premier Alumni Network
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Connect with fellow alumni, access career opportunities, and stay engaged with your educational community through our secure platform.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Users" size={20} className="text-primary" />
          </div>
          <p className="text-lg font-semibold text-foreground">50K+</p>
          <p className="text-xs text-muted-foreground">Alumni</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Building" size={20} className="text-secondary" />
          </div>
          <p className="text-lg font-semibold text-foreground">200+</p>
          <p className="text-xs text-muted-foreground">Institutions</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <p className="text-lg font-semibold text-foreground">1K+</p>
          <p className="text-xs text-muted-foreground">Events</p>
        </div>
      </div>
    </div>
  );
};

export default LoginHeader;