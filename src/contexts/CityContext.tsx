/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CityLocation, DEFAULT_CITY, POPULAR_CITIES } from '../constants/cities';
import { savedCityItemSchema } from '../schemas/settingsSchema';

const LAST_CITY_KEY = 'vayu_last_city';
const SAVED_CITIES_KEY = 'vayu_saved_cities';

export interface CityContextType {
  currentCity: CityLocation;
  setCity: (city: CityLocation) => void;
  savedCities: CityLocation[];
  saveCity: (city: CityLocation) => void;
  removeSavedCity: (name: string) => void;
  isCitySaved: (city: CityLocation) => boolean;
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

  const [savedCities, setSavedCities] = useState<CityLocation[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_CITIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter((c) => savedCityItemSchema.safeParse(c).success);
          if (valid.length > 0) return valid;
        }
      }
    } catch {
      // Fallback to presets
    }
    return POPULAR_CITIES.slice(0, 4);
  });

  const setCity = (city: CityLocation) => {
    setCurrentCity(city);
    try {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city));
    } catch {
      // Ignored
    }
  };

  const saveCity = (city: CityLocation) => {
    setSavedCities((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === city.name.toLowerCase())) {
        return prev;
      }
      const updated = [...prev, city];
      try {
        localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  const removeSavedCity = (name: string) => {
    setSavedCities((prev) => {
      const updated = prev.filter((c) => c.name.toLowerCase() !== name.toLowerCase());
      try {
        localStorage.setItem(SAVED_CITIES_KEY, JSON.stringify(updated));
      } catch {
        // Ignored
      }
      return updated;
    });
  };

  const isCitySaved = (city: CityLocation) => {
    return savedCities.some((c) => c.name.toLowerCase() === city.name.toLowerCase());
  };

  useEffect(() => {
    try {
      localStorage.setItem(LAST_CITY_KEY, JSON.stringify(currentCity));
    } catch {
      // Ignored
    }
  }, [currentCity]);

  return (
    <CityContext.Provider
      value={{
        currentCity,
        setCity,
        savedCities,
        saveCity,
        removeSavedCity,
        isCitySaved,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = (): CityContextType => {
  const ctx = useContext(CityContext);
  if (!ctx) {
    throw new Error('useCity must be used within CityProvider');
  }
  return ctx;
};
