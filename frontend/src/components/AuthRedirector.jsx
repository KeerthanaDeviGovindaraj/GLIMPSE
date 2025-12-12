import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * AuthRedirector Component
 * Redirects authenticated users away from public pages (like login)
 * to the appropriate dashboard based on their role
 */
const AuthRedirector = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "analyst") {
        navigate("/analyst/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Show children only if user is not authenticated
  return !isAuthenticated ? children : null;
};

export default AuthRedirector;
