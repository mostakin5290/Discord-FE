import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // NOTE: In a real app we might want to decode the token to get the user or fetch it
      // For now, we reuse the existing local storage pattern or partial data if available.
      // Since social login doesn't give us the user object in the URL params usually (just token),
      // we might need a separate 'fetchMe' thunk. 
      // For this step, we'll blindly set the token.
      
      const user = { id: "", email: "", username: "" }; // Placeholder until we fetch profile
      dispatch(setCredentials({ user, token })); 
      navigate("/channels/@me");
    } else {
      navigate("/login?error=auth_failed");
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#131725] text-white">
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthSuccessPage;
