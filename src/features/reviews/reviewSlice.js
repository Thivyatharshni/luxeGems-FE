import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchReviews = createAsyncThunk(
    'reviews/fetchByProduct',
    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/reviews/product/${productId}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
        }
    }
);

export const createReview = createAsyncThunk(
    'reviews/create',
    async (reviewData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/reviews', reviewData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
        }
    }
);

export const deleteReview = createAsyncThunk(
    'reviews/delete',
    async (reviewId, { rejectWithValue }) => {
        try {
            await api.delete(`/reviews/${reviewId}`);
            return reviewId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearReviews: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item._id !== action.payload);
            });
    }
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
