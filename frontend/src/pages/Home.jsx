


























import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { fetchJobs, postJob, fetchAdvertisements } from '../services/Api';
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

const PAGE_SIZE = 10; // Number of jobs to load per page

const texts = {
  en: {
    filterByCategory: "Filter by Job Category",
    allCategories: "All Categories",
    close: "Close",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    activeFilters: (count) => `${count} active filter${count > 1 ? 's' : ''}`,
    clearAll: "Clear All",
    jobsFound: (count) => `${count} job${count !== 1 ? "s" : ""} found`,
    loadMore: "Load More Jobs",
    showLess: "Show Less",
    noJobs: "No jobs found matching your criteria",
    resetFilters: "Reset Filters",
    availableJobs: "Available Jobs",
    postNewJob: "Post New Job",
    contactToPost: "Contact to Post a Job",
    seeListed: "See listed jobs",
    retry: "Retry"
  },
  am: {
    filterByCategory: "በስራ ምድብ ያጣሩ",
    allCategories: "ሁሉም ምድቦች",
    close: "ዝጋ",
    newestFirst: "አዲሱ በመጀመሪያ",
    oldestFirst: "አሮጌው በመጀመሪያ",
    activeFilters: (count) => `${count} ንቁ ማጣሪያ${count > 1 ? 'ዎች' : ''}`,
    clearAll: "ሁሉንም አጥፋ",
    jobsFound: (count) => `${count} ስራ ተለቆል`,
    loadMore: "ተጨማሪ ስራዎች አሳይ",
    showLess: "ቀንስ",
    noJobs: "ምንም ስራ ከተመረጡት ጋር አልተገኘም",
    resetFilters: "ማጣሪያዎቹን ዳግም አስጀምር",
    availableJobs: "የሚገኙ ስራዎች",
    postNewJob: "አዲስ ስራ አስገባ",
    contactToPost: "ስራ ለማስገባት ያግኙን",
    seeListed: "የተዘረዘሩትን ስራዎች ይመልከቱ",
    retry: "ደግመው ይሞክሩ"
  }
};

const DATE_FILTER_LABELS = {
  en: {
    today: "Today's Posted Jobs",
    week: "This Week's Posted Jobs",
    lastWeek: "Last Week's Posted Jobs",
    month: "This Month's Posted Jobs",
    lastMonth: "Last Month's Posted Jobs",
    all: "All Jobs"
  },
  am: {
    today: "ዛሬ የወጡ ስራዎች",
    week: "በዚህ ሳምንት የወጡ ስራዎች",
    lastWeek: "ባለፈው ሳምንት የወጡ ስራዎች",
    month: "በዚህ ወር የወጡ ስራዎች",
    lastMonth: "ባለፈው ወር የወጡ ስራዎች",
    all: "ሁሉም ስራዎች"
  }
};

const getDateRange = (type) => {
  const now = new Date();
  let start, end;
  switch (type) {
    case 'today':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      break;
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      end = new Date(now);
      end.setDate(start.getDate() + 7);
      break;
    case 'lastWeek':
      end = new Date(now);
      end.setDate(end.getDate() - end.getDay());
      start = new Date(end);
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'lastMonth':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      return null;
  }
  return { start, end };
};

const EMPLOYEE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' }
];

const LOCATIONS = [
  "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar", "Hawassa", "Jimma", "Harar",
  "Arba Minch", "Dessé", "Shashamane", "Adama (Nazret)", "Debre Birhan", "Nekemte",
  "Bishoftu (Debre Zeit)", "Assosa", "Dilla", "Hosaena", "Kombolcha", "Wolaita Sodo"
];

const Home = ({ lang = 'en' }) => {
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
    location: '',
    ordering: '-posted_on'
  });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showCategories, setShowCategories] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [categorySearch, setCategorySearch] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locations, setLocations] = useState(LOCATIONS);
  const [ads, setAds] = useState([]);
  const [adIndex, setAdIndex] = useState(0);

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

  const loadJobs = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const apiFilters = {
        search: filters.search.trim(),
        job_category: CATEGORY_MAP[filters.category] || '',
        location: filters.location,
        ordering: filters.ordering,
        employee_type: employeeType,
        page: currentPage,
        page_size: PAGE_SIZE
      };

      Object.keys(apiFilters).forEach(key => {
        if (!apiFilters[key]) delete apiFilters[key];
      });

      const { results, count } = await fetchJobs(apiFilters);
      
      if (reset) {
        setJobs(results || []);
        setPage(1);
      } else {
        setJobs(prev => [...prev, ...(results || [])]);
      }
      
      setHasMore(results?.length === PAGE_SIZE);
      setError(null);
      setNewJobAdded(false);

      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && key !== 'ordering') searchParams.set(key, value);
      });
      if (employeeType) searchParams.set('employee_type', employeeType);
      searchParams.set('ordering', filters.ordering);
      navigate(`?${searchParams.toString()}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, navigate, employeeType]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    loadJobs(true); // Reset and load first page when filters change
  }, [filters]);

  useEffect(() => {
    if (page > 1) {
      loadJobs(); // Load more jobs when page increases
    }
  }, [page]);

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

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (term) => {
    handleFilterChange('search', term);
  };

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', location: '', ordering: '-posted_on' });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && !(key === 'ordering' && value === '-posted_on')
  ).length;

  const filteredJobs = jobs.filter(job => {
    if (dateFilter === 'all') return true;
    const postedDate = new Date(job.posted_on);
    const range = getDateRange(dateFilter);
    if (!range) return true;
    return postedDate >= range.start && postedDate < range.end;
  });

  const getJobsCountText = () => {
    if (filteredJobs.length === 0) return texts[lang].noJobs;
  
    const category = filters.category ? filters.category : (lang === 'am' ? 'ሁሉም ምድቦች' : 'All Categories');
    const timeLabel = dateFilter !== 'all' ? DATE_FILTER_LABELS[lang][dateFilter] : '';
  
    if (filters.category && dateFilter !== 'all') {
      return `${texts[lang].jobsFound(filteredJobs.length)} ${lang === 'am' ? 'በ' : 'in'} ${category} ${lang === 'am' ? 'ለ' : 'for'} ${timeLabel}`;
    }
    if (filters.category) {
      return `${texts[lang].jobsFound(filteredJobs.length)} ${lang === 'am' ? 'በ' : 'in'} ${category}`;
    }
    if (dateFilter !== 'all') {
      return `${texts[lang].jobsFound(filteredJobs.length)} ${lang === 'am' ? '' : 'for'} ${timeLabel}`;
    }
    return texts[lang].jobsFound(filteredJobs.length);
  };

  const filteredCategories = JOB_CATEGORIES.filter(cat =>
    cat.toLowerCase().startsWith(categoryInput.toLowerCase())
  );

  const filteredLocations = locations.filter(loc =>
    loc.toLowerCase().startsWith(locationInput.toLowerCase())
  );

  const handleLocationSelect = (loc) => {
    setLocationInput(loc);
    setFilters(prev => ({ ...prev, location: loc }));
    setShowLocationOptions(false);
    if (loc && !locations.some(l => l.toLowerCase() === loc.toLowerCase())) {
      setLocations(prev => [...prev, loc]);
    }
  };

  useEffect(() => {
    const loadAds = async () => {
      try {
        const results = await fetchAdvertisements();
        setAds(results || []);
      } catch (err) {
        setAds([]);
      }
    };
    loadAds();
  }, []);

  // Function to get the next ad in a circular manner
  const getNextAd = () => {
    if (ads.length === 0) return null;
    const ad = ads[adIndex % ads.length];
    setAdIndex(prev => (prev + 1) % ads.length);
    return ad;
  };

  // Function to render jobs with ads interspersed
  const renderJobsWithAds = () => {
    const jobElements = [];
    let adCounter = 0;
    
    filteredJobs.slice(0, visibleCount).forEach((job, index) => {
      jobElements.push(
        <JobCard
          key={job.id}
          job={job}
          lang={lang}
          onViewDetails={() => {
            setSelectedJobId(job.id);
            setShowDetailModal(true);
          }}
          onContact={() => {
            setContactJob(job);
            setShowContactModal(true);
          }}
          showButtons={true}
        />
      );

      // Insert an ad after every 3 jobs, if ads are available
      if (ads.length > 0 && (index + 1) % 3 === 0) {
        const ad = getNextAd();
        if (ad) {
          jobElements.push(
            <div key={`ad-${adCounter}`} className="ad-card featured-ad">
              <div className="ad-label">{lang === 'am' ? 'ማስታወቂያ' : 'Advertisement'}</div>
              <a href={ad.link} target="_blank" rel="noopener noreferrer">
                <img 
                  src={ad.image_url} 
                  alt={ad.title || 'Advertisement'} 
                  className="ad-image"
                />
                <div className="ad-content">
                  {ad.title && <h4 className="ad-title">{ad.title}</h4>}
                  {ad.description && <p className="ad-description">{ad.description}</p>}
                </div>
              </a>
            </div>
          );
          adCounter++;
        }
      }
    });

    return jobElements;
  };

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
                    <Link to="/contact" className="slider-button primary">{texts[lang].contactToPost}</Link>
                    <Link to="/" className="slider-button secondary">{texts[lang].seeListed}</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>{texts[lang].availableJobs}</h1>
        {/* Date Filters */}
        <div className="date-filters">
          <button
            className={dateFilter === 'all' ? 'active-category' : ''}
            onClick={() => setDateFilter('all')}
          >
            {lang === 'am' ? 'ሁሉም' : 'All'}
          </button>
          <button
            className={dateFilter === 'today' ? 'active-category' : ''}
            onClick={() => setDateFilter('today')}
          >
            {lang === 'am' ? 'ዛሬ' : "Today's"}
          </button>
          <button
            className={dateFilter === 'week' ? 'active-category' : ''}
            onClick={() => setDateFilter('week')}
          >
            {lang === 'am' ? 'በዚህ ሳምንት' : "This Week"}
          </button>
          <button
            className={dateFilter === 'lastWeek' ? 'active-category' : ''}
            onClick={() => setDateFilter('lastWeek')}
          >
            {lang === 'am' ? 'ባለፈው ሳምንት' : "Last Week"}
          </button>
          <button
            className={dateFilter === 'month' ? 'active-category' : ''}
            onClick={() => setDateFilter('month')}
          >
            {lang === 'am' ? 'በዚህ' : "This Month"}
          </button>
          <button
            className={dateFilter === 'lastMonth' ? 'active-category' : ''}
            onClick={() => setDateFilter('lastMonth')}
          >
            {lang === 'am' ? 'ባለፈው ወር' : "Last Month"}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="jobs-layout-container">
        {/* Left Sidebar Filters */}
        <div className="jobs-sidebar">
          {/* Category Filter */}
          <div className="sidebar-section">
            <h3>{texts[lang].filterByCategory}</h3>
            <div className="search-filter">
              <input
                type="text"
                placeholder={lang === 'am' ? 'ምድብ ይፈልጉ...' : 'Search categories...'}
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
              />
              <i className="search-icon">🔍</i>
            </div>
            <div className="category-list">
              {JOB_CATEGORIES
                .filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                .map(category => (
                  <div
                    key={category}
                    className={`category-item ${filters.category === category ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', category)}
                  >
                    {category}
                    {filters.category === category && <span className="checkmark">✓</span>}
                  </div>
                ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="sidebar-section">
            <h3>{lang === 'am' ? 'ቦታ' : 'Location'}</h3>
            <div className="location-filter">
              <input
                type="text"
                placeholder={lang === 'am' ? 'ቦታ ይፈልጉ...' : 'Search locations...'}
                value={locationInput}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowLocationOptions(true);
                }}
                onFocus={() => setShowLocationOptions(true)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleLocationSelect(locationInput);
                    setShowLocationOptions(false);
                  }
                }}
              />
              {showLocationOptions && (
                <div className="location-dropdown">
                  {filteredLocations.map(loc => (
                    <div
                      key={loc}
                      className="location-option"
                      onClick={() => handleLocationSelect(loc)}
                    >
                      {loc}
                    </div>
                  ))}
                  {locationInput && !locations.includes(locationInput) && (
                    <div 
                      className="location-option add-new"
                      onClick={() => handleLocationSelect(locationInput)}
                    >
                      {lang === 'am' 
                        ? `አዲስ ቦታ ያክሉ: "${locationInput}"`
                        : `Add new: "${locationInput}"`}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="selected-locations">
              {filters.location && (
                <div className="selected-location">
                  {filters.location}
                  <button 
                    className="remove-location"
                    onClick={() => handleFilterChange('location', '')}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Type Filter */}
          <div className="sidebar-section">
            <h3>{lang === 'am' ? 'የስራ አይነት' : 'Job Type'}</h3>
            <div className="job-type-filter">
              {EMPLOYEE_TYPES.map(type => (
                <div
                  key={type.value}
                  className={`type-option ${employeeType === type.value ? 'active' : ''}`}
                  onClick={() => setEmployeeType(type.value)}
                >
                  {type.label}
                </div>
              ))}
            </div>
          </div>

          {/* Date Posted Filter */}
          <div className="sidebar-section">
            <h3>{lang === 'am' ? 'የተለቀቀበት ጊዜ' : 'Date Posted'}</h3>
            <div className="date-filter">
              {Object.entries(DATE_FILTER_LABELS[lang]).map(([key, label]) => (
                <div
                  key={key}
                  className={`date-option ${dateFilter === key ? 'active' : ''}`}
                  onClick={() => setDateFilter(key)}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <button 
            className="reset-filters"
            onClick={() => {
              setFilters({ search: '', category: '', location: '', ordering: '-posted_on' });
              setEmployeeType('');
              setDateFilter('all');
            }}
          >
            {texts[lang].resetFilters}
          </button>
        </div>

        {/* Main Content Area */}
        <div className="jobs-main-content">
          {/* Search and Sort Header */}
          <div className="jobs-header">
            <div className="search-container">
              <SearchBar 
                onSearch={handleSearch} 
                initialValue={filters.search}
                placeholder={lang === 'am' ? 'ስራዎችን ይፈልጉ...' : 'Search jobs...'}
              />
            </div>
            <div className="sort-container">
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="-posted_on">{texts[lang].newestFirst}</option>
                <option value="posted_on">{texts[lang].oldestFirst}</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="active-filters-container">
            {activeFiltersCount > 0 && (
              <div className="active-filters">
                <span className="filters-count">
                  {texts[lang].activeFilters(activeFiltersCount)}
                </span>
                {filters.category && (
                  <span className="filter-chip">
                    {filters.category}
                    <button 
                      onClick={() => handleFilterChange('category', '')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="filter-chip">
                    {filters.location}
                    <button 
                      onClick={() => handleFilterChange('location', '')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {employeeType && (
                  <span className="filter-chip">
                    {EMPLOYEE_TYPES.find(t => t.value === employeeType)?.label}
                    <button 
                      onClick={() => setEmployeeType('')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="filter-chip">
                    {DATE_FILTER_LABELS[lang][dateFilter]}
                    <button 
                      onClick={() => setDateFilter('all')}
                      className="remove-filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button 
                  onClick={clearAllFilters}
                  className="clear-all"
                >
                  {texts[lang].clearAll}
                </button>
              </div>
            )}
          </div>

          {/* Jobs Count */}
          <div className="jobs-count">
            {getJobsCountText()}
          </div>

          {/* Jobs List */}
          {loading && page === 1 ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => loadJobs(true)}>{texts[lang].retry}</button>
            </div>
          ) : (
            <>
              {filteredJobs.length > 0 ? (
                <>
                  <div className="jobs-grid">
                    {renderJobsWithAds()}
                  </div>
                  <div className="load-more-container">
                    {visibleCount < filteredJobs.length && (
                      <button
                        onClick={() => setVisibleCount(prev => prev + 6)}
                        className="load-more-btn"
                      >
                        {texts[lang].loadMore}
                      </button>
                    )}
                    {visibleCount > 6 && (
                      <button
                        onClick={() => setVisibleCount(prev => Math.max(6, prev - 6))}
                        className="show-less-btn"
                      >
                        {texts[lang].showLess}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="no-jobs-found">
                  <div className="no-jobs-content">
                    <h3>{texts[lang].noJobs}</h3>
                    <p>
                      {lang === 'am' 
                        ? 'የፈለጉትን ስራ ማግኘት አልቻሉም? የማጣሪያዎቹን ቅንብሮች ይለውጡ �ወይም የበለጠ ስፋት ያለው ፍለጋ ይሞክሩ።'
                        : "Couldn't find what you're looking for? Try adjusting your filters or broadening your search."}
                    </p>
                    <button 
                      onClick={clearAllFilters}
                      className="reset-search-btn"
                    >
                      {texts[lang].resetFilters}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <button 
              className="modal-close"
              onClick={() => setShowDetailModal(false)}
            >
              &times;
            </button>
            <JobDetailModal 
              jobId={selectedJobId} 
              onClose={() => setShowDetailModal(false)}
              lang={lang}
            />
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <button 
              className="modal-close"
              onClick={() => setShowContactModal(false)}
            >
              &times;
            </button>
            <ContactModal 
              job={contactJob} 
              onClose={() => setShowContactModal(false)}
              lang={lang}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;