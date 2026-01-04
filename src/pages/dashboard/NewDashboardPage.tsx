import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchUserServers,
  setCurrentServer,
  fetchServerById,
} from "@/store/slices/serverSlice";
import { fetchChannelMessages } from "@/store/slices/messageSlice";
import ServerSidebar from "@/components/dashboard/ServerSidebar";
import ChannelSidebar from "@/components/dashboard/ChannelSidebar";
import ChatArea from "@/components/dashboard/ChatArea";
import MemberList from "@/components/dashboard/MemberList";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import LoadingSpinner from "@/components/dashboard/LoadingSpinner";
import CreateServerDialog from "@/components/dashboard/CreateServerDialog";
import { useNavigate } from "react-router";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { servers, currentServer, isLoading } = useSelector(
    (state: RootState) => state.server
  );
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null
  );
  const [showCreateServer, setShowCreateServer] = useState(false);

  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);

  useEffect(() => {
    if (servers.length > 0 && !currentServer) {
      handleServerSelect(servers[0].id);
    }
  }, [servers]);

  useEffect(() => {
    if (
      currentServer?.channels &&
      currentServer.channels.length > 0 &&
      !selectedChannelId
    ) {
      setSelectedChannelId(currentServer.channels[0].id);
    }
  }, [currentServer]);

  useEffect(() => {
    if (selectedChannelId) {
      dispatch(fetchChannelMessages({ channelId: selectedChannelId }));
    }
  }, [selectedChannelId, dispatch]);

  const handleServerSelect = async (serverId: string) => {
    await dispatch(fetchServerById(serverId));
    setSelectedChannelId(null);
  };

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
  };

  const handleCreateServer = () => {
    setShowCreateServer(true);
  };

  if (isLoading && servers.length === 0) {
    return (
      <div className="flex h-screen">
        <LoadingSpinner message="Loading your servers..." />
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
              currentServer?.channels.find((c) => c.id === selectedChannelId)
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
        <WelcomeScreen />
      )}

      {/* Member List Sidebar (Right) */}
      {currentServer && selectedChannelId && (
        <MemberList members={currentServer.members} />
      )}

      {/* Create Server Dialog */}
      <CreateServerDialog
        open={showCreateServer}
        onOpenChange={setShowCreateServer}
      />
    </div>
  );
};

export default DashboardPage;
