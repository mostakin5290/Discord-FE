import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/types";
import { updateServerDetails } from "@/store/slices/serverSlice";
import { toast } from "sonner";
import { PartyPopper } from "lucide-react";

const EngagementTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);

  // Default flags if not present
  const flags = currentServer?.systemMessageFlags || {
      welcomeMessage: true,
      boostMessage: true,
      setupTips: true
  };

  const [welcomeMessage, setWelcomeMessage] = useState(flags.welcomeMessage ?? true);
  const [boostMessage, setBoostMessage] = useState(flags.boostMessage ?? true);
  const [systemChannelId, setSystemChannelId] = useState(currentServer?.systemChannelId || "");

  const handleSave = async (updates: any) => {
      if (!currentServer?.id) return;
      try {
          await dispatch(updateServerDetails({
              serverId: currentServer.id,
              data: {
                  ...currentServer, // Spread current info to avoid overwriting with empty
                  imageUrl: currentServer.imageUrl, // Type safety
                  bio: currentServer.bio || "",
                  name: currentServer.name,
                  systemChannelId: updates.systemChannelId ?? systemChannelId,
                  systemMessageFlags: {
                      welcomeMessage: updates.welcomeMessage ?? welcomeMessage,
                      boostMessage: updates.boostMessage ?? boostMessage,
                      setupTips: true
                  }
              }
          })).unwrap();
          // Update local state if needed via re-render props
          toast.success("Engagement settings updated");
      } catch (error) {
          toast.error("Failed to update engagement settings");
      }
  };

  const toggleWelcome = (checked: boolean) => {
      setWelcomeMessage(checked);
      handleSave({ welcomeMessage: checked });
  };

  const toggleBoost = (checked: boolean) => {
      setBoostMessage(checked);
      handleSave({ boostMessage: checked });
  };

  const changeSystemChannel = (channelId: string) => {
      setSystemChannelId(channelId);
      handleSave({ systemChannelId: channelId });
  };

  return (
    <div className="space-y-8 pb-10">
        <div>
            <h2 className="text-xl font-bold text-white mb-2">Overview</h2>
            <p className="text-sm text-[#949ba4]">
                Manage settings that help keep your server active and engaging.
            </p>
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold text-[#949ba4] uppercase mb-4">System Messages</h3>
            
            {/* System Channel Selection */}
            <div className="space-y-2">
                 <Label className="text-[#dbdee1] font-medium">System Messages Channel</Label>
                 <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm bg-[#1e1f22] border-none text-[#dbdee1] focus:outline-none focus:ring-2 focus:ring-[#5865f2]">
                          <span>
                            {currentServer?.channels?.find(c => c.id === systemChannelId)?.name 
                                ? `# ${currentServer.channels.find(c => c.id === systemChannelId)?.name}` 
                                : "Select a channel"}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1e1f22] border-[#2b2d31] text-[#dbdee1] w-[var(--radix-dropdown-menu-trigger-width)]">
                          {currentServer?.channels
                             ?.filter(c => c.type === 'TEXT')
                             .map(channel => (
                                <DropdownMenuItem 
                                    key={channel.id} 
                                    onClick={() => changeSystemChannel(channel.id)} 
                                    className="focus:bg-[#35373c] focus:text-white cursor-pointer"
                                >
                                     # {channel.name}
                                </DropdownMenuItem>
                             ))}
                      </DropdownMenuContent>
                 </DropdownMenu>
                 <p className="text-xs text-[#949ba4]">This is the channel where we send system event messages.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#3f4147]">
                 <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                           <Label className="text-[#dbdee1] font-medium">Send a random welcome message when someone joins this server.</Label>
                      </div>
                      <Switch 
                        checked={welcomeMessage}
                        onCheckedChange={toggleWelcome}
                        className="data-[state=checked]:bg-[#23a559]"
                      />
                 </div>

                 <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                           <Label className="text-[#dbdee1] font-medium">Send a message when someone Boosts this server.</Label>
                      </div>
                      <Switch 
                        checked={boostMessage}
                        onCheckedChange={toggleBoost}
                         className="data-[state=checked]:bg-[#23a559]"
                      />
                 </div>
            </div>
        </div>

        <div className="p-4 bg-[#2b2d31] rounded-lg border border-[#1e1f22] flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-[#f47fff] flex items-center justify-center shrink-0">
                  <PartyPopper className="text-white w-6 h-6" />
             </div>
             <div>
                 <h4 className="text-[#dbdee1] font-bold">Boost Perks</h4>
                 <p className="text-xs text-[#949ba4]">Level up your server with Server Boosts to unlock more emoji slots, better audio quality, and more!</p>
             </div>
        </div>
    </div>
  );
};

export default EngagementTab;
