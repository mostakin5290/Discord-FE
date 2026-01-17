import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { fetchMe } from "@/store/slices/authSlice";
import { afterSignInUrl } from "@/constants/data";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // First, store the token in localStorage
      localStorage.setItem("token", token);

      // Then fetch the user profile using the token
      dispatch(fetchMe(token))
        .unwrap()
        .then(() => {
          navigate(afterSignInUrl);
        })
        .catch((error) => {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("token");
          navigate("/login?error=auth_failed");
        });
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
