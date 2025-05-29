import { signInWithPopup, auth, provider } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      localStorage.setItem('savr-user', JSON.stringify(userData));
      navigate('/chat');
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-full shadow transition-all text-sm"
    >
      Login
    </button>
  );
};

export default GoogleLoginButton;