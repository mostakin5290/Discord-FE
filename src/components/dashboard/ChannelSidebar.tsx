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
import type { RootState } from "@/store/store";
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
  onChannelSelect: (channelId: string) => void;
}

const ChannelSidebar = ({
  server,
  selectedChannelId,
  onChannelSelect,
}: ChannelSidebarProps) => {
  const [showChannels, setShowChannels] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
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

  return (
    <div className="flex flex-col w-60 glass-sidebar">
      {/* Server Header with Dropdown */}
      <ServerDropdown
        serverName={server.name}
        isAdmin={isAdmin}
        onSettings={() => console.log("Settings")}
      />

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#1e1f22] scrollbar-track-transparent">
        {/* Text Channels */}
        <div className="pt-4">
          <div
            className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-300 cursor-pointer"
            onClick={() => setShowChannels(!showChannels)}
          >
            <div className="flex items-center gap-1">
              <ChevronDown
                size={12}
                className={showChannels ? "" : "-rotate-90"}
              />
              <span>TEXT CHANNELS</span>
            </div>
            <Plus size={16} className="hover:text-white" />
          </div>

          {showChannels &&
            textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`
                w-full flex items-center gap-2 px-2 py-1.5 mx-2 rounded 
                transition-all duration-150 hover:scale-[1.02]
                ${
                  selectedChannelId === channel.id
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }
              `}
              >
                {getChannelIcon(channel.type)}
                <span className="text-sm font-medium">{channel.name}</span>
              </button>
            ))}
        </div>

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-300 cursor-pointer">
              <div className="flex items-center gap-1">
                <ChevronDown size={12} />
                <span>VOICE CHANNELS</span>
              </div>
              <Plus size={16} className="hover:text-white" />
            </div>

            {voiceChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel.id)}
                className={`
                  w-full flex items-center gap-2 px-2 py-1.5 mx-2 rounded 
                  ${
                    selectedChannelId === channel.id
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }
                `}
              >
                {getChannelIcon(channel.type)}
                <span className="text-sm font-medium">{channel.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Panel at Bottom */}
      <div className="h-[52px] px-2 bg-black/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">
              {user?.username || "User"}
            </span>
            <span className="text-xs text-gray-400">
              #{user?.id?.slice(0, 4) || "0000"}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-white cursor-pointer focus:outline-none">
              <Settings size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-[#111214] border-[#1e1f22]"
            align="end"
            side="top"
            sideOffset={8}
          >
            <DropdownMenuItem className="text-[#b5bac1] hover:bg-[#4752c4] hover:text-white focus:bg-[#4752c4] focus:text-white cursor-pointer">
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
  );
};

export default ChannelSidebar;
