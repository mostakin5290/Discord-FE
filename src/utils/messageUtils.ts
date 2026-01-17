import { format, isToday, isYesterday } from "date-fns";
import { sanitizeInput } from "@/utils/authGuard";

/**
 * Get initials from username or name
 */
export const getInitials = (name: string): string => {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
};

/**
 * Format message timestamp based on date
 */
export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "MM/dd/yyyy h:mm a");
  }
};

/**
 * Format short time for hover/compact view
 */
export const formatShortTime = (dateString: string): string => {
  return format(new Date(dateString), "h:mm a");
};

/**
 * Get status indicator color
 */
export const getStatusColor = (status?: string): string => {
  switch (status) {
    case "online":
      return "bg-[#23a55a]";
    case "idle":
      return "bg-[#f0b232]";
    case "dnd":
      return "bg-[#f23f43]";
    default:
      return "bg-[#80848e]";
  }
};

/**
 * Validate message content before sending
 */
export const validateMessage = (
  content: string,
): { valid: boolean; error?: string } => {
  // Check if empty
  if (!content.trim()) {
    return { valid: false, error: "Message cannot be empty" };
  }

  // Check max length (Discord limit is 2000 chars)
  if (content.length > 2000) {
    return { valid: false, error: "Message is too long (max 2000 characters)" };
  }

  return { valid: true };
};

/**
 * Sanitize message content for display (prevent XSS)
 */
export const sanitizeMessage = (content: string): string => {
  return sanitizeInput(content);
};

/**
 * Check if user should see grouped message (same sender within time window)
 */
export const shouldGroupMessage = (
  currentMessage: any,
  previousMessage: any | null,
  timeWindowMinutes: number = 5,
): boolean => {
  if (!previousMessage) return false;

  // Different sender
  if (
    previousMessage.senderId !== currentMessage.senderId &&
    previousMessage.userId !== currentMessage.userId
  ) {
    return false;
  }

  // Check time difference
  const currentTime = new Date(currentMessage.createdAt).getTime();
  const previousTime = new Date(previousMessage.createdAt).getTime();
  const diffMinutes = (currentTime - previousTime) / (1000 * 60);

  return diffMinutes <= timeWindowMinutes;
};

/**
 * Parse and linkify URLs in message content (basic version)
 */
export const linkifyMessage = (content: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#00b0f4] hover:underline">$1</a>',
  );
};

/**
 * Extract file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

/**
 * Check if file type is image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  return imageExtensions.includes(getFileExtension(filename));
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
