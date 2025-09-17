import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateEventModal = ({ isOpen, onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    fee: '',
    registrationRequired: true,
    communicationPreferences: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [errors, setErrors] = useState({});

  const eventTypeOptions = [
    { value: 'networking', label: 'Networking Event' },
    { value: 'reunion', label: 'Alumni Reunion' },
    { value: 'seminar', label: 'Educational Seminar' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'social', label: 'Social Gathering' }
  ];

  const locationOptions = [
    { value: 'chandigarh', label: 'Chandigarh Campus' },
    { value: 'ludhiana', label: 'Ludhiana Center' },
    { value: 'amritsar', label: 'Amritsar Auditorium' },
    { value: 'jalandhar', label: 'Jalandhar Hall' },
    { value: 'patiala', label: 'Patiala Convention Center' },
    { value: 'online', label: 'Online Event' },
    { value: 'custom', label: 'Custom Location' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCommunicationChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      communicationPreferences: {
        ...prev?.communicationPreferences,
        [type]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.title?.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData?.description?.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData?.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    if (!formData?.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData?.time) {
      newErrors.time = 'Event time is required';
    }

    if (!formData?.location) {
      newErrors.location = 'Event location is required';
    }

    if (!formData?.capacity || formData?.capacity < 1) {
      newErrors.capacity = 'Valid capacity is required';
    }

    if (formData?.fee && formData?.fee < 0) {
      newErrors.fee = 'Fee cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const eventData = {
        ...formData,
        id: Date.now(),
        capacity: parseInt(formData?.capacity),
        fee: parseFloat(formData?.fee) || 0,
        registeredCount: 0,
        status: 'upcoming',
        createdAt: new Date()?.toISOString()
      };
      
      onCreateEvent(eventData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        eventType: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        fee: '',
        registrationRequired: true,
        communicationPreferences: {
          email: true,
          sms: false,
          push: true
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Event</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Event Title"
                type="text"
                placeholder="Enter event title"
                value={formData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                error={errors?.title}
                required
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Description"
                type="text"
                placeholder="Enter event description"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                error={errors?.description}
                required
              />
            </div>

            <Select
              label="Event Type"
              options={eventTypeOptions}
              value={formData?.eventType}
              onChange={(value) => handleInputChange('eventType', value)}
              error={errors?.eventType}
              required
            />

            <Select
              label="Location"
              options={locationOptions}
              value={formData?.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors?.location}
              required
            />

            <Input
              label="Date"
              type="date"
              value={formData?.date}
              onChange={(e) => handleInputChange('date', e?.target?.value)}
              error={errors?.date}
              required
            />

            <Input
              label="Time"
              type="time"
              value={formData?.time}
              onChange={(e) => handleInputChange('time', e?.target?.value)}
              error={errors?.time}
              required
            />

            <Input
              label="Capacity"
              type="number"
              placeholder="Maximum attendees"
              value={formData?.capacity}
              onChange={(e) => handleInputChange('capacity', e?.target?.value)}
              error={errors?.capacity}
              min="1"
              required
            />

            <Input
              label="Registration Fee (₹)"
              type="number"
              placeholder="0 for free event"
              value={formData?.fee}
              onChange={(e) => handleInputChange('fee', e?.target?.value)}
              error={errors?.fee}
              min="0"
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Registration Required"
              checked={formData?.registrationRequired}
              onChange={(e) => handleInputChange('registrationRequired', e?.target?.checked)}
            />

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Communication Preferences
              </label>
              <div className="space-y-2">
                <Checkbox
                  label="Email Notifications"
                  checked={formData?.communicationPreferences?.email}
                  onChange={(e) => handleCommunicationChange('email', e?.target?.checked)}
                />
                <Checkbox
                  label="SMS Notifications"
                  checked={formData?.communicationPreferences?.sms}
                  onChange={(e) => handleCommunicationChange('sms', e?.target?.checked)}
                />
                <Checkbox
                  label="Push Notifications"
                  checked={formData?.communicationPreferences?.push}
                  onChange={(e) => handleCommunicationChange('push', e?.target?.checked)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;