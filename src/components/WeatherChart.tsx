import React, { useState, useRef } from 'react';
import { TrendingUp } from 'lucide-react';
import type { WeatherData } from '../types/weatherTypes';

interface WeatherChartProps {
  weather: WeatherData;
}

export const WeatherChart: React.FC<WeatherChartProps> = ({ weather }) => {
  const { hourly } = weather;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sample data: 8 points (every 3 hours starting from current)
  const getChartData = () => {
    try {
      const now = new Date();
      now.setMinutes(0, 0, 0);
      const nowMs = now.getTime();

      let startIndex = hourly.time.findIndex(t => new Date(t).getTime() >= nowMs);
      if (startIndex === -1) startIndex = 0;

      const sampled = [];
      // Grab 8 points spaced by 3 hours
      for (let i = 0; i < 8; i++) {
        const idx = startIndex + i * 3;
        if (idx < hourly.time.length) {
          sampled.push({
            timeStr: hourly.time[idx],
            temp: hourly.temperature2m[idx],
            rainChance: hourly.precipitationProbability[idx],
            humidity: hourly.relativeHumidity2m[idx],
            originalIndex: idx
          });
        }
      }
      return sampled;
    } catch (e) {
      return [];
    }
  };

  const chartData = getChartData();
  if (chartData.length === 0) return null;

  // Geometry config for SVG viewBox="0 0 600 180"
  const viewWidth = 600;
  const viewHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 30;

  const chartWidth = viewWidth - paddingLeft - paddingRight;
  const chartHeight = viewHeight - paddingTop - paddingBottom;

  // Find min/max values for scaling
  const temps = chartData.map(d => d.temp);
  let maxTemp = Math.max(...temps);
  let minTemp = Math.min(...temps);
  
  // Pad min/max to prevent boundary clipping
  if (maxTemp === minTemp) {
    maxTemp += 2;
    minTemp -= 2;
  } else {
    const diff = maxTemp - minTemp;
    maxTemp += diff * 0.15;
    minTemp -= diff * 0.15;
  }

  // Calculate pixel coordinates
  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i / (chartData.length - 1)) * chartWidth;
    
    // Scale temp: higher temp = smaller y (closer to top)
    const tempY = paddingTop + chartHeight - ((d.temp - minTemp) / (maxTemp - minTemp)) * chartHeight;
    
    // Scale rain chance (0% to 100%)
    const rainY = paddingTop + chartHeight - (d.rainChance / 100) * chartHeight;

    return {
      x,
      tempY,
      rainY,
      temp: d.temp,
      rainChance: d.rainChance,
      humidity: d.humidity,
      timeLabel: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: true,
      }).format(new Date(d.timeStr))
    };
  });

  // SVG path builders
  const buildLinePath = (coords: { x: number; y: number }[]) => {
    return coords.reduce((path, pt, i) => {
      return i === 0 ? `M ${pt.x} ${pt.y}` : `${path} L ${pt.x} ${pt.y}`;
    }, '');
  };

  const buildAreaPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return '';
    const linePath = buildLinePath(coords);
    const firstX = coords[0].x;
    const lastX = coords[coords.length - 1].x;
    const baseY = paddingTop + chartHeight;
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  const tempLineCoords = points.map(pt => ({ x: pt.x, y: pt.tempY }));
  const tempLinePath = buildLinePath(tempLineCoords);
  const tempAreaPath = buildAreaPath(tempLineCoords);

  const rainLineCoords = points.map(pt => ({ x: pt.x, y: pt.rainY }));
  const rainLinePath = buildLinePath(rainLineCoords);

  // Mouse interactivity triggers
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Convert screen coordinates to SVG viewBox coords
    const svgMouseX = (mouseX / rect.width) * viewWidth;

    // Find closest data index based on X coordinate
    let closestIndex = 0;
    let minDistance = Infinity;

    points.forEach((pt, i) => {
      const dist = Math.abs(pt.x - svgMouseX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    });

    setHoverIndex(closestIndex);
    
    // Position tooltip relative to container
    setTooltipPos({
      x: (points[closestIndex].x / viewWidth) * rect.width,
      y: (points[closestIndex].tempY / viewHeight) * rect.height - 70,
    });
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setTooltipPos(null);
  };

  return (
    <div className="glass-panel" ref={containerRef} style={{ position: 'relative' }}>
      <h3 className="section-title">
        <TrendingUp size={18} /> Daily Trends (Temperature & Rain)
      </h3>

      <div className="chart-container">
        <svg
          className="chart-svg"
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id="temp-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = paddingTop + (i / 3) * chartHeight;
            return (
              <line
                key={i}
                x1={paddingLeft}
                y1={y}
                x2={viewWidth - paddingRight}
                y2={y}
                className="chart-grid-line"
              />
            );
          })}

          {/* Paths */}
          <path d={tempAreaPath} className="chart-area-temp" />
          <path d={tempLinePath} className="chart-line-temp" />
          <path d={rainLinePath} className="chart-line-precip" />

          {/* Labels & Data Markers */}
          {points.map((pt, i) => (
            <g key={i}>
              {/* Hour X Label */}
              <text x={pt.x} y={viewHeight - 10} className="chart-label">
                {pt.timeLabel}
              </text>
              
              {/* Temp text label */}
              <text x={pt.x} y={pt.tempY - 10} className="chart-label-val">
                {Math.round(pt.temp)}°
              </text>

              {/* Rain chance label (if > 0%) */}
              {pt.rainChance > 0 && (
                <text x={pt.x} y={pt.rainY + 14} className="chart-label" style={{ fill: '#38bdf8', fontWeight: 600 }}>
                  {pt.rainChance}%
                </text>
              )}

              {/* Dots on Temperature Line */}
              <circle
                cx={pt.x}
                cy={pt.tempY}
                r={4}
                fill="var(--accent)"
                stroke="#000"
                strokeWidth={1.5}
              />
            </g>
          ))}

          {/* Interactive Hover overlays */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical Guide line */}
              <line
                x1={points[hoverIndex].x}
                y1={paddingTop}
                x2={points[hoverIndex].x}
                y2={viewHeight - paddingBottom}
                stroke="var(--accent)"
                strokeOpacity={0.3}
                strokeWidth={1.5}
                strokeDasharray="2 2"
              />
              {/* Pulsating dot on hover point */}
              <circle
                cx={points[hoverIndex].x}
                cy={points[hoverIndex].tempY}
                r={7}
                className="chart-hover-marker"
              />
            </g>
          )}
        </svg>

        {/* Custom interactive tooltip box */}
        {hoverIndex !== null && tooltipPos && (
          <div
            className="chart-tooltip"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
              transform: 'translateX(-50%)',
              opacity: 1,
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
              {points[hoverIndex].timeLabel}
            </div>
            <div style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Temp: {Math.round(points[hoverIndex].temp)}°C
            </div>
            <div style={{ color: '#38bdf8' }}>
              Precip: {points[hoverIndex].rainChance}%
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Humidity: {points[hoverIndex].humidity}%
            </div>
          </div>
        )}
      </div>

      {/* Legend guide */}
      <div className="chart-legends">
        <div className="chart-legend-item">
          <div className="legend-color-temp" />
          <span>Temperature (°C)</span>
        </div>
        <div className="chart-legend-item">
          <div className="legend-color-precip" />
          <span>Rain Probability (%)</span>
        </div>
      </div>
    </div>
  );
};
