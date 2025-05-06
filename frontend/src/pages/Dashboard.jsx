// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchJobs } from '../services/Api';
import './Dashboard.css';

function getPercentageChange(current, previous) {
  if (previous === 0) return current === 0 ? "0%" : "100%";
  const change = ((current - previous) / Math.abs(previous)) * 100;
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Store previous stats in localStorage for demo purposes
  const [previousStats, setPreviousStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    expiredJobs: 0,
  });

  useEffect(() => {
    // Load previous stats from localStorage
    const prev = JSON.parse(localStorage.getItem('dashboardStats') || '{}');
    setPreviousStats({
      totalJobs: prev.totalJobs || 0,
      activeJobs: prev.activeJobs || 0,
      expiredJobs: prev.expiredJobs || 0,
    });

    const loadJobs = async () => {
      try {
        const { results } = await fetchJobs();
        setJobs(results);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch job data');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Statistics
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status?.toLowerCase() === 'active').length;
  const expiredJobs = jobs.filter(job => job.status?.toLowerCase() === 'expired').length;

  // Save current stats to localStorage for next visit
  useEffect(() => {
    if (!loading && !error) {
      localStorage.setItem(
        'dashboardStats',
        JSON.stringify({ totalJobs, activeJobs, expiredJobs })
      );
    }
  }, [loading, error, totalJobs, activeJobs, expiredJobs]);

  // Dynamic percentage changes
  // Always 100% for total jobs
  const totalJobsTrend = "100%";

  // Active and expired jobs as a percentage of total jobs
  const activeJobsTrend = totalJobs > 0 ? `${((activeJobs / totalJobs) * 100).toFixed(1)}%` : "0%";
  const expiredJobsTrend = totalJobs > 0 ? `${((expiredJobs / totalJobs) * 100).toFixed(1)}%` : "0%";

  // Company counting (unchanged)
  const companySet = new Set();
  jobs.forEach(job => {
    let companyName = job.company?.name || job.company;
    if (!companyName) return;
    companyName = companyName
      .toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ');
    if (companyName) companySet.add(companyName);
  });
  const totalCompanies = companySet.size;

  const originalCompanies = Array.from(
    new Set(
      jobs
        .map(job => job.company?.name || job.company)
        .filter(Boolean)
        .map(String)
        .map(s => s.trim())
        .filter(Boolean)
    )
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Job Dashboard</h1>
        <p className="dashboard-subtitle">Comprehensive overview of your recruitment platform</p>
        <div className="header-gradient"></div>
      </header>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Gathering insights...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-icon">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
          </div>
          <h3 className="error-title">Data Loading Error</h3>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()} className="refresh-button">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh Dashboard
          </button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard 
              title="Total Jobs" 
              value={totalJobs} 
              icon="📊"
              trend="up"
              trendValue={totalJobsTrend}
              color="#6366f1"
            />
            <StatCard 
              title="Active Jobs" 
              value={activeJobs} 
              icon="✅"
              trend="up"
              trendValue={activeJobsTrend}
              color="#10b981"
            />
            <StatCard 
              title="Expired Jobs" 
              value={expiredJobs} 
              icon="⏳"
              trend="up"
              trendValue={expiredJobsTrend}
              color="#f59e0b"
            />
          </div>

          <div className="dashboard-footer">
            <div className="update-info">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend, trendValue, description }) => (
  <div className="stat-card">
    <div className="stat-badge" style={{ backgroundColor: color + '20', color }}>
      {icon}
    </div>
    <div className="stat-content">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trend}`}>
          {trend === 'up' ? (
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4l-8 8h5v8h6v-8h5z"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 20l8-8h-5V4h-6v8H4z"/>
            </svg>
          )}
          {trendValue}
        </div>
      )}
    </div>
    {description && (
      <div className="stat-hover-info">
        <div className="hover-content">
          <h4>Companies List</h4>
          <p>{description}</p>
        </div>
      </div>
    )}
  </div>
);

export default Dashboard;