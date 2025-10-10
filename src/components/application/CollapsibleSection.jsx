import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CollapsibleSection = ({
  title,
  subtitle,
  children,
  defaultExpanded = false,
  badge,
  badgeColor = 'gray',
  icon: Icon,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  onToggle,
  pairedWith, // New prop for paired section
  onPairedToggle, // New prop for handling paired toggle
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    
    // If this section has a paired section, toggle it too
    if (pairedWith && onPairedToggle) {
      onPairedToggle(newExpanded);
    }
    
    if (onToggle) {
      onToggle(newExpanded);
    }
  };

  const getBadgeClasses = (color) => {
    const colors = {
      gray: 'bg-gray-100 text-gray-800',
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      orange: 'bg-orange-100 text-orange-800',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${headerClassName}`}
        aria-expanded={isExpanded}
        aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center space-x-3">
          {Icon && (
            <Icon className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {badge && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(badgeColor)}`}>
              {badge}
            </span>
          )}
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Content */}
      <div
        id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`px-4 pb-4 ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badgeColor: PropTypes.oneOf(['gray', 'green', 'blue', 'yellow', 'red', 'purple', 'orange']),
  icon: PropTypes.elementType,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  onToggle: PropTypes.func,
  pairedWith: PropTypes.string, // ID of the paired section
  onPairedToggle: PropTypes.func, // Function to handle paired toggle
};

export default CollapsibleSection;
