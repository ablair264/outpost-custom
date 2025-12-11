import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the filter data interface instead of passing JSX
export interface ClothingFilterData {
  isActive: boolean;
  filterCount: number;
  headerFilterOpen: boolean;
  setHeaderFilterOpen: (open: boolean) => void;
  hasActiveFilters: boolean;
  selectedTypes: string[];
  selectedBrands: string[];
  selectedColors: string[];
  selectedGenders: string[];
  toggleType: (type: string) => void;
  toggleBrand: (brand: string) => void;
  toggleColor: (color: string) => void;
  toggleGender: (gender: string) => void;
  clearAllFilters: () => void;
  sectionsOpen: { type: boolean; brand: boolean; colour: boolean; gender: boolean };
  toggleSection: (section: 'type' | 'brand' | 'colour' | 'gender') => void;
  availableTypeGroups: Array<{ name: string; availableItems: string[] }>;
  brandsList: string[];
  colors: string[];
  genders: string[];
}

interface HeaderFilterContextType {
  filterData: ClothingFilterData | null;
  setFilterData: (data: ClothingFilterData | null) => void;
}

const HeaderFilterContext = createContext<HeaderFilterContextType | undefined>(undefined);

export const HeaderFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filterData, setFilterDataState] = useState<ClothingFilterData | null>(null);

  // Wrap in useCallback to ensure stable reference
  const setFilterData = useCallback((data: ClothingFilterData | null) => {
    setFilterDataState(data);
  }, []);

  return (
    <HeaderFilterContext.Provider value={{ filterData, setFilterData }}>
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
