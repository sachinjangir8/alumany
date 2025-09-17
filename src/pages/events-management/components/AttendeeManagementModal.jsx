import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AttendeeManagementModal = ({ isOpen, onClose, event }) => {
  const [activeTab, setActiveTab] = useState('attendees');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [bulkMessage, setBulkMessage] = useState('');

  // Mock attendee data
  const [attendees] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      registrationDate: '2025-01-05',
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 500
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 87654 32109',
      registrationDate: '2025-01-06',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 500
    },
    {
      id: 3,
      name: 'Amit Singh',
      email: 'amit.singh@email.com',
      phone: '+91 76543 21098',
      registrationDate: '2025-01-07',
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 500
    },
    {
      id: 4,
      name: 'Neha Gupta',
      email: 'neha.gupta@email.com',
      phone: '+91 65432 10987',
      registrationDate: '2025-01-08',
      status: 'waitlist',
      paymentStatus: 'not_required',
      amount: 0
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'waitlist', label: 'Waitlist' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'waitlist': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'not_required': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAttendees = attendees?.filter(attendee => {
    const matchesSearch = attendee?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         attendee?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendee?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAttendee = (attendeeId) => {
    setSelectedAttendees(prev => 
      prev?.includes(attendeeId) 
        ? prev?.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAttendees?.length === filteredAttendees?.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees?.map(a => a?.id));
    }
  };

  const handleSendBulkMessage = () => {
    if (selectedAttendees?.length > 0 && bulkMessage?.trim()) {
      // Mock sending bulk message
      alert(`Message sent to ${selectedAttendees?.length} attendees`);
      setBulkMessage('');
      setSelectedAttendees([]);
    }
  };

  const calculateStats = () => {
    const confirmed = attendees?.filter(a => a?.status === 'confirmed')?.length;
    const pending = attendees?.filter(a => a?.status === 'pending')?.length;
    const waitlist = attendees?.filter(a => a?.status === 'waitlist')?.length;
    const totalRevenue = attendees?.filter(a => a?.paymentStatus === 'paid')?.reduce((sum, a) => sum + a?.amount, 0);

    return { confirmed, pending, waitlist, totalRevenue };
  };

  const stats = calculateStats();

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-6xl max-h-[90vh] overflow-hidden m-4">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Manage Attendees</h2>
            <p className="text-sm text-muted-foreground">{event?.title}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.confirmed}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats?.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.waitlist}</div>
              <div className="text-sm text-muted-foreground">Waitlist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₹{stats?.totalRevenue?.toLocaleString('en-IN')}</div>
              <div className="text-sm text-muted-foreground">Revenue</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'attendees' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Attendees ({attendees?.length})
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'communication' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Communication
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'attendees' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Search attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                  />
                </div>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Filter by status"
                />
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                >
                  {selectedAttendees?.length === filteredAttendees?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              {/* Attendees List */}
              <div className="space-y-4">
                {filteredAttendees?.map(attendee => (
                  <div key={attendee?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={selectedAttendees?.includes(attendee?.id)}
                      onChange={() => handleSelectAttendee(attendee?.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                      {attendee?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{attendee?.name}</div>
                      <div className="text-sm text-muted-foreground">{attendee?.email}</div>
                      <div className="text-sm text-muted-foreground">{attendee?.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">
                        Registered: {new Date(attendee.registrationDate)?.toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee?.status)}`}>
                          {attendee?.status?.charAt(0)?.toUpperCase() + attendee?.status?.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(attendee?.paymentStatus)}`}>
                          {attendee?.paymentStatus === 'not_required' ? 'Free' : attendee?.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        {attendee?.amount > 0 ? `₹${attendee?.amount?.toLocaleString('en-IN')}` : 'Free'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Send Message to Selected Attendees ({selectedAttendees?.length})
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        value={bulkMessage}
                        onChange={(e) => setBulkMessage(e?.target?.value)}
                        placeholder="Enter your message here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {selectedAttendees?.length === 0 
                          ? 'Select attendees from the Attendees tab to send messages'
                          : `Message will be sent to ${selectedAttendees?.length} selected attendee(s)`
                        }
                      </div>
                      <Button
                        onClick={handleSendBulkMessage}
                        disabled={selectedAttendees?.length === 0 || !bulkMessage?.trim()}
                      >
                        <Icon name="Send" size={16} className="mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium text-foreground mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Icon name="Mail" size={16} className="mr-2" />
                      Send Event Reminder
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      Send Location Details
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Send Schedule Update
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Icon name="AlertCircle" size={16} className="mr-2" />
                      Send Important Notice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeManagementModal;