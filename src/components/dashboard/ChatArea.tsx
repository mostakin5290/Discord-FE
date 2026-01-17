import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendNewMessage } from "@/store/slices/messageSlice";
import { Hash } from "lucide-react";
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
      <div className="h-12 px-4 flex items-center border-b border-white/5 shadow-sm">
        <Hash size={24} className="text-gray-400 mr-2" />
        <h3 className="font-semibold text-white">{channelName}</h3>
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
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
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
