import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EventFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const eventTypeOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'networking', label: 'Networking' },
    { value: 'reunion', label: 'Reunion' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Gathering' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'ludhiana', label: 'Ludhiana' },
    { value: 'amritsar', label: 'Amritsar' },
    { value: 'jalandhar', label: 'Jalandhar' },
    { value: 'patiala', label: 'Patiala' },
    { value: 'online', label: 'Online' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter Events</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={16} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Event Type"
          options={eventTypeOptions}
          value={filters?.eventType}
          onChange={(value) => handleFilterChange('eventType', value)}
          placeholder="Select event type"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Select status"
        />

        <Select
          label="Location"
          options={locationOptions}
          value={filters?.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Select location"
        />

        <Input
          label="Search Events"
          type="search"
          placeholder="Search by title or description"
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From Date"
          type="date"
          value={filters?.fromDate}
          onChange={(e) => handleFilterChange('fromDate', e?.target?.value)}
        />

        <Input
          label="To Date"
          type="date"
          value={filters?.toDate}
          onChange={(e) => handleFilterChange('toDate', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default EventFilters;