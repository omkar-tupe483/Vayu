import React from 'react';
import { useCity } from '../../contexts/CityContext';
import { CityLocation } from '../../constants/cities';
import { Bookmark, BookmarkCheck, X } from 'lucide-react';

export const SavedCityChips: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentCity, setCity, savedCities, saveCity, removeSavedCity, isCitySaved } = useCity();

  const isCurrentSaved = isCitySaved(currentCity);

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Bookmark current city toggle button */}
      <button
        type="button"
        onClick={() => (isCurrentSaved ? removeSavedCity(currentCity.name) : saveCity(currentCity))}
        title={isCurrentSaved ? 'Remove from saved locations' : 'Save current city'}
        aria-label={isCurrentSaved ? 'Remove from saved locations' : 'Save current city'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
          isCurrentSaved
            ? 'bg-vayu-accent/20 border-vayu-accent text-vayu-accent-link'
            : 'bg-vayu-surface border-vayu-border text-vayu-text-secondary hover:text-vayu-text hover:bg-vayu-surface-tint'
        }`}
      >
        {isCurrentSaved ? (
          <>
            <BookmarkCheck className="w-3.5 h-3.5 text-vayu-accent" aria-hidden="true" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Save City</span>
          </>
        )}
      </button>

      {/* Chips for saved cities */}
      {savedCities.map((city: CityLocation) => {
        const isSelected = city.name.toLowerCase() === currentCity.name.toLowerCase();

        return (
          <div
            key={city.name}
            className={`inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-xs font-bold border transition-all ${
              isSelected
                ? 'bg-vayu-accent text-vayu-btn-text border-vayu-accent shadow-sm'
                : 'bg-vayu-surface text-vayu-text border-vayu-border hover:bg-vayu-surface-tint'
            }`}
          >
            <button
              type="button"
              onClick={() => setCity(city)}
              className="focus:outline-none focus:underline"
            >
              {city.name}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSavedCity(city.name);
              }}
              title={`Remove ${city.name}`}
              aria-label={`Remove ${city.name}`}
              className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20 text-current opacity-70 hover:opacity-100"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
