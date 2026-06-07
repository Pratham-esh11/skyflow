import React from 'react';
import * as Icons from 'lucide-react';
import type { WeatherData } from '../types/weatherTypes';
import { getWeatherDetails } from '../utils/weatherCodes';
import { Clock } from 'lucide-react';

interface HourlyForecastProps {
  weather: WeatherData;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ weather }) => {
  const { hourly } = weather;

  // Filter next 24 hours starting from current hour
  const getNext24Hours = () => {
    try {
      const now = new Date();
      now.setMinutes(0, 0, 0); // Round down to start of hour
      const nowMs = now.getTime();

      // Find index in hourly times closest to current hour
      let startIndex = hourly.time.findIndex(t => {
        const timeMs = new Date(t).getTime();
        return timeMs >= nowMs;
      });

      // Fallback
      if (startIndex === -1) startIndex = 0;

      // Slice next 24 items
      const next24 = [];
      const len = hourly.time.length;
      for (let i = 0; i < 24 && startIndex + i < len; i++) {
        const idx = startIndex + i;
        next24.push({
          timeStr: hourly.time[idx],
          temp: hourly.temperature2m[idx],
          precipProb: hourly.precipitationProbability[idx],
          code: hourly.weatherCode[idx],
        });
      }
      return next24;
    } catch (e) {
      // Return first 24 if parsing fails
      return Array.from({ length: 24 }).map((_, idx) => ({
        timeStr: hourly.time[idx],
        temp: hourly.temperature2m[idx],
        precipProb: hourly.precipitationProbability[idx],
        code: hourly.weatherCode[idx],
      }));
    }
  };

  const hourItems = getNext24Hours();

  // Format hour label, e.g. "12 PM"
  const formatHour = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: true,
      }).format(date);
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="glass-panel">
      <h3 className="section-title">
        <Clock size={18} /> Hourly Projections
      </h3>
      <div className="hourly-scroll-container">
        {hourItems.map((item, idx) => {
          const details = getWeatherDetails(item.code);
          const IconComponent = (Icons as any)[details.iconName] || Icons.HelpCircle;
          const isNow = idx === 0;

          return (
            <div key={item.timeStr} className={`hourly-card ${isNow ? 'is-active' : ''}`}>
              <span className="hourly-time">
                {isNow ? 'Now' : formatHour(item.timeStr)}
              </span>
              <IconComponent size={24} className="hourly-icon" style={{ color: details.theme === 'sunny' ? '#f59e0b' : 'inherit' }} />
              <span className="hourly-temp">{Math.round(item.temp)}°</span>
              <span className="hourly-precip">
                {item.precipProb > 0 ? `${item.precipProb}%` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
