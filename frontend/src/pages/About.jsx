import React, { useEffect, useState } from 'react';
import { FaUsers, FaHandshake, FaChartLine, FaBullseye } from 'react-icons/fa';
import { fetchJobs } from '../services/Api'; // Assuming fetchJobs is available
import './About.css';

const About = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    expiredJobs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { results } = await fetchJobs();
        setJobs(results);

        // Calculate stats from jobs data
        const totalJobs = results.length;
        const activeJobs = results.filter(job => job.status?.toLowerCase() === 'active').length;
        const expiredJobs = results.filter(job => job.status?.toLowerCase() === 'expired').length;

        setStats({
          totalJobs,
          activeJobs,
          expiredJobs,
        });

        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch job data');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  if (loading) return <div className="about-page">Loading statistics...</div>;
  if (error) return <div className="about-page">Error: {error}</div>;

  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Connecting Talent with Opportunity</h1>
          <p>Your bridge between exceptional candidates and top employers</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            We're dedicated to revolutionizing the job search process by creating a platform that's
            efficient for job seekers and employers alike. Our goal is to reduce unemployment by
            making job matching smarter, faster, and more effective.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h3>{stats.totalJobs?.toLocaleString() || '0'}+</h3>
              <p>Total Jobs</p>
            </div>
            <div className="stat-card">
              <FaHandshake className="stat-icon" />
              <h3>{stats.activeJobs?.toLocaleString() || '0'}+</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <h3>{stats.expiredJobs?.toLocaleString() || '0'}+</h3>
              <p>Expired Jobs</p>
            </div>
            {/* You can add more statistics like Successful Hires or Registered Companies here */}
          </div>
        </div>
      </section>

      <section className="features-section">
  <div className="container">
    <h2>Why Choose Our Platform?</h2>
    <div className="features-grid">
      <div className="feature-card">
        <div className="feature-icon">🚀</div>
        <h3>For Job Seekers</h3>
        <ul>
          <li><strong>Discover Your Next Opportunity:</strong> Browse a wide range of verified job postings from top employers.</li>
          <li><strong>Seamless Connections:</strong> Easily find company contact details to reach out directly and fast-track your application.</li>
          <li><strong>User-Friendly Experience:</strong> No lengthy sign-ups—just explore jobs and connect with employers effortlessly.</li>
          <li><strong>Stay Updated:</strong> Regularly updated listings so you never miss out on new openings.</li>
        </ul>
      </div>
      <div className="feature-card">
        <div className="feature-icon">🏢</div>
        <h3>For Employers</h3>
        <ul>
          <li><strong>Effortless Job Posting:</strong> Submit your job openings through our simple form—we handle the rest.</li>
          <li><strong>Reach the Right Talent:</strong> Get your roles seen by motivated job seekers actively searching for opportunities.</li>
          <li><strong>Direct Engagement:</strong> Candidates contact you directly, streamlining the hiring process.</li>
          <li><strong>Quick & Efficient:</strong> No middlemen—post jobs fast and start receiving inquiries immediately.</li>
        </ul>
      </div>
    </div>
  </div>
</section>

      <section className="team-section">
        <div className="container">
          <h2>Our Team</h2>
          <p>
            We're a diverse group of HR professionals, technologists, and career coaches united by a
            common goal: to make hiring and job searching painless and productive.
          </p>
          <div className="team-grid">
            {/* Team members would go here */}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Match?</h2>
          <div className="cta-buttons">
            <a href="/jobpostform" className="cta-button employer-cta">
              Post a Job
            </a>
            <a href="/jobs" className="cta-button jobseeker-cta">
              Browse Jobs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
