import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const homeRef = useRef(null);

  useEffect(() => {
    const el = homeRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      setTimeout(() => el.classList.add('is-loaded'), 50);
    });
  }, []);

  return (
    <div ref={homeRef} className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Car Rental</h1>
          <p>Rent your perfect car for every journey</p>
          <Link to="/cars" className="cta-button">Browse Cars</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Booking</h3>
          <p>Safe and easy online reservations</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Competitive rates on all vehicles</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚗</div>
          <h3>Wide Selection</h3>
          <p>Choose from hundreds of vehicles</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>24/7 Support</h3>
          <p>Round-the-clock customer service</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
