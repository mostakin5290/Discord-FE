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
  roles: { id: string }[];
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
  bannerUrl?: string;
  bio?: string;
  inviteCode?: string;
  channels: Channel[];
  members: Member[];
  systemChannelId?: string;
  systemMessageFlags?: any;
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
      console.log(response);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create channel"
      );
    }
  }
);

export const updateServerDetails = createAsyncThunk(
  "server/updateServerDetails",
  async (
    { serverId, data }: { serverId: string; data: { name: string; bio: string; imageUrl: string; bannerUrl?: string; systemChannelId?: string; systemMessageFlags?: any } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.put(`/server/update/${serverId}`, data);
      return response.data.server;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update server"
      );
    }
  }
);

export const regenerateInviteCode = createAsyncThunk(
  "server/regenerateInviteCode",
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`/server/${serverId}/invite`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to regenerate invite code"
      );
    }
  }
);

export const kickMember = createAsyncThunk(
  "server/kickMember",
  async ({ serverId, memberId }: { serverId: string; memberId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/server/kick/${serverId}/${memberId}`);
      return response.data; // { success: true, memberId }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to kick member"
      );
    }
  }
);

export const banMember = createAsyncThunk(
  "server/banMember",
  async ({ serverId, memberId }: { serverId: string; memberId: string }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/server/ban/${serverId}/${memberId}`);
      return response.data; // { success: true, memberId }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to ban member"
      );
    }
  }
);


export const deleteServer = createAsyncThunk(
  "server/deleteServer",
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await axiosClient.delete(`/server/${serverId}`);
      return response.data; // { success: true, message: "Server deleted successfully" }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete server"
      );
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  "server/updateMemberRole",
  async ({ serverId, memberId, role, roleIds }: { serverId: string; memberId: string; role?: string; roleIds?: string[] }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.patch(`/server/${serverId}/members/${memberId}/role`, { role, roleIds });
      return response.data; // { success: true, memberId, role, roleIds }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update member role"
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
      // Update Server
      .addCase(updateServerDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateServerDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentServer = action.payload;
        // Update server in list
        const index = state.servers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.servers[index] = action.payload;
        }
      })
      .addCase(updateServerDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Regenerate Invite Code
      .addCase(regenerateInviteCode.fulfilled, (state, action) => {
        if (state.currentServer && state.currentServer.id === action.payload.serverId) {
          state.currentServer.inviteCode = action.payload.inviteCode;
        }
      })
      // Kick Member
      .addCase(kickMember.fulfilled, (state, action) => {
        if (state.currentServer) {
          state.currentServer.members = state.currentServer.members.filter(
            m => m.id !== action.payload.memberId
          );
        }
      })
      // Ban Member
      .addCase(banMember.fulfilled, (state, action) => {
        if (state.currentServer) {
          state.currentServer.members = state.currentServer.members.filter(
            m => m.id !== action.payload.memberId
          );
        }
      })
      // Delete Server
      .addCase(deleteServer.fulfilled, (state, action) => {
        state.servers = state.servers.filter(s => s.id !== state.currentServer?.id); // Optimistic cleanup or based on ID if payload had it
        state.currentServer = null;
      })
      // Update Member Role
      .addCase(updateMemberRole.fulfilled, (state, action) => {
         if (state.currentServer) {
             const memberIndex = state.currentServer.members.findIndex(m => m.id === action.payload.memberId);
             if (memberIndex !== -1) {
                 if (action.payload.role) {
                    state.currentServer.members[memberIndex].role = action.payload.role;
                 }
                 if (action.payload.roleIds) {
                     // Assuming backend returns roleIds or we just update local state
                     // Ideally backend returns full role objects if we need name/color, but for now just IDs
                     state.currentServer.members[memberIndex].roles = action.payload.roleIds.map((id: string) => ({ id }));
                 }
             }
         }
      });
  },
});

export const { setCurrentServer, clearServers } = serverSlice.actions;
export default serverSlice.reducer;
