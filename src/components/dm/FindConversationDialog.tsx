import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/types";


interface FindConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectDM: (userId: string) => void;
}

const FindConversationDialog = ({
  open,
  onOpenChange,
  onSelectDM,
}: FindConversationDialogProps) => {
  const { friends } = useSelector((state: RootState) => state.friends);

  // Filter only online/idle/dnd friends or all friends? All friends.
  // Friend object structure is specific based on previous view_file of FriendsPanel
  // friend.friend is the user object

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Find or start a conversation">
      <CommandInput placeholder="Where would you like to go?" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Friends">
          {friends.map((friendData) => {
             const user = friendData.friend;
             if (!user) return null;
             return (
              <CommandItem
                key={user.id}
                onSelect={() => {
                  onSelectDM(user.id);
                  onOpenChange(false);
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center overflow-hidden">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Status Indicator */}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-[#2b2d31] rounded-full ${
                        user.status === 'online' ? 'bg-green-500' :
                        user.status === 'idle' ? 'bg-yellow-500' :
                        user.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-medium">{user.username}</span>
                     <span className="text-xs text-muted-foreground">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.status || 'Offline'}
                     </span>
                  </div>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default FindConversationDialog;
