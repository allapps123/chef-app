import { useState } from 'react';
import { signInWithPopup, auth, provider } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import GlobalLoading from '../../components/GlobalLoading';
import axios from 'axios';

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken();

      const userData = {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      };
      localStorage.setItem('savr-user', JSON.stringify(userData));

      await axios.post(
        `${import.meta.env.VITE_DEV_URL}/user-preference/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      navigate('/chat');
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <GlobalLoading />}
      <button
        onClick={handleLogin}
        className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-full shadow transition-all text-sm"
      >
        Login
      </button>
    </>
  );
};

export default GoogleLoginButton;
