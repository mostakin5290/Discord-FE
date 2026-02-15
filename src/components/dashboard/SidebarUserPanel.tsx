
import {
  Mic,
  Headphones,
  Settings,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import { logout } from "@/store/slices/authSlice";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/utils/messageUtils";

const SidebarUserPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="h-[52px] px-2 bg-[#0b0c0e] flex items-center justify-between mt-auto shrink-0 border-t border-[#1e1f22]">
      <div className="flex items-center gap-2 flex-1 min-w-0 mr-2 group p-1 -ml-1 rounded hover:bg-white/5 cursor-pointer transition-colors">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-semibold">
                {getInitials(user?.firstName || user?.username || "U")}
              </span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] border-2 border-[#232428] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {user?.username || "User"}
          </div>
          <div className="text-xs text-[#949ba4] truncate">Online</div>
        </div>
      </div>
      <div className="flex items-center">
        <button 
            className="text-[#949ba4] hover:text-white hover:bg-[#1e1f22] rounded transition-all p-1.5"
            aria-label="Mute Microphone"
        >
          <Mic size={20} />
        </button>
        <button 
            className="text-[#949ba4] hover:text-white hover:bg-[#1e1f22] rounded transition-all p-1.5"
            aria-label="Deafen"
        >
          <Headphones size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
                className="text-[#949ba4] hover:text-white hover:bg-[#1e1f22] rounded transition-all p-1.5 focus:outline-none"
                aria-label="User Settings"
            >
              <Settings size={20} />
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
  );
};

export default SidebarUserPanel;
