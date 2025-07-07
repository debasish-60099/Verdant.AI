import React, { useState, useRef, useEffect } from 'react';
import { Bell, Download, AlertTriangle, Leaf } from 'lucide-react';

const Navbar = ({ onDownloadReport, onShowAlerts }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownloadReport = () => {
    onDownloadReport();
    setIsDropdownOpen(false);
  };

  const handleShowAlerts = () => {
    onShowAlerts();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo and Title */}
        <div className="navbar-brand">
          <div className="navbar-logo">
            <Leaf size={40} color="white" />
          </div>
          <div>
            <h1 className="navbar-title">Verdant AI Weather Forecasting</h1>
            <p className="navbar-subtitle">Intelligent Weather Insights Powered by AI</p>
          </div>
        </div>

        {/* Notification Button */}
        <div style={{ position: 'relative' }}>
          <button
            ref={buttonRef}
            onClick={toggleDropdown}
            className="notification-btn"
            aria-label="Notifications"
          >
            <Bell size={28} color="white" />
            <span className="notification-badge">2</span>
          </button>

          {/* Enhanced Dropdown Menu */}
          <div 
            ref={dropdownRef}
            className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
          >
            <div style={{ padding: '8px' }}>
              <button onClick={handleDownloadReport} className="dropdown-item">
                <div className="dropdown-icon bg-green">
                  <Download size={20} color="white" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Download Today's Report
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                    Get comprehensive weather data in PDF format
                  </p>
                </div>
              </button>
              
              <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #d1d5db, transparent)', margin: '8px 0' }}></div>
              
              <button onClick={handleShowAlerts} className="dropdown-item">
                <div className="dropdown-icon bg-red">
                  <AlertTriangle size={20} color="white" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Alert Notifications
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                    View active weather alerts and warnings
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

