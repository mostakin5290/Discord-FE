import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import * as friendService from "@/services/friend.service";
import type { Friend, FriendRequest } from "@/services/friend.service";

interface FriendState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FriendState = {
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const friends = await friendService.getFriends();
      return friends;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch friends"
      );
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  "friends/fetchPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const requests = await friendService.getPendingRequests();
      return requests;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pending requests"
      );
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  "friends/fetchSentRequests",
  async (_, { rejectWithValue }) => {
    try {
      const requests = await friendService.getSentRequests();
      return requests;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch sent requests"
      );
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (username: string, { rejectWithValue }) => {
    try {
      const request = await friendService.sendFriendRequest(username);
      return request;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send friend request"
      );
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId: string, { rejectWithValue }) => {
    try {
      const newFriend = await friendService.acceptFriendRequest(requestId);
      return { requestId, newFriend };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to accept friend request"
      );
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "friends/rejectFriendRequest",
  async (requestId: string, { rejectWithValue }) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      return requestId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reject friend request"
      );
    }
  }
);

export const cancelFriendRequest = createAsyncThunk(
  "friends/cancelFriendRequest",
  async (requestId: string, { rejectWithValue }) => {
    try {
      await friendService.cancelFriendRequest(requestId);
      return requestId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel friend request"
      );
    }
  }
);

export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async (friendId: string, { rejectWithValue }) => {
    try {
      await friendService.removeFriend(friendId);
      return friendId;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove friend"
      );
    }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPendingRequest: (state, action: PayloadAction<FriendRequest>) => {
      // Avoid duplicates
      if (!state.pendingRequests.find(r => r.id === action.payload.id)) {
        state.pendingRequests.push(action.payload);
      }
    },
    addSentRequest: (state, action: PayloadAction<FriendRequest>) => {
       // Avoid duplicates
      if (!state.sentRequests.find(r => r.id === action.payload.id)) {
        state.sentRequests.push(action.payload);
      }
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(req => req.id !== action.payload);
    },
    removeSentRequest: (state, action: PayloadAction<string>) => {
      state.sentRequests = state.sentRequests.filter(req => req.id !== action.payload);
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
       if (!state.friends.find(f => f.id === action.payload.id)) {
        state.friends.push(action.payload);
      }
    },
    removeFriendFromList: (state, action: PayloadAction<string>) => {
         state.friends = state.friends.filter(f => f.friendId !== action.payload);
    },
    updateFriendStatus: (
      state,
      action: PayloadAction<{ userId: string; status: "online" | "idle" | "dnd" | "offline" }>
    ) => {
      const { userId, status } = action.payload;
      const friend = state.friends.find((f) => f.friendId === userId);
      if (friend && friend.friend) {
        friend.friend.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Friends
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFriends.fulfilled,
        (state, action: PayloadAction<Friend[]>) => {
          state.isLoading = false;
          state.friends = action.payload;
        }
      )
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Pending Requests
      .addCase(fetchPendingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPendingRequests.fulfilled,
        (state, action: PayloadAction<FriendRequest[]>) => {
          state.isLoading = false;
          state.pendingRequests = action.payload;
        }
      )
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Sent Requests
      .addCase(fetchSentRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSentRequests.fulfilled,
        (state, action: PayloadAction<FriendRequest[]>) => {
          state.isLoading = false;
          state.sentRequests = action.payload;
        }
      )
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        sendFriendRequest.fulfilled,
        (state, action: PayloadAction<FriendRequest>) => {
          state.isLoading = false;
          state.sentRequests.push(action.payload);
        }
      )
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        acceptFriendRequest.fulfilled,
        (state, action: PayloadAction<{ requestId: string; newFriend: Friend }>) => {
          state.isLoading = false;
          state.pendingRequests = state.pendingRequests.filter(
            (req) => req.id !== action.payload.requestId
          );
          if (!state.friends.find(f => f.id === action.payload.newFriend.id)) {
            state.friends.push(action.payload.newFriend);
          }
        }
      )
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reject Friend Request
      .addCase(rejectFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        rejectFriendRequest.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.pendingRequests = state.pendingRequests.filter(
            (req) => req.id !== action.payload
          );
        }
      )
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Friend Request
      .addCase(cancelFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        cancelFriendRequest.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.sentRequests = state.sentRequests.filter(
            (req) => req.id !== action.payload
          );
        }
      )
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove Friend
      .addCase(removeFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        removeFriend.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.friends = state.friends.filter(
            (friend) => friend.friendId !== action.payload
          );
        }
      )
      .addCase(removeFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
    clearError, 
    addPendingRequest, 
    addSentRequest, 
    removePendingRequest, 
    removeSentRequest,
    addFriend,
    removeFriendFromList,
    updateFriendStatus
} = friendSlice.actions;
export default friendSlice.reducer;
