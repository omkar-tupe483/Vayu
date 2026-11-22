import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, Loader2, MapPin, Compass } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { GeoCityItem } from '../../schemas/geocodingSchema';
import { useCitySearch } from '../../hooks/useCitySearch';
import { POPULAR_CITIES } from '../../constants/cities';

export interface CitySearchProps {
  onSelectCity: (city: GeoCityItem) => void;
  selectedCity?: GeoCityItem;
  className?: string;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  onSelectCity,
  selectedCity,
  className = '',
}) => {
  const { t } = useTranslation();
  const { searchTerm, setSearchTerm, cities, isLoading, clearSearch } = useCitySearch(300);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (city: GeoCityItem) => {
      onSelectCity(city);
      setSearchTerm('');
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onSelectCity, setSearchTerm]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || cities.length === 0) {
      if (e.key === 'ArrowDown' && cities.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < cities.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : cities.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < cities.length) {
          const selected = cities[activeIndex];
          if (selected) {
            handleSelect(selected);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <label htmlFor="city-search-input" className="sr-only">
          {t('search.placeholder')}
        </label>
        <div className="absolute left-3.5 text-vayu-text-secondary pointer-events-none flex items-center">
          <Search className="w-5 h-5 text-vayu-text-secondary" aria-hidden="true" />
        </div>

        <input
          id="city-search-input"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && cities.length > 0}
          aria-autocomplete="list"
          aria-controls="city-search-results"
          aria-activedescendant={activeIndex >= 0 ? `city-option-${activeIndex}` : undefined}
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value.slice(0, 100));
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (cities.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-11 pr-24 py-3 bg-vayu-surface-elevated text-vayu-text placeholder-vayu-text-secondary/70 border border-vayu-border rounded-2xl shadow-sm text-sm sm:text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring focus:border-transparent"
        />

        <div className="absolute right-3 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-vayu-primary animate-spin" aria-hidden="true" />
          )}

          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                clearSearch();
                inputRef.current?.focus();
              }}
              aria-label={t('search.clear')}
              className="p-1 rounded-full text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && searchTerm.trim().length >= 2 && (
        <div
          id="city-search-results"
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-vayu-surface-elevated border border-vayu-border rounded-2xl shadow-2xl p-1.5 space-y-1"
        >
          {isLoading && cities.length === 0 ? (
            <div className="py-4 text-center text-xs text-vayu-text-secondary flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-vayu-primary" aria-hidden="true" />
              <span>{t('search.searching')}</span>
            </div>
          ) : cities.length === 0 ? (
            <div className="py-4 text-center text-xs text-vayu-text-secondary">
              {t('search.noResults')} <span className="font-bold">"{searchTerm}"</span>
            </div>
          ) : (
            cities.map((city, idx) => {
              const isSelected = selectedCity?.id === city.id;
              const isActive = activeIndex === idx;

              return (
                <div
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  id={`city-option-${idx}`}
                  role="option"
                  aria-selected={isActive || isSelected}
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-sm transition ${
                    isActive
                      ? 'bg-vayu-primary text-vayu-text font-bold'
                      : isSelected
                      ? 'bg-vayu-surface-tint text-vayu-text font-semibold'
                      : 'text-vayu-text hover:bg-vayu-surface-tint'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-vayu-accent shrink-0" aria-hidden="true" />
                    <div className="truncate">
                      <span className="font-bold">{city.name}</span>
                      {city.admin1 && (
                        <span className="text-xs opacity-75 ml-1">({city.admin1})</span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/10 dark:bg-white/10 shrink-0">
                    {city.country || city.country_code || ''}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Quick Picks / Popular Cities */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-1">
        <span className="text-xs font-bold text-vayu-text-secondary flex items-center gap-1 mr-1">
          <Compass className="w-3.5 h-3.5 text-vayu-primary" aria-hidden="true" />
          <span>{t('search.quickPicks')}</span>
        </span>
        {POPULAR_CITIES.map((quickCity) => {
          const isCurrent = selectedCity?.name === quickCity.name && selectedCity?.country === quickCity.country;
          return (
            <button
              key={quickCity.id}
              type="button"
              onClick={() => onSelectCity(quickCity)}
              aria-pressed={isCurrent}
              className={`text-xs px-2.5 py-1 rounded-full border transition font-medium focus:outline-none focus:ring-2 focus:ring-vayu-focus-ring ${
                isCurrent
                  ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent font-bold shadow-sm'
                  : 'bg-vayu-surface text-vayu-text border-vayu-border hover:bg-vayu-surface-tint'
              }`}
            >
              {quickCity.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
