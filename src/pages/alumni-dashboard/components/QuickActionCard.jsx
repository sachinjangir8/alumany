import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ title, description, icon, route, badge, color = 'primary' }) => {
  const navigate = useNavigate();

  const getColorClasses = (colorType) => {
    switch (colorType) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          border: 'border-primary/20'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          text: 'text-secondary',
          border: 'border-secondary/20'
        };
      case 'success':
        return {
          bg: 'bg-success/10',
          text: 'text-success',
          border: 'border-success/20'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          text: 'text-warning',
          border: 'border-warning/20'
        };
      default:
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          border: 'border-primary/20'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 hover-lift cursor-pointer group"
         onClick={() => navigate(route)}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses?.bg} ${colorClasses?.border} border rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon name={icon} size={24} className={colorClasses?.text} />
        </div>
        
        {badge && (
          <div className="flex items-center justify-center w-6 h-6 bg-accent text-accent-foreground text-xs font-medium rounded-full">
            {badge}
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between group-hover:bg-primary/5 transition-colors duration-200"
      >
        <span>Go to {title}</span>
        <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
      </Button>
    </div>
  );
};

export default QuickActionCard;