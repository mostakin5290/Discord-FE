import {
  Users,
  Zap,
  Store,
  Trophy,
  Plus,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import { fetchConversations } from "@/store/slices/dmSlice";
import FindConversationDialog from "./FindConversationDialog";
import { useNavigate } from "react-router";
import SidebarUserPanel from "./SidebarUserPanel";

interface DMSidebarProps {
  onSelectFriends: () => void;
  onSelectDM: (userId: string) => void;
  selectedView: "friends" | "dm";
  selectedDMUserId: string | null;
}

const DMSidebar = ({
  onSelectFriends,
  onSelectDM,
  selectedView,
  selectedDMUserId,
}: DMSidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { conversations } = useSelector((state: RootState) => state.dm);
  const [hoveredDM, setHoveredDM] = useState<string | null>(null);
  const [showFindDialog, setShowFindDialog] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user]);

  const menuItems = [
    {
      id: "friends",
      icon: Users,
      label: "Friends",
      onClick: onSelectFriends,
      active: selectedView === "friends",
    },
    {
      id: "nitro",
      icon: Zap,
      label: "Nitro",
      onClick: () => {},
      active: false,
      badge: "Coming Soon",
    },
    {
      id: "shop",
      icon: Store,
      label: "Shop",
      onClick: () => {},
      active: false,
      badge: "Coming Soon",
    },
    {
      id: "quests",
      icon: Trophy,
      label: "Quests",
      onClick: () => {},
      active: false,
    },
  ];

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="w-60 bg-[#111214] flex flex-col h-full">
      {/* Search Bar */}
      <div className="h-12 px-2 flex items-center border-b border-[#050505] shadow-sm bg-[#111214]">
        <button
          onClick={() => setShowFindDialog(true)}
          className="w-full px-2 py-1.5 bg-[#1e1f22] rounded text-sm text-[#949ba4] hover:text-gray-200 text-left transition-colors"
        >
          Find or start a conversation
        </button>
        <FindConversationDialog
          open={showFindDialog}
          onOpenChange={setShowFindDialog}
          onSelectDM={onSelectDM}
        />
      </div>

      {/* Navigation Menu */}
      <div className="px-2 py-2 space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/5 transition-colors ${
              item.active
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-xs text-[#00a8fc] font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="px-4 py-1">
        <div className="border-t border-white/5" />
      </div>

      {/* Direct Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-2">
          <div className="flex items-center justify-between px-2 mb-1">
            <h3 className="text-xs font-semibold text-[#949ba4] uppercase">
              Direct Messages
            </h3>
            <button 
                className="text-[#949ba4] hover:text-white transition-colors"
                aria-label="Create DM"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-0.5">
            {conversations.map((conv, idx: number) => {
              if (!conv.participant) return null;
              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setHoveredDM(conv.participantId)}
                  onMouseLeave={() => setHoveredDM(null)}
                >
                  <button
                    onClick={() => onSelectDM(conv.participantId)}
                    className={`w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-white/5 transition-colors ${
                      selectedView === "dm" &&
                      selectedDMUserId === conv.participantId
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center">
                        {conv.participant.imageUrl ? (
                          <img
                            src={conv.participant.imageUrl}
                            alt={conv.participant.username}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-semibold">
                            {getInitials(conv.participant.username)}
                          </span>
                        )}
                      </div>
                      {conv.participant.status === "online" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] border-2 border-[#2b2d31] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium truncate block">
                        {conv.participant.username}
                      </span>
                      {conv.unreadCount > 0 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#f23f43] rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-semibold">
                            {conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>

                  {hoveredDM === conv.participantId && (
                    <button 
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#949ba4] hover:text-white bg-[#2b2d31] rounded transition-colors"
                        aria-label="Close DM"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Panel */}
      <SidebarUserPanel />
    </div>
  );
};

export default DMSidebar;
