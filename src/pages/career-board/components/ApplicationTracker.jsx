import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ApplicationTracker = ({ applications, onViewApplication, onWithdrawApplication }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Applications', count: applications?.length },
    { value: 'applied', label: 'Applied', count: applications?.filter(app => app?.status === 'applied')?.length },
    { value: 'reviewing', label: 'Under Review', count: applications?.filter(app => app?.status === 'reviewing')?.length },
    { value: 'interview', label: 'Interview', count: applications?.filter(app => app?.status === 'interview')?.length },
    { value: 'offered', label: 'Offered', count: applications?.filter(app => app?.status === 'offered')?.length },
    { value: 'rejected', label: 'Rejected', count: applications?.filter(app => app?.status === 'rejected')?.length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-primary/10 text-primary';
      case 'reviewing': return 'bg-warning/10 text-warning';
      case 'interview': return 'bg-secondary/10 text-secondary';
      case 'offered': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return 'Send';
      case 'reviewing': return 'Eye';
      case 'interview': return 'Users';
      case 'offered': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      default: return 'Circle';
    }
  };

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications?.filter(app => app?.status === statusFilter);

  const formatSalary = (min, max) => {
    const formatNumber = (num) => {
      if (num >= 10000000) return `₹${(num / 10000000)?.toFixed(1)}Cr`;
      if (num >= 100000) return `₹${(num / 100000)?.toFixed(1)}L`;
      if (num >= 1000) return `₹${(num / 1000)?.toFixed(0)}K`;
      return `₹${num}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Application Tracker</h2>
          <p className="text-muted-foreground">Track your job application progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Briefcase" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">{filteredApplications?.length} applications</span>
        </div>
      </div>
      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {statusOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setStatusFilter(option?.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{option?.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                statusFilter === option?.value
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-foreground/10 text-foreground'
              }`}>
                {option?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications?.map((application) => (
          <div key={application?.id} className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <Image 
                    src={application?.companyLogo} 
                    alt={application?.company}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">{application?.jobTitle}</h3>
                  <p className="text-muted-foreground font-medium mb-2">{application?.company}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{application?.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>Applied {application?.appliedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-foreground">
                      {formatSalary(application?.salaryMin, application?.salaryMax)}
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application?.status)}`}>
                      <Icon name={getStatusIcon(application?.status)} size={12} />
                      <span className="capitalize">{application?.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Clock" size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Application Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                {['applied', 'reviewing', 'interview', 'offered']?.map((step, index) => {
                  const isCompleted = ['applied', 'reviewing', 'interview', 'offered']?.indexOf(application?.status) >= index;
                  const isCurrent = application?.status === step;
                  
                  return (
                    <React.Fragment key={step}>
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        isCompleted 
                          ? 'bg-primary border-primary' 
                          : isCurrent
                          ? 'bg-warning border-warning' :'bg-muted border-muted'
                      }`} />
                      {index < 3 && (
                        <div className={`flex-1 h-0.5 ${
                          isCompleted ? 'bg-primary' : 'bg-muted'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Next Steps */}
            {application?.nextSteps && (
              <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Next Steps</h4>
                    <p className="text-sm text-muted-foreground">{application?.nextSteps}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Interview Details */}
            {application?.status === 'interview' && application?.interviewDetails && (
              <div className="mb-4 p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Calendar" size={16} className="text-secondary mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Interview Scheduled</h4>
                    <p className="text-sm text-muted-foreground">
                      {application?.interviewDetails?.date} at {application?.interviewDetails?.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application?.interviewDetails?.type} - {application?.interviewDetails?.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last updated: {application?.lastUpdated}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplication(application)}
                >
                  View Details
                </Button>
                {application?.status === 'applied' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onWithdrawApplication(application?.id)}
                    className="text-error hover:text-error"
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredApplications?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Briefcase" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
          <p className="text-muted-foreground">
            {statusFilter === 'all' ? "You haven't applied to any jobs yet" 
              : `No applications with ${statusFilter} status`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;