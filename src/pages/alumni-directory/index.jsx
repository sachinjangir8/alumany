import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import FilterToolbar from './components/FilterToolbar';
import AlumniGrid from './components/AlumniGrid';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { userProfileService, connectionsService, handleSupabaseError } from '../../utils/supabaseService';

const AlumniDirectory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    graduationYear: '',
    location: '',
    industry: '',
    sortBy: 'name'
  });
  const [viewMode, setViewMode] = useState('grid');

  // Load alumni data from Supabase
  useEffect(() => {
    loadAlumniData();
  }, []);

  // Trigger search when filters change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadAlumniData();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const loadAlumniData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await userProfileService?.getAlumniDirectory(filters);
      
      if (fetchError) {
        setError(handleSupabaseError(fetchError, 'Failed to load alumni directory'));
        return;
      }

      setAlumni(data || []);
    } catch (error) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedAlumni([]); // Clear selection when filters change
  };

  const handleConnect = async (alumniId) => {
    if (!user) {
      setError('Please sign in to connect with alumni');
      return;
    }

    try {
      const { error: connectionError } = await connectionsService?.sendConnectionRequest(
        alumniId, 
        'Hi! I would like to connect with you through AlumniConnect.'
      );

      if (connectionError) {
        setError(handleSupabaseError(connectionError, 'Failed to send connection request'));
        return;
      }

      // Update alumni list to reflect connection request sent
      setAlumni(prev => prev?.map(alumnus => 
        alumnus?.id === alumniId 
          ? { ...alumnus, connectionStatus: 'pending' }
          : alumnus
      ));

      // Show success message
      alert('Connection request sent successfully!');
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleMessage = async (alumniId) => {
    if (!user) {
      setError('Please sign in to message alumni');
      return;
    }
    
    // Navigate to messages with recipient pre-selected
    navigate(`/messages?recipient=${alumniId}`);
  };

  const handleViewProfile = (alumniId) => {
    navigate(`/alumni-profile/${alumniId}`);
  };

  const handleSelectionChange = (alumniId, isSelected) => {
    setSelectedAlumni(prev => 
      isSelected 
        ? [...prev, alumniId]
        : prev?.filter(id => id !== alumniId)
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedAlumni?.length === 0) {
      alert('Please select alumni first');
      return;
    }
    
    if (!user) {
      setError('Please sign in to perform bulk actions');
      return;
    }
    
    switch (action) {
      case 'connect':
        try {
          // Send connection requests to all selected alumni
          const promises = selectedAlumni?.map(alumniId => 
            connectionsService?.sendConnectionRequest(
              alumniId, 
              'Hi! I would like to connect with you through AlumniConnect.'
            )
          );
          
          await Promise.all(promises);
          alert(`Connection requests sent to ${selectedAlumni?.length} alumni`);
          setSelectedAlumni([]);
          await loadAlumniData(); // Refresh data
        } catch (error) {
          setError('Failed to send bulk connection requests');
        }
        break;
        
      case 'message':
        // Navigate to messages with multiple recipients
        navigate(`/messages?recipients=${selectedAlumni?.join(',')}`);
        break;
        
      case 'export':
        try {
          const selectedAlumniData = alumni?.filter(alumnus => 
            selectedAlumni?.includes(alumnus?.id)
          );
          
          const csvContent = [
            'Name,Email,Position,Company,Location,Graduation Year',
            ...selectedAlumniData?.map(alumnus => 
              `"${alumnus?.full_name}","${alumnus?.email}","${alumnus?.current_position || ''}","${alumnus?.company || ''}","${alumnus?.location || ''}","${alumnus?.graduation_year || ''}"`
            )
          ].join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'alumni_export.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          
          alert(`Exported ${selectedAlumni?.length} alumni profiles`);
        } catch (error) {
          setError('Failed to export alumni data');
        }
        break;
        
      default:
        break;
    }
  };

  // Filter and sort alumni data
  const filteredAlumni = useMemo(() => {
    let filtered = [...alumni];

    // Apply search filter
    if (filters?.search) {
      filtered = filtered?.filter(alumnus =>
        alumnus?.full_name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        alumnus?.company?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        alumnus?.current_position?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'name':
          return a?.full_name?.localeCompare(b?.full_name);
        case 'year':
          return (b?.graduation_year || 0) - (a?.graduation_year || 0);
        case 'company':
          return a?.company?.localeCompare(b?.company || '');
        case 'recent':
          return new Date(b?.created_at) - new Date(a?.created_at);
        default:
          return 0;
      }
    });

    return filtered;
  }, [alumni, filters]);

  const stats = {
    total: alumni?.length || 0,
    filtered: filteredAlumni?.length || 0,
    departments: [...new Set(alumni?.map(a => a?.department)?.filter(Boolean))]?.length,
    companies: [...new Set(alumni?.map(a => a?.company)?.filter(Boolean))]?.length
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Alumni Directory - AlumniConnect</title>
        <meta name="description" content="Connect with alumni from your institution. Search by department, graduation year, location, and more." />
      </Helmet>

      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alumni Directory</h1>
              <p className="text-muted-foreground mt-1">
                Connect with {stats?.total} alumni from your network
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                iconName={viewMode === 'grid' ? 'List' : 'Grid3X3'}
                iconPosition="left"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
              
              <Button
                variant="default"
                onClick={loadAlumniData}
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
              <div className="text-2xl font-bold text-primary">{stats?.total}</div>
              <div className="text-sm text-muted-foreground">Total Alumni</div>
            </div>
            <div className="bg-success/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">{stats?.filtered}</div>
              <div className="text-sm text-muted-foreground">Filtered Results</div>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning">{stats?.departments}</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div className="bg-info/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-info">{stats?.companies}</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
          </div>

          {/* Search and Filter */}
          <FilterToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            onFiltersChange={handleFilterChange}
            totalResults={filteredAlumni?.length || 0}
            onClearFilters={() => {
              setFilters({
                search: '',
                department: '',
                graduationYear: '',
                location: '',
                industry: '',
                sortBy: 'name'
              });
            }}
            isMobile={false}
            isFilterPanelOpen={false}
            onToggleFilterPanel={() => {}}
            onReset={() => {
              setFilters({
                search: '',
                department: '',
                graduationYear: '',
                location: '',
                industry: '',
                sortBy: 'name'
              });
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">Error Loading Alumni</p>
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

        {/* Bulk Actions */}
        {selectedAlumni?.length > 0 && (
          <BulkActions
            selectedCount={selectedAlumni?.length}
            onAction={handleBulkAction}
            onClearSelection={() => setSelectedAlumni([])}
            onSelectAll={() => setSelectedAlumni(filteredAlumni?.map(a => a.id) || [])}
            onDeselectAll={() => setSelectedAlumni([])}
            onBulkConnect={() => handleBulkAction('connect')}
            onBulkMessage={() => handleBulkAction('message')}
            onExport={() => handleBulkAction('export')}
            totalCount={filteredAlumni?.length || 0}
          />
        )}

        {/* Alumni Grid/List */}
        <AlumniGrid
          alumni={filteredAlumni}
          loading={loading}
          viewMode={viewMode}
          selectedAlumni={selectedAlumni}
          onSelectionChange={handleSelectionChange}
          onConnect={handleConnect}
          onMessage={handleMessage}
          onViewProfile={handleViewProfile}
          hasMore={false}
          onLoadMore={() => {}}
        />

        {/* Empty State */}
        {!loading && filteredAlumni?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Users" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Alumni Found</h3>
            <p className="text-muted-foreground mb-4">
              {alumni?.length === 0
                ? "No alumni data available yet. Check back later or contact support."
                : "Try adjusting your search criteria or filters to find more alumni."
              }
            </p>
            {alumni?.length === 0 && (
              <Button
                variant="outline"
                onClick={loadAlumniData}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Reload Alumni
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDirectory;