import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { AppDispatch, RootState } from "@/store/types";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/store/slices/roleSlice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

const RolesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);
  const { roles } = useSelector((state: RootState) => state.role);

  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleColor, setRoleColor] = useState("#99AAB5");
  // Basic permissions for demo (Expand as needed based on backend strings/JSON)

  useEffect(() => {
    if (currentServer?.id) {
      dispatch(fetchRoles(currentServer.id));
    }
  }, [currentServer?.id, dispatch]);

  const handleCreateRole = async () => {
      if (!currentServer?.id) return;
      try {
          await dispatch(createRole({ 
              serverId: currentServer.id, 
              name: "new role", 
              color: "#99AAB5" 
          })).unwrap();
          toast.success("Role created");
      } catch (error) {
          toast.error("Failed to create role");
      }
  };

  const handleDeleteRole = async (roleId: string) => {
      if (!currentServer?.id) return;
      try {
          await dispatch(deleteRole({ serverId: currentServer.id, roleId })).unwrap();
          toast.success("Role deleted");
          if (selectedRole?.id === roleId) setSelectedRole(null);
      } catch (error) {
          toast.error("Failed to delete role");
      }
  };

  const handleSaveRole = async () => {
      if (!selectedRole || !currentServer?.id) return;
      try {
          await dispatch(updateRole({
              serverId: currentServer.id,
              roleId: selectedRole.id,
              name: roleName,
              color: roleColor,
              // permissions logic here
          })).unwrap();
          toast.success("Role updated");
      } catch (error) {
          toast.error("Failed to update role");
      }
  };

  const selectRole = (role: any) => {
      setSelectedRole(role);
      setRoleName(role.name);
      setRoleColor(role.color);
  };

  return (
    <div className="flex h-full gap-0">
      {/* Roles Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-[#1e1f22]">
          <div className="p-4 border-b border-[#1e1f22] flex items-center justify-between">
              <span className="text-xs font-bold text-[#949ba4] uppercase">Roles</span>
              <Plus 
                className="w-4 h-4 cursor-pointer text-[#949ba4] hover:text-white" 
                onClick={handleCreateRole}
              />
          </div>
          <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                  {roles.map((role: any) => (
                      <div 
                        key={role.id}
                        onClick={() => selectRole(role)}
                        className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-[#35373c]",
                            selectedRole?.id === role.id && "bg-[#404249]"
                        )}
                      >
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                          <span className={cn(
                              "flex-1 text-sm font-medium truncate",
                              selectedRole?.id === role.id ? "text-white" : "text-[#949ba4]"
                          )}>
                              {role.name}
                          </span>
                      </div>
                  ))}
              </div>
          </ScrollArea>
      </div>

      {/* Role Editor */}
      <div className="flex-1 bg-[#313338] p-6">
          {selectedRole ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h2 className="text-xl font-bold text-white mb-6">Edit Role - {selectedRole.name}</h2>
                  
                  <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                          <Label className="uppercase text-xs font-bold text-[#b5bac1]">Role Name</Label>
                          <Input 
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            className="bg-[#1e1f22] border-none text-white"
                          />
                      </div>

                      <div className="space-y-2">
                          <Label className="uppercase text-xs font-bold text-[#b5bac1]">Role Color</Label>
                          <div className="flex gap-4">
                              <Input 
                                type="color"
                                value={roleColor}
                                onChange={(e) => setRoleColor(e.target.value)}
                                className="w-16 h-10 p-1 bg-[#1e1f22] border-none"
                              />
                               <div 
                                className="w-10 h-10 rounded shadow-md border border-[#ffffff10]"
                                style={{ backgroundColor: roleColor }}
                               />
                          </div>
                      </div>
                  </div>

                  <div className="pt-8 flex justify-between border-t border-[#3f4147] mt-8">
                       <Button variant="destructive" onClick={() => handleDeleteRole(selectedRole.id)}>
                            Delete Role
                       </Button>
                       <Button onClick={handleSaveRole} className="bg-[#248046] hover:bg-[#1a6334] text-white">
                            Save Changes
                       </Button>
                  </div>
              </div>
          ) : (
              <div className="flex-1 h-full flex items-center justify-center flex-col text-[#949ba4] gap-4">
                  <Shield size={48} />
                   <div className="text-center">
                       <h3 className="text-lg font-medium text-white">No Role Selected</h3>
                       <p>Select a role to edit permissions or create a new one.</p>
                   </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default RolesTab;
