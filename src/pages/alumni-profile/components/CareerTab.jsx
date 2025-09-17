import React from 'react';
import Icon from '../../../components/AppIcon';

const CareerTab = ({ career }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Career History</h3>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {career?.map((job, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className={`relative z-10 w-4 h-4 rounded-full border-2 ${
                job?.isCurrent 
                  ? 'bg-primary border-primary' :'bg-card border-border'
              }`}>
                {job?.isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-primary animate-pulse"></div>
                )}
              </div>

              {/* Job Details */}
              <div className="flex-1 border border-border rounded-lg p-4 bg-card hover:shadow-elevation-1 transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-semibold text-foreground">{job?.position}</h4>
                      {job?.isCurrent && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-base font-medium text-primary mb-1">{job?.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{job?.startDate} - {job?.endDate || 'Present'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={14} />
                        <span>{job?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{job?.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Icon name="Building" size={20} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {job?.description && (
                  <p className="text-sm text-muted-foreground mb-3">{job?.description}</p>
                )}

                {job?.responsibilities && job?.responsibilities?.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-foreground mb-2">Key Responsibilities</h5>
                    <ul className="space-y-1">
                      {job?.responsibilities?.map((responsibility, respIndex) => (
                        <li key={respIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Icon name="ChevronRight" size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job?.achievements && job?.achievements?.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-foreground mb-2">Key Achievements</h5>
                    <ul className="space-y-1">
                      {job?.achievements?.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Icon name="Star" size={14} className="mt-0.5 flex-shrink-0 text-warning" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job?.skills && job?.skills?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Skills Used</h5>
                    <div className="flex flex-wrap gap-2">
                      {job?.skills?.map((skill, skillIndex) => (
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
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Career Summary Stats */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Career Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">{career?.length}</div>
            <div className="text-sm text-muted-foreground">Positions</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {Math.max(...career?.map(job => parseInt(job?.duration?.split(' ')?.[0]) || 0))}
            </div>
            <div className="text-sm text-muted-foreground">Years (Longest)</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {new Set(career.map(job => job.company))?.size}
            </div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {new Set(career.map(job => job.location))?.size}
            </div>
            <div className="text-sm text-muted-foreground">Locations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTab;