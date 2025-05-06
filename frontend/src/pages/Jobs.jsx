import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchJobs, postJob } from '../services/Api';
import { useAuth } from '../contexts/AuthContext';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import ContactModal from '../components/ContactModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Jobs.css';

const SLIDER_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Find Your Dream Job',
    subtitle: 'Thousands of opportunities waiting for you'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Hire Top Talent',
    subtitle: 'Connect with qualified professionals'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    title: 'Grow Your Career',
    subtitle: 'Take the next step in your professional journey'
  }
];


const JOB_CATEGORIES = [
  'Architecture & Construction', 'Construction', 'Engineering', 'Accounting',
  'Finance', 'Customer Service', 'Professional Services', 'Design', 'Marketing',
  'Information Technology', 'Telecommunications', 'Community Service',
  'Science & Technology', 'Business & Administration', 'Media & Journalism',
  'Advertising and Media', 'Sales', 'Management', 'Admin, Secretarial & Clerical',
  'Legal', 'Restaurant & Food Service', 'Purchasing & Procurement',
  'Business Development', 'QA-Quality Control', 'Inventory & Stock', 'Insurance',
  'Economics', 'Social Science & Community', 'Communications, PR & Journalism',
  'Environment & Natural Resource', 'Hospitality-Hotel', 'Supply Chain',
  'Warehouse', 'Natural Science', 'Retail and Trade', 'Nurse',
  'Logistics, Transport & Supply Chain', 'Human Resources',
  'Development & Project Management', 'Training', 'Installation & Repair',
  'Education', 'Health Care', 'Agriculture and Food', 'General Business',
  'Research', 'Consultancy & Training', 'Travel & Tourism', 'Manufacturing',
  'Maintenance', 'Distribution-Shipping'
];

const CATEGORY_MAP = JOB_CATEGORIES.reduce((map, name, index) => {
  map[name] = index + 1;
  return map;
}, {});

const Jobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [contactJob, setContactJob] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [newJobAdded, setNewJobAdded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    ordering: '-posted_on'
  });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    fade: true
  };

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters = {
        search: filters.search.trim(),
        job_category: CATEGORY_MAP[filters.category] || '',
        ordering: filters.ordering
      };
      Object.keys(apiFilters).forEach(key => {
        if (!apiFilters[key]) delete apiFilters[key];
      });

      const { results } = await fetchJobs(apiFilters);
      setJobs(results || []);
      setError(null);
      setNewJobAdded(false);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'ordering') searchParams.set(key, value);
      });
      searchParams.set('ordering', filters.ordering);
      navigate(`?${searchParams.toString()}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, navigate]);

  const handleNewJob = async (jobData) => {
    try {
      const newJob = await postJob(jobData);
      setJobs(prev => [newJob, ...prev]);
      setNewJobAdded(true);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      ordering: searchParams.get('ordering') || '-posted_on'
    };
    setFilters(initialFilters);
  }, [location.search]);

  useEffect(() => {
    const timer = setTimeout(() => loadJobs(), 300);
    return () => clearTimeout(timer);
  }, [loadJobs]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (term) => {
    handleFilterChange('search', term);
  };

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', ordering: '-posted_on' });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && !(key === 'ordering' && value === '-posted_on')
  ).length;

  return (
    <div className="jobs-page">
      {/* Hero Slider */}
      <div className="hero-slider">
        <Slider {...sliderSettings}>
          {SLIDER_IMAGES.map((slide) => (
            <div key={slide.id} className="slider-item">
              <div className="slider-image" style={{ backgroundImage: `url(${slide.url})` }}>
                <div className="slider-overlay"></div>
                <div className="slider-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.subtitle}</p>
                  <div className="slider-buttons">
                    <Link to="/contact" className="slider-button primary">Contact to Post a Job</Link>
                    <Link to="/jobs" className="slider-button secondary">See listed jobs</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>Available Jobs</h1>
        
      </div>

      {/* Main Layout */}
      <div className="jobs-layout">
        <div className="categories-sidebar">
          <h3>Job Categories</h3>
          <div className="categories-list">
            <button onClick={() => handleFilterChange('category', '')} className={!filters.category ? 'active-category' : ''}>
              All Categories
            </button>
            {JOB_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleFilterChange('category', category)}
                className={filters.category === category ? 'active-category' : ''}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="jobs-main-content">
          <div className="filters-section">
            <SearchBar onSearch={handleSearch} initialValue={filters.search} />
            <div className="filters-row">
              <select value={filters.ordering} onChange={(e) => handleFilterChange('ordering', e.target.value)}>
                <option value="-posted_on">Newest First</option>
                <option value="posted_on">Oldest First</option>
              </select>
            </div>

            {activeFiltersCount > 0 && (
              <div className="active-filters">
                <span>{activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</span>
                <button onClick={clearAllFilters}>Clear All</button>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={loadJobs}>Retry</button>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewDetails={() => {
                    setSelectedJobId(job.id);
                    setShowDetailModal(true);
                  }}
                  onContact={() => {
                    setContactJob(job);
                    setShowContactModal(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="no-jobs">
              <p>No jobs found matching your criteria</p>
              <button onClick={clearAllFilters}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && (
        <JobDetailModal jobId={selectedJobId} onClose={() => setShowDetailModal(false)} />
      )}
      {showContactModal && (
        <ContactModal job={contactJob} onClose={() => setShowContactModal(false)} />
      )}
    </div>
  );
};

export default Jobs;
