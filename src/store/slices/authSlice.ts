import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  bannerUrl?: string;
  bio?: string;
  provider?: string;
  password?: string;
  hasPassword?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isVerifying: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  isVerifying: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", credentials);
      // console.log(response);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/signup", userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  },
);

// Fetch current authenticated user profile
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (token: string, { rejectWithValue }) => {
    try {
      // Temporarily set the token in axios headers for this request
      const response = await axiosClient.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data: Partial<User> | FormData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("/auth/profile", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

// Update user password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("/auth/password", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update password",
      );
    }
  },
);

// Delete account
export const deleteAccount = createAsyncThunk(
  "auth/deleteAccount",
  async (password: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete("/auth/account", {
        data: { password },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete account",
      );
    }
  },
);

// Disable account
export const disableAccount = createAsyncThunk(
  "auth/disableAccount",
  async (password: string | undefined, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/account/disable", {
        password,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to disable account",
      );
    }
  },
);

// Verify OTP for email verification
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/verify-otp", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to verify OTP",
      );
    }
  },
);

// Resend OTP for email verification
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/send-otp", { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to resend OTP",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      // console.log(action)
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log(action)
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
        // Signup now only creates account and sends OTP
        // User and token will be set after OTP verification
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Me (for social login)
      .addCase(fetchMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // The token was passed as argument and already stored in localStorage by AuthSuccessPage
        // We need to also set it in Redux state
        state.token = action.meta.arg; // action.meta.arg contains the token passed to fetchMe
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // If fetching user fails, clear the token too
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isVerifying = false;
        // OTP verification successful - user is now verified
        // The backend returns user and token after successful verification
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload as string;
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
