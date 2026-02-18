import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const fetchCart = createAsyncThunk(
    'cart/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/cart');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/add',
    async (itemData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/cart', itemData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add item');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/update',
    async ({ productId, quantity, selectedPurity }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/cart/items/${productId}`, { quantity, selectedPurity });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update item');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/remove',
    async ({ productId, selectedPurity }, { rejectWithValue }) => {
        try {
            const { data } = await api.delete(`/cart/items/${productId}`, { data: { selectedPurity } });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clear',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/cart');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

export const refreshPriceLock = createAsyncThunk(
    'cart/refreshLock',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/price-lock');
            return data.data; // returns { locked: true, expiresAt, rates }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to refresh prices');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        priceLock: {
            locked: false,
            expiresAt: null,
            lockedAt: null
        },
        warnings: [],
        summary: {
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
        },
        isLoading: false,
        error: null,
        isPriceStale: false
    },
    reducers: {
        setPriceStale: (state, action) => {
            state.isPriceStale = action.payload;
        },
        clearCartLocal: (state) => {
            state.items = [];
            state.priceLock = { locked: false, expiresAt: null, lockedAt: null };
            state.summary = { subtotal: 0, tax: 0, shipping: 0, total: 0 };
        }
    },
    extraReducers: (builder) => {
        const handleFulfilled = (state, action) => {
            state.isLoading = false;
            if (action.payload) {
                state.items = action.payload.items || [];
                state.summary = {
                    subtotal: 0,
                    tax: 0,
                    shipping: 0,
                    total: 0,
                    ...action.payload.summary
                };
                state.priceLock = action.payload.priceLock || { locked: false };
                state.warnings = action.payload.warnings || [];
            }
        };

        builder
            .addCase(fetchCart.fulfilled, handleFulfilled)
            .addCase(addToCart.fulfilled, handleFulfilled)
            .addCase(updateCartItem.fulfilled, handleFulfilled)
            .addCase(removeFromCart.fulfilled, handleFulfilled)
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.items = [];
                state.priceLock = { locked: false, expiresAt: null, lockedAt: null };
                state.summary = { subtotal: 0, tax: 0, shipping: 0, total: 0 };
            })
            .addCase(refreshPriceLock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.priceLock = action.payload || { locked: false };
                // Also trigger a cart fetch to update prices based on new lock
            })
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                }
            );
    }
});

export const { setPriceStale, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
