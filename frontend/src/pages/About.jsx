import React, { useEffect, useState } from 'react';
import { FaUsers, FaHandshake, FaChartLine, FaBullseye } from 'react-icons/fa';
import { fetchJobs } from '../services/Api';
import './About.css';

const texts = {
  en: {
    heroTitle: "Connecting Talent with Opportunity",
    heroSubtitle: "Your bridge between exceptional candidates and top employers",
    mission: "Our Mission",
    missionText: "We're dedicated to revolutionizing the job search process by creating a platform that's efficient for job seekers and employers alike. Our goal is to reduce unemployment by making job matching smarter, faster, and more effective.",
    totalJobs: "Total Jobs",
    activeJobs: "Active Jobs",
    expiredJobs: "Expired Jobs",
    whyChoose: "Why Choose Our Platform?",
    forSeekers: "For Job Seekers",
    seekersList: [
      "Discover Your Next Opportunity: Browse a wide range of verified job postings from top employers.",
      "Seamless Connections: Easily find company contact details to reach out directly and fast-track your application.",
      "User-Friendly Experience: No lengthy sign-ups—just explore jobs and connect with employers effortlessly.",
      "Stay Updated: Regularly updated listings so you never miss out on new openings."
    ],
    forEmployers: "For Employers",
    employersList: [
      "Effortless Job Posting: Submit your job openings through our simple form—we handle the rest.",
      "Reach the Right Talent: Get your roles seen by motivated job seekers actively searching for opportunities.",
      "Direct Engagement: Candidates contact you directly, streamlining the hiring process.",
      "Quick & Efficient: No middlemen—post jobs fast and start receiving inquiries immediately."
    ],
    team: "Our Team",
    teamText: "We're a diverse group of HR professionals, technologists, and career coaches united by a common goal: to make hiring and job searching painless and productive.",
    ready: "Ready to Find Your Perfect Match?",
    postJob: "Post a Job",
    browseJobs: "Browse Jobs"
  },
  am: {
    heroTitle: "ብቁ ተወዳዳሪዎችን ከዕድሎች ጋር እንያያዛለን",
    heroSubtitle: "በተሟላ ተወዳዳሪዎችና በከፍተኛ የስራ አዳራሾች መካከል ድርብ ድርጅት",
    mission: "ተልዕኮታችን",
    missionText: "ለስራ ፈላጊዎችና ለስራ አዳራሾች በቀላሉ የሚሰራ መድረክ በመፍጠር የስራ ፈላጊነትን ለመቀነስ እና የስራ መያዣን የበለጠ ቀላል፣ ፈጣን እና ውጤታማ ለማድረግ ተስፋ አድርገናል።",
    totalJobs: "ጠቅላላ ስራዎች",
    activeJobs: "አባል ስራዎች",
    expiredJobs: "ያበቃ ስራዎች",
    whyChoose: "ለምን መድረካችንን ይመርጡ?",
    forSeekers: "ለስራ ፈላጊዎች",
    seekersList: [
      "የሚቀጥለውን ዕድል ያግኙ፡ ከከፍተኛ የስራ አዳራሾች በሚሰጡ የተረጋገጡ ስራዎች ዝርዝር ይመልከቱ።",
      "ቀላል ግንኙነት፡ የኩባንያውን የእውቂያ ዝርዝር በቀላሉ ያግኙ እና በፍጥነት ይግቡ።",
      "ተጠቃሚ የሆነ ተሞክሮ፡ ረጅም ምዝገባ የለም፤ ስራዎችን ይመልከቱ እና ከአዳራሾች ጋር በቀላሉ ይገናኙ።",
      "ዘወትር ይዘምኑ፡ አዲስ የስራ አገናኞችን አትንሱ።"
    ],
    forEmployers: "ለኩባንያዎች",
    employersList: [
      "ቀላል የስራ ማስተዋወቅያ፡ የስራዎትን ቦታ በቀላሉ ያስገቡ፤ እኛ እንደምናደርገው ይተዉት።",
      "ትክክለኛውን ተወዳዳሪ ያግኙ፡ የስራዎት ቦታ በተነሳሳ የስራ ፈላጊዎች ፊት ላይ ይውሰድ።",
      "ቀጥታ ግንኙነት፡ ተወዳዳሪዎች በቀጥታ ይገናኛሉ፤ የቅድሚያ ሂደቱን ያጠናክሩ።",
      "ፈጣን እና ውጤታማ፡ መካከለኛ የለም፤ ስራዎትን በፍጥነት ያስገቡ እና የተጠየቁ መልሶችን ይቀበሉ።"
    ],
    team: "ቡድናችን",
    teamText: "የተለያዩ የሰው ኃይል ባለሙያዎች፣ ቴክኖሎጂ ባለሙያዎች እና የሙያ አስተካካዮች ነን፤ የስራ መፈለጊያንና መቅጠርን ቀላል እና ውጤታማ ለማድረግ በአንድነት ተቀላቅለናል።",
    ready: "የሚስማማውን ግንኙነት ለማግኘት ዝግጁ ነዎት?",
    postJob: "ስራ ያስገቡ",
    browseJobs: "ስራዎችን ይመልከቱ"
  }
};

const About = ({ lang = 'en' }) => {
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
          <h1>{texts[lang].heroTitle}</h1>
          <p>{texts[lang].heroSubtitle}</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <h2>{texts[lang].mission}</h2>
          <p>{texts[lang].missionText}</p>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h3>{stats.totalJobs?.toLocaleString() || '0'}+</h3>
              <p>{texts[lang].totalJobs}</p>
            </div>
            <div className="stat-card">
              <FaHandshake className="stat-icon" />
              <h3>{stats.activeJobs?.toLocaleString() || '0'}+</h3>
              <p>{texts[lang].activeJobs}</p>
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <h3>{stats.expiredJobs?.toLocaleString() || '0'}+</h3>
              <p>{texts[lang].expiredJobs}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>{texts[lang].whyChoose}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>{texts[lang].forSeekers}</h3>
              <ul>
                {texts[lang].seekersList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏢</div>
              <h3>{texts[lang].forEmployers}</h3>
              <ul>
                {texts[lang].employersList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>{texts[lang].team}</h2>
          <p>{texts[lang].teamText}</p>
          <div className="team-grid">
            {/* Team members would go here */}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>{texts[lang].ready}</h2>
          <div className="cta-buttons">
            <a href="/jobpostform" className="cta-button employer-cta">
              {texts[lang].postJob}
            </a>
            <a href="/" className="cta-button jobseeker-cta">
              {texts[lang].browseJobs}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
