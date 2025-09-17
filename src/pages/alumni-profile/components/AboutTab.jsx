import React from 'react';
import Icon from '../../../components/AppIcon';

const AboutTab = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Personal Summary */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
        <p className="text-muted-foreground leading-relaxed">
          {profile?.about}
        </p>
      </div>
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.contactInfo?.email && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Mail" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Email</div>
                <div className="text-sm text-muted-foreground">{profile?.contactInfo?.email}</div>
              </div>
            </div>
          )}
          {profile?.contactInfo?.phone && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Phone" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Phone</div>
                <div className="text-sm text-muted-foreground">{profile?.contactInfo?.phone}</div>
              </div>
            </div>
          )}
          {profile?.contactInfo?.linkedin && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Linkedin" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">LinkedIn</div>
                <div className="text-sm text-muted-foreground">{profile?.contactInfo?.linkedin}</div>
              </div>
            </div>
          )}
          {profile?.contactInfo?.website && (
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <Icon name="Globe" size={18} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">Website</div>
                <div className="text-sm text-muted-foreground">{profile?.contactInfo?.website}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Skills & Interests */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Skills & Interests</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Professional Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Networking Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Networking Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Users" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Mentorship</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {profile?.mentorshipAvailable ? 'Available for mentoring' : 'Not available for mentoring'}
            </p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MessageCircle" size={18} className="text-primary" />
              <span className="font-medium text-foreground">Communication</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Prefers {profile?.communicationPreference}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;