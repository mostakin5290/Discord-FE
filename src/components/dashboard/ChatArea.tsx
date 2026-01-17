import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
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
import { shouldGroupMessage } from "@/utils/messageUtils";
import axiosClient from "@/lib/axios";

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

          {/* Search Bar - Mock */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search"
              className="bg-[#1e1f22] text-sm text-[#dbdee1] rounded px-2 py-1 w-36 outline-none transition-all duration-300 focus:w-60 focus:bg-[#0b0c0e] focus:ring-2 focus:ring-[#5865f2]/30"
            />
            <Search
              size={16}
              className="absolute right-2 top-1.5 text-[#949ba4]"
            />
          </div>

          <Inbox
            size={24}
            className="cursor-pointer hover:text-[#dbdee1] transition-all duration-200 hover:scale-110 active:scale-95"
          />
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
