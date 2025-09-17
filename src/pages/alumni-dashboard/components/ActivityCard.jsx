import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActivityCard = ({ activity, onReply, onLike, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReply = () => {
    if (replyText?.trim()) {
      onReply(activity?.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job': return 'Briefcase';
      case 'event': return 'Calendar';
      case 'mentorship': return 'Users';
      case 'update': return 'User';
      case 'achievement': return 'Award';
      default: return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'job': return 'text-blue-600';
      case 'event': return 'text-green-600';
      case 'mentorship': return 'text-purple-600';
      case 'update': return 'text-gray-600';
      case 'achievement': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <Image
            src={activity?.author?.avatar}
            alt={activity?.author?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-elevation-1`}>
            <Icon name={getActivityIcon(activity?.type)} size={14} className={getActivityColor(activity?.type)} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{activity?.author?.name}</h3>
              <p className="text-sm text-muted-foreground">{activity?.author?.title} • {activity?.author?.company}</p>
            </div>
            <span className="text-sm text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="mb-4">
        <h4 className="font-medium text-foreground mb-2">{activity?.title}</h4>
        <p className={`text-muted-foreground ${isExpanded ? '' : 'line-clamp-3'}`}>
          {activity?.content}
        </p>
        
        {activity?.content?.length > 150 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
      {/* Tags */}
      {activity?.tags && activity?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activity?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(activity?.id)}
            className={`flex items-center space-x-2 ${activity?.isLiked ? 'text-red-600' : 'text-muted-foreground'}`}
          >
            <Icon name={activity?.isLiked ? 'Heart' : 'Heart'} size={16} />
            <span>{activity?.likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center space-x-2 text-muted-foreground"
          >
            <Icon name="MessageCircle" size={16} />
            <span>{activity?.comments}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(activity?.id)}
            className="flex items-center space-x-2 text-muted-foreground"
          >
            <Icon name="Share2" size={16} />
            <span>Share</span>
          </Button>
        </div>

        {activity?.type === 'job' && (
          <Button variant="outline" size="sm">
            View Details
          </Button>
        )}
        
        {activity?.type === 'event' && (
          <Button variant="default" size="sm">
            Register
          </Button>
        )}
      </div>
      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex space-x-3">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Your avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e?.target?.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows="2"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText?.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;