import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationToast = ({ notification, onClose, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose(notification?.id);
    }, 300);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message': return 'MessageCircle';
      case 'event': return 'Calendar';
      case 'mentorship': return 'Users';
      case 'connection': return 'UserPlus';
      case 'job': return 'Briefcase';
      default: return 'Bell';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'message': return 'border-l-blue-500';
      case 'event': return 'border-l-green-500';
      case 'mentorship': return 'border-l-purple-500';
      case 'connection': return 'border-l-yellow-500';
      case 'job': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className={`fixed top-20 right-6 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`bg-card border border-border ${getColor(notification?.type)} border-l-4 rounded-lg shadow-elevation-3 p-4 max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Icon name={getIcon(notification?.type)} size={16} className="text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm">{notification?.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{notification?.message}</p>
            
            {notification?.actions && (
              <div className="flex space-x-2 mt-3">
                {notification?.actions?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.primary ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      onAction(notification?.id, action?.type);
                      handleClose();
                    }}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="shrink-0 w-6 h-6 p-0"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;