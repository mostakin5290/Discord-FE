import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch } from "@/store/store";
import {
  joinServerWithCode,
  fetchUserServers,
} from "@/store/slices/serverSlice";
import { toast } from "sonner";
import { Users, ArrowRight, Compass, X } from "lucide-react";

interface JoinServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinServerDialog = ({ open, onOpenChange }: JoinServerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    setLoading(true);
    try {
      // Extract code from URL if full URL is pasted
      const code = inviteCode.split("/").pop() ?? inviteCode;
      
      const result = await dispatch(joinServerWithCode(code.trim())).unwrap();
      toast.success("Successfully joined the server!");
      await dispatch(fetchUserServers());
      onOpenChange(false);
      setInviteCode("");
      // Navigate to the joined server
      if (result?.server?.id) {
        navigate(`/server/${result.server.id}`);
      }
    } catch (error: any) {
      toast.error(error || "Failed to join server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-[#313338] text-white border-none p-0 overflow-hidden shadow-2xl rounded-lg">
        <div className="relative"> 
            <button
                onClick={() => onOpenChange(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors z-10"
              >
                <X className="h-6 w-6" />
            </button>

            <div className="p-6 pb-2 text-center">
                <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white text-center drop-shadow-md">
                    Join a Server
                </DialogTitle>
                <DialogDescription className="text-center text-gray-300 mt-2 text-[14px]">
                    Enter an invite below to join an existing server
                </DialogDescription>
                </DialogHeader>
            </div>

            <div className="space-y-6 px-6 py-4">
            <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-[#2B2D31] flex items-center justify-center border-2 border-dashed border-gray-600 shadow-inner">
                   <Compass className="w-10 h-10 text-[#23A559]" />
                </div>
            </div>

            <div className="space-y-2">
                <Label
                htmlFor="inviteCode"
                className="text-xs font-bold text-gray-300 uppercase tracking-wide ml-1"
                >
                Invite Link <span className="text-red-400">*</span>
                </Label>
                <Input
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="https://discord.gg/hTKzmak"
                className="bg-[#1E1F22] border-none text-white focus:bg-black/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-[40px] shadow-inner font-medium placeholder:text-gray-500"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    handleJoin();
                    }
                }}
                />
                <div className="text-xs text-gray-400 mt-1 ml-1">
                Invites should look like{" "}
                <span className="text-gray-300 font-medium">https://discord.gg/hTKzmak</span>
                </div>
            </div>
            </div>

            <div className="bg-[#2B2D31] p-4 flex justify-between items-center mt-2 shadow-inner">
            <Button
                variant="ghost"
                onClick={() => {
                onOpenChange(false);
                setInviteCode("");
                }}
                className="text-white hover:underline hover:bg-transparent pl-0 h-auto p-0 font-medium"
            >
                Back
            </Button>
            <Button
                onClick={handleJoin}
                disabled={loading || !inviteCode.trim()}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 h-[38px] transition-all shadow-md hover:shadow-lg font-medium"
            >
                {loading ? "Joining..." : "Join Server"}
            </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinServerDialog;
