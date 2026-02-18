import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAdminStats = createAsyncThunk(
    'admin/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/admin/stats');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
        }
    }
);

export const fetchPageContent = createAsyncThunk(
    'admin/fetchPageContent',
    async (slug = 'landing-page', { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/cms/${slug}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch page content');
        }
    }
);

export const updatePageContent = createAsyncThunk(
    'admin/updatePageContent',
    async ({ slug = 'landing-page', content }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/admin/cms/${slug}`, content);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update page content');
        }
    }
);

export const syncHeroVideo = createAsyncThunk(
    'admin/syncHeroVideo',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/admin/cms/sync-hero');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to sync with Cloudinary');
        }
    }
);

export const fetchAdminOrders = createAsyncThunk(
    'admin/fetchOrders',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/admin/orders?page=${page}&limit=${limit}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders');
        }
    }
);


const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: {
            summary: {
                revenue: 0,
                orders: 0,
                products: 0,
                customers: 0
            },
            recentOrders: [],
            categoryStats: []
        },
        orders: {
            items: [],
            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                pages: 0
            },
            isLoading: false,
            error: null
        },
        cms: {
            page: null,
            isLoading: false,
            error: null
        },
        isLoading: false,
        error: null,
    },
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // CMS Cases
            .addCase(fetchPageContent.pending, (state) => {
                state.cms.isLoading = true;
                state.cms.error = null;
            })
            .addCase(fetchPageContent.fulfilled, (state, action) => {
                state.cms.isLoading = false;
                state.cms.page = action.payload;
            })
            .addCase(fetchPageContent.rejected, (state, action) => {
                state.cms.isLoading = false;
                state.cms.error = action.payload;
            })
            .addCase(updatePageContent.pending, (state) => {
                state.cms.isLoading = true;
            })
            .addCase(updatePageContent.fulfilled, (state, action) => {
                state.cms.isLoading = false;
                state.cms.page = action.payload;
            })
            .addCase(updatePageContent.rejected, (state, action) => {
                state.cms.isLoading = false;
                state.cms.error = action.payload;
            })
            .addCase(syncHeroVideo.pending, (state) => {
                state.cms.isLoading = true;
            })
            .addCase(syncHeroVideo.fulfilled, (state, action) => {
                state.cms.isLoading = false;
                state.cms.page = action.payload;
            })
            .addCase(syncHeroVideo.rejected, (state, action) => {
                state.cms.isLoading = false;
                state.cms.error = action.payload;
            })
            // Admin Orders
            .addCase(fetchAdminOrders.pending, (state) => {
                state.orders.isLoading = true;
                state.orders.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.orders.isLoading = false;
                state.orders.items = action.payload.orders;
                state.orders.pagination = action.payload.pagination;
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.orders.isLoading = false;
                state.orders.error = action.payload;
            });
    },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
