import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { RootState, AppDispatch } from "@/store/types";
import { setInvitecodeModalOpen } from "@/store/slices/modalSlice";
import { fetchFriends } from "@/store/slices/friendSlice";
import { sendMessage } from "@/store/slices/dmSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InvitecodeModal({ serverId }: { serverId: string }) {
    const dispatch = useDispatch<AppDispatch>();
    const invitecodeModalOpen = useSelector((state: RootState) => state.modal.invitecodeModalOpen);
    const currentServer = useSelector((state: RootState) => state.server.currentServer);
    const { friends } = useSelector((state: RootState) => state.friends);
    
    // Fetch friends on modal open
    const [searchQuery, setSearchQuery] = useState("");
    const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());

    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (invitecodeModalOpen) {
            dispatch(fetchFriends());
        }
    }, [dispatch, invitecodeModalOpen]);

    const handleOpenChange = () => {
        dispatch(setInvitecodeModalOpen());
    };

    const handleInvite = async (friendId: string, username: string) => {
        if (!currentServer) return;
        
        try {
            const inviteLink = `${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${serverId}/invite/${currentServer?.inviteCode ?? ""}`;
            await dispatch(sendMessage({
                friendId: friendId,
                content: `Join my server ${currentServer.name}! ${inviteLink}`
            })).unwrap();
            
            setInvitedFriends(prev => new Set(prev).add(friendId));
            toast.success(`Invite sent to ${username}`);
        } catch (error) {
            toast.error("Failed to send invite");
        }
    };

    const filteredFriends = friends.filter(f => 
        f.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
             <DialogContent className="sm:max-w-[425px] flex flex-col gap-0 bg-[#313338] text-[#dbdee1] p-0 overflow-hidden border-none">
                <DialogHeader className="p-4 pb-0">
                    <DialogTitle className="uppercase text-xs font-bold text-[#dbdee1] mb-2">Invite friends to {currentServer?.name}</DialogTitle>
                     <div className="relative">
                        <Input 
                            placeholder="Search friends" 
                            className="bg-[#1e1f22] border-none text-[#dbdee1] focus-visible:ring-0 h-8 pr-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute right-2 top-2 h-4 w-4 text-[#949ba4]" />
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 h-[300px] p-2">
                    <div className="space-y-1">
                        {filteredFriends.length === 0 ? (
                             <div className="text-center text-[#949ba4] py-8 text-sm">
                                {searchQuery ? "No friends found" : "No friends to invite"}
                            </div>
                        ) : (
                            filteredFriends.map((f) => (
                                <div key={f.id} className="flex items-center justify-between p-2 hover:bg-[#35373c] rounded group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={f.friend.imageUrl} />
                                            <AvatarFallback>{f.friend.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white text-sm">{f.friend.username}</span>
                                            <span className="text-xs text-[#949ba4]">{f.friend.firstName} {f.friend.lastName}</span>
                                        </div>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant={invitedFriends.has(f.friendId) ? "secondary" : "default"}
                                        className={cn(
                                            "h-7 text-xs border border-green-600 bg-transparent text-white hover:bg-green-600 transition-colors w-16",
                                            invitedFriends.has(f.friendId) && "opacity-50 cursor-not-allowed border-gray-500 text-gray-400"
                                        )}
                                        onClick={() => !invitedFriends.has(f.friendId) && handleInvite(f.friendId, f.friend.username)}
                                        disabled={invitedFriends.has(f.friendId)}
                                    >
                                        {invitedFriends.has(f.friendId) ? "Sent" : "Invite"}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-[#2b2d31]">
                    <div className="text-xs font-bold text-[#b5bac1] uppercase mb-2">Or, send a server invite link to a friend</div>
                    <div className="flex items-center gap-2 bg-[#1e1f22] p-1 rounded border border-[#1e1f22]">
                        <Input
                            readOnly
                            value={`${import.meta.env.VITE_FRONTEND_BASE_URL}/server/${serverId}/invite/${currentServer?.inviteCode ?? ""}`}
                            className="flex-1 bg-transparent border-none text-[#dbdee1] focus-visible:ring-0 h-8"
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleCopy}
                            className={cn(
                                "shrink-0 transition-colors h-8 w-20",
                                isCopied ? "bg-green-500 hover:bg-green-600" : "bg-[#5865F2] hover:bg-[#4752C4]"
                            )}
                        >
                            {isCopied ? "Copied" : "Copy"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};