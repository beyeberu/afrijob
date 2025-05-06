import React from 'react';
import './Filters.css';

const Filters = ({ onFilterChange, filters, showCategories }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="filters-container">
      <div className="filter-group">
        <input
          type="text"
          name="search"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={handleChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <select
          name="employment_type"
          value={filters.employment_type}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">All Employment Types</option>
          <option value="1">Full-time</option>
          <option value="2">Part-time</option>
          <option value="3">Contract</option>
          <option value="4">Internship</option>
        </select>
      </div>

      {showCategories && (
        <div className="filter-group">
          <select
            name="job_category"
            value={filters.job_category}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
          </select>
        </div>
      )}

      <div className="filter-group">
        <select
          name="ordering"
          value={filters.ordering}
          onChange={handleChange}
          className="filter-select"
        >
          <option value="-posted_on">Newest First</option>
          <option value="posted_on">Oldest First</option>
          <option value="min_salary">Salary (Low to High)</option>
          <option value="-max_salary">Salary (High to Low)</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;