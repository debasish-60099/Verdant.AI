import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [topWinners, setTopWinners] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [sixMonthsForecast, setSixMonthsForecast] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(false);

  const commodities = [
    'arhar', 'bajra', 'barley', 'copra', 'cotton', 'sesamum', 'gram',
    'groundnut', 'jowar', 'maize', 'masoor', 'moong', 'niger', 'paddy',
    'ragi', 'rape', 'jute', 'safflower', 'soyabean', 'sugarcane',
    'sunflower', 'urad', 'wheat'
  ];

  // Mock data for demonstration (since Flask backend might not be running)
  const mockTopWinners = [
    ['Wheat', 1350.50, 5.2],
    ['Paddy', 1245.75, 4.8],
    ['Maize', 1175.25, 3.9],
    ['Cotton', 3600.00, 3.5],
    ['Sugarcane', 2250.80, 2.8]
  ];

  const mockTopLosers = [
    ['Arhar', 3200.25, -2.1],
    ['Urad', 4300.50, -1.8],
    ['Moong', 3500.75, -1.5],
    ['Groundnut', 3700.00, -1.2],
    ['Sunflower', 3700.25, -0.9]
  ];

  const mockSixMonthsForecast = [
    ['Jan 25', 'Wheat', 1350.50, 5.2, 'Arhar', 3200.25, -2.1],
    ['Feb 25', 'Paddy', 1245.75, 4.8, 'Urad', 4300.50, -1.8],
    ['Mar 25', 'Maize', 1175.25, 3.9, 'Moong', 3500.75, -1.5],
    ['Apr 25', 'Cotton', 3600.00, 3.5, 'Groundnut', 3700.00, -1.2],
    ['May 25', 'Sugarcane', 2250.80, 2.8, 'Sunflower', 3700.25, -0.9],
    ['Jun 25', 'Gram', 2800.00, 2.5, 'Sesamum', 4200.00, -0.5]
  ];

  useEffect(() => {
    // Initialize with mock data
    setTopWinners(mockTopWinners);
    setTopLosers(mockTopLosers);
    setSixMonthsForecast(mockSixMonthsForecast);
  }, []);

  const handleCropSelect = async (crop) => {
    setSelectedCrop(crop);
    setLoading(true);
    
    try {
      // Try to fetch from Flask backend
      const response = await fetch(`http://localhost:5000/commodity/${crop}`);
      if (response.ok) {
        const data = await response.text();
        setCropData(data);
      } else {
        // Use mock data if backend is not available
        setCropData({
          name: crop,
          current_price: Math.floor(Math.random() * 5000) + 1000,
          max_crop: [`${Math.floor(Math.random() * 12) + 1} 25`, Math.floor(Math.random() * 5000) + 2000],
          min_crop: [`${Math.floor(Math.random() * 12) + 1} 25`, Math.floor(Math.random() * 3000) + 500],
          forecast_values: Array.from({length: 12}, (_, i) => [
            `${i + 1} 25`,
            Math.floor(Math.random() * 4000) + 1000,
            (Math.random() * 10 - 5).toFixed(2)
          ])
        });
      }
    } catch (error) {
      console.error('Error fetching crop data:', error);
      // Use mock data on error
      setCropData({
        name: crop,
        current_price: Math.floor(Math.random() * 5000) + 1000,
        max_crop: [`${Math.floor(Math.random() * 12) + 1} 25`, Math.floor(Math.random() * 5000) + 2000],
        min_crop: [`${Math.floor(Math.random() * 12) + 1} 25`, Math.floor(Math.random() * 3000) + 500],
        forecast_values: Array.from({length: 12}, (_, i) => [
          `${i + 1} 25`,
          Math.floor(Math.random() * 4000) + 1000,
          (Math.random() * 10 - 5).toFixed(2)
        ])
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌾 Crop Price Prediction System</h1>
        <p>Advanced Agricultural Price Forecasting & Market Analysis</p>
      </header>

      <main className="main-content">
        {/* Dashboard Overview */}
        <section className="dashboard">
          <div className="dashboard-grid">
            {/* Top Winners */}
            <div className="card">
              <h2>📈 Top 5 Winners</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Price (₹)</th>
                      <th>Change (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topWinners.map((winner, index) => (
                      <tr key={index}>
                        <td>{winner[0]}</td>
                        <td>₹{winner[1]}</td>
                        <td className="positive">+{winner[2]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Losers */}
            <div className="card">
              <h2>📉 Top 5 Losers</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Crop</th>
                      <th>Price (₹)</th>
                      <th>Change (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLosers.map((loser, index) => (
                      <tr key={index}>
                        <td>{loser[0]}</td>
                        <td>₹{loser[1]}</td>
                        <td className="negative">{loser[2]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Six Months Forecast */}
          <div className="card forecast-card">
            <h2>📊 6-Month Market Forecast</h2>
            <div className="forecast-table">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Top Performer</th>
                    <th>Price (₹)</th>
                    <th>Change (%)</th>
                    <th>Bottom Performer</th>
                    <th>Price (₹)</th>
                    <th>Change (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {sixMonthsForecast.map((forecast, index) => (
                    <tr key={index}>
                      <td>{forecast[0]}</td>
                      <td>{forecast[1]}</td>
                      <td>₹{forecast[2]}</td>
                      <td className="positive">+{forecast[3]}%</td>
                      <td>{forecast[4]}</td>
                      <td>₹{forecast[5]}</td>
                      <td className="negative">{forecast[6]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Crop Selection */}
        <section className="crop-selection">
          <div className="card">
            <h2>🔍 Detailed Crop Analysis</h2>
            <div className="crop-selector">
              <label htmlFor="crop-select">Select a crop for detailed analysis:</label>
              <select 
                id="crop-select"
                value={selectedCrop}
                onChange={(e) => handleCropSelect(e.target.value)}
              >
                <option value="">Choose a crop...</option>
                {commodities.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading crop data...</p>
              </div>
            )}

            {cropData && !loading && (
              <div className="crop-details">
                <h3>📋 {cropData.name?.charAt(0).toUpperCase() + cropData.name?.slice(1)} Analysis</h3>
                
                <div className="crop-stats">
                  <div className="stat-item">
                    <span className="stat-label">Current Price:</span>
                    <span className="stat-value">₹{cropData.current_price}</span>
                  </div>
                  
                  {cropData.max_crop && (
                    <div className="stat-item">
                      <span className="stat-label">Highest Expected ({cropData.max_crop[0]}):</span>
                      <span className="stat-value positive">₹{cropData.max_crop[1]}</span>
                    </div>
                  )}
                  
                  {cropData.min_crop && (
                    <div className="stat-item">
                      <span className="stat-label">Lowest Expected ({cropData.min_crop[0]}):</span>
                      <span className="stat-value negative">₹{cropData.min_crop[1]}</span>
                    </div>
                  )}
                </div>

                {cropData.forecast_values && (
                  <div className="forecast-details">
                    <h4>12-Month Price Forecast</h4>
                    <div className="forecast-grid">
                      {cropData.forecast_values.slice(0, 6).map((forecast, index) => (
                        <div key={index} className="forecast-item">
                          <div className="forecast-month">{forecast[0]}</div>
                          <div className="forecast-price">₹{forecast[1]}</div>
                          <div className={`forecast-change ${parseFloat(forecast[2]) >= 0 ? 'positive' : 'negative'}`}>
                            {parseFloat(forecast[2]) >= 0 ? '+' : ''}{forecast[2]}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Crop Production Prediction System. Powered by Machine Learning & Agricultural Data Analytics.</p>
      </footer>
    </div>
  );
};

export default App;

