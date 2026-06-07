import React from 'react';
import * as Icons from 'lucide-react';
import type { WeatherData } from '../types/weatherTypes';
import { getWeatherDetails } from '../utils/weatherCodes';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  loading: boolean;
  refreshWeather: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, loading, refreshWeather }) => {
  const { current, daily, locationName, country, admin1 } = weather;
  const weatherDetails = getWeatherDetails(current.weatherCode);
  
  // Resolve Lucide Icon dynamically
  const IconComponent = (Icons as any)[weatherDetails.iconName] || Icons.HelpCircle;

  // Format local date and time
  const formatLocalDate = () => {
    try {
      const date = new Date(current.time);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  // Current day max/min temp
  const maxTemp = Math.round(daily.temperature2mMax[0]);
  const minTemp = Math.round(daily.temperature2mMin[0]);

  return (
    <div className="glass-panel weather-card-main">
      {/* Refresh overlay button */}
      <button 
        type="button" 
        className="geo-button" 
        style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', padding: '0.4rem' }}
        onClick={refreshWeather}
        disabled={loading}
        title="Refresh data"
      >
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
      </button>

      <div className="weather-header">
        <h2 className="weather-location">{locationName}</h2>
        <span className="weather-region">
          {admin1 ? `${admin1}, ` : ''}
          {country || ''}
        </span>
        <span className="hourly-time" style={{ marginTop: '0.25rem' }}>
          {formatLocalDate()}
        </span>
      </div>

      <div className="weather-art-wrapper">
        <IconComponent size={96} className="weather-main-icon" />
      </div>

      <div className="weather-temp-container">
        <span className="weather-temp">
          {Math.round(current.temperature)}
          <span className="weather-temp-unit">°C</span>
        </span>
      </div>

      <p className="weather-description">{weatherDetails.description}</p>

      <div className="weather-limits">
        <span title="High Temperature" style={{ color: '#f87171' }}>
          <ArrowUp size={16} /> {maxTemp}°
        </span>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
        <span title="Low Temperature" style={{ color: '#60a5fa' }}>
          <ArrowDown size={16} /> {minTemp}°
        </span>
      </div>
    </div>
  );
};
