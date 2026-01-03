import { api, API_BASE_URL } from "@/lib/api";

export const authService = {
  login: async (data: any) => {
    return api.post("/auth/login", data);
  },

  signup: async (data: any) => {
    return api.post("/auth/signup", data);
  },

  getSocialLoginUrl: (provider: "google" | "github" | "facebook") => {
    return `${API_BASE_URL}/auth/${provider}`;
  },
};
