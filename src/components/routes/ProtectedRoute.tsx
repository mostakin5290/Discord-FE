import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import { useEffect, useState } from "react";
import { logout } from "@/store/slices/authSlice";
import { isTokenValid, clearAuthData } from "@/utils/authGuard";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      // Check if token exists
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      // Validate token
      if (!isTokenValid(token)) {
        // Token is invalid or expired
        clearAuthData();
        dispatch(logout());
        toast.error("Session expired. Please login again.");
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      // Token is valid
      setIsAuthenticated(true);
      setIsValidating(false);
    };

    validateAuth();
  }, [token, dispatch, location.pathname]);

  // Show loading spinner while validating
  if (isValidating) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#313338]">
        <div className="text-white">Validating session...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render protected content
  return <Outlet />;
};

export default ProtectedRoute;
