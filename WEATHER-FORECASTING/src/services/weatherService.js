const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export const weatherService = {
  // Get current weather data
  async getCurrentWeather(location) {
    try {
      const response = await fetch(
        `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatCurrentWeather(data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return this.getMockCurrentWeather();
    }
  },

  // Get forecast data
  async getForecast(location, days = 5) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=${days}&aqi=yes&alerts=yes`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.formatForecastData(data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return this.getMockForecastData();
    }
  },

  // Search for locations
  async searchLocations(query) {
    try {
      const response = await fetch(
        `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  // Format current weather data
  formatCurrentWeather(data) {
    const { current, location } = data;
    
    return {
      location: {
        name: location.name,
        region: location.region,
        country: location.country,
        localtime: location.localtime
      },
      current: {
        temp: Math.round(current.temp_c),
        condition: current.condition.text,
        humidity: current.humidity,
        windSpeed: Math.round(current.wind_kph),
        visibility: current.vis_km,
        pressure: current.pressure_mb,
        uvIndex: current.uv,
        feelsLike: Math.round(current.feelslike_c),
        icon: current.condition.icon,
        isDay: current.is_day
      },
      airQuality: current.air_quality ? {
        co: current.air_quality.co,
        no2: current.air_quality.no2,
        o3: current.air_quality.o3,
        so2: current.air_quality.so2,
        pm2_5: current.air_quality.pm2_5,
        pm10: current.air_quality.pm10,
        usEpaIndex: current.air_quality['us-epa-index'],
        gbDefraIndex: current.air_quality['gb-defra-index']
      } : null
    };
  },

  // Format forecast data
  formatForecastData(data) {
    const { forecast, location, current, alerts } = data;
    
    // Format hourly data for today
    const today = forecast.forecastday[0];
    const currentHour = new Date().getHours();
    const hourly = today.hour
      .slice(currentHour, currentHour + 6)
      .map(hour => ({
        time: new Date(hour.time).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        temp: Math.round(hour.temp_c),
        condition: hour.condition.text,
        icon: this.getWeatherEmoji(hour.condition.text),
        chanceOfRain: hour.chance_of_rain
      }));

    // Format daily forecast
    const daily = forecast.forecastday.map((day, index) => ({
      day: index === 0 ? 'Today' : 
           index === 1 ? 'Tomorrow' : 
           new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
      date: day.date,
      high: Math.round(day.day.maxtemp_c),
      low: Math.round(day.day.mintemp_c),
      condition: day.day.condition.text,
      icon: this.getWeatherEmoji(day.day.condition.text),
      chanceOfRain: day.day.daily_chance_of_rain,
      humidity: day.day.avghumidity,
      windSpeed: Math.round(day.day.maxwind_kph)
    }));

    return {
      location: {
        name: location.name,
        region: location.region,
        country: location.country
      },
      current: this.formatCurrentWeather(data).current,
      hourly,
      forecast: daily,
      alerts: alerts?.alert || []
    };
  },

  // Get weather emoji based on condition
  getWeatherEmoji(condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return '☀️';
    } else if (conditionLower.includes('partly cloudy')) {
      return '⛅';
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return '☁️';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return '🌧️';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return '⛈️';
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
      return '❄️';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return '🌫️';
    } else if (conditionLower.includes('wind')) {
      return '💨';
    }
    
    return '🌤️'; // Default
  },

  // Mock data for fallback
  getMockCurrentWeather() {
    return {
      location: {
        name: 'New York',
        region: 'New York',
        country: 'United States',
        localtime: new Date().toISOString()
      },
      current: {
        temp: 24,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        visibility: 10,
        pressure: 1013,
        uvIndex: 6,
        feelsLike: 26,
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        isDay: 1
      },
      airQuality: null
    };
  },

  getMockForecastData() {
    return {
      location: {
        name: 'New York',
        region: 'New York',
        country: 'United States'
      },
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
        { time: '12:00', temp: 24, condition: 'Partly Cloudy', icon: '⛅', chanceOfRain: 10 },
        { time: '13:00', temp: 25, condition: 'Sunny', icon: '☀️', chanceOfRain: 5 },
        { time: '14:00', temp: 26, condition: 'Partly Cloudy', icon: '⛅', chanceOfRain: 15 },
        { time: '15:00', temp: 25, condition: 'Cloudy', icon: '☁️', chanceOfRain: 20 },
        { time: '16:00', temp: 23, condition: 'Light Rain', icon: '🌧️', chanceOfRain: 80 },
        { time: '17:00', temp: 22, condition: 'Light Rain', icon: '🌧️', chanceOfRain: 75 }
      ],
      forecast: [
        { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: '⛅', chanceOfRain: 20 },
        { day: 'Tomorrow', high: 28, low: 20, condition: 'Sunny', icon: '☀️', chanceOfRain: 5 },
        { day: 'Wednesday', high: 24, low: 16, condition: 'Rainy', icon: '🌧️', chanceOfRain: 85 },
        { day: 'Thursday', high: 22, low: 14, condition: 'Cloudy', icon: '☁️', chanceOfRain: 30 },
        { day: 'Friday', high: 25, low: 17, condition: 'Sunny', icon: '☀️', chanceOfRain: 10 }
      ],
      alerts: []
    };
  }
};

