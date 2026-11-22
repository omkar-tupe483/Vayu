import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n';
import { GeoCityItem } from '../../schemas/geocodingSchema';
import { openMeteoService } from '../../services/openMeteo';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

interface CitySearchProps {
  selectedCity: GeoCityItem;
  onSelectCity: (city: GeoCityItem) => void;
  isLoading?: boolean;
}

const DEFAULT_POPULAR_CITIES: readonly GeoCityItem[] = [
  { id: 1273294, name: 'Delhi', latitude: 28.65195, longitude: 77.23149, country: 'India', admin1: 'Delhi' },
  { id: 1275339, name: 'Mumbai', latitude: 19.07283, longitude: 72.88261, country: 'India', admin1: 'Maharashtra' },
  { id: 1277333, name: 'Bengaluru', latitude: 12.97194, longitude: 77.59369, country: 'India', admin1: 'Karnataka' },
  { id: 2643743, name: 'London', latitude: 51.50853, longitude: -0.12574, country: 'United Kingdom', admin1: 'England' },
  { id: 5128581, name: 'New York', latitude: 40.71427, longitude: -74.00597, country: 'United States', admin1: 'New York' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.69171, country: 'Japan', admin1: 'Tokyo' },
] as const;

export const CitySearch: React.FC<CitySearchProps> = ({
  selectedCity,
  onSelectCity,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoCityItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search with Zod validation
  useEffect(() => {
    const trimmed = query.trim().slice(0, 100);
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      setErrorMsg(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(async () => {
      try {
        const cities = await openMeteoService.searchCities(trimmed);
        setResults(cities);
        setIsOpen(true);
        setActiveIndex(-1);
      } catch {
        setErrorMsg(t('search.error'));
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [query, t]);

  const handleSelect = (city: GeoCityItem) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[activeIndex];
      if (activeIndex >= 0 && target) {
        handleSelect(target);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3" ref={containerRef}>
      {/* Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-teal-400" aria-hidden="true" />
        </div>

        <input
          type="text"
          value={query}
          maxLength={100}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label={t('search.placeholder')}
          placeholder={t('search.placeholder')}
          className="w-full pl-11 pr-11 py-3.5 bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 focus:border-teal-500 rounded-2xl text-slate-100 placeholder-slate-400 text-sm md:text-base outline-none shadow-xl transition-all focus:ring-2 focus:ring-teal-500/20"
        />

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {isSearching && (
            <Loader2 className="w-4 h-4 text-teal-400 animate-spin" aria-label={t('search.searching')} />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              aria-label={t('search.clear')}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 backdrop-blur-xl">
            {errorMsg ? (
              <div className="p-4 text-center text-xs text-rose-400" role="alert">
                {errorMsg}
              </div>
            ) : results.length > 0 ? (
              results.map((city, idx) => (
                <button
                  key={`${city.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors ${
                    activeIndex === idx
                      ? 'bg-slate-800 text-teal-300'
                      : 'hover:bg-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-white truncate">{city.name}</span>
                    {city.admin1 && (
                      <span className="text-xs text-slate-400 truncate hidden sm:inline">
                        {city.admin1}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 shrink-0">
                    {city.country && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {city.country}
                      </span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                {t('search.noResults')} &quot;{query}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Picks */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        <span className="text-xs text-slate-400 mr-1 hidden sm:inline">{t('search.quickPicks')}</span>
        {DEFAULT_POPULAR_CITIES.map((c) => {
          const isSelected = selectedCity.id === c.id || selectedCity.name === c.name;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c)}
              disabled={isLoading}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                isSelected
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

