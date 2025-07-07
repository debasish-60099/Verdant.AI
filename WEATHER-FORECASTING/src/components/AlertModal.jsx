import React from 'react';
import { X, AlertTriangle, Zap, Cloud } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, alerts = [] }) => {
  if (!isOpen) return null;

  // Mock thunderstorm alerts if no real alerts
  const mockAlerts = [
    {
      id: 1,
      type: 'Thunderstorm Warning',
      severity: 'High',
      headline: 'Severe Thunderstorm Warning in Effect',
      description: 'A severe thunderstorm warning has been issued for your area. Expect heavy rainfall, strong winds up to 80 km/h, and possible hail. Seek shelter immediately and avoid outdoor activities.',
      startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
      areas: ['Downtown', 'North District', 'East Side']
    },
    {
      id: 2,
      type: 'Flash Flood Watch',
      severity: 'Medium',
      headline: 'Flash Flood Watch - Heavy Rainfall Expected',
      description: 'Heavy rainfall from thunderstorms may cause flash flooding in low-lying areas and near waterways. Monitor local conditions and be prepared to move to higher ground if necessary.',
      startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      areas: ['River Valley', 'Industrial Zone', 'South Park']
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const getSeverityStyles = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'severe':
        return {
          backgroundColor: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
          borderColor: '#f87171',
          color: '#dc2626'
        };
      case 'medium':
      case 'moderate':
        return {
          backgroundColor: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
          borderColor: '#f59e0b',
          color: '#d97706'
        };
      case 'low':
      case 'minor':
        return {
          backgroundColor: 'linear-gradient(135deg, #fefce8, #fef9c3)',
          borderColor: '#eab308',
          color: '#ca8a04'
        };
      default:
        return {
          backgroundColor: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
          borderColor: '#d1d5db',
          color: '#374151'
        };
    }
  };

  const getAlertIcon = (type) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('thunder') || typeStr.includes('storm')) {
      return <Zap size={28} />;
    } else if (typeStr.includes('flood') || typeStr.includes('rain')) {
      return <Cloud size={28} />;
    }
    return <AlertTriangle size={28} />;
  };

  return (
    <div className="alert-modal" onClick={onClose}>
      {/* Modal */}
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)'
          }}></div>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.25)',
                padding: '12px',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}>
                <AlertTriangle size={32} color="white" />
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  margin: '0 0 0.5rem 0'
                }}>
                  Weather Alerts
                </h2>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.9rem',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  margin: 0
                }}>
                  {displayAlerts.length} active alert{displayAlerts.length !== 1 ? 's' : ''} in your area
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                padding: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.35)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <X size={24} color="white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {displayAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                borderRadius: '50%',
                padding: '1.5rem',
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(34, 197, 94, 0.2)'
              }}>
                <AlertTriangle size={40} color="#15803d" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#1f2937',
                margin: '0 0 0.75rem 0'
              }}>
                No Active Alerts
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '1.1rem',
                margin: 0
              }}>
                There are currently no weather alerts for your area.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {displayAlerts.map((alert, index) => {
                const severityStyles = getSeverityStyles(alert.severity);
                return (
                  <div
                    key={alert.id || index}
                    style={{
                      background: severityStyles.backgroundColor,
                      border: `2px solid ${severityStyles.borderColor}`,
                      borderRadius: '16px',
                      padding: '1.5rem',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      color: severityStyles.color
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '1rem'
                        }}>
                          <h3 style={{
                            fontWeight: '800',
                            fontSize: '1.25rem',
                            margin: 0
                          }}>
                            {alert.headline || alert.type || 'Weather Alert'}
                          </h3>
                          <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            fontSize: '0.8rem',
                            fontWeight: '700',
                            border: `2px solid ${severityStyles.borderColor}`,
                            background: 'rgba(255, 255, 255, 0.5)'
                          }}>
                            {alert.severity || 'Alert'}
                          </span>
                        </div>
                        
                        <p style={{
                          fontSize: '1rem',
                          marginBottom: '1rem',
                          lineHeight: '1.6'
                        }}>
                          {alert.description || alert.desc || 'Weather alert information not available.'}
                        </p>
                        
                        {(alert.startTime || alert.endTime) && (
                          <div style={{
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                            background: 'rgba(255, 255, 255, 0.5)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.6)'
                          }}>
                            {alert.startTime && (
                              <p style={{ margin: '0 0 0.5rem 0' }}>
                                <span style={{ fontWeight: '600' }}>Starts: </span>
                                <span>{new Date(alert.startTime).toLocaleString()}</span>
                              </p>
                            )}
                            {alert.endTime && (
                              <p style={{ margin: 0 }}>
                                <span style={{ fontWeight: '600' }}>Ends: </span>
                                <span>{new Date(alert.endTime).toLocaleString()}</span>
                              </p>
                            )}
                          </div>
                        )}
                        
                        {alert.areas && alert.areas.length > 0 && (
                          <div style={{
                            fontSize: '0.9rem',
                            background: 'rgba(255, 255, 255, 0.5)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.6)'
                          }}>
                            <span style={{ fontWeight: '600' }}>Affected Areas: </span>
                            <span>{alert.areas.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
          padding: '1.5rem 2rem',
          borderTop: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{
            fontSize: '0.9rem',
            color: '#6b7280',
            margin: 0
          }}>
            Last updated: {new Date().toLocaleTimeString()}
          </p>
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 8px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
            }}
          >
            Close Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
