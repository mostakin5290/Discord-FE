import { useState, useRef, forwardRef } from "react";
import { Plus, Smile, Gift, Send, Trash2 } from "lucide-react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import { validateMessage } from "@/utils/messageUtils";
import { toast } from "sonner";

interface MessageInputProps {
  placeholder: string;
  onSendMessage: (content: string, fileUrl?: string) => Promise<void>;
  replyingTo?: any | null;
  onCancelReply?: () => void;
  disabled?: boolean;
}

const MessageInput = forwardRef<HTMLDivElement, MessageInputProps>(
  (
    { placeholder, onSendMessage, replyingTo, onCancelReply, disabled = false },
    ref,
  ) => {
    const [messageInput, setMessageInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate message
      const validation = validateMessage(messageInput);
      if (!validation.valid) {
        if (validation.error) {
          toast.error(validation.error);
        }
        return;
      }

      if (isSending || disabled) return;

      setIsSending(true);
      try {
        await onSendMessage(messageInput.trim());
        setMessageInput("");
        setShowEmojiPicker(false);
      } catch (error: any) {
        toast.error(error?.message || "Failed to send message");
      } finally {
        setIsSending(false);
      }
    };

    const onEmojiClick = (emojiData: any) => {
      setMessageInput((prev) => prev + emojiData.emoji);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file size (max 8MB for example)
      if (file.size > 8 * 1024 * 1024) {
        toast.error("File size must be less than 8MB");
        return;
      }

      try {
        // In a real app, upload to server first and get URL
        // For now, just send a placeholder message
        const message = `[Attached File: ${file.name}]`;
        await onSendMessage(
          message,
          "https://via.placeholder.com/300?text=File+Attachment",
        );
        toast.success("File attached");
      } catch (error) {
        toast.error("Failed to upload file");
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <div ref={ref} className="px-4 pb-6">
        <form onSubmit={handleSubmit} className="relative">
          {/* Reply Banner */}
          {replyingTo && onCancelReply && (
            <div className="flex items-center justify-between bg-[#2b2d31] px-4 py-2 rounded-t-lg border-b border-[#202225] text-sm text-[#b5bac1]">
              <div className="flex items-center gap-2">
                <span className="text-[#949ba4]">Replying to</span>
                <span className="font-semibold text-white">
                  @
                  {replyingTo.sender?.username ||
                    replyingTo.user?.username ||
                    "Unknown"}
                </span>
              </div>
              <button
                onClick={onCancelReply}
                type="button"
                className="hover:text-white transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}

          <div
            className={`flex items-center bg-[#383a40] px-4 py-3 hover:bg-[#404249] transition-all duration-200 focus-within:bg-[#404249] ${
              replyingTo ? "rounded-b-lg" : "rounded-lg"
            }`}
          >
            {/* File Upload */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="text-[#b5bac1] hover:text-[#dcddde] mr-4 transition-colors p-1 hover:bg-[#313338] rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus
                size={24}
                className="bg-[#b5bac1] text-[#383a40] rounded-full p-0.5"
              />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isSending}
              maxLength={2000}
              className="flex-1 bg-transparent text-white placeholder-[#6d6f78] outline-none disabled:opacity-50"
            />

            <button
              type="button"
              disabled={disabled}
              className="text-[#b5bac1] hover:text-[#dcddde] ml-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Gift size={24} />
            </button>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                className={`text-[#b5bac1] hover:text-[#dcddde] ml-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  showEmojiPicker ? "text-yellow-400" : ""
                }`}
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
                disabled={isSending || disabled}
                className="ml-4 text-[#5865f2] hover:text-[#4752c4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={24} />
              </button>
            )}
          </div>

          {/* Character count */}
          {messageInput.length > 1800 && (
            <div className="text-right mt-1 text-xs text-[#949ba4]">
              {messageInput.length}/2000
            </div>
          )}
        </form>
      </div>
    );
  },
);

MessageInput.displayName = "MessageInput";

export { MessageInput };
export default MessageInput;
