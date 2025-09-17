import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventCalendar = ({ events, selectedDate, onDateSelect, viewMode, onViewModeChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateString = date?.toISOString()?.split('T')?.[0];
    return events?.filter(event => event?.date === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth?.setMonth(prev?.getMonth() + direction);
      return newMonth;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date?.toDateString() === today?.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const formatDateForWeekView = (date) => {
    return date?.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getWeekDates = () => {
    const startOfWeek = new Date(currentMonth);
    let day = startOfWeek?.getDay();
    startOfWeek?.setDate(startOfWeek?.getDate() - day);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date?.setDate(startOfWeek?.getDate() + i);
      weekDates?.push(date);
    }
    return weekDates;
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentMonth);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {daysOfWeek?.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days?.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-border last:border-r-0 ${
                  date ? 'cursor-pointer hover:bg-muted/50' : ''
                } ${isSelected(date) ? 'bg-primary/10' : ''} ${isToday(date) ? 'bg-accent/10' : ''}`}
                onClick={() => date && onDateSelect(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday(date) ? 'text-accent font-semibold' : 'text-foreground'
                    }`}>
                      {date?.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents?.slice(0, 3)?.map(event => (
                        <div
                          key={event?.id}
                          className="text-xs p-1 rounded bg-primary/20 text-primary truncate"
                        >
                          {event?.title}
                        </div>
                      ))}
                      {dayEvents?.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayEvents?.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDates = getWeekDates();

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-muted">
          {weekDates?.map(date => (
            <div key={date?.toISOString()} className="p-3 text-center border-r border-border last:border-r-0">
              <div className="text-sm font-medium text-muted-foreground">
                {formatDateForWeekView(date)}
              </div>
              {isToday(date) && (
                <div className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-semibold mx-auto mt-1">
                  {date?.getDate()}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDates?.map(date => {
            const dayEvents = getEventsForDate(date);
            return (
              <div
                key={date?.toISOString()}
                className={`p-2 border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/50 ${
                  isSelected(date) ? 'bg-primary/10' : ''
                }`}
                onClick={() => onDateSelect(date)}
              >
                <div className="space-y-2">
                  {dayEvents?.map(event => (
                    <div
                      key={event?.id}
                      className="text-xs p-2 rounded bg-primary/20 text-primary"
                    >
                      <div className="font-medium truncate">{event?.title}</div>
                      <div className="text-xs opacity-75">{event?.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const sortedEvents = [...events]?.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        </div>
        <div className="divide-y divide-border">
          {sortedEvents?.map(event => (
            <div
              key={event?.id}
              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onDateSelect(new Date(event.date))}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{event?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{event?.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(event.date)?.toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{event?.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={14} />
                      <span>{event?.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">
                    {event?.registeredCount}/{event?.capacity}
                  </div>
                  <div className="text-xs text-muted-foreground">registered</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <h2 className="text-xl font-semibold text-foreground">
            {monthNames?.[currentMonth?.getMonth()]} {currentMonth?.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
          >
            List
          </Button>
        </div>
      </div>
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'list' && renderListView()}
    </div>
  );
};

export default EventCalendar;