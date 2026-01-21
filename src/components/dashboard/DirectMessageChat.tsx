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
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/types";
import {
  fetchConversations,
  fetchConversationMessages,
  sendMessage,
  markAsRead,
  addReaction,
  removeReaction,
  replyToMessage,
  pinMessage,
  deleteMessageAction,
} from "@/store/slices/dmSlice";
import { fetchFriends } from "@/store/slices/friendSlice";
import MessageItem from "@/components/chat/MessageItem";
import MessageInput from "@/components/chat/MessageInput";
import {
  getInitials,
  getStatusColor,
  shouldGroupMessage,
} from "@/utils/messageUtils";
import { useNavigate } from "react-router";
import { createDirectCallToken } from "@/store/slices/callSlice";

interface DirectMessageChatProps {
  userId: string;
  onToggleProfile?: () => void;
}

const DirectMessageChat = ({
  userId,
  onToggleProfile,
}: DirectMessageChatProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    conversations,
    messages: allMessages,
    isLoading,
  } = useSelector((state: RootState) => state.dm);
  const { friends } = useSelector((state: RootState) => state.friends);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchAttempted = useRef(false);

  // Find the conversation with this user
  const conversation = conversations.find(
    (conv) => conv.participantId === userId,
  );

  // Reset fetch attempt when userId changes
  useEffect(() => {
    fetchAttempted.current = false;
  }, [userId]);

  // Get recipient user data
  // 1. Try conversation participant
  // 2. Try looking up in friend list
  // 3. Fallback to basic info
  const friendData = friends.find((f) => f.friendId === userId)?.friend;

  const recipientUser = conversation?.participant || friendData;

  useEffect(() => {
    // If we don't have the user details, fetch friends to try and find them
    if (!conversation?.participant && !friendData) {
      dispatch(fetchFriends());
    }
  }, [dispatch, conversation, friendData]);

  // If conversation is missing (not in list yet) but we have a user, ensure we have latest conversations
  // This handles the case where we navigate to a DM but the conversation hasn't been loaded in the list yet
  useEffect(() => {
    if (!conversation && !isLoading && !fetchAttempted.current) {
      dispatch(fetchConversations());
      fetchAttempted.current = true;
    }
  }, [dispatch, conversation, isLoading, userId]);

  useEffect(() => {
    if (conversation?.id) {
      dispatch(fetchConversationMessages({ conversationId: conversation.id }));
      dispatch(markAsRead(conversation.id));
    }
  }, [dispatch, conversation?.id]);

  // Ensure we only show messages for the current conversation to avoid "ghosting"
  const displayMessages = conversation
    ? allMessages[conversation.id] || []
    : [];

  const messages = displayMessages;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      }, 100);
    }
  }, [messages.length, conversation?.id]);

  const handleSendMessage = async (content: string, fileUrl?: string) => {
    try {
      if (replyingTo) {
        await dispatch(
          replyToMessage({
            messageId: replyingTo.id,
            content: content,
          }),
        ).unwrap();
        setReplyingTo(null);
      } else {
        await dispatch(
          sendMessage({
            friendId: userId,
            content: content,
            fileUrl: fileUrl,
          }),
        ).unwrap();
      }
    } catch (error) {
      console.error("Failed to send message", error);
      throw error; // Re-throw to let MessageInput handle the error
    }
  };

  const handleReaction = async (
    messageId: string,
    emoji: string,
    isAdding: boolean,
  ) => {
    try {
      // Find the message to check for existing reactions
      const message = messages.find((m) => m.id === messageId);
      if (message?.reactions && isAdding) {
        // Check if user already has a different reaction
        const userExistingReaction = Object.keys(message.reactions).find(
          (e) =>
            message?.reactions?.[e]?.includes(currentUser?.id || "") &&
            e !== emoji,
        );

        // Remove existing reaction first
        if (userExistingReaction) {
          await dispatch(
            removeReaction({ messageId, emoji: userExistingReaction }),
          ).unwrap();
        }
      }

      // Add or remove the clicked reaction
      if (isAdding) {
        await dispatch(addReaction({ messageId, emoji })).unwrap();
      } else {
        await dispatch(removeReaction({ messageId, emoji })).unwrap();
      }
    } catch (error) {
      // Error handling done by toast in slice
    }
  };

  const handlePin = async (messageId: string) => {
    await dispatch(pinMessage(messageId)).unwrap();
  };

  const handleDelete = async (
    messageId: string,
    deleteType: "forMe" | "forEveryone" = "forEveryone",
  ) => {
    await dispatch(deleteMessageAction({ messageId, deleteType })).unwrap();
  };

  const handleAudioCall = async () => {
    const roomId = crypto.randomUUID();

    try {
      await dispatch(
        createDirectCallToken({
          roomName: roomId,
          participantName: currentUser?.username!,
          participantIdentity: currentUser?.id!,
          friendId: userId,
        }),
      ).unwrap();

      navigate(`/call/${userId}/${roomId}`);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const handleVideoCall = async () => {
    const roomId = crypto.randomUUID();

    try {
      await dispatch(
        createDirectCallToken({
          roomName: roomId,
          participantName: currentUser?.username!,
          participantIdentity: currentUser?.id!,
          friendId: userId,
        }),
      ).unwrap();

      navigate(`/video/${userId}/${roomId}`);
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  if (!recipientUser || (isLoading && (!messages || messages.length === 0))) {
    return (
      <div className="flex-1 flex flex-col bg-[#1e1f22]">
        {/* Header Skeleton */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#111214] shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#313338] animate-pulse" />
            <div className="h-4 w-24 bg-[#313338] rounded animate-pulse" />
          </div>
        </div>
        {/* Messages Skeleton */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-start opacity-50">
              <div className="w-10 h-10 rounded-full bg-[#313338] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-[#313338] rounded" />
                  <div className="h-3 w-12 bg-[#313338] rounded" />
                </div>
                <div className="h-4 w-3/4 bg-[#313338] rounded" />
                <div className="h-4 w-1/2 bg-[#313338] rounded" />
              </div>
            </div>
          ))}
        </div>
        {/* Input Skeleton */}
        <div className="p-4">
          <div className="h-11 bg-[#313338] rounded-lg w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f22]">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#111214] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-6 h-6 rounded-full bg-[#5865f2] flex items-center justify-center">
              {recipientUser?.imageUrl ? (
                <img
                  src={recipientUser?.imageUrl}
                  alt={recipientUser?.username}
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
                recipientUser.status,
              )} border-2 border-[#313338] rounded-full`}
            />
          </div>
          <h3 className="font-semibold text-white">{recipientUser.username}</h3>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-[#b5bac1] hover:text-white transition-colors">
            <Phone onClick={handleAudioCall} size={24} />
          </button>
          <button
            onClick={handleVideoCall}
            className="text-[#b5bac1] hover:text-white transition-colors"
          >
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
              className="w-36 px-2 py-1 bg-[#1e1f22] rounded text-sm text-white placeholder-[#949ba4] outline-none transition-all duration-300 focus:w-60 focus:ring-2 focus:ring-[#5865f2]/30 focus:bg-[#0b0c0e]"
            />
            <Search
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#949ba4]"
            />
          </div>
          <button className="text-[#b5bac1] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
            <Inbox size={24} />
          </button>
          <button className="text-[#b5bac1] hover:text-white transition-all duration-200 hover:scale-110 active:scale-95">
            <HelpCircle size={24} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#2b2d31] [&::-webkit-scrollbar-thumb]:bg-[#1a1b1e] hover:[&::-webkit-scrollbar-thumb]:bg-[#141517] [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Welcome / Start of History */}

        {/* Messages List */}
        <div className="space-y-0 pb-4">
          {messages
            .filter(
              (m) =>
                !m.deletedBy || !m.deletedBy.includes(currentUser?.id || ""),
            )
            .map((message, index, arr) => {
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
                  isDM={true}
                />
              );
            })}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        placeholder={`Message @${recipientUser.username}`}
        onSendMessage={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
    </div>
  );
};

export default DirectMessageChat;
