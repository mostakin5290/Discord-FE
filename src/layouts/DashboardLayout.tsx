
import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { fetchUserServers } from "@/store/slices/serverSlice";
import { setSettingsModalOpen } from "@/store/slices/modalSlice";
import ServerSidebar from "@/components/server/ServerSidebar";
import CreateServerDialog from "@/components/server/CreateServerDialog";
import SettingsModal from "@/components/settings/user/SettingsModal";

const DashboardLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { serverId } = useParams<{ serverId?: string }>();
  
  const { servers } = useSelector((state: RootState) => state.server);
  const { settingsModalOpen } = useSelector((state: RootState) => state.modal);
  
  const [showCreateServer, setShowCreateServer] = useState(false);

  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);

  const handleServerSelect = useCallback((id: string) => {
    navigate(`/server/${id}`);
  }, [navigate]);

  const handleCreateServer = useCallback(() => {
    setShowCreateServer(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#0b0c0e] text-white overflow-hidden">
      {/* Persistent Server Sidebar */}
      <ServerSidebar
        servers={servers}
        currentServerId={serverId || null}
        onServerSelect={handleServerSelect}
        onCreateServer={handleCreateServer}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         <Outlet />
      </div>

      {/* Global Modals */}
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

export default DashboardLayout;
