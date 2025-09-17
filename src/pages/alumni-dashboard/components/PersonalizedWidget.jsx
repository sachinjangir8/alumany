import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PersonalizedWidget = ({ type, title, data, onAction }) => {
  const navigate = useNavigate();

  const renderConnectionSuggestions = () => (
    <div className="space-y-3">
      {data?.slice(0, 3)?.map((person) => (
        <div key={person?.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Image
            src={person?.avatar}
            alt={person?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm">{person?.name}</h4>
            <p className="text-xs text-muted-foreground truncate">{person?.title} at {person?.company}</p>
            <p className="text-xs text-muted-foreground">{person?.mutualConnections} mutual connections</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('connect', person?.id)}
            className="shrink-0"
          >
            <Icon name="UserPlus" size={14} />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/alumni-directory')}
        className="w-full"
      >
        View All Suggestions
      </Button>
    </div>
  );

  const renderNearbyAlumni = () => (
    <div className="space-y-3">
      {data?.slice(0, 3)?.map((person) => (
        <div key={person?.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <Image
            src={person?.avatar}
            alt={person?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground text-sm">{person?.name}</h4>
            <p className="text-xs text-muted-foreground">{person?.title}</p>
            <div className="flex items-center space-x-1 mt-1">
              <Icon name="MapPin" size={12} className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{person?.distance} away</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAction('message', person?.id)}
            className="shrink-0"
          >
            <Icon name="MessageCircle" size={14} />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/alumni-directory?filter=nearby')}
        className="w-full"
      >
        View All Nearby
      </Button>
    </div>
  );

  const renderJobMatches = () => (
    <div className="space-y-3">
      {data?.slice(0, 2)?.map((job) => (
        <div key={job?.id} className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">{job?.title}</h4>
              <p className="text-xs text-muted-foreground">{job?.company} • {job?.location}</p>
            </div>
            <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
              {job?.match}% match
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{job?.postedTime}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/career-board?job=${job?.id}`)}
            >
              View
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/career-board')}
        className="w-full"
      >
        View All Jobs
      </Button>
    </div>
  );

  const getIcon = () => {
    switch (type) {
      case 'connections': return 'Users';
      case 'nearby': return 'MapPin';
      case 'jobs': return 'Briefcase';
      default: return 'Star';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={getIcon()} size={16} className="text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      
      {type === 'connections' && renderConnectionSuggestions()}
      {type === 'nearby' && renderNearbyAlumni()}
      {type === 'jobs' && renderJobMatches()}
    </div>
  );
};

export default PersonalizedWidget;