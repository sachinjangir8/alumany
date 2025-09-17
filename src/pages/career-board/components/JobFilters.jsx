import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const JobFilters = ({ filters, onFiltersChange, jobCount, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'retail', label: 'Retail' },
    { value: 'government', label: 'Government' }
  ];

  const experienceLevelOptions = [
    { value: '', label: 'All Levels' },
    { value: 'Entry Level', label: 'Entry Level (0-2 years)' },
    { value: 'Mid Level', label: 'Mid Level (3-5 years)' },
    { value: 'Senior Level', label: 'Senior Level (6+ years)' }
  ];

  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Remote', label: 'Remote' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Ludhiana', label: 'Ludhiana' },
    { value: 'Amritsar', label: 'Amritsar' },
    { value: 'Jalandhar', label: 'Jalandhar' },
    { value: 'Patiala', label: 'Patiala' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Remote', label: 'Remote' }
  ];

  const salaryRangeOptions = [
    { value: '', label: 'Any Salary' },
    { value: '0-300000', label: 'Up to ₹3L' },
    { value: '300000-500000', label: '₹3L - ₹5L' },
    { value: '500000-800000', label: '₹5L - ₹8L' },
    { value: '800000-1200000', label: '₹8L - ₹12L' },
    { value: '1200000-2000000', label: '₹12L - ₹20L' },
    { value: '2000000-', label: '₹20L+' }
  ];

  const postedDateOptions = [
    { value: '', label: 'Any Time' },
    { value: '1', label: 'Last 24 hours' },
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-foreground">Filter Jobs</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {jobCount} jobs found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
            >
              <Icon name="X" size={16} />
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </div>
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Search Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search jobs, companies, skills..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="col-span-full lg:col-span-1"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Select
            placeholder="Industry"
            options={industryOptions}
            value={filters?.industry || ''}
            onChange={(value) => handleFilterChange('industry', value)}
          />

          <Select
            placeholder="Experience Level"
            options={experienceLevelOptions}
            value={filters?.experienceLevel || ''}
            onChange={(value) => handleFilterChange('experienceLevel', value)}
          />

          <Select
            placeholder="Job Type"
            options={jobTypeOptions}
            value={filters?.jobType || ''}
            onChange={(value) => handleFilterChange('jobType', value)}
          />

          <Select
            placeholder="Location"
            options={locationOptions}
            value={filters?.location || ''}
            onChange={(value) => handleFilterChange('location', value)}
            searchable
          />

          <Select
            placeholder="Salary Range"
            options={salaryRangeOptions}
            value={filters?.salaryRange || ''}
            onChange={(value) => handleFilterChange('salaryRange', value)}
          />
        </div>

        {/* Additional Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            placeholder="Posted Date"
            options={postedDateOptions}
            value={filters?.postedDate || ''}
            onChange={(value) => handleFilterChange('postedDate', value)}
          />

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters?.urgentOnly || false}
                onChange={(e) => handleFilterChange('urgentOnly', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm text-foreground">Urgent hiring only</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters?.remoteOnly || false}
                onChange={(e) => handleFilterChange('remoteOnly', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-ring"
              />
              <span className="text-sm text-foreground">Remote jobs only</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;