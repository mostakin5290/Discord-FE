import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface UserProfileSidebarProps {
  userId: string;
}

const UserProfileSidebar = ({ userId }: UserProfileSidebarProps) => {
  const { friends } = useSelector((state: RootState) => state.friends);
  const { conversations } = useSelector((state: RootState) => state.dm);
  const { servers } = useSelector((state: RootState) => state.server);

  // Resolve user data similar to DirectMessageChat
  const friendData = friends.find((f) => f.friendId === userId)?.friend;
  const conversation = conversations.find((c) => c.participantId === userId);
  const user = conversation?.participant || friendData;

  if (!user) {
    return (
      <div className="w-[350px] bg-[#232428] border-l border-[#1e1f22] flex flex-col hidden lg:flex">
         <div className="p-4 text-[#949ba4]">User not found</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "?";
  };

  const bannerColor = "#1a1b1e"; // Fallback banner color



  // Calculate mutual servers (where both current user and target user are members)
  // Note: This relies on server.members being populated, which might not always be the case for all servers in the list
  // depending on backend implementation.
  const mutualServers = servers.filter((server) =>
    server.members?.some((member) => member.user?.id === userId)
  );

  return (
    <div className="w-[350px] bg-[#111214] border-l border-[#1e1f22] flex flex-col hidden lg:flex overflow-y-auto">
      {/* Banner */}
      <div className="h-[120px] w-full bg-black relative" style={{ backgroundColor: bannerColor }}>
          {/* You could verify if user has a bannerUrl later */}
      </div>

      <div className="px-4 pb-4 relative">
        {/* Avatar - overlapping the banner */}
        <div className="absolute -top-10 left-4">
             <div className="w-[80px] h-[80px] rounded-full bg-[#111214] p-[6px]">
                <div className="w-full h-full rounded-full bg-[#5865f2] flex items-center justify-center relative">
                    {user.imageUrl ? (
                        <img 
                            src={user.imageUrl} 
                            alt={user.username} 
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-2xl font-semibold">
                            {getInitials(user.username)}
                        </span>
                    )}
                    {/* Status Indicator */}
                     <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-[4px] border-[#111214] ${
                        user.status === 'online' ? 'bg-[#23a55a]' : 
                        user.status === 'idle' ? 'bg-[#f0b232]' : 
                        user.status === 'dnd' ? 'bg-[#f23f43]' : 'bg-[#80848e]'
                     }`} />
                </div>
             </div>
        </div>

        {/* User Info */}
        <div className="mt-14 mb-6 p-3 bg-[#111214] rounded-lg">
             <div className="flex items-center justify-between mb-1">
                 <h2 className="text-lg font-bold text-white">{user.username}</h2>
             </div>
             <p className="text-[#dbdee1] text-sm">{user.username}</p>
             
             <div className="border-t border-[#2e2f34] my-3"></div>

             <div className="space-y-3">
                 <div>
                    <h3 className="text-xs font-bold text-[#b5bac1] uppercase mb-1">Member Since</h3>
                    <p className="text-[#dbdee1] text-sm">
                        {/* Mock date if not available */}
                        Dec 12, 2025
                    </p>
                 </div>
             </div>
        </div>
        
        {/* Mutual Servers Section */}
        <div className="bg-[#1e1f22] rounded-lg p-2 mb-4">
            <h3 className="text-xs font-bold text-[#b5bac1] uppercase px-2 py-2">
                Mutual Servers — {mutualServers.length}
            </h3>
            
            {mutualServers.length > 0 ? (
                <div className="space-y-1">
                    {mutualServers.map((server) => (
                        <div key={server.id} className="flex items-center gap-3 p-2 hover:bg-[#2b2d31] rounded cursor-pointer transition-colors">
                            <div className="w-8 h-8 bg-[#313338] rounded-full flex items-center justify-center text-xs text-white overflow-hidden">
                                {server.imageUrl ? (
                                    <img src={server.imageUrl} alt={server.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{getInitials(server.name)}</span>
                                )}
                            </div>
                            <span className="text-[#dbdee1] text-sm font-medium truncate">{server.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="px-2 py-4 text-center text-[#949ba4] text-xs italic">
                    No mutual servers
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
