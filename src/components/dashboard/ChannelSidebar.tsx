import {
  Hash,
  Volume2,
  Video,
  ChevronDown,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import ServerDropdown from "./ServerDropdown";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import { createGroupCallToken } from "@/store/slices/mediaChannelSlice";

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

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

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
          onSettings={() => console.log("Settings")}
        />
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent animate-in fade-in slide-in-from-top duration-500">
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

            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleJoinChannelGroupCall(channel.id)}
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
        )}
      </div>

      {/* User Panel */}
      <div className="h-[52px] px-2 bg-[#0b0c0e] flex items-center justify-between shrink-0 border-t border-[#1e1f22]">
        <div className="flex items-center gap-2 pl-1 rounded hover:bg-[#3f4147] py-1 px-1 transition-all duration-300 hover:scale-105 cursor-pointer group">
          <div className="relative w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-semibold">
                {user?.firstName?.charAt(0) ||
                  user?.username?.charAt(0) ||
                  "U"}
              </span>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] border-[2px] border-[#0b0c0e] rounded-full animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="text-white text-xs font-semibold leading-tight">
              {user?.username || "User"}
            </span>
            <span className="text-[11px] text-[#949ba4] leading-tight">
              Online
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => dispatch(setSettingsModalOpen())}
                className="flex items-center justify-center w-8 h-8 rounded hover:bg-[#3f4147] text-[#dbdee1] transition-colors"
                title="User Settings"
              >
                <Settings size={18} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 bg-[#111214] border-[#1e1f22]"
              align="end"
              side="top"
              sideOffset={8}
            >
              <DropdownMenuItem
                className="text-[#b5bac1] hover:bg-[#4752c4] hover:text-white focus:bg-[#4752c4] focus:text-white cursor-pointer"
                onClick={() => dispatch(setSettingsModalOpen())}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>User Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#1e1f22]" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:text-red-600 hover:bg-red-600/10 focus:text-red-600 focus:bg-red-600/10 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

  );
};

export default ChannelSidebar;
