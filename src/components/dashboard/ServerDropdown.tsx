import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  UserPlus,
  Settings,
  Users,
  PlusCircle,
  Sparkles,
  Bell,
  Shield,
} from "lucide-react";

interface ServerDropdownProps {
  serverName: string;
  isAdmin: boolean;
  onInvite: () => void;
  onSettings: () => void;
  onCreateChannel: () => void;
}

const ServerDropdown = ({
  serverName,
  isAdmin,
  onInvite,
  onSettings,
  onCreateChannel,
}: ServerDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] shadow-sm hover:bg-[#35363c] transition-colors focus:outline-none">
        <span className="font-semibold text-white truncate">{serverName}</span>
        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-[#111214] border-[#1e1f22] rounded-md shadow-lg p-2"
        align="center"
        sideOffset={8}
      >
        <DropdownMenuItem
          className="text-indigo-400 hover:text-white hover:bg-[#5865f2] focus:bg-[#5865f2] focus:text-white rounded px-2 py-2 cursor-pointer"
          onClick={onInvite}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="font-medium">Invite People</span>
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-[#5865f2] focus:bg-[#5865f2] focus:text-white rounded px-2 py-2 cursor-pointer">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Server Boost</span>
              <div className="ml-auto bg-pink-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                LEVEL 0
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#2b2d31] my-1" />

            <DropdownMenuItem
              className="text-gray-300 hover:text-white hover:bg-indigo-600 focus:bg-indigo-600 focus:text-white rounded px-2 py-2 cursor-pointer"
              onClick={onSettings}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Server Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-gray-300 hover:text-white hover:bg-indigo-600 focus:bg-indigo-600 focus:text-white rounded px-2 py-2 cursor-pointer"
              onClick={onCreateChannel}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Create Channel</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-[#2b2d31] my-1" />

        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-indigo-600 focus:bg-indigo-600 focus:text-white rounded px-2 py-2 cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notification Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-indigo-600 focus:bg-indigo-600 focus:text-white rounded px-2 py-2 cursor-pointer">
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#2b2d31] my-1" />

        <DropdownMenuItem className="text-red-400 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:text-white rounded px-2 py-2 cursor-pointer">
          <span className="font-medium">Leave Server</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerDropdown;
