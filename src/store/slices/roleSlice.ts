import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface Role {
  id: string;
  name: string;
  color: string;
  permissions: string;
  position: number;
}

interface RoleState {
    roles: Role[];
    isLoading: boolean;
    error: string | null;
}

const initialState: RoleState = {
    roles: [],
    isLoading: false,
    error: null,
};

export const fetchRoles = createAsyncThunk(
    "role/fetchRoles",
    async (serverId: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/server/${serverId}/roles`);
            return response.data.roles;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
        }
    }
);

export const createRole = createAsyncThunk(
    "role/createRole",
    async ({ serverId, name, color, permissions }: { serverId: string, name: string, color: string, permissions?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/server/${serverId}/roles`, { name, color, permissions });
            return response.data.role;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create role");
        }
    }
);

export const updateRole = createAsyncThunk(
    "role/updateRole",
    async ({ serverId, roleId, name, color, permissions, position }: { serverId: string, roleId: string, name?: string, color?: string, permissions?: string, position?: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/server/${serverId}/roles/${roleId}`, { name, color, permissions, position });
            return response.data.role;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update role");
        }
    }
);

export const deleteRole = createAsyncThunk(
    "role/deleteRole",
    async ({ serverId, roleId }: { serverId: string, roleId: string }, { rejectWithValue }) => {
        try {
            await axios.delete(`/server/${serverId}/roles/${roleId}`);
            return roleId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete role");
        }
    }
);

export const updateRolePositions = createAsyncThunk(
    "role/updateRolePositions",
    async ({ serverId, roles }: { serverId: string, roles: { id: string, position: number }[] }, { rejectWithValue }) => {
        try {
            await axios.put(`/server/${serverId}/roles/positions`, { roles });
            return roles; // Optimistic update usually, or refetch
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update role positions");
        }
    }
);

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Roles
            .addCase(fetchRoles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create Role
            .addCase(createRole.fulfilled, (state, action) => {
                state.roles.push(action.payload);
                state.roles.sort((a, b) => a.position - b.position);
            })
            // Update Role
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.roles.findIndex(r => r.id === action.payload.id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                    state.roles.sort((a, b) => a.position - b.position);
                }
            })
            // Delete Role
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter(r => r.id !== action.payload);
            })
            // Update Positions
             .addCase(updateRolePositions.fulfilled, (state, action) => {
                // Update local state positions
                action.payload.forEach(updated => {
                    const role = state.roles.find(r => r.id === updated.id);
                    if (role) role.position = updated.position;
                });
                state.roles.sort((a, b) => a.position - b.position);
             });
    },
});

export default roleSlice.reducer;
