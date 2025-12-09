import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ColorScheme = 'green' | 'purple';

interface ThemeColors {
  headerBg: string;
  megaMenuBg: string;
  accent: string;
  secondary: string;
  iconColor: string;
  buttonPrimary: string;
  buttonSecondary: string;
  contactButtonGradient: {
    from: string;
    via: string;
    to: string;
    border: string;
  };
}

const themeColors: Record<ColorScheme, ThemeColors> = {
  green: {
    headerBg: '#183028',
    megaMenuBg: '#183028',
    accent: '#64a70b',
    secondary: '#333333',
    iconColor: '#ffffff',
    buttonPrimary: '#64a70b',
    buttonSecondary: '#333333',
    contactButtonGradient: {
      from: '#8ad33b',
      via: '#6fb125',
      to: '#4d7311',
      border: '#4a6c17',
    },
  },
  purple: {
    headerBg: '#221c35',
    megaMenuBg: '#221c35',
    accent: '#908d9a',
    secondary: '#383349',
    iconColor: '#383349',
    buttonPrimary: '#383349',
    buttonSecondary: '#221c35',
    contactButtonGradient: {
      from: '#4a4460',
      via: '#383349',
      to: '#221c35',
      border: '#383349',
    },
  },
};

interface ThemeContextType {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('green');

  const value = {
    colorScheme,
    setColorScheme,
    colors: themeColors[colorScheme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook for pages to set their color scheme
export function usePageTheme(scheme: ColorScheme) {
  const { setColorScheme } = useTheme();

  useEffect(() => {
    setColorScheme(scheme);

    // Reset to green when leaving the page
    return () => {
      setColorScheme('green');
    };
  }, [scheme, setColorScheme]);
}
