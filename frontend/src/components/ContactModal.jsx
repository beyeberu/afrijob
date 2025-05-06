import React from 'react';
import './Modal.css';

const ContactModal = ({ job, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>Contact Information</h2>
          <h3>{job.company_name}</h3>
        </div>

        <div className="modal-body">
          <div className="contact-info">
            <p><strong>Email:</strong> {job.email}</p>
            <p><strong>Phone:</strong> {job.phone_no}</p>
            <p><strong>How to Apply:</strong> {job.how_to_apply}</p>
            {job.website && (
  <p>
    <strong>Website:</strong>{' '}
    <a href={job.website} target="_blank" rel="noopener noreferrer">
      {job.website}
    </a>
  </p>
)}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;