import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SharedContentTab = ({ sharedContent, onLike, onComment, onShare }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const contentTypes = [
    { id: 'all', label: 'All Content', icon: 'Grid3x3' },
    { id: 'post', label: 'Posts', icon: 'FileText' },
    { id: 'photo', label: 'Photos', icon: 'Image' },
    { id: 'article', label: 'Articles', icon: 'BookOpen' },
    { id: 'video', label: 'Videos', icon: 'Video' }
  ];

  const filteredContent = activeFilter === 'all' 
    ? sharedContent 
    : sharedContent?.filter(content => content?.type === activeFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date?.toLocaleDateString();
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'post':
        return 'FileText';
      case 'photo':
        return 'Image';
      case 'article':
        return 'BookOpen';
      case 'video':
        return 'Video';
      default:
        return 'FileText';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Shared Content</h3>
        <div className="text-sm text-muted-foreground">
          {filteredContent?.length} {activeFilter === 'all' ? 'items' : activeFilter + 's'}
        </div>
      </div>
      {/* Content Type Filters */}
      <div className="flex flex-wrap gap-2">
        {contentTypes?.map((type) => (
          <button
            key={type?.id}
            onClick={() => setActiveFilter(type?.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeFilter === type?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={type?.icon} size={16} />
            <span>{type?.label}</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-black/10 rounded-full">
              {type?.id === 'all' ? sharedContent?.length : sharedContent?.filter(c => c?.type === type?.id)?.length}
            </span>
          </button>
        ))}
      </div>
      {/* Content Grid */}
      <div className="space-y-6">
        {filteredContent?.map((content, index) => (
          <div key={index} className="border border-border rounded-lg bg-card hover:shadow-elevation-1 transition-shadow">
            {/* Content Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Icon name={getContentIcon(content?.type)} size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{content?.title}</span>
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full capitalize">
                        {content?.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{formatDate(content?.date)}</span>
                      <span>•</span>
                      <span>{content?.visibility}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Icon name="MoreHorizontal" size={16} />
                </Button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4">
              {content?.description && (
                <p className="text-muted-foreground mb-4">{content?.description}</p>
              )}

              {/* Media Content */}
              {content?.media && (
                <div className="mb-4">
                  {content?.type === 'photo' && (
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src={content?.media?.url}
                        alt={content?.media?.alt}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  {content?.type === 'video' && (
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <div className="aspect-video flex items-center justify-center">
                        <Button variant="ghost" size="lg" className="text-white">
                          <Icon name="Play" size={48} />
                        </Button>
                      </div>
                    </div>
                  )}
                  {content?.type === 'article' && content?.media?.thumbnail && (
                    <div className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={content?.media?.thumbnail}
                          alt={content?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{content?.media?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{content?.media?.excerpt}</p>
                        <a
                          href={content?.media?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              {content?.tags && content?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {content?.tags?.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content Footer */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => onLike(content?.id)}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      content?.isLiked
                        ? 'text-accent' :'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={content?.isLiked ? 'Heart' : 'Heart'} size={16} />
                    <span>{content?.likes}</span>
                  </button>
                  <button
                    onClick={() => onComment(content?.id)}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>{content?.comments}</span>
                  </button>
                  <button
                    onClick={() => onShare(content?.id)}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="Share2" size={16} />
                    <span>{content?.shares}</span>
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {content?.views} views
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredContent?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No content found</h3>
          <p className="text-muted-foreground">
            {activeFilter === 'all' ?'No shared content available yet.' 
              : `No ${activeFilter}s have been shared yet.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default SharedContentTab;