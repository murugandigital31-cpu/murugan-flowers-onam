import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/BottomNavigation.css';

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bottom-navigation">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <div className="nav-icon">🏠</div>
        <span className="nav-label">Home</span>
      </Link>
      
      <Link to="/designer" className={`nav-item ${isActive('/designer') ? 'active' : ''}`}>
        <div className="nav-icon">🎨</div>
        <span className="nav-label">Designer</span>
      </Link>
      
      <Link to="/contact" className={`nav-item ${isActive('/contact') ? 'active' : ''}`}>
        <div className="nav-icon">📞</div>
        <span className="nav-label">Contact</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;