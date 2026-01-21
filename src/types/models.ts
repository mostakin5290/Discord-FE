export interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  imageUrl?: string;
  bannerUrl?: string;
  bio?: string;
  streamChannelId?: string;
  status?: "online" | "offline" | "idle" | "dnd";
}

export interface Server {
  id: string;
  name: string;
  imageUrl?: string;
  bannerUrl?: string;
  bio?: string;
  inviteCode: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  channels: Channel[];
  members: Member[];
  memberCount?: number;
  isMember?: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: "TEXT" | "AUDIO" | "VIDEO";
  serverId: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  role: "ADMIN" | "MODERATOR" | "GUEST";
  userId: string;
  serverId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  fileType?: string;
  deleted: boolean;
  isEdited: boolean;
  userId: string;
  channelId?: string;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Conversation {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  updatedAt: string;
  user1: User;
  user2: User;
  directMessages?: Message[];
  lastMessage?: Message;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  sender: User;
  receiver: User;
}

export interface Friend {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  bio?: string;
  streamChannelId?: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: User[];
}

export interface DiscoveryServer extends Server {
  isMember: boolean;
  memberCount: number;
}

export interface CallState {
  isInCall: boolean;
  callType?: "voice" | "video" | "group";
  channelId?: string;
  roomName?: string;
  participants?: User[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  hasMore: boolean;
  cursor?: string;
}

export type ChannelType = "TEXT" | "AUDIO" | "VIDEO";
export type MemberRole = "ADMIN" | "MODERATOR" | "GUEST";
export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";
export type CallType = "voice" | "video" | "group";
