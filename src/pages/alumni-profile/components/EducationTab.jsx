import React from 'react';
import Icon from '../../../components/AppIcon';

const EducationTab = ({ education }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Education History</h3>
      <div className="space-y-4">
        {education?.map((edu, index) => (
          <div key={index} className="border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-semibold text-foreground">{edu?.degree}</h4>
                  {edu?.isVerified && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                      <Icon name="Shield" size={12} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-base font-medium text-muted-foreground mb-1">{edu?.institution}</p>
                <p className="text-sm text-muted-foreground mb-2">{edu?.field}</p>
                
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={14} />
                    <span>{edu?.startYear} - {edu?.endYear}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} />
                    <span>{edu?.location}</span>
                  </div>
                  {edu?.gpa && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Award" size={14} />
                      <span>GPA: {edu?.gpa}</span>
                    </div>
                  )}
                </div>

                {edu?.description && (
                  <p className="text-sm text-muted-foreground mb-3">{edu?.description}</p>
                )}

                {edu?.achievements && edu?.achievements?.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-foreground mb-2">Achievements & Activities</h5>
                    <ul className="space-y-1">
                      {edu?.achievements?.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                          <Icon name="ChevronRight" size={14} className="mt-0.5 flex-shrink-0" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="ml-4 flex-shrink-0">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={24} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Certifications */}
      <div className="pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education?.filter(item => item?.type === 'certification')?.map((cert, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Award" size={18} className="text-primary" />
                <h4 className="font-semibold text-foreground">{cert?.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{cert?.issuer}</p>
              <p className="text-xs text-muted-foreground">
                Issued: {cert?.issueDate} {cert?.expiryDate && `• Expires: ${cert?.expiryDate}`}
              </p>
              {cert?.credentialId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Credential ID: {cert?.credentialId}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationTab;