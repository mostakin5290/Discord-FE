import { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  UserPlus,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
  Plus,
  Smile,
  Gift,
  Send,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  fetchConversationMessages,
  sendMessage,
  markAsRead,
} from "@/store/slices/dmSlice";
import { fetchFriends } from "@/store/slices/friendSlice";
import { format } from "date-fns";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import {
    MoreHorizontal,
    Reply,
    SmilePlus,
    Trash2,
    Copy,
    Flag,
    Pin as PinIcon,
    CornerUpRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
//   DropdownMenuLabel,
//   DropdownMenuSub,
//   DropdownMenuSubTrigger,
//   DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
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
import {
    addReaction,
    removeReaction,
    replyToMessage,
    pinMessage,
    deleteMessageAction
} from "@/store/slices/dmSlice";
import { toast } from "sonner";

interface MessageItemProps {
    message: any;
    currentUserId: string;
    getInitials: (name: string) => string;
    onReply: (message: any) => void;
}

const MessageItem = ({ message, currentUserId, getInitials, onReply }: MessageItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    // Helper to check if current user reacted with a specific emoji
    const hasReacted = (emoji: string) => {
        return message.reactions && message.reactions[emoji]?.includes(currentUserId);
    };

    const handleReaction = async (emoji: string) => {
        if (hasReacted(emoji)) {
            await dispatch(removeReaction({ messageId: message.id, emoji }));
        } else {
            await dispatch(addReaction({ messageId: message.id, emoji }));
        }
    };
    
    const handlePin = async () => {
         try {
            await dispatch(pinMessage(message.id)).unwrap();
            toast.success(message.pinned ? "Message unpinned" : "Message pinned");
         } catch (error) {
             toast.error("Failed to pin message");
         }
    };

    const handleDelete = async (deleteType: 'forMe' | 'forEveryone') => {
        try {
            await dispatch(deleteMessageAction({ messageId: message.id, deleteType })).unwrap();
            toast.success("Message deleted");
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    return (
        <div
            className={`group flex flex-col hover:bg-[#2e3035]/50 -mx-4 px-4 py-1 rounded relative ${isHovered ? 'bg-[#2e3035]/50' : ''} ${message.pinned ? 'bg-[#3b3d44]/30' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
             {/* Reply Context */}
             {message.replyTo && (
                <div className="flex items-center gap-2 mb-1 ml-11 text-xs text-[#b5bac1]">
                    <div className="w-8 h-3 border-l-2 border-t-2 border-[#4e5058] rounded-tl-md" />
                    <img 
                        src={message.replyTo.sender.imageUrl} 
                        className="w-4 h-4 rounded-full"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <span className="font-semibold text-[#b5bac1] hover:underline cursor-pointer">
                        @{message.replyTo.sender.username}
                    </span>
                    <span className="truncate max-w-xs cursor-pointer hover:text-white transition-colors">
                        {message.replyTo.content || "Click to see attachment"}
                    </span>
                </div>
             )}

            <div className="flex gap-4 items-start">
                 {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0 cursor-pointer transition-opacity hover:opacity-80 mt-1">
                    {message.sender.imageUrl ? (
                        <img
                            src={message.sender.imageUrl}
                            alt={message.sender.username}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-semibold">
                            {getInitials(message.sender.username)}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-white hover:underline cursor-pointer">
                            {message.sender.username}
                        </span>
                        <span className="text-xs text-[#949ba4]">
                            {format(new Date(message.createdAt), "MM/dd/yyyy hh:mm a")}
                        </span>
                        {message.pinned && (
                             <PinIcon size={14} className="text-[#b5bac1] rotate-45" />
                        )}
                    </div>
                    
                    {message.deleted ? (
                        <p className="text-[#949ba4] italic mt-1 text-sm">
                            (Message deleted)
                        </p>
                    ) : (
                        <>
                            {message.content && (
                                <p className={`text-[#dbdee1] mt-1 break-words leading-relaxed ${message.pinned ? 'font-medium' : ''}`}>
                                    {message.content}
                                </p>
                            )}
                            {message.fileUrl && (
                                <img
                                    src={message.fileUrl}
                                    alt="Attachment"
                                    className="mt-2 max-w-md rounded-lg border border-[#2e3035]"
                                />
                            )}
                        </>
                    )}

                    {/* Reactions Display */}
                    {message.reactions && Object.keys(message.reactions).length > 0 && !message.deleted && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {Object.entries(message.reactions).map(([emoji, userIds]: [string, any]) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReaction(emoji)}
                                    className={`
                                        flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] border
                                        transition-colors text-sm
                                        ${userIds.includes(currentUserId) 
                                            ? 'bg-[#3b405a] border-[#5865f2] hover:bg-[#3b405a]/80' 
                                            : 'bg-[#2b2d31] border-transparent hover:border-[#4e5058]'
                                        }
                                    `}
                                >
                                    <span>{emoji}</span>
                                    <span className={`font-semibold text-xs ${userIds.includes(currentUserId) ? 'text-[#dee0fc]' : 'text-[#b5bac1]'}`}>
                                        {userIds.length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Message Actions Toolbar - Absolute Positioned */}
            {!message.deleted && (
                <div className={`absolute right-4 -top-2 bg-[#313338] border border-[#26272d] shadow-sm rounded-lg flex items-center p-0.5 transition-opacity duration-200 z-10 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button 
                        onClick={() => handleReaction('👍')} // Quick react
                        className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded tooltip-trigger"
                         title="Add Reaction"
                    >
                        <SmilePlus size={20} />
                    </button>
                    <button 
                        onClick={() => onReply(message)}
                        className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded"
                         title="Reply"
                    >
                        <Reply size={20} />
                    </button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded">
                                <MoreHorizontal size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-[#111214] border-[#1e1f22] text-[#dbdee1]">
                            <DropdownMenuItem onClick={() => onReply(message)} className="focus:bg-[#4752c4] focus:text-white cursor-pointer group">
                                <span className="flex-1">Reply</span>
                                <Reply size={16} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReaction('❤️')} className="focus:bg-[#4752c4] focus:text-white cursor-pointer group">
                                 <span className="flex-1">React ❤️</span>
                                 <SmilePlus size={16} />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-[#4752c4] focus:text-white cursor-pointer group">
                                <span className="flex-1">Forward</span>
                                <CornerUpRight size={16} />
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-[#1e1f22]" />

                             <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content || "")} className="focus:bg-[#4752c4] focus:text-white cursor-pointer group">
                                 <span className="flex-1">Copy Text</span>
                                 <Copy size={16} />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePin} className="focus:bg-[#4752c4] focus:text-white cursor-pointer group">
                                 <span className="flex-1">{message.pinned ? "Unpin Message" : "Pin Message"}</span>
                                 <PinIcon size={16} />
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="bg-[#1e1f22]" />

                            {message.senderId === currentUserId && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[#da373c] focus:text-white text-[#da373c] w-full hover:bg-[#da373c] hover:text-white cursor-pointer">
                                            <span className="flex-1">Delete Message</span>
                                            <Trash2 size={16} />
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-[#313338] border-[#26272d] text-[#dbdee1]">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                            <AlertDialogDescription className="text-[#949ba4]">
                                                Are you sure you want to delete this message?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="bg-[#2b2d31] hover:bg-[#404249] text-white border-none">Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete('forEveryone')} className="bg-[#da373c] hover:bg-[#a1282c] text-white">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                             {message.senderId !== currentUserId && (
                                <DropdownMenuItem onClick={() => handleDelete('forMe')} className="focus:bg-[#da373c] focus:text-white text-[#da373c] cursor-pointer group">
                                    <span className="flex-1">Delete for Me</span>
                                    <Trash2 size={16} />
                                </DropdownMenuItem>
                             )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

interface DirectMessageChatProps {
  userId: string;
  onToggleProfile?: () => void;
}

const DirectMessageChat = ({ userId, onToggleProfile }: DirectMessageChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, messages: allMessages } = useSelector(
    (state: RootState) => state.dm
  );
  const { friends } = useSelector((state: RootState) => state.friends);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Find the conversation with this user
  const conversation = conversations.find(
    (conv) => conv.participantId === userId
  );


  // Get recipient user data
  // 1. Try conversation participant
  // 2. Try looking up in friend list
  // 3. Fallback to basic info
  const friendData = friends.find(f => f.friendId === userId)?.friend;
  
  const recipientUser = conversation?.participant || friendData || {
    id: userId,
    username: "Loading...",
    email: "",
    imageUrl: undefined,
    status: undefined
  };

  useEffect(() => {
    // If we don't have the user details, fetch friends to try and find them
    if (!conversation?.participant && !friendData) {
        dispatch(fetchFriends());
    }
  }, [dispatch, conversation, friendData]);

  useEffect(() => {
    if (conversation?.id) {
      dispatch(fetchConversationMessages({ conversationId: conversation.id }));
      dispatch(markAsRead(conversation.id));
    }
  }, [dispatch, conversation?.id]);

  // Ensure we only show messages for the current conversation to avoid "ghosting"
  const displayMessages = conversation ? (allMessages[conversation.id] || []) : [];
  const messages = displayMessages;

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online":
        return "bg-[#23a55a]";
      case "idle":
        return "bg-[#f0b232]";
      case "dnd":
        return "bg-[#f23f43]";
      default:
        return "bg-[#80848e]";
    }
  };

  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !replyingTo) || isSending) return;

    setIsSending(true);
    try {
        if (replyingTo) {
             await dispatch(replyToMessage({
                 messageId: replyingTo.id,
                 content: messageInput.trim()
             })).unwrap();
             setReplyingTo(null);
        } else {
            await dispatch(
                sendMessage({
                    friendId: userId,
                    content: messageInput.trim(),
                })
            ).unwrap();
        }
        setMessageInput("");
        setShowEmojiPicker(false);
    } catch (error) {
        console.error("Failed to send message", error);
        toast.error("Failed to send message");
    } finally {
        setIsSending(false);
    }
  };

  const onEmojiClick = (emojiData: any) => {
    setMessageInput((prev) => prev + emojiData.emoji);
  };

  // Mock File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Just send a message saying "Sent a file: [name]" for now
          // Real backend implementation would upload first, get URL, then send message.
           dispatch(
            sendMessage({
                friendId: userId,
                content: `[Attached File: ${file.name}]`,
                fileUrl: "https://via.placeholder.com/300?text=File+Attachment" // Mock URL
            })
           );
      }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f22]">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#111214] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center">
              {recipientUser.imageUrl ? (
                <img
                  src={recipientUser.imageUrl}
                  alt={recipientUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xs font-semibold">
                  {getInitials(recipientUser.username)}
                </span>
              )}
            </div>
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(
                recipientUser.status
              )} border-2 border-[#313338] rounded-full`}
            />
          </div>
          <h3 className="font-semibold text-white">{recipientUser.username}</h3>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <Phone size={24} />
          </button>
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <Video size={24} />
          </button>
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <Pin size={24} />
          </button>
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <UserPlus size={24} />
          </button>
          
          {/* Use Users icon for Toggle Member List */}
          <button 
            onClick={onToggleProfile} 
            className="text-[#b5bac1] hover:text-white transition-colors md:block hidden" 
          >
            <Users size={24} />
          </button>

          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="w-36 px-2 py-1 bg-[#1e1f22] rounded text-sm text-white placeholder-[#949ba4] outline-none focus:ring-0 transition-all focus:w-60"
            />
            <Search
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#949ba4]"
            />
          </div>
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <Inbox size={24} />
          </button>
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <HelpCircle size={24} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-start mt-12 px-4">
             {/* Large Avatar */}
             <div className="w-[80px] h-[80px] rounded-full bg-[#5865f2] flex items-center justify-center mb-4">
              {recipientUser.imageUrl ? (
                <img
                  src={recipientUser.imageUrl}
                  alt={recipientUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-4xl font-semibold">
                  {getInitials(recipientUser.username)}
                </span>
              )}
            </div>
            
            <h1 className="text-[32px] font-bold text-white mb-2">
              {recipientUser.username}
            </h1>
            <h3 className="text-[24px] font-medium text-[#dbdee1] mb-4">
                {recipientUser.username}
            </h3>

            <p className="text-[#b5bac1] text-md mb-6 max-w-md">
              This is the beginning of your direct message history with <span className="font-semibold text-[#dbdee1]">{recipientUser.username}</span>.
            </p>

            {/* Mutual Server & Buttons */}
            <div className="flex items-center gap-4 mb-8">
                 <div className="flex items-center gap-2 text-[#b5bac1] text-sm">
                    {/* Tiny Icon */}
                    <div className="w-4 h-4 rounded-full bg-[#dbdee1] flex items-center justify-center text-[8px] font-bold text-black opacity-40">D</div>
                    1 Mutual Server
                 </div>
                 
                 <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-[#248046] hover:bg-[#1a6334] text-white rounded text-sm font-medium transition-colors">
                        Add Friend
                    </button>
                    <button className="px-3 py-1.5 bg-[#4e5058] hover:bg-[#6d6f78] text-white rounded text-sm font-medium transition-colors">
                        Block
                    </button>
                 </div>
            </div>

            {/* Wumpus & Wave */}
            <div className="flex flex-col items-start">
                 {/* Placeholder Wumpus - using a generic image or SVG if unavailable, standard discord wumpus usually */}
                 <img src="https://assets-global.website-files.com/6257adef93867e56f84d310a/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.png" alt="Wumpus" className="w-[100px] h-[100px] object-contain mb-4 opacity-70 grayscale" />
                 
                 <button className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded font-medium transition-colors w-full sm:w-auto">
                    Wave to {recipientUser.username}
                 </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.filter(m => !m.deletedBy || !m.deletedBy.includes(currentUser?.id || "")).map((message) => (
               <MessageItem 
                  key={message.id} 
                  message={message} 
                  currentUserId={currentUser?.id || ""}
                  getInitials={getInitials} 
                  onReply={(msg) => setReplyingTo(msg)}
               />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 pb-6">
        <form onSubmit={handleSendMessage} className="relative">
          {/* Reply Banner */}
          {replyingTo && (
              <div className="flex items-center justify-between bg-[#2b2d31] px-4 py-2 rounded-t-lg border-b border-[#202225] text-sm text-[#b5bac1]">
                  <div className="flex items-center gap-2">
                       <span className="text-[#949ba4]">Replying to</span>
                       <span className="font-semibold text-white">@{replyingTo.sender.username}</span>
                  </div>
                  <button onClick={() => setReplyingTo(null)} type="button" className="hover:text-white">
                      <Trash2 size={14} /> 
                      {/* Using trash icon for cancel for now, typically X */}
                  </button>
              </div>
          )}

          <div className={`flex items-center bg-[#383a40] px-4 py-3 hover:bg-[#404249] transition-all duration-200 focus-within:ring-0 focus-within:bg-[#404249] ${replyingTo ? 'rounded-b-lg' : 'rounded-lg'}`}>
            
            {/* File Upload */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[#b5bac1] hover:text-[#dcddde] mr-4 transition-colors p-1 hover:bg-[#313338] rounded-full"
            >
              <Plus size={24} className="bg-[#b5bac1] text-[#383a40] rounded-full p-0.5" /> 
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message @${recipientUser.username}`}
              className="flex-1 bg-transparent text-white placeholder-[#6d6f78] outline-none"
            />
            
            <button
              type="button"
              className="text-[#b5bac1] hover:text-[#dcddde] ml-2 transition-colors"
            >
              <Gift size={24} />
            </button>
            
            {/* Emoji Picker */}
            <div className="relative">
                <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`text-[#b5bac1] hover:text-[#dcddde] ml-2 transition-colors ${showEmojiPicker ? "text-yellow-400" : ""}`}
                >
                    <Smile size={24} />
                </button>
                {showEmojiPicker && (
                    <div className="absolute bottom-12 right-0 z-50 shadow-2xl">
                         <EmojiPicker 
                            theme={EmojiTheme.DARK} 
                            onEmojiClick={onEmojiClick}
                            width={350}
                            height={450}
                         />
                    </div>
                )}
            </div>

            {messageInput.trim() && (
              <button
                type="submit"
                className="ml-4 text-[#5865f2] hover:text-[#4752c4] transition-colors"
              >
                <Send size={24} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectMessageChat;
