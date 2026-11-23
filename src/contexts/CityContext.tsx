/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CityLocation, DEFAULT_CITY } from '../constants/cities';

const LAST_CITY_KEY = 'vayu_last_city';

export interface CityContextType {
  currentCity: CityLocation;
  setCity: (city: CityLocation) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<CityLocation>(() => {
    try {
      const stored = localStorage.getItem(LAST_CITY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return parsed;
        }
      }
    } catch {
      // Fallback to default Pune
    }
    return DEFAULT_CITY;
  });

  const setCity = (city: CityLocation) => {
    setCurrentCity(city);
    try {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(currentCity));
    } catch {
      // Ignored
    }
  }, [currentCity]);

  return <CityContext.Provider value={{ currentCity, setCity }}>{children}</CityContext.Provider>;
};

export const useCity = (): CityContextType => {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCity must be used within CityProvider');
  }
  return ctx;
};
