import type { User } from "../types";

export const getDisplayName = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user.username;
};

export const getInitials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  return user.username.slice(0, 2).toUpperCase();
};

export const getUsernameWithTag = (user: User): string => {
  return `@${user.username}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop() || "";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const ext = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(ext);
};

export const isVideoFile = (filename: string): boolean => {
  const videoExtensions = ["mp4", "webm", "ogg", "mov"];
  const ext = getFileExtension(filename).toLowerCase();
  return videoExtensions.includes(ext);
};

export const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const color = Math.floor(
    Math.abs((Math.sin(hash) * 16777215) % 1) * 16777215,
  );
  return "#" + color.toString(16).padStart(6, "0");
};
