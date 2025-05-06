// src/components/JobStats.jsx
import React from 'react';
import './JobStats.css';

const JobStats = ({ jobs }) => {
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status?.toLowerCase() === 'active').length;
  const expiredJobs = jobs.filter(job => job.status?.toLowerCase() === 'expired').length;

  return (
    <div className="job-stats">
      <div className="stat-card">
        <h3>Total Jobs</h3>
        <p>{totalJobs}</p>
      </div>
      <div className="stat-card">
        <h3>Active Jobs</h3>
        <p>{activeJobs}</p>
      </div>
      <div className="stat-card">
        <h3>Expired Jobs</h3>
        <p>{expiredJobs}</p>
      </div>
    </div>
  );
};

export default JobStats;
