import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobCard = ({ job, onViewDetails, onApply, onSave, userRole }) => {
  const [isSaved, setIsSaved] = useState(job?.isSaved || false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(job?.id, !isSaved);
  };

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 10000000) return `₹${(num / 10000000)?.toFixed(1)}Cr`;
      if (num >= 100000) return `₹${(num / 100000)?.toFixed(1)}L`;
      if (num >= 1000) return `₹${(num / 1000)?.toFixed(0)}K`;
      return `₹${num}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getExperienceColor = (level) => {
    switch (level) {
      case 'Entry Level': return 'bg-success/10 text-success';
      case 'Mid Level': return 'bg-warning/10 text-warning';
      case 'Senior Level': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'Full-time': return 'bg-primary/10 text-primary';
      case 'Part-time': return 'bg-secondary/10 text-secondary';
      case 'Contract': return 'bg-warning/10 text-warning';
      case 'Remote': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src={job?.companyLogo} 
              alt={job?.company}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
              {job?.title}
            </h3>
            <p className="text-muted-foreground font-medium mb-2">{job?.company}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{job?.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{job?.postedDate}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(job?.experienceLevel)}`}>
                {job?.experienceLevel}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job?.jobType)}`}>
                {job?.jobType}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-foreground">
                {formatSalary(job?.salaryMin, job?.salaryMax)}
                <span className="text-sm text-muted-foreground font-normal">/year</span>
              </div>
              {job?.isUrgent && (
                <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  Urgent Hiring
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={isSaved ? 'text-accent' : 'text-muted-foreground'}
        >
          <Icon name={isSaved ? "Heart" : "Heart"} size={18} fill={isSaved ? "currentColor" : "none"} />
        </Button>
      </div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job?.description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {job?.skills?.slice(0, 3)?.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
              {skill}
            </span>
          ))}
          {job?.skills?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{job?.skills?.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(job)}
          >
            View Details
          </Button>
          {(userRole === 'student' || userRole === 'alumni') && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApply(job)}
              disabled={job?.hasApplied}
            >
              {job?.hasApplied ? 'Applied' : 'Apply Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;