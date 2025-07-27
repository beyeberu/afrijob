import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onViewDetails, onContact, showButtons = true }) => {
  const handleViewDetails = () => {
    if (job?.id) {
      onViewDetails(job.id);
    }
  };

  const handleContact = () => {
    if (job) {
      onContact(job);
    }
  };

  // Check if job is expired
  const isExpired = job.expired_date && new Date(job.expired_date) < new Date();

  return (
    <div className="job-card" data-testid="job-card">
      <div className="job-header" style={{ position: "relative" }}>
        {job.company_logo_url && (
          <img
            src={job.company_logo_url}
            alt="Company Logo"
            className="job-card-company-logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
              borderRadius: "6px",
              position: "absolute",
              top: "0.5rem",
              left: "0.5rem",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              cursor: "pointer" // Add pointer cursor for UX
            }}
            onClick={handleViewDetails} // <-- Add this line
          />
        )}
        <h3 style={{ marginLeft: job.company_logo_url ? "50px" : 0 }}>
          Title:  {job.job_title || 'Untitled Position'}
        </h3>
        <p className="company">Company: {job.company_name || 'Company not specified'}</p>
        <span className={`status ${job.status || 'unknown'}`}>
          {job.status || 'Unknown status'}
        </span>
      </div>

      <div className="job-details">
        <p><strong>Location:</strong> {job.location || 'Location not specified'}</p>
        <p>
          <strong>Posted:</strong> {job.posted_on 
            ? new Date(job.posted_on).toLocaleDateString() 
            : 'Date not available'}
        </p>
        {(job.min_salary || job.max_salary) && (
          <p>
            <strong>Salary:</strong> 
            {job.min_salary ? ` $${job.min_salary}` : ''}
            {job.max_salary ? ` - $${job.max_salary}` : ''}
          </p>
        )}
        {isExpired && (
          <div className="expired-label" style={{ color: '', marginTop: '0.5rem', fontWeight: 600 }}>
            Expired date: {job.expired_date 
              ? new Date(job.expired_date).toLocaleDateString()
              : 'Date not available'}
          </div>
        )}
      </div>

      {showButtons && (
        <div className="job-actions">
          <button 
            onClick={handleViewDetails} 
            className="detail-btn"
            aria-label={`View details for ${job.job_title}`}
          >
            View Details
          </button>
          {job.status && job.status.toLowerCase() === 'active' && (
            <button 
              onClick={handleContact} 
              className="contact-btn"
              aria-label={`Contact about ${job.job_title}`}
            >
              Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;