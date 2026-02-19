import { useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/types";
import { updateServerDetails } from "@/store/slices/serverSlice";
import { uploadToCloudinary } from "@/lib/upload";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const OverviewTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);

  // State initialization
  const [name, setName] = useState(currentServer?.name || "");
  const [imageUrl, setImageUrl] = useState(currentServer?.imageUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Logic for engagement flags...
  const flags = currentServer?.systemMessageFlags || {
    welcomeMessage: true,
    boostMessage: true,
  };
  const [welcomeMessage, setWelcomeMessage] = useState(
    flags.welcomeMessage ?? true,
  );
  const [boostMessage, setBoostMessage] = useState(flags.boostMessage ?? true);
  const [systemChannelId, setSystemChannelId] = useState(
    currentServer?.systemChannelId || "",
  );

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleSave = async () => {
    if (!currentServer?.id) return;
    setIsLoading(true);
    try {
      let uploadedImageUrl = imageUrl;
      if (imageFile) uploadedImageUrl = await uploadToCloudinary(imageFile);

      const mergedData = {
        name,
        bio: "",
        imageUrl: uploadedImageUrl,
        systemChannelId,
        systemMessageFlags: { welcomeMessage, boostMessage, setupTips: true },
      };

      await dispatch(
        updateServerDetails({ serverId: currentServer.id, data: mergedData }),
      ).unwrap();
      toast.success("Settings updated!");
      setImageFile(null);
    } catch (error: any) {
      toast.error(error || "Failed to save");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 className="text-[20px] font-bold text-white mb-4">Server Overview</h2>

      {/* Top Section: Image & Name */}
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center gap-2">
          <div className="relative group cursor-pointer" {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-[#1e1f22] flex items-center justify-center group-hover:shadow-xl transition-all relative">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Icon"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl text-[#b5bac1]">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-white uppercase text-center">
                  Change
                  <br />
                  Icon
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#949ba4] font-medium uppercase mt-1">
            Minimum Size: 128x128
          </p>
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-[#b5bac1] uppercase">
              Server Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#1e1f22] border-none text-white h-10 font-medium focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-[#3f4147] w-full" />

      {/* System Messages */}
      <div className="space-y-6">
        <h3 className="text-xs font-bold text-[#949ba4] uppercase">
          System Messages
        </h3>

        <div className="space-y-1.5">
          <Label className="text-[#dbdee1] font-medium text-sm">
            System Messages Channel
          </Label>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-[4px] px-3 py-2.5 text-sm bg-[#1e1f22] hover:bg-[#1e1f22] border-none text-[#dbdee1] outline-none">
              <span>
                {currentServer?.channels?.find((c) => c.id === systemChannelId)
                  ?.name
                  ? `#${currentServer.channels.find((c) => c.id === systemChannelId)?.name}`
                  : "Select a channel"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1e1f22] border-[#2b2d31] text-[#dbdee1] w-[var(--radix-dropdown-menu-trigger-width)]">
              {currentServer?.channels
                ?.filter((c) => c.type === "TEXT")
                .map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => setSystemChannelId(c.id)}
                    className="focus:bg-[#404249] focus:text-white cursor-pointer"
                  >
                    #{c.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs text-[#949ba4]">
            System messages will be sent to this channel.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          {[
            {
              label:
                "Send a random welcome message when someone joins this server.",
              checked: welcomeMessage,
              set: setWelcomeMessage,
            },
            {
              label: "Send a message when someone Boosts this server.",
              checked: boostMessage,
              set: setBoostMessage,
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <Label className="text-[#dbdee1] font-normal text-[14px]">
                {item.label}
              </Label>
              <Switch
                checked={item.checked}
                onCheckedChange={item.set}
                className="data-[state=checked]:bg-[#23a559] data-[state=unchecked]:bg-[#80848e]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Save Bar Logic (Simplified for now as a static bar) */}
      <div className="pt-6 pb-2">
        <div className="bg-[#111214] p-3 rounded-[5px] flex justify-between items-center transition-all">
          <span className="text-white text-sm font-medium pl-2">
            Careful — you have unsaved changes!
          </span>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setName(currentServer?.name || "")}
              className="text-white hover:underline h-8"
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-[#248046] hover:bg-[#1a6334] text-white h-8 px-6 transition-colors"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
