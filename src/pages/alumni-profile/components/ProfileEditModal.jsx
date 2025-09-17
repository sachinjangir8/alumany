import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../contexts/AuthContext';
import { userProfileService, handleSupabaseError } from '../../../utils/supabaseService';
import Icon from '../../../components/AppIcon';

const ProfileEditModal = ({ isOpen, onClose, onSave }) => {
  const { userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    current_position: userProfile?.current_position || '',
    company: userProfile?.company || '',
    industry: userProfile?.industry || '',
    location: userProfile?.location || '',
    bio: userProfile?.bio || '',
    phone: userProfile?.phone || '',
    linkedin_url: userProfile?.linkedin_url || '',
    website_url: userProfile?.website_url || '',
    graduation_year: userProfile?.graduation_year || '',
    department: userProfile?.department || '',
    degree: userProfile?.degree || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const industryOptions = [
    { value: '', label: 'Select Industry' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'government', label: 'Government' },
    { value: 'non_profit', label: 'Non-Profit' },
    { value: 'retail', label: 'Retail' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' }
  ];

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    { value: 'computer_science', label: 'Computer Science' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'business', label: 'Business Administration' },
    { value: 'medicine', label: 'Medicine' },
    { value: 'law', label: 'Law' },
    { value: 'arts', label: 'Arts & Humanities' },
    { value: 'sciences', label: 'Sciences' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const { data, error: updateError } = await updateProfile(formData);
      
      if (updateError) {
        setError(handleSupabaseError(updateError, 'Failed to update profile'));
        return;
      }

      onSave?.(data);
      onClose();
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            iconSize={20}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">Update Failed</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                />
                
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <Input
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                description="Tell others about yourself and your interests"
              />
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Current Position"
                  name="current_position"
                  value={formData.current_position}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Industry"
                  options={industryOptions}
                  value={formData.industry}
                  onChange={handleSelectChange('industry')}
                />
                
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Education Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Education Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={handleSelectChange('department')}
                />
                
                <Input
                  label="Degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                />
                
                <Input
                  label="Graduation Year"
                  name="graduation_year"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={formData.graduation_year}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="LinkedIn URL"
                  name="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
                
                <Input
                  label="Website URL"
                  name="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;