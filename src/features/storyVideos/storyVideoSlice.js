import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ─── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchStoryVideos = createAsyncThunk(
    'storyVideos/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/story-videos');
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch story videos');
        }
    }
);

export const fetchAllAdminStoryVideos = createAsyncThunk(
    'storyVideos/fetchAllAdmin',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/story-videos/all');
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch admin story videos');
        }
    }
);

export const createStoryVideo = createAsyncThunk(
    'storyVideos/create',
    async (videoData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/story-videos', videoData);
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create story video');
        }
    }
);

export const updateStoryVideo = createAsyncThunk(
    'storyVideos/update',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/story-videos/${id}`, updates);
            return data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update story video');
        }
    }
);

export const deleteStoryVideo = createAsyncThunk(
    'storyVideos/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/story-videos/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete story video');
        }
    }
);

export const reorderStoryVideos = createAsyncThunk(
    'storyVideos/reorder',
    async (order, { rejectWithValue }) => {
        try {
            await api.patch('/story-videos/reorder', { order });
            return order;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to reorder story videos');
        }
    }
);

// ─── Slice ─────────────────────────────────────────────────────────────────────

const storyVideoSlice = createSlice({
    name: 'storyVideos',
    initialState: {
        videos: [],
        adminVideos: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        // fetchStoryVideos
        builder
            .addCase(fetchStoryVideos.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(fetchStoryVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.videos = action.payload || [];
            })
            .addCase(fetchStoryVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // fetchAllAdminStoryVideos
        builder
            .addCase(fetchAllAdminStoryVideos.pending, (state) => { state.isLoading = true; })
            .addCase(fetchAllAdminStoryVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.adminVideos = action.payload || [];
            })
            .addCase(fetchAllAdminStoryVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // createStoryVideo
        builder.addCase(createStoryVideo.fulfilled, (state, action) => {
            state.adminVideos.push(action.payload);
        });

        // updateStoryVideo
        builder.addCase(updateStoryVideo.fulfilled, (state, action) => {
            const idx = state.adminVideos.findIndex(v => v._id === action.payload._id);
            if (idx !== -1) state.adminVideos[idx] = action.payload;
        });

        // deleteStoryVideo
        builder.addCase(deleteStoryVideo.fulfilled, (state, action) => {
            state.adminVideos = state.adminVideos.filter(v => v._id !== action.payload);
        });

        // reorderStoryVideos
        builder.addCase(reorderStoryVideos.fulfilled, (state, action) => {
            action.payload.forEach(({ id, orderIndex }) => {
                const v = state.adminVideos.find(v => v._id === id);
                if (v) v.orderIndex = orderIndex;
            });
            state.adminVideos.sort((a, b) => a.orderIndex - b.orderIndex);
        });
    },
});

export const { clearError } = storyVideoSlice.actions;
export default storyVideoSlice.reducer;
