import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

interface Channel {
  id: string;
  name: string;
  type: string;
  serverId: string;
  createdAt: string;
}

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
}

interface Server {
  id: string;
  name: string;
  imageUrl: string;
  bio?: string;
  inviteCode?: string;
  channels: Channel[];
  members: Member[];
}

interface ServerState {
  servers: Server[];
  currentServer: Server | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServerState = {
  servers: [],
  currentServer: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchUserServers = createAsyncThunk(
  "server/fetchUserServers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/server/list");
      return response.data.servers;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch servers"
      );
    }
  }
);

export const fetchServerById = createAsyncThunk(
  "server/fetchServerById",
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(`/server/${serverId}`);
      return response.data.server;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch server"
      );
    }
  }
);

export const createNewServer = createAsyncThunk(
  "server/createNewServer",
  async (
    serverData: { name: string; imageUrl: string; bio?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.post("/server/create", serverData);
      return response.data.server;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create server"
      );
    }
  }
);

export const joinServerWithCode = createAsyncThunk(
  "server/joinServer",
  async (inviteCode: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/server/join", { inviteCode });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to join server"
      );
    }
  }
);

export const leaveServer = createAsyncThunk(
  "server/leaveServer",
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/server/leave/${serverId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to leave server"
      );
    }
  }
);

export const createChannel = createAsyncThunk(
  "server/createChannel",
  async ({ serverId, name, type }: { serverId: string; name: string; type: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/server/${serverId}/channels`, { name, type });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create channel"
      );
    }
  }
);

const serverSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setCurrentServer: (state, action: PayloadAction<Server | null>) => {
      state.currentServer = action.payload;
    },
    clearServers: (state) => {
      state.servers = [];
      state.currentServer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user servers
      .addCase(fetchUserServers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserServers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers = action.payload;
      })
      .addCase(fetchUserServers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch server by ID
      .addCase(fetchServerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentServer = action.payload;
        // Update server in list if it exists
        const index = state.servers.findIndex(
          (s) => s.id === action.payload.id
        );
        if (index !== -1) {
          state.servers[index] = action.payload;
        }
      })
      .addCase(fetchServerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create server
      .addCase(createNewServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.servers.push(action.payload);
        state.currentServer = action.payload;
      })
      .addCase(createNewServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Join server
      .addCase(joinServerWithCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinServerWithCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(joinServerWithCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // leave Server
      .addCase(leaveServer.pending, (state) => {
        state.isLoading = true;
        state.error = null
      })
      .addCase(leaveServer.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(leaveServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // create Channel
      .addCase(createChannel.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setCurrentServer, clearServers } = serverSlice.actions;
export default serverSlice.reducer;
