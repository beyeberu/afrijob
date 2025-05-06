import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JobList.css'; // Create this for styling

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    employment_type: '',
    job_category: '',
    search: '',
    ordering: '-posted_on'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = new URLSearchParams();
        
        // Add filters to params if they exist
        if (filters.employment_type) params.append('employment_type', filters.employment_type);
        if (filters.job_category) params.append('job_category', filters.job_category);
        if (filters.search) params.append('search', filters.search);
        if (filters.ordering) params.append('ordering', filters.ordering);

        const response = await axios.get(`/api/jobs/?${params.toString()}`);
        setJobs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="job-container">
      <div className="job-filters">
        <input
          type="text"
          name="search"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        
        <select name="employment_type" onChange={handleFilterChange}>
          <option value="">All Employment Types</option>
          {/* You would populate these from another API endpoint */}
          <option value="1">Full-time</option>
          <option value="2">Part-time</option>
        </select>
        
        <select name="job_category" onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {/* You would populate these from another API endpoint */}
          <option value="1">Technology</option>
          <option value="2">Finance</option>
        </select>
        
        <select name="ordering" onChange={handleFilterChange}>
          <option value="-posted_on">Newest First</option>
          <option value="posted_on">Oldest First</option>
          <option value="min_salary">Salary (Low to High)</option>
          <option value="-max_salary">Salary (High to Low)</option>
        </select>
      </div>

      <div className="job-list">
        {jobs.length === 0 ? (
          <div className="no-jobs">No jobs found matching your criteria.</div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-header">
                {job.company_logo_url && (
                  <img 
                    src={job.company_logo_url} 
                    alt={`${job.company_name} logo`} 
                    className="company-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="job-title-container">
                  <h2>{job.job_title}</h2>
                  <h3>{job.company_name}</h3>
                  <div className="job-meta">
                    <span className="location">{job.location}</span>
                    <span className="employment-type">{job.employment_type?.name}</span>
                    <span className="status">{job.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="job-details">
                <div className="salary-info">
                  <span>Salary: ${job.min_salary} - ${job.max_salary}</span>
                  <span>Employees: {job.no_of_employees || 'N/A'}</span>
                </div>
                <div className="date-info">
                  <span>Posted: {new Date(job.posted_on).toLocaleDateString()}</span>
                  <span>Expires: {new Date(job.expired_date).toLocaleDateString()}</span>
                </div>
                <div className="job-category">{job.job_category}</div>
              </div>
              
              <div className="job-description">
                <h4>Job Description</h4>
                <p>{job.job_description}</p>
                
                <h4>Responsibilities</h4>
                <p>{job.responsibilities}</p>
                
                <h4>Qualifications</h4>
                <p>{job.qualifications}</p>
                
                <h4>Required Skills</h4>
                <p>{job.skills}</p>
              </div>
              
              <div className="job-benefits">
                <h4>Salary and Benefits</h4>
                <p>{job.salary_and_benefits}</p>
              </div>
              
              <div className="how-to-apply">
                <h4>How to Apply</h4>
                <p>{job.how_to_apply}</p>
                <p className="encouragement">{job.encourage_applicants}</p>
                
                <div className="contact-info">
                  <a href={`tel:${job.phone_no}`} className="phone">{job.phone_no}</a>
                  <a href={`mailto:${job.email}`} className="email">{job.email}</a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobList;