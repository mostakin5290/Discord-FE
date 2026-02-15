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
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { setLeaveServerModelOpen } from "@/store/slices/modalSlice";
import { leaveServer } from "@/store/slices/serverSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LeaveServerModal({ serverId, isAdmin }: { serverId: string, isAdmin: boolean }) {
    const dispatch = useDispatch<AppDispatch>();
    const leaveServerModalOpen = useSelector((state: RootState) => state.modal.leaveServerModalOpen);
    const { isLoading } = useSelector((state: RootState) => state.server);

    const navigate = useNavigate();
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleOpenChange = () => {
        dispatch(setLeaveServerModelOpen());
        setIsConfirmed(false);
    };

    const handleLeaveServer = () => {
        dispatch(leaveServer(serverId)).unwrap()
            .then(() => {
                toast.success("You have left the server successfully");
                dispatch(setLeaveServerModelOpen());
                setTimeout(() => {
                    navigate(`/`);
                }, 3000);
            })
            .catch((error: any) => {
                toast.error(error || "Failed to leave server");
            });
    };

    return (
        <Dialog open={leaveServerModalOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Leave Server</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to leave this server?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="flex w-full items-center gap-2">
                        <input
                            disabled={isAdmin}
                            type="checkbox"
                            id="leave-server-confirm"
                            name="leave-server-confirm"
                            className="cursor-pointer w-4 h-4 accent-red-500"
                            checked={isConfirmed}
                            onChange={() => setIsConfirmed(!isConfirmed)}
                        />
                        <Label htmlFor="leave-server-confirm" className="cursor-pointer">
                            I confirm I want to leave this server
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={handleLeaveServer}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isAdmin || !isConfirmed || isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Leave Server"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
