import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import {
  fetchUserServers,
} from "@/store/slices/serverSlice";
import ServerSidebar from "@/components/server/ServerSidebar";
import CreateServerDialog from "@/components/server/CreateServerDialog";
import { useLocation, useNavigate, useParams } from "react-router";
import { InvitecodeModal } from "@/components/server/Invitecode-modal";
import { CreateChannelModal } from "@/components/server/create-channel-modal";
import SettingsModal from "@/components/settings/user/SettingsModal";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import DiscoveryPageSidebar from "@/components/discovery/discovery-page-sidebar";
import DiscoveryContent from "@/components/discovery/discovery-content";


const DiscoveryPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const discoveryTab = useLocation().pathname.split("/").pop();


  const { settingsModalOpen } = useSelector((state: RootState) => state.modal);
  const { serverId: serverIdFromUrl } = useParams<{ serverId: string; channelId?: string }>();
  const navigate = useNavigate();

  const { servers, currentServer } = useSelector(
    (state: RootState) => state.server
  );

  const [showCreateServer, setShowCreateServer] = useState(false);

  // Fetch user's servers on mount
  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);

  const handleServerSelect = useCallback((serverId: string) => {
    navigate(`/server/${serverId}`);
  }, [navigate]);

  const handleCreateServer = useCallback(() => {
    setShowCreateServer(true);
  }, []);


  return (
    <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
      {/* Server List Sidebar (Left) */}
      <ServerSidebar
        servers={servers}
        currentServerId={currentServer?.id || null}
        onServerSelect={handleServerSelect}
        onCreateServer={handleCreateServer}
      />

      <DiscoveryPageSidebar />

      {discoveryTab === "apps" && <DiscoveryContent tab="apps" />}
      {discoveryTab === "servers" && <DiscoveryContent tab="servers" />}
      {discoveryTab === "quests" && <DiscoveryContent tab="quests" />}

      {/* Create Server Dialog */}
      <CreateServerDialog
        open={showCreateServer}
        onOpenChange={setShowCreateServer}
      />

      {currentServer &&
        <InvitecodeModal
          serverId={serverIdFromUrl || ""}
        />
      }

      {currentServer &&
        <CreateChannelModal
          serverId={serverIdFromUrl || ""}
        />
      }

      <SettingsModal
        open={settingsModalOpen}
        onOpenChange={() => dispatch(setSettingsModalOpen())}
      />
    </div>
  );
};

export default DiscoveryPage;
