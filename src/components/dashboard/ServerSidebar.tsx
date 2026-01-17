import { Plus, Home } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  return (
    <div className="flex flex-col items-center w-[72px] bg-[#0b0c0e] py-3 gap-2 shrink-0">
      <TooltipProvider>
        {/* Home/DM Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#5865f2] hover:rounded-[16px] transition-all duration-200 group"
              onClick={() => navigate("/channels/@me")}
            >
              <Home
                size={28}
                className="text-[#dbdee1] group-hover:text-white transition-colors"
              />
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
                  ${
                    currentServerId === server.id
                      ? "rounded-[16px] bg-[#5865f2] shadow-lg"
                      : "bg-[#1e1f22] hover:bg-[#5865f2]"
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
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#313338] hover:bg-[#23a559] hover:rounded-[16px] transition-all duration-200 group"
            >
              <Plus
                size={24}
                className="text-[#23a559] group-hover:text-white"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ServerSidebar;
