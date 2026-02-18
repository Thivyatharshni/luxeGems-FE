import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const PriceUpdateModal = ({ isOpen, onClose, oldPrice, newPrice, onAccept }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-luxury-indigo/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-luxury-gold/20"
                    >
                        <div className="p-8">
                            <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-playfair text-center text-luxury-charcoal mb-4">
                                Market Rate Adjustment
                            </h2>

                            <p className="text-sm text-center text-gray-500 mb-8 leading-relaxed">
                                The live market price for gold has updated since you added these items. To ensure integrity, your bag has been adjusted to the current certified rates.
                            </p>

                            <div className="flex justify-between items-center p-4 bg-luxury-marble rounded-xl mb-8 border border-luxury-gold/5">
                                <div className="text-center flex-grow">
                                    <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1 font-bold">Previous</span>
                                    <span className="text-gray-400 line-through font-inter italic">₹{oldPrice?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="px-4 text-luxury-gold">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <div className="text-center flex-grow">
                                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold block mb-1 font-bold">Current</span>
                                    <span className="text-luxury-indigo font-inter font-bold text-xl">₹{newPrice?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button onClick={onAccept} className="w-full py-4 text-sm tracking-widest uppercase">
                                    Accept & Continue
                                </Button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-luxury-charcoal transition-colors font-bold"
                                >
                                    Review Selection
                                </button>
                            </div>
                        </div>

                        <div className="bg-luxury-gold/5 py-4 px-8 border-t border-luxury-gold/10">
                            <p className="text-[9px] text-center text-luxury-gold uppercase tracking-[0.2em] font-semibold">
                                New 15-Minute Price Lock Initiated
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PriceUpdateModal;
