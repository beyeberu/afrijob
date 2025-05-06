import { Link } from 'react-router-dom';
import './Footer.css';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-about">
            <Link to="/" className="footer-logo">AfriJob</Link>
            <p className="footer-about-text">
              Connecting talent with opportunity across Africa
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-list">
                <li><Link to="/faq">FAQ</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-list">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="#">Email: beyeberueyayu@gmail.com</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Legal</h3>
              <ul className="footer-list">
                <li><Link to="/terms">Terms</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-social">
            <a
              href="https://web.facebook.com/profile.php?id=100079080591147"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <TwitterIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/beyeberu-eyayu-55b77b35b/overlay/about-this-profile/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BJLsT%2FFC4T0m2p9YPRtyvug%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://t.me/beyuDav"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <TelegramIcon />
            </a>
          </div>

          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} AfriJob. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
