
import React from 'react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'md', 
  color = 'currentColor' 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'lg': return 'w-8 h-8';
      case 'md':
      default: return 'w-6 h-6';
    }
  };
  
  return (
    <div className="flex items-center justify-center" aria-label="Loading">
      <div 
        className={`relative ${getSizeClass()}`}
        style={{ color }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-t-transparent border-current animate-spin" />
        <div className="absolute inset-0 rounded-full border border-current opacity-20" />
      </div>
    </div>
  );
};

export default LoadingIndicator;
