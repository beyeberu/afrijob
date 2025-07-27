import React from 'react';
import { FaExternalLinkAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaInfoCircle, FaTelegramPlane } from 'react-icons/fa';
import './Contact.css';
import TelegramIcon from '@mui/icons-material/Telegram';

// Add this texts object at the top
const texts = {
  en: {
    getInTouch: "Get In Touch",
    help: "We're here to help you with your job posting needs",
    submitJob: "Submit a Job Posting",
    submitDesc: "Companies can easily submit job openings through our online form. Your submission will be reviewed and posted within 24 hours.",
    howToSubmit: "How to submit:",
    steps: [
      "Click the link below to access our job posting form",
      "Fill out all required fields with accurate information",
      "Include detailed job description and requirements",
      "Provide valid contact information",
      "Submit the form for review"
    ],
    goToForm: "Go to Job Posting Form",
    importantNotes: "Important Notes:",
    notes: [
      "All fields marked with * are required",
      "Job postings typically go live within 24 hours of submission",
      "You'll receive a confirmation email when your posting is approved",
      "For urgent postings, please contact us directly after submitting"
    ],
    contactInfo: "Contact Information",
    needHelp: "Need help with your submission or have other questions?",
    emailUs: "Email Us",
    emailDesc: "For general inquiries and For job posting support:",
    callUs: "Call Us",
    phone: "phone no:",
    messageUs: "Message Us",
    telegram: "Telegram:",
    group: "Or  Our Group:",
    location: "Location",
    address: "Gondar Etiopia",
    businessHours: "Business Hours",
    mondayFriday: "Monday-Friday: 8:00 AM - 6:00 PM",
    saturday: "Saturday: 9:00 AM - 2:00 PM",
    sunday: "Sunday: Closed",
    faq: "Frequently Asked Questions",
    faq1q: "How long does it take to approve a job posting?",
    faq1a: "Most postings are reviewed and approved within 24 hours of submission. During peak times, it may take up to 48 hours.",
    faq2q: "Can I edit my job posting after submission?",
    faq2a: "Yes, please email us at beyeberueyayu@gmail.com with your posting name, Job Title, posted date and the changes you'd like to make.",
    faq3q: "Is there a cost to post jobs on your platform?",
    faq3a: "Basic job postings are free. We also offer featured listings and form placement options for a fee."
  },
  am: {
    getInTouch: "ያግኙን",
    help: "የስራ ማስተዋወቅያዎን ለማግኘት እና ለማስተዋወቅ እናገርዎታለን",
    submitJob: "የስራ ማስተዋወቅያ ያስገቡ",
    submitDesc: "ኩባንያዎች በመስመር ላይ ቅጽ በመሙላት ቀላል ስራ ማስተዋወቅያ ማስገባት ይችላሉ። ስራዎ በ24 ሰዓታት ውስጥ ይገባል።",
    howToSubmit: "እንዴት ማስገባት እንደሚቻል:",
    steps: [
      "የስራ ማስተዋወቅያ ቅጹን ለማግኘት ከታች ያለውን አገናኝ ይጫኑ",
      "ሁሉንም የተጠየቁ መረጃዎች በትክክል ይሙሉ",
      "ዝርዝር የስራ መግለጫና መስፈርቶች ያካትቱ",
      "ትክክለኛ የእውቂያ መረጃ ያስገቡ",
      "ቅጹን ለእውቅና ያስገቡ"
    ],
    goToForm: "የስራ ማስተዋወቅያ ቅጽ ይጎብኙ",
    importantNotes: "አስፈላጊ ማስታወቂያዎች:",
    notes: [
      "ሁሉም በ* የተሰየመ መረጃ አስፈላጊ ነው",
      "ስራዎች በተለምዶ በ24 ሰዓታት ውስጥ ይታያሉ",
      "ማስተዋወቅያዎ ሲጸደቅ የማረጋገጫ ኢሜይል ይቀበላሉ",
      "አስቸኳይ ስራዎች ከተላኩ በኋላ በቀጥታ ያግኙን"
    ],
    contactInfo: "የእውቂያ መረጃ",
    needHelp: "ለማስገባት እርዳታ ወይም ሌሎች ጥያቄዎች ካሉዎት ያግኙን",
    emailUs: "ኢሜይል ይላኩልን",
    emailDesc: "ለአጠቃላይ ጥያቄዎች እና ለስራ ማስተዋወቅያ ድጋፍ:",
    callUs: "ይደውሉልን",
    phone: "ስልክ ቁጥር:",
    messageUs: "መልእክት ይላኩልን",
    telegram: "ቴሌግራም:",
    group: "ወይም ቡድናችን:",
    location: "አድራሻ",
    address: "ጎንደር ኢትዮጵያ",
    businessHours: "የስራ ሰዓት",
    mondayFriday: "ሰኞ-አርብ: 2:00 ጠዋት - 12:00 ከሰዓት",
    saturday: "ቅዳሜ: 3:00 ጠዋት - 8:00 ከሰዓት",
    sunday: "እሁድ: ዝግ ነው",
    faq: "ተደጋጋሚ ጥያቄዎች",
    faq1q: "የስራ ማስተዋወቅያ ለማጽደቅ ምን ያህል ጊዜ ይወስዳል?",
    faq1a: "ብዙ ስራዎች በ24 ሰዓታት ውስጥ ይጸደቃሉ። በተጨናነቀ ጊዜ እስከ 48 ሰዓታት ይወስዳል።",
    faq2q: "ስራዬን ከማስገባት በኋላ ማስተካከል እችላለሁ?",
    faq2a: "አዎን፣ በኢሜይል beyeberueyayu@gmail.com የስራዎን ስም፣ የስራ ርዕስ፣ የተሰጠበት ቀን እና የሚፈልጉትን ለውጦች ይላኩልን።",
    faq3q: "በመድረኩ ላይ ስራ ማስተዋወቅያ ለማስገባት ዋጋ አለ?",
    faq3a: "መደበኛ ስራ ማስተዋወቅያ ነፃ ነው። የተለየ ማስተዋወቅያ እና በቅጽ ላይ ማቅረብ በክፍያ ይሆናል።"
  }
};

// Accept lang as a prop
const ContactPage = ({ lang = 'en' }) => {
  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>{texts[lang].getInTouch}</h1>
        <p>{texts[lang].help}</p>
      </div>

      <div className="contact-sections">
        {/* Job Posting Submission Section */}
        <div className="contact-card highlight-card">
          <div className="card-icon">
            <FaInfoCircle />
          </div>
          <h2>{texts[lang].submitJob}</h2>
          <p className="card-description">
            {texts[lang].submitDesc}
          </p>
          
          <div className="submission-instructions">
            <h3>{texts[lang].howToSubmit}</h3>
            <ol>
              {texts[lang].steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            
            <a 
              href="http://localhost:5173/jobpostform" 
              target="_self" 
              rel="noopener noreferrer"
              className="form-link-button"
            >
              {texts[lang].goToForm} <FaExternalLinkAlt className="link-icon" />
            </a>
            
            <div className="form-notes">
              <h4>{texts[lang].importantNotes}</h4>
              <ul>
                {texts[lang].notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* General Contact Information */}
        <div className="contact-card">
          <h2>{texts[lang].contactInfo}</h2>
          <p>{texts[lang].needHelp}</p>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaEnvelope />
            </div>
            <div className="method-details">
              <h3>{texts[lang].emailUs}</h3>
              <p>{texts[lang].emailDesc} <a href="mailto:beyeberueyayu@gmail.com">beyeberueyayu@gmail.com</a> </p>
            </div>
          </div>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaPhone />
            </div>
            <div className="method-details">
              <h3>{texts[lang].callUs}</h3>
              <p>{texts[lang].phone} <a href="tel:+15551234567">+251941889430</a></p>
            </div>
          </div>



          <div className="contact-method">
  <div className="method-icon">
    <FaTelegramPlane />
  </div>
  <div className="method-details">
    <h3>{texts[lang].messageUs}</h3>
    <p>{texts[lang].telegram} <a href="https://t.me/beyuDav" target="_blank" rel="noopener noreferrer">@beyuDav</a></p>
    <p>{texts[lang].group} <a href="https://t.me/Afrijob2716" target="_blank" rel="noopener noreferrer">afrijob</a></p>
  </div>
</div>

          
          <div className="contact-method">
            <div className="method-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="method-details">
              <h3>{texts[lang].location}</h3>
              <p>{texts[lang].address}</p>
              
            </div>
          </div>
          
          <div className="contact-method">
            <div className="method-icon">
              <FaClock />
            </div>
            <div className="method-details">
              <h3>{texts[lang].businessHours}</h3>
              <p>{texts[lang].mondayFriday}</p>
              <p>{texts[lang].saturday}</p>
              <p>{texts[lang].sunday}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="faq-section">
        <h2>{texts[lang].faq}</h2>
        <div className="faq-item">
          <h3>{texts[lang].faq1q}</h3>
          <p>{texts[lang].faq1a}</p>
        </div>
        <div className="faq-item">
          <h3>{texts[lang].faq2q}</h3>
          <p>{texts[lang].faq2a}</p>
        </div>
        <div className="faq-item">
          <h3>{texts[lang].faq3q}</h3>
          <p>{texts[lang].faq3a}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;