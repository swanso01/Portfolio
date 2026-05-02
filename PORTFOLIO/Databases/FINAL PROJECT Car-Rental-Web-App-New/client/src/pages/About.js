import React from 'react';
import '../styles/About.css';

function About() {
  const creators = [
    {
      name: 'Josh',
      role: 'Full Stack Developer',
      github: 'https://github.com/swanso01',
      bio: 'Backend Design and Optimization'
    },
    {
      name: 'Jerry',
      role: 'Backend Developer',
      github: 'https://github.com/Jerry4424',
      bio: 'Frontend architecture and UI/UX implementation'
    },
    {
      name: 'Eric',
      role: 'Full Stack Developer',
      github: 'https://github.com/ericw2004',
      bio: 'Database Design and API Implementation'
    }
  ];

  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About Car Rental</h1>
          <p className="hero-subtitle">
            The worst Car Rental App you'll ever use.
          </p>
        </div>
        <div className="hero-background"></div>
      </section>

      <section className="mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            We created this Car Rental application for a databases project with the goal of demonstrating database integration into a web app.
          </p>
        </div>
      </section>

      <section className="creators-section">
        <h2 className="section-title">Meet the Team</h2>
        <div className="creators-grid">
          {creators.map((creator, index) => (
            <div key={index} className="creator-card">
              <div className="card-content">
                <h3 className="creator-name">{creator.name}</h3>
                <p className="creator-role">{creator.role}</p>
                <p className="creator-bio">{creator.bio}</p>
                <a 
                  href={creator.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <span className="github-icon">GitHub</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Rent?</h2>
        <p>Start your journey with CarRental today</p>
        <a href="/cars" className="cta-button">Browse Cars</a>
      </section>
    </div>
  );
}

export default About;
