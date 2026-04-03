import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();  // ✅ we'll expose this

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // ✅ Store in localStorage so api.js interceptor picks it up
      localStorage.setItem('token', token);
      // Clean URL then re-check auth
      window.history.replaceState({}, document.title, '/');
      checkAuthStatus().then(() => navigate('/', { replace: true }));
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center font-nunito">
      <p className="text-[#3b5bdb] font-bold text-lg">Completing login...</p>
    </div>
  );
}