import { FaTimes, FaPhone, FaEnvelope, FaInfoCircle, FaExternalLinkAlt, FaClipboard, FaWhatsapp } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import './ContactPopup.css';
import { useState } from 'react';

const ContactPopup = ({ job, onClose }) => {
  const [copied, setCopied] = useState({
    phone: false,
    email: false
  });

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const openWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="contact-popup-overlay" onClick={onClose}>
      <div className="contact-popup-content" onClick={e => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close contact popup">
          <FaTimes />
        </button>

        <div className="popup-header">
          <div className="popup-header-content">
            <h2 className="popup-title">Contact Information</h2>
            <p className="popup-subtitle">
              For: <strong>{job.job_title}</strong> at <strong>{job.company_name}</strong>
            </p>
          </div>
        </div>

        <div className="contact-details">
          {job.phone_no && (
            <div className="contact-item">
              <div className="contact-icon-container phone">
                <FaPhone className="contact-icon" />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">Phone Number</h3>
                <div className="contact-value-container">
                  <a href={`tel:${job.phone_no}`} className="contact-value">
                    {job.phone_no}
                  </a>
                  <div className="contact-actions">
                    <button 
                      className="action-btn copy" 
                      onClick={() => copyToClipboard(job.phone_no, 'phone')}
                      aria-label="Copy phone number"
                    >
                      <FiCopy />
                      {copied.phone && <span className="copied-tooltip">Copied!</span>}
                    </button>
                    <button 
                      className="action-btn whatsapp" 
                      onClick={() => openWhatsApp(job.phone_no)}
                      aria-label="Open WhatsApp"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {job.email && (
            <div className="contact-item">
              <div className="contact-icon-container email">
                <FaEnvelope className="contact-icon" />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">Email Address</h3>
                <div className="contact-value-container">
                  <a href={`mailto:${job.email}`} className="contact-value">
                    {job.email}
                  </a>
                  <button 
                    className="action-btn copy" 
                    onClick={() => copyToClipboard(job.email, 'email')}
                    aria-label="Copy email"
                  >
                    <FiCopy />
                    {copied.email && <span className="copied-tooltip">Copied!</span>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {job.how_to_apply && (
            <div className="contact-item">
              <div className="contact-icon-container info">
                <FaInfoCircle className="contact-icon" />
              </div>
              <div className="contact-info">
                <h3 className="contact-label">Application Instructions</h3>
                <div className="contact-value">
                  {job.how_to_apply.includes('http') ? (
                    <a 
                      href={job.how_to_apply} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="apply-link"
                    >
                      {job.how_to_apply} <FaExternalLinkAlt className="external-link-icon" />
                    </a>
                  ) : (
                    <p>{job.how_to_apply}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {(!job.phone_no && !job.email && !job.how_to_apply) && (
            <div className="no-contact-info">
              <p>No contact information available for this position.</p>
              <p>Please check the job listing for application details.</p>
            </div>
          )}
        </div>

        <div className="popup-footer">
          <button className="popup-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;