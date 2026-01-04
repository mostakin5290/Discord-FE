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
import type { AppDispatch } from "@/store/store";
import {
  joinServerWithCode,
  fetchUserServers,
} from "@/store/slices/serverSlice";
import { toast } from "sonner";
import { Users, ArrowRight } from "lucide-react";

interface JoinServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JoinServerDialog = ({ open, onOpenChange }: JoinServerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    setLoading(true);
    try {
      await dispatch(joinServerWithCode(inviteCode.trim())).unwrap();
      toast.success("Successfully joined the server!");
      await dispatch(fetchUserServers());
      onOpenChange(false);
      setInviteCode("");
    } catch (error: any) {
      toast.error(error || "Failed to join server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            Join a Server
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Enter an invite below to join an existing server
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="inviteCode"
              className="text-xs font-bold text-gray-700 uppercase"
            >
              Invite Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="https://discord.gg/hTKzmak or hTKzmak"
              className="bg-gray-100 border-gray-300 focus:border-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJoin();
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Invites should look like{" "}
              <span className="font-mono">hTKzmak</span> or{" "}
              <span className="font-mono">https://discord.gg/hTKzmak</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              setInviteCode("");
            }}
            className="text-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoin}
            disabled={loading || !inviteCode.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Joining..." : "Join Server"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinServerDialog;
