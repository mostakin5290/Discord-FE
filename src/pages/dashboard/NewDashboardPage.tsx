import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchUserServers,
  fetchServerById,
} from "@/store/slices/serverSlice";
import { fetchChannelMessages } from "@/store/slices/messageSlice";
import ServerSidebar from "@/components/dashboard/ServerSidebar";
import ChannelSidebar from "@/components/dashboard/ChannelSidebar";
import ChatArea from "@/components/dashboard/ChatArea";
import MemberList from "@/components/dashboard/MemberList";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import CreateServerDialog from "@/components/dashboard/CreateServerDialog";
import ServerErrorScreen from "@/components/dashboard/ServerErrorScreen";
import { useNavigate, useParams } from "react-router";
import { InvitecodeModal } from "@/components/dashboard/Invitecode-modal";
import { LeaveServerModal } from "@/components/dashboard/leave-server-modal";
import { CreateChannelModal } from "@/components/dashboard/create-channel-modal";

type ServerAccessStatus = "loading" | "valid" | "not_found" | "not_member";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { id: serverIdFromUrl } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { servers, currentServer, isLoading } = useSelector(
    (state: RootState) => state.server
  );


  const userMember = currentServer?.members?.find((m) => m.user?.id === user?.id);


  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [accessStatus, setAccessStatus] = useState<ServerAccessStatus>("loading");

  // Track which server ID we've validated to avoid re-running
  const validatedServerIdRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);

  // Fetch user's servers on mount
  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);

  // Reset access status when server ID changes
  useEffect(() => {
    if (serverIdFromUrl && validatedServerIdRef.current !== serverIdFromUrl) {
      setAccessStatus("loading");
    }
  }, [serverIdFromUrl]);

  // Handle server validation based on URL param
  useEffect(() => {
    // Wait for initial server list to load
    if (initialLoadRef.current && isLoading) {
      return;
    }

    // Mark initial load as complete once we have data or loading finished
    if (initialLoadRef.current && !isLoading) {
      initialLoadRef.current = false;
    }

    // No server ID in URL
    if (!serverIdFromUrl) {
      setAccessStatus("not_found");
      return;
    }

    // Skip if we've already validated this server ID and it's valid
    if (validatedServerIdRef.current === serverIdFromUrl && accessStatus === "valid") {
      return;
    }

    const validateServerAccess = async () => {
      // Check if user is a member of the server (server exists in their list)
      const isMember = servers.some((s) => s.id === serverIdFromUrl);

      if (isMember) {
        // User is a member - fetch server details without showing loading
        try {
          await dispatch(fetchServerById(serverIdFromUrl)).unwrap();
          setAccessStatus("valid");
          validatedServerIdRef.current = serverIdFromUrl;
        } catch (err: any) {
          const errorMessage = err?.toString().toLowerCase() || "";
          if (errorMessage.includes("not found") || errorMessage.includes("404")) {
            setAccessStatus("not_found");
          } else if (errorMessage.includes("not a member") || errorMessage.includes("unauthorized") || errorMessage.includes("403")) {
            setAccessStatus("not_member");
          } else {
            setAccessStatus("not_found");
          }
          validatedServerIdRef.current = serverIdFromUrl;
        }
      } else if (servers.length > 0) {
        // Server not in user's list and we have loaded servers - not a member
        setAccessStatus("not_member");
        validatedServerIdRef.current = serverIdFromUrl;
      } else {
        // No servers loaded yet, try to fetch the server
        try {
          await dispatch(fetchServerById(serverIdFromUrl)).unwrap();
          setAccessStatus("not_member");
        } catch (err: any) {
          const errorMessage = err?.toString().toLowerCase() || "";
          if (errorMessage.includes("not a member") || errorMessage.includes("unauthorized") || errorMessage.includes("403")) {
            setAccessStatus("not_member");
          } else {
            setAccessStatus("not_found");
          }
        }
        validatedServerIdRef.current = serverIdFromUrl;
      }
    };

    validateServerAccess();
  }, [serverIdFromUrl, servers.length, isLoading, dispatch]);

  // Auto-select first channel when server changes
  useEffect(() => {
    if (
      currentServer?.channels &&
      currentServer.channels.length > 0 &&
      accessStatus === "valid" &&
      currentServer.id === serverIdFromUrl // Only auto-select when server matches URL
    ) {
      // Only auto-select if we don't have a selected channel or if server changed
      if (!selectedChannelId || !currentServer.channels.find(c => c.id === selectedChannelId)) {
        setSelectedChannelId(currentServer.channels[0].id);
      }
    }
  }, [currentServer?.id, currentServer?.channels, accessStatus, serverIdFromUrl]);

  // Fetch messages when channel changes
  useEffect(() => {
    if (selectedChannelId) {
      dispatch(fetchChannelMessages({ channelId: selectedChannelId }));
    }
  }, [selectedChannelId, dispatch]);

  const handleServerSelect = useCallback((serverId: string) => {
    // Reset channel selection and navigate
    setSelectedChannelId(null);
    navigate(`/server/${serverId}`);
  }, [navigate]);

  const handleChannelSelect = useCallback((channelId: string) => {
    setSelectedChannelId(channelId);
  }, []);

  const handleCreateServer = useCallback(() => {
    setShowCreateServer(true);
  }, []);

  // Show loading state - also check if currentServer matches URL to handle navigation race conditions
  const isServerMismatch = currentServer && currentServer.id !== serverIdFromUrl;
  if ((initialLoadRef.current && isLoading) || accessStatus === "loading" || isServerMismatch) {
    return (
      <div className="flex h-screen bg-[#313338]">
        <ServerSidebar
          servers={servers}
          currentServerId={serverIdFromUrl || null}
          onServerSelect={handleServerSelect}
          onCreateServer={handleCreateServer}
        />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner message="Loading server..." />
        </div>
        <CreateServerDialog
          open={showCreateServer}
          onOpenChange={setShowCreateServer}
        />
      </div>
    );
  }

  // Error states
  if (accessStatus === "not_found") {
    return (
      <div className="flex h-screen bg-[#313338] text-white overflow-hidden">
        <ServerSidebar
          servers={servers}
          currentServerId={null}
          onServerSelect={handleServerSelect}
          onCreateServer={handleCreateServer}
        />
        <ServerErrorScreen type="not_found" serverId={serverIdFromUrl} />
        <CreateServerDialog
          open={showCreateServer}
          onOpenChange={setShowCreateServer}
        />
      </div>
    );
  }

  if (accessStatus === "not_member") {
    return (
      <div className="flex h-screen bg-[#313338] text-white overflow-hidden">
        <ServerSidebar
          servers={servers}
          currentServerId={null}
          onServerSelect={handleServerSelect}
          onCreateServer={handleCreateServer}
        />
        <ServerErrorScreen type="not_member" serverId={serverIdFromUrl} />
        <CreateServerDialog
          open={showCreateServer}
          onOpenChange={setShowCreateServer}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#313338] text-white overflow-hidden">
      {/* Server List Sidebar (Left) */}
      <ServerSidebar
        servers={servers}
        currentServerId={currentServer?.id || null}
        onServerSelect={handleServerSelect}
        onCreateServer={handleCreateServer}
      />

      {/* Channel List Sidebar (Middle-Left) */}
      {currentServer && (
        <ChannelSidebar
          server={currentServer}
          selectedChannelId={selectedChannelId}
          onChannelSelect={handleChannelSelect}
        />
      )}

      {/* Main Chat Area (Center) */}
      {currentServer ? (
        selectedChannelId ? (
          <ChatArea
            channelId={selectedChannelId}
            channelName={
              currentServer?.channels?.find((c) => c.id === selectedChannelId)
                ?.name || "channel"
            }
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#313338]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to {currentServer.name}!
              </h2>
              <p>Select a channel to start chatting</p>
            </div>
          </div>
        )
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#313338]">
          <LoadingSpinner message="Loading server..." />
        </div>
      )}

      {/* Member List Sidebar (Right) */}
      {currentServer && selectedChannelId && (
        <MemberList members={currentServer.members || []} />
      )}

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
        <LeaveServerModal
          isAdmin={userMember?.role === "ADMIN"}
          serverId={serverIdFromUrl || ""}
        />
      }

      {currentServer &&
        <CreateChannelModal
          serverId={serverIdFromUrl || ""}
        />
      }
    </div>
  );
};

export default DashboardPage;
