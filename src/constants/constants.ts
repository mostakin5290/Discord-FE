export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    UPDATE_PROFILE: "/auth/update-profile",
  },
  SERVERS: {
    CREATE: "/server",
    GET_ALL: "/server",
    GET_BY_ID: (id: string) => `/server/${id}`,
    UPDATE: (id: string) => `/server/${id}`,
    DELETE: (id: string) => `/server/${id}`,
    JOIN: "/server/join",
    LEAVE: (id: string) => `/server/${id}/leave`,
    REGENERATE_CODE: (id: string) => `/server/${id}/regenerate-invite`,
  },
  CHANNELS: {
    CREATE: (serverId: string) => `/server/${serverId}/channel`,
    GET_ALL: (serverId: string) => `/server/${serverId}/channels`,
    UPDATE: (channelId: string) => `/channel/${channelId}`,
    DELETE: (channelId: string) => `/channel/${channelId}`,
  },
  MESSAGES: {
    GET: (channelId: string) => `/channel/${channelId}/messages`,
    SEND: (channelId: string) => `/channel/${channelId}/messages`,
    UPDATE: (messageId: string) => `/message/${messageId}`,
    DELETE: (messageId: string) => `/message/${messageId}`,
    REACT: (messageId: string) => `/message/${messageId}/reaction`,
    GET_REACTIONS: (messageId: string) => `/message/${messageId}/reactions`,
  },
  DM: {
    GET_ALL: "/dm",
    GET_OR_CREATE: (friendId: string) => `/dm/${friendId}`,
    GET_MESSAGES: (conversationId: string) => `/dm/${conversationId}/messages`,
    SEND_MESSAGE: (conversationId: string) => `/dm/${conversationId}/messages`,
    UPDATE_MESSAGE: (messageId: string) => `/dm/message/${messageId}`,
    DELETE_MESSAGE: (messageId: string) => `/dm/message/${messageId}`,
    DELETE_CONVERSATION: (conversationId: string) => `/dm/${conversationId}`,
  },
  FRIENDS: {
    GET_ALL: "/friends",
    SEND_REQUEST: "/friends/request",
    GET_REQUESTS: "/friends/requests",
    ACCEPT: (requestId: string) => `/friends/request/${requestId}/accept`,
    REJECT: (requestId: string) => `/friends/request/${requestId}/reject`,
    CANCEL: (requestId: string) => `/friends/request/${requestId}/cancel`,
    REMOVE: (friendId: string) => `/friends/${friendId}`,
    BLOCK: "/friends/block",
    UNBLOCK: (userId: string) => `/friends/unblock/${userId}`,
    GET_BLOCKED: "/friends/blocked",
  },
  DISCOVERY: {
    SEARCH: "/discovery",
    GET_SERVER: (serverId: string) => `/discovery/${serverId}`,
    GET_CATEGORIES: "/discovery/categories",
    GET_BY_CATEGORY: (category: string) => `/discovery/category/${category}`,
  },
  UPLOAD: {
    IMAGE: "/upload/image",
    FILE: "/upload/file",
  },
} as const;

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  JOIN_SERVER: "join:server",
  LEAVE_SERVER: "leave:server",
  JOIN_CHANNEL: "join:channel",
  LEAVE_CHANNEL: "leave:channel",
  JOIN_CONVERSATION: "join:conversation",
  LEAVE_CONVERSATION: "leave:conversation",
  MESSAGE_NEW: "message:new",
  MESSAGE_UPDATED: "message:updated",
  MESSAGE_DELETED: "message:deleted",
  DM_NEW: "dm:new",
  DM_UPDATED: "dm:updated",
  DM_DELETED: "dm:deleted",
  SERVER_UPDATED: "server:updated",
  SERVER_DELETED: "server:deleted",
  CHANNEL_CREATED: "channel:created",
  CHANNEL_UPDATED: "channel:updated",
  CHANNEL_DELETED: "channel:deleted",
  MEMBER_JOINED: "member:joined",
  MEMBER_LEFT: "member:left",
  FRIEND_REQUEST_NEW: "friendRequest:new",
  FRIEND_REQUEST_ACCEPTED: "friendRequest:accepted",
  FRIEND_REMOVED: "friend:removed",
  REACTION_UPDATED: "reaction:updated",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  USER_STATUS_CHANGE: "user:status",
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "discord_auth_token",
  USER_DATA: "discord_user_data",
  THEME: "discord_theme",
  LANGUAGE: "discord_language",
  CALL_STATE: "discord_call_state",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",
  AUTH_SUCCESS: "/auth/success",
  DASHBOARD: "/channels/@me",
  SERVER: (serverId: string) => `/channels/${serverId}`,
  CHANNEL: (serverId: string, channelId: string) =>
    `/channels/${serverId}/${channelId}`,
  DISCOVERY: "/discovery",
  INVITE: (code: string) => `/invite/${code}`,
  DIRECT_CALL: "/call",
} as const;

export const CHANNEL_TYPES = {
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
} as const;

export const MEMBER_ROLES = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  GUEST: "GUEST",
} as const;

export const FRIEND_REQUEST_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export const MESSAGE_LIMITS = {
  CONTENT_MAX_LENGTH: 2000,
  FILE_MAX_SIZE: 8 * 1024 * 1024, // 8MB
  MESSAGES_PER_PAGE: 50,
} as const;

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 6,
  },
  SERVER_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  CHANNEL_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  OTP: {
    LENGTH: 6,
  },
} as const;
