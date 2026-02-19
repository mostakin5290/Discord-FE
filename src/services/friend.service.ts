import axiosClient from "@/lib/axios";

export interface Friend {
  id: string;
  friendId: string;
  friend: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    bannerUrl?: string;
    bio?: string;
    status?: "online" | "idle" | "dnd" | "offline";
  };
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    bannerUrl?: string;
    bio?: string;
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    bannerUrl?: string;
    bio?: string;
  };
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  imageUrl?: string;
  bannerUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface MutualFriend {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface MutualServer {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
}

// Get all friends
export const getFriends = async (): Promise<Friend[]> => {
  const response = await axiosClient.get("/friends");
  return response.data.friends;
};

// Send a friend request
export const sendFriendRequest = async (
  username: string,
): Promise<FriendRequest> => {
  const response = await axiosClient.post("/friends/request", { username });
  return response.data.friendRequest;
};

// Get pending friend requests (received)
export const getPendingRequests = async (): Promise<FriendRequest[]> => {
  const response = await axiosClient.get("/friends/requests/pending");
  return response.data.requests;
};

// Get sent friend requests
export const getSentRequests = async (): Promise<FriendRequest[]> => {
  const response = await axiosClient.get("/friends/requests/sent");
  return response.data.requests;
};

// Accept a friend request
export const acceptFriendRequest = async (
  requestId: string,
): Promise<Friend> => {
  const response = await axiosClient.patch(
    `/friends/request/${requestId}/accept`,
  );
  return response.data.newFriend;
};

// Reject a friend request
export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await axiosClient.patch(`/friends/request/${requestId}/reject`);
};

// Cancel a sent friend request
export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  await axiosClient.delete(`/friends/request/${requestId}`);
};

// Remove a friend
export const removeFriend = async (friendId: string): Promise<void> => {
  await axiosClient.delete(`/friends/${friendId}`);
};

// Get user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const response = await axiosClient.get(`/friends/user/${userId}/profile`);
  return response.data.user;
};

// Get mutual friends with a user
export const getMutualFriends = async (
  userId: string,
): Promise<{ mutualFriends: MutualFriend[]; count: number }> => {
  const response = await axiosClient.get(
    `/friends/user/${userId}/mutual-friends`,
  );
  return {
    mutualFriends: response.data.mutualFriends,
    count: response.data.count,
  };
};

// Get mutual servers with a user
export const getMutualServers = async (
  userId: string,
): Promise<{ mutualServers: MutualServer[]; count: number }> => {
  const response = await axiosClient.get(
    `/friends/user/${userId}/mutual-servers`,
  );
  return {
    mutualServers: response.data.mutualServers,
    count: response.data.count,
  };
};
