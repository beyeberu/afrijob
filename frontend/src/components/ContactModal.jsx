import React, { useState } from 'react';
import { FaTimes, FaPhone, FaEnvelope, FaGlobe, FaClipboard, FaCheck } from 'react-icons/fa';
import './Modal.css';

const ContactModal = ({ job, onClose }) => {
  const [copied, setCopied] = useState({
    email: false,
    phone: false,
    website: false
  });

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content contact-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <FaTimes />
        </button>
        
        <div className="modal-header">
          <h1>Applying  Information</h1>
          <h3> <strong> Company </strong>: {job.company_name}</h3>
          <p className="job-title-reference">Regarding: {job.job_title}</p>
        </div>

        <div className="modal-body">
          <div className="contact-info-grid">
            {job.email && (
              <div className="contact-item">
                <div className="contact-icon">
                  <FaEnvelope />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <div className="contact-value">
                    <a href={`mailto:${job.email}`}>{job.email}</a>
                    <button 
                      onClick={() => copyToClipboard(job.email, 'email')}
                      className="copy-btn"
                      aria-label="Copy email"
                    >
                      {copied.email ? <FaCheck /> : <FaClipboard />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {job.phone_no && (
              <div className="contact-item">
                <div className="contact-icon">
                  <FaPhone />
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <div className="contact-value">
                    <a href={`tel:${job.phone_no}`}>{job.phone_no}</a>
                    <button 
                      onClick={() => copyToClipboard(job.phone_no, 'phone')}
                      className="copy-btn"
                      aria-label="Copy phone number"
                    >
                      {copied.phone ? <FaCheck /> : <FaClipboard />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {job.website && (
              <div className="contact-item">
                <div className="contact-icon">
                  <FaGlobe />
                </div>
                <div className="contact-details">
                  <h4>Website</h4>
                  <div className="contact-value">
                    <a 
                      href={job.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {job.website.replace(/^https?:\/\//, '')}
                    </a>
                    <button 
                      onClick={() => copyToClipboard(job.website, 'website')}
                      className="copy-btn"
                      aria-label="Copy website URL"
                    >
                      {copied.website ? <FaCheck /> : <FaClipboard />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {job.how_to_apply && (
              <div className="contact-item full-width">
                <div className="application-instructions">
                  <h4>How to Apply</h4>
                  <p>{job.how_to_apply}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;