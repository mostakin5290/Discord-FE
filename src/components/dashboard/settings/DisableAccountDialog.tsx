import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/types";
import { disableAccount } from "@/store/slices/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

interface DisableAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DisableAccountDialog = ({
  open,
  onOpenChange,
}: DisableAccountDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSocialLogin = user?.provider && !user?.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSocialLogin && !password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        disableAccount(isSocialLogin ? undefined : password),
      ).unwrap();
      toast.success(
        "Account disabled successfully. You can recover it anytime.",
      );
      onOpenChange(false);
      // Logout and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : "Failed to disable account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#313338] border-none text-white sm:max-w-[500px] p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#f0b232]/20 flex items-center justify-center animate-pulse">
              <AlertCircle className="w-6 h-6 text-[#f0b232] animate-in zoom-in duration-300" />
            </div>
            <DialogTitle className="text-2xl font-bold animate-in slide-in-from-left duration-300">
              Disable Account
            </DialogTitle>
          </div>
          <DialogDescription className="text-[#b5bac1] text-sm leading-relaxed">
            Disabling your account will hide your profile and you won't be able
            to access it. You can{" "}
            <span className="text-white font-semibold">
              recover your account anytime
            </span>{" "}
            by logging back in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="px-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-400">
            <div className="p-4 bg-[#f0b232]/10 border border-[#f0b232]/30 rounded-lg backdrop-blur-sm transition-all duration-300 hover:border-[#f0b232]/50 hover:bg-[#f0b232]/15">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#f0b232] rounded-full"></span>
                What happens when you disable:
              </h4>
              <ul className="text-xs text-[#dbdee1] space-y-1">
                <li>• Your profile will be hidden from others</li>
                <li>• You won't receive notifications</li>
                <li>• Your data is preserved for recovery</li>
                <li>• You can reactivate anytime by logging in</li>
              </ul>
            </div>

            {!isSocialLogin && (
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-[#b5bac1]">
                  Enter your password to confirm
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1e1f22] border-2 border-transparent text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#f0b232] h-10 transition-all duration-200 hover:border-[#f0b232]/30"
                  placeholder="Password"
                  required
                />
              </div>
            )}

            {isSocialLogin && (
              <div className="p-3 bg-[#5865f2]/10 border border-[#5865f2]/30 rounded text-xs text-[#dbdee1]">
                <p>
                  You signed in with {user?.provider}. No password required.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="bg-[#2b2d31] px-6 py-4 mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white hover:underline hover:bg-transparent h-auto px-0"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#f0b232] hover:bg-[#d89b2a] text-[#111214] min-w-[120px] font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={isLoading}
            >
              {isLoading ? "Disabling..." : "Disable Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DisableAccountDialog;
