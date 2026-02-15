import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2, 
  Search, 
  Shield, 
  Users
} from "lucide-react";
import type { AppDispatch, RootState } from "@/store/types";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/store/slices/roleSlice";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const PERMISSIONS = [
  { id: "ADMINISTRATOR", name: "Administrator", description: "Grant all permissions" },
  { id: "MANAGE_SERVER", name: "Manage Server", description: "Edit server settings" },
  { id: "KICK_MEMBERS", name: "Kick Members", description: "Kick members from server" },
  { id: "BAN_MEMBERS", name: "Ban Members", description: "Ban members from server" },
  { id: "MANAGE_CHANNELS", name: "Manage Channels", description: "Create/Edit/Delete channels" },
  { id: "MANAGE_ROLES", name: "Manage Roles", description: "Create/Edit/Delete roles" },
  { id: "MANAGE_MESSAGES", name: "Manage Messages", description: "Delete messages etc." },
  { id: "SEND_MESSAGES", name: "Send Messages", description: "Send messages in channels" },
];

const RolesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentServer } = useSelector((state: RootState) => state.server);
  const { roles } = useSelector((state: RootState) => state.role);

  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [activeSubTab, setActiveSubTab] = useState("display"); // display, permissions, members
  const [roleName, setRoleName] = useState("");
  const [roleColor, setRoleColor] = useState("#99AAB5");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (currentServer?.id) {
      dispatch(fetchRoles(currentServer.id));
    }
  }, [currentServer?.id, dispatch]);

  useEffect(() => {
      if (selectedRole) {
          setRoleName(selectedRole.name);
          setRoleColor(selectedRole.color);
          try {
              setRolePermissions(JSON.parse(selectedRole.permissions || "[]"));
          } catch (e) {
              setRolePermissions([]);
          }
      }
  }, [selectedRole]);

  const handleCreateRole = async () => {
      if (!currentServer?.id) return;
      try {
          const resultAction = await dispatch(createRole({ 
              serverId: currentServer.id, 
              name: "new role", 
              color: "#99AAB5" 
          }));
          if (createRole.fulfilled.match(resultAction)) {
              toast.success("Role created");
              const newRole = resultAction.payload;
              setSelectedRole(newRole);
              setRoleName(newRole.name);
              setRoleColor(newRole.color);
              setRolePermissions([]);
          }
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
              permissions: JSON.stringify(rolePermissions)
          })).unwrap();
          toast.success("Role updated");
      } catch (error) {
          toast.error("Failed to update role");
      }
  };

  const togglePermission = (permissionId: string) => {
      setRolePermissions(prev => 
          prev.includes(permissionId) 
              ? prev.filter(p => p !== permissionId)
              : [...prev, permissionId]
      );
  };

  const filteredRoles = roles.filter(role => 
      role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#313338]">
      {/* Left Sidebar: Role List */}
      <div className="w-60 bg-[#2b2d31] flex flex-col border-r border-[#1e1f22]">
          <div className="p-3 border-b border-[#1e1f22]">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#949ba4] uppercase">Roles</span>
                  <button 
                    onClick={handleCreateRole}
                    className="p-1 hover:bg-[#3f4147] rounded cursor-pointer"
                    title="Create Role"
                    aria-label="Create Role"
                  >
                      <Plus className="w-4 h-4 text-[#949ba4] hover:text-white" />
                  </button>
              </div>
              <div className="relative">
                  <Input 
                    placeholder="Search Roles" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 bg-[#1e1f22] border-none text-xs text-white placeholder:text-[#949ba4]"
                  />
                  <Search className="w-3 h-3 text-[#949ba4] absolute right-2 top-2.5" />
              </div>
          </div>
          <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                  {filteredRoles.map((role: any) => (
                      <div 
                        key={role.id}
                        onClick={() => setSelectedRole(role)}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded cursor-pointer group hover:bg-[#35373c]",
                            selectedRole?.id === role.id && "bg-[#404249]"
                        )}
                      >
                          <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                              <span className={cn(
                                  "text-sm font-medium truncate",
                                  selectedRole?.id === role.id ? "text-white" : "text-[#949ba4] group-hover:text-[#dbdee1]"
                              )}>
                                  {role.name}
                              </span>
                          </div>
                      </div>
                  ))}
              </div>
          </ScrollArea>
      </div>

      {/* Right Content: Role Editor */}
      <div className="flex-1 flex flex-col min-w-0">
          {selectedRole ? (
              <>
                  <div className="h-16 px-6 border-b border-[#26272d] flex items-center justify-between bg-[#313338]">
                      <h2 className="text-lg font-bold text-white truncate max-w-[300px]">
                          Edit Role - {selectedRole.name}
                      </h2>
                      {/* Tabs */}
                      <div className="flex bg-[#1e1f22] rounded p-0.5">
                          {['display', 'permissions', 'members'].map((tab) => (
                              <button
                                key={tab}
                                onClick={() => setActiveSubTab(tab)}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-medium rounded transition-colors capitalize",
                                    activeSubTab === tab 
                                        ? "bg-[#404249] text-white shadow-sm"
                                        : "text-[#b5bac1] hover:text-[#dbdee1] hover:bg-[#35373c]"
                                )}
                              >
                                  {tab}
                              </button>
                          ))}
                      </div>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                      <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
                          {activeSubTab === 'display' && (
                              <div className="space-y-6">
                                  <div className="space-y-2">
                                      <Label htmlFor="role-name" className="uppercase text-xs font-bold text-[#b5bac1]">Role Name</Label>
                                      <Input 
                                        id="role-name"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                        className="bg-[#1e1f22] border-none text-white focus-visible:ring-0"
                                      />
                                  </div>

                                  <Separator className="bg-[#3f4147]" />

                                  <div className="space-y-2">
                                      <Label htmlFor="role-color" className="uppercase text-xs font-bold text-[#b5bac1]">Role Color</Label>
                                      <div className="flex gap-4 items-start">
                                          <div className="flex flex-col gap-2">
                                              <div 
                                                className="w-16 h-16 rounded-md shadow-sm border border-[#202225] flex items-center justify-center"
                                                style={{ backgroundColor: roleColor }}
                                              >
                                                <input 
                                                    id="role-color"
                                                    type="color"
                                                    value={roleColor}
                                                    onChange={(e) => setRoleColor(e.target.value)}
                                                    className="opacity-0 w-full h-full cursor-pointer"
                                                    title="Select role color"
                                                    aria-label="Select role color"
                                                />
                                              </div>
                                              <span className="text-xs text-[#949ba4] text-center uppercase">{roleColor}</span>
                                          </div>
                                          <p className="text-sm text-[#949ba4] mt-1 max-w-xs">
                                              Members of this role will have their username displayed in this color.
                                          </p>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {activeSubTab === 'permissions' && (
                              <div className="space-y-6">
                                  <div className="flex items-center gap-4 mb-6">
                                      <Shield className="w-8 h-8 text-[#949ba4]" />
                                      <div>
                                          <h3 className="text-lg font-bold text-white">Permissions</h3>
                                          <p className="text-sm text-[#949ba4]">
                                              Permissions allow members to perform specific actions.
                                          </p>
                                      </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                      {PERMISSIONS.map(permission => (
                                          <div key={permission.id} className="flex items-center justify-between p-3 bg-[#2b2d31] rounded">
                                              <div>
                                                  <div className="font-medium text-white">{permission.name}</div>
                                                  <div className="text-xs text-[#949ba4]">{permission.description}</div>
                                              </div>
                                              <div 
                                                  onClick={() => togglePermission(permission.id)}
                                                  className={cn(
                                                      "w-10 h-6 rounded-full cursor-pointer transition-colors relative",
                                                      rolePermissions.includes(permission.id) ? "bg-[#23a559]" : "bg-[#80848e]"
                                                  )}
                                              >
                                                  <div className={cn(
                                                      "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                                                      rolePermissions.includes(permission.id) ? "left-5" : "left-1"
                                                  )} />
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}
                          
                          {activeSubTab === 'members' && (
                              <div className="flex flex-col gap-4 text-center py-10">
                                  <Users className="w-16 h-16 text-[#949ba4] mx-auto mb-4" />
                                  <h3 className="text-xl font-bold text-white">Manage Members</h3>
                                  <p className="text-[#949ba4]">
                                      View and manage members assigned to this role.
                                  </p>
                              </div>
                          )}
                      </div>
                  </ScrollArea>

                  {/* Footer Actions */}
                  <div className="p-4 bg-[#2b2d31] border-t border-[#1e1f22] flex justify-between items-center">
                       <Button 
                          variant="ghost" 
                          onClick={() => handleDeleteRole(selectedRole.id)}
                          className="text-red-400 hover:text-red-500 hover:bg-transparent px-0"
                       >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Role
                       </Button>
                       
                       <div className="flex gap-3">
                           <Button 
                              variant="ghost" 
                              onClick={() => {
                                  setRoleName(selectedRole.name);
                                  setRoleColor(selectedRole.color);
                                  try {
                                      setRolePermissions(JSON.parse(selectedRole.permissions || "[]"));
                                  } catch (e) {
                                      setRolePermissions([]);
                                  }
                              }}
                              className="text-white hover:underline"
                           >
                               Reset
                           </Button>
                           <Button 
                              onClick={handleSaveRole} 
                              disabled={
                                  roleName === selectedRole.name && 
                                  roleColor === selectedRole.color &&
                                  JSON.stringify(rolePermissions.sort()) === JSON.stringify(JSON.parse(selectedRole.permissions || "[]").sort())
                              }
                              className="bg-[#248046] hover:bg-[#1a6334] text-white transition-all"
                           >
                               Save Changes
                           </Button>
                       </div>
                  </div>
              </>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-24 h-24 rounded-full bg-[#2b2d31] flex items-center justify-center mb-4">
                       <Shield className="w-12 h-12 text-[#949ba4]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Role Selected</h3>
                  <p className="text-[#949ba4] max-w-sm">
                      Select a role from the list to edit its permissions, color, and more. Or create a new role to get started.
                  </p>
              </div>
          )}
      </div>
    </div>
  );
};

export default RolesTab;
