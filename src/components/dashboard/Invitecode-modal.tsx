import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RootState } from "@/store/store";
import { setInvitecodeModalOpen } from "@/store/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";

export function InvitecodeModal({ serverId }: { serverId: string }) {
    const dispatch = useDispatch();
    const invitecodeModalOpen = useSelector((state: RootState) => state.modal.invitecodeModalOpen);
    const currentServer = useSelector((state: RootState) => state.server.currentServer);

    const [isCopied, setIsCopied] = useState(false);

    const handleOpenChange = () => {
        dispatch(setInvitecodeModalOpen());
    };

    const handleCopy = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(`${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${serverId}/invite/${currentServer?.inviteCode ?? ""}`);
        toast.success("Invite code copied successfully");
        const timeout = setTimeout(() => {
            setIsCopied(false);
        }, 1000);
        return () => clearTimeout(timeout);
    };

    return (
        <Dialog open={invitecodeModalOpen} onOpenChange={handleOpenChange}>
            <form>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Invite Members</DialogTitle>
                        <DialogDescription>
                            Share the invite code with your friends to join the server.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        <Label htmlFor="invite-code">Invite Link</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="invite-code"
                                name="inviteCode"
                                readOnly
                                value={`${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${serverId}/invite/${currentServer?.inviteCode ?? ""}`}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCopy}
                                className={cn(
                                    "shrink-0 transition-colors",
                                    isCopied
                                        ? "bg-green-500 text-white hover:bg-green-600 border-green-500"
                                        : ""
                                )}
                            >
                                {isCopied ? (
                                    <CheckIcon className="w-4 h-4" />
                                ) : (
                                    <CopyIcon className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
};