# SkyFlow // Premium Weather Dashboard

SkyFlow is a premium, high-fidelity single-page weather application built using **React, TypeScript, and Vanilla CSS**. It connects directly to the Open-Meteo REST API and Open-Meteo Geocoding endpoints to deliver real-time meteorological observations, hourly breakdowns, daily ranges, and geographic metrics.

Instead of displaying standard flat weather data, SkyFlow leverages custom HTML5 Canvas particle systems, dynamic HSL CSS variable themes, and raw interactive SVGs to deliver a modern glassmorphic dashboard experience.

---

## 🌟 Key Features

- **Dynamic Weather Ambience**: An HTML5 Canvas particle engine that paints fluid weather effects (e.g., drifting snow, diagonal rain streaks with splashes, moving puffy clouds, pulsing solar flares, and thunderstorm flash triggers) syncing in real-time with the current weather code.
- **Glassmorphism Theme System**: A responsive dashboard wrapped in semi-transparent panels with background-blur effects (`backdrop-filter`). The color themes automatically transition through HSL-tailored variables based on weather conditions (sunny, overcast, rainy, snowy, stormy, foggy).
- **Interactive SVG Data Charts**: A custom-drawn vector timeline displaying 24-hour temperature trends and precipitation curves. Includes coordinates tracking, vertical grid alignment guides, and details-rich hover tooltips.
- **Apple Weather-Style Extended Outlook**: A 7-day weather slider mapping individual daily extremes relative to the absolute 7-day temperature boundary—providing an instant visual comparison of seasonal heat changes.
- **Auto-Suggest Geocoding**: Autocomplete city search input matching names instantly across global coordinate registers.
- **One-Click Local Geolocation**: Accesses HTML5 Geolocation API with reverse-lookup reverse geocoding via Nominatim OpenStreetMap APIs.
- **Search History Caching**: Retains recently queried locations using `localStorage` for fast swapping.
- **Zero Configuration Run**: Built using free APIs with no keys required, preventing credential leakage on GitHub and making it instantly plug-and-play.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: React 19 (TypeScript)
- **Scaffolding / Bundler**: Vite
- **Styling**: Modular Vanilla CSS (with CSS variables, keyframe animations, and custom scrollbars)
- **Icons**: Lucide React

```
src/
├── components/
│   ├── CitySearch.tsx        # Geocoding suggestions, location permissions & search history
│   ├── DailyForecast.tsx     # 7-day forecast list with relative Apple Weather-style bars
│   ├── DynamicBackground.tsx # High-performance canvas particle animations
│   ├── HourlyForecast.tsx    # Scrollable list displaying next 24 hours of meteorology
│   ├── WeatherCard.tsx       # Core panel showing active temperature, limits, and descriptions
│   ├── WeatherChart.tsx      # SVG timeline with linear curves, dot vertices, and mouse tooltips
│   └── WeatherMetrics.tsx     # Grid containing Apparent Temp, UV, Wind, Humidity, Sunset/Sunrise
├── hooks/
│   └── useWeather.ts         # Logic controller for query debouncing, coordinates mapping, caching
├── types/
│   └── weatherTypes.ts       # Type models matching JSON weather responses
├── utils/
│   └── weatherCodes.ts       # WMO code translations, theme tags, and icon index maps
├── App.tsx                   # Main orchestrator mounting panels, loading states, and skeletons
├── index.css                 # Global theme colors, keyframe sets, and typography configurations
└── main.tsx                  # React element renderer
```

---

## 🚀 Getting Started

Follow these instructions to run the application locally on your computer.

### Prerequisites

Ensure you have **Node.js** (v18 or above) and **npm** installed.

### Installation

1. Clone this repository to your local drive:
   ```bash
   git clone https://github.com/yourusername/skyflow.git
   cd skyflow
   ```

2. Install the necessary project packages:
   ```bash
   npm install
   ```

3. Boot up the local development web server:
   ```bash
   npm run dev
   ```

4. Open the development link (usually `http://localhost:5173`) in your browser.

---

## 📦 Production Builds & Deployment

To build the project files for deployment:

```bash
npm run build
```

This compiles optimized, compressed TypeScript and JavaScript files into the `dist/` directory, ready to be hosted on any static platform.

### Deploying to GitHub Pages

SkyFlow is pre-configured to be hosted easily on GitHub Pages:

1. Install the deployment tool helper:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add the following scripts to your `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

3. Add `homepage` at the root level of your `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/skyflow"
   ```

4. Execute the deployment script:
   ```bash
   npm run deploy
   ```

---

## 🎨 Professional Highlights

To showcase this project effectively in your resume and interview:

- **Custom SVG Chart vs. Libraries**: Highlight that you crafted the `WeatherChart.tsx` using native SVG coordinates mapping. This highlights a strong command of geometries, React component lifecycle render stages, and mathematical scaling algorithms without introducing dependency bloat.
- **HTML5 Canvas Animation Loop**: Mention that you wrote a high-performance rendering loop with `requestAnimationFrame` inside `DynamicBackground.tsx` to handle responsive particle animation speeds smoothly on GPU layers.
- **CSS Variable Architecture**: Emphasize how clean the layout transitions are, managed via global theme class overlays (`.theme-sunny`, `.theme-stormy`, etc.) which cleanly swap variables across DOM nodes instead of hardcoding multiple CSS classes.
