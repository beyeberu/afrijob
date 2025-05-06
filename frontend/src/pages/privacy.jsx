import React from 'react';
import './Privacy.css';

function Privacy() {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <div className="privacy-header">
          <h1 className="privacy-title">Privacy Policy</h1>
          <div className="privacy-subtitle">Protecting Your Data & Privacy</div>
          <p className="privacy-updated">Last updated: March 2024</p>
        </div>
        
        <div className="privacy-content">
          <section className="privacy-section">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">Information We Collect</h2>
            </div>
            <div className="section-content">
              <p className="section-description"><b>
                We collect information that you provide directly to us, including:</b>
              </p>
              <ul className="section-list">
                <li>Name and contact information</li>
                <li>Professional experience and education</li>
                <li>Resume and cover letters</li>
                <li>Job preferences and search history</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">How We Use Your Information</h2>
            </div>
            <div className="section-content">
              <p className="section-description"> <b>
                We use the information we collect to:</b>
              </p>
              <ul className="section-list">
                <li>Match you with relevant job opportunities</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account and updates</li>
                <li>Ensure the security of our platform</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">Information Sharing</h2>
            </div>
            <div className="section-content">
              <p className="section-description"> <b>
                We do not sell your personal information to third parties. We may share your 
                information with employers when you apply for jobs through our platform.
                </b>
              </p>
            </div>
          </section>

          <section className="privacy-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">Your Rights</h2>
            </div>
            <div className="section-content">
              <p className="section-description">
                <b>You have the right to:</b>
              </p>
              <ul className="section-list">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Privacy;