import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
  X,
  Check,
  Phone,
  Video,
  UserMinus,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import {
  fetchFriends,
  fetchPendingRequests,
  fetchSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  sendFriendRequest as sendRequest,
} from "@/store/slices/friendSlice";
import { useNavigate } from "react-router-dom";

type TabType = "online" | "all" | "pending" | "blocked";

const FriendsPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { friends, pendingRequests, sentRequests, isLoading } = useSelector(
    (state: RootState) => state.friends,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  // Default to "online" tab to match screenshots
  const [activeTab, setActiveTab] = useState<TabType>("online");
  const [searchQuery, setSearchQuery] = useState("");
  const [addFriendUsername, setAddFriendUsername] = useState("");
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchPendingRequests());
    dispatch(fetchSentRequests());
  }, [dispatch]);

  const handleSendFriendRequest = async () => {
    const username = addFriendUsername.trim();
    if (!username) return;

    // 1. Check for self-add
    if (user?.username === username) {
      toast.error("You cannot add yourself as a friend.");
      return;
    }

    // 2. Check if already friends
    const isAlreadyFriend = friends.find(
      (f) => f.friend?.username === username,
    );
    if (isAlreadyFriend) {
      toast.error(`${username} is already your friend.`);
      return;
    }

    // 3. Check if already sent request
    const isRequestSent = sentRequests.find(
      (r) => r.receiver?.username === username,
    );
    if (isRequestSent) {
      toast.error(`You have already sent a friend request to ${username}.`);
      return;
    }

    // 4. Check if request received (pending)
    const isRequestReceived = pendingRequests.find(
      (r) => r.sender?.username === username,
    );
    if (isRequestReceived) {
      toast.info(
        `${username} has already sent you a request. Accept it in the Pending tab!`,
      );
      return;
    }

    try {
      await dispatch(sendRequest(username)).unwrap();
      toast.success(`Friend request sent to ${username}`);
      setAddFriendUsername("");
      setShowAddFriend(false);
    } catch (error: any) {
      toast.error(error || "Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    await dispatch(acceptFriendRequest(requestId));
    dispatch(fetchFriends());
  };

  const handleRejectRequest = async (requestId: string) => {
    await dispatch(rejectFriendRequest(requestId));
  };

  const handleCancelRequest = async (requestId: string) => {
    await dispatch(cancelFriendRequest(requestId));
  };

  const handleRemoveFriend = async (friendId: string) => {
    await dispatch(removeFriend(friendId));
  };

  const handleMessageFriend = (userId: string) => {
    navigate(`/dm/${userId}`);
  };

  // Mock online count for now since we don't have real-time presence fully hooked up everywhere,
  // but we'll use the 'status' field from friend object if available.
  const onlineFriends = friends.filter(
    (f) => f.friend?.status && f.friend.status !== "offline",
  );

  const tabs = [
    { id: "online" as TabType, label: "Online", count: onlineFriends.length },
    { id: "all" as TabType, label: "All", count: friends.length },
    {
      id: "pending" as TabType,
      label: "Pending",
      count: pendingRequests.length,
    },
    { id: "blocked" as TabType, label: "Blocked", count: 0 },
  ];

  const getStatusColor = (status?: string) => {
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

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const filteredFriends = friends.filter(
    (friend) =>
      friend?.friend?.username &&
      friend.friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderContent = () => {
    if (activeTab === "online") {
      const onlineFriendsList = friends.filter(
        (friend) =>
          friend.friend?.status &&
          friend.friend.status !== "offline" &&
          friend.friend.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );

      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-[#949ba4] uppercase">
              Online — {onlineFriendsList.length}
            </h4>
          </div>

          {onlineFriendsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#949ba4]">
              <div className="w-105 h-55 mb-8 opacity-100 grayscale-0">
                {/* Using the image from screenshot 1 conceptually - Wumpus waiting */}
                <div className="w-full h-full bg-[#36393f] rounded-md flex items-center justify-center">
                  <span className="text-sm">
                    No one's around to play with Wumpus.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            onlineFriendsList.map((friendData) => {
              const friend = friendData.friend;
              return (
                <div
                  key={friendData.id}
                  className="flex items-center justify-between p-3 rounded-lg border-t border-[#3f4147] hover:bg-[#393c41] hover:border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group cursor-pointer animate-in fade-in slide-in-from-bottom duration-500"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                        {friend.imageUrl ? (
                          <img
                            src={friend.imageUrl}
                            alt={friend.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {getInitials(friend.firstName || friend.username)}
                          </span>
                        )}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${getStatusColor(
                          friend.status,
                        )} border-[3px] border-[#313338] rounded-full animate-pulse`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {friend.firstName && friend.lastName
                          ? `${friend.firstName} ${friend.lastName}`
                          : friend.username}
                      </div>
                      <div className="text-xs text-[#949ba4] truncate">
                        {friend.status || "Online"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => handleMessageFriend(friend.id)}
                      className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 tooltip shadow-md hover:shadow-xl"
                      title="Message"
                    >
                      <MessageCircle size={20} />
                    </button>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none shadow-md hover:shadow-xl">
                          <MoreHorizontal size={20} />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[188px] bg-[#111214] rounded-md p-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.24)] animate-in fade-in zoom-in-95 duration-100 z-50 border border-[#1e1f22]"
                          sideOffset={5}
                          align="end"
                        >
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-[#b5bac1] hover:bg-[#4752c4] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2">
                            <Video size={16} />
                            Start Video Call
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-[#b5bac1] hover:bg-[#4752c4] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2">
                            <Phone size={16} />
                            Start Voice Call
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-[#1e1f22] my-1" />
                          <DropdownMenu.Item
                            onClick={() =>
                              handleRemoveFriend(friendData.friendId)
                            }
                            className="flex items-center px-2 py-2 text-sm text-[#da373c] hover:bg-[#da373c] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2"
                          >
                            <UserMinus size={16} />
                            Remove Friend
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    }

    if (activeTab === "all") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-[#949ba4] uppercase">
              All Friends — {filteredFriends.length}
            </h4>
          </div>

          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#949ba4]">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#2b2d31] flex items-center justify-center">
                <Users size={32} />
              </div>
              <p className="text-base font-medium">
                No one's around to play with Wumpus.
              </p>
            </div>
          ) : (
            filteredFriends.map((friendData) => {
              const friend = friendData.friend;
              return (
                <div
                  key={friendData.id}
                  className="flex items-center justify-between p-3 rounded-lg border-t border-[#3f4147] hover:bg-[#393c41] hover:border-transparent transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                        {friend.imageUrl ? (
                          <img
                            src={friend.imageUrl}
                            alt={friend.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {getInitials(friend.firstName || friend.username)}
                          </span>
                        )}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${getStatusColor(
                          friend.status,
                        )} border-[3px] border-[#313338] rounded-full`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {friend.firstName && friend.lastName
                          ? `${friend.firstName} ${friend.lastName}`
                          : friend.username}
                      </div>
                      <div className="text-xs text-[#949ba4] truncate">
                        {friend.status || "Offline"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleMessageFriend(friend.id)}
                      className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors tooltip"
                      title="Message"
                    >
                      <MessageCircle size={20} />
                    </button>

                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-9 h-9 rounded-full bg-[#2b2d31] hover:bg-[#1e1f22] flex items-center justify-center text-[#949ba4] hover:text-white transition-colors focus:outline-none">
                          <MoreHorizontal size={20} />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          className="min-w-[188px] bg-[#111214] rounded-md p-1.5 shadow-[0_8px_16px_rgba(0,0,0,0.24)] animate-in fade-in zoom-in-95 duration-100 z-50 border border-[#1e1f22]"
                          sideOffset={5}
                          align="end"
                        >
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-[#b5bac1] hover:bg-[#4752c4] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2">
                            <Video size={16} />
                            Start Video Call
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="flex items-center px-2 py-2 text-sm text-[#b5bac1] hover:bg-[#4752c4] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2">
                            <Phone size={16} />
                            Start Voice Call
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-[#1e1f22] my-1" />
                          <DropdownMenu.Item
                            onClick={() =>
                              handleRemoveFriend(friendData.friendId)
                            }
                            className="flex items-center px-2 py-2 text-sm text-[#da373c] hover:bg-[#da373c] hover:text-white rounded cursor-pointer outline-none transition-colors gap-2"
                          >
                            <UserMinus size={16} />
                            Remove Friend
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>
                </div>
              );
            })
          )}
        </div>
      );
    }

    if (activeTab === "pending") {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-[#949ba4] uppercase">
              Pending — {pendingRequests.length}
            </h4>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#949ba4]">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#2b2d31] flex items-center justify-center">
                <Users size={32} />
              </div>
              <p className="text-base font-medium">
                No pending friend requests.
              </p>
            </div>
          ) : (
            pendingRequests.map((request) => {
              if (!request.sender) return null;
              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg border-t border-white/5 hover:bg-white/5 hover:border-transparent transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                        {request.sender.imageUrl ? (
                          <img
                            src={request.sender.imageUrl}
                            alt={request.sender.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {getInitials(request.sender.username)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {request.sender.firstName && request.sender.lastName
                          ? `${request.sender.firstName} ${request.sender.lastName}`
                          : request.sender.username}
                      </div>
                      <div className="text-xs text-[#949ba4] truncate">
                        Incoming Friend Request
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="w-9 h-9 rounded-full bg-[#248046] hover:bg-[#1a6334] flex items-center justify-center text-white transition-colors"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="w-9 h-9 rounded-full bg-[#da373c] hover:bg-[#a12d30] flex items-center justify-center text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {sentRequests.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4 mt-6">
                <h4 className="text-xs font-semibold text-[#949ba4] uppercase">
                  Sent — {sentRequests.length}
                </h4>
              </div>

              {sentRequests.map((request) => {
                if (!request.receiver) return null;
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 rounded-lg border-t border-white/5 hover:bg-white/5 hover:border-transparent transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                          {request.receiver?.imageUrl ? (
                            <img
                              src={request.receiver.imageUrl}
                              alt={request.receiver.username}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-semibold">
                              {getInitials(request.receiver?.username || "U")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {request.receiver?.username}
                        </div>
                        <div className="text-xs text-[#949ba4] truncate">
                          Outgoing Friend Request
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="w-9 h-9 rounded-full bg-[#da373c] hover:bg-[#a12d30] flex items-center justify-center text-white transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#949ba4]">
        <div className="w-16 h-16 mb-4 rounded-full bg-[#2b2d31] flex items-center justify-center">
          <Users size={32} />
        </div>
        <p className="text-base font-medium">No blocked users.</p>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f22] h-full">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#111214] shadow-sm">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-[#949ba4]" />
          <h3 className="font-semibold text-white">Friends</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="h-12 px-4 flex items-center gap-4 border-b border-[#1f2023]">
        <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 py-1 text-sm font-medium rounded transition-colors ${
                activeTab === tab.id
                  ? "bg-[#404249] text-white"
                  : "text-[#949ba4] hover:text-[#dbdee1] hover:bg-[#2e3035]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-6 w-px bg-white/5" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAddFriend(!showAddFriend)}
          className="text-[#3ba55d] hover:text-[#3ba55d] hover:bg-[#2d7d46]/10 font-medium"
        >
          <UserPlus size={16} className="mr-2" />
          Add Friend
        </Button>
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <div className="px-4 py-4 bg-[#2b2d31] border-b border-[#26272b]">
          <h4 className="text-sm font-semibold text-white mb-2">ADD FRIEND</h4>
          <p className="text-xs text-[#949ba4] mb-3">
            You can add friends by their Discord username.
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter username"
              value={addFriendUsername}
              onChange={(e) => setAddFriendUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendFriendRequest()}
              className="flex-1 bg-[#1e1f22] border-none text-white placeholder-[#949ba4] focus:ring-0"
            />
            <Button
              onClick={handleSendFriendRequest}
              disabled={!addFriendUsername.trim() || isLoading}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              Send Request
            </Button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#949ba4]"
          />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1e1f22] border-none text-white placeholder-[#949ba4] focus:ring-0 rounded-md h-9"
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default FriendsPanel;
