import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const JobDetailsModal = ({ job, isOpen, onClose, onApply, userRole }) => {
  const [activeTab, setActiveTab] = useState('description');

  if (!isOpen || !job) return null;

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

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    { id: 'requirements', label: 'Requirements', icon: 'CheckSquare' },
    { id: 'company', label: 'Company', icon: 'Building' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden m-4">
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src={job?.companyLogo} 
                  alt={job?.company}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{job?.title}</h2>
                    <p className="text-lg text-muted-foreground font-medium mb-3">{job?.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={16} />
                        <span>{job?.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={16} />
                        <span>Posted {job?.postedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={16} />
                        <span>{job?.applicants || 0} applicants</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExperienceColor(job?.experienceLevel)}`}>
                        {job?.experienceLevel}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job?.jobType)}`}>
                        {job?.jobType}
                      </span>
                      {job?.isUrgent && (
                        <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                          Urgent Hiring
                        </span>
                      )}
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {formatSalary(job?.salaryMin, job?.salaryMax)}
                      <span className="text-sm text-muted-foreground font-normal">/year</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <Icon name="X" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-0 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[50vh] p-6">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">{job?.description}</p>
                </div>
              </div>

              {job?.skills && job?.skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job?.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job?.benefits && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Benefits</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {job?.benefits?.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Requirements</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">{job?.requirements}</p>
                </div>
              </div>

              {job?.qualifications && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Qualifications</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {job?.qualifications?.map((qualification, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Icon name="GraduationCap" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <span>{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Experience Required</h4>
                  <p className="text-muted-foreground">{job?.experienceLevel}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Employment Type</h4>
                  <p className="text-muted-foreground">{job?.jobType}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <Image 
                    src={job?.companyLogo} 
                    alt={job?.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{job?.company}</h3>
                  <p className="text-muted-foreground mb-2">{job?.industry || 'Technology'}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{job?.companyLocation || job?.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={14} />
                      <span>{job?.companySize || '100-500'} employees</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">About the Company</h4>
                <p className="text-muted-foreground">
                  {job?.companyDescription || `${job?.company} is a leading organization in the ${job?.industry || 'technology'} sector, committed to innovation and excellence. We provide a dynamic work environment where talented professionals can grow their careers and make meaningful contributions to our mission.`}
                </p>
              </div>

              {job?.companyWebsite && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Website</h4>
                  <a
                    href={job?.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {job?.companyWebsite}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {job?.applicationDeadline && (
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>Apply by {job?.applicationDeadline}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {(userRole === 'student' || userRole === 'alumni') && (
                <Button
                  variant="default"
                  onClick={() => onApply(job)}
                  disabled={job?.hasApplied}
                >
                  {job?.hasApplied ? 'Applied' : 'Apply Now'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;