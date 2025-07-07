import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WeatherDashboard from './components/WeatherDashboard';
import SearchBar from './components/SearchBar';
import AlertModal from './components/AlertModal';
import { weatherService } from './services/weatherService';
import { pdfService } from './services/pdfService';
import { Loader2, MapPin } from 'lucide-react';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Load initial weather data
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, []);

  const loadWeatherData = async (location) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        weatherService.getCurrentWeather(location),
        weatherService.getForecast(location, 5)
      ]);

      // Combine the data
      const combinedData = {
        ...forecast,
        current: currentWeather.current,
        location: currentWeather.location || forecast.location
      };

      setWeatherData(combinedData);
      setCurrentLocation(`${combinedData.location.name}, ${combinedData.location.region}`);
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError('Failed to load weather data. Using sample data.');
      
      // Load mock data as fallback
      const mockData = weatherService.getMockForecastData();
      setWeatherData(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    loadWeatherData(location);
  };

  const handleDownloadReport = async () => {
    if (!weatherData) return;
    
    setIsGeneratingPDF(true);
    try {
      const filename = await pdfService.generateWeatherReport(weatherData, currentLocation);
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-verdant-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-2 duration-300';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Weather report downloaded successfully!</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-2 duration-300';
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <span>Failed to generate PDF report</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShowAlerts = () => {
    setShowAlerts(true);
  };

  const handleCloseAlerts = () => {
    setShowAlerts(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-verdant-50 via-green-50 to-emerald-50">
      {/* Navbar */}
      <Navbar 
        onDownloadReport={handleDownloadReport}
        onShowAlerts={handleShowAlerts}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Search Section */}
        <div className="bg-gradient-to-r from-verdant-600 to-verdant-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                
              </h2>
              <p className="text-verdant-100">
                
              </p>
            </div>
            <SearchBar 
              onLocationSelect={handleLocationSelect}
              currentLocation={currentLocation}
            />
          </div>
        </div>

        {/* Weather Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-verdant-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading weather data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Weather Data Notice
              </h3>
              <p className="text-yellow-700 mb-4">{error}</p>
              <button
                onClick={() => loadWeatherData(currentLocation)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <WeatherDashboard 
            weatherData={weatherData}
            location={currentLocation}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Alert Modal */}
      <AlertModal 
        isOpen={showAlerts}
        onClose={handleCloseAlerts}
        alerts={weatherData?.alerts || []}
      />

      {/* PDF Generation Loading Overlay */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-verdant-600 mx-auto mb-4" />
            <p className="text-gray-700">Generating weather report...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

