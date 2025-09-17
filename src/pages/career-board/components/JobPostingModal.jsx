import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const JobPostingModal = ({ isOpen, onClose, onSubmit, userRole }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryMin: '',
    salaryMax: '',
    industry: '',
    description: '',
    requirements: '',
    skills: '',
    applicationDeadline: '',
    contactEmail: '',
    isUrgent: false
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const jobTypeOptions = [
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' }
  ];

  const experienceLevelOptions = [
    { value: 'Entry Level', label: 'Entry Level (0-2 years)' },
    { value: 'Mid Level', label: 'Mid Level (3-5 years)' },
    { value: 'Senior Level', label: 'Senior Level (6+ years)' }
  ];

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'retail', label: 'Retail' },
    { value: 'government', label: 'Government' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData?.company?.trim()) newErrors.company = 'Company name is required';
    if (!formData?.location?.trim()) newErrors.location = 'Location is required';
    if (!formData?.jobType) newErrors.jobType = 'Job type is required';
    if (!formData?.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
    if (!formData?.salaryMin) newErrors.salaryMin = 'Minimum salary is required';
    if (!formData?.salaryMax) newErrors.salaryMax = 'Maximum salary is required';
    if (!formData?.industry) newErrors.industry = 'Industry is required';
    if (!formData?.description?.trim()) newErrors.description = 'Job description is required';
    if (!formData?.requirements?.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData?.contactEmail?.trim()) newErrors.contactEmail = 'Contact email is required';

    if (formData?.salaryMin && formData?.salaryMax && parseInt(formData?.salaryMin) >= parseInt(formData?.salaryMax)) {
      newErrors.salaryMax = 'Maximum salary must be greater than minimum salary';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const jobData = {
        ...formData,
        skills: formData?.skills?.split(',')?.map(skill => skill?.trim())?.filter(skill => skill),
        salaryMin: parseInt(formData?.salaryMin),
        salaryMax: parseInt(formData?.salaryMax),
        postedDate: new Date()?.toLocaleDateString('en-GB'),
        postedBy: userRole
      };
      
      onSubmit(jobData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        jobType: '',
        experienceLevel: '',
        salaryMin: '',
        salaryMax: '',
        industry: '',
        description: '',
        requirements: '',
        skills: '',
        applicationDeadline: '',
        contactEmail: '',
        isUrgent: false
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Post New Job</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                error={errors?.title}
                required
              />
              <Input
                label="Company Name"
                type="text"
                placeholder="e.g. Tech Solutions Pvt Ltd"
                value={formData?.company}
                onChange={(e) => handleInputChange('company', e?.target?.value)}
                error={errors?.company}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Location"
                type="text"
                placeholder="e.g. Chandigarh, Punjab"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                error={errors?.location}
                required
              />
              <Select
                label="Job Type"
                placeholder="Select job type"
                options={jobTypeOptions}
                value={formData?.jobType}
                onChange={(value) => handleInputChange('jobType', value)}
                error={errors?.jobType}
                required
              />
              <Select
                label="Experience Level"
                placeholder="Select experience level"
                options={experienceLevelOptions}
                value={formData?.experienceLevel}
                onChange={(value) => handleInputChange('experienceLevel', value)}
                error={errors?.experienceLevel}
                required
              />
            </div>
          </div>

          {/* Compensation & Industry */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Compensation & Industry</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Minimum Salary (₹/year)"
                type="number"
                placeholder="e.g. 500000"
                value={formData?.salaryMin}
                onChange={(e) => handleInputChange('salaryMin', e?.target?.value)}
                error={errors?.salaryMin}
                required
              />
              <Input
                label="Maximum Salary (₹/year)"
                type="number"
                placeholder="e.g. 800000"
                value={formData?.salaryMax}
                onChange={(e) => handleInputChange('salaryMax', e?.target?.value)}
                error={errors?.salaryMax}
                required
              />
              <Select
                label="Industry"
                placeholder="Select industry"
                options={industryOptions}
                value={formData?.industry}
                onChange={(value) => handleInputChange('industry', value)}
                error={errors?.industry}
                required
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Job Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Description <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  value={formData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors?.description && (
                  <p className="text-sm text-error mt-1">{errors?.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Requirements <span className="text-accent">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="List the required qualifications, experience, and skills..."
                  value={formData?.requirements}
                  onChange={(e) => handleInputChange('requirements', e?.target?.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors?.requirements && (
                  <p className="text-sm text-error mt-1">{errors?.requirements}</p>
                )}
              </div>

              <Input
                label="Skills (comma-separated)"
                type="text"
                placeholder="e.g. React, Node.js, Python, SQL"
                value={formData?.skills}
                onChange={(e) => handleInputChange('skills', e?.target?.value)}
                description="Enter skills separated by commas"
              />
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Application Deadline"
                type="date"
                value={formData?.applicationDeadline}
                onChange={(e) => handleInputChange('applicationDeadline', e?.target?.value)}
                min={new Date()?.toISOString()?.split('T')?.[0]}
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="hr@company.com"
                value={formData?.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e?.target?.value)}
                error={errors?.contactEmail}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isUrgent"
                checked={formData?.isUrgent}
                onChange={(e) => handleInputChange('isUrgent', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <label htmlFor="isUrgent" className="text-sm text-foreground cursor-pointer">
                Mark as urgent hiring
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Post Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingModal;