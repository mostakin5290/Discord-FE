export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { valid: true };
};

export const validateUsername = (
  username: string,
): { valid: boolean; message?: string } => {
  if (username.length < 3) {
    return {
      valid: false,
      message: "Username must be at least 3 characters long",
    };
  }
  if (username.length > 30) {
    return { valid: false, message: "Username cannot exceed 30 characters" };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return {
      valid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }
  return { valid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string,
): { valid: boolean; message?: string } => {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
};

export const validateServerName = (
  name: string,
): { valid: boolean; message?: string } => {
  if (name.length < 2) {
    return {
      valid: false,
      message: "Server name must be at least 2 characters long",
    };
  }
  if (name.length > 50) {
    return { valid: false, message: "Server name cannot exceed 50 characters" };
  }
  return { valid: true };
};

export const validateChannelName = (
  name: string,
): { valid: boolean; message?: string } => {
  if (name.length < 1) {
    return { valid: false, message: "Channel name is required" };
  }
  if (name.length > 100) {
    return {
      valid: false,
      message: "Channel name cannot exceed 100 characters",
    };
  }
  return { valid: true };
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateOtp = (
  otp: string,
): { valid: boolean; message?: string } => {
  if (otp.length !== 6) {
    return { valid: false, message: "OTP must be 6 digits" };
  }
  if (!/^\d+$/.test(otp)) {
    return { valid: false, message: "OTP must contain only numbers" };
  }
  return { valid: true };
};
