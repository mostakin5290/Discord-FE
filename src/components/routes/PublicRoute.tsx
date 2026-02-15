import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import { useEffect, useState } from "react";
import { logout } from "@/store/slices/authSlice";
import { isTokenValid, clearAuthData } from "@/utils/authGuard";
import LoadingSpinner from "../shared/LoadingSpinner";

const PublicRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [validatingToken, setValidatingToken] = useState(true);

  useEffect(() => {
    // Validate token on mount and route change
    if (token) {
      if (!isTokenValid(token)) {
        // Token is invalid or expired, clear auth data
        clearAuthData();
        dispatch(logout());
        setValidatingToken(false);
        return;
      }
    }
    setValidatingToken(false);
  }, [dispatch, token, location.pathname]);

  // Show loading while validating token or fetching servers
  if (validatingToken || (token && !user)) {
    return (
      <div className="flex h-screen bg-[#313338]">
        <LoadingSpinner message="Validating session..." />
      </div>
    );
  }

  // If token is valid and user is authenticated, redirect to dashboard
  if (token && user && isTokenValid(token)) {
    return <Navigate to="/channels/@me" replace />;
  }

  // Allow access to public routes
  return <Outlet />;
};

export default PublicRoute;
