import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/orders', orderData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to place order');
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/orders/myorders');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/orders/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
        }
    }
);

export const verifyCertificateAction = createAsyncThunk(
    'orders/verifyCertificate',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/orders/verify-certificate/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Certificate verification failed');
        }
    }
);

export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/orders');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch all orders');
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status, tracking }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/orders/${id}/status`, { status, tracking });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/orders/${id}/cancel`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        currentOrder: null,
        activeOrder: null, // Used for the checkout process
        verificationResult: null, // Public verification data
        isLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearActiveOrder: (state) => {
            state.activeOrder = null;
        },
        clearVerificationResult: (state) => {
            state.verificationResult = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeOrder = action.payload;
                state.items.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyOrders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
            })
            .addCase(verifyCertificateAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.verificationResult = null;
            })
            .addCase(verifyCertificateAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.verificationResult = action.payload;
            })
            .addCase(verifyCertificateAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.items = state.items.filter(order => order._id !== action.payload._id);
                if (state.currentOrder?._id === action.payload._id) {
                    state.currentOrder = action.payload; // Keep it in currentOrder if user is viewing it, but hide from list
                }
            });
    },
});

export const { clearCurrentOrder, clearActiveOrder, clearVerificationResult } = orderSlice.actions;
export default orderSlice.reducer;
