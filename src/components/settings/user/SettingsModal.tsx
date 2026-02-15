import SettingsSidebar from "./SettingsSidebar";
import MyAccount from "./MyAccount";
import ProfileSettings from "./ProfileSettings";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import VoiceAndVideo from "./VoiceAndVideo";
import Appearance from "./Appearance";

export type SettingsTab =
  | "account"
  | "profile"
  | "content"
  | "privacy"
  | "family"
  | "authorized"
  | "devices"
  | "connections"
  | "clips"
  | "notifications"
  | "nitro"
  | "serverboost"
  | "subscriptions"
  | "gift"
  | "billing"
  | "appearance"
  | "accessibility"
  | "voice"
  | "chat"
  | "keybinds"
  | "language"
  | "streamer"
  | "advanced"
  | "activity";

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onOpenChange]);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <MyAccount onEditProfile={() => setActiveTab("profile")} />;
      case "profile":
        return <ProfileSettings />;
      case "voice":
        return <VoiceAndVideo />;
      case "appearance":
        return <Appearance />;
      default:
        return (
          <div className="p-8 text-[#b5bac1]">
            <h2 className="text-2xl font-bold text-white mb-4 capitalize">
              {activeTab} Settings
            </h2>
            <p>This section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1400px] w-[90vw] h-[90vh] bg-[#313338] p-0 border-none rounded-xl flex overflow-hidden shadow-2xl my-auto mx-auto">
        <DialogTitle className="sr-only">User Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your account settings and preferences
        </DialogDescription>
        <div className="flex w-full h-full">
          {/* Sidebar Column */}
          <div className="w-[260px] min-w-[260px] bg-[#2b2d31] flex justify-end py-[60px] pr-[6px] animate-in slide-in-from-left duration-300 rounded-l-xl">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Content Column */}
          <div className="flex-1 bg-[#313338] py-[60px] pl-[40px] pr-[20px] relative overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-[#1a1b1e] scrollbar-track-transparent hover:scrollbar-thumb-[#1e1f22] rounded-r-xl">
            <div
              className="max-w-[1000px] pr-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
              key={activeTab}
            >
              {renderContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
