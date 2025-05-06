import React, { useState } from 'react';

const ContactModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, resume: file }));
    // Clear error when field is edited
    if (errors.resume) {
      setErrors(prev => ({ ...prev, resume: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }
    
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Application submitted:', {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicant: formData
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit application. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <button 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close application form"
        >
          &times;
        </button>
        
        {submitted ? (
          <div className="submission-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h2>Application Submitted!</h2>
            <p>Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully submitted.</p>
            <p>We will review your application and get back to you soon.</p>
            <button className="close-success-btn" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="contact-header">
              <h2 id="contact-modal-title">Apply for {job.title}</h2>
              <p>at {job.company}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter *</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="5"
                  className={errors.coverLetter ? 'error' : ''}
                  placeholder="Briefly explain why you're a good fit for this position..."
                ></textarea>
                {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="resume">Upload Resume *</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className={errors.resume ? 'error' : ''}
                  />
                  <div className="file-input-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Select File
                  </div>
                  <span className="file-name">
                    {formData.resume ? formData.resume.name : 'No file chosen'}
                  </span>
                </div>
                {errors.resume && <span className="error-message">{errors.resume}</span>}
                <small className="file-format-hint">Accepted formats: PDF, DOC, DOCX</small>
              </div>
              
              {errors.submit && <div className="submit-error">{errors.submit}</div>}
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-small"></span>
                      Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;