import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  channelId: string;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  reactions?: Record<string, string[]>;
}

interface MessageState {
  messagesByChannel: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  hasMore: Record<string, boolean>;
}

const initialState: MessageState = {
  messagesByChannel: {},
  isLoading: false,
  error: null,
  hasMore: {},
};

// Async Thunks
export const fetchChannelMessages = createAsyncThunk(
  "message/fetchChannelMessages",
  async (
    { channelId, cursor }: { channelId: string; cursor?: string },
    { rejectWithValue },
  ) => {
    try {
      const url = cursor
        ? `/messages/channel/${channelId}?cursor=${cursor}`
        : `/messages/channel/${channelId}`;
      const response = await axiosClient.get(url);
      return {
        channelId,
        messages: response.data.messages,
        hasMore: response.data.hasMore,
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch messages",
      );
    }
  },
);

export const sendNewMessage = createAsyncThunk(
  "message/sendMessage",
  async (
    {
      channelId,
      content,
      fileUrl,
    }: { channelId: string; content: string; fileUrl?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosClient.post(
        `/messages/channel/${channelId}`,
        {
          content,
          fileUrl,
        },
      );
      return response.data.message;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send message",
      );
    }
  },
);

export const deleteMessageById = createAsyncThunk(
  "message/deleteMessage",
  async (messageId: string, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/messages/${messageId}`);
      return messageId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete message",
      );
    }
  },
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // Clear messages only for a specific channel if needed, or clear all
    clearMessages: (state) => {
      state.messagesByChannel = {};
      state.hasMore = {};
    },
    // Add logic to clear specific channel messages if we want to force refresh
    clearChannelMessages: (state, action: PayloadAction<string>) => {
      delete state.messagesByChannel[action.payload];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const channelId = action.payload.channelId;
      if (!state.messagesByChannel[channelId]) {
        state.messagesByChannel[channelId] = [];
      }
      // Check if message already exists to prevent duplicates
      if (
        !state.messagesByChannel[channelId].some(
          (m) => m.id === action.payload.id,
        )
      ) {
        state.messagesByChannel[channelId].push(action.payload);
      }
    },
    updateMessageReaction: (
      state,
      action: PayloadAction<{
        channelId: string;
        messageId: string;
        emoji: string;
        userId: string;
        isAdding: boolean;
      }>,
    ) => {
      const { channelId, messageId, emoji, userId, isAdding } = action.payload;
      const messages = state.messagesByChannel[channelId];
      if (messages) {
        const message = messages.find((m) => m.id === messageId);
        if (message) {
          if (!message.reactions) {
            message.reactions = {};
          }

          if (isAdding) {
            // Remove user from all other emoji reactions (only one reaction per user)
            Object.keys(message.reactions).forEach((existingEmoji) => {
              if (
                existingEmoji !== emoji &&
                message.reactions![existingEmoji]
              ) {
                message.reactions![existingEmoji] = message.reactions![
                  existingEmoji
                ].filter((id) => id !== userId);
                if (message.reactions![existingEmoji].length === 0) {
                  delete message.reactions![existingEmoji];
                }
              }
            });

            // Add new reaction
            if (!message.reactions[emoji]) {
              message.reactions[emoji] = [];
            }
            if (!message.reactions[emoji].includes(userId)) {
              message.reactions[emoji].push(userId);
            }
          } else {
            // Remove reaction
            if (message.reactions[emoji]) {
              message.reactions[emoji] = message.reactions[emoji].filter(
                (id) => id !== userId,
              );
              if (message.reactions[emoji].length === 0) {
                delete message.reactions[emoji];
              }
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchChannelMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChannelMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { channelId, messages, hasMore } = action.payload;
        state.messagesByChannel[channelId] = messages;
        state.hasMore[channelId] = hasMore;
      })
      .addCase(fetchChannelMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        const message = action.payload;
        if (!state.messagesByChannel[message.channelId]) {
          state.messagesByChannel[message.channelId] = [];
        }
        state.messagesByChannel[message.channelId].push(message);
      })
      // Delete message
      .addCase(deleteMessageById.fulfilled, (state, action) => {
        const messageId = action.payload;
        Object.keys(state.messagesByChannel).forEach((channelId) => {
          state.messagesByChannel[channelId] = state.messagesByChannel[
            channelId
          ].filter((msg) => msg.id !== messageId);
        });
      });
  },
});

export const { clearMessages, addMessage, updateMessageReaction } =
  messageSlice.actions;
export default messageSlice.reducer;
