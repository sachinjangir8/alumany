import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import JobPostingModal from './components/JobPostingModal';
import JobDetailsModal from './components/JobDetailsModal';
import MentorshipSection from './components/MentorshipSection';
import ApplicationTracker from './components/ApplicationTracker';
import { useAuth } from '../../contexts/AuthContext';
import { jobsService, handleSupabaseError } from '../../utils/supabaseService';

const CareerBoard = () => {
  const { user, userProfile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    location: '',
    company: '',
    sortBy: 'recent'
  });

  // Load jobs and applications data
  useEffect(() => {
    loadJobsData();
    if (user) {
      loadApplicationsData();
    }
  }, [filters, user]);

  const loadJobsData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await jobsService?.getActiveJobs(filters);
      
      if (fetchError) {
        setError(handleSupabaseError(fetchError, 'Failed to load job postings'));
        return;
      }

      setJobs(data || []);
    } catch (error) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadApplicationsData = async () => {
    try {
      const { data, error: fetchError } = await jobsService?.getUserApplications();
      
      if (fetchError) {
        console.error('Failed to load applications:', fetchError);
        return;
      }

      setMyApplications(data || []);
    } catch (error) {
      console.error('Network error loading applications:', error);
    }
  };

  const handleJobAction = async (action, jobId, data = {}) => {
    if (!user && action !== 'view') {
      setError('Please sign in to perform this action');
      return;
    }

    try {
      switch (action) {
        case 'apply':
          const { error: applyError } = await jobsService?.applyForJob(jobId, data);
          if (applyError) {
            setError(handleSupabaseError(applyError, 'Failed to apply for job'));
            return;
          }
          
          // Refresh applications data
          await loadApplicationsData();
          alert('Application submitted successfully!');
          break;

        case 'view':
          const jobToView = jobs?.find(job => job?.id === jobId);
          if (jobToView) {
            setSelectedJob(jobToView);
            setShowDetailsModal(true);
          }
          break;

        case 'save':
          // TODO: Implement job saving functionality with Supabase
          try {
            // This would require a saved_jobs table in the database
            alert('Job saved to your favorites (Note: Database table for saved jobs needs to be created)');
          } catch (error) {
            setError('Failed to save job');
          }
          break;

        case 'share':
          // Implement job sharing functionality
          try {
            if (navigator.share) {
              const job = jobs?.find(j => j?.id === jobId);
              if (job) {
                await navigator.share({
                  title: job?.title,
                  text: `Check out this job opportunity: ${job?.title} at ${job?.company}`,
                  url: window.location.href + `?job=${jobId}`
                });
              }
            } else {
              // Fallback to clipboard
              const job = jobs?.find(j => j?.id === jobId);
              if (job) {
                const shareText = `Check out this job opportunity: ${job?.title} at ${job?.company} - ${window.location.href}?job=${jobId}`;
                await navigator.clipboard.writeText(shareText);
                alert('Job link copied to clipboard!');
              }
            }
          } catch (error) {
            setError('Failed to share job');
          }
          break;

        default:
          break;
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handlePostJob = async (jobData) => {
    if (!user) {
      setError('Please sign in to post jobs');
      return;
    }

    try {
      const { data, error: createError } = await jobsService?.create({
        ...jobData,
        posted_by: user?.id
      });

      if (createError) {
        setError(handleSupabaseError(createError, 'Failed to post job'));
        return;
      }

      // Add new job to local state
      setJobs(prev => [data, ...prev]);
      setShowJobModal(false);
      
      alert('Job posted successfully!');
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const canPostJobs = userProfile?.role === 'administrator' || 
                      userProfile?.role === 'alumni' || 
                      userProfile?.role === 'faculty' ||
                      userProfile?.role === 'management';

  const stats = {
    totalJobs: jobs?.length || 0,
    myApplications: myApplications?.length || 0,
    pendingApplications: myApplications?.filter(app => app?.status === 'applied')?.length || 0,
    acceptedApplications: myApplications?.filter(app => app?.status === 'accepted')?.length || 0
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Career Board - AlumniConnect</title>
        <meta name="description" content="Explore job opportunities, post openings, and track your applications through the alumni network." />
      </Helmet>
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Career Board</h1>
              <p className="text-muted-foreground mt-1">
                Discover job opportunities and advance your career through our alumni network
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {canPostJobs && (
                <Button
                  variant="default"
                  onClick={() => setShowJobModal(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Post Job
                </Button>
              )}
              
              {user && (
                <Button
                  variant="outline"
                  onClick={() => setShowTracker(!showTracker)}
                  iconName="Target"
                  iconPosition="left"
                >
                  My Applications
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={loadJobsData}
                iconName="RefreshCw"
                iconPosition="left"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats?.totalJobs}</div>
              <div className="text-sm text-muted-foreground">Available Jobs</div>
            </div>
            <div className="bg-success/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats?.myApplications}</div>
              <div className="text-sm text-muted-foreground">My Applications</div>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning">{stats?.pendingApplications}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="bg-info/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-info">{stats?.acceptedApplications}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-6 mb-6">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'jobs' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Job Openings
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`pb-2 px-1 border-b-2 transition-colors ${
                activeTab === 'mentorship' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Mentorship
            </button>
          </div>

          {/* Filters - only show for jobs tab */}
          {activeTab === 'jobs' && (
            <JobFilters
              filters={filters}
              onFilterChange={setFilters}
              onFiltersChange={setFilters}
              jobCount={jobs?.length || 0}
              onClearFilters={() => setFilters({
                search: '',
                jobType: '',
                location: '',
                company: '',
                sortBy: 'recent'
              })}
            />
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">Error Loading Content</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => setError('')}
                className="text-red-600 text-sm underline mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Application Tracker */}
        {showTracker && user && (
          <div className="mb-8">
            <ApplicationTracker 
              applications={myApplications}
              onClose={() => setShowTracker(false)}
              onViewApplication={(applicationId) => {
                // TODO: Implement view application functionality
                console.log('View application:', applicationId);
              }}
              onWithdrawApplication={async (applicationId) => {
                // TODO: Implement withdraw application functionality
                console.log('Withdraw application:', applicationId);
                await loadApplicationsData();
              }}
            />
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'jobs' ? (
          // Job Listings
          (loading ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 })?.map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map(job => (
              <JobCard
                key={job?.id}
                job={job}
                onAction={handleJobAction}
                onViewDetails={(jobId) => handleJobAction('view', jobId)}
                onApply={(jobId, data) => handleJobAction('apply', jobId, data)}
                onSave={(jobId) => handleJobAction('save', jobId)}
                hasApplied={myApplications?.some(app => app?.job_id === job?.id)}
                userRole={userProfile?.role}
              />
            ))}
          </div>))
        ) : (
          // Mentorship Section
          (<MentorshipSection 
            onConnectMentor={(mentorId) => {
              // TODO: Implement mentor connection functionality
              console.log('Connect with mentor:', mentorId);
            }}
          />)
        )}

        {/* Empty State for Jobs */}
        {activeTab === 'jobs' && !loading && jobs?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Briefcase" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Jobs Found</h3>
            <p className="text-muted-foreground mb-4">
              No job postings match your current filters. Try adjusting your search criteria.
            </p>
            {canPostJobs && (
              <Button
                variant="default"
                onClick={() => setShowJobModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Post First Job
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Modals */}
      {showJobModal && (
        <JobPostingModal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          onSubmit={handlePostJob}
          userRole={userProfile?.role}
        />
      )}
      {showDetailsModal && selectedJob && (
        <JobDetailsModal
          isOpen={showDetailsModal}
          job={selectedJob}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedJob(null);
          }}
          onAction={handleJobAction}
          onApply={(jobId, data) => handleJobAction('apply', jobId, data)}
          hasApplied={myApplications?.some(app => app?.job_id === selectedJob?.id)}
          userRole={userProfile?.role}
        />
      )}
    </div>
  );
};

export default CareerBoard;