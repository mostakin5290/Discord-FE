import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

/**
 * Validates if a JWT token is valid and not expired
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    if (decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    // Token is malformed or invalid
    return false;
  }
};

/**
 * Clears authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 */
export const isStrongPassword = (password: string): boolean => {
  if (password.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Get password strength message
 */
export const getPasswordStrengthMessage = (password: string): string => {
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter";
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number";
  return "";
};

/**
 * Validates username format
 */
export const isValidUsername = (username: string): boolean => {
  // Username should be 3-20 characters, alphanumeric with underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};
