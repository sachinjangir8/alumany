import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MentorshipSection = ({ onConnectMentor }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const mentors = [
    {
      id: 1,
      name: "Priya Sharma",
      title: "Senior Software Engineer",
      company: "Google India",
      industry: "technology",
      experience: "8 years",
      expertise: ["React", "Node.js", "System Design", "Career Growth"],
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 4.9,
      sessions: 156,
      location: "Bangalore",
      bio: "Passionate about helping junior developers navigate their career path in tech. Specialized in full-stack development and system architecture.",
      isAvailable: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      title: "Investment Banking VP",
      company: "Goldman Sachs",
      industry: "finance",
      experience: "12 years",
      expertise: ["Investment Banking", "Financial Analysis", "Career Strategy", "Leadership"],
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.8,
      sessions: 203,
      location: "Mumbai",
      bio: "Helping finance professionals advance their careers in investment banking and financial services.",
      isAvailable: true
    },
    {
      id: 3,
      name: "Dr. Anjali Patel",
      title: "Chief Medical Officer",
      company: "Apollo Hospitals",
      industry: "healthcare",
      experience: "15 years",
      expertise: ["Healthcare Management", "Medical Practice", "Leadership", "Research"],
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.9,
      sessions: 89,
      location: "Delhi",
      bio: "Experienced healthcare leader passionate about mentoring medical professionals and healthcare administrators.",
      isAvailable: false
    },
    {
      id: 4,
      name: "Vikram Singh",
      title: "Principal Consultant",
      company: "McKinsey & Company",
      industry: "consulting",
      experience: "10 years",
      expertise: ["Strategy Consulting", "Business Analysis", "Problem Solving", "Client Management"],
      avatar: "https://randomuser.me/api/portraits/men/38.jpg",
      rating: 4.7,
      sessions: 134,
      location: "Gurgaon",
      bio: "Strategy consultant helping professionals develop analytical thinking and consulting skills.",
      isAvailable: true
    }
  ];

  const industries = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'education', label: 'Education' }
  ];

  const filteredMentors = selectedIndustry === 'all' 
    ? mentors 
    : mentors?.filter(mentor => mentor?.industry === selectedIndustry);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Connect with Mentors</h2>
          <p className="text-muted-foreground">Get guidance from industry professionals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">{filteredMentors?.length} mentors available</span>
        </div>
      </div>
      {/* Industry Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {industries?.map((industry) => (
            <button
              key={industry?.value}
              onClick={() => setSelectedIndustry(industry?.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedIndustry === industry?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {industry?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMentors?.map((mentor) => (
          <div key={mentor?.id} className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200">
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image 
                    src={mentor?.avatar} 
                    alt={mentor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                  mentor?.isAvailable ? 'bg-success' : 'bg-muted'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">{mentor?.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{mentor?.title}</p>
                <p className="text-sm font-medium text-primary mb-2">{mentor?.company}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{mentor?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{mentor?.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {mentor?.bio}
            </p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {mentor?.expertise?.slice(0, 3)?.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    {skill}
                  </span>
                ))}
                {mentor?.expertise?.length > 3 && (
                  <span className="text-xs text-muted-foreground px-2 py-1">
                    +{mentor?.expertise?.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="font-medium">{mentor?.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MessageCircle" size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">{mentor?.sessions} sessions</span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                mentor?.isAvailable 
                  ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
              }`}>
                {mentor?.isAvailable ? 'Available' : 'Busy'}
              </div>
            </div>

            <Button
              variant={mentor?.isAvailable ? "default" : "outline"}
              size="sm"
              onClick={() => onConnectMentor(mentor)}
              disabled={!mentor?.isAvailable}
              fullWidth
            >
              {mentor?.isAvailable ? 'Connect' : 'Not Available'}
            </Button>
          </div>
        ))}
      </div>
      {filteredMentors?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No mentors found</h3>
          <p className="text-muted-foreground">Try selecting a different industry filter</p>
        </div>
      )}
    </div>
  );
};

export default MentorshipSection;