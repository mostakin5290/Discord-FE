import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

interface IncomingCall {
  token: string;
  roomName: string;
  fromFriendId: string;
  fromFriendName: string;
}

interface Call {
  roomName: string;
  participantName?: string;
  participantIdentity?: string;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  incomingCall: IncomingCall | null;
}

const CALL_STORAGE_KEY = "activeCall";

const saveCallToStorage = (token: string, roomName: string) => {
  sessionStorage.setItem(CALL_STORAGE_KEY, JSON.stringify({ token, roomName }));
};

const clearCallFromStorage = () => {
  sessionStorage.removeItem(CALL_STORAGE_KEY);
};

const getCallFromStorage = (): { token: string; roomName: string } | null => {
  try {
    const stored = sessionStorage.getItem(CALL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const persistedCall = getCallFromStorage();

const initialState: Call = {
  roomName: persistedCall?.roomName || "",
  participantName: "",
  participantIdentity: "",
  isLoading: false,
  error: null,
  token: persistedCall?.token || null,
  incomingCall: null,
};

interface CreateCallParams {
  roomName: string;
  participantName: string;
  participantIdentity: string;
  friendId: string;
}

export const createDirectCallToken = createAsyncThunk(
  "call/createDirectCallToken",
  async (
    {
      roomName,
      participantName,
      participantIdentity,
      friendId,
    }: CreateCallParams,
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosClient.post(
        "/livekit/create-direct-call-token",
        { roomName, participantName, participantIdentity, friendId },
      );
      return { ...response.data, roomName };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create call",
      );
    }
  },
);

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
    clearCall: (state) => {
      state.isLoading = false;
      state.error = null;
      state.roomName = "";
      state.participantName = "";
      state.participantIdentity = "";
      state.token = null;
      state.incomingCall = null;
      clearCallFromStorage();
    },
    setIncomingCall: (state, action: PayloadAction<IncomingCall>) => {
      state.incomingCall = action.payload;
    },
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    acceptIncomingCall: (state) => {
      if (state.incomingCall) {
        state.token = state.incomingCall.token;
        state.roomName = state.incomingCall.roomName;
        saveCallToStorage(
          state.incomingCall.token,
          state.incomingCall.roomName,
        );
        state.incomingCall = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDirectCallToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDirectCallToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomName = action.payload.roomName;
        state.participantName = action.payload.participantName;
        state.participantIdentity = action.payload.participantIdentity;
        state.token = action.payload.token;
        saveCallToStorage(action.payload.token, action.payload.roomName);
      })
      .addCase(createDirectCallToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setToken,
  clearToken,
  clearCall,
  setIncomingCall,
  clearIncomingCall,
  acceptIncomingCall,
} = callSlice.actions;
export default callSlice.reducer;
