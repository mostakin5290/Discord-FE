import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Plus, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store/types";
import { fetchRoles, createRole, updateRole, deleteRole } from "@/store/slices/roleSlice"; // Update path
import { toast } from "sonner";

const RolesTab = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentServer } = useSelector((state: RootState) => state.server);
    const { roles } = useSelector((state: RootState) => state.role || { roles: [] });
    
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [editName, setEditName] = useState("");
    const [editColor, setEditColor] = useState("#99AAB5");

    useEffect(() => {
        if(currentServer?.id) dispatch(fetchRoles(currentServer.id));
    }, [currentServer?.id]);

    useEffect(() => {
        if (roles.length > 0 && !selectedRole) setSelectedRole(roles[0]);
    }, [roles]);

    useEffect(() => {
        if (selectedRole) {
            setEditName(selectedRole.name);
            setEditColor(selectedRole.color || "#99AAB5");
        }
    }, [selectedRole]);

    const handleCreate = async () => {
        if (!currentServer) return;
        await dispatch(createRole({ serverId: currentServer.id, name: "new role", color: "#99AAB5", permissions: "0" }));
        toast.success("Role created");
    };

    const handleSave = async () => {
        if (!selectedRole || !currentServer) return;
        await dispatch(updateRole({ 
            serverId: currentServer.id, 
            roleId: selectedRole.id, 
            name: editName, 
            color: editColor,
            permissions: selectedRole.permissions // Preserve permissions
        }));
        toast.success("Role updated");
    };

    const handleDelete = async () => {
        if (!selectedRole || !currentServer) return;
        await dispatch(deleteRole({ serverId: currentServer.id, roleId: selectedRole.id }));
        setSelectedRole(null);
        toast.success("Role deleted");
    };

    const filteredRoles = roles
        .slice()
        .sort((a: any, b: any) => a.position - b.position)
        .filter((r: any) => r.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <h2 className="text-[20px] font-bold text-white mb-1">Roles</h2>
                <p className="text-[#b5bac1] text-xs">Use roles to group your server members.</p>
            </div>

            <div className="flex-1 flex bg-[#313338] border border-[#1e1f22] rounded overflow-hidden h-[600px]">
                {/* --- Left Role List --- */}
                <div className="w-[200px] bg-[#2b2d31] flex flex-col">
                    <div className="p-3 border-b border-[#1e1f22]">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-[#949ba4] uppercase">Roles</span>
                             <Plus onClick={handleCreate} className="w-4 h-4 cursor-pointer text-[#b5bac1] hover:text-white" />
                        </div>
                        <div className="relative">
                            <Input 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 bg-[#1e1f22] border-none text-white text-xs placeholder:text-[#949ba4]" 
                                placeholder="Search" 
                            />
                            <Search className="w-3 h-3 absolute right-2 top-2.5 text-[#949ba4]" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1 p-2">
                        {filteredRoles.map((role: any) => (
                            <div 
                                key={role.id}
                                onClick={() => setSelectedRole(role)}
                                className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer mb-1",
                                    selectedRole?.id === role.id ? "bg-[#404249] text-white" : "text-[#b5bac1] hover:bg-[#35373c] hover:text-[#dbdee1]"
                                )}
                            >
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                                <span className="truncate text-sm font-medium">{role.name}</span>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* --- Right Edit Area --- */}
                <div className="flex-1 bg-[#313338] flex flex-col min-w-0">
                    {selectedRole ? (
                        <>
                            <div className="h-16 px-6 border-b border-[#26272d] flex items-center justify-between bg-[#313338]">
                                <h3 className="text-base font-bold text-white truncate">Edit Role - {selectedRole.name}</h3>
                            </div>
                            <ScrollArea className="flex-1 p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#b5bac1] uppercase">Role Name</label>
                                    <Input 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="bg-[#1e1f22] border-none text-white focus-visible:ring-0" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#b5bac1] uppercase">Role Color</label>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded border border-[#202225] flex items-center justify-center overflow-hidden relative" style={{backgroundColor: editColor}}>
                                            <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            <div className="p-4 bg-[#2b2d31] flex justify-between">
                                <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-500 hover:bg-transparent pl-0">
                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Role
                                </Button>
                                <Button onClick={handleSave} className="bg-[#248046] hover:bg-[#1a6334] text-white">Save Changes</Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[#949ba4]">
                            <Shield className="w-12 h-12 mb-4" />
                            <p>Select a role to edit</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolesTab;