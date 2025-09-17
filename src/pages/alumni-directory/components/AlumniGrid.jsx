import React from 'react';
import AlumniCard from './AlumniCard';
import Icon from '../../../components/AppIcon';

const AlumniGrid = ({ 
  alumni, 
  loading, 
  onConnect, 
  onMessage, 
  onViewProfile,
  hasMore,
  onLoadMore 
}) => {
  if (loading && alumni?.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
                <div className="space-y-1 mt-3">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (alumni?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Users" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No alumni found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search criteria or filters to find more alumni.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni?.map((alumnus) => (
          <AlumniCard
            key={alumnus?.id}
            alumni={alumnus}
            onConnect={onConnect}
            onMessage={onMessage}
            onViewProfile={onViewProfile}
          />
        ))}
      </div>
      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} />
                <span>Load More Alumni</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AlumniGrid;