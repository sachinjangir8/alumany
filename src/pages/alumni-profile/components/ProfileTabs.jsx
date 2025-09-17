import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProfileTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab?.icon} size={18} />
            <span>{tab?.label}</span>
            {tab?.count && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                {tab?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Mobile Accordion */}
      <div className="md:hidden">
        {tabs?.map((tab) => (
          <div key={tab?.id} className="border-b border-border last:border-b-0">
            <button
              onClick={() => onTabChange(activeTab === tab?.id ? null : tab?.id)}
              className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon name={tab?.icon} size={18} className="text-muted-foreground" />
                <span className="font-medium text-foreground">{tab?.label}</span>
                {tab?.count && (
                  <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                    {tab?.count}
                  </span>
                )}
              </div>
              <Icon
                name="ChevronDown"
                size={18}
                className={`text-muted-foreground transition-transform duration-200 ${
                  activeTab === tab?.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {activeTab === tab?.id && (
              <div className="px-4 pb-4">
                {tab?.content}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Desktop Content */}
      <div className="hidden md:block p-6">
        {tabs?.find(tab => tab?.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default ProfileTabs;