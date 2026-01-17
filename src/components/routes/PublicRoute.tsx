import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchUserServers } from "@/store/slices/serverSlice";
import type { AnyAction } from "@reduxjs/toolkit";
import LoadingSpinner from "../dashboard/LoadingSpinner";

const PublicRoute = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { servers, isLoading } = useSelector(
    (state: RootState) => state.server
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchUserServers() as unknown as AnyAction);
    }
  }, [dispatch, token]);

  // Show loading while fetching servers for authenticated user
  if (token && isLoading) {
    return (
      <div className="flex h-screen bg-[#313338]">
        <LoadingSpinner message="Loading your servers..." />
      </div>
    );
  }

  // Redirect authenticated users to their first server
  if (token && servers && servers.length > 0) {
    return <Navigate to={`/server/${servers[0].id}`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
