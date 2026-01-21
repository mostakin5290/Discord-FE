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
  };
  receiver?: {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
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

export const getFriends = async (): Promise<Friend[]> => {
  const response = await axiosClient.get("/friends");
  return response.data.friends;
};

export const sendFriendRequest = async (
  username: string,
): Promise<FriendRequest> => {
  const response = await axiosClient.post("/friends/request", { username });
  return response.data.friendRequest;
};

export const getPendingRequests = async (): Promise<FriendRequest[]> => {
  const response = await axiosClient.get("/friends/requests/pending");
  return response.data.requests;
};

export const getSentRequests = async (): Promise<FriendRequest[]> => {
  const response = await axiosClient.get("/friends/requests/sent");
  return response.data.requests;
};

export const acceptFriendRequest = async (
  requestId: string,
): Promise<Friend> => {
  const response = await axiosClient.patch(
    `/friends/request/${requestId}/accept`,
  );
  return response.data.newFriend;
};

export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  await axiosClient.patch(`/friends/request/${requestId}/reject`);
};

export const cancelFriendRequest = async (requestId: string): Promise<void> => {
  await axiosClient.delete(`/friends/request/${requestId}`);
};

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
