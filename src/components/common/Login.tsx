import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_CLIENT_ID = "GOOGLE_CLIENT_ID"; // replace later

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const tokenClientRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google || tokenClientRef.current) return;

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email',
      callback: (tokenResponse: any) => {
        fetchUserInfo(tokenResponse.access_token);
      }
    });
  }, []);

  const fetchUserInfo = async (accessToken: string) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profile = await res.json();
    localStorage.setItem('savr-user', JSON.stringify(profile));
    navigate('/chat');
  };

  const handleLoginClick = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    }
  };

  return (
    <button
      onClick={handleLoginClick}
      className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-5 py-2 rounded-full shadow transition-all text-sm"
    >
      Login
    </button>
  );
};

export default GoogleLoginButton;