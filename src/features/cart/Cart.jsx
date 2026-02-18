import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setPriceStale
} from './cartSlice';
import Button from '../../components/ui/Button';
import PriceUpdateModal from '../../components/cart/PriceUpdateModal';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, summary, priceLock, isLoading, isPriceStale } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [timeLeft, setTimeLeft] = useState(null);
    const [secondsRemaining, setSecondsRemaining] = useState(null);
    const [showPriceModal, setShowPriceModal] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        // Automatically show modal if there are price change warnings
        const hasWarnings = items.some(item => item.priceChangeWarning);
        if (hasWarnings && !showPriceModal) {
            setShowPriceModal(true);
        }
    }, [items, showPriceModal]);

    useEffect(() => {
        if (priceLock.locked && priceLock.expiresAt) {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const expiry = new Date(priceLock.expiresAt).getTime();
                const distance = expiry - now;

                if (distance < 0) {
                    clearInterval(timer);
                    setTimeLeft('Expired');
                    setSecondsRemaining(0);
                    // UX Polish 3: Auto-refresh on expiry
                    dispatch(fetchCart());
                } else {
                    const secs = Math.floor(distance / 1000);
                    setSecondsRemaining(secs);

                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
                }
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setTimeLeft(null);
            setSecondsRemaining(null);
        }
    }, [priceLock, dispatch]);

    const handleQuantityChange = (productId, selectedPurity, newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateCartItem({ productId, selectedPurity, quantity: newQuantity }));
    };

    const handleRemove = (productId, selectedPurity) => {
        dispatch(removeFromCart({ productId, selectedPurity }));
    };

    const handleAcceptPrice = () => {
        setShowPriceModal(false);
        dispatch(fetchCart()); // Refresh cart to clear warnings and reset lock
    };

    // UX Logic checks
    const isExpired = timeLeft === 'Expired' || !priceLock.locked;
    const isLowTime = secondsRemaining !== null && secondsRemaining < 60 && secondsRemaining > 0;

    if (!isAuthenticated) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest">Your Vault is Private</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto line-height-relaxed">
                    Please sign in to view and manage your curated collection of masterpieces.
                </p>
                <Link to="/login">
                    <Button className="px-12">Sign In to Continue</Button>
                </Link>
            </div>
        );
    }

    if (items.length === 0 && !isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="mb-10 opacity-20">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto font-light">
                    Every masterpiece starts with a single selection. Begin your journey through our exclusive collections.
                </p>
                <Link to="/products">
                    <Button variant="outline" className="px-12">Discover Jewellery</Button>
                </Link>
            </div>
        );
    }

    // Modal data calculation
    const hasWarnings = items?.some(item => item.priceChangeWarning);
    const affectedItem = items?.find(item => item.priceChangeWarning);
    const oldPriceTotal = items?.reduce((acc, item) => acc + ((item.lastKnownPrice || 0) * item.quantity), 0) || 0;
    const newPriceTotal = summary?.subtotal || 0;

    return (
        <div className="container-luxury py-8 lg:py-12">
            <PriceUpdateModal
                isOpen={showPriceModal}
                onClose={() => setShowPriceModal(false)}
                oldPrice={oldPriceTotal}
                newPrice={newPriceTotal}
                onAccept={handleAcceptPrice}
            />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Cart Items */}
                <div className="flex-grow space-y-8">
                    <div className="flex justify-between items-end border-b border-luxury-gold/10 pb-6">
                        <h1 className="text-4xl font-playfair text-luxury-charcoal">Shopping Bag</h1>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
                            {items?.length || 0} {(items?.length === 1) ? 'Item' : 'Items'}
                        </span>
                    </div>

                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={`${item.product?._id}-${item.selectedPurity}`}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`flex flex-col sm:flex-row gap-6 p-6 bg-white border rounded-xl hover:shadow-[0_15px_30px_rgba(212,175,55,0.05)] transition-shadow ${item.priceChangeWarning ? 'border-luxury-gold' : 'border-luxury-gold/5'}`}
                            >
                                <div className="w-32 h-32 flex-shrink-0 bg-luxury-marble rounded-lg overflow-hidden border border-luxury-gold/5">
                                    <img
                                        src={item.product?.images[0] || '/placeholder-jewellery.jpg'}
                                        alt={item.product?.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-playfair text-xl text-luxury-charcoal hover:text-luxury-gold transition-colors">
                                                <Link to={`/products/${item.product?._id}`}>{item.product?.title}</Link>
                                            </h3>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold mt-1 font-semibold">
                                                {item.selectedPurity} {item.product?.specifications?.metalType}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.product?._id, item.selectedPurity)}
                                            className="text-gray-300 hover:text-red-400 transition-colors p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                        <div className="flex items-center border border-luxury-gold/10 rounded-full px-2 py-1">
                                            <button
                                                onClick={() => handleQuantityChange(item.product?._id, item.selectedPurity, item.quantity - 1)}
                                                className="p-1 px-3 text-gray-400 hover:text-luxury-gold transition-colors font-light"
                                            >–</button>
                                            <span className="w-8 text-center text-sm font-inter text-luxury-indigo">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product?._id, item.selectedPurity, item.quantity + 1)}
                                                className="p-1 px-3 text-gray-400 hover:text-luxury-gold transition-colors font-light"
                                            >+</button>
                                        </div>

                                        <div className="text-right">
                                            {item.priceChangeWarning && (
                                                <p className="text-[9px] text-luxury-gold uppercase tracking-widest font-bold mb-1">Market Adjusted</p>
                                            )}
                                            <p className="font-inter font-semibold text-luxury-indigo text-lg">
                                                ₹{(item.product?.pricing?.finalPrice * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary Sidebar */}
                <aside className="w-full lg:w-96">
                    <div className="bg-white border border-luxury-gold/20 rounded-xl p-8 sticky top-24 shadow-[0_20px_50px_rgba(153,101,21,0.05)]">
                        {/* Price Lock Indicator */}
                        {priceLock.locked && (
                            <div className="mb-8 p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-lg text-center">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold mb-2 block italic">Banking-Grade Price Lock</span>
                                <p className={`text-2xl font-inter font-bold tracking-widest transition-colors duration-500 ${isLowTime ? 'text-red-500 animate-pulse' : 'text-luxury-indigo'}`}>
                                    {timeLeft || '00:00'}
                                </p>
                                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-2 px-2">
                                    Current gold rates secured for this session
                                </p>
                            </div>
                        )}

                        <h2 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold mb-8 border-b border-luxury-gold/10 pb-4">
                            Summary & Estimates
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-inter text-luxury-charcoal font-medium">₹{summary?.subtotal?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Estimated GST (3%)</span>
                                <span className="font-inter text-luxury-charcoal font-medium">₹{summary?.tax?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Insured Shipping</span>
                                <span className="text-green-600 font-inter font-medium uppercase text-[10px] tracking-widest pt-1">Complimentary</span>
                            </div>
                            <div className="h-[1px] bg-luxury-gold/10 my-6" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-luxury-charcoal font-playfair text-lg">Total Payable</span>
                                <span className="text-2xl font-semibold text-luxury-indigo font-inter">₹{summary?.total?.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {isExpired ? (
                                <Button
                                    size="lg"
                                    className="w-full py-5 text-base tracking-[0.1em]"
                                    onClick={async () => {
                                        await dispatch(require('./cartSlice').refreshPriceLock());
                                        dispatch(require('./cartSlice').fetchCart());
                                    }}
                                >
                                    Refresh Prices
                                </Button>
                            ) : (
                                <Link to="/checkout">
                                    <Button
                                        size="lg"
                                        className="w-full py-5 text-base tracking-[0.1em]"
                                    >
                                        Secure Checkout
                                    </Button>
                                </Link>
                            )}

                            {isExpired && (
                                <p className="text-center text-[9px] text-red-400 uppercase tracking-[0.1em] font-semibold">
                                    Price lock expired. Please refresh prices to continue.
                                </p>
                            )}
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.040L3 5.67l.618 7.034a11.996 11.996 0 0021.232 0L21 5.67l-.382-.016z" />
                                </svg>
                                <span className="text-[10px] uppercase tracking-widest">BIS Hallmarked Integrity</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <svg className="w-4 h-4 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-[10px] uppercase tracking-widest">Secured Payment Escrow</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Cart;
