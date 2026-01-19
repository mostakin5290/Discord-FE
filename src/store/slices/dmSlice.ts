import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as dmService from "@/services/dm.service";
import type { Conversation, DirectMessage } from "@/services/dm.service";
import type { RootState } from "@/store/types";

interface DMState {
  conversations: Conversation[];
  messages: { [conversationId: string]: DirectMessage[] };
  hasMore: { [conversationId: string]: boolean };
  activeConversationId: string | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: DMState = {
  conversations: [],
  messages: {},
  hasMore: {},
  activeConversationId: null,
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchConversations = createAsyncThunk(
  "dm/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const conversations = await dmService.getConversations();
      return conversations;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch conversations"
      );
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  "dm/fetchConversationMessages",
  async (
    { conversationId, cursor }: { conversationId: string; cursor?: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await dmService.getConversationMessages(
        conversationId,
        cursor
      );
      return { conversationId, ...data };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "dm/sendMessage",
  async (
    {
      friendId,
      content,
      fileUrl,
    }: { friendId: string; content?: string; fileUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      const message = await dmService.sendDirectMessage(
        friendId,
        content,
        fileUrl
      );
      return message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "dm/markAsRead",
  async (conversationId: string, { rejectWithValue }) => {
    try {
      await dmService.markMessagesAsRead(conversationId);
      return conversationId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark messages as read"
      );
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "dm/deleteMessage",
  async (
    {
      messageId,
      conversationId,
    }: { messageId: string; conversationId: string },
    { rejectWithValue }
  ) => {
    try {
      await dmService.deleteDirectMessage(messageId);
      return { messageId, conversationId };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

export const pinMessage = createAsyncThunk(
  "dm/pinMessage",
  async (messageId: string, { rejectWithValue }) => {
    try {
      const message = await dmService.pinMessage(messageId);
      return message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to pin message"
      );
    }
  }
);

export const deleteMessageAction = createAsyncThunk(
  "dm/deleteMessageAction",
  async (
    { messageId, deleteType }: { messageId: string; deleteType: 'forMe' | 'forEveryone' },
    { rejectWithValue }
  ) => {
    try {
      const message = await dmService.deleteMessageAction(messageId, deleteType);
      return message; // This returns the updated message object
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete message"
      );
    }
  }
);

export const addReaction = createAsyncThunk(
  "dm/addReaction",
  async (
    { messageId, emoji }: { messageId: string; emoji: string },
    { rejectWithValue }
  ) => {
    try {
      const message = await dmService.addReaction(messageId, emoji);
      return message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to add reaction"
      );
    }
  }
);

export const removeReaction = createAsyncThunk(
  "dm/removeReaction",
  async (
    { messageId, emoji }: { messageId: string; emoji: string },
    { rejectWithValue }
  ) => {
    try {
      const message = await dmService.removeReaction(messageId, emoji);
      return message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove reaction"
      );
    }
  }
);

export const replyToMessage = createAsyncThunk(
  "dm/replyToMessage",
  async (
    { messageId, content, fileUrl }: { messageId: string; content: string; fileUrl?: string },
    { rejectWithValue }
  ) => {
    try {
      const message = await dmService.replyToMessage(messageId, content, fileUrl);
      return message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reply to message"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "dm/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const count = await dmService.getUnreadCount();
      return count;
    } catch (err: any) {

      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const handleIncomingMessage = createAsyncThunk(
  "dm/handleIncomingMessage",
  async (message: DirectMessage, { dispatch, getState }) => {
    const state = getState() as RootState;
    const conversationId = message.conversationId;
    const currentUserId = state.auth.user?.id;

    // Check if conversation exists
    const conversationExists = state.dm.conversations.some(
      (c) => c.id === conversationId
    );

    if (!conversationExists && currentUserId) {
        // Create new conversation object
        // If I am the sender, the participant is the receiver.
        // If I am the receiver, the participant is the sender.
        const isSender = message.senderId === currentUserId;
        const participant = isSender ? message.receiver : message.sender;

        const newConversation: Conversation = {
            id: conversationId,
            userId: currentUserId,
            participantId: participant.id,
            participant: {
                id: participant.id,
                username: participant.username,
                email: participant.email,
                firstName: participant.firstName,
                lastName: participant.lastName,
                imageUrl: participant.imageUrl,
                status: "online" // Default to online if we just got a message
            },
            lastMessage: {
                id: message.id,
                content: message.content,
                fileUrl: message.fileUrl,
                createdAt: message.createdAt
            },
            lastMessageAt: message.createdAt,
            unreadCount: isSender ? 0 : 1 // If I received it, it's unread
        };

        dispatch(dmSlice.actions.addConversation(newConversation));
    }

    dispatch(dmSlice.actions.addMessageToConversation(message));
  }
);

const dmSlice = createSlice({
  name: "dm",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
        state.conversations.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
    addMessageToConversation: (state, action: PayloadAction<DirectMessage>) => {
      const message = action.payload;
      const conversationId = message.conversationId;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Only add if not already exists (prevent duplicates)
      const exists = state.messages[conversationId].some(
        (m) => m.id === message.id
      );
      if (!exists) {
        state.messages[conversationId].push(message);
      }

      
      // Update or Create conversation
      let conversation = state.conversations.find(
        (c) => c.id === conversationId
      );

      if (!conversation) {
          // Determine the "other participant" (not the current user)
          // We assume 'state.auth.user' is not available here, but we can infer.
          // The socket event usually comes for the receiver.
          // BUT this reducer is used for both SENT and RECEIVED messages.
          // We need to know who the "participant" is.
          
          // Actually, 'conversations' list usually contains conversations where 'userId' is ME and 'participantId' is THEM.
          // We can't easily know "ME" here without root state. 
          // However, we can fetch all conversations again, OR we can try to guess.
          
          // Better approach: If conversation is missing, maybe we just don't add it to the list yet?
          // BUT that breaks the UI because DirectMessageChat depends on it.
          
          // Let's rely on fetching conversations if it's missing, or try to construct it if we can.
          // Since we can't reliably know which ID is "me" inside a reducer (unless passed), 
          // we will skip creating it here and assume component will handle re-fetching or we dispatch fetchConversations.
          
          // WAIT! We can just check 'message.senderId' and 'message.receiverId'. 
          // One of them is the participant we want to talk to.
          // We can't know which one is "me" without auth state.
          
          // fallback: do nothing. But this is the bug. 
          // Let's add a helper action? No.
          
          // Let's assume we won't fix 'addMessageToConversation' to create conversation 
          // because we lack 'currentUserId'. 
          // INSTEAD, let's fix the COMPONENT 'DirectMessageChat' to not rely on conversation object for rendering messages!
      }

      if (conversation) {
        conversation.lastMessage = {
          id: message.id,
          content: message.content,
          fileUrl: message.fileUrl,
          createdAt: message.createdAt,
        };
        conversation.lastMessageAt = message.createdAt;

        // Increment unread count if not sent by current user (this logic is flawed if we don't know current user)
        // Check message.senderId vs conversation.userId? No, conversation.userId is ME.
        // We can use conversation.participantId to know if it's from THEM.
        if (message.senderId === conversation.participantId) {
          conversation.unreadCount++;
          state.unreadCount++;
        }
      }
    },
    updateMessage: (state, action: PayloadAction<DirectMessage>) => {
        const message = action.payload;
        const conversationId = message.conversationId;
        
        if (state.messages[conversationId]) {
            const index = state.messages[conversationId].findIndex(m => m.id === message.id);
            if (index !== -1) {
                // Determine if we should effectively hide it (deleted for me)
                // BUT we don't know "my" ID here easily without accessing root state or passing it in.
                // However, the message object itself has "deletedBy".
                // We'll rely on the UI to filter out messages deleted by 'me'.
                // So we just update the object in the store.
                state.messages[conversationId][index] = message;
            }
        }
        
        // Update last message in conversation if this was the last one
         const conversation = state.conversations.find(
            (c) => c.id === conversationId
          );
          if (conversation && conversation.lastMessage?.id === message.id) {
               conversation.lastMessage = {
                    id: message.id,
                    content: message.content,
                    fileUrl: message.fileUrl,
                    createdAt: message.createdAt
               };
          }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchConversations.fulfilled,
        (state, action: PayloadAction<Conversation[]>) => {
          state.isLoading = false;
          state.conversations = action.payload;
          state.unreadCount = action.payload.reduce(
            (sum, conv) => sum + conv.unreadCount,
            0
          );
        }
      )
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Conversation Messages
      .addCase(fetchConversationMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchConversationMessages.fulfilled,
        (
          state,
          action: PayloadAction<{
            conversationId: string;
            messages: DirectMessage[];
            nextCursor?: string;
          }>
        ) => {
          state.isLoading = false;
          const { conversationId, messages } = action.payload;

          // Use a Map to ensure uniqueness by ID
          const existingMessages = state.messages[conversationId] || [];
          const messageMap = new Map(existingMessages.map(m => [m.id, m]));
          
          // Add new messages (updating existing ones if needed)
          messages.forEach(m => messageMap.set(m.id, m));
          
          // Convert back to array and sort by creation time (descending)
           state.messages[conversationId] = Array.from(messageMap.values())
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          state.hasMore[conversationId] = !!action.payload.nextCursor;
        }
      )
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<DirectMessage>) => {
          const message = action.payload;
          const conversationId = message.conversationId;

          if (!state.messages[conversationId]) {
            state.messages[conversationId] = [];
          }

          // Check if message already exists (by ID or temporary ID if we had one)
          const exists = state.messages[conversationId].some(m => m.id === message.id);
          
          if (!exists) {
              state.messages[conversationId].push(message);
              // Re-sort to be safe
               state.messages[conversationId].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          }

          // Update conversation
          const conversation = state.conversations.find(
            (c) => c.id === conversationId
          );
          if (conversation) {
            conversation.lastMessage = {
              id: message.id,
              content: message.content,
              fileUrl: message.fileUrl,
              createdAt: message.createdAt,
            };
            conversation.lastMessageAt = message.createdAt;
          }
        }
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action: PayloadAction<string>) => {
        const conversationId = action.payload;
        const conversation = state.conversations.find(
          (c) => c.id === conversationId
        );

        if (conversation) {
          state.unreadCount -= conversation.unreadCount;
          conversation.unreadCount = 0;
        }

        // Mark all messages in conversation as read
        if (state.messages[conversationId]) {
          state.messages[conversationId].forEach((msg) => {
            msg.read = true;
          });
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete Message
      .addCase(
        deleteMessage.fulfilled,
        (
          state,
          action: PayloadAction<{ messageId: string; conversationId: string }>
        ) => {
          const { messageId, conversationId } = action.payload;

          if (state.messages[conversationId]) {
            const message = state.messages[conversationId].find(
              (m) => m.id === messageId
            );
            if (message) {
              message.deleted = true;
              message.content = undefined;
              message.fileUrl = undefined;
            }
          }
        }
      )
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch Unread Count
      .addCase(
        fetchUnreadCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.unreadCount = action.payload;
        }
      )
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Action Handlers (Pin, Delete, React, Reply)
      // We can use a shared handler for simple updates where the payload IS the updated message
      .addMatcher(
          (action) => [
              pinMessage.fulfilled.type,
              deleteMessageAction.fulfilled.type, 
              addReaction.fulfilled.type, 
              removeReaction.fulfilled.type,
              replyToMessage.fulfilled.type
          ].includes(action.type),
          (state, action: PayloadAction<DirectMessage>) => {
              const message = action.payload;
              const conversationId = message.conversationId;
              
              if (state.messages[conversationId]) {
                  const index = state.messages[conversationId].findIndex(m => m.id === message.id);
                  if (index !== -1) {
                        state.messages[conversationId][index] = message;
                  } else if (action.type === replyToMessage.fulfilled.type) {
                      // If it's a NEW reply, we push it
                       state.messages[conversationId].push(message);
                       
                       // Update last message
                       const conversation = state.conversations.find((c) => c.id === conversationId);
                       if (conversation) {
                           conversation.lastMessage = {
                               id: message.id,
                               content: message.content,
                               fileUrl: message.fileUrl,
                               createdAt: message.createdAt
                           };
                           conversation.lastMessageAt = message.createdAt;
                       }
                  }
              }
          }
      );
  },
});

export const { setActiveConversation, clearError, addMessageToConversation, updateMessage } =
  dmSlice.actions;
export default dmSlice.reducer;
