import React, { useState } from 'react';
import './JobPostForm.css';

function UserJobHistory() {
  const [selectedJob, setSelectedJob] = useState(null);
  const jobs = JSON.parse(localStorage.getItem('userJobPosts') || '[]');

  return (
    <div className="user-history-box">
      <h3>Your Job Post History</h3>
      <p>
        You have posted <strong>{jobs.length}</strong> job{jobs.length !== 1 ? 's' : ''}.
      </p>
      <div>
        {jobs.length === 0 ? (
          <p style={{ color: "#888", fontSize: "0.95rem" }}>No jobs posted yet.</p>
        ) : (
          jobs.slice().reverse().map(job => (
            <div key={job.id} className="job-history-card">
              <div style={{ fontWeight: 600, color: "#1976d2" }}>{job.job_title}</div>
              <div style={{ fontSize: "0.97rem", color: "#444" }}>{job.company_name}</div>
              <div style={{ fontSize: "0.85rem", color: "#888" }}>
                {job.posted_on} - {job.expired_date}
              </div>
              <button
                style={{
                  marginTop: "0.5rem",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.8rem",
                  cursor: "pointer",
                  fontSize: "0.95rem"
                }}
                onClick={() => setSelectedJob(job)}
              >
                See Full Job
              </button>
            </div>
          ))
        )}
      </div>
      {/* Modal for full job details */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 8px 32px rgba(60,60,60,0.18)",
              position: "relative"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#888"
              }}
              onClick={() => setSelectedJob(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 style={{ color: "#1976d2", marginBottom: "1rem" }}>{selectedJob.job_title}</h2>
            <div style={{ marginBottom: "0.5rem" }}><strong>Company:</strong> {selectedJob.company_name}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Location:</strong> {selectedJob.location}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Employment Type:</strong> {selectedJob.employment_type}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Job Category:</strong> {selectedJob.job_category}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Posted By:</strong> {selectedJob.posted_by}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Posted On:</strong> {selectedJob.posted_on}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Expired Date:</strong> {selectedJob.expired_date}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Email:</strong> {selectedJob.email}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Phone:</strong> {selectedJob.phone_no}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Website:</strong> {selectedJob.website}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Description:</strong> {selectedJob.job_description}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Responsibilities:</strong> {selectedJob.responsibilities}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Qualifications:</strong> {selectedJob.qualifications}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Skills:</strong> {selectedJob.skills}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Salary and Benefits:</strong> {selectedJob.salary_and_benefits}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>How to Apply:</strong> {selectedJob.how_to_apply}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Encouragement Note:</strong> {selectedJob.encourage_applicants}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Min Salary:</strong> {selectedJob.min_salary}</div>
            <div style={{ marginBottom: "0.5rem" }}><strong>Max Salary:</strong> {selectedJob.max_salary}</div>
          </div>
        </div>
      )}
    </div>
  );
}

const JOB_CATEGORIES = [
  'Architecture & Construction', 'Construction', 'Engineering', 'Accounting', 'Finance', 'Customer Service',
  'Professional Services', 'Design', 'Marketing', 'Information Technology', 'Telecommunications',
  'Community Service', 'Science & Technology', 'Business & Administration', 'Media & Journalism',
  'Advertising and Media', 'Sales', 'Management', 'Admin, Secretarial & Clerical', 'Legal',
  'Restaurant & Food Service', 'Purchasing & Procurement', 'Business Development', 'QA-Quality Control',
  'Inventory & Stock', 'Insurance', 'Economics', 'Social Science & Community',
  'Communications, PR & Journalism', 'Environment & Natural Resource', 'Hospitality-Hotel', 'Supply Chain',
  'Warehouse', 'Natural Science', 'Retail and Trade', 'Nurse', 'Logistics, Transport & Supply Chain',
  'Human Resources', 'Development & Project Management', 'Training', 'Installation & Repair', 'Education',
  'Health Care', 'Agriculture and Food', 'General Business', 'Research', 'Consultancy & Training',
  'Travel & Tourism', 'Manufacturing', 'Maintenance', 'Distribution-Shipping'
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer'];

const JobPostForm = () => {
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_logo: null,
    location: '',
    employment_type: '',
    job_category: '',
    no_of_employees: '',
    posted_by: '',
    job_description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    salary_and_benefits: '',
    how_to_apply: '',
    encourage_applicants: '',
    min_salary: '',
    max_salary: '',
    phone_no: '',
    email: '',
    website: '',
    posted_on: new Date().toISOString().split('T')[0],
    expired_date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'job_title', 'company_name', 'email', 'location', 'job_category',
      'posted_by', 'job_description', 'responsibilities', 'qualifications',
      'skills', 'how_to_apply', 'posted_on', 'expired_date', 'phone_no' // <-- add here
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`Please fill out the ${field.replace('_', ' ')} field.`);
        return false;
      }
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      job_title: '',
      company_name: '',
      company_logo: null,
      location: '',
      employment_type: '',
      job_category: '',
      no_of_employees: '',
      posted_by: '',
      job_description: '',
      responsibilities: '',
      qualifications: '',
      skills: '',
      salary_and_benefits: '',
      how_to_apply: '',
      encourage_applicants: '',
      min_salary: '',
      max_salary: '',
      phone_no: '',
      email: '',
      website: '',
      posted_on: new Date().toISOString().split('T')[0],
      expired_date: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validateForm()) return;
    setIsSubmitting(true);

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const csrfToken = getCookie('csrftoken');

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/jobposting/posts/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Please correct the form errors');
      }

      setSubmitSuccess(true);
      setIsReviewing(false);
      let jobs = JSON.parse(localStorage.getItem('userJobPosts') || '[]');
      jobs.push({
        ...formData,
        id: Date.now()
      });
      localStorage.setItem('userJobPosts', JSON.stringify(jobs));
      resetForm();
      let count = Number(localStorage.getItem('jobPostCount') || 0);
      localStorage.setItem('jobPostCount', count + 1);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <UserJobHistory />
      <div style={{ flex: 1 }}>
        {isReviewing ? (
          <div className="job-post-review">
            <h2>Review Your Job Post</h2>
            <ul>
              <li><strong>Job Title:</strong> {formData.job_title}</li>
              <li><strong>Company Name:</strong> {formData.company_name}</li>
              <li><strong>Location:</strong> {formData.location}</li>
              <li><strong>Employment Type:</strong> {formData.employment_type}</li>
              <li><strong>Job Category:</strong> {formData.job_category}</li>
              <li><strong>No of Employees:</strong> {formData.no_of_employees}</li>
              <li><strong>Posted By:</strong> {formData.posted_by}</li>
              <li><strong>Job Description:</strong> {formData.job_description}</li>
              <li><strong>Responsibilities:</strong> {formData.responsibilities}</li>
              <li><strong>Qualifications:</strong> {formData.qualifications}</li>
              <li><strong>Skills:</strong> {formData.skills}</li>
              <li><strong>Salary and Benefits:</strong> {formData.salary_and_benefits}</li>
              <li><strong>How to Apply:</strong> {formData.how_to_apply}</li>
              <li><strong>Encouragement Note:</strong> {formData.encourage_applicants}</li>
              <li><strong>Min Salary:</strong> {formData.min_salary}</li>
              <li><strong>Max Salary:</strong> {formData.max_salary}</li>
              <li><strong>Phone Number:</strong> {formData.phone_no}</li>
              <li><strong>Email:</strong> {formData.email}</li>
              <li><strong>Company Website:</strong> {formData.website}</li>
              <li><strong>Posted On:</strong> {formData.posted_on}</li>
              <li><strong>Expired Date:</strong> {formData.expired_date}</li>
            </ul>
            {submitError && <p className="error">{submitError}</p>}
            <button type="button" onClick={() => setIsReviewing(false)} disabled={isSubmitting}>
              Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{ marginLeft: "1rem" }}
            >
              {isSubmitting ? 'Posting...' : 'Confirm & Post'}
            </button>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!validateForm()) return;
              setIsReviewing(true);
            }}
            encType="multipart/form-data"
            className="job-post-form"
          >
            <label>Job Title</label>
            <input name="job_title" value={formData.job_title} onChange={handleChange} required />

            <label>Company Name</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} required />

            <label>Company Logo (optional)</label>
            <input type="file" name="company_logo" onChange={handleChange} accept="image/*" />

            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} required />

            <label>Employment Type (optional)</label>
            <select name="employment_type" value={formData.employment_type} onChange={handleChange}>
              <option value="">-- Select Employment Type --</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <label>Job Category</label>
            <select name="job_category" value={formData.job_category} onChange={handleChange} required>
              <option value="">-- Select Job Category --</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <label>Number of Employees (optional)</label>
            <input name="no_of_employees" value={formData.no_of_employees} onChange={handleChange} />

            <label>Posted By</label>
            <input name="posted_by" value={formData.posted_by} onChange={handleChange} required />

            <label>Job Description</label>
            <textarea name="job_description" value={formData.job_description} onChange={handleChange} required />

            <label>Responsibilities</label>
            <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} required />

            <label>Qualifications</label>
            <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} required />

            <label>Skills</label>
            <textarea name="skills" value={formData.skills} onChange={handleChange} required />

            <label>Salary and Benefits (optional)</label>
            <textarea name="salary_and_benefits" value={formData.salary_and_benefits} onChange={handleChange} />

            <label>How to Apply</label>
            <textarea name="how_to_apply" value={formData.how_to_apply} onChange={handleChange} required />

            <label>Encouragement Note (optional)</label>
            <input name="encourage_applicants" value={formData.encourage_applicants} onChange={handleChange} />

            <label>Min Salary (optional)</label>
            <input name="min_salary" value={formData.min_salary} onChange={handleChange} />

            <label>Max Salary (optional)</label>
            <input name="max_salary" value={formData.max_salary} onChange={handleChange} />

            <label>Phone Number</label>
            <input
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input name="email" value={formData.email} onChange={handleChange} required />

            <label>Company Website (optional)</label>
            <input name="website" value={formData.website} onChange={handleChange} />

            <label>Posted On</label>
            <input type="date" name="posted_on" value={formData.posted_on} onChange={handleChange} required />

            <label>Expired Date</label>
            <input type="date" name="expired_date" value={formData.expired_date} onChange={handleChange} required />

            <button type="submit" disabled={isSubmitting}>
              Review & Post
            </button>

            {submitSuccess && <p className="success">Job posted successfully!</p>}
            {submitError && <p className="error">{submitError}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default JobPostForm;
