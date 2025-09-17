import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCard = ({ event, onViewDetails, onEdit, onManageAttendees }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{event?.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event?.status)}`}>
              {event?.status?.charAt(0)?.toUpperCase() + event?.status?.slice(1)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{event?.description}</p>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(event)}
            className="text-primary hover:text-primary"
          >
            <Icon name="Eye" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(event)}
            className="text-secondary hover:text-secondary"
          >
            <Icon name="Edit" size={16} />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Calendar" size={16} />
          <span>{formatDate(event?.date)} at {formatTime(event?.time)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span>{event?.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Users" size={16} />
          <span>{event?.registeredCount}/{event?.capacity} registered</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="IndianRupee" size={16} />
          <span>{event?.fee === 0 ? 'Free' : `₹${event?.fee?.toLocaleString('en-IN')}`}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(event?.registeredCount / event?.capacity) * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {Math.round((event?.registeredCount / event?.capacity) * 100)}% full
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onManageAttendees(event)}
          className="ml-4"
        >
          Manage Attendees
        </Button>
      </div>
    </div>
  );
};

export default EventCard;