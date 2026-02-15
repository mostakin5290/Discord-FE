import { Crown, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import socketService from "@/services/socket.service";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
}

interface MemberListProps {
  members: Member[];
}

const MemberList = ({ members = [] }: MemberListProps) => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // Listen for online friends list
    socket.on("online_friends", (data: { userIds: string[] }) => {
      setOnlineUsers(new Set(data.userIds));
    });

    // Listen for user connected
    socket.on("user_connected", (data: { userId: string }) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    });

    // Listen for user disconnected
    socket.on("user_disconnected", (data: { userId: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    return () => {
      socket.off("online_friends");
      socket.off("user_connected");
      socket.off("user_disconnected");
    };
  }, []);

  // Filter out members with undefined user data
  const validMembers = members.filter((m) => m.user);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown size={14} className="text-yellow-500" />;
      case "MODERATOR":
        return <Shield size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "text-yellow-500";
      case "MODERATOR":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  const admins = validMembers.filter((m) => m.role === "ADMIN");
  const moderators = validMembers.filter((m) => m.role === "MODERATOR");
  const guests = validMembers.filter((m) => m.role === "GUEST");

  const renderMembers = (memberList: Member[], roleLabel: string) => {
    if (memberList.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">
          {roleLabel} — {memberList.length}
        </div>
        {memberList.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 px-2 py-1.5 mx-2 rounded hover:bg-[#35363c] cursor-pointer group"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                {member.user.imageUrl ? (
                  <img
                    src={member.user.imageUrl}
                    alt={member.user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {member.user.firstName?.charAt(0) ||
                      member.user.username.charAt(0)}
                  </span>
                )}
              </div>
              {/* Online Status Indicator - Only show if user is online */}
              {onlineUsers.has(member.user.id) && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2b2d31]" />
              )}
            </div>

            {/* Username */}
            <div className="flex items-center gap-1 flex-1">
              <span
                className={`text-sm font-medium ${getRoleColor(member.role)}`}
              >
                {member.user.firstName && member.user.lastName
                  ? `${member.user.firstName} ${member.user.lastName}`
                  : member.user.username}
              </span>
              {getRoleIcon(member.role)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="hidden lg:block w-60 bg-[#111214] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent">
      <div className="pt-4">
        {renderMembers(admins, "Admins")}
        {renderMembers(moderators, "Moderators")}
        {renderMembers(guests, "Members")}
      </div>
    </div>
  );
};

export default MemberList;
