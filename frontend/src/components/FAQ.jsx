import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How can I post a job on your website?",
      answer: "To post a job, fill out our job posting request form with your company details and job information. Our team will review your request and contact you to finalize the posting. You can also reach us via email or Telegram you can fill forms in contact page for job posting inquiries."
    },
    {
      question: "What information do I need to provide when posting a job?",
      answer: "You'll need to provide: company name, contact person details, job title, detailed description, requirements, location, employment type, and salary range (optional). The more detailed information you provide, the better responses you'll receive."
    },
    {
      question: "How long does it take to get a job posting approved?",
      answer: "We typically review and process job posting requests within 24-48 hours. Once approved, your job will be published immediately and remain active for 30 days unless specified otherwise."
    },
    {
      question: "Is there a fee for posting jobs?",
      answer: "Please contact our team for current pricing information. We offer flexible packages for single job posts and bulk posting options for companies with multiple positions."
    },
    {
      question: "Can I edit my job posting after it's published?",
      answer: "Yes, you can request updates to your job posting by contacting our support team. We'll help you make any necessary changes to ensure your posting remains accurate and effective."
    },
    {
      question: "How do I receive applications from candidates?",
      answer: "Applications will be forwarded to the email address you provide in your job posting. You can also access them through your employer dashboard once your account is set up."
    },
    {
      question: "What makes a good job posting?",
      answer: "A good job posting includes: clear job title, detailed responsibilities, specific requirements, location details, employment type, salary range (recommended), and company culture information. Be specific about what you're looking for in candidates."
    },
    {
      question: "How can I make my job posting stand out?",
      answer: "Highlight unique benefits, company culture, and growth opportunities. Use clear, engaging language and be specific about requirements and responsibilities. Including salary range typically increases candidate response."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-content">
        <div className="faq-header">
          <div className="header-icon-wrapper">
            <HelpCircle className="header-icon" />
            <h1>Frequently Asked Questions</h1>
          </div>
          <p className="header-subtext">
            Find answers to common questions about using our job board
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
              >
                <div className="question-content">
                  <span className="question-number">{index + 1}</span>
                  <span className="question-text">{faq.question}</span>
                </div>
                {openIndex === index ? (
                  <ChevronUp className="chevron-icon" />
                ) : (
                  <ChevronDown className="chevron-icon" />
                )}
              </button>
              
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Still have questions?</h3>
          <p>Our support team is here to help you</p>
          <div className="contact-buttons">
          <a href="mailto:beyeberueyayu@gmail.com" className="email-button">
  <Mail className="button-icon" />
  Email Support
</a>

            <a
              href="https://t.me/beyuDav"
              className="telegram-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="telegram-icon" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.57-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              Telegram Chat
            </a>

            <a
              href="https://t.me/Afrijob2716"
              className="telegram-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="telegram-icon" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.57-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
              Telegram Group
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;