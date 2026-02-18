import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchMyOrders, cancelOrder } from './orderSlice';
import Button from '../../components/ui/Button';
import { AnimatePresence } from 'framer-motion';

const Orders = () => {
    const dispatch = useDispatch();
    const { items, isLoading, error } = useSelector((state) => state.orders);

    const handleShare = (orderId) => {
        const url = `${window.location.origin}/verify/${orderId}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Verification link copied to clipboard');
        });
    };

    const [cancellingId, setCancellingId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    const handleCancelRequest = (e, orderId) => {
        e.preventDefault();
        setCancellingId(orderId);
        setShowCancelModal(true);
    };

    const confirmCancel = async () => {
        try {
            await dispatch(cancelOrder(cancellingId)).unwrap();
            setShowCancelModal(false);
            setCancellingId(null);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error('Cancellation failed:', err);
            setShowCancelModal(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Shipped': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <p className="font-playfair italic text-gray-400">Retrieving your private vault...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest">The Vault is Empty</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">Your journey of exquisite acquisitions hasn't begun yet. Discover our curated collections to start your legacy.</p>
                <Link to="/products">
                    <Button variant="outline" className="px-12">Discover Jewellery</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <div className="flex justify-between items-end mb-12 border-b border-luxury-gold/10 pb-8">
                <div>
                    <h1 className="text-4xl font-playfair text-luxury-charcoal mb-2">My Collection</h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Chronicle of curated acquisitions</p>
                </div>
            </div>

            <div className="space-y-8">
                {items.map((order) => (
                    <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-luxury-gold/10 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        {/* Order Header */}
                        <div className="px-8 py-6 bg-luxury-marble/20 border-b border-luxury-gold/5 flex flex-wrap justify-between items-center gap-6">
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Acquisition ID</p>
                                    <p className="text-xs font-inter font-bold text-luxury-indigo uppercase tracking-wider">#{order._id.slice(-8)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Secured On</p>
                                    <p className="text-xs font-medium text-luxury-charcoal">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking_widest text-gray-400 mb-1">Total Valuation</p>
                                    <p className="text-xs font-inter font-bold text-luxury-indigo tracking-wider">₹{(order.pricing?.totalPrice || 0).toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full border text-[9px] uppercase tracking-[0.2em] font-bold ${getStatusStyle(order.orderStatus)}`}>
                                {order.orderStatus}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="px-8 py-8 space-y-8">
                            {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-luxury-marble rounded-lg overflow-hidden border border-luxury-gold/5">
                                            <img src={(item.product && item.product.images) ? item.product.images[0] : (item.image || '/placeholder-jewellery.jpg')} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-playfair font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">{item.name}</h4>
                                            <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mt-1">
                                                {item.purity} • {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-inter font-bold text-luxury-indigo tracking-wider">₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer - Actions */}
                        <div className="px-8 py-4 bg-luxury-marble/10 border-t border-luxury-gold/5 flex justify-end gap-4">
                            {order.certificateUrl && (
                                <a
                                    href={order.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-2 hover:opacity-70 transition-opacity"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 5.67l.618 7.034a11.996 11.996 0 0021.232 0L21 5.67l-.382-.016z" />
                                    </svg>
                                    Download Certificate
                                </a>
                            )}
                            {order.orderStatus === 'Delivered' && (
                                <button
                                    onClick={() => handleShare(order._id)}
                                    className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-2 hover:opacity-70 transition-opacity"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                    Share Verification
                                </button>
                            )}
                            <Link to={`/products`} className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors">Support & Inquiries</Link>
                            {['Pending', 'Processing'].includes(order.orderStatus) && (
                                <button
                                    onClick={(e) => handleCancelRequest(e, order._id)}
                                    className="text-[10px] uppercase tracking-widest text-red-400 font-bold border border-red-400/20 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCancelModal(false)}
                            className="absolute inset-0 bg-luxury-indigo/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white border border-luxury-gold/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <h3 className="text-2xl font-playfair text-luxury-charcoal mb-4">Cancel Acquisition?</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">Are you sure you want to cancel this order? This action will release the reserved items back to our collection.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowCancelModal(false)}
                                    className="border-gray-200 text-gray-400 hover:text-gray-600"
                                >
                                    No, Keep Order
                                </Button>
                                <button
                                    onClick={confirmCancel}
                                    className="bg-red-500 text-white font-bold py-3 rounded-lg text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Yes, Cancel Order
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-luxury-charcoal text-white px-8 py-4 rounded-full shadow-2xl border border-luxury-gold/30 flex items-center gap-4"
                    >
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-xs uppercase tracking-widest font-bold">Your order has been successfully cancelled.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Orders;
