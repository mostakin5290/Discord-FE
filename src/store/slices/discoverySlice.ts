import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios";

interface FeaturedServer {
    id: string;
    name: string;
    bannerUrl?: string;
    bio?: string;
    imageUrl?: string;
    members: {
        id: string
    }[];
}
interface DiscoveryState {
    featuredServers: FeaturedServer[];
    searchResults: FeaturedServer[];
    isSearching: boolean | null;
    searchQuery: string | null;
    isLoading: boolean;
    error: string | null;
}

export const fetchAllServers = createAsyncThunk(
    "discovery/fetchAllServers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/discovery/all/featured");
            return response?.data?.servers ?? [];
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch featured servers");
        }
    }
);

export const searchServers = createAsyncThunk(
    "discovery/search",
    async (query: string, { rejectWithValue, dispatch }) => {
        try {
            dispatch(setSearchQuery(query));
            const response = await axiosClient.get(`/discovery/search?query=${query}`);
            return response?.data?.servers ?? [];
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to search servers");
        }
    }
);

const initialState: DiscoveryState = {
    featuredServers: [],
    searchResults: [],
    isSearching: null,
    searchQuery: null,
    error: null,
    isLoading: false,
}

const discoverySlice = createSlice({
    name: "discovery",
    initialState,
    reducers: {
        setFeaturedServers: (state, action: PayloadAction<any[]>) => {
            state.featuredServers = action.payload;
        },
        setSearchResults: (state, action: PayloadAction<any[]>) => {
            state.searchResults = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        clearFeaturedServers: (state) => {
            state.featuredServers = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        clearIsSearching: (state) => {
            state.isSearching = null;
        },
        setSearchQuery: (state, action: PayloadAction<string | null>) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllServers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(fetchAllServers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.featuredServers = action.payload;
        });
        builder.addCase(fetchAllServers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        });
        builder.addCase(searchServers.pending, (state) => {
            state.isLoading = true;
            state.error = null;
            state.isSearching = true;
            state.searchQuery = state.searchQuery;
        });
        builder.addCase(searchServers.fulfilled, (state, action) => {
            state.isLoading = false;
            state.searchResults = action.payload;
            state.isSearching = true;
            state.searchQuery = state.searchQuery;
        });
        builder.addCase(searchServers.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            state.searchResults = [];
            state.isSearching = null;
            state.searchQuery = null;
        });
    },
});

export const { setFeaturedServers, setSearchResults, clearSearchResults, clearFeaturedServers, clearError, clearIsSearching, setSearchQuery, clearSearchQuery } = discoverySlice.actions;
export default discoverySlice.reducer;