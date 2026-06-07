import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import type { GeocodeResult } from '../types/weatherTypes';

interface CitySearchProps {
  recentCities: GeocodeResult[];
  selectedCity: GeocodeResult;
  searchCity: (query: string) => Promise<GeocodeResult[]>;
  selectCity: (city: GeocodeResult) => void;
  fetchWeatherByLocation: () => void;
  removeRecentCity: (id: number) => void;
}

export const CitySearch: React.FC<CitySearchProps> = ({
  recentCities,
  searchCity,
  selectCity,
  fetchWeatherByLocation,
  removeRecentCity,
}) => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      const results = await searchCity(query);
      setSuggestions(results);
      setSearching(false);
      setIsOpen(true);
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (city: GeocodeResult) => {
    selectCity(city);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="glass-panel" ref={containerRef}>
      <h3 className="section-title">
        <Search size={18} /> Location Search
      </h3>
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search for cities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
          />
          <div style={{ position: 'absolute', right: '3rem', display: 'flex', gap: '0.25rem' }}>
            {query && (
              <button
                type="button"
                className="geo-button"
                style={{ padding: '0.25rem' }}
                onClick={() => setQuery('')}
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              className="geo-button"
              title="Use Current Location"
              onClick={fetchWeatherByLocation}
            >
              <MapPin size={18} />
            </button>
          </div>
          <Search size={18} className="search-icon" style={{ right: '1.25rem' }} />
        </div>

        {/* Suggestion Dropdown */}
        {isOpen && (suggestions.length > 0 || searching) && (
          <ul className="suggestions-list">
            {searching ? (
              <li className="suggestion-item" style={{ cursor: 'default' }}>
                <span className="suggestion-title">Searching...</span>
              </li>
            ) : (
              suggestions.map((city) => (
                <li key={city.id} className="suggestion-item" onClick={() => handleSelect(city)}>
                  <span className="suggestion-title">{city.name}</span>
                  <span className="suggestion-subtitle">
                    {city.admin1 ? `${city.admin1}, ` : ''}
                    {city.country}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Recent History */}
      {recentCities.length > 0 && (
        <div className="recent-searches">
          <span className="recent-title">Recent Searches</span>
          <div className="recent-list">
            {recentCities.map((city) => (
              <div
                key={city.id}
                className="recent-item"
                onClick={() => selectCity(city)}
              >
                <div className="recent-city-info">
                  <span className="recent-city-name">{city.name}</span>
                  <span className="recent-city-country">
                    {city.admin1 ? `${city.admin1}, ` : ''}
                    {city.country}
                  </span>
                </div>
                <button
                  type="button"
                  className="recent-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid selecting the city
                    removeRecentCity(city.id);
                  }}
                  title="Remove from history"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
