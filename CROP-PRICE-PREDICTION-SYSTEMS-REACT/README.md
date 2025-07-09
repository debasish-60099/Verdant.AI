# 🌾 Crop Production Prediction System

A comprehensive agricultural price forecasting and market analysis system built with **Vite + React** frontend and **Flask** backend, powered by machine learning algorithms for accurate crop price predictions.

## 🚀 Features

- **Real-time Market Analysis**: Track top performing and underperforming crops
- **Price Forecasting**: 6-month and 12-month price predictions using machine learning
- **Interactive Dashboard**: Modern, responsive UI with comprehensive data visualization
- **Commodity Analysis**: Detailed analysis for 23+ different crops
- **Historical Data**: Access to historical price trends and patterns
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices

## 📊 Supported Crops

The system supports analysis for the following commodities:
- Arhar, Bajra, Barley, Copra, Cotton, Sesamum, Gram
- Groundnut, Jowar, Maize, Masoor, Moong, Niger, Paddy
- Ragi, Rape, Jute, Safflower, Soyabean, Sugarcane
- Sunflower, Urad, Wheat

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite 7.0.3** - Fast build tool and dev server
- **CSS3** - Custom styling with modern design patterns
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Flask** - Python web framework
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning algorithms
- **Decision Tree Regressor** - Price prediction model

## 📁 Project Structure

```
crop_production/
├── public/
│   ├── index.html          # Main HTML template
│   └── vite.svg           # Vite logo
├── src/
│   ├── assets/
│   │   └── react.svg      # React logo
│   ├── App.jsx            # Main React component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── main.jsx           # React entry point
├── static/                # CSV data files for crops
├── templates/             # Flask HTML templates
├── app.py                 # Flask backend application
├── crops.py               # Crop data utilities
├── package.json           # Node.js dependencies
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.7+
- npm or yarn

### Frontend Setup (Vite + React)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

### Backend Setup (Flask)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Flask server:**
   ```bash
   python app.py
   ```

The Flask server will run on `http://localhost:5000`

### Full Stack Development

1. Start the Flask backend server (port 5000)
2. Start the Vite development server (port 5173)
3. The React app will proxy API requests to the Flask backend

## 🔧 Configuration

### Vite Configuration
The `vite.config.js` file includes:
- React plugin with SWC for fast compilation
- Development server configuration
- Build optimization settings

### Flask Configuration
The `app.py` file includes:
- CORS configuration for frontend-backend communication
- API endpoints for crop data and predictions
- Machine learning model initialization

## 📱 Usage

### Dashboard Features
1. **Top Winners/Losers**: View the best and worst performing crops
2. **6-Month Forecast**: See market predictions for the next 6 months
3. **Crop Analysis**: Select any crop for detailed price analysis
4. **Historical Data**: Access past performance data

### API Endpoints
- `GET /` - Dashboard with market overview
- `GET /commodity/<crop_name>` - Detailed crop analysis
- `GET /ticker/<item>/<number>` - Real-time price ticker

## 🎨 Design Features

- **Modern Glass-morphism UI** - Translucent cards with backdrop blur
- **Responsive Grid Layout** - Adapts to all screen sizes
- **Interactive Elements** - Hover effects and smooth transitions
- **Professional Color Scheme** - Blue gradient background with clean whites
- **Typography** - Segoe UI font family for excellent readability

## 📊 Machine Learning Model

The system uses **Decision Tree Regressor** with the following features:
- **Input Features**: Month, Year, Rainfall data
- **Target Variable**: Wholesale Price Index (WPI)
- **Training Data**: Historical crop price data from CSV files
- **Prediction Accuracy**: Optimized with random depth selection (7-18)

## 🔮 Future Enhancements

- [ ] Real-time data integration with agricultural APIs
- [ ] Advanced charting with Chart.js or D3.js
- [ ] User authentication and personalized dashboards
- [ ] Export functionality for reports and data
- [ ] Mobile app development
- [ ] Integration with weather APIs for better predictions





