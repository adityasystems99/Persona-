import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type AppTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  lampModalOpen: boolean;
  setLampModalOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('algopulse_theme') as AppTheme | null;
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [lampModalOpen, setLampModalOpen] = useState(false);

  const applyThemeToDOM = useCallback((newTheme: AppTheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('algopulse_theme', newTheme);
  }, []);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Initial sync & listener for bubbling custom events from <pull-lamp>
  useEffect(() => {
    applyThemeToDOM(theme);

    const handleThemeChangeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: AppTheme }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };

    window.addEventListener('themechange', handleThemeChangeEvent);
    return () => window.removeEventListener('themechange', handleThemeChangeEvent);
  }, [theme, applyThemeToDOM, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme,
        lampModalOpen,
        setLampModalOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
