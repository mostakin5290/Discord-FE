import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/types";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import {
  MoreHorizontal,
  Reply,
  SmilePlus,
  Trash2,
  Copy,
  Pin as PinIcon,
  CornerUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { toast } from "sonner";
import { getInitials, formatMessageTime } from "@/utils/messageUtils";
import { FileAttachment } from "@/components/chat/FileAttachment";

interface MessageItemProps {
  message: any;
  currentUserId: string;
  onReply?: (message: any) => void;
  onPin?: (messageId: string) => Promise<void>;
  onDelete?: (
    messageId: string,
    deleteType?: "forMe" | "forEveryone",
  ) => Promise<void>;
  onReaction?: (
    messageId: string,
    emoji: string,
    isAdding: boolean,
  ) => Promise<void>;
  showGrouping?: boolean;
  isDM?: boolean; // Direct message vs server message
}

const MessageItem = ({
  message,
  currentUserId,
  onReply,
  onPin,
  onDelete,
  onReaction,
  showGrouping = false,
  isDM = false,
}: MessageItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isOwnMessage =
    message.senderId === currentUserId || message.userId === currentUserId;
  const sender = message.sender || message.user;

  // Check if message is a single emoji (or 2-3 emojis)
  const isSingleEmoji = (text: string) => {
    if (!text) return false;
    const emojiRegex = /^[\p{Emoji}\u200d]+$/u;
    const trimmed = text.trim();
    // Check if it's 1-3 emojis
    const emojiCount = [...trimmed].filter((char) =>
      /\p{Emoji}/u.test(char),
    ).length;
    return emojiRegex.test(trimmed) && emojiCount <= 3;
  };

  // Helper to check if current user reacted with a specific emoji
  const hasReacted = (emoji: string) => {
    return (
      message.reactions && message.reactions[emoji]?.includes(currentUserId)
    );
  };

  const handleReaction = async (emoji: string) => {
    if (!onReaction) return;

    try {
      // Check if user already reacted with a different emoji
      const userExistingReaction = message.reactions
        ? Object.keys(message.reactions).find(
            (e) => message.reactions[e]?.includes(currentUserId) && e !== emoji,
          )
        : null;

      // If user has a different reaction, remove it first
      if (userExistingReaction) {
        await onReaction(message.id, userExistingReaction, false);
      }

      // Toggle the clicked reaction
      await onReaction(message.id, emoji, !hasReacted(emoji));
      setShowEmojiPicker(false);
    } catch (error) {
      toast.error("Failed to react to message");
    }
  };

  const handleEmojiSelect = (emojiData: any) => {
    handleReaction(emojiData.emoji);
  };

  const handlePin = async () => {
    if (!onPin) return;

    try {
      await onPin(message.id);
      toast.success(message.pinned ? "Message unpinned" : "Message pinned");
    } catch (error) {
      toast.error("Failed to pin message");
    }
  };

  const handleDelete = async (
    deleteType: "forMe" | "forEveryone" = "forEveryone",
  ) => {
    if (!onDelete) return;

    try {
      await onDelete(message.id, deleteType);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleCopy = () => {
    if (message.content) {
      navigator.clipboard.writeText(message.content);
      toast.success("Message copied to clipboard");
    }
  };

  return (
    <div
      className={`group flex flex-col hover:bg-[#26272d] -mx-4 px-4 py-0.5 rounded-[4px] relative transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 ${
        isHovered ? "bg-[#26272d]" : ""
      } ${message.pinned ? "bg-[#33353b] border-l-4 border-[#5865f2] pl-3.5" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Reply Context */}
      {message.replyTo && (
        <div className="flex items-center gap-2 mb-1 ml-11 text-xs text-[#b5bac1]">
          <div className="w-8 h-3 border-l-2 border-t-2 border-[#4e5058] rounded-tl-md" />
          {message.replyTo.sender?.imageUrl && (
            <img
              src={message.replyTo.sender.imageUrl}
              className="w-4 h-4 rounded-full"
              alt=""
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          <span className="font-semibold text-[#b5bac1] hover:underline cursor-pointer">
            @{message.replyTo.sender?.username || "Unknown"}
          </span>
          <span className="truncate max-w-xs cursor-pointer hover:text-white transition-colors">
            {message.replyTo.content || "Click to see attachment"}
          </span>
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* Avatar */}
        {!showGrouping && (
          <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-110 hover:ring-2 hover:ring-[#5865f2]/50 mt-1">
            {sender?.imageUrl ? (
              <img
                src={sender.imageUrl}
                alt={sender.username || "User"}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {getInitials(sender?.username || sender?.firstName || "?")}
              </span>
            )}
          </div>
        )}

        {/* Compact timestamp for grouped messages */}
        {showGrouping && (
          <div className="w-10 flex-shrink-0 flex items-start justify-center">
            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatMessageTime(message.createdAt).split(" at ")[1]}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {!showGrouping && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white hover:underline cursor-pointer">
                {sender?.firstName && sender?.lastName
                  ? `${sender.firstName} ${sender.lastName}`
                  : sender?.username || "Unknown User"}
              </span>
              <span className="text-xs text-[#949ba4]">
                {formatMessageTime(message.createdAt)}
              </span>
              {message.pinned && (
                <PinIcon size={14} className="text-[#b5bac1] rotate-45" />
              )}
            </div>
          )}

          {message.deleted ? (
            <p className="text-[#949ba4] italic mt-1 text-sm">
              (Message deleted)
            </p>
          ) : (
            <>
              {message.content && (
                <p
                  className={`${
                    isSingleEmoji(message.content)
                      ? "text-7xl leading-none my-2 animate-in zoom-in-50 duration-300"
                      : `text-[#dbdee1] ${!showGrouping ? "mt-1" : ""} break-words leading-relaxed ${
                          message.pinned ? "font-medium text-[#e3e5e8]" : ""
                        }`
                  }`}
                >
                  {message.content}
                </p>
              )}
              {message.fileUrl && (
                <FileAttachment fileUrl={message.fileUrl} />
              )}
            </>
          )}

          {/* Reactions Display */}
          {message.reactions &&
            Object.keys(message.reactions).length > 0 &&
            !message.deleted && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {Object.entries(message.reactions).map(
                  ([emoji, userIds]: [string, any]) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(emoji)}
                      className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-lg border
                    transition-all duration-200 text-sm cursor-pointer
                    ${
                      userIds.includes(currentUserId)
                        ? "bg-[#5865f2]/20 border-[#5865f2] hover:bg-[#5865f2]/30 scale-105 shadow-md shadow-[#5865f2]/20"
                        : "bg-[#2b2d31] border-transparent hover:border-[#5865f2]/40 hover:scale-105"
                    }
                    active:scale-95
                  `}
                    >
                      <span className="text-base">{emoji}</span>
                      <span
                        className={`font-semibold text-xs ${
                          userIds.includes(currentUserId)
                            ? "text-[#5865f2]"
                            : "text-[#b5bac1]"
                        }`}
                      >
                        {userIds.length}
                      </span>
                    </button>
                  ),
                )}
              </div>
            )}
        </div>
      </div>

      {/* Message Actions Toolbar */}
      {!message.deleted && (
        <div
          className={`absolute right-4 -top-2 bg-[#1e1f22] border border-[#2b2d31] shadow-2xl rounded-lg flex items-center p-0.5 transition-all duration-150 z-10 ${
            isHovered || showEmojiPicker
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
          onMouseEnter={() => setIsHovered(true)}
        >
          {onReaction && (
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition-all duration-200 hover:scale-110 active:scale-95 ${
                  showEmojiPicker ? "bg-[#5865f2] text-white" : ""
                }`}
                title="Add Reaction"
              >
                <SmilePlus size={20} />
              </button>
              {showEmojiPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] animate-in fade-in duration-150"
                    onClick={() => setShowEmojiPicker(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                    <div className="shadow-2xl rounded-xl overflow-hidden ring-2 ring-[#2b2d31]">
                      <EmojiPicker
                        theme={EmojiTheme.DARK}
                        onEmojiClick={handleEmojiSelect}
                        width={320}
                        height={400}
                        searchDisabled
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition-all duration-200 hover:scale-110 active:scale-95"
              title="Reply"
            >
              <Reply size={20} />
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-[#b5bac1] hover:text-white hover:bg-[#404249] rounded transition-all duration-200 hover:scale-110 active:scale-95">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#111214] border-[#1e1f22] text-[#dbdee1]"
            >
              {onReply && (
                <DropdownMenuItem
                  onClick={() => onReply(message)}
                  className="focus:bg-[#4752c4] focus:text-white cursor-pointer"
                >
                  <span className="flex-1">Reply</span>
                  <Reply size={16} />
                </DropdownMenuItem>
              )}
              {onReaction && (
                <DropdownMenuItem
                  onClick={() => handleReaction("❤️")}
                  className="focus:bg-[#4752c4] focus:text-white cursor-pointer"
                >
                  <span className="flex-1">React ❤️</span>
                  <SmilePlus size={16} />
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="focus:bg-[#4752c4] focus:text-white cursor-pointer">
                <span className="flex-1">Forward</span>
                <CornerUpRight size={16} />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-[#1e1f22]" />

              <DropdownMenuItem
                onClick={handleCopy}
                className="focus:bg-[#4752c4] focus:text-white cursor-pointer"
              >
                <span className="flex-1">Copy Text</span>
                <Copy size={16} />
              </DropdownMenuItem>

              {onPin && (
                <DropdownMenuItem
                  onClick={handlePin}
                  className="focus:bg-[#4752c4] focus:text-white cursor-pointer"
                >
                  <span className="flex-1">
                    {message.pinned ? "Unpin Message" : "Pin Message"}
                  </span>
                  <PinIcon size={16} />
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-[#1e1f22]" />

              {isOwnMessage && onDelete && (
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
                        Are you sure you want to delete this message? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-[#2b2d31] hover:bg-[#404249] text-white border-none">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete("forEveryone")}
                        className="bg-[#da373c] hover:bg-[#a1282c] text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {!isOwnMessage && isDM && onDelete && (
                <DropdownMenuItem
                  onClick={() => handleDelete("forMe")}
                  className="focus:bg-[#da373c] focus:text-white text-[#da373c] cursor-pointer"
                >
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

export { MessageItem };
export default MessageItem;
