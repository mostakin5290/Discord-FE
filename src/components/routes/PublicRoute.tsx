import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const PublicRoute = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  if (token) {
    return <Navigate to="/channels/@me" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
