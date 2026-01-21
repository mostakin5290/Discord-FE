import axiosClient from "@/lib/axios";

export interface Conversation {
  id: string;
  userId: string;
  participantId: string;
  lastMessageAt?: string;
  lastMessageId?: string;
  participant: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    status?: "online" | "idle" | "dnd" | "offline";
  };
  lastMessage?: {
    id: string;
    content?: string;
    fileUrl?: string;
    createdAt: string;
  };
  unreadCount: number;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content?: string;
  fileUrl?: string;
  read: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string;
  pinned: boolean;
  pinnedAt?: string;
  pinnedBy?: string;
  deletedBy?: string[]; // Array of user IDs who deleted this message for themselves
  replyToId?: string;
  reactions?: Record<string, string[]>; // Emoji -> Array of User IDs
  sender: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
  receiver: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
  replyTo?: {
    id: string;
    content?: string;
    sender: {
      username: string;
    };
  };
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await axiosClient.get("/dm/conversations");
  return response.data.conversations;
};

export const getConversationMessages = async (
  conversationId: string,
  cursor?: string,
  limit: number = 50,
): Promise<{ messages: DirectMessage[]; nextCursor?: string }> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", limit.toString());

  const response = await axiosClient.get(
    `/dm/conversations/${conversationId}/messages?${params.toString()}`,
  );
  return response.data;
};

export const sendDirectMessage = async (
  friendId: string,
  content?: string,
  fileUrl?: string,
): Promise<DirectMessage> => {
  const response = await axiosClient.post(`/dm/${friendId}`, {
    content,
    fileUrl,
  });
  return response.data.message;
};

export const markMessagesAsRead = async (
  conversationId: string,
): Promise<void> => {
  await axiosClient.patch(`/dm/conversations/${conversationId}/read`);
};

export const deleteDirectMessage = async (messageId: string): Promise<void> => {
  await axiosClient.delete(`/dm/messages/${messageId}`);
};

export const pinMessage = async (messageId: string): Promise<DirectMessage> => {
  const response = await axiosClient.patch(
    `/dm-actions/messages/${messageId}/pin`,
  );
  return response.data.data;
};

export const deleteMessageAction = async (
  messageId: string,
  deleteType: "forMe" | "forEveryone",
): Promise<DirectMessage> => {
  const response = await axiosClient.delete(
    `/dm-actions/messages/${messageId}`,
    {
      params: { deleteType },
    },
  );
  return response.data.data;
};

export const addReaction = async (
  messageId: string,
  emoji: string,
): Promise<DirectMessage> => {
  const response = await axiosClient.post(
    `/dm-actions/messages/${messageId}/reactions`,
    { emoji },
  );
  return response.data.data;
};

export const removeReaction = async (
  messageId: string,
  emoji: string,
): Promise<DirectMessage> => {
  const response = await axiosClient.delete(
    `/dm-actions/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
  );
  return response.data.data;
};

export const replyToMessage = async (
  messageId: string,
  content: string,
  fileUrl?: string,
): Promise<DirectMessage> => {
  const response = await axiosClient.post(
    `/dm-actions/messages/${messageId}/reply`,
    { content, fileUrl },
  );
  return response.data.message;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await axiosClient.get("/dm/unread-count");
  return response.data.unreadCount;
};
