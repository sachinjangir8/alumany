import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlumniCard = ({ 
  alumni, 
  isSelected, 
  onSelectionChange, 
  onConnect, 
  onMessage, 
  onViewProfile 
}) => {
  const getConnectionStatus = (status) => {
    switch (status) {
      case 'connected':
        return { text: 'Connected', color: 'text-success', bgColor: 'bg-success/10' };
      case 'pending':
        return { text: 'Pending', color: 'text-warning', bgColor: 'bg-warning/10' };
      case 'not_connected':
      default:
        return { text: 'Connect', color: 'text-primary', bgColor: 'bg-primary/10' };
    }
  };

  const connectionStatus = getConnectionStatus(alumni?.connectionStatus || 'not_connected');

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200 hover-lift">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Image
            src={alumni?.avatar_url || '/assets/images/no_image.png'}
            alt={`${alumni?.full_name} profile`}
            className="w-16 h-16 rounded-full object-cover"
          />
          {alumni?.is_online && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-2 border-card rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-lg truncate">
                {alumni?.full_name || 'Unknown Name'}
              </h3>
              <p className="text-sm text-muted-foreground">{alumni?.current_position || 'Position not specified'}</p>
              <p className="text-sm text-muted-foreground">{alumni?.company || 'Company not specified'}</p>
            </div>
            <div className="flex items-center space-x-2">
              {onSelectionChange && (
                <input
                  type="checkbox"
                  checked={isSelected || false}
                  onChange={(e) => onSelectionChange?.(alumni?.id, e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
                />
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${connectionStatus?.color} ${connectionStatus?.bgColor}`}>
                {connectionStatus?.text}
              </span>
            </div>
          </div>
          
          <div className="mt-3 space-y-1">
            {alumni?.department && alumni?.graduation_year && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="GraduationCap" size={14} className="mr-2" />
                <span>{alumni?.department} • Class of {alumni?.graduation_year}</span>
              </div>
            )}
            {alumni?.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} className="mr-2" />
                <span>{alumni?.location}</span>
              </div>
            )}
            {alumni?.industry && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Icon name="Building" size={14} className="mr-2" />
                <span>{alumni?.industry}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex items-center space-x-2">
            {(!alumni?.connectionStatus || alumni?.connectionStatus === 'not_connected') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onConnect?.(alumni?.id)}
                iconName="UserPlus"
                iconPosition="left"
                iconSize={14}
              >
                Connect
              </Button>
            )}
            
            {alumni?.connectionStatus === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                disabled
                iconName="Clock"
                iconPosition="left"
                iconSize={14}
              >
                Pending
              </Button>
            )}
            
            {alumni?.connectionStatus === 'connected' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage?.(alumni?.id)}
                iconName="MessageCircle"
                iconPosition="left"
                iconSize={14}
              >
                Message
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewProfile?.(alumni?.id)}
              iconName="Eye"
              iconPosition="left"
              iconSize={14}
            >
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniCard;