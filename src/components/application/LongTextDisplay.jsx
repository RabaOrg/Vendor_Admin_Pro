import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Copy, Check } from 'lucide-react';

/**
 * Component for displaying long text values with copy functionality
 * @param {string} text - The text to display
 * @param {number} maxLength - Maximum length before truncation (default: 30)
 * @param {boolean} showCopyButton - Whether to show copy button (default: true)
 * @param {string} className - Additional CSS classes
 */
const LongTextDisplay = ({ 
  text, 
  maxLength = 30, 
  showCopyButton = true, 
  className = '' 
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return <span className="text-gray-400 italic">N/A</span>;
  }

  const isLongText = text.length > maxLength;
  const displayText = isLongText && !isExpanded ? text.substring(0, maxLength) + '...' : text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <div className="flex-1 min-w-0">
        <span 
          className="text-gray-900 break-words cursor-pointer" 
          title={text}
          onClick={() => isLongText && setIsExpanded(!isExpanded)}
        >
          {displayText}
        </span>
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-1 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
        </button>
      )}
    </div>
  );
};

LongTextDisplay.propTypes = {
  text: PropTypes.string,
  maxLength: PropTypes.number,
  showCopyButton: PropTypes.bool,
  className: PropTypes.string,
};

export default LongTextDisplay;
