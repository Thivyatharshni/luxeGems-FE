import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-luxury-marble relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-luxury-indigo/5 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-white/98 backdrop-blur-xl p-10 md:p-12 shadow-[0_25px_70px_rgba(153,101,21,0.1)] border border-luxury-gold/35 rounded-xl transition-all duration-700 hover:shadow-[0_30px_80px_rgba(153,101,21,0.15)] hover:ring-1 hover:ring-luxury-gold/20 group"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-playfair tracking-tight mb-3 text-luxury-charcoal">{title}</h2>
                    {subtitle && <p className="text-gray-400 text-xs font-inter tracking-[0.05em] uppercase opacity-80">{subtitle}</p>}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-luxury-gold/40"></div>
                        <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                        <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-luxury-gold/40"></div>
                    </div>
                </div>
                {children}
            </motion.div>
        </div>
    );
};

export default AuthLayout;
