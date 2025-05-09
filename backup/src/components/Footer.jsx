import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <a href="#">О нас</a>
        <a href="#">Россия</a>
      </div>
      <div className="footer-bottom">
        <span>© 2025 Your Website. All rights reserved.</span>
        <nav className="footer-nav">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </div>
    </footer>
  );
}
