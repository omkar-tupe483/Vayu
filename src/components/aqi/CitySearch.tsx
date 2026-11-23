import React, { useState, useEffect, useRef, useId } from 'react';
import { useCity } from '../../contexts/CityContext';
import { CityLocation, POPULAR_CITIES } from '../../constants/cities';
import { searchCities } from '../../services/geocoding';
import { useTranslation } from '../../contexts/LanguageContext';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

export const CitySearch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentCity, setCity } = useCity();
  const { t } = useTranslation();
  const listboxId = useId();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      const items = await searchCities(trimmed, 8, controller.signal);
      setResults(items);
      setIsLoading(false);
      setActiveIndex(-1);
    }, 280);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    setCity(city);
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'ArrowDown' && results.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const item = results[activeIndex];
        if (item) handleSelect(item);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full space-y-2.5 ${className}`}>
      {/* Combobox Input with ARIA Accessibility */}
      <div className="relative">
        <label htmlFor="city-search-input" className="sr-only">
          Search City
        </label>
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vayu-text-secondary pointer-events-none" aria-hidden="true">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-vayu-primary" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          id="city-search-input"
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `city-opt-${activeIndex}` : undefined}
          placeholder={`Search any city (active: ${currentCity.name})...`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-vayu-surface text-vayu-text border border-vayu-border text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring hover:border-vayu-primary"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-vayu-text-secondary hover:text-vayu-text focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown Listbox */}
      {isOpen && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="City suggestions"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto rounded-2xl bg-vayu-surface border border-vayu-border shadow-2xl p-1.5 space-y-1"
        >
          {results.map((city, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <li
                key={`${city.id}-${idx}`}
                id={`city-opt-${idx}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs sm:text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-vayu-surface-tint text-vayu-text font-bold'
                    : 'text-vayu-text hover:bg-vayu-surface-tint'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-vayu-primary shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="font-bold">{city.name}</strong>
                    {city.admin1 ? `, ${city.admin1}` : ''}
                    {city.country ? ` • ${city.country}` : ''}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-vayu-text-secondary opacity-75">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {/* Quick Picks Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-vayu-text-secondary pt-0.5">
        <span className="font-bold opacity-80">{t('search.quickPicks') || 'Quick picks:'}</span>
        {POPULAR_CITIES.map((city) => {
          const isCurrent = currentCity.id === city.id || currentCity.name === city.name;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => handleSelect(city)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                isCurrent
                  ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-sm'
                  : 'bg-vayu-surface border-vayu-border text-vayu-text hover:bg-vayu-surface-tint'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

