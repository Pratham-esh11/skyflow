export interface WeatherCodeDetails {
  description: string;
  theme: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
  iconName: string;
}

export const weatherCodeMap: Record<number, WeatherCodeDetails> = {
  0: { description: 'Clear Sky', theme: 'sunny', iconName: 'Sun' },
  1: { description: 'Mainly Clear', theme: 'sunny', iconName: 'SunDim' },
  2: { description: 'Partly Cloudy', theme: 'cloudy', iconName: 'CloudSun' },
  3: { description: 'Overcast', theme: 'cloudy', iconName: 'Cloud' },
  45: { description: 'Foggy', theme: 'foggy', iconName: 'CloudFog' },
  48: { description: 'Depositing Rime Fog', theme: 'foggy', iconName: 'CloudFog' },
  51: { description: 'Light Drizzle', theme: 'rainy', iconName: 'CloudDrizzle' },
  53: { description: 'Moderate Drizzle', theme: 'rainy', iconName: 'CloudDrizzle' },
  55: { description: 'Dense Drizzle', theme: 'rainy', iconName: 'CloudDrizzle' },
  56: { description: 'Light Freezing Drizzle', theme: 'rainy', iconName: 'CloudSnow' },
  57: { description: 'Dense Freezing Drizzle', theme: 'rainy', iconName: 'CloudSnow' },
  61: { description: 'Slight Rain', theme: 'rainy', iconName: 'CloudRain' },
  63: { description: 'Moderate Rain', theme: 'rainy', iconName: 'CloudRain' },
  65: { description: 'Heavy Rain', theme: 'rainy', iconName: 'CloudRain' },
  66: { description: 'Light Freezing Rain', theme: 'rainy', iconName: 'CloudSnow' },
  67: { description: 'Heavy Freezing Rain', theme: 'rainy', iconName: 'CloudSnow' },
  71: { description: 'Slight Snowfall', theme: 'snowy', iconName: 'Snowflake' },
  73: { description: 'Moderate Snowfall', theme: 'snowy', iconName: 'Snowflake' },
  75: { description: 'Heavy Snowfall', theme: 'snowy', iconName: 'Snowflake' },
  77: { description: 'Snow Grains', theme: 'snowy', iconName: 'Snowflake' },
  80: { description: 'Slight Rain Showers', theme: 'rainy', iconName: 'CloudRain' },
  81: { description: 'Moderate Rain Showers', theme: 'rainy', iconName: 'CloudRain' },
  82: { description: 'Violent Rain Showers', theme: 'rainy', iconName: 'CloudLightning' },
  85: { description: 'Slight Snow Showers', theme: 'snowy', iconName: 'Snowflake' },
  86: { description: 'Heavy Snow Showers', theme: 'snowy', iconName: 'Snowflake' },
  95: { description: 'Thunderstorm', theme: 'stormy', iconName: 'CloudLightning' },
  96: { description: 'Thunderstorm with Slight Hail', theme: 'stormy', iconName: 'CloudLightning' },
  99: { description: 'Thunderstorm with Heavy Hail', theme: 'stormy', iconName: 'CloudLightning' },
};

export function getWeatherDetails(code: number): WeatherCodeDetails {
  return weatherCodeMap[code] || { description: 'Unknown Weather', theme: 'sunny', iconName: 'HelpCircle' };
}
