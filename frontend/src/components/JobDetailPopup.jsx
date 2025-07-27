import { FaTimes, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import './JobDetailPopup.css';

const JobDetailPopup = ({ job, onClose }) => {
  return (
    <div className="job-detail-popup">
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="popup-content">
        <button className="popup-close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="popup-header">
          {job.company_logo_url && (
            <img
              src={job.company_logo_url}
              alt="Company Logo"
              className="modal-company-logo"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "contain",
                borderRadius: "10px",
                display: "block",
                margin: "0 auto 1rem auto",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
              }}
            />
          )}
          <h2 className="popup-title" style={{ marginLeft: job.company_logo ? "60px" : 0 }}>
            {job.job_title}
          </h2>
          <p className="popup-company">
            <FaBuilding /> {job.company_name}
          </p>
        </div>

        <div className="popup-details">
<p><strong>Location:</strong> {job.location || job.location_name || 'Location not specified'}</p>
          {job.employment_type && (
            <p className="popup-detail">
              <FaClock /> {job.employment_type?.name}
            </p>
          )}
          {job.min_salary && job.max_salary && (
            <p className="popup-detail">
              <FaMoneyBillWave /> 
              ${job.min_salary.toLocaleString()} - ${job.max_salary.toLocaleString()}
            </p>
          )}
          <p className="popup-detail">
            <FaClock /> Posted: {new Date(job.posted_on).toLocaleDateString()}
          </p>
        </div>

        <div className="popup-section">
          <h3 className="section-title">Job Description</h3>
          <p className="section-content">{job.job_description}</p>
        </div>

        {job.responsibilities && (
          <div className="popup-section">
            <h3 className="section-title">Responsibilities</h3>
            <ul className="section-content">
              {job.responsibilities.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {job.qualifications && (
          <div className="popup-section">
            <h3 className="section-title">Qualifications</h3>
            <ul className="section-content">
              {job.qualifications.split('\n').map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {job.skills && (
          <div className="popup-section">
            <h3 className="section-title">Skills Required</h3>
            <p className="section-content">{job.skills}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPopup;