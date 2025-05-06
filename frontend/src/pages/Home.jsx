import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../services/Api';
import JobCard from '../components/JobCard';
import HowItWorks from '../components/HowItWorks';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import './Home.css';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetchJobs({ ordering: '-posted_on' });
        const data = Array.isArray(response) ? response : response.results || [];
        setJobs(data);
        setDisplayedJobs(data);
      } catch (err) {
        setError(err.message || 'Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = jobs.filter(job =>
        (job.job_title && job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.company_name && job.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.skills && job.skills.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setDisplayedJobs(filtered);
    } else {
      setDisplayedJobs(jobs);
    }
  }, [searchQuery, jobs]);

  const handleViewAll = () => {
    if (currentUser) {
      navigate('/jobs');
    } else {
      navigate('/login');
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Find Your Dream Job Today</h1>
            <p className="hero-subtitle">Discover thousands of job opportunities with top companies</p>
           
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="featured-jobs">
        <div className="section-header">
          <h2 className="section-title">Featured Jobs</h2>
          <p className="section-description">
            {searchQuery 
              ? `Showing ${displayedJobs.length} jobs matching "${searchQuery}"`
              : 'Browse through our latest job postings from top employers'}
          </p>
        </div>

        <div className="hero-search">
              <SearchBar 
                onSearch={setSearchQuery} 
                initialValue={searchQuery}
              />
            </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Loading featured jobs...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {displayedJobs.slice(0, visibleCount).length > 0 ? (
              displayedJobs.slice(0, visibleCount).map((job) => (
                <JobCard key={job.id} job={job} showButtons={false} />
              ))
            ) : (
              <p className="no-jobs-message">
                {searchQuery
                  ? `No jobs found matching "${searchQuery}". Try searching for something else.`
                  : 'No featured jobs available at the moment. Please check back later.'}
              </p>
            )}
          </div>
        )}

       

        <div className="view-all">
          <button 
            onClick={handleViewAll} 
            className="view-all-btn"
            aria-label={currentUser ? 'View all jobs' : 'Login to view all jobs'}
          >
            {currentUser ? 'View All Jobs' : 'Login to View All Jobs'}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;