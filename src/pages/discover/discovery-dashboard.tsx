import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import {
  fetchUserServers,
  fetchServerById,
} from "@/store/slices/serverSlice";
import ServerSidebar from "@/components/dashboard/ServerSidebar";
import CreateServerDialog from "@/components/dashboard/CreateServerDialog";
import { useLocation, useNavigate, useParams } from "react-router";
import { InvitecodeModal } from "@/components/dashboard/Invitecode-modal";
import { CreateChannelModal } from "@/components/dashboard/create-channel-modal";
import SettingsModal from "@/components/dashboard/settings/SettingsModal";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import DiscoveryPageSidebar from "@/components/discovery/discovery-page-sidebar";
import DiscoveryContent from "@/components/discovery/discovery-content";

type ServerAccessStatus = "loading" | "valid" | "not_found" | "not_member";

const DiscoveryPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const discoveryTab = useLocation().pathname.split("/").pop();

  console.log(discoveryTab);

  const { settingsModalOpen } = useSelector((state: RootState) => state.modal);
  const { serverId: serverIdFromUrl, channelId: channelIdFromUrl } = useParams<{ serverId: string; channelId?: string }>();
  const navigate = useNavigate();

  const { servers, currentServer, isLoading } = useSelector(
    (state: RootState) => state.server
  );

  const [showCreateServer, setShowCreateServer] = useState(false);
  const [accessStatus, setAccessStatus] = useState<ServerAccessStatus>("loading");

  // Track which server ID we've validated to avoid re-running
  const validatedServerIdRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);

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


  // Error states
  // if (accessStatus === "not_found") {
  //   return (
  //     <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
  //       <ServerSidebar
  //         servers={servers}
  //         currentServerId={null}
  //         onServerSelect={handleServerSelect}
  //         onCreateServer={handleCreateServer}
  //       />
  //       <ServerErrorScreen type="not_found" serverId={serverIdFromUrl} />
  //       <CreateServerDialog
  //         open={showCreateServer}
  //         onOpenChange={setShowCreateServer}
  //       />
  //     </div>
  //   );
  // }

  // if (accessStatus === "not_member") {
  //   return (
  //     <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
  //       <ServerSidebar
  //         servers={servers}
  //         currentServerId={null}
  //         onServerSelect={handleServerSelect}
  //         onCreateServer={handleCreateServer}
  //       />
  //       <ServerErrorScreen type="not_member" serverId={serverIdFromUrl} />
  //       <CreateServerDialog
  //         open={showCreateServer}
  //         onOpenChange={setShowCreateServer}
  //       />
  //     </div>
  //   );
  // }

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
