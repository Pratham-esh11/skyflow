import { useWeather } from './hooks/useWeather';
import { getWeatherDetails } from './utils/weatherCodes';
import { DynamicBackground } from './components/DynamicBackground';
import { CitySearch } from './components/CitySearch';
import { WeatherCard } from './components/WeatherCard';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherChart } from './components/WeatherChart';
import { WeatherMetrics } from './components/WeatherMetrics';
import { DailyForecast } from './components/DailyForecast';
import { CloudLightning, AlertTriangle } from 'lucide-react';

function App() {
  const {
    weather,
    loading,
    error,
    recentCities,
    searchCity,
    selectCity,
    fetchWeatherByLocation,
    removeRecentCity,
    refreshWeather,
  } = useWeather();

  // Resolve current active theme
  const weatherDetails = weather
    ? getWeatherDetails(weather.current.weatherCode)
    : { theme: 'cloudy' as const, description: 'Loading...', iconName: 'Cloud' };

  const activeThemeClass = `theme-${weatherDetails.theme}`;

  return (
    <div className={`app-container ${activeThemeClass}`}>
      {/* Dynamic Ambient Animation Canvas */}
      {weather && (
        <DynamicBackground
          theme={weatherDetails.theme}
          isDay={weather.current.isDay}
        />
      )}

      <div className="app-content">
        {/* Brand Header */}
        <header className="app-header">
          <div className="brand-section">
            <CloudLightning size={32} className="brand-logo" />
            <h1 className="brand-name">SkyFlow</h1>
          </div>
          {weather && (
            <div style={{ fontSize: '0.85rem', opacity: 0.8, display: 'flex', gap: '1rem' }}>
              <span>Latitude: {weather.latitude.toFixed(4)}°</span>
              <span>Longitude: {weather.longitude.toFixed(4)}°</span>
            </div>
          )}
        </header>

        {/* Layout Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Search controls + Card */}
          <div className="sidebar-column">
            <CitySearch
              recentCities={recentCities}
              selectedCity={weather ? {
                id: 0,
                name: weather.locationName,
                latitude: weather.latitude,
                longitude: weather.longitude,
                country: weather.country || '',
                admin1: weather.admin1
              } : { id: 0, name: '', latitude: 0, longitude: 0, country: '' }}
              searchCity={searchCity}
              selectCity={selectCity}
              fetchWeatherByLocation={fetchWeatherByLocation}
              removeRecentCity={removeRecentCity}
            />

            {weather ? (
              <WeatherCard
                weather={weather}
                loading={loading}
                refreshWeather={refreshWeather}
              />
            ) : (
              <div className="glass-panel weather-card-main" style={{ minHeight: '300px' }}>
                <div className="skeleton skeleton-circle" style={{ margin: '0 auto 1.5rem' }} />
                <div className="skeleton skeleton-title" style={{ margin: '0 auto 1rem', width: '80%' }} />
                <div className="skeleton skeleton-text" style={{ margin: '0 auto 0.5rem', width: '50%' }} />
                <div className="skeleton skeleton-text" style={{ margin: '0 auto 0', width: '40%' }} />
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Visualizations, Charts, Grid Cards */}
          <div className="main-column">
            {error && (
              <div className="glass-panel error-panel">
                <AlertTriangle size={48} style={{ color: '#ef4444' }} />
                <h3 className="error-title">Unable to Load Weather</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  {error}
                </p>
                <button
                  type="button"
                  className="error-btn"
                  onClick={refreshWeather}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading Skeleton Mode */}
            {loading && !weather && (
              <>
                <div className="glass-panel" style={{ minHeight: '140px' }}>
                  <div className="skeleton skeleton-title" />
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: '70px', flex: 1 }} />
                    ))}
                  </div>
                </div>
                <div className="glass-panel" style={{ minHeight: '220px' }}>
                  <div className="skeleton skeleton-title" style={{ width: '40%' }} />
                  <div className="skeleton" style={{ height: '140px', width: '100%', marginTop: '1rem' }} />
                </div>
                <div className="metrics-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-panel" style={{ minHeight: '110px' }}>
                      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                      <div className="skeleton skeleton-title" style={{ width: '70%', marginTop: '0.5rem' }} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Dashboard Content */}
            {weather && (
              <>
                <HourlyForecast weather={weather} />
                <WeatherChart weather={weather} />
                <WeatherMetrics weather={weather} />
                <DailyForecast weather={weather} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
