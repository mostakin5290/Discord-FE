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
import type { RootState, AppDispatch } from "@/store/store";
import {
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

interface DirectMessageChatProps {
  userId: string;
  onToggleProfile?: () => void;
}

const DirectMessageChat = ({
  userId,
  onToggleProfile,
}: DirectMessageChatProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, messages: allMessages } = useSelector(
    (state: RootState) => state.dm,
  );
  const { friends } = useSelector((state: RootState) => state.friends);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the conversation with this user
  const conversation = conversations.find(
    (conv) => conv.participantId === userId,
  );

  // Get recipient user data
  // 1. Try conversation participant
  // 2. Try looking up in friend list
  // 3. Fallback to basic info
  const friendData = friends.find((f) => f.friendId === userId)?.friend;

  const recipientUser = conversation?.participant ||
    friendData || {
      id: userId,
      username: "Loading...",
      email: "",
      imageUrl: undefined,
      status: undefined,
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
  const displayMessages = conversation
    ? allMessages[conversation.id] || []
    : [];
  const messages = displayMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    if (isAdding) {
      await dispatch(addReaction({ messageId, emoji })).unwrap();
    } else {
      await dispatch(removeReaction({ messageId, emoji })).unwrap();
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
                recipientUser.status,
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
              This is the beginning of your direct message history with{" "}
              <span className="font-semibold text-[#dbdee1]">
                {recipientUser.username}
              </span>
              .
            </p>

            {/* Mutual Server & Buttons */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-[#b5bac1] text-sm">
                {/* Tiny Icon */}
                <div className="w-4 h-4 rounded-full bg-[#dbdee1] flex items-center justify-center text-[8px] font-bold text-black opacity-40">
                  D
                </div>
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
              <img
                src="https://assets-global.website-files.com/6257adef93867e56f84d310a/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.png"
                alt="Wumpus"
                className="w-[100px] h-[100px] object-contain mb-4 opacity-70 grayscale"
              />

              <button className="px-4 py-2 bg-[#5865f2] hover:bg-[#4752c4] text-white rounded font-medium transition-colors w-full sm:w-auto">
                Wave to {recipientUser.username}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {messages
              .filter(
                (m) =>
                  !m.deletedBy || !m.deletedBy.includes(currentUser?.id || ""),
              )
              .map((message, index) => {
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
                    isDM={true}
                  />
                );
              })}
          </div>
        )}
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
