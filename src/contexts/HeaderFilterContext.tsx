import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HeaderFilterContextType {
  filterContent: ReactNode | null;
  setFilterContent: (content: ReactNode | null) => void;
}

const HeaderFilterContext = createContext<HeaderFilterContextType | undefined>(undefined);

export const HeaderFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filterContent, setFilterContent] = useState<ReactNode | null>(null);

  return (
    <HeaderFilterContext.Provider value={{ filterContent, setFilterContent }}>
      {children}
    </HeaderFilterContext.Provider>
  );
};

export const useHeaderFilter = () => {
  const context = useContext(HeaderFilterContext);
  if (context === undefined) {
    throw new Error('useHeaderFilter must be used within a HeaderFilterProvider');
  }
  return context;
};
