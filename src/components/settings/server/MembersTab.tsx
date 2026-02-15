import { useState, useEffect } from "react";
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
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { kickMember, banMember, updateMemberRole } from "@/store/slices/serverSlice";
import { fetchRoles } from "@/store/slices/roleSlice";
import { toast } from "sonner";


const MembersTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);
  const { roles } = useSelector((state: RootState) => state.role);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentServer?.id) {
        dispatch(fetchRoles(currentServer.id));
    }
  }, [currentServer?.id, dispatch]);

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

  const handleChangeRole = async (memberId: string, role: string) => {
      if (!currentServer) return;
      try {
          await dispatch(updateMemberRole({ serverId: currentServer.id, memberId, role })).unwrap();
          toast.success(`Member role updated to ${role}`);
      } catch (error) {
          toast.error(error as string || "Failed to update role");
      }
  };

  const handleToggleCustomRole = async (memberId: string, roleId: string, currentRoleIds: string[]) => {
      if (!currentServer) return;
      const hasRole = currentRoleIds.includes(roleId);
      let newRoleIds;
      if (hasRole) {
          newRoleIds = currentRoleIds.filter(id => id !== roleId);
      } else {
          newRoleIds = [...currentRoleIds, roleId];
      }

      try {
          await dispatch(updateMemberRole({ serverId: currentServer.id, memberId, roleIds: newRoleIds })).unwrap();
          toast.success(hasRole ? "Role removed" : "Role added");
      } catch (error) {
          toast.error("Failed to update roles");
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

      <div className="relative mb-4">
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1e1f22] border-none text-white focus-visible:ring-0 h-10 pl-2 pr-8"
          />
          <Search className="absolute right-2 top-2.5 h-5 w-5 text-[#949ba4]" />
      </div>

      <div className="flex-1 bg-[#2b2d31] rounded-md border border-[#1e1f22] overflow-hidden flex flex-col">
          <ScrollArea className="flex-1">
              <div className="divide-y divide-[#1e1f22]">
                  {filteredMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2.5 hover:bg-[#35373c] rounded group transition-colors">
                          <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                  <AvatarImage src={member.user.imageUrl} />
                                  <AvatarFallback>{member.user.username[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                      <span className="font-semibold text-white text-sm">{member.user.username}</span>
                                      {member.role === 'ADMIN' && <Shield className="w-3 h-3 text-red-500 fill-red-500/20" />}
                                      {member.roles?.map(r => {
                                          const roleObj = roles.find(ro => ro.id === r.id);
                                          return roleObj ? (
                                              <div 
                                                key={r.id} 
                                                className="w-3 h-3 rounded-full border border-[#2b2d31]" 
                                                style={{ backgroundColor: roleObj.color }} 
                                                title={roleObj.name} 
                                              />
                                          ) : null;
                                      })}
                                  </div>
                                  <span className="text-xs text-[#949ba4]">{member.user.firstName} {member.user.lastName}</span>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                               <DropdownMenu modal={false}>
                                   <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 transition-opacity">
                                       <MoreVertical className="w-5 h-5 text-[#949ba4] hover:text-white" />
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-56 bg-[#111214] border-[#1e1f22] text-[#dbdee1]">
                                       <DropdownMenuSub>
                                           <DropdownMenuSubTrigger className="focus:bg-[#4752c4] focus:text-white cursor-pointer">
                                               <Shield className="mr-2 h-4 w-4" />
                                               <span>Roles</span>
                                           </DropdownMenuSubTrigger>
                                           <DropdownMenuPortal>
                                               <DropdownMenuSubContent className="w-56 bg-[#111214] border-[#1e1f22] text-[#dbdee1]">
                                                   <div className="px-2 py-1.5 text-xs font-semibold text-[#949ba4] uppercase">System Roles</div>
                                                   <DropdownMenuItem onClick={() => handleChangeRole(member.id, "GUEST")} className="focus:bg-[#4752c4] focus:text-white cursor-pointer justify-between">
                                                       Guest {member.role === 'GUEST' && <span>✓</span>}
                                                   </DropdownMenuItem>
                                                   <DropdownMenuItem onClick={() => handleChangeRole(member.id, "MODERATOR")} className="focus:bg-[#4752c4] focus:text-white cursor-pointer justify-between">
                                                       Moderator {member.role === 'MODERATOR' && <span>✓</span>}
                                                   </DropdownMenuItem>
                                                   <DropdownMenuItem onClick={() => handleChangeRole(member.id, "ADMIN")} className="focus:bg-[#4752c4] focus:text-white cursor-pointer justify-between">
                                                       Admin {member.role === 'ADMIN' && <span>✓</span>}
                                                   </DropdownMenuItem>
                                                   
                                                   <DropdownMenuSeparator className="bg-[#1e1f22]" />
                                                   <div className="px-2 py-1.5 text-xs font-semibold text-[#949ba4] uppercase">Custom Roles</div>
                                                   {roles.length === 0 && <div className="px-2 py-1.5 text-xs text-[#949ba4] italic">No custom roles</div>}
                                                   {roles.map(role => {
                                                       const hasRole = member.roles?.some(r => r.id === role.id);
                                                       return (
                                                           <DropdownMenuItem 
                                                               key={role.id}
                                                               onClick={() => handleToggleCustomRole(member.id, role.id, member.roles?.map(r => r.id) || [])}
                                                               className="focus:bg-[#4752c4] focus:text-white cursor-pointer justify-between"
                                                           >
                                                               <div className="flex items-center gap-2">
                                                                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                                                                   {role.name}
                                                               </div>
                                                               {hasRole && <span>✓</span>}
                                                           </DropdownMenuItem>
                                                       )
                                                   })}
                                               </DropdownMenuSubContent>
                                           </DropdownMenuPortal>
                                       </DropdownMenuSub>
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
