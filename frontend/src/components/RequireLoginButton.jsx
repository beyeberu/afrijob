import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RequireLoginButton = ({ children, onClick, ...rest }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      alert('You must be logged in to do this action.');
      navigate('/login');
    } else {
      onClick();
    }
  };

  return (
    <button {...rest} onClick={handleClick}>
      {children}
    </button>
  );
};

export default RequireLoginButton;
