import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUserServers } from "@/store/slices/serverSlice";
import ServerSidebar from "@/components/dashboard/ServerSidebar";
import DMSidebar from "@/components/dashboard/DMSidebar";
import FriendsPanel from "@/components/dashboard/FriendsPanel";
import ActiveNow from "@/components/dashboard/ActiveNow";
import DirectMessageChat from "@/components/dashboard/DirectMessageChat";
import CreateServerDialog from "@/components/dashboard/CreateServerDialog";
import UserProfileSidebar from "@/components/dashboard/UserProfileSidebar";
import SettingsModal from "@/components/dashboard/settings/SettingsModal";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";

const DirectMessagesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const { servers } = useSelector((state: RootState) => state.server);
  const { settingsModalOpen } = useSelector((state: RootState) => state.modal);
  const [selectedView, setSelectedView] = useState<"friends" | "dm">("friends");
  const [selectedDMUserId, setSelectedDMUserId] = useState<string | null>(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      setSelectedView("dm");
      setSelectedDMUserId(userId);
    } else {
      setSelectedView("friends");
      setSelectedDMUserId(null);
    }
  }, [userId]);

  const handleSelectFriends = () => {
    setSelectedView("friends");
    setSelectedDMUserId(null);
    navigate("/channels/@me");
  };

  const handleSelectDM = (dmUserId: string) => {
    setSelectedView("dm");
    setSelectedDMUserId(dmUserId);
    navigate(`/dm/${dmUserId}`);
  };

  const handleServerSelect = (serverId: string) => {
    navigate(`/server/${serverId}`);
  };

  const handleCreateServer = () => {
    setShowCreateServer(true);
  };

  return (
    <div className="flex h-screen bg-[#313338] text-white overflow-hidden">
      {/* Server List Sidebar (Left) */}
      <ServerSidebar
        servers={servers}
        currentServerId={null}
        onServerSelect={handleServerSelect}
        onCreateServer={handleCreateServer}
      />

      {/* Left Sidebar - Friends & DM List */}
      <DMSidebar
        onSelectFriends={handleSelectFriends}
        onSelectDM={handleSelectDM}
        selectedView={selectedView}
        selectedDMUserId={selectedDMUserId}
      />

      {/* Middle Panel - Friends or DM Chat */}
      {selectedView === "friends" ? (
        <FriendsPanel />
      ) : (
        selectedDMUserId && (
          <DirectMessageChat
            userId={selectedDMUserId}
            onToggleProfile={() => setShowProfile(!showProfile)}
          />
        )
      )}

      {/* Right Sidebar - Active Now OR User Profile */}
      {selectedView === "friends" ? (
        <ActiveNow />
      ) : (
        selectedDMUserId &&
        showProfile && <UserProfileSidebar userId={selectedDMUserId} />
      )}

      {/* Create Server Dialog */}
      <CreateServerDialog
        open={showCreateServer}
        onOpenChange={setShowCreateServer}
      />
      
      <SettingsModal 
        open={settingsModalOpen} 
        onOpenChange={() => dispatch(setSettingsModalOpen())} 
      />
    </div>
  );
};

export default DirectMessagesPage;
