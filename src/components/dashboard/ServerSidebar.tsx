import { Plus, Home, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
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
  const pathname = useLocation();
  const isDiscoveryPage = pathname.pathname.includes("/discovery");

  return (
    <div className="hidden md:flex flex-col items-center w-[72px] bg-[#0b0c0e] py-3 gap-2 shrink-0">
      <TooltipProvider>
        {/* Home/DM Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative flex items-center justify-center w-full mb-2 group">
              {/* Active/Hover Indicator Pill */}
              <div
                className={`absolute left-0 w-[4px] bg-white rounded-r-full transition-all duration-200 origin-left
                  ${!currentServerId && !isDiscoveryPage
                    ? "h-[40px] opacity-100"
                    : "h-[8px] opacity-0 group-hover:opacity-100 group-hover:h-[20px]"
                  }
                `}
              />
              <button
                className={`
                  flex items-center justify-center w-12 h-12 rounded-[24px] 
                  transition-all duration-300 group-hover:rounded-[16px] group-hover:scale-110
                  active:scale-95
                  ${!currentServerId && !isDiscoveryPage
                    ? "bg-[#5865f2] rounded-[16px] scale-105"
                    : "bg-[#1a1b1e] hover:bg-[#5865f2]"
                  }
                `}
                onClick={() => navigate("/channels/@me")}
                aria-label="Direct Messages"
              >
                <Home
                  size={28}
                  className="text-[#dbdee1] group-hover:text-white transition-all duration-300 group-hover:scale-110"
                />
              </button>
            </div>
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
              <div className="relative flex items-center justify-center w-full my-[2px] group">
                {/* Active/Hover Indicator Pill */}
                <div
                  className={`absolute left-0 w-[4px] bg-white rounded-r-full transition-all duration-200 origin-left
                    ${currentServerId === server.id
                      ? "h-[40px] opacity-100"
                      : "h-[8px] opacity-0 group-hover:opacity-100 group-hover:h-[20px]"
                    }
                  `}
                />

                <button
                  onClick={() => onServerSelect(server.id)}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-[24px] 
                    transition-all duration-300 overflow-hidden
                    group-hover:rounded-[16px] group-hover:bg-[#5865f2] group-hover:scale-110
                    active:scale-95
                    ${currentServerId === server.id
                      ? "rounded-[16px] bg-[#5865f2] shadow-lg scale-105"
                      : "bg-[#1a1b1e] hover:shadow-2xl"
                    }
                  `}
                  aria-label={`Select server ${server.name}`}
                >
                  {server.imageUrl ? (
                    <img
                      src={server.imageUrl}
                      alt={server.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#dbdee1] group-hover:text-white font-medium text-sm transition-colors duration-200">
                      {server.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </button>
              </div>
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
              className="flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#1a1b1e] hover:bg-[#23a559] hover:rounded-[16px] transition-all duration-300 hover:scale-110 active:scale-95 group mt-2 shadow-md hover:shadow-xl"
              aria-label="Add a Server"
            >
              <Plus
                size={24}
                className="text-[#23a559] group-hover:text-white transition-all duration-300 group-hover:rotate-90"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add a Server</p>
          </TooltipContent>
        </Tooltip>

        {/* Discovery Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate("/discovery/servers")}
              className={`flex items-center justify-center w-12 h-12 rounded-[24px] bg-[#1a1b1e] hover:bg-[#5865f2] hover:rounded-[16px] transition-all duration-300 hover:scale-110 active:scale-95 group mt-2 shadow-md hover:shadow-xl ${isDiscoveryPage ? "bg-[#5865f2] rounded-[16px] scale-105" : "bg-[#1a1b1e] hover:bg-[#5865f2]"}`}
              aria-label="Explore Discoverable Servers"
            >
              <Globe
                size={24}
                className="text-white group-hover:text-white transition-all duration-300"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Discovery</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ServerSidebar;