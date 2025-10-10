import React from 'react';
import PropTypes from 'prop-types';
import LongTextDisplay from './LongTextDisplay';

const InfoGrid = ({
  data,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  className = '',
  itemClassName = '',
  labelClassName = '',
  valueClassName = '',
  customRenderers = {},
  emptyMessage = 'No data available',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  const getGridClasses = () => {
    const { mobile, tablet, desktop } = columns;
    return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop} gap-4`;
  };

  const renderValue = (key, value) => {
    // Check if there's a custom renderer for this key
    if (customRenderers[key]) {
      return customRenderers[key](value);
    }
    
    // Default rendering
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic">N/A</span>;
    }
    
    // Handle long text values that might overflow
    const stringValue = String(value);
    const isLongText = stringValue.length > 30; // Consider text long if more than 30 characters
    
    if (isLongText) {
      return (
        <LongTextDisplay 
          text={stringValue} 
          maxLength={30}
          showCopyButton={true}
        />
      );
    }
    
    return <span className={`text-gray-900 break-words ${valueClassName}`}>{value}</span>;
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {data.map((item, index) => (
        <div key={item.key || index} className={`space-y-1 min-w-0 ${itemClassName}`}>
          <label className={`block text-sm font-medium text-gray-600 ${labelClassName}`}>
            {item.label}
          </label>
          <div className="text-gray-900 min-w-0">
            {renderValue(item.key, item.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

InfoGrid.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  columns: PropTypes.shape({
    mobile: PropTypes.number,
    tablet: PropTypes.number,
    desktop: PropTypes.number,
  }),
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  valueClassName: PropTypes.string,
  customRenderers: PropTypes.objectOf(PropTypes.func),
  emptyMessage: PropTypes.string,
};

export default InfoGrid;
