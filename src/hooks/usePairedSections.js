import { useState, useCallback } from 'react';

/**
 * Custom hook to manage paired collapsible sections
 * When one section is toggled, its paired section is also toggled
 */
export const usePairedSections = (pairs = []) => {
  // Initialize state for all sections
  const initialState = {};
  pairs.forEach(pair => {
    initialState[pair.id] = pair.defaultExpanded || false;
  });

  const [sectionStates, setSectionStates] = useState(initialState);

  const toggleSection = useCallback((sectionId, isExpanded) => {
    setSectionStates(prev => {
      const newState = { ...prev };
      
      // Find the pair for this section
      const pair = pairs.find(p => p.id === sectionId);
      if (pair && pair.pairedWith) {
        // Toggle both sections in the pair
        newState[sectionId] = isExpanded;
        newState[pair.pairedWith] = isExpanded;
      } else {
        // Single section toggle
        newState[sectionId] = isExpanded;
      }
      
      return newState;
    });
  }, [pairs]);

  const getSectionState = useCallback((sectionId) => {
    return sectionStates[sectionId] || false;
  }, [sectionStates]);

  return {
    toggleSection,
    getSectionState,
    sectionStates
  };
};
