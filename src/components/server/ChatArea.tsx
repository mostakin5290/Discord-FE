import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import {
  sendNewMessage,
  updateMessageReaction,
} from "@/store/slices/messageSlice";
import {
  Hash,
  Bell,
  Pin,
  Users,
  Search,
  HelpCircle,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import MessageItem from "@/components/chat/MessageItem";
import MessageInput from "@/components/chat/MessageInput";
import { AISummary } from "@/components/chat/AISummary";
import { shouldGroupMessage } from "@/utils/messageUtils";
import axiosClient from "@/lib/axios";
import { SearchModal } from "@/components/shared/SearchModal";
import socketService from "@/services/socket.service";

import { useChatSocket } from "@/hooks/useChatSocket";
import InboxNofification from "@/components/notifications/inbox-notification";

interface ChatAreaProps {
  channelId: string;
  channelName: string;
  serverId: string;
}

const ChatArea = ({ channelId, channelName, serverId }: ChatAreaProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messagesByChannel } = useSelector(
    (state: RootState) => state.message,
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = messagesByChannel[channelId] || [];
  
  // Real-time chat integration
  const { typingUsers, handleTyping } = useChatSocket(channelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // Separate effect for last seen - only on scroll/view, not on send
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Small delay to ensure message is visible
      const timer = setTimeout(() => {
        socketService.updateLastSeen(channelId, lastMessage.id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, channelId]); // Only when message count changes

  const handleSendMessage = async (content: string, file?: File) => {
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
          file: file,
        }),
      ).unwrap();
    } catch (error: any) {
      toast.error(error || "Failed to sending message");
      throw error; // Re-throw to let MessageInput handle the error
    }
  };

  const handleReaction = async (
    messageId: string,
    emoji: string,
    isAdding: boolean,
  ) => {
    try {
      // Update local state immediately for better UX
      dispatch(
        updateMessageReaction({
          channelId,
          messageId,
          emoji,
          userId: currentUser?.id || "",
          isAdding,
        }),
      );

      // Send to backend
      if (isAdding) {
        await axiosClient.post(`/messages/${messageId}/reactions`, { emoji });
      } else {
        await axiosClient.delete(
          `/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
        );
      }
    } catch (error: any) {
      // Revert optimistic update on error
      dispatch(
        updateMessageReaction({
          channelId,
          messageId,
          emoji,
          userId: currentUser?.id || "",
          isAdding: !isAdding, // Revert
        }),
      );
      toast.error(
        error?.response?.data?.message || "Failed to update reaction",
      );
    }
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
          {/* AI Summary Component */}
          <AISummary channelId={channelId} channelName={channelName} />

          <Bell
            size={24}
            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
          />
          <Pin
            size={24}
            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
          />
          <Users
            size={24}
            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
          />

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-[#1e1f22] hover:bg-[#0b0c0e] text-[#dbdee1] text-sm rounded px-3 py-1.5 transition-all duration-300 hover:ring-2 hover:ring-[#5865f2]/30 cursor-pointer"
          >
            <Search size={16} className="text-[#949ba4]" />
            <span className="text-xs text-[#949ba4]">Search</span>
          </button>

          <InboxNofification />
          <HelpCircle
            size={24}
            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
          />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#2b2d31] [&::-webkit-scrollbar-thumb]:bg-[#1a1b1e] hover:[&::-webkit-scrollbar-thumb]:bg-[#141517] [&::-webkit-scrollbar-thumb]:rounded-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#2b2d31] p-6 rounded-full mb-6">
              <Hash size={48} className="text-[#5865f2]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Welcome to #{channelName}!
            </h3>
            <p className="text-[#949ba4]">
              This is the start of the #{channelName} channel.
            </p>
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

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="absolute bottom-[80px] left-4 text-xs font-bold text-[#dbdee1] animate-in fade-in slide-in-from-bottom-2">
          <span className="animate-pulse">
            {typingUsers.length > 3
              ? "Several people are typing..."
              : `${typingUsers.length} person is typing...`}
            {/* Note: Ideally map user IDs to names here if available in a cache */}
          </span>
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        placeholder={`Message #${channelName}`}
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        onTyping={handleTyping}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        serverId={serverId}
      />
    </div>
  );
};

export default ChatArea;
