import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedAlumni, 
  onSelectAll, 
  onDeselectAll, 
  onBulkConnect, 
  onBulkMessage, 
  onExport,
  totalCount,
  isAdmin = false 
}) => {
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const selectedCount = selectedAlumni?.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

  if (!isAdmin && selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isPartiallySelected}
            onChange={(e) => {
              if (e?.target?.checked) {
                onSelectAll();
              } else {
                onDeselectAll();
              }
            }}
            label={
              selectedCount > 0 
                ? `${selectedCount} alumni selected` 
                : `Select all ${totalCount} alumni`
            }
          />
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkConnect}
              iconName="UserPlus"
              iconPosition="left"
              iconSize={14}
            >
              Connect All
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkMessage}
              iconName="MessageCircle"
              iconPosition="left"
              iconSize={14}
            >
              Message All
            </Button>

            {isAdmin && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                  iconName="MoreVertical"
                  iconSize={14}
                />

                {isActionMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsActionMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 z-20">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onExport();
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                        >
                          <Icon name="Download" size={14} />
                          <span>Export Selected</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Handle bulk email functionality
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                        >
                          <Icon name="Mail" size={14} />
                          <span>Send Email</span>
                        </button>

                        <button
                          onClick={() => {
                            // Handle bulk notification functionality
                            setIsActionMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                        >
                          <Icon name="Bell" size={14} />
                          <span>Send Notification</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              iconName="X"
              iconSize={14}
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;