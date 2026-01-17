import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchFriends } from "@/store/slices/friendSlice";
import { fetchConversations } from "@/store/slices/dmSlice";
import { getInitials } from "@/utils/messageUtils";
import {
  getUserProfile,
  getMutualFriends,
  getMutualServers,
  type UserProfile,
  type MutualFriend,
  type MutualServer,
} from "@/services/friend.service";

interface UserProfileSidebarProps {
  userId: string;
}

const UserProfileSidebar = ({ userId }: UserProfileSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { friends } = useSelector((state: RootState) => state.friends);
  const { conversations } = useSelector((state: RootState) => state.dm);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mutualFriends, setMutualFriends] = useState<MutualFriend[]>([]);
  const [mutualServers, setMutualServers] = useState<MutualServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (friends.length === 0) {
      dispatch(fetchFriends());
    }
    if (conversations.length === 0) {
      dispatch(fetchConversations());
    }
  }, [dispatch, friends.length, conversations.length]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const [profileData, mutualFriendsData, mutualServersData] =
          await Promise.all([
            getUserProfile(userId),
            getMutualFriends(userId),
            getMutualServers(userId),
          ]);

        setUserProfile(profileData);
        setMutualFriends(mutualFriendsData.mutualFriends);
        setMutualServers(mutualServersData.mutualServers);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Resolve user data from friends or conversations for real-time status
  const friendData = friends.find((f) => f.friendId === userId)?.friend;
  const conversation = conversations.find((c) => c.participantId === userId);
  const liveUser = conversation?.participant || friendData;

  // Use profile data for most info, but status from live user data
  const user = userProfile
    ? {
        ...userProfile,
        status: liveUser?.status || "offline",
      }
    : liveUser;

  if (isLoading) {
    return (
      <div className="w-[340px] bg-[#232428] border-l border-[#1e1f22] flex flex-col items-center justify-center hidden lg:flex">
        <div className="text-[#949ba4]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-[340px] bg-[#232428] border-l border-[#1e1f22] flex flex-col hidden lg:flex">
        <div className="p-4 text-[#949ba4]">User not found</div>
      </div>
    );
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-[340px] bg-[#232428] border-l border-[#1e1f22] flex flex-col hidden lg:flex">
      {/* Banner */}
      <div
        className="h-[120px] relative"
        style={{
          background: user.bannerUrl
            ? `url(${user.bannerUrl}) center/cover`
            : "linear-gradient(to bottom right, #5865f2, #3b47d4)",
        }}
      >
        {/* Avatar positioned over banner */}
        <div className="absolute -bottom-10 left-4">
          <div className="w-[80px] h-[80px] rounded-full bg-[#232428] p-[6px]">
            <div className="w-full h-full rounded-full bg-[#5865f2] flex items-center justify-center relative">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-semibold">
                  {getInitials(displayName)}
                </span>
              )}
              {/* Status Indicator */}
              <div
                className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-[4px] border-[#232428] ${
                  user.status === "online"
                    ? "bg-[#23a55a]"
                    : user.status === "idle"
                      ? "bg-[#f0b232]"
                      : user.status === "dnd"
                        ? "bg-[#f23f43]"
                        : "bg-[#80848e]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 pt-14 pb-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent">
        <div className="mb-6 p-3 bg-[#111214] rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-white">{displayName}</h2>
          </div>
          <p className="text-[#b5bac1] text-sm">@{user.username}</p>

          <div className="border-t border-[#2e2f34] my-3"></div>

          <div className="space-y-3">
            {/* Member Since */}
            <div>
              <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-1">
                Discord Member Since
              </h3>
              <p className="text-[#dbdee1] text-sm">
                {formatDate(userProfile?.createdAt)}
              </p>
            </div>

            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-1">
                  About Me
                </h3>
                <p className="text-[#dbdee1] text-sm">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Note Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-[#949ba4] uppercase">Note</h3>
          </div>
          <textarea
            className="w-full bg-[#1e1f22] text-[#dbdee1] text-sm p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-[#5865f2] min-h-[60px]"
            placeholder="Click to add a note"
          />
        </div>

        {/* Mutual Servers */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#949ba4] uppercase mb-2">
            Mutual Servers — {mutualServers.length}
          </h3>
          {mutualServers.length > 0 ? (
            <div className="space-y-2">
              {mutualServers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center gap-3 p-2 bg-[#111214] rounded-lg hover:bg-[#1e1f22] transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {server.imageUrl ? (
                      <img
                        src={server.imageUrl}
                        alt={server.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {server.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#dbdee1] text-sm font-medium truncate">
                      {server.name}
                    </p>
                    {server.bio && (
                      <p className="text-[#949ba4] text-xs truncate">
                        {server.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#dbdee1] text-sm p-3 bg-[#111214] rounded-lg text-center">
              No mutual servers
            </div>
          )}
        </div>

        {/* Mutual Friends */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#949ba4] uppercase mb-2">
            Mutual Friends — {mutualFriends.length}
          </h3>
          {mutualFriends.length > 0 ? (
            <div className="space-y-2">
              {mutualFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 p-2 bg-[#111214] rounded-lg hover:bg-[#1e1f22] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {friend.imageUrl ? (
                      <img
                        src={friend.imageUrl}
                        alt={friend.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-xs">
                        {getInitials(
                          friend.firstName && friend.lastName
                            ? `${friend.firstName} ${friend.lastName}`
                            : friend.username,
                        )}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#dbdee1] text-sm truncate">
                      {friend.firstName && friend.lastName
                        ? `${friend.firstName} ${friend.lastName}`
                        : friend.username}
                    </p>
                    <p className="text-[#949ba4] text-xs truncate">
                      @{friend.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[#dbdee1] text-sm p-3 bg-[#111214] rounded-lg text-center">
              No mutual friends
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
