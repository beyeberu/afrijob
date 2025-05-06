import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Modal.css';
import { fetchJobDetails } from '../services/Api';


const JobDetailModal = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadJobDetails = async () => {
      try {
        console.log('Fetching details for job ID:', jobId);
        const data = await fetchJobDetails(jobId);
        console.log('Received job data:', data);
        
        if (isMounted) {
          if (!data) {
            throw new Error('No data received from server');
          }
          setJob(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load job details');
          setJob(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    } else {
      setError('No job ID provided');
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  if (!jobId) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
          <div className="modal-error">
            <ErrorMessage message="No job selected" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        {loading ? (
          <div className="modal-loading">
            <LoadingSpinner />
            <p>Loading job details...</p>
          </div>
        ) : error ? (
          <div className="modal-error">
            <ErrorMessage message={error} />
            <div className="modal-error-actions">
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
              <button onClick={onClose} className="close-btn-secondary">
                Close
              </button>
            </div>
          </div>
        ) : (
          job && (
            <>
              <div className="modal-header" style={{ position: "relative", minHeight: "80px" }}>
                {job.company_logo_url && (
                  <img
                    src={job.company_logo_url}
                    alt="Company Logo"
                    className="modal-company-logo"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      position: "absolute",
                      top: "1.2rem",
                      left: "1.2rem",
                      background: "#fff",
                      border: "2px solid #e3f0fd",
                      boxShadow: "0 4px 16px rgba(25, 118, 210, 0.10)",
                      padding: "6px",
                      zIndex: 2
                    }}
                  />
                )}
                <div style={{ marginLeft: job.company_logo_url ? "120px" : 0 }}>
                  <h2>
                    {job.job_title || 'Untitled Position'}
                  </h2>
                  <h3>Company name: {job.company_name || 'Company not specified'}</h3>
                  <div className="job-meta">
                    <span><strong>Location:</strong> {job.location || 'Not specified'}</span>
                    <br />
                    <span>
                      <strong>Posted on:</strong> {job.posted_on 
                        ? new Date(job.posted_on).toLocaleDateString() 
                        : 'Date not available'}
                    </span>
                    <p></p>
                    <span>
                      <strong>expired date:</strong> {job.posted_on 
                        ? new Date(job.expired_date).toLocaleDateString() 
                        : 'Date not available'}
                    </span>
                    <span className={`status ${job.status || 'unknown'}`}>
                      {job.status || 'Unknown status'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                <div className="section">
                  <h4>Job Description</h4>
                  <p>{job.job_description || 'No description provided.'}</p>
                </div>

                <div className="section">
                  <h4>Requirements</h4>
                  <p>{job.qualifications || 'No qualifications specified.'}</p>
                </div>

                <div className="section">
                  <h4>No_of_Employees need</h4>
                  <p>{job.no_of_employees || 'number of employees not specified.'}</p>
                </div>

                <div className="section">
  <h4>Job Category</h4>
  <p>{job.job_category?.name || 'Job category not specified'}</p>
</div>

                <div className="section">
                  <h4>Salary Range</h4>
                  <p>
                    {job.min_salary || job.max_salary
                      ? `${job.min_salary ? `$${job.min_salary}` : ''}${job.max_salary ? ` - $${job.max_salary}` : ''}`
                      : 'Salary not disclosed'}
                  </p>
                </div>

                

                {job.responsibilities && (
                  <div className="section">
                    <h4>Key Responsibilities</h4>
                    <p>{job.responsibilities}</p>
                  </div>

                )}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default JobDetailModal;