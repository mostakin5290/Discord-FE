import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendNewMessage } from "@/store/slices/messageSlice";
import { Hash, Bell, Pin, Users, Search, HelpCircle, Inbox } from "lucide-react";
import { toast } from "sonner";
import MessageItem from "@/components/chat/MessageItem";
import MessageInput from "@/components/chat/MessageInput";
import { shouldGroupMessage } from "@/utils/messageUtils";

interface ChatAreaProps {
  channelId: string;
  channelName: string;
}

const ChatArea = ({ channelId, channelName }: ChatAreaProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messagesByChannel } = useSelector(
    (state: RootState) => state.message,
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = messagesByChannel[channelId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, fileUrl?: string) => {
    try {
      if (replyingTo) {
        // TODO: Implement reply functionality for server messages
        toast.info("Reply feature coming soon!");
        setReplyingTo(null);
        return;
      }

      await dispatch(
        sendNewMessage({
          channelId,
          content: content,
          fileUrl: fileUrl,
        }),
      ).unwrap();
    } catch (error: any) {
      toast.error(error || "Failed to send message");
      throw error; // Re-throw to let MessageInput handle the error
    }
  };

  const handleReaction = async (
    messageId: string,
    emoji: string,
    isAdding: boolean,
  ) => {
    // TODO: Implement reaction functionality for server messages
    toast.info("Reactions coming soon!");
  };

  const handlePin = async (messageId: string) => {
    // TODO: Implement pin functionality for server messages
    toast.info("Pin feature coming soon!");
  };

  const handleDelete = async (
    messageId: string,
    deleteType: "forMe" | "forEveryone" = "forEveryone",
  ) => {
    // TODO: Implement delete functionality for server messages
    toast.info("Delete feature coming soon!");
  };

  return (
    <div className="flex-1 flex flex-col glass-panel">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-sm bg-[#1a1b1e]">
        <div className="flex items-center">
          <Hash size={24} className="text-[#949ba4] mr-2" />
          <h3 className="font-bold text-white text-base">{channelName}</h3>
          {/* Optional: Add topic description text here later */}
        </div>
        
        {/* Header Toolbar */}
        <div className="flex items-center gap-4 text-[#b5bac1]">
          <Bell size={24} className="cursor-pointer hover:text-[#dbdee1] transition-colors" />
          <Pin size={24} className="cursor-pointer hover:text-[#dbdee1] transition-colors" />
          <Users size={24} className="cursor-pointer hover:text-[#dbdee1] transition-colors" />
          
          {/* Search Bar - Mock */}
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-2 py-1 w-36 outline-none transition-all focus:w-60 focus:bg-[#0b0c0e]"
            />
            <Search size={16} className="absolute right-2 top-1.5 text-[#949ba4]" />
          </div>

          <Inbox size={24} className="cursor-pointer hover:text-[#dbdee1] transition-colors" />
          <HelpCircle size={24} className="cursor-pointer hover:text-[#dbdee1] transition-colors" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Hash size={48} className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Welcome to #{channelName}!
            </h3>
            <p>This is the start of the #{channelName} channel.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {messages.map((message, index, arr) => {
              const prevMessage = index > 0 ? arr[index - 1] : null;
              const showGrouping = shouldGroupMessage(message, prevMessage);

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  currentUserId={currentUser?.id || ""}
                  onReply={(msg) => setReplyingTo(msg)}
                  onPin={handlePin}
                  onDelete={handleDelete}
                  onReaction={handleReaction}
                  showGrouping={showGrouping}
                  isDM={false}
                />
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        placeholder={`Message #${channelName}`}
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};

export default ChatArea;
