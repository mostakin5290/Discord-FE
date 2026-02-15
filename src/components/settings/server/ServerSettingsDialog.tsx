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
// Tabs
import OverviewTab from "./OverviewTab";
import RolesTab from "./RolesTab";
import MembersTab from "./MembersTab";
import BansTab from "./BansTab";

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
      { id: "bans", label: "Bans" },
  ];

  return (
    <Dialog open={serverSettingsModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 bg-[#313338] min-w-[800px] w-full max-w-[1100px] h-[85vh] max-h-[800px] text-white flex border-none shadow-none rounded-none overflow-hidden [&>button]:hidden focus:outline-none">
        <DialogTitle className="hidden">Server Settings</DialogTitle>
        <DialogDescription className="hidden">Manage your server settings, roles, members, and more.</DialogDescription>
        
        {/* Sidebar */}
        <div className="w-[218px] flex-shrink-0 bg-[#2B2D31] flex flex-col items-end py-[60px] pr-1.5">
          <div className="w-[190px] px-2.5 space-y-0.5">
             <div className="px-2.5 mb-2">
                <h2 className="text-xs font-bold text-[#949ba4] uppercase px-2 truncate leading-4 mb-3">
                  {currentServer.name}
                </h2>
             </div>

             {tabs.map((tab) => (
                 tab.type === "divider" ? (
                     <div key={tab.id} className="h-[1px] bg-[#3f4147] my-2 mx-2" />
                 ) : (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id || "")}
                        className={cn(
                            "w-full text-left px-2.5 py-1.5 rounded-[4px] text-[15px] font-medium transition-colors cursor-pointer flex justify-between items-center group",
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
                className="w-full text-left px-2.5 py-1.5 rounded-[4px] text-[15px] font-medium transition-colors cursor-pointer text-[#dbdee1] hover:bg-[#da373c] hover:text-white flex justify-between items-center group"
             >
                 Delete Server
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#313338] flex flex-col min-w-0 h-full">
           <div className="flex-1 overflow-y-auto px-10 pt-[60px] pb-20 ">
                <div className="max-w-[740px] min-w-[460px] relative">
                     {activeTab === "overview" && <OverviewTab />}
                     {activeTab === "roles" && <RolesTab />}
                     {activeTab === "members" && <MembersTab />}
                     {activeTab === "bans" && <BansTab />}
                     
                     {/* Placeholders for unimplemented tabs */}
                     {!["overview", "roles", "members", "bans"].includes(activeTab) && (
                         <div className="flex flex-col items-center justify-center mt-20 text-[#949ba4]">
                             <Shield className="w-16 h-16 mb-4 opacity-50" />
                             <h3 className="text-xl font-bold mb-2 text-white">Coming Soon</h3>
                             <p className="text-center max-w-md">
                                 This setting implementation is coming soon. Stay tuned!
                             </p>
                         </div>
                     )}

                     {/* Fixed Close Button Column (visual layout trick) */}
                     <div className="fixed top-[60px] right-[40px] flex flex-col items-center z-50">
                        <div 
                            onClick={handleClose} 
                            className="cursor-pointer group flex flex-col items-center justify-center border-2 border-[#b5bac1] rounded-full w-9 h-9 hover:bg-[#dbdee1] transition-all opacity-80 hover:opacity-100"
                        >
                            <X className="w-5 h-5 text-[#b5bac1] group-hover:text-black font-bold" strokeWidth={2.5} />
                        </div>
                        <div className="text-[11px] text-[#b5bac1] font-bold text-center mt-2 uppercase tracking-wide">Esc</div>
                    </div>
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
