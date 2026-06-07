import React from 'react';
import * as Icons from 'lucide-react';
import { Calendar } from 'lucide-react';
import type { WeatherData } from '../types/weatherTypes';
import { getWeatherDetails } from '../utils/weatherCodes';

interface DailyForecastProps {
  weather: WeatherData;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ weather }) => {
  const { daily } = weather;

  // Find extreme limits over the entire 7 days for range mapping
  const overallMin = Math.min(...daily.temperature2mMin);
  const overallMax = Math.max(...daily.temperature2mMax);
  const overallRange = overallMax - overallMin;

  const formatDayName = (isoString: string, index: number) => {
    if (index === 0) return 'Today';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    } catch (e) {
      return '';
    }
  };

  const getBarOffsets = (min: number, max: number) => {
    if (overallRange === 0) return { left: 0, width: 100 };
    const left = ((min - overallMin) / overallRange) * 100;
    const width = ((max - min) / overallRange) * 100;
    return { left, width };
  };

  // Compile daily items
  const forecastDays = daily.time.map((time, idx) => {
    const minTemp = daily.temperature2mMin[idx];
    const maxTemp = daily.temperature2mMax[idx];
    const code = daily.weatherCode[idx];
    const { left, width } = getBarOffsets(minTemp, maxTemp);

    return {
      dayName: formatDayName(time, idx),
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      code,
      barLeft: left,
      barWidth: width
    };
  });

  return (
    <div className="glass-panel">
      <h3 className="section-title">
        <Calendar size={18} /> 7-Day Extended Outlook
      </h3>
      <div className="daily-forecast-list">
        {forecastDays.map((day, idx) => {
          const details = getWeatherDetails(day.code);
          const IconComponent = (Icons as any)[details.iconName] || Icons.HelpCircle;

          return (
            <div key={idx} className="daily-row">
              <span className="daily-day">{day.dayName}</span>
              
              <span className="daily-icon-wrapper" title={details.description}>
                <IconComponent size={20} style={{ color: details.theme === 'sunny' ? '#f59e0b' : 'inherit' }} />
              </span>

              {/* Dynamic horizontal temperature range slider bar */}
              <div className="daily-temp-bar-container" title={`Spread: ${day.minTemp}°C to ${day.maxTemp}°C`}>
                <div
                  className="daily-temp-bar-filled"
                  style={{
                    left: `${day.barLeft}%`,
                    width: `${day.barWidth}%`,
                  }}
                />
              </div>

              <div className="daily-temp-range">
                <span className="daily-temp-min">{day.minTemp}°</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>—</span>
                <span className="daily-temp-max">{day.maxTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
