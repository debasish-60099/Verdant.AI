import React from 'react';
import { Leaf, Heart, Github, Twitter, Linkedin, Mail, MapPin, Phone, Globe, Star, Zap, Cloud } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="enhanced-footer">
      {/* Animated background elements */}
      <div className="footer-bg-animation">
        <div className="floating-element element-1">
          <Cloud size={20} />
        </div>
        <div className="floating-element element-2">
          <Star size={16} />
        </div>
        <div className="floating-element element-3">
          <Zap size={18} />
        </div>
        <div className="floating-element element-4">
          <Leaf size={14} />
        </div>
      </div>

      <div className="enhanced-footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Section */}
          <div className="footer-section company-section">
            <div className="footer-logo-section">
              <div className="enhanced-footer-logo">
                <div className="footer-logo-inner">
                  <Leaf className="footer-logo-icon" />
                </div>
                <div className="footer-logo-glow"></div>
              </div>
              <div className="footer-brand-text">
                <h3 className="footer-brand-title">
                  <span className="brand-gradient">Verdant AI</span>
                </h3>
                <p className="footer-brand-subtitle">Intelligent Weather Solutions</p>
              </div>
            </div>
            
            <p className="footer-description">
              Empowering communities with accurate, AI-driven weather forecasting 
              and intelligent climate insights for better decision-making.
            </p>

            <div className="footer-stats">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Accuracy</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat-divider"></div>
              {/* <div className="stat-item">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Users</div>
              </div> */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            {/* <h4 className="footer-section-title">
              <span className="title-icon">🔗</span>
              Quick Links
            </h4> */}
            {/* <ul className="footer-links">
              <li><a href="#dashboard" className="footer-link">Weather Dashboard</a></li>
              <li><a href="#forecast" className="footer-link">7-Day Forecast</a></li>
              <li><a href="#alerts" className="footer-link">Weather Alerts</a></li>
              <li><a href="#maps" className="footer-link">Weather Maps</a></li>
              <li><a href="#api" className="footer-link">API Access</a></li>
            </ul> */}
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <span className="title-icon">⚡</span>
              Services
            </h4>
            <ul className="footer-links">
              <li><a href="#premium" className="footer-link">Premium Features</a></li>
              <li><a href="#enterprise" className="footer-link">Enterprise Solutions</a></li>
              <li><a href="#mobile" className="footer-link">Mobile Apps</a></li>
              <li><a href="#widgets" className="footer-link">Weather Widgets</a></li>
              <li><a href="#support" className="footer-link">24/7 Support</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              <span className="title-icon">📞</span>
              Get in Touch
            </h4>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <MapPin size={16} />
                </div>
                <span>San Francisco, CA</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Mail size={16} />
                </div>
                <span>hello@verdantai.com</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Phone size={16} />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <Globe size={16} />
                </div>
                <span>www.verdantai.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="#" className="social-link twitter">
                <Twitter size={18} />
                <div className="social-tooltip">Follow us on Twitter</div>
              </a>
              <a href="#" className="social-link linkedin">
                <Linkedin size={18} />
                <div className="social-tooltip">Connect on LinkedIn</div>
              </a>
              <a href="#" className="social-link github">
                <Github size={18} />
                <div className="social-tooltip">View our GitHub</div>
              </a>
              <a href="#" className="social-link email">
                <Mail size={18} />
                <div className="social-tooltip">Send us an email</div>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright-section">
              <p className="copyright-text">
                <span>&copy; {currentYear} Verdant AI. All rights reserved.</span>
              </p>
              <div className="made-with-love">
                <span>Made with</span>
                <Heart className="heart-icon" />
                <span>for better weather insights</span>
                <div className="love-pulse"></div>
              </div>
            </div>

            <div className="footer-nav">
              <a href="#privacy" className="footer-nav-link">Privacy Policy</a>
              <span className="nav-separator">•</span>
              <a href="#terms" className="footer-nav-link">Terms of Service</a>
              <span className="nav-separator">•</span>
              <a href="#cookies" className="footer-nav-link">Cookie Policy</a>
              <span className="nav-separator">•</span>
              <a href="#contact" className="footer-nav-link">Contact</a>
            </div>

            <div className="footer-badge">
              <div className="badge-content">
                <Zap size={14} />
                <span>Powered by AI</span>
              </div>
              <div className="badge-glow"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Wave Effect */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;

