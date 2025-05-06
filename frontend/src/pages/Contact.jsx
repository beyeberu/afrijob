import React from 'react';
import { FaExternalLinkAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaInfoCircle, FaTelegramPlane } from 'react-icons/fa';
import './Contact.css';
import TelegramIcon from '@mui/icons-material/Telegram';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Get In Touch</h1>
        <p>We're here to help you with your job posting needs</p>
      </div>

      <div className="contact-sections">
        {/* Job Posting Submission Section */}
        <div className="contact-card highlight-card">
          <div className="card-icon">
            <FaInfoCircle />
          </div>
          <h2>Submit a Job Posting</h2>
          <p className="card-description">
            Companies can easily submit job openings through our online form. 
            Your submission will be reviewed and posted within 24 hours.
          </p>
          
          <div className="submission-instructions">
            <h3>How to submit:</h3>
            <ol>
              <li>Click the link below to access our job posting form</li>
              <li>Fill out all required fields with accurate information</li>
              <li>Include detailed job description and requirements</li>
              <li>Provide valid contact information</li>
              <li>Submit the form for review</li>
            </ol>
            
            <a 
              href="http://localhost:5173/jobpostform" 
              target="_self" 
              rel="noopener noreferrer"
              className="form-link-button"
            >
              Go to Job Posting Form <FaExternalLinkAlt className="link-icon" />
            </a>
            
            <div className="form-notes">
              <h4>Important Notes:</h4>
              <ul>
                <li>All fields marked with * are required</li>
                <li>Job postings typically go live within 24 hours of submission</li>
                <li>You'll receive a confirmation email when your posting is approved</li>
                <li>For urgent postings, please contact us directly after submitting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* General Contact Information */}
        <div className="contact-card">
          <h2>Contact Information</h2>
          <p>Need help with your submission or have other questions?</p>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaEnvelope />
            </div>
            <div className="method-details">
              <h3>Email Us</h3>
              <p>For general inquiries and For job posting support: <a href="mailto:beyeberueyayu@gmail.com">beyeberueyayu@gmail.com</a> </p>
            </div>
          </div>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaPhone />
            </div>
            <div className="method-details">
              <h3>Call Us</h3>
              <p>phone no: <a href="tel:+15551234567">+251941889430</a></p>
            </div>
          </div>



          <div className="contact-method">
  <div className="method-icon">
    <FaTelegramPlane />
  </div>
  <div className="method-details">
    <h3>Message Us</h3>
    <p>Telegram: <a href="https://t.me/beyuDav" target="_blank" rel="noopener noreferrer">@beyuDav</a></p>
    <p> Or  Our Group: <a href="https://t.me/Afrijob2716" target="_blank" rel="noopener noreferrer">afrijob</a></p>
  </div>
</div>

          
          <div className="contact-method">
            <div className="method-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="method-details">
              <h3>location</h3>
              <p>Gondar Etiopia</p>
              
            </div>
          </div>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaClock />
            </div>
            <div className="method-details">
              <h3>Business Hours</h3>
              <p>Monday-Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How long does it take to approve a job posting?</h3>
          <p>Most postings are reviewed and approved within 24 hours of submission. During peak times, it may take up to 48 hours.</p>
        </div>
        <div className="faq-item">
          <h3>Can I edit my job posting after submission?</h3>
          <p>Yes, please email us at beyeberueyayu@gmail.com with your posting name,Job Title,posted date
          and the changes you'd like to make.</p>
        </div>
        <div className="faq-item">
          <h3>Is there a cost to post jobs on your platform?</h3>
          <p>Basic job postings are free. We also offer featured listings and form placement options for a fee.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;