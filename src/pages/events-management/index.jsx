import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import EventCard from './components/EventCard';
import EventFilters from './components/EventFilters';
import CreateEventModal from './components/CreateEventModal';
import EventCalendar from './components/EventCalendar';
import AttendeeManagementModal from './components/AttendeeManagementModal';
import { useAuth } from '../../contexts/AuthContext';
import { eventsService, handleSupabaseError } from '../../utils/supabaseService';

const EventsManagement = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showAttendeeModal, setShowAttendeeModal] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [calendarViewMode, setCalendarViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAttendeeModalOpen, setIsAttendeeModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filters, setFilters] = useState({
    eventType: 'all',
    status: 'upcoming',
    myEvents: false,
    location: 'all',
    search: '',
    fromDate: '',
    toDate: ''
  });

  // Load events data from Supabase
  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await eventsService?.getUpcomingEvents();
      
      if (fetchError) {
        setError(handleSupabaseError(fetchError, 'Failed to load events'));
        return;
      }

      let filteredData = data || [];

      // Apply filters
      if (filters?.eventType && filters?.eventType !== 'all') {
        filteredData = filteredData?.filter(event => event?.event_type === filters?.eventType);
      }

      if (filters?.status && filters?.status !== 'all') {
        filteredData = filteredData?.filter(event => event?.status === filters?.status);
      }

      if (filters?.myEvents && user) {
        filteredData = filteredData?.filter(event => event?.organizer_id === user?.id);
      }

      if (filters?.location && filters?.location !== 'all') {
        filteredData = filteredData?.filter(event => (event?.location || '')?.toLowerCase()?.includes(filters?.location?.toLowerCase()));
      }

      if (filters?.search) {
        const query = filters?.search?.toLowerCase();
        filteredData = filteredData?.filter(event =>
          (event?.title || '')?.toLowerCase()?.includes(query) ||
          (event?.description || '')?.toLowerCase()?.includes(query)
        );
      }

      if (filters?.fromDate) {
        filteredData = filteredData?.filter(event => new Date(event?.start_date || event?.date) >= new Date(filters?.fromDate));
      }

      if (filters?.toDate) {
        const to = new Date(filters?.toDate);
        to.setHours(23,59,59,999);
        filteredData = filteredData?.filter(event => new Date(event?.start_date || event?.date) <= to);
      }

      setEvents(filteredData);
    } catch (error) {
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventAction = async (action, eventId) => {
    if (!user) {
      setError('Please sign in to perform this action');
      return;
    }

    try {
      switch (action) {
        case 'register':
          const { error: registerError } = await eventsService?.registerForEvent(eventId);
          if (registerError) {
            setError(handleSupabaseError(registerError, 'Failed to register for event'));
            return;
          }
          
          // Update event in local state
          setEvents(prev => prev?.map(event => 
            event?.id === eventId 
              ? { ...event, current_attendees: (event?.current_attendees || 0) + 1 }
              : event
          ));
          
          alert('Successfully registered for the event!');
          break;

        case 'view':
          // Navigate to event details page
          navigate(`/events/${eventId}`);
          break;

        case 'edit':
          // Open edit modal with event data
          const eventToEdit = events?.find(e => e?.id === eventId);
          if (eventToEdit && (eventToEdit?.organizer_id === user?.id || canCreateEvents)) {
            // TODO: Implement edit modal
            alert(`Edit event functionality will be implemented for event ${eventId}`);
          } else {
            setError('You do not have permission to edit this event');
          }
          break;

        case 'attendees':
          const eventToManage = events?.find(e => e?.id === eventId);
          if (eventToManage) {
            setSelectedEvent(eventToManage);
            setShowAttendeeModal(true);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const handleCreateEvent = async (eventData) => {
    if (!user) {
      setError('Please sign in to create events');
      return;
    }

    try {
      const { data, error: createError } = await eventsService?.create({
        ...eventData,
        organizer_id: user?.id
      });

      if (createError) {
        setError(handleSupabaseError(createError, 'Failed to create event'));
        return;
      }

      // Add new event to local state
      setEvents(prev => [data, ...prev]);
      setShowCreateModal(false);
      
      alert('Event created successfully!');
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const canCreateEvents = userProfile?.role === 'administrator' || 
                          userProfile?.role === 'faculty' || 
                          userProfile?.role === 'management';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Events Management - AlumniConnect</title>
        <meta name="description" content="Discover and manage alumni events, workshops, and networking opportunities." />
      </Helmet>

      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
              <p className="text-muted-foreground mt-1">
                Discover upcoming events and manage your event attendance
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCalendar(!showCalendar)}
                iconName="Calendar"
                iconPosition="left"
              >
                {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
              </Button>
              
              {canCreateEvents && (
                <Button
                  variant="default"
                  onClick={() => setShowCreateModal(true)}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create Event
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={loadEvents}
                iconName="RefreshCw"
                iconPosition="left"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{events?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </div>
            <div className="bg-success/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-success">
                {events?.filter(e => e?.status === 'upcoming')?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
            <div className="bg-warning/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-warning">
                {events?.filter(e => e?.status === 'ongoing')?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Ongoing</div>
            </div>
            <div className="bg-info/10 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-info">
                {events?.reduce((sum, e) => sum + (e?.current_attendees || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Attendees</div>
            </div>
          </div>

          <EventFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters({
              eventType: 'all',
              status: 'upcoming',
              myEvents: false,
              location: 'all',
              search: '',
              fromDate: '',
              toDate: ''
            })}
            canCreateEvents={canCreateEvents}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 text-sm font-medium">Error Loading Events</p>
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

        {/* Calendar View */}
        {showCalendar && (
          <div className="mb-8">
            <EventCalendar 
              events={events} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              viewMode={calendarViewMode}
              onViewModeChange={setCalendarViewMode}
              onEventClick={(event) => handleEventAction('view', event?.id)}
            />
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 })?.map((_, index) => (
              <div key={index} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events?.map(event => (
              <EventCard
                key={event?.id}
                event={event}
                onAction={handleEventAction}
                onViewDetails={(eventId) => handleEventAction('view', eventId)}
                onEdit={(eventId) => handleEventAction('edit', eventId)}
                onManageAttendees={(eventId) => handleEventAction('attendees', eventId)}
                canManage={event?.organizer_id === user?.id || canCreateEvents}
                isRegistered={false} // TODO: Check if user is registered
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-4">
              No events match your current filters. Try adjusting your search criteria.
            </p>
            {canCreateEvents && (
              <Button
                variant="default"
                onClick={() => setShowCreateModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create First Event
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateEvent}
          onCreateEvent={handleCreateEvent}
        />
      )}

      {showAttendeeModal && selectedEvent && (
        <AttendeeManagementModal
          isOpen={showAttendeeModal}
          event={selectedEvent}
          onClose={() => {
            setShowAttendeeModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default EventsManagement;