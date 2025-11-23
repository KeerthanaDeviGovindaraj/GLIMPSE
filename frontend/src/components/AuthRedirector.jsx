import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext.jsx';

const publicPaths = ['/login', '/'];

export default function AuthRedirector() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isPublic = publicPaths.includes(location.pathname);

    if (!isAuthed && !isPublic) {
      navigate('/login');
    }
  }, [isAuthed, location.pathname, navigate]);

  return null;
}
