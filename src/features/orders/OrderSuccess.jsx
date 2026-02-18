import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clearActiveOrder } from './orderSlice';
import { fetchCart } from '../cart/cartSlice';
import Button from '../../components/ui/Button';

const OrderSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { activeOrder } = useSelector((state) => state.orders);

    useEffect(() => {
        // Refresh cart status once after order
        dispatch(fetchCart());

        // Redirect to collection if accessed without order data
        if (!activeOrder) {
            navigate('/orders');
        }
    }, [dispatch, activeOrder, navigate]);

    if (!activeOrder) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto space-y-12"
            >
                {/* Success Icon */}
                <div className="relative inline-block">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                        className="w-24 h-24 bg-luxury-gold/10 rounded-full flex items-center justify-center border border-luxury-gold/20"
                    >
                        <svg className="w-12 h-12 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <div className="absolute inset-0 animate-ping rounded-full bg-luxury-gold/5" />
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-playfair text-luxury-charcoal">Acquisition Confirmed</h1>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                        Your selection from the order <span className="text-luxury-indigo font-inter font-bold">#{activeOrder._id?.slice(-8).toUpperCase()}</span> has been safely secured.
                        A curator will initiate the bespoke authentication and dispatch process immediately.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-luxury-marble/30 p-8 rounded-2xl border border-luxury-gold/10 text-left">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Estimated Arrival</h4>
                        <p className="text-sm font-medium text-luxury-charcoal">3 - 5 Business Days</p>
                    </div>
                    <div>
                        <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Certificate of Authenticity</h4>
                        <p className="text-sm font-medium text-luxury-charcoal">Available upon final delivery</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link to="/orders">
                        <Button className="px-12 w-full sm:w-auto py-4">View My Collection</Button>
                    </Link>
                    <Link to="/products">
                        <Button variant="outline" className="px-12 w-full sm:w-auto py-4">Continue Discovery</Button>
                    </Link>
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    A detailed receipt has been dispatched to your registered vault email.
                </p>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
