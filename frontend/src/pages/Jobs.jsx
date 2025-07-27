import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../services/Api';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaUserTie, FaBriefcase, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';
import './Home.css';

const texts = {
  en: {
    heroTitle: "Find Your Dream Job Today",
    heroSubtitle: "Connect with thousands of opportunities from top employers",
    browseAll: "Browse All Jobs",
    howItWorks: "How AfriJob Works",
    howItWorksDesc: "Connecting talented professionals with great opportunities",
    forSeekers: "For Job Seekers",
    seekerSteps: [
      {
        title: "Browse Opportunities",
        desc: "Search jobs by keyword or filter by category, location, or experience level"
      },
      {
        title: "View Job Details",
        desc: "Click on any job to see full description, requirements, and company information"
      },
      {
        title: "Apply Directly",
        desc: "Contact employers using the provided contact information to apply"
      }
    ],
    forEmployers: "For Employers",
    employerSteps: [
      {
        title: "Submit Job Posting",
        desc: "Go to our contact page and click \"Job Posting Form\" to access our submission form"
      },
      {
        title: "Complete the Form",
        desc: "Fill in all required details about the position, requirements, and contact information"
      },
      {
        title: "Approval & Posting",
        desc: "Our team reviews your submission and posts it within 24 hours of approval"
      }
    ],
    postJob: "Post a Job",
    latestJobs: "Latest Job Opportunities",
    latestJobsDesc: "Browse our most recent job postings",
    loading: "Loading latest jobs...",
    noJobs: "No jobs available at the moment. Please check back later.",
    viewAll: "View All Jobs",
    loginToView: "Login to View All Jobs"
  },
  am: {
    heroTitle: "የሚወዱትን ስራ ዛሬ ያግኙ",
    heroSubtitle: "ከከፍተኛ የስራ አዳራሾች ጋር በሺዎች ዕድሎች ይገናኙ",
    browseAll: "ሁሉንም ስራዎች ይመልከቱ",
    howItWorks: "አፍሪጆብ እንዴት ነው የሚሰራው",
    howItWorksDesc: "ብቁ ባለሙያዎችን ከታላቅ ዕድሎች ጋር እንያያዛለን",
    forSeekers: "ለስራ ፈላጊዎች",
    seekerSteps: [
      {
        title: "ዕድሎችን ይመልከቱ",
        desc: "ስራዎችን በቃላት ይፈልጉ ወይም በምድብ፣ ቦታ፣ ወይም በልምድ ደረጃ ያጣሩ"
      },
      {
        title: "የስራ ዝርዝሮችን ይመልከቱ",
        desc: "ሙሉ መግለጫ፣ መስፈርቶች፣ እና የኩባንያ መረጃ ለማየት ማንኛውንም ስራ ይጫኑ"
      },
      {
        title: "ቀጥሎ ይህን ይመልከቱ",
        desc: "ለመስበክ የተሰጠውን የእውቂያ መረጃ በመጠቀም ከሰራተኞች ጋር ይገናኙ"
      }
    ],
    forEmployers: "ለሰራተኞች",
    employerSteps: [
      {
        title: "የስራ ማስታወቂያ ይላኩ",
        desc: "ወደ እኛ የእውቂያ ገጽ ሂዱ እና የስራ ማስታወቂያ ቅጽ ለመድረስ ይጫኑ"
      },
      {
        title: "ቅጽን ይሙሉ",
        desc: "ስለ ቦታው ሁሉንም ዝርዝሮች፣ መስፈርቶች፣ እና የእውቂያ መረጃ ይሙሉ"
      },
      {
        title: "እንደገና ማረጋገጥ እና ማስታወቅ",
        desc: "ቅጽዎን እንመልከታለን እና በ24 ሰዓታት ውስጥ እንለጋለን"
      }
    ],
    postJob: "ስራ ይላኩ",
    latestJobs: "የቅርብ ጊዜ የስራ እድሎች",
    latestJobsDesc: "የቅርብ ጊዜ የስራ ማስታወቂያችንን ይመልከቱ",
    loading: "የቅርብ ጊዜ ስራዎችን በመጫን ላይ...",
    noJobs: "በአሁኑ ጊዜ ምንም ስራ የለም። እባክዎን እንደገና ይመልከቱ",
    viewAll: "ሁሉንም ስራዎች ይመልከቱ",
    loginToView: "ሁሉንም ስራዎች ለማየት ይግቡ"
  }
};

function Jobs({ lang = 'en' }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetchJobs({ ordering: '-posted_on' });
        const data = Array.isArray(response) ? response : response.results || [];
        // Get only the 3 most recent jobs for the home page
        setJobs(data.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const handleViewAll = () => {
    if (currentUser) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{texts[lang].heroTitle}</h1>
            <p className="hero-subtitle">
              {texts[lang].heroSubtitle}
            </p>
            
            <button 
              onClick={handleViewAll} 
              className="hero-cta"
            >
              {texts[lang].browseAll} <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">{texts[lang].howItWorks}</h2>
          <p className="section-description">{texts[lang].howItWorksDesc}</p>
        </div>

        <div className="workflow">
          {/* For Job Seekers */}
          <div className="workflow-card seeker-flow">
            <div className="flow-header">
              <FaUserTie className="flow-icon" />
              <h3>{texts[lang].forSeekers}</h3>
            </div>
            <div className="flow-steps">
              {texts[lang].seekerSteps.map((step, index) => (
                <div className="step" key={index}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleViewAll} 
              className="flow-cta"
            >
              {texts[lang].browseAll} <FaArrowRight />
            </button>
          </div>

          {/* For Employers */}
          <div className="workflow-card employer-flow">
            <div className="flow-header">
              <FaBriefcase className="flow-icon" />
              <h3>{texts[lang].forEmployers}</h3>
            </div>
            <div className="flow-steps">
              {texts[lang].employerSteps.map((step, index) => (
                <div className="step" key={index}>
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/contact')} 
              className="flow-cta"
            >
              {texts[lang].postJob} <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Jobs Preview Section */}
      <section className="latest-jobs">
        <div className="section-header">
          <h2 className="section-title">{texts[lang].latestJobs}</h2>
          <p className="section-description">{texts[lang].latestJobsDesc}</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>{texts[lang].loading}</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="jobs-grid">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    showButtons={false}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                ))
              ) : (
                <p className="no-jobs-message">
                  {texts[lang].noJobs}
                </p>
              )}
            </div>

            <div className="view-all">
              <button 
                onClick={handleViewAll} 
                className="view-all-btn"
                aria-label={currentUser ? texts[lang].viewAll : texts[lang].loginToView}
              >
                {currentUser ? texts[lang].viewAll : texts[lang].loginToView}
                <FaExternalLinkAlt className="link-icon" />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Jobs;


