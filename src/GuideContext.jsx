// GuideContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context to manage the guides' positions
const GuideContext = createContext();

export const useGuideContext = () => {
  return useContext(GuideContext);
};

export const GuideProvider = ({ children }) => {
  const [guides, setGuides] = useState([
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ]);

  return (
    <GuideContext.Provider value={{ guides, setGuides }}>
      {children}
    </GuideContext.Provider>
  );
};
