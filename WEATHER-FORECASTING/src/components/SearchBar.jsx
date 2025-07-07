import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, Navigation, Globe, Star, Zap } from 'lucide-react';
import { weatherService } from '../services/weatherService';

const SearchBar = ({ onLocationSelect, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await weatherService.searchLocations(searchQuery);
      setSuggestions(results.slice(0, 6)); // Limit to 6 suggestions
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce the search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleLocationSelect = (location) => {
    const locationString = `${location.name}, ${location.region}, ${location.country}`;
    setQuery(locationString);
    setShowSuggestions(false);
    setIsFocused(false);
    onLocationSelect(locationString);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      setIsFocused(false);
      onLocationSelect(query.trim());
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          onLocationSelect(locationString);
          setQuery('📍 Current Location');
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  const popularCities = [
    { name: 'New York', region: 'NY', country: 'USA', icon: '🗽' },
    { name: 'London', region: 'England', country: 'UK', icon: '🏰' },
    { name: 'Tokyo', region: 'Tokyo', country: 'Japan', icon: '🗾' },
    { name: 'Paris', region: 'Île-de-France', country: 'France', icon: '🗼' },
    { name: 'Sydney', region: 'NSW', country: 'Australia', icon: '🏄' },
    { name: 'Dubai', region: 'Dubai', country: 'UAE', icon: '🏜️' }
  ];

  return (
    <div className="enhanced-search-container" ref={searchRef}>
      {/* Search Header */}
      <div className="search-header">
        <div className="search-title-section">
          <h2 className="search-main-title">
            <span className="title-icon">🌍</span>
            Discover Weather Worldwide
          </h2>
          <p className="search-subtitle">
            Search any city or use your current location for instant weather updates
          </p>
        </div>
        <div className="search-decorations">
          <div className="floating-icon icon-1">
            <Globe size={20} />
          </div>
          <div className="floating-icon icon-2">
            <Star size={16} />
          </div>
          <div className="floating-icon icon-3">
            <Zap size={18} />
          </div>
        </div>
      </div>

      {/* Enhanced Search Form */}
      <form onSubmit={handleSubmit} className="enhanced-search-form">
        <div className={`enhanced-search-input-container ${isFocused ? 'focused' : ''}`}>
          <div className="search-input-wrapper">
            <div className="search-icon-container">
              <Search className="search-icon" />
              <div className="search-icon-glow"></div>
            </div>
            
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search for any city worldwide..."
              className="enhanced-search-input"
            />
            
            <div className="search-actions">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="location-btn"
                title="Use current location"
              >
                {isLoading ? (
                  <Loader2 className="btn-icon animate-spin" />
                ) : (
                  <Navigation className="btn-icon" />
                )}
                <div className="btn-ripple"></div>
              </button>
              
              <button
                type="submit"
                className="search-submit-btn"
                disabled={!query.trim()}
              >
                <span>Search</span>
                <div className="btn-glow"></div>
              </button>
            </div>
          </div>
          
          <div className="input-border-glow"></div>
        </div>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="enhanced-suggestions-dropdown">
          <div className="suggestions-header">
            <h4>Search Results</h4>
            <div className="suggestions-count">{suggestions.length} found</div>
          </div>
          
          <div className="suggestions-list">
            {suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="enhanced-suggestion-item"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="suggestion-icon">
                  <MapPin size={16} />
                </div>
                <div className="suggestion-content">
                  <div className="suggestion-name">{location.name}</div>
                  <div className="suggestion-details">
                    {location.region && `${location.region}, `}{location.country}
                  </div>
                </div>
                <div className="suggestion-arrow">→</div>
                <div className="suggestion-hover-bg"></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && suggestions.length === 0 && query.length >= 2 && (
        <div className="enhanced-loading-dropdown">
          <div className="loading-content">
            <div className="loading-spinner">
              <Loader2 className="spinner-icon" />
            </div>
            <div className="loading-text">
              <span>Searching locations...</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Cities */}
      {!isFocused && !query && (
        <div className="popular-cities-section">
          <h4 className="popular-cities-title">
            <Star size={16} />
            Popular Destinations
          </h4>
          <div className="popular-cities-grid">
            {popularCities.map((city, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(city)}
                className="popular-city-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="city-icon">{city.icon}</span>
                <div className="city-info">
                  <span className="city-name">{city.name}</span>
                  <span className="city-country">{city.country}</span>
                </div>
                <div className="city-hover-effect"></div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && (
        <div className="current-location-display">
          <div className="current-location-icon">
            <MapPin size={16} />
            <div className="location-pulse"></div>
          </div>
          <span className="current-location-text">
            Currently showing: <strong>{currentLocation}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

