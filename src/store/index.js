import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productReducer from '../features/products/productSlice';
import addressReducer from '../features/addresses/addressSlice';
import orderReducer from '../features/orders/orderSlice';
import adminReducer from '../features/admin/adminSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import reviewReducer from '../features/reviews/reviewSlice';
import notificationReducer from '../features/admin/notificationSlice';
import storyVideoReducer from '../features/storyVideos/storyVideoSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        products: productReducer,
        addresses: addressReducer,
        orders: orderReducer,
        admin: adminReducer,
        wishlist: wishlistReducer,
        reviews: reviewReducer,
        notifications: notificationReducer,
        storyVideos: storyVideoReducer,
    },
});

export default store;
