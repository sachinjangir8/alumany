import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  totalResults, 
  onClearFilters,
  isMobile,
  isFilterPanelOpen,
  onToggleFilterPanel 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'business', label: 'Business Administration' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'law', label: 'Law' },
    { value: 'arts', label: 'Arts & Humanities' }
  ];

  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'government', label: 'Government' },
    { value: 'non_profit', label: 'Non-Profit' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'ludhiana', label: 'Ludhiana' },
    { value: 'amritsar', label: 'Amritsar' },
    { value: 'jalandhar', label: 'Jalandhar' },
    { value: 'delhi', label: 'Delhi NCR' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'international', label: 'International' }
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'year_desc', label: 'Recent Graduates' },
    { value: 'year_asc', label: 'Senior Alumni' },
    { value: 'location', label: 'Location' },
    { value: 'activity', label: 'Recent Activity' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      department: '',
      industry: '',
      location: '',
      graduationYearFrom: '',
      graduationYearTo: '',
      sortBy: 'name_asc'
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters)?.some(value => 
    value !== '' && value !== 'name_asc'
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex-1">
        <Input
          type="search"
          placeholder="Search by name, company, or keywords..."
          value={localFilters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Department"
          options={departmentOptions}
          value={localFilters?.department}
          onChange={(value) => handleFilterChange('department', value)}
          placeholder="Select department"
        />

        <Select
          label="Industry"
          options={industryOptions}
          value={localFilters?.industry}
          onChange={(value) => handleFilterChange('industry', value)}
          placeholder="Select industry"
        />

        <Select
          label="Location"
          options={locationOptions}
          value={localFilters?.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Select location"
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={localFilters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>

      {/* Graduation Year Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label="Graduation Year From"
          placeholder="e.g., 1990"
          value={localFilters?.graduationYearFrom}
          onChange={(e) => handleFilterChange('graduationYearFrom', e?.target?.value)}
          min="1950"
          max="2024"
        />

        <Input
          type="number"
          label="Graduation Year To"
          placeholder="e.g., 2024"
          value={localFilters?.graduationYearTo}
          onChange={(e) => handleFilterChange('graduationYearTo', e?.target?.value)}
          min="1950"
          max="2024"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          {totalResults} alumni found
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={14}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={onToggleFilterPanel}
            iconName="Filter"
            iconPosition="left"
            iconSize={16}
          >
            Filters {hasActiveFilters && `(${Object.values(localFilters)?.filter(v => v !== '' && v !== 'name_asc')?.length})`}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            {totalResults} results
          </div>
        </div>
        {/* Mobile Filter Panel */}
        {isFilterPanelOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
              onClick={onToggleFilterPanel}
            />
            <div className="fixed top-0 right-0 z-50 w-80 h-full bg-card border-l border-border shadow-elevation-3 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleFilterPanel}
                    iconName="X"
                    iconSize={16}
                  />
                </div>
                <FilterContent />
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <FilterContent />
    </div>
  );
};

export default FilterToolbar;