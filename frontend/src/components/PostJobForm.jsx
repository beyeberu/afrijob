// JobPostForm.jsx

import React, { useState, useEffect } from 'react';
import {
  Upload, Briefcase, MapPin, Users, CheckCircle, XCircle
} from 'lucide-react';
import './JobPostForm.css';

const JobPostForm = () => {
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
    email: '',
    website: '',
    posted_on: new Date().toISOString().split('T')[0],
    expired_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [csrfToken, setCsrfToken] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/jobposting/csrf_token/', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(() => {
        setSubmitError('Could not fetch CSRF token. Try refreshing.');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFieldErrors(prev => ({ ...prev, company_logo: 'Only image files are allowed.' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, company_logo: 'Max file size is 2MB.' }));
        return;
      }
      setFormData(prev => ({ ...prev, company_logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['job_title', 'company_name', 'location', 'employment_type', 'job_category', 'job_description', 'responsibilities', 'qualifications', 'email'];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }

    if (formData.min_salary && formData.max_salary && parseFloat(formData.min_salary) > parseFloat(formData.max_salary)) {
      errors.max_salary = 'Max salary must be higher than min salary';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
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
      email: '',
      website: '',
      posted_on: new Date().toISOString().split('T')[0],
      expired_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setLogoPreview(null);
    setFieldErrors({});
    setSubmitSuccess(false);
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetch('http://127.0.0.1:8000/api/jobposting/posts/', {
        method: 'POST',
        body: formDataToSend,
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        throw new Error(result.message || 'Submission failed');
      }

      setSubmitSuccess(true);
      resetForm();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Volunteer'];
  const jobCategories = ['IT', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Engineering', 'Design', 'Customer Service'];

  return (
    <div className="job-post-container">
      <h1 className="section-title">
        <Briefcase className="mr-2" /> Post a New Job
      </h1>

      {submitSuccess && <div className="success-message"><CheckCircle /> Job posted successfully!</div>}
      {submitError && <div className="error-message"><XCircle /> {submitError}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Example Input */}
        <div className={`form-group ${fieldErrors.job_title ? 'error' : ''}`}>
          <label>Job Title *</label>
          <input type="text" name="job_title" value={formData.job_title} onChange={handleChange} />
          {fieldErrors.job_title && <span className="error-text">{fieldErrors.job_title}</span>}
        </div>

        {/* Other Inputs similar... */}
        {/* You can copy structure for company_name, company_logo, location, employment_type, etc. */}

        <button type="submit" disabled={isSubmitting} className="submit-btn">
          {isSubmitting ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};

export default JobPostForm;
