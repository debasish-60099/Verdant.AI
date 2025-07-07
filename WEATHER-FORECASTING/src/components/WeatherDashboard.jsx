import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets, 
  Eye, 
  Gauge,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';

const WeatherDashboard = ({ weatherData, location }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock weather data if none provided
  const defaultWeatherData = {
    current: {
      temp: 24,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      uvIndex: 6,
      feelsLike: 26
    },
    hourly: [
      { time: '12:00', temp: 24, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '13:00', temp: 25, condition: 'Sunny', icon: '☀️' },
      { time: '14:00', temp: 26, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '15:00', temp: 25, condition: 'Cloudy', icon: '☁️' },
      { time: '16:00', temp: 23, condition: 'Light Rain', icon: '🌧️' },
      { time: '17:00', temp: 22, condition: 'Light Rain', icon: '🌧️' },
    ],
    forecast: [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: '☀️' },
      { day: 'Wednesday', high: 24, low: 16, condition: 'Rainy', icon: '🌧️' },
      { day: 'Thursday', high: 22, low: 14, condition: 'Cloudy', icon: '☁️' },
      { day: 'Friday', high: 25, low: 17, condition: 'Sunny', icon: '☀️' },
    ]
  };

  const weather = weatherData || defaultWeatherData;
  const currentLocation = location || 'New York, NY';

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="weather-icon" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="weather-icon" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="weather-icon" />;
      default:
        return <Sun className="weather-icon" />;
    }
  };

  const getUVIndexColor = (uvIndex) => {
    if (uvIndex <= 2) return '#22c55e'; // Green
    if (uvIndex <= 5) return '#eab308'; // Yellow
    if (uvIndex <= 7) return '#f97316'; // Orange
    if (uvIndex <= 10) return '#ef4444'; // Red
    return '#8b5cf6'; // Purple
  };

  const getUVIndexLabel = (uvIndex) => {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="glass-card header-section">
          <div className="location-info">
            <div className="location-icon">
              <MapPin size={32} className="text-green" />
            </div>
            <div className="location-text">
              <h2>{currentLocation}</h2>
              <p>
                <Calendar size={20} />
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="time-display">
            <Clock size={20} />
            <span className="time-text">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Current Weather */}
        <div className="weather-grid">
          {/* Main Weather Card */}
          <div className="glass-card main-weather-card">
            <div className="weather-header">
              <h3 className="weather-title">Current Weather</h3>
              <div className="current-weather-display">
                <div className="weather-icon-container">
                  {getWeatherIcon(weather.current.condition)}
                </div>
                <div className="temperature-info">
                  <p className="temperature-main">{weather.current.temp}°</p>
                  <p className="weather-condition">{weather.current.condition}</p>
                  <p className="feels-like">Feels like {weather.current.feelsLike}°C</p>
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon bg-blue">
                  <Wind size={24} color="white" />
                </div>
                <p className="metric-label text-blue">Wind Speed</p>
                <p className="metric-value text-blue">{weather.current.windSpeed}</p>
                <p className="metric-unit text-blue">km/h</p>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon bg-cyan">
                  <Droplets size={24} color="white" />
                </div>
                <p className="metric-label text-cyan">Humidity</p>
                <p className="metric-value text-cyan">{weather.current.humidity}</p>
                <p className="metric-unit text-cyan">%</p>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon bg-gray">
                  <Eye size={24} color="white" />
                </div>
                <p className="metric-label text-gray">Visibility</p>
                <p className="metric-value text-gray">{weather.current.visibility}</p>
                <p className="metric-unit text-gray">km</p>
              </div>
              
              <div className="metric-card">
                <div className="metric-icon bg-purple">
                  <Gauge size={24} color="white" />
                </div>
                <p className="metric-label text-purple">Pressure</p>
                <p className="metric-value text-purple">{weather.current.pressure}</p>
                <p className="metric-unit text-purple">hPa</p>
              </div>
            </div>
          </div>

          {/* UV Index Card */}
          <div className="glass-card uv-index-card">
            <h3 className="uv-title">UV Index</h3>
            <div className="uv-circle-container">
              <svg className="uv-circle" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={getUVIndexColor(weather.current.uvIndex)}
                  strokeWidth="2.5"
                  strokeDasharray={`${(weather.current.uvIndex / 11) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="uv-value">{weather.current.uvIndex}</div>
            </div>
            <div>
              <p className="uv-label" style={{ color: getUVIndexColor(weather.current.uvIndex) }}>
                {getUVIndexLabel(weather.current.uvIndex)}
              </p>
              <p className="uv-recommendation">
                {weather.current.uvIndex > 3 ? 'UV Protection Recommended' : 'UV Protection Optional'}
              </p>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="glass-card forecast-section">
          <h3 className="forecast-title">Hourly Forecast</h3>
          <div className="hourly-container">
            {weather.hourly.map((hour, index) => (
              <div key={index} className="hourly-card">
                <p className="hourly-time">{hour.time}</p>
                <div className="hourly-icon">{hour.icon}</div>
                <p className="hourly-temp">{hour.temp}°</p>
                <p className="hourly-condition">{hour.condition}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="glass-card forecast-section">
          <h3 className="forecast-title">5-Day Forecast</h3>
          <div className="daily-container">
            {weather.forecast.map((day, index) => (
              <div key={index} className="daily-card">
                <div className="daily-left">
                  <span className="daily-icon">{day.icon}</span>
                  <div className="daily-info">
                    <h4>{day.day}</h4>
                    <p>{day.condition}</p>
                  </div>
                </div>
                <div className="daily-temps">
                  <span className="daily-high">{day.high}°</span>
                  <span className="daily-separator">/</span>
                  <span className="daily-low">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
