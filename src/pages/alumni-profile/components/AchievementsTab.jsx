import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AchievementsTab = ({ achievements }) => {
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'award':
        return 'Award';
      case 'publication':
        return 'BookOpen';
      case 'patent':
        return 'Lightbulb';
      case 'recognition':
        return 'Star';
      case 'project':
        return 'Briefcase';
      default:
        return 'Trophy';
    }
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'award':
        return 'text-warning';
      case 'publication':
        return 'text-primary';
      case 'patent':
        return 'text-accent';
      case 'recognition':
        return 'text-success';
      case 'project':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Achievements & Recognition</h3>
      <div className="grid grid-cols-1 gap-6">
        {achievements?.map((achievement, index) => (
          <div key={index} className="border border-border rounded-lg p-6 bg-card hover:shadow-elevation-1 transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${getAchievementColor(achievement?.type)}`}>
                <Icon name={getAchievementIcon(achievement?.type)} size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-1">{achievement?.title}</h4>
                    <p className="text-base text-primary font-medium mb-1">{achievement?.organization}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{achievement?.date}</span>
                      </div>
                      {achievement?.location && (
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={14} />
                          <span>{achievement?.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Icon name="Tag" size={14} />
                        <span className="capitalize">{achievement?.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  {achievement?.image && (
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={achievement?.image}
                          alt={achievement?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">{achievement?.description}</p>

                {achievement?.details && achievement?.details?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-foreground mb-2">Details</h5>
                    <ul className="space-y-1">
                      {achievement?.details?.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Icon name="ChevronRight" size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {achievement?.skills && achievement?.skills?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-foreground mb-2">Related Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {achievement?.skills?.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {achievement?.links && achievement?.links?.length > 0 && (
                  <div className="flex items-center space-x-4">
                    {achievement?.links?.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <Icon name="ExternalLink" size={14} />
                        <span>{link?.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Achievement Categories Summary */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Achievement Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['award', 'publication', 'patent', 'recognition', 'project']?.map((type) => {
            const count = achievements?.filter(a => a?.type === type)?.length;
            return (
              <div key={type} className="text-center p-4 bg-muted rounded-lg">
                <Icon 
                  name={getAchievementIcon(type)} 
                  size={24} 
                  className={`mx-auto mb-2 ${getAchievementColor(type)}`} 
                />
                <div className="text-xl font-bold text-foreground">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">{type}s</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsTab;