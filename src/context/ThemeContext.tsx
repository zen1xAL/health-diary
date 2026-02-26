import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme';

interface ThemeContextType {
  isDarkMode: boolean; 
  toggleTheme: () => void; 
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = Appearance.getColorScheme(); 
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemTheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === 'dark');
        }
      } catch (e) {
        console.error('Ошибка загрузки темы', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newThemeMode = !isDarkMode;
    setIsDarkMode(newThemeMode);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeMode ? 'dark' : 'light');
    } catch (e) {
      console.error('Ошибка сохранения темы', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};