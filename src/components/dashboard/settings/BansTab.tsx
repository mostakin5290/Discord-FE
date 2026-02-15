import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Search, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { RootState } from "@/store/types";

interface BannedUser {
    userId: string;
    serverId: string;
    reason?: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        imageUrl?: string;
    }
}

const BansTab = () => {
  const { currentServer } = useSelector((state: RootState) => state.server);
  const { token } = useSelector((state: RootState) => state.auth);
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBannedUsers = async () => {
      console.log("Fetching bans for server:", currentServer?.id, "Token available:", !!token);
      if (!currentServer?.id || !token) return;
      try {
          setLoading(true);
          const response = await api.get(`/server/${currentServer.id}/bans`, token);
          console.log("Bans API response:", response);
          setBannedUsers(response.bannedUsers);
      } catch (error) {
          console.error("Fetch bans error:", error);
          // toast.error("Failed to fetch banned users"); 
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchBannedUsers();
  }, [currentServer?.id, token]);

  const handleRevokeBan = async (userId: string) => {
      if (!currentServer?.id) return;
      try {
          await api.delete(`/server/${currentServer.id}/bans/${userId}`, token || undefined);
          toast.success("Ban revoked successfully");
          setBannedUsers(prev => prev.filter(u => u.user.id !== userId));
      } catch (error) {
          toast.error("Failed to revoke ban");
      }
  };

  const filteredUsers = bannedUsers.filter(ban => 
      ban.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
        <div>
            <h2 className="text-xl font-bold text-white mb-2">Bans</h2>
            <p className="text-sm text-[#949ba4]">
                Manage users who are banned from this server.
            </p>
        </div>

        <div className="flex items-center bg-[#1e1f22] p-2 rounded-md border-none">
             <Input 
               placeholder="Search bans" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-[#949ba4]"
             />
             <Search className="w-5 h-5 text-[#949ba4] mr-2" />
        </div>

        <div className="flex-1 min-h-0 bg-[#2b2d31] rounded-lg border border-[#1e1f22] overflow-hidden flex flex-col">
             <div className="p-4 border-b border-[#1e1f22] flex justify-between items-center bg-[#313338]">
                  <span className="text-xs font-bold text-[#949ba4] uppercase">
                      {filteredUsers.length} Banned User{filteredUsers.length !== 1 ? 's' : ''}
                  </span>
             </div>
             
             <ScrollArea className="flex-1">
                 {loading ? (
                     <div className="flex items-center justify-center p-8">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                     </div>
                 ) : filteredUsers.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
                         <div className="w-16 h-16 rounded-full bg-[#313338] flex items-center justify-center mb-4">
                             <Gavel className="w-8 h-8 text-[#23a559]" />
                         </div>
                         <h3 className="text-lg font-bold text-white mb-1">No bans found</h3>
                         <p className="text-[#949ba4] text-sm">
                             No one is currently banned from this server.
                         </p>
                     </div>
                 ) : (
                     <div className="divide-y divide-[#1e1f22]">
                         {filteredUsers.map(ban => (
                             <div key={ban.userId} className="p-3 flex items-center justify-between hover:bg-[#35373c] transition-colors group">
                                 <div className="flex items-center gap-3">
                                     <Avatar className="w-9 h-9 border border-[#1e1f22]">
                                         <AvatarImage src={ban.user.imageUrl} />
                                         <AvatarFallback className="bg-[#1e1f22] text-[#dbdee1]">
                                             {ban.user.username.substring(0, 2).toUpperCase()}
                                         </AvatarFallback>
                                     </Avatar>
                                     <div>
                                         <div className="font-bold text-white text-sm">{ban.user.username}</div>
                                         <div className="text-xs text-[#949ba4]">
                                             Reason: {ban.reason || "No reason provided"}
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <AlertDialog>
                                     <AlertDialogTrigger asChild>
                                         <Button 
                                             variant="ghost" 
                                             size="sm"
                                             className="text-red-400 hover:text-white hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all font-medium"
                                         >
                                             Revoke Ban
                                         </Button>
                                     </AlertDialogTrigger>
                                     <AlertDialogContent className="bg-[#313338] border-[#1e1f22] text-[#dbdee1]">
                                         <AlertDialogHeader>
                                             <AlertDialogTitle className="text-white">Revoke Ban?</AlertDialogTitle>
                                             <AlertDialogDescription className="text-[#b5bac1]">
                                                 Are you sure you want to revoke the ban for <span className="font-bold text-white">{ban.user.username}</span>? They will be able to join the server again.
                                             </AlertDialogDescription>
                                         </AlertDialogHeader>
                                         <AlertDialogFooter>
                                             <AlertDialogCancel className="bg-transparent text-white border-none hover:bg-[#3f4147] hover:text-white">Cancel</AlertDialogCancel>
                                             <AlertDialogAction 
                                                 onClick={() => handleRevokeBan(ban.userId)}
                                                 className="bg-red-500 hover:bg-red-600 text-white"
                                             >
                                                 Revoke Ban
                                             </AlertDialogAction>
                                         </AlertDialogFooter>
                                     </AlertDialogContent>
                                 </AlertDialog>
                             </div>
                         ))}
                     </div>
                 )}
             </ScrollArea>
        </div>
    </div>
  );
};

export default BansTab;
