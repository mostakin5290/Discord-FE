import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store/types";
import { regenerateInviteCode } from "@/store/slices/serverSlice";
import { toast } from "sonner";

const InvitesTab = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentServer } = useSelector((state: RootState) => state.server);
    const [isCopied, setIsCopied] = useState(false);
    
    if (!currentServer) return null;

    const handleCopyInvite = () => {
        const inviteLink = `${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${currentServer?.id}/invite/${currentServer?.inviteCode}`;
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        toast.success("Invite link copied!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleRegenerateInvite = async () => {
        if (!currentServer) return;
        try {
            await dispatch(regenerateInviteCode(currentServer.id)).unwrap();
            toast.success("Invite code regenerated!");
        } catch (error: any) {
            toast.error(error || "Failed to regenerate invite code");
        }
    };

    return (
        <div className="max-w-xl animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-xl font-bold mb-6 text-white">Invites</h2>
            <p className="text-sm text-gray-300 mb-6">
            Manage your invites here. You can regenerate the invite code if you want to revoke previous links.
            </p>

            <div className="bg-[#1E1F22] p-4 rounded-md">
            <Label className="text-xs font-bold text-gray-300 uppercase tracking-wide mb-2 block">
                Server Invite Link
            </Label>
            <div className="flex items-center gap-2">
                <Input 
                    readOnly 
                    value={`${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${currentServer.id}/invite/${currentServer.inviteCode}`}
                    className="bg-[#111214] border-none text-gray-200 focus-visible:ring-0 select-all"
                />
                <Button 
                    onClick={handleCopyInvite}
                    className={cn("min-w-[100px] transition-colors text-white", isCopied ? "bg-green-600 hover:bg-green-700" : "bg-[#5865F2] hover:bg-[#4752C4]")}
                >
                    {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {isCopied ? "Copied" : "Copy"}
                </Button>
            </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-6">
            <h3 className="text-base font-semibold text-white mb-2">Regenerate Invite Code</h3>
            <p className="text-sm text-gray-400 mb-4">
                Regenerating the invite code will make all existing invite links invalid. Use this if you want to stop people from joining with old links.
            </p>
            <Button 
                onClick={handleRegenerateInvite}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white"
            >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Invite Code
            </Button>
            </div>
        </div>
    );
};

export default InvitesTab;
