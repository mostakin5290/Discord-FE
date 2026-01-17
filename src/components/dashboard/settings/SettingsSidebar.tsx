import type { SettingsTab } from "./SettingsModal";
import { LogOut, ExternalLink } from "lucide-react";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const SettingsSidebar = ({ activeTab, onTabChange }: SettingsSidebarProps) => {
  const navItemClass = (tab: SettingsTab) => `
        w-full text-left px-[10px] py-[6px] rounded-[4px] text-[15px] font-medium mb-[2px] transition-all duration-300 cursor-pointer
        ${
          activeTab === tab
            ? "bg-[#404249] text-white shadow-md scale-105 translate-x-1"
            : "text-[#b5bac1] hover:bg-[#35363c] hover:text-[#dbdee1] hover:pl-3 hover:scale-105 hover:shadow-sm"
        }
    `;

  const logoutClass = `
        w-full text-left px-[10px] py-[6px] rounded-[4px] text-[15px] font-medium mb-[2px] transition-all duration-300 cursor-pointer
        text-[#fa777c] hover:bg-[#fa777c]/10 hover:pl-3 hover:scale-105 hover:shadow-md
    `;

  return (
    <div className="w-[240px] flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a1b1e] scrollbar-track-transparent hover:scrollbar-thumb-[#1e1f22] pr-2 animate-in fade-in slide-in-from-left duration-500">
      <div className="px-[10px] pb-1.5 pt-1">
        <h3 className="text-xs font-bold text-[#949ba4] uppercase truncate tracking-wide">
          User Settings
        </h3>
      </div>

      <button
        className={navItemClass("account")}
        onClick={() => onTabChange("account")}
      >
        My Account
      </button>
      <button
        className={navItemClass("profile")}
        onClick={() => onTabChange("profile")}
      >
        Profiles
      </button>
      <button
        className={navItemClass("content")}
        onClick={() => onTabChange("content")}
      >
        Content & Social
      </button>
      <button
        className={navItemClass("privacy")}
        onClick={() => onTabChange("privacy")}
      >
        Data & Privacy
      </button>
      <button
        className={navItemClass("family")}
        onClick={() => onTabChange("family")}
      >
        Family Centre
      </button>
      <button
        className={navItemClass("authorized")}
        onClick={() => onTabChange("authorized")}
      >
        Authorised Apps
      </button>
      <button
        className={navItemClass("devices")}
        onClick={() => onTabChange("devices")}
      >
        Devices
      </button>
      <button
        className={navItemClass("connections")}
        onClick={() => onTabChange("connections")}
      >
        Connections
      </button>
      <button
        className={navItemClass("clips")}
        onClick={() => onTabChange("clips")}
      >
        Clips
      </button>
      <button
        className={navItemClass("notifications")}
        onClick={() => onTabChange("notifications")}
      >
        Notifications
      </button>

      <div className="px-[10px] pb-1.5 pt-4">
        <hr className="border-[#3f4147]" />
      </div>

      <div className="px-[10px] pb-1.5 pt-3">
        <h3 className="text-xs font-bold text-[#949ba4] uppercase truncate">
          Payment Settings
        </h3>
      </div>
      <button
        className={navItemClass("nitro")}
        onClick={() => onTabChange("nitro")}
      >
        Nitro
      </button>
      <button
        className={navItemClass("serverboost")}
        onClick={() => onTabChange("serverboost")}
      >
        Server Boost
      </button>
      <button
        className={navItemClass("subscriptions")}
        onClick={() => onTabChange("subscriptions")}
      >
        Subscriptions
      </button>
      <button
        className={navItemClass("gift")}
        onClick={() => onTabChange("gift")}
      >
        Gift Inventory
      </button>
      <button
        className={navItemClass("billing")}
        onClick={() => onTabChange("billing")}
      >
        Billing
      </button>

      <div className="px-[10px] pb-1.5 pt-4">
        <hr className="border-[#3f4147]" />
      </div>

      <div className="px-[10px] pb-1.5 pt-3">
        <h3 className="text-xs font-bold text-[#949ba4] uppercase truncate">
          App Settings
        </h3>
      </div>

      <button
        className={navItemClass("appearance")}
        onClick={() => onTabChange("appearance")}
      >
        Appearance
      </button>
      <button
        className={navItemClass("accessibility")}
        onClick={() => onTabChange("accessibility")}
      >
        Accessibility
      </button>
      <button
        className={navItemClass("voice")}
        onClick={() => onTabChange("voice")}
      >
        Voice & Video
      </button>
      <button
        className={navItemClass("chat")}
        onClick={() => onTabChange("chat")}
      >
        Chat
      </button>
      <button
        className={navItemClass("keybinds")}
        onClick={() => onTabChange("keybinds")}
      >
        Keybinds
      </button>
      <button
        className={navItemClass("language")}
        onClick={() => onTabChange("language")}
      >
        Language & Time
      </button>
      <button
        className={navItemClass("streamer")}
        onClick={() => onTabChange("streamer")}
      >
        Streamer Mode
      </button>
      <button
        className={navItemClass("advanced")}
        onClick={() => onTabChange("advanced")}
      >
        Advanced
      </button>

      <div className="px-[10px] pb-1.5 pt-4">
        <hr className="border-[#3f4147]" />
      </div>

      <div className="px-[10px] pb-1.5 pt-3">
        <h3 className="text-xs font-bold text-[#949ba4] uppercase truncate">
          Activity Settings
        </h3>
      </div>
      <button
        className={navItemClass("activity")}
        onClick={() => onTabChange("activity")}
      >
        Activity Privacy
      </button>

      <div className="px-[10px] pb-1.5 pt-4">
        <hr className="border-[#3f4147]" />
      </div>

      <button className={logoutClass}>
        Log Out
        <LogOut className="inline ml-auto float-right w-4 h-4 mt-0.5" />
      </button>

      <div className="px-[10px] pb-1.5 pt-4">
        <hr className="border-[#3f4147]" />
      </div>
      <div className="px-[10px] pt-2">
        <p className="text-[12px] text-[#949ba4]">
          Stable 260172 (1a2b3c) <br />
          Host 1.0.9031
        </p>
      </div>
    </div>
  );
};

export default SettingsSidebar;
