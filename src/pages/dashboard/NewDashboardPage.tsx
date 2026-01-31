import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import {
  fetchUserServers,
  fetchServerById,
} from "@/store/slices/serverSlice";
import { fetchChannelMessages } from "@/store/slices/messageSlice";
import ServerSidebar from "@/components/dashboard/ServerSidebar";
import ChannelSidebar from "@/components/dashboard/ChannelSidebar";
import ChatArea from "@/components/dashboard/ChatArea";
import MemberList from "@/components/dashboard/MemberList";
import CreateServerDialog from "@/components/dashboard/CreateServerDialog";
import ServerErrorScreen from "@/components/dashboard/ServerErrorScreen";
import { useNavigate, useParams } from "react-router";
import { InvitecodeModal } from "@/components/dashboard/Invitecode-modal";
import { LeaveServerModal } from "@/components/dashboard/leave-server-modal";
import { CreateChannelModal } from "@/components/dashboard/create-channel-modal";
import SettingsModal from "@/components/dashboard/settings/SettingsModal";
import ServerSettingsDialog from "@/components/dashboard/settings/ServerSettingsDialog";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import { CallGroupComponent } from "@/components/calls/call-group-component";
import { clearGroupCall, removeUserFromChannel, createGroupCallToken } from "@/store/slices/mediaChannelSlice";

type ServerAccessStatus = "loading" | "valid" | "not_found" | "not_member";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const { settingsModalOpen } = useSelector((state: RootState) => state.modal);
  const { serverId: serverIdFromUrl, channelId: channelIdFromUrl } = useParams<{ serverId: string; channelId?: string }>();
  const navigate = useNavigate();

  const { servers, currentServer, isLoading } = useSelector(
    (state: RootState) => state.server
  );

  const currentChannel = currentServer?.channels?.find((c) => c.id === channelIdFromUrl);
  const currentChannelType = currentChannel?.type;
  const isMediaChannel = currentChannelType === "AUDIO" || currentChannelType === "VIDEO";

  const { groupCall, isLoading: isGroupCallLoading } = useSelector((state: RootState) => state.groupCall);

  const userMember = currentServer?.members?.find((m) => m.user?.id === user?.id);

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

  // Join group call if navigating directly to a media channel
  useEffect(() => {
    if (
      accessStatus === "valid" &&
      currentServer?.id === serverIdFromUrl &&
      channelIdFromUrl &&
      user
    ) {
      const channel = currentServer?.channels.find((c) => c.id === channelIdFromUrl);
      const isMedia = channel?.type === "AUDIO" || channel?.type === "VIDEO";

      if (isMedia) {
        // Check if we are already in this call
        if (groupCall?.channelId === channelIdFromUrl && groupCall?.token) {
          return;
        }

        // Dispatch action to join/create call token
        dispatch(createGroupCallToken({
          channelId: channelIdFromUrl,
          participantIdentity: user.id,
          participantName: user.username,
          roomName: channelIdFromUrl,
          serverId: serverIdFromUrl ?? "",
        }));
      }
    }
  }, [accessStatus, currentServer, serverIdFromUrl, channelIdFromUrl, user, groupCall?.channelId, groupCall?.token, dispatch]);

  // Auto-redirect to first channel if no channel selected
  useEffect(() => {
    if (
      currentServer &&
      currentServer.channels &&
      currentServer.channels.length > 0 &&
      accessStatus === "valid" &&
      currentServer.id === serverIdFromUrl &&
      !channelIdFromUrl
    ) {
      // Redirect to first channel
      navigate(`/server/${serverIdFromUrl}/${currentServer.channels[0].id}`, { replace: true });
    }
  }, [currentServer, accessStatus, serverIdFromUrl, channelIdFromUrl, navigate]);

  // Fetch messages when channel changes
  useEffect(() => {
    if (channelIdFromUrl) {
      dispatch(fetchChannelMessages({ channelId: channelIdFromUrl }));
    }
  }, [channelIdFromUrl, dispatch]);

  const handleServerSelect = useCallback((serverId: string) => {
    navigate(`/server/${serverId}`);
  }, [navigate]);

  const handleCreateServer = useCallback(() => {
    setShowCreateServer(true);
  }, []);

  const handleLeaveGroupCall = useCallback(() => {
    dispatch(clearGroupCall());
    dispatch(removeUserFromChannel({ channelId: channelIdFromUrl || "", serverId: serverIdFromUrl || "" }));
    navigate("/channels/@me");
  }, [dispatch, navigate, channelIdFromUrl, serverIdFromUrl]);

  // Show loading state - also check if currentServer matches URL to handle navigation race conditions
  const isServerMismatch = currentServer && currentServer.id !== serverIdFromUrl;
  if ((initialLoadRef.current && isLoading) || accessStatus === "loading" || isServerMismatch) {
    return (
      <div className="flex h-screen bg-[#0b0c0e] overflow-hidden">
        {/* Render Sidebar if we have servers, otherwise skeleton? */}
        <ServerSidebar
          servers={servers}
          currentServerId={serverIdFromUrl || null}
          onServerSelect={handleServerSelect}
          onCreateServer={handleCreateServer}
        />
        {/* Loading Content Area */}
        <div className="flex-1 flex flex-col relative bg-[#1a1b1e]">
          {/* Fake Header */}
          <div className="h-12 border-b border-[#202225] bg-[#1a1b1e] w-full" />

          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865f2]" />
            <p className="text-[#949ba4] text-sm font-medium animate-pulse">Loading Discord...</p>
          </div>
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
      <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
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
      <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
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
    <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
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
          selectedChannelId={channelIdFromUrl || null}
        />
      )}

      {/* Main Chat Area (Center) */}
      {currentServer && !isMediaChannel ? (
        channelIdFromUrl && !isMediaChannel ? (
          <ChatArea
            channelId={channelIdFromUrl}
            serverId={serverIdFromUrl || ""}
            channelName={
              currentServer?.channels?.find((c) => c.id === channelIdFromUrl)
                ?.name || "channel"
            }
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-[#1a1b1e]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                Welcome to {currentServer.name}!
              </h2>
              <p>Select a channel to start chatting</p>
            </div>
          </div>
        )
      ) : (
        !isMediaChannel && (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1b1e]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865f2] mb-4" />
            <p className="text-[#949ba4] text-sm font-medium">Loading server data...</p>
          </div>
        )
      )}

      {currentServer ? (
        channelIdFromUrl && isMediaChannel ? (
          isGroupCallLoading || !groupCall || !groupCall.token || groupCall.channelId !== channelIdFromUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1b1e]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865f2] mb-4" />
              <p className="text-[#949ba4] text-sm font-medium">Connecting to channel...</p>
            </div>
          ) : (
            <CallGroupComponent
              token={groupCall.token}
              serverUrl={import.meta.env.VITE_LIVEKIT_URL || ""}
              roomName={groupCall.roomName}
              channelId={groupCall.channelId}
              onDisconnect={handleLeaveGroupCall}
            />
          )
        ) : null
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1b1e]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5865f2] mb-4" />
          <p className="text-[#949ba4] text-sm font-medium">Loading server data...</p>
        </div>
      )}


      {/* Member List Sidebar (Right) */}
      {currentServer && channelIdFromUrl && (
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

      <SettingsModal
        open={settingsModalOpen}
        onOpenChange={() => dispatch(setSettingsModalOpen())}
      />
      
      <ServerSettingsDialog />
    </div>
  );
};

export default DashboardPage;
