import { FaTimes, FaPhone, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import './ContactPopup.css';

const ContactPopup = ({ job, onClose }) => {
  return (
    <div className="contact-popup">
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="popup-header">
          <h2 className="popup-title">Contact Information</h2>
          <p className="popup-subtitle">For: {job.job_title} at {job.company_name}</p>
        </div>

        <div className="contact-details">
          {job.phone_no && (
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <h3 className="contact-label">Phone</h3>
                <p className="contact-value">{job.phone_no}</p>
              </div>
            </div>
          )}

          {job.email && (
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3 className="contact-label">Email</h3>
                <p className="contact-value">{job.email}</p>
              </div>
            </div>
          )}

          {job.how_to_apply && (
            <div className="contact-item">
              <FaInfoCircle className="contact-icon" />
              <div>
                <h3 className="contact-label">How to Apply</h3>
                <p className="contact-value">{job.how_to_apply}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;