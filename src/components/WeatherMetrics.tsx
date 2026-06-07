import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Gauge, 
  Sunrise, 
  Sunset 
} from 'lucide-react';
import type { WeatherData } from '../types/weatherTypes';

interface WeatherMetricsProps {
  weather: WeatherData;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather }) => {
  const { current, daily } = weather;

  // Format Sunrise / Sunset times
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch (e) {
      return '--:--';
    }
  };

  const uvVal = daily.uvIndexMax[0];
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const getHumidityLevel = (hum: number) => {
    if (hum < 30) return 'Dry';
    if (hum <= 60) return 'Comfortable';
    return 'Humid';
  };

  return (
    <div className="metrics-grid">
      {/* Feels Like Card */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Feels Like</span>
          <div className="metric-icon-wrapper">
            <Thermometer size={16} />
          </div>
        </div>
        <span className="metric-value">{Math.round(current.apparentTemperature)}°C</span>
        <span className="metric-desc">
          {current.apparentTemperature > current.temperature ? 'Feels warmer than actual temp.' : 'Feels cooler than actual temp.'}
        </span>
      </div>

      {/* Humidity Card */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Humidity</span>
          <div className="metric-icon-wrapper">
            <Droplets size={16} />
          </div>
        </div>
        <span className="metric-value">{current.humidity}%</span>
        <span className="metric-desc">{getHumidityLevel(current.humidity)} indoor comfort</span>
      </div>

      {/* Wind Card */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Wind Speed</span>
          <div className="metric-icon-wrapper">
            <Wind size={16} />
          </div>
        </div>
        <span className="metric-value">{Math.round(current.windSpeed)} <span style={{ fontSize: '0.875rem' }}>km/h</span></span>
        <span className="metric-desc">Gentle air currents today</span>
      </div>

      {/* UV Index Card */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>UV Index</span>
          <div className="metric-icon-wrapper">
            <Sun size={16} />
          </div>
        </div>
        <span className="metric-value">{uvVal.toFixed(1)}</span>
        <span className="metric-desc">{getUvLevel(uvVal)} UV exposure risk</span>
      </div>

      {/* Pressure Card */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span>Air Pressure</span>
          <div className="metric-icon-wrapper">
            <Gauge size={16} />
          </div>
        </div>
        <span className="metric-value">{Math.round(current.pressure)} <span style={{ fontSize: '0.85rem' }}>hPa</span></span>
        <span className="metric-desc">Stable atmospheric conditions</span>
      </div>

      {/* Sunrise / Sunset Card */}
      <div className="metric-card" style={{ gridColumn: 'span 1' }}>
        <div className="metric-card-header">
          <span>Sunrise & Sunset</span>
          <div className="metric-icon-wrapper">
            <Sunrise size={14} style={{ marginRight: '0.15rem' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sunrise size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatTime(daily.sunrise[0])}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sunset size={16} style={{ color: '#a855f7' }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatTime(daily.sunset[0])}</span>
          </div>
        </div>
        <span className="metric-desc" style={{ marginTop: '0.2rem' }}>Local timezone calculations</span>
      </div>
    </div>
  );
};
