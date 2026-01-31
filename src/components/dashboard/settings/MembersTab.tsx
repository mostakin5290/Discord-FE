import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Shield } from "lucide-react";
import type { RootState, AppDispatch } from "@/store/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { kickMember, banMember } from "@/store/slices/serverSlice";
import { toast } from "sonner";


const MembersTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);
  const [searchQuery, setSearchQuery] = useState("");

  const handleKick = async (memberId: string) => {
    if (!currentServer) return;
    try {
      await dispatch(kickMember({ serverId: currentServer.id, memberId })).unwrap();
      toast.success("Member kicked successfully");
    } catch (error) {
      toast.error(error as string || "Failed to kick member");
    }
  };

  const handleBan = async (memberId: string) => {
    if (!currentServer) return;
    try {
      await dispatch(banMember({ serverId: currentServer.id, memberId })).unwrap();
      toast.success("Member banned successfully");
    } catch (error) {
      toast.error(error as string || "Failed to ban member");
    }
  };


  const filteredMembers = currentServer?.members.filter(member => 
      member.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-white">Members</h2>
          <p className="text-sm text-[#949ba4]">
              {currentServer?.members.length} Members
          </p>
      </div>

      <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#949ba4]" />
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-[#1e1f22] border-none text-white focus-visible:ring-0"
          />
      </div>

      <div className="flex-1 bg-[#2b2d31] rounded-md border border-[#1e1f22] overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
              <div className="divide-y divide-[#1e1f22]">
                  {filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 hover:bg-[#35373c] group">
                          <div className="flex items-center gap-3">
                              <Avatar>
                                  <AvatarImage src={member.user.imageUrl} />
                                  <AvatarFallback>{member.user.username[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-white">{member.user.username}</span>
                                      {member.role === 'ADMIN' && <Shield className="w-3 h-3 text-red-400" />}
                                  </div>
                                  <span className="text-xs text-[#949ba4]">{member.user.firstName} {member.user.lastName}</span>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                               <div className="hidden group-hover:flex items-center gap-2">
                                   {/* Placeholder for Role Tags if updated */}
                               </div>
                               <DropdownMenu>
                                   <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreVertical className="w-5 h-5 text-[#949ba4] hover:text-white" />
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-40 bg-[#111214] border-[#1e1f22] text-[#dbdee1]">
                                       <DropdownMenuItem 
                                          className="focus:bg-[#4752c4] focus:text-white cursor-pointer"
                                          onClick={() => handleKick(member.id)}
                                       >
                                           Kick Member
                                       </DropdownMenuItem>
                                       <DropdownMenuItem 
                                          className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                          onClick={() => handleBan(member.id)}
                                       >
                                           Ban Member
                                       </DropdownMenuItem>

                                   </DropdownMenuContent>
                               </DropdownMenu>
                          </div>
                      </div>
                  ))}
              </div>
          </ScrollArea>
      </div>
    </div>
  );
};

export default MembersTab;
