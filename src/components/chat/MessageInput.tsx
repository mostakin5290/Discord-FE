import { useState, useRef, forwardRef } from "react";
import { Plus, Smile, Send, Trash2 } from "lucide-react";
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
      <div
        ref={ref}
        className="px-4 pb-6 animate-in fade-in slide-in-from-bottom duration-500"
      >
        <form onSubmit={handleSubmit} className="relative">
          {/* Reply Banner */}
          {replyingTo && onCancelReply && (
            <div className="flex items-center justify-between bg-[#1e1f22] px-4 py-2 rounded-t-[8px] border-b border-[#202225] text-sm text-[#b5bac1]">
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
            className={`flex items-center gap-3 bg-[#383a40] hover:bg-[#404249] focus-within:bg-[#404249] focus-within:ring-2 focus-within:ring-[#5865f2]/30 px-4 py-3 transition-all duration-200 ${
              replyingTo ? "rounded-b-[8px]" : "rounded-[8px]"
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
              title="Upload a file"
              className="flex-shrink-0 text-[#b5bac1] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 hover:rotate-90"
            >
              <Plus size={20} />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={placeholder}
              disabled={disabled || isSending}
              maxLength={2000}
              className="flex-1 bg-transparent text-white placeholder-[#6d6f78] placeholder:transition-all placeholder:duration-200 focus:placeholder-[#5d6169] disabled:opacity-50 text-[15px] py-1"
              style={{
                outline: "none",
                border: "none",
                boxShadow: "none",
              }}
            />

            {/* Emoji Picker */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={disabled}
                title="Open emoji picker"
                className={`hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  showEmojiPicker
                    ? "text-yellow-400 scale-110 rotate-12"
                    : "text-[#b5bac1] hover:text-white rotate-0"
                }`}
              >
                <Smile size={20} />
              </button>
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-150"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute bottom-12 right-0 z-50 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2 duration-200">
                    <div className="rounded-xl overflow-hidden ring-2 ring-[#2b2d31]">
                      <EmojiPicker
                        theme={EmojiTheme.DARK}
                        onEmojiClick={onEmojiClick}
                        width={350}
                        height={450}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {messageInput.trim() && (
              <button
                type="submit"
                disabled={isSending || disabled}
                title="Send message"
                className="flex-shrink-0 text-[#5865f2] hover:text-[#4752c4] hover:drop-shadow-[0_0_8px_rgba(88,101,242,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 animate-in slide-in-from-right-2 fade-in duration-200"
              >
                <Send size={20} className={isSending ? "animate-pulse" : ""} />
              </button>
            )}
          </div>

          {/* Character count */}
          {messageInput.length > 1800 && (
            <div className="text-right mt-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-1 duration-200">
              <span
                className={`${
                  messageInput.length > 1950 ? "text-red-400" : "text-[#949ba4]"
                } transition-colors duration-200`}
              >
                {messageInput.length}/2000
              </span>
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
