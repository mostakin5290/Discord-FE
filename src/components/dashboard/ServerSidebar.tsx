import { Plus, Home, Settings, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

interface Server {
  id: string;
  name: string;
  imageUrl: string;
}

interface ServerSidebarProps {
  servers: Server[];
  currentServerId: string | null;
  onServerSelect: (serverId: string) => void;
  onCreateServer: () => void;
}



const ServerSidebar = ({
  servers,
  currentServerId,
  onServerSelect,
  onCreateServer,
}: ServerSidebarProps) => {

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    try {
      const result = dispatch(logout());
      toast.success("Logout successful!");
      navigate('/login');
    } catch (error: any) {
      toast.error("An unexpected error occurred");
    }
  }
  return (
    <div className="flex flex-col items-center w-[72px] bg-[#1e1f22] py-3 gap-2">
      <TooltipProvider>
        {/* Home/DM Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#5865f2] hover:rounded-[16px] transition-all duration-200"
              onClick={() => servers.length > 0 && onServerSelect(servers[0].id)}
            >
              <Home size={24} className="text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Direct Messages</p>
          </TooltipContent>
        </Tooltip>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

        {/* Server List */}
        {servers.map((server) => (
          <Tooltip key={server.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onServerSelect(server.id)}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-[24px] 
                  hover:rounded-[16px] transition-all duration-200 overflow-hidden
                  scale-hover shadow-md hover:shadow-xl
                  ${currentServerId === server.id
                    ? "rounded-[16px] bg-[#5865f2] shadow-lg"
                    : "bg-[#313338] hover:bg-[#5865f2]"
                  }
                `}
              >
                {server.imageUrl ? (
                  <img
                    src={server.imageUrl}
                    alt={server.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {server.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{server.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Add Server Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onCreateServer}
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#23a559] hover:rounded-[16px] transition-all duration-200"
            >
              <Plus size={24} className="text-[#23a559] hover:text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>
        
        {/* Settings Button */}
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#5865f2] hover:rounded-[16px] transition-all duration-200 cursor-pointer"
                  onClick={() => { }}
                >
                  <Settings size={24} className="text-white " />
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>

          <PopoverContent side="right"
            className="w-48 bg-[#1e1f22] border border-white/20 ring-1 ring-border/50 shadow-md">
            <div className="space-y-2 flex flex-col">
              <p className="font-medium text-center">Settings</p>
              <Separator />
              <button className="text-sm flex justify-center text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={handleLogout}>
                LogOut <LogOut className=" ml-2.5 text-sm" />
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipProvider>
    </div>
  );
};

export default ServerSidebar;
