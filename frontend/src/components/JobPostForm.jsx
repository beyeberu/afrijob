import React, { useState, useEffect } from 'react';
import './JobPostForm.css';
import { useAuth } from '../contexts/AuthContext';
import { fetchLocations, addLocation } from '../services/Api';

const texts = {
  en: {
    history: "Your Job Post History",
    posted: (count) => `You have posted ${count} job${count !== 1 ? "s" : ""}.`,
    deleteHistory: "Delete History",
    noJobs: "No jobs posted yet.",
    seeFullJob: "See Full Job",
    delete: "Delete",
    review: "Review Your Job Post",
    edit: "Edit",
    confirm: "Confirm & Post",
    posting: "Posting...",
    jobPosted: "Job posted successfully!",
    reviewAndPost: "Review & Post",
    required: "required",
    // Form labels
    jobTitle: "Job Title",
    companyName: "Company Name",
    companyLogo: "Company Logo (optional)",
    location: "Location",
    employmentType: "Employment Type (optional)",
    jobCategory: "Job Category",
    noOfEmployees: "Number of Employees (optional)",
    postedBy: "Posted By",
    jobDescription: "Job Description",
    responsibilities: "Responsibilities",
    qualifications: "Qualifications",
    skills: "Skills",
    salaryAndBenefits: "Salary and Benefits (optional)",
    howToApply: "How to Apply",
    encouragementNote: "Encouragement Note (optional)",
    minSalary: "Min Salary (optional)",
    maxSalary: "Max Salary (optional)",
    phoneNumber: "Phone Number",
    email: "Email",
    companyWebsite: "Company Website (optional)",
    postedOn: "Posted On",
    expiredDate: "Expired Date",
    // Modal
    company: "Company",
    postedOnLabel: "Posted On",
    expiredDateLabel: "Expired Date",
    website: "Website",
    encouragement: "Encouragement Note",
    salary: "Salary",
    close: "Close",
    basicInfo: "Basic Information",
    jobDetails: "Job Details",
    contactInfo: "Contact Information",
    dates: "Dates",
    requiredField: "* Required field",
  },
  am: {
    history: "የእርስዎ የስራ ማስተዋወቅያ ታሪክ",
    posted: (count) => `እርስዎ ${count} ስራ አስገብተዋል።`,
    deleteHistory: "ታሪኩን ሰርዝ",
    noJobs: "ምንም ስራ አልተገባም።",
    seeFullJob: "ሙሉ ስራውን ይመልከቱ",
    delete: "ሰርዝ",
    review: "የስራዎን ማስተዋወቅያ ይገምግሙ",
    edit: "አርትዕ",
    confirm: "አረጋግጥ እና አስገባ",
    posting: "በመስጠት ላይ...",
    jobPosted: "ስራ በተሳካ ሁኔታ ተገብቷል!",
    reviewAndPost: "ይገምግሙ እና አስገቡ",
    required: "አስፈላጊ",
    // Form labels
    jobTitle: "የስራ ርዕስ",
    companyName: "የኩባንያ ስም",
    companyLogo: "የኩባንያ አርማ (አማራጭ)",
    location: "ቦታ",
    employmentType: "የስራ አይነት (አማራጭ)",
    jobCategory: "የስራ ምድብ",
    noOfEmployees: "የሰራተኞች ብዛት (አማራጭ)",
    postedBy: "የተሰጠው በ",
    jobDescription: "የስራ መግለጫ",
    responsibilities: "ኃላፊነቶች",
    qualifications: "ብቃት",
    skills: "ችሎታዎች",
    salaryAndBenefits: "ደመወዝ እና ጥቅሞች (አማራጭ)",
    howToApply: "የማመልከቻ መንገድ",
    encouragementNote: "የመነሻ ማስታወቂያ (አማራጭ)",
    minSalary: "ዝቅተኛ ደመወዝ (አማራጭ)",
    maxSalary: "ከፍተኛ ደመወዝ (አማራጭ)",
    phoneNumber: "ስልክ ቁጥር",
    email: "ኢሜይል",
    companyWebsite: "የኩባንያ ድህረገፅ (አማራጭ)",
    postedOn: "የተሰጠበት ቀን",
    expiredDate: "የሚያበቃበት ቀን",
    // Modal
    company: "ኩባንያ",
    postedOnLabel: "የተሰጠበት ቀን",
    expiredDateLabel: "የሚያበቃበት ቀን",
    website: "ድህረገፅ",
    encouragement: "የመነሻ �ማስታወቂያ",
    salary: "ደመወዝ",
    close: "ዝጋ",
    basicInfo: "መሰረታዊ መረጃ",
    jobDetails: "የስራ ዝርዝሮች",
    contactInfo: "የመገኛ መረጃ",
    dates: "ቀኖች",
    requiredField: "* አስፈላጊ መስክ",
  }
};

function UserJobHistory({ userEmail, jobs, setJobs, lang }) {
  const jobsKey = `userJobPosts_${userEmail}`;
  const countKey = `jobPostCount_${userEmail}`;
  const [selectedJob, setSelectedJob] = useState(null);

  const handleDeleteJob = (id) => {
    if (window.confirm(lang === 'am' ? "እርግጠኛ ነዎት ይህን ስራ ከታሪክዎ ማስወገድ ይፈልጋሉ?" : "Are you sure you want to delete this job from your history?")) {
      const updatedJobs = jobs.filter(job => job.id !== id);
      setJobs(updatedJobs);
      localStorage.setItem(jobsKey, JSON.stringify(updatedJobs));
    }
  };

  const handleDeleteHistory = () => {
    if (window.confirm(lang === 'am' ? "እርግጠኛ ነዎት የስራ ማስታወቂያ ታሪኩን ሙሉ በሙሉ ማስወገድ ይፈልጋሉ?" : "Are you sure you want to delete all your job post history?")) {
      localStorage.removeItem(jobsKey);
      setJobs([]);
    }
  };

  return (
    <div className="user-history-container">
      <div className="history-header">
        <h3>{texts[lang].history}</h3>
        <p className="job-count">{texts[lang].posted(localStorage.getItem(countKey) || 0)}</p>
      </div>
      
      <button
        className="delete-history-btn"
        onClick={handleDeleteHistory}
        disabled={jobs.length === 0}
      >
        {texts[lang].deleteHistory}
      </button>
      
      <div className="job-history-list">
        {jobs.length === 0 ? (
          <p className="no-jobs-message">{texts[lang].noJobs}</p>
        ) : (
          jobs.slice().reverse().map(job => (
            <div key={job.id} className="job-history-card">
              <div className="job-title">{job.job_title}</div>
              <div className="company-name">{job.company_name}</div>
              <div className="job-dates">
                {job.posted_on} - {job.expired_date}
              </div>
              <div className="job-actions">
                <button
                  className="view-job-btn"
                  onClick={() => setSelectedJob(job)}
                >
                  {texts[lang].seeFullJob}
                </button>
                <button
                  className="delete-job-btn"
                  onClick={() => handleDeleteJob(job.id)}
                >
                  {texts[lang].delete}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedJob && (
        <div className="job-details-modal" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedJob(null)}>
              &times;
            </button>
            
            <h2 className="modal-title">{selectedJob.job_title}</h2>
            
            <div className="modal-section">
              <h3>{texts[lang].basicInfo}</h3>
              <div className="info-grid">
                <div><strong>{texts[lang].company}:</strong> {selectedJob.company_name}</div>
                <div><strong>{texts[lang].location}:</strong> {selectedJob.location}</div>
                <div><strong>{texts[lang].employmentType}:</strong> {selectedJob.employment_type}</div>
                <div><strong>{texts[lang].jobCategory}:</strong> {selectedJob.job_category}</div>
                <div><strong>{texts[lang].postedBy}:</strong> {selectedJob.posted_by}</div>
              </div>
            </div>
            
            <div className="modal-section">
              <h3>{texts[lang].jobDetails}</h3>
              <div><strong>{texts[lang].jobDescription}:</strong> {selectedJob.job_description}</div>
              <div><strong>{texts[lang].responsibilities}:</strong> {selectedJob.responsibilities}</div>
              <div><strong>{texts[lang].qualifications}:</strong> {selectedJob.qualifications}</div>
              <div><strong>{texts[lang].skills}:</strong> {selectedJob.skills}</div>
              <div><strong>{texts[lang].salaryAndBenefits}:</strong> {selectedJob.salary_and_benefits}</div>
              <div><strong>{texts[lang].howToApply}:</strong> {selectedJob.how_to_apply}</div>
              <div><strong>{texts[lang].encouragementNote}:</strong> {selectedJob.encourage_applicants}</div>
            </div>
            
            <div className="modal-section">
              <h3>{texts[lang].contactInfo}</h3>
              <div className="info-grid">
                <div><strong>{texts[lang].email}:</strong> {selectedJob.email}</div>
                <div><strong>{texts[lang].phoneNumber}:</strong> {selectedJob.phone_no}</div>
                <div><strong>{texts[lang].companyWebsite}:</strong> {selectedJob.website}</div>
              </div>
            </div>
            
            <div className="modal-section">
              <h3>{texts[lang].dates}</h3>
              <div className="info-grid">
                <div><strong>{texts[lang].postedOnLabel}:</strong> {selectedJob.posted_on}</div>
                <div><strong>{texts[lang].expiredDateLabel}:</strong> {selectedJob.expired_date}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const JOB_CATEGORIES = [
  'Architecture & Construction', 'Construction', 'Engineering', 'Accounting', 'Finance', 'Customer Service',
  'Professional Services', 'Design', 'Marketing', 'Information Technology', 'Telecommunications',
  'Community Service', 'Science & Technology', 'Business & Administration', 'Media & Journalism',
  'Advertising and Media', 'Sales', 'Management', 'Admin, Secretarial & Clerical', 'Legal',
  'Restaurant & Food Service', 'Purchasing & Procurement', 'Business Development', 'QA-Quality Control',
  'Inventory & Stock', 'Insurance', 'Economics', 'Social Science & Community',
  'Communications, PR & Journalism', 'Environment & Natural Resource', 'Hospitality-Hotel', 'Supply Chain',
  'Warehouse', 'Natural Science', 'Retail and Trade', 'Nurse', 'Logistics, Transport & Supply Chain',
  'Human Resources', 'Development & Project Management', 'Training', 'Installation & Repair', 'Education',
  'Health Care', 'Agriculture and Food', 'General Business', 'Research', 'Consultancy & Training',
  'Travel & Tourism', 'Manufacturing', 'Maintenance', 'Distribution-Shipping'
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer'];

const LOCATIONS = [
  "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar", "Hawassa", "Jimma", "Harar",
  "Arba Minch", "Dessé", "Shashamane", "Adama (Nazret)", "Debre Birhan", "Nekemte",
  "Bishoftu (Debre Zeit)", "Assosa", "Dilla", "Hosaena", "Kombolcha", "Wolaita Sodo"
];

const JobPostForm = ({ lang = 'en' }) => {
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email?.toLowerCase() || '';
  const jobsKey = `userJobPosts_${userEmail}`;
  const countKey = `jobPostCount_${userEmail}`;

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_logo: null,
    location: '',
    employment_type: '',
    job_category: '',
    no_of_employees: '',
    posted_by: '',
    job_description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    salary_and_benefits: '',
    how_to_apply: '',
    encourage_applicants: '',
    min_salary: '',
    max_salary: '',
    phone_no: '',
    email: currentUser?.email || '',
    website: '',
    posted_on: new Date().toISOString().split('T')[0],
    expired_date: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationOptions, setShowLocationOptions] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (userEmail) {
      setJobs(JSON.parse(localStorage.getItem(jobsKey) || '[]'));
    }
  }, [userEmail, jobsKey]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: currentUser?.email || ''
    }));
  }, [currentUser]);

  useEffect(() => {
    fetchLocations()
      .then(data => {
        // Defensive: always set as array
        if (Array.isArray(data)) setLocations(data);
        else if (data && Array.isArray(data.results)) setLocations(data.results);
        else setLocations([]);
      })
      .catch(() => setLocations([]));
  }, []);

  const filteredCategories = JOB_CATEGORIES.filter(cat =>
    cat.toLowerCase().startsWith(categoryInput.toLowerCase())
  );

  // Defensive: always filter on array
  const filteredLocations = Array.isArray(locations)
    ? locations.filter(loc =>
        loc.name.toLowerCase().includes(locationInput.toLowerCase())
      )
    : [];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      'job_title', 'company_name', 'email', 'location', 'job_category',
      'posted_by', 'job_description', 'responsibilities', 'qualifications',
      'skills', 'how_to_apply', 'posted_on', 'expired_date', 'phone_no'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setSubmitError(`${field.replace('_', ' ')} is required.`);
        return false;
      }
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      job_title: '',
      company_name: '',
      company_logo: null,
      location: '',
      employment_type: '',
      job_category: '',
      no_of_employees: '',
      posted_by: '',
      job_description: '',
      responsibilities: '',
      qualifications: '',
      skills: '',
      salary_and_benefits: '',
      how_to_apply: '',
      encourage_applicants: '',
      min_salary: '',
      max_salary: '',
      phone_no: '',
      email: currentUser?.email || '',
      website: '',
      posted_on: new Date().toISOString().split('T')[0],
      expired_date: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!validateForm()) return;
    setIsSubmitting(true);

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const csrfToken = getCookie('csrftoken');

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== '') {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/jobposting/posts/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Please correct the form errors');
      }

      setSubmitSuccess(true);
      setIsReviewing(false);

      if (userEmail) {
        let updatedJobs = [...jobs, { ...formData, id: Date.now() }];
        localStorage.setItem(jobsKey, JSON.stringify(updatedJobs));
        setJobs(updatedJobs);

        let count = Number(localStorage.getItem(countKey)) || 0;
        localStorage.setItem(countKey, count + 1);
      }
      resetForm();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, job_category: categoryInput }));
  }, [categoryInput]);

  return (
    <div className="job-post-container">
      <UserJobHistory userEmail={userEmail} jobs={jobs} setJobs={setJobs} lang={lang} />
      
      <div className="form-container">
        {isReviewing ? (
          <div className="review-container">
            <h2 className="review-title">{texts[lang].review}</h2>
            
            <div className="review-section">
              <h3>{texts[lang].basicInfo}</h3>
              <div className="review-grid">
                <div><strong>{texts[lang].jobTitle}:</strong> {formData.job_title}</div>
                <div><strong>{texts[lang].companyName}:</strong> {formData.company_name}</div>
                <div><strong>{texts[lang].location}:</strong> {formData.location}</div>
                <div><strong>{texts[lang].employmentType}:</strong> {formData.employment_type}</div>
                <div><strong>{texts[lang].jobCategory}:</strong> {formData.job_category}</div>
                <div><strong>{texts[lang].noOfEmployees}:</strong> {formData.no_of_employees}</div>
              </div>
            </div>
            
            <div className="review-section">
              <h3>{texts[lang].jobDetails}</h3>
              <div><strong>{texts[lang].jobDescription}:</strong> {formData.job_description}</div>
              <div><strong>{texts[lang].responsibilities}:</strong> {formData.responsibilities}</div>
              <div><strong>{texts[lang].qualifications}:</strong> {formData.qualifications}</div>
              <div><strong>{texts[lang].skills}:</strong> {formData.skills}</div>
              <div><strong>{texts[lang].salaryAndBenefits}:</strong> {formData.salary_and_benefits}</div>
              <div><strong>{texts[lang].howToApply}:</strong> {formData.how_to_apply}</div>
              <div><strong>{texts[lang].encouragementNote}:</strong> {formData.encourage_applicants}</div>
            </div>
            
            <div className="review-section">
              <h3>{texts[lang].contactInfo}</h3>
              <div className="review-grid">
                <div><strong>{texts[lang].phoneNumber}:</strong> {formData.phone_no}</div>
                <div><strong>{texts[lang].email}:</strong> {formData.email}</div>
                <div><strong>{texts[lang].companyWebsite}:</strong> {formData.website}</div>
              </div>
            </div>
            
            <div className="review-section">
              <h3>{texts[lang].dates}</h3>
              <div className="review-grid">
                <div><strong>{texts[lang].postedOn}:</strong> {formData.posted_on}</div>
                <div><strong>{texts[lang].expiredDate}:</strong> {formData.expired_date}</div>
              </div>
            </div>
            
            {submitError && <div className="error-message">{submitError}</div>}
            
            <div className="review-actions">
              <button
                type="button"
                className="edit-btn"
                onClick={() => setIsReviewing(false)}
                disabled={isSubmitting}
              >
                {texts[lang].edit}
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? texts[lang].posting : texts[lang].confirm}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (validateForm()) {
                setIsReviewing(true);
              }
            }}
            encType="multipart/form-data"
            className="job-post-form"
          >
            <div className="form-section">
              <h3 className="section-title">{texts[lang].basicInfo}</h3>
              
              <div className="form-group">
                <label>{texts[lang].jobTitle} <span className="required">*</span></label>
                <input
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].companyName} <span className="required">*</span></label>
                  <input
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].companyLogo}</label>
                  <input
                    type="file"
                    name="company_logo"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].location} <span className="required">*</span></label>
                  <div className="dropdown-container" style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder={lang === 'am' ? 'ቦታ ይፈልጉ...' : 'Type or select location...'}
                      value={locationInput}
                      onChange={e => {
                        setLocationInput(e.target.value);
                        setShowLocationOptions(true);
                      }}
                      onFocus={() => setShowLocationOptions(true)}
                      required
                      className="styled-select"
                      autoComplete="off"
                    />
                    {showLocationOptions && (
                      <div className="dropdown-options" style={{
                        position: "absolute", zIndex: 10, background: "#fff", width: "100%", border: "1px solid #ccc", maxHeight: "180px", overflowY: "auto"
                      }}>
                        {filteredLocations.map(loc => (
                          <div
                            key={loc.id}
                            className="dropdown-option"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, location: loc.name }));
                              setLocationInput(loc.name);
                              setShowLocationOptions(false);
                            }}
                          >
                            {loc.name}
                          </div>
                        ))}
                        {locationInput && !locations.some(l => l.name.toLowerCase() === locationInput.toLowerCase()) && (
                          <div
                            className="dropdown-option add-new"
                            style={{ color: "#0078d4", fontWeight: 600 }}
                            onClick={async () => {
                              try {
                                const newLoc = await addLocation(locationInput);
                                setLocations(prev => [...prev, newLoc]);
                                setFormData(prev => ({ ...prev, location: newLoc.name }));
                                setLocationInput(newLoc.name);
                                setShowLocationOptions(false);
                                alert(lang === 'am' ? 'ቦታ በተሳካ ሁኔታ ታይቷል!' : 'Location added successfully!');
                              } catch (e) {
                                alert(e.message || (lang === 'am'
                                  ? 'ቦታ ማከል አልተቻለም። እባክዎ ደግመው ይሞክሩ።'
                                  : 'Failed to add location. Please try again.'));
                              }
                            }}
                          >
                            {lang === 'am' ? `አዲስ ቦታ ያክሉ: "${locationInput}"` : `Add new: "${locationInput}"`}
                          </div>
                        )}
                        {filteredLocations.length === 0 && !locationInput && (
                          <div className="dropdown-option no-match">
                            {lang === 'am' ? 'ምንም አልተገኘም' : 'No match found'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].employmentType}</label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                  >
                    <option value="">{`-- ${texts[lang].employmentType} --`}</option>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].jobCategory} <span className="required">*</span></label>
                  <div className="dropdown-container" style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder={lang === 'am' ? 'ምድብ ይፈልጉ...' : 'Type or select category...'}
                      value={categoryInput}
                      onChange={e => {
                        setCategoryInput(e.target.value);
                        setShowCategoryOptions(true);
                      }}
                      onFocus={() => setShowCategoryOptions(true)}
                      required
                      className="styled-select"
                      autoComplete="off"
                    />
                    {showCategoryOptions && (
                      <div className="dropdown-options" style={{
                        position: "absolute", zIndex: 10, background: "#fff", width: "100%", border: "1px solid #ccc", maxHeight: "180px", overflowY: "auto"
                      }}>
                        {filteredCategories.map(cat => (
                          <div
                            key={cat}
                            className="dropdown-option"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, job_category: cat }));
                              setCategoryInput(cat);
                              setShowCategoryOptions(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                        {filteredCategories.length === 0 && (
                          <div className="dropdown-option no-match">
                            {lang === 'am' ? 'ምንም አልተገኘም' : 'No match found'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].noOfEmployees}</label>
                  <input
                    name="no_of_employees"
                    value={formData.no_of_employees}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">{texts[lang].jobDetails}</h3>
              
              <div className="form-group">
                <label>{texts[lang].jobDescription} <span className="required">*</span></label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>{texts[lang].responsibilities} <span className="required">*</span></label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>{texts[lang].qualifications} <span className="required">*</span></label>
                <textarea
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>{texts[lang].skills} <span className="required">*</span></label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>{texts[lang].salaryAndBenefits}</label>
                <textarea
                  name="salary_and_benefits"
                  value={formData.salary_and_benefits}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].minSalary}</label>
                  <input
                    name="min_salary"
                    value={formData.min_salary}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].maxSalary}</label>
                  <input
                    name="max_salary"
                    value={formData.max_salary}
                    onChange={handleChange}
                    type="number"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>{texts[lang].howToApply} <span className="required">*</span></label>
                <textarea
                  name="how_to_apply"
                  value={formData.how_to_apply}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>
              
              <div className="form-group">
                <label>{texts[lang].encouragementNote}</label>
                <input
                  name="encourage_applicants"
                  value={formData.encourage_applicants}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">{texts[lang].contactInfo}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].postedBy} <span className="required">*</span></label>
                  <input
                    name="posted_by"
                    value={formData.posted_by}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].phoneNumber} <span className="required">*</span></label>
                  <input
                    name="phone_no"
                    type="tel"
                    value={formData.phone_no}
                    onChange={handleChange}
                    required
                    pattern="^\+?\d{10,15}$"
                    title={lang === 'am' ? 'የስልክ ቁጥር አስገባ (10-15 አሃዞች)' : 'Enter a valid phone number (10-15 digits)'}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].email} <span className="required">*</span></label>
                  <input
                    name="email"
                    value={formData.email}
                    readOnly
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].companyWebsite}</label>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    type="url"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">{texts[lang].dates}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{texts[lang].postedOn} <span className="required">*</span></label>
                  <input
                    type="date"
                    name="posted_on"
                    value={formData.posted_on}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>{texts[lang].expiredDate} <span className="required">*</span></label>
                  <input
                    type="date"
                    name="expired_date"
                    value={formData.expired_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="form-footer">
              <p className="required-note">{texts[lang].requiredField}</p>
              
              {submitError && <div className="error-message">{submitError}</div>}
              {submitSuccess && <div className="success-message">{texts[lang].jobPosted}</div>}
              
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {texts[lang].reviewAndPost}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobPostForm;

