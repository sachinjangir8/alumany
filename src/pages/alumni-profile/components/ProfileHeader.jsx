import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ profile, isOwnProfile, onConnect, onMessage, onRecommend, onEdit }) => {
  const [isConnected, setIsConnected] = useState(profile?.connectionStatus === 'connected');
  const [connectionStatus, setConnectionStatus] = useState(profile?.connectionStatus);

  const handleConnect = () => {
    if (connectionStatus === 'not_connected') {
      setConnectionStatus('pending');
      onConnect();
    }
  };

  const getConnectionButtonText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'pending':
        return 'Request Sent';
      default:
        return 'Connect';
    }
  };

  const getConnectionButtonVariant = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'success';
      case 'pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-primary to-secondary relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {profile?.isOnline && (
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white bg-opacity-90 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs font-medium text-foreground">Online</span>
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        {/* Profile Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-card shadow-elevation-2 overflow-hidden bg-muted">
              <Image
                src={profile?.profilePhoto}
                alt={`${profile?.name}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
            {profile?.isVerified && (
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-success rounded-full flex items-center justify-center border-2 border-card">
                <Icon name="Check" size={16} className="text-success-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 mt-4 sm:mt-0 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.name}</h1>
                <p className="text-lg text-muted-foreground">{profile?.currentPosition}</p>
                <p className="text-sm text-muted-foreground">{profile?.company}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={16} />
                    <span>{profile?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="GraduationCap" size={16} />
                    <span>{profile?.graduationYear}</span>
                  </div>
                </div>
              </div>

              {!isOwnProfile ? (
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button
                    variant={getConnectionButtonVariant()}
                    onClick={handleConnect}
                    disabled={connectionStatus === 'pending' || connectionStatus === 'connected'}
                    iconName={connectionStatus === 'connected' ? 'UserCheck' : 'UserPlus'}
                    iconPosition="left"
                  >
                    {getConnectionButtonText()}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onMessage}
                    iconName="MessageCircle"
                    iconPosition="left"
                  >
                    Message
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onRecommend}
                    iconName="ThumbsUp"
                    size="icon"
                  >
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <Button
                    variant="default"
                    onClick={onEdit}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.connections}</div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.events}</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile?.recommendations}</div>
            <div className="text-sm text-muted-foreground">Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;