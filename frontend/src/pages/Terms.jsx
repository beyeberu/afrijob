import React from 'react';

import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">

      <main className="terms-container">
        <section className="terms-hero">
          <h1 className="terms-title">Terms of Service</h1>
          <p className="terms-updated">Last updated: June 2023</p>
        </section>

        <section className="terms-content">
          <article className="terms-section">
            <div className="section-header">
              <span className="section-number">01</span>
              <h2 className="section-title">Acceptance of Terms</h2>
            </div>
            <p className="section-description">
              By accessing or using the AfriJob platform, you agree to be bound by these Terms of Service. 
              If you do not agree to all the terms and conditions, you may not access or use our services.
            </p>
          </article>

          <article className="terms-section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2 className="section-title">Description of Service</h2>
            </div>
            <p className="section-description">
              AfriJob provides a platform connecting job seekers with employers. We do not guarantee employment 
              or specific results from using our service. All job listings are provided by third-party employers.
            </p>
          </article>

          <article className="terms-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h2 className="section-title">User  Responsibilities</h2>
            </div>
            <p className="section-description">
              Users are responsible for the accuracy of information provided in their profiles and applications. 
              You agree not to post false, misleading, or illegal content. Employers are responsible for the 
              accuracy of their job postings.
            </p>
          </article>

          <article className="terms-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h2 className="section-title">Privacy Policy</h2>
            </div>
            <p className="section-description">
              Your use of our services is also governed by our Privacy Policy, which explains how we collect, 
              use, and protect your personal information.
            </p>
          </article>

          <article className="terms-section">
            <div className="section-header">
              <span className="section-number">05</span>
              <h2 className="section-title">Modifications to Terms</h2>
            </div>
            <p className="section-description">
              We reserve the right to modify these terms at any time. Continued use of the service after 
              changes constitutes acceptance of the new terms.
            </p>
          </article>
        </section>
      </main>

    </div>
  );
};

export default Terms;