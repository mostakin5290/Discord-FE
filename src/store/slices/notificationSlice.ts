import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";
import type { Notification, NotificationType } from "@/types";

interface NotificationState {
    notification: Notification[];
    isLoading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notification: [],
    isLoading: false,
    error: null,
};

export const fetchUserNotifications = createAsyncThunk(
    "notify/fetchUserNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/notification/all");
            return response?.data?.notifications;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

export const CreateNotification = createAsyncThunk(
    "notify/CreateNotification",
    async (data: { topic: string, message: string, notifyLink: string, type: NotificationType }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/notification/create", {
                ...data
            });
            return response?.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to Create Notification"
            );
        }
    }
);

export const markAsReadAll = createAsyncThunk(
    "notify/MarkAsReadAll",
    async (data: { id: string[] }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post("/notification/mark-as-read/all", {
                notificationIds: data.id
            });
            return response?.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to Mark Notification as Read"
            );
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialState,
    reducers: {
        setNewNotification: (state, action: PayloadAction<Notification>) => {
            state.notification = [...state.notification.filter((notification) => notification.id !== action.payload.id), action.payload].reverse();
        },
        clearNotifications: (state) => {
            state.notification = [];
        },
    },
    extraReducers(builder) {
        builder
            // Fetch user notification
            .addCase(fetchUserNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notification = action.payload;
            })
            .addCase(fetchUserNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Create Notification
            .addCase(CreateNotification.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(CreateNotification.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(CreateNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Mark Notification As Read
            .addCase(markAsReadAll.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(markAsReadAll.fulfilled, (state) => {
                state.isLoading = false;
                state.notification = [];
            })
            .addCase(markAsReadAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
    },
});

export const { setNewNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;