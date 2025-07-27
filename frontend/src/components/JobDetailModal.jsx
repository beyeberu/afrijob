import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Modal.css';
import { fetchJobDetails } from '../services/Api';
import { FiX, FiClock, FiMapPin, FiDollarSign, FiBriefcase, FiAward, FiUser, FiCalendar } from 'react-icons/fi';

const JobDetailModal = ({ jobId, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    let isMounted = true;

    const loadJobDetails = async () => {
      try {
        const data = await fetchJobDetails(jobId);
        
        if (isMounted) {
          if (!data) {
            throw new Error('No data received from server');
          }
          setJob(data);
          setError(null);
        }
      } catch (err) {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!jobId) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <FiX size={24} />
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
      <div className="modal-content job-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <FiX size={24} />
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
              <div className="modal-header">
                <div className="company-info">
                  {job.company_logo_url && (
                    <img
                      src={job.company_logo_url}
                      alt="Company Logo"
                      className="company-logo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="company-text">
                    <h2>{job.job_title || 'Untitled Position'}</h2>
                    <h3>{job.company_name || 'Company not specified'}</h3>
                  </div>
                </div>

                <div className="job-meta-grid">
                  <div className="meta-item">
                    <FiMapPin className="meta-icon" />
<p><strong>Location:</strong> {job.location || job.location_name || 'Location not specified'}</p>
                  </div>
                  <div className="meta-item">
                    <FiBriefcase className="meta-icon" />
                    <span>{job.employment_type?.name || 'Type not specified'}</span>
                  </div>
                  <div className="meta-item">
                    <FiDollarSign className="meta-icon" />
                    <span>
                      {job.min_salary || job.max_salary
                        ? `${job.min_salary ? `$${job.min_salary}` : ''}${job.max_salary ? ` - $${job.max_salary}` : ''}`
                        : 'Salary not disclosed'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FiCalendar className="meta-icon" />
                    <span>Posted: {formatDate(job.posted_on)}</span>
                  </div>
                  <div className="meta-item">
                    <FiClock className="meta-icon" />
                    <span>Expires: {formatDate(job.expired_date)}</span>
                  </div>
                  <div className="meta-item">
                    <FiUser className="meta-icon" />
                    <span>Openings: {job.no_of_employees || 'Not specified'}</span>
                  </div>
                </div>

                <div className={`status-badge ${job.status?.toLowerCase() || 'unknown'}`}>
                  {job.status || 'Unknown status'}
                </div>
              </div>

              <div className="modal-tabs">
                <button
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('requirements')}
                >
                  Requirements
                </button>
                <button
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Job Details
                </button>
              </div>

              <div className="modal-body">
                {activeTab === 'description' && (
                  <div className="tab-content">
                    <h4>
                      <FiAward className="section-icon" />
                      Job Description
                    </h4>
                    <div className="content-box">
                      {job.job_description ? (
                        <div dangerouslySetInnerHTML={{ __html: job.job_description }} />
                      ) : (
                        <p className="no-info">No description provided.</p>
                      )}
                    </div>

                    {job.responsibilities && (
                      <>
                        <h4>
                          <FiAward className="section-icon" />
                          Key Responsibilities
                        </h4>
                        <div className="content-box">
                          <div dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="tab-content">
                    <h4>
                      <FiAward className="section-icon" />
                      Requirements & Qualifications
                    </h4>
                    <div className="content-box">
                      {job.qualifications ? (
                        <div dangerouslySetInnerHTML={{ __html: job.qualifications }} />
                      ) : (
                        <p className="no-info">No qualifications specified.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="tab-content">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h5>Job Category</h5>
                        <p>{job.job_category?.name || 'Not specified'}</p>
                      </div>
                      <div className="detail-item">
                        <h5>Employment Type</h5>
                        <p>{job.employment_type?.name || 'Not specified'}</p>
                      </div>
                      <div className="detail-item">
                        <h5>Salary Range</h5>
                        <p>
                          {job.min_salary || job.max_salary
                            ? `${job.min_salary ? `$${job.min_salary}` : ''}${job.max_salary ? ` - $${job.max_salary}` : ''}`
                            : 'Not disclosed'}
                        </p>
                      </div>
                      <div className="detail-item">
                        <h5>Open Positions</h5>
                        <p>{job.no_of_employees || 'Not specified'}</p>
                      </div>
                      <div className="detail-item">
                        <h5>Posted Date</h5>
                        <p>{formatDate(job.posted_on)}</p>
                      </div>
                      <div className="detail-item">
                        <h5>Expiry Date</h5>
                        <p>{formatDate(job.expired_date)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="modal-footer">
                <button className="apply-btn">Apply Now</button>
                <button className="save-btn">Save Job</button>
                <button className="share-btn">Share</button>
              </div> */}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default JobDetailModal;