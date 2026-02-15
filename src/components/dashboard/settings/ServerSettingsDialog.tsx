import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store/types";
import { setServerSettingsModalOpen } from "@/store/slices/modalSlice";
import { deleteServer } from "@/store/slices/serverSlice";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Tabs
import OverviewTab from "./OverviewTab";
import RolesTab from "./RolesTab";
import MembersTab from "./MembersTab";
import InvitesTab from "./InvitesTab";
import EngagementTab from "./EngagementTab";

const ServerSettingsDialog = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { serverSettingsModalOpen } = useSelector((state: RootState) => state.modal);
  const { currentServer } = useSelector((state: RootState) => state.server);

  const [activeTab, setActiveTab] = useState("overview");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serverNameConfirm, setServerNameConfirm] = useState("");

  const handleClose = () => {
    dispatch(setServerSettingsModalOpen());
  };

  const handleDeleteServer = async () => {
      if (!currentServer) return;
      if (serverNameConfirm !== currentServer.name) {
          toast.error("Server name does not match");
          return;
      }

      try {
          await dispatch(deleteServer(currentServer.id)).unwrap();
          dispatch(setServerSettingsModalOpen());
          toast.success("Server deleted successfully");
          // Navigation handled by state change or parent component
      } catch (error) {
          toast.error(error as string || "Failed to delete server");
      }
  };

  if (!currentServer) return null;

  const tabs = [
      { id: "overview", label: "Overview" },
      { id: "roles", label: "Roles" },
      { id: "emoji", label: "Emoji" },
      { id: "stickers", label: "Stickers" },
      { id: "soundboard", label: "Soundboard" },
      { id: "widget", label: "Widget" },
      { id: "audit-log", label: "Audit Log" },
      { id: "divider-1", type: "divider" },
      { id: "members", label: "Members" },
      { id: "invites", label: "Invites" },
      { id: "bans", label: "Bans" },
       { id: "divider-2", type: "divider" },
      { id: "engagement", label: "Engagement" }, 
  ];

  return (
    <Dialog open={serverSettingsModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#313338] max-w-[1000px] h-[85vh] max-h-[800px] text-white flex border-none shadow-2xl rounded-lg [&>button]:hidden">
        <DialogTitle className="hidden ">Server Settings</DialogTitle>
        <DialogDescription className="hidden ">Manage your server settings, roles, members, and more.</DialogDescription>
        {/* Sidebar */}
        <div className="w-[240px] rounded-lg  flex-shrink-0 bg-[#2B2D31] flex flex-col pt-10 pb-4 ">
          <div className="px-4 mb-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2 truncate">
              {currentServer.name.toUpperCase()}
            </h2>
          </div>
          
          <div className="flex flex-col px-2 space-y-0.5">
             {tabs.map((tab) => (
                 tab.type === "divider" ? (
                     <div key={tab.id} className="h-[1px] bg-[#3f4147] my-2 mx-2" />
                 ) : (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id || "")}
                        className={cn(
                            "text-left px-2 py-1.5 rounded-[4px] text-[15px] font-medium transition-colors mx-2",
                            activeTab === tab.id
                                ? "bg-[#404249] text-white"
                                : "text-[#b5bac1] hover:bg-[#35373C] hover:text-[#dbdee1]"
                        )}
                     >
                         {tab.label}
                     </button>
                 )
             ))}
             
             <div className="h-[1px] bg-[#3f4147] my-2 mx-2" />
             
             <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="text-left px-2 py-1.5 rounded-[4px] text-[15px] font-medium transition-colors mx-2 text-red-400 hover:bg-[#35373C]"
             >
                 Delete Server
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#313338] flex flex-col relative w-full h-full min-w-0">
           <div className="absolute top-4 right-4 z-10">
              <div 
                onClick={handleClose} 
                className="cursor-pointer group flex flex-col items-center justify-center border-2 border-[#b5bac1] rounded-full w-9 h-9 hover:bg-[#dbdee1] transition-all opacity-80 hover:opacity-100"
              >
                  <X className="w-5 h-5 text-[#b5bac1] group-hover:text-black font-bold" strokeWidth={2.5} />
              </div>
               <div className="text-[11px] text-[#b5bac1] font-bold text-center mt-1 uppercase tracking-wide">Esc</div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 pr-20  w-full">
               {/* Wrapper to constrain width similar to Discord */}
               <div className="max-w-[700px] min-w-[500px]">
                    {activeTab === "overview" && <OverviewTab />}
                    {activeTab === "roles" && <RolesTab />}
                    {activeTab === "members" && <MembersTab />}
                    {activeTab === "invites" && <InvitesTab />}
                    {activeTab === "engagement" && <EngagementTab />}
                    
                    {/* Placeholders for unimplemented tabs */}
                    {!["overview", "roles", "members", "invites", "engagement"].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-64 text-[#949ba4]">
                            <Shield className="w-16 h-16 mb-4 opacity-50" />
                            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                            <p>This setting is not implemented yet.</p>
                        </div>
                    )}
               </div>
          </div>
        </div>
      </DialogContent>


      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#313338] border-none text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete '{currentServer.name}'</AlertDialogTitle>
            <AlertDialogDescription className="text-[#b5bac1]">
              Are you sure you want to delete <span className="font-bold text-white">{currentServer.name}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4">
              <label className="text-xs font-bold text-[#b5bac1] uppercase mb-2 block">
                  Enter Server Name
              </label>
              <input
                value={serverNameConfirm}
                onChange={(e) => setServerNameConfirm(e.target.value)}
                placeholder={currentServer.name}
                className="w-full bg-[#1e1f22] p-2 rounded text-white focus:outline-none"
              />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#474a50] hover:bg-[#474a50]/80 text-white border-none">Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDeleteServer}
                className="bg-[#da373c] hover:bg-[#da373c]/80 text-white"
            >
                Delete Server
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default ServerSettingsDialog;
