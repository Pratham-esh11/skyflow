import { useState, useEffect, useCallback } from 'react';
import type { WeatherData, GeocodeResult } from '../types/weatherTypes';

const LOCAL_STORAGE_KEY = 'skyflow_recent_cities';
const DEFAULT_CITY: GeocodeResult = {
  id: 2643743,
  name: 'London',
  latitude: 51.50853,
  longitude: -0.12574,
  country: 'United Kingdom',
  admin1: 'England',
  country_code: 'GB'
};

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentCities, setRecentCities] = useState<GeocodeResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeocodeResult>(DEFAULT_CITY);

  // Load search history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setRecentCities(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent cities', e);
    }
  }, []);

  // Fetch detailed weather forecasts
  const fetchWeather = useCallback(async (city: GeocodeResult) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,pressure_msl,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=auto`;
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to retrieve meteorological data.');
      }
      
      const data = await res.json();
      
      const parsedWeather: WeatherData = {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        elevation: data.elevation,
        current: {
          time: data.current.time,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          apparentTemperature: data.current.apparent_temperature,
          isDay: data.current.is_day === 1,
          precipitation: data.current.precipitation,
          rain: data.current.rain,
          showers: data.current.showers,
          snowfall: data.current.snowfall,
          weatherCode: data.current.weather_code,
          cloudCover: data.current.cloud_cover,
          pressure: data.current.pressure_msl,
          windSpeed: data.current.wind_speed_10m,
        },
        hourly: {
          time: data.hourly.time,
          temperature2m: data.hourly.temperature_2m,
          relativeHumidity2m: data.hourly.relative_humidity_2m,
          dewPoint2m: data.hourly.dew_point_2m,
          apparentTemperature: data.hourly.apparent_temperature,
          precipitationProbability: data.hourly.precipitation_probability,
          weatherCode: data.hourly.weather_code,
          pressureMsl: data.hourly.pressure_msl,
          windSpeed10m: data.hourly.wind_speed_10m,
          uvIndex: data.hourly.uv_index,
        },
        daily: {
          time: data.daily.time,
          weatherCode: data.daily.weather_code,
          temperature2mMax: data.daily.temperature_2m_max,
          temperature2mMin: data.daily.temperature_2m_min,
          apparentTemperatureMax: data.daily.apparent_temperature_max,
          apparentTemperatureMin: data.daily.apparent_temperature_min,
          sunrise: data.daily.sunrise,
          sunset: data.daily.sunset,
          uvIndexMax: data.daily.uv_index_max,
          precipitationSum: data.daily.precipitation_sum,
          windSpeed10mMax: data.daily.wind_speed_10m_max,
        },
        locationName: city.name,
        country: city.country,
        admin1: city.admin1
      };
      
      setWeather(parsedWeather);
      
      // Update history (only cache valid searches)
      if (city.id && city.name !== 'Local Coordinates') {
        setRecentCities(prev => {
          const filtered = prev.filter(item => item.id !== city.id);
          const updated = [city, ...filtered].slice(0, 5); // Cache top 5
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while fetching weather details.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch forecast whenever selected city changes
  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  }, [selectedCity, fetchWeather]);

  // Search geocode helper
  const searchCity = async (query: string): Promise<GeocodeResult[]> => {
    if (!query.trim() || query.length < 2) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []) as GeocodeResult[];
    } catch (err) {
      console.error('Error finding city coords', err);
      return [];
    }
  };

  // Browser Geolocation query
  const fetchWeatherByLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding to find city name
          const revUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
          const res = await fetch(revUrl, {
            headers: { 'User-Agent': 'SkyFlow-Weather-App/1.0' }
          });
          
          let name = 'My Location';
          let country = '';
          let admin1 = '';
          
          if (res.ok) {
            const data = await res.json();
            name = data.address.city || data.address.town || data.address.suburb || data.address.village || 'Local Area';
            country = data.address.country || '';
            admin1 = data.address.state || '';
          }
          
          const geoLoc: GeocodeResult = {
            id: Date.now(), // Temp unique ID
            name,
            latitude,
            longitude,
            country,
            admin1
          };
          
          setSelectedCity(geoLoc);
        } catch (e) {
          // Fallback if reverse geocode fails
          const geoLoc: GeocodeResult = {
            id: Date.now(),
            name: 'Local Coordinates',
            latitude,
            longitude,
            country: ''
          };
          setSelectedCity(geoLoc);
        }
      },
      (err) => {
        console.warn(err);
        setError('Location access denied. Please search for your city manually.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const selectCity = (city: GeocodeResult) => {
    setSelectedCity(city);
  };

  const removeRecentCity = (id: number) => {
    setRecentCities(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    weather,
    loading,
    error,
    recentCities,
    selectedCity,
    searchCity,
    selectCity,
    fetchWeatherByLocation,
    removeRecentCity,
    refreshWeather: () => fetchWeather(selectedCity)
  };
}
