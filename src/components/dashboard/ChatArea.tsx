import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { sendNewMessage } from "@/store/slices/messageSlice";
import { Hash, Plus, Smile, Gift, Send } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";

interface ChatAreaProps {
  channelId: string;
  channelName: string;
}

const ChatArea = ({ channelId, channelName }: ChatAreaProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { messagesByChannel } = useSelector(
    (state: RootState) => state.message
  );

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = messagesByChannel[channelId] || [];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await dispatch(
        sendNewMessage({
          channelId,
          content: messageInput,
        })
      ).unwrap();
      setMessageInput("");
    } catch (error: any) {
      toast.error(error || "Failed to send message");
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MM/dd/yyyy h:mm a");
    }
  };

  return (
    <div className="flex-1 flex flex-col glass-panel">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center border-b border-white/5 shadow-sm">
        <Hash size={24} className="text-gray-400 mr-2" />
        <h3 className="font-semibold text-white">{channelName}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Hash size={48} className="mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              Welcome to #{channelName}!
            </h3>
            <p>This is the start of the #{channelName} channel.</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const showHeader =
              !prevMessage || prevMessage.user.id !== message.user.id;

            return (
              <div
                key={message.id}
                className={`flex gap-4 px-4 py-1 rounded group message-hover transition-all duration-150 ${
                  !showHeader ? "mt-0.5" : "mt-4"
                }`}
              >
                {/* User Avatar */}
                {showHeader ? (
                  <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0 shadow-md animate-scale-in">
                    {message.user.imageUrl ? (
                      <img
                        src={message.user.imageUrl}
                        alt={message.user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {message.user.firstName?.charAt(0) ||
                          message.user.username.charAt(0)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-10 flex-shrink-0 flex items-start justify-center">
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {format(new Date(message.createdAt), "h:mm a")}
                    </span>
                  </div>
                )}

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {showHeader && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-white">
                        {message.user.firstName && message.user.lastName
                          ? `${message.user.firstName} ${message.user.lastName}`
                          : message.user.username}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatMessageTime(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <p className="text-gray-300 break-words">{message.content}</p>
                  {message.fileUrl && (
                    <img
                      src={message.fileUrl}
                      alt="attachment"
                      className="mt-2 max-w-md rounded-lg"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 pb-6">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center glass-button rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-[#5865f2] focus-within:bg-black/40">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 mr-2 transition-all duration-150 hover:scale-110"
            >
              <Plus size={20} />
            </button>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${channelName}`}
              className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none"
            />
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 ml-2 transition-all duration-150 hover:scale-110"
            >
              <Gift size={20} />
            </button>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 ml-2 transition-all duration-150 hover:scale-110"
            >
              <Smile size={20} />
            </button>
            {messageInput.trim() && (
              <button
                type="submit"
                className="ml-2 text-[#5865f2] hover:text-[#4752c4] transition-all duration-150 animate-scale-in hover:scale-110"
              >
                <Send size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
