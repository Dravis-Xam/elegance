import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { toast } from './ToastStore';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const username = user?.username;

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (username) {
      const savedTheme = localStorage.getItem(`${username}-theme`) || 'dark';
      setTheme(savedTheme);
    }
  }, [username]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (username) {
      localStorage.setItem(`${username}-theme`, theme);
    }
  }, [theme, username]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      toast.success(`${newTheme} mode enabled`);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
