import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-logo">
          <img 
            src="/MURUGAN_FLOWERS_LOGO.png" 
            alt="Murugan Flowers Logo" 
            className="header-brand-logo"
            onError={(e) => {
              console.error("Logo failed to load");
              e.target.style.display = 'none';
            }}
          />
        </div>
        <nav className="desktop-nav">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/designer" className="nav-link">Designer</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;