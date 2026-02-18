import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAddresses = createAsyncThunk(
    'addresses/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/addresses');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
        }
    }
);

export const addAddress = createAsyncThunk(
    'addresses/add',
    async (addressData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/addresses', addressData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add address');
        }
    }
);

export const updateAddress = createAsyncThunk(
    'addresses/update',
    async ({ id, addressData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/addresses/${id}`, addressData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update address');
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'addresses/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/addresses/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
        }
    }
);

export const setDefaultAddress = createAsyncThunk(
    'addresses/setDefault',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.patch(`/addresses/${id}/default`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to set default address');
        }
    }
);

const addressSlice = createSlice({
    name: 'addresses',
    initialState: {
        items: [],
        selectedAddress: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        selectAddress: (state, action) => {
            state.selectedAddress = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.items = action.payload;
                // Auto-select default address if available and none selected
                if (!state.selectedAddress) {
                    state.selectedAddress = action.payload.find(a => a.isDefault);
                }
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.items.push(action.payload);
                if (action.payload.isDefault) {
                    state.items.forEach(a => {
                        if (a._id !== action.payload._id) a.isDefault = false;
                    });
                    state.selectedAddress = action.payload;
                }
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                const index = state.items.findIndex(a => a._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.items = state.items.filter(a => a._id !== action.payload);
                if (state.selectedAddress?._id === action.payload) {
                    state.selectedAddress = state.items.find(a => a.isDefault) || state.items[0] || null;
                }
            })
            .addCase(setDefaultAddress.fulfilled, (state, action) => {
                state.items.forEach(a => {
                    a.isDefault = a._id === action.payload._id;
                });
                state.selectedAddress = action.payload;
            });
    },
});

export const { selectAddress } = addressSlice.actions;
export default addressSlice.reducer;
