import {
  Hash,
  Volume2,
  Video,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import ServerDropdown from "./ServerDropdown";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearGroupCall, createGroupCallToken } from "@/store/slices/mediaChannelSlice";
import SidebarUserPanel from "@/components/notifications/SidebarUserPanel";

interface Channel {
  id: string;
  name: string;
  type: string;
}

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    streamChannelId?: string;
  };
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  channels: Channel[];
  members: Member[];
}

interface ChannelSidebarProps {
  server: Server;
  selectedChannelId: string | null;
}

const ChannelSidebar = ({
  server,
  selectedChannelId,
}: ChannelSidebarProps) => {
  const [showChannels, setShowChannels] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "AUDIO":
        return <Volume2 size={20} className="text-gray-400" />;
      case "VIDEO":
        return <Video size={20} className="text-gray-400" />;
      default:
        return <Hash size={20} className="text-gray-400" />;
    }
  };

  const textChannels = (server.channels || []).filter((c) => c.type === "TEXT");
  const voiceChannels = (server.channels || []).filter(
    (c) => c.type === "AUDIO" || c.type === "VIDEO",
  );

  const userMember = (server.members || []).find(
    (m) => m.user?.id === user?.id,
  );
  const isAdmin = userMember?.role === "ADMIN";

  const handleJoinChannelGroupCall = (channelId: string) => {
    dispatch(clearGroupCall());

    dispatch(createGroupCallToken({
      channelId: channelId,
      participantIdentity: user?.id || "",
      participantName: user?.username || "",
      roomName: channelId || "",
      serverId: server?.id || "",
    }));

    navigate(`/server/${server.id}/${channelId}`);
  };

  return (
    <div className="hidden md:flex flex-col w-60 glass-sidebar">
      {/* Server Header */}
      <div className="h-12 flex items-center px-4 font-semibold text-white shadow-sm border-b border-[#202225] hover:bg-[#35373c] transition-all duration-300 cursor-pointer text-[15px] backdrop-blur-sm">
        <ServerDropdown
          serverName={server.name}
          isAdmin={isAdmin}
        />
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent">
        {/* Text Channels */}
        <div className="pt-4 px-2">
          <div
            className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold tracking-wider text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group"
            onClick={() => setShowChannels(!showChannels)}
          >
            <div className="flex items-center gap-0.5">
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${showChannels ? "" : "-rotate-90"
                  }`}
              />
              <span>TEXT CHANNELS</span>
            </div>
            <Plus size={16} className="cursor-pointer hover:text-white" />
          </div>

          {showChannels &&
            textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => navigate(`/server/${server.id}/${channel.id}`)}
                className={`
              w-full flex items-center gap-1.5 px-2 py-[6px] mb-[2px] rounded-[4px]
              transition-all duration-200 group hover:scale-105 hover:translate-x-1 active:scale-95
              ${selectedChannelId === channel.id
                    ? "bg-[#404249] text-white scale-105 translate-x-1"
                    : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                  }
            `}
              >
                <div
                  className={
                    selectedChannelId === channel.id
                      ? "text-white"
                      : "text-[#80848e]"
                  }
                >
                  {getChannelIcon(channel.type)}
                </div>
                <span
                  className={`text-[15px] font-medium leading-5 ${selectedChannelId === channel.id
                    ? "text-white"
                    : "text-[#949ba4] group-hover:text-[#dbdee1]"
                    }`}
                >
                  {channel.name}
                </span>
              </button>
            ))}
        </div>

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div className="pt-4 px-2">
            <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold tracking-wider text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group">
              <div className="flex items-center gap-0.5">
                <ChevronDown size={12} />
                <span>VOICE CHANNELS</span>
              </div>
              <Plus size={16} className="cursor-pointer hover:text-white" />
            </div>

            {voiceChannels.map((channel) => {
              const activeMembers = (server.members || []).filter(
                (m) => m.user?.streamChannelId === channel.id
              );

              return (
                <div key={channel.id} className="mb-[2px]">
                  <button
                    onClick={() => handleJoinChannelGroupCall(channel.id)}
                    className={`
                  w-full flex items-center gap-1.5 px-2 py-[6px] rounded-[4px]
                  transition-all duration-200 group hover:scale-105 hover:translate-x-1 active:scale-95
                  ${selectedChannelId === channel.id
                        ? "bg-[#404249] text-white scale-105 translate-x-1"
                        : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
                      }
                `}
                  >
                    <div
                      className={
                        selectedChannelId === channel.id
                          ? "text-white"
                          : "text-[#80848e]"
                      }
                    >
                      {getChannelIcon(channel.type)}
                    </div>
                    <span
                      className={`text-[15px] font-medium leading-5 ${selectedChannelId === channel.id
                        ? "text-white"
                        : "text-[#949ba4] group-hover:text-[#dbdee1]"
                        }`}
                    >
                      {channel.name}
                    </span>
                  </button>

                  {/* Active Voice Participants */}
                  {activeMembers.length > 0 && (
                    <div className="pl-6 pb-2 flex flex-col gap-1 mt-1">
                      {activeMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#35373c] cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden">
                            {member.user?.imageUrl ? (
                              <img
                                src={member.user.imageUrl}
                                alt={member.user.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-[10px] font-semibold">
                                {member.user?.username?.charAt(0).toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <span className="text-[#949ba4] text-xs font-medium truncate">
                            {member.user?.username || "Unknown"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User Panel */}
      <SidebarUserPanel />
    </div>

  );
};

export default ChannelSidebar;
