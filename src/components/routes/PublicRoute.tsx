import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { fetchUserServers } from "@/store/slices/serverSlice";
import { logout } from "@/store/slices/authSlice";
import LoadingSpinner from "../dashboard/LoadingSpinner";
import { isTokenValid, clearAuthData } from "@/utils/authGuard";

const PublicRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const { servers, isLoading } = useSelector(
    (state: RootState) => state.server
  );
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

      // Token is valid, fetch user servers
      dispatch(fetchUserServers());
    }
    setValidatingToken(false);
  }, [dispatch, token, location.pathname]);

  // Show loading while validating token or fetching servers
  if (validatingToken || (token && isLoading)) {
    return (
      <div className="flex h-screen bg-[#313338]">
        <LoadingSpinner message="Validating session..." />
      </div>
    );
  }

  // If token is valid and user is authenticated, redirect to dashboard
  if (token && user && isTokenValid(token)) {
    // If user has servers, redirect to first server
    if (servers && servers.length > 0) {
      return <Navigate to={`/server/${servers[0].id}`} replace />;
    }
    // If no servers, redirect to direct messages
    return <Navigate to="/channels/@me" replace />;
  }

  // Allow access to public routes
  return <Outlet />;
};

export default PublicRoute;
