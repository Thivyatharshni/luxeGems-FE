import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCart } from '../cart/cartSlice';
import { selectAddress } from '../addresses/addressSlice';
import { createOrder, clearActiveOrder } from './orderSlice';
import AddressManager from '../addresses/AddressManager';
import StripeForm from '../../components/payment/StripeForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Button from '../../components/ui/Button';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx'); // Test Key

const steps = ['Shipping', 'Review', 'Payment'];

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, summary, priceLock } = useSelector((state) => state.cart);
    const { selectedAddress } = useSelector((state) => state.addresses);
    const { isLoading: isOrdering, activeOrder, error: orderError } = useSelector((state) => state.orders);

    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (activeOrder) {
            navigate('/order-success');
        }
    }, [activeOrder, navigate]);

    const handleNext = () => {
        if (activeStep === 0 && !selectedAddress) {
            alert('Please select a delivery vault address');
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handlePlaceOrder = () => {
        dispatch(createOrder({
            shippingAddress: selectedAddress._id,
            paymentMethod: 'Prepaid (Simulated)', // For now
        }));
    };

    if (items.length === 0 && !isOrdering) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest font-bold">Checkout is Unavailable</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">Your bag is currently empty. Every masterpiece starts with a choice.</p>
                <Link to="/products">
                    <Button variant="outline" className="px-12">Return to Collections</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container-luxury py-8 lg:py-20">
            {/* Stepper Header */}
            <div className="max-w-3xl mx-auto mb-10 lg:mb-24 px-4 sm:px-0">
                <div className="flex justify-between relative">
                    {/* Progress Bar */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-luxury-gold/10 -translate-y-1/2 z-0" />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                        className="absolute top-1/2 left-0 h-[1px] bg-luxury-gold -translate-y-1/2 z-0"
                    />

                    {steps.map((label, index) => (
                        <div key={label} className="relative z-10 flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: activeStep >= index ? '#D4AF37' : '#fff',
                                    borderColor: activeStep >= index ? '#D4AF37' : '#E5E7EB',
                                    scale: activeStep === index ? 1.2 : 1
                                }}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${activeStep >= index ? 'text-white' : 'text-gray-300'}`}
                            >
                                {index + 1}
                            </motion.div>
                            <span className={`text-[8px] sm:text-[10px] uppercase tracking-widest mt-2 sm:mt-3 font-bold ${activeStep >= index ? 'text-luxury-gold' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Step Content */}
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        {activeStep === 0 && (
                            <motion.div
                                key="shipping"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <AddressManager
                                    onSelect={(addr) => dispatch(selectAddress(addr))}
                                    activeId={selectedAddress?._id}
                                />
                                <div className="mt-12 flex justify-end">
                                    <Button
                                        onClick={handleNext}
                                        disabled={!selectedAddress}
                                        className="px-12"
                                    >Review Acquisition</Button>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 1 && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <section>
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold mb-6">Delivery Target</h3>
                                    <div className="p-6 border border-luxury-gold/10 rounded-xl bg-luxury-gold/5">
                                        <p className="text-sm font-medium text-luxury-charcoal">{selectedAddress?.street}</p>
                                        <p className="text-xs text-gray-500">{selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.zipCode}</p>
                                        <p className="text-xs text-luxury-gold mt-2 font-bold uppercase tracking-widest">{selectedAddress?.phone}</p>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold mb-6">Acquisition Items</h3>
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <div key={`${item.product._id}-${item.selectedPurity}`} className="flex justify-between items-center py-4 border-b border-luxury-gold/10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-luxury-marble rounded-lg overflow-hidden border border-luxury-gold/5">
                                                        <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-playfair font-semibold text-luxury-charcoal">{item.product.title}</h4>
                                                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Qty: {item.quantity} • {item.selectedPurity}</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-inter font-semibold">₹{(item.product.pricing.finalPrice * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="flex justify-between mt-12">
                                    <Button variant="outline" onClick={handleBack}>Go Back</Button>
                                    <Button onClick={handleNext} className="px-12">Proceed to Payment</Button>
                                </div>
                            </motion.div>
                        )}

                        {activeStep === 2 && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center py-12 space-y-8"
                            >
                                <div className="w-20 h-20 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-luxury-gold/10">
                                    <svg className="w-10 h-10 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-playfair text-luxury-charcoal">Secure Payment Gateway</h3>
                                <p className="text-gray-500 max-w-md mx-auto">You are about to authorize a transaction of ₹{summary.total.toLocaleString('en-IN')}. This transaction is secured via end-to-end luxury-grade encryption.</p>

                                {orderError && (
                                    <p className="text-red-500 text-sm font-medium bg-red-50 p-4 rounded-lg">{orderError}</p>
                                )}

                                <div className="flex flex-col gap-4 mt-12 max-w-xs mx-auto">
                                    <Button
                                        onClick={handlePlaceOrder}
                                        isLoading={isOrdering}
                                        className="w-full py-5"
                                    >Authorize & Finalize Acquisition</Button>
                                    <Button variant="outline" onClick={handleBack} disabled={isOrdering}>Cancel</Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Summary */}
                <aside className="w-full lg:w-96">
                    <div className="bg-white border border-luxury-gold/20 rounded-xl p-8 sticky top-24">
                        <h2 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold mb-8 border-b border-luxury-gold/10 pb-4">Acquisition Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 italic">Subtotal</span>
                                <span className="font-inter text-luxury-charcoal">₹{summary.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 italic">Insurance & GST</span>
                                <span className="font-inter text-luxury-charcoal">₹{summary.tax.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-[1px] bg-luxury-gold/10 my-6" />
                            <div className="flex justify-between items-baseline">
                                <span className="text-luxury-charcoal font-playfair text-lg">Grant Total</span>
                                <span className="text-2xl font-bold text-luxury-indigo font-inter">₹{summary.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {priceLock.locked && (
                            <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-lg text-center mt-8">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold">Rates Secured</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Checkout;
