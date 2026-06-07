export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: string[];
  temperature2m: number[];
  relativeHumidity2m: number[];
  dewPoint2m: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  pressureMsl: number[];
  windSpeed10m: number[];
  uvIndex: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationSum: number[];
  windSpeed10mMax: number[];
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  locationName: string;
  country?: string;
  admin1?: string;
}
