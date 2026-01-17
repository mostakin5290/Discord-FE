import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { updatePassword } from "@/store/slices/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is social login (no password)
  const isSocialLogin = user?.provider && !user?.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      toast.success("Password updated successfully");
      onOpenChange(false);
      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error((error as string) || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSocialLogin) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#313338] border-none text-white sm:max-w-[460px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Password Not Available
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-start gap-3 p-4 bg-[#f0b232]/10 border border-[#f0b232]/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-[#f0b232]/50 hover:bg-[#f0b232]/15 animate-in fade-in slide-in-from-bottom duration-400">
            <AlertCircle className="w-5 h-5 text-[#f0b232] mt-0.5 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm text-[#dbdee1] leading-relaxed">
                You signed in using{" "}
                <span className="font-semibold text-white">
                  {user?.provider}
                </span>
                . Password changes are not available for social login accounts.
              </p>
              <p className="text-xs text-[#b5bac1] mt-2">
                To set a password, you can create a new account with email and
                password.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#313338] border-none text-white sm:max-w-[460px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold uppercase tracking-tight">
            Change your password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-400">
            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold text-[#b5bac1]">
                Current Password
              </Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#1e1f22] border-2 border-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#5865f2] h-10 transition-all duration-200 hover:border-[#5865f2]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold text-[#b5bac1]">
                New Password
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#1e1f22] border-2 border-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#5865f2] h-10 transition-all duration-200 hover:border-[#5865f2]/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="uppercase text-xs font-bold text-[#b5bac1]">
                Confirm New Password
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#1e1f22] border-2 border-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#5865f2] h-10 transition-all duration-200 hover:border-[#5865f2]/30"
                required
              />
            </div>
          </div>

          <DialogFooter className="bg-[#2b2d31] px-6 py-4 mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white hover:underline hover:bg-transparent h-auto px-0"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white min-w-[96px]"
              disabled={isLoading}
            >
              {isLoading ? "Done" : "Done"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
