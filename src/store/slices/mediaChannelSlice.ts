import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";


interface GroupCall {
    roomName: string;
    participantName: string;
    participantIdentity: string;
    channelId: string;
    serverId: string;
    token: string;
}

interface GroupCallState {
    groupCall: GroupCall | null;
    isLoading: boolean;
    error: string | null;
}

export const createGroupCallToken = createAsyncThunk(
    "mediaChannel/createGroupCallToken",
    async ({ channelId, serverId, participantName, participantIdentity, roomName }: { channelId: string; serverId: string; participantName: string; participantIdentity: string; roomName: string }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/livekit/create-group-call-token", { channelId, serverId, participantName, participantIdentity, roomName });
            // Backend only returns { token }, so we construct the full GroupCall object
            return {
                token: response.data.token,
                roomName,
                participantName,
                participantIdentity,
                channelId,
                serverId,
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create group call token");
        }
    }
);

export const removeUserFromChannel = createAsyncThunk(
    "mediaChannel/removeUserFromChannel",
    async ({ channelId, serverId }: { channelId: string; serverId: string }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/livekit/remove-user-from-channel", { channelId, serverId });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to remove user from channel");
        }
    }
);

const GROUP_CALL_STORAGE_KEY = 'activeGroupCall';

export const saveGroupCallToStorage = (groupCall: GroupCall) => {
    sessionStorage.setItem(GROUP_CALL_STORAGE_KEY, JSON.stringify(groupCall));
};

export const clearGroupCallFromStorage = () => {
    sessionStorage.removeItem(GROUP_CALL_STORAGE_KEY);
};

const getGroupCallFromStorage = (): GroupCall | null => {
    try {
        const stored = sessionStorage.getItem(GROUP_CALL_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const persistedGroupCall = getGroupCallFromStorage();

const initialState: GroupCallState = {
    groupCall: persistedGroupCall || null,
    isLoading: false,
    error: null,
}

const groupCallSlice = createSlice({
    name: "groupCall",
    initialState,
    reducers: {
        setGroupCall: (state, action: PayloadAction<GroupCall>) => {
            state.groupCall = action.payload;
        },
        clearGroupCall: (state) => {
            state.groupCall = null;
            clearGroupCallFromStorage();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGroupCallToken.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createGroupCallToken.fulfilled, (state, action) => {
                state.isLoading = false;
                state.groupCall = action.payload;
                saveGroupCallToStorage(action.payload);
            })
            .addCase(createGroupCallToken.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(removeUserFromChannel.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(removeUserFromChannel.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.groupCall = null;
                clearGroupCallFromStorage();
            })
            .addCase(removeUserFromChannel.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message as string;
                state.groupCall = null;
            })
    },
});

export const { setGroupCall, clearGroupCall } = groupCallSlice.actions;
export default groupCallSlice.reducer;