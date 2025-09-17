import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      title: 'Government of Punjab',
      subtitle: 'Official Platform',
      icon: 'Shield',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 2,
      title: 'Secure Authentication',
      subtitle: 'SSL Encrypted',
      icon: 'Lock',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'Data Protection',
      subtitle: 'Privacy Compliant',
      icon: 'ShieldCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const certifications = [
    {
      id: 1,
      name: 'ISO 27001',
      description: 'Information Security Management',
      verified: true
    },
    {
      id: 2,
      name: 'GDPR Compliant',
      description: 'Data Protection Regulation',
      verified: true
    },
    {
      id: 3,
      name: 'Educational Standards',
      description: 'Institutional Accreditation',
      verified: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge) => (
          <div
            key={badge?.id}
            className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border hover:shadow-elevation-1 transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg ${badge?.bgColor} flex items-center justify-center`}>
              <Icon name={badge?.icon} size={20} className={badge?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{badge?.title}</p>
              <p className="text-xs text-muted-foreground">{badge?.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Award" size={20} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">Certifications & Compliance</h3>
        </div>
        
        <div className="space-y-3">
          {certifications?.map((cert) => (
            <div key={cert?.id} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground">{cert?.name}</p>
                  {cert?.verified && (
                    <Icon name="CheckCircle" size={16} className="text-green-600" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{cert?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 text-sm font-medium">Secure Login</p>
            <p className="text-blue-700 text-xs mt-1">
              Your login credentials are encrypted and protected. We never store your password in plain text.
            </p>
          </div>
        </div>
      </div>
      {/* Contact Support */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-2">Need help accessing your account?</p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <a
            href="mailto:support@alumniconnect.punjab.gov.in"
            className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
          >
            <Icon name="Mail" size={14} />
            <span>Email Support</span>
          </a>
          <span className="text-muted-foreground">|</span>
          <a
            href="tel:+911234567890"
            className="text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
          >
            <Icon name="Phone" size={14} />
            <span>Call Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;