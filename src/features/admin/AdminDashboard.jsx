import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from './adminSlice';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { stats, isLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchAdminStats());
    }, [dispatch]);

    const statCards = [
        { label: 'Gross Revenue', value: `₹${stats.summary.revenue.toLocaleString('en-IN')}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { label: 'Acquisitions', value: stats.summary.orders, icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
        { label: 'Inventory', value: stats.summary.products, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { label: 'Custodians', value: stats.summary.customers, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    ];

    if (isLoading) {
        return <div className="text-luxury-gold animate-pulse italic">Aggregating vault data...</div>;
    }

    return (
        <div className="space-y-8 lg:space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-playfair text-luxury-charcoal">Curatorial Overview</h1>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-2">Real-time performance of the LuxeGems vault</p>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {statCards.map((stat, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 sm:p-8 rounded-2xl border border-luxury-gold/10 shadow-sm hover:border-luxury-gold/30 transition-colors"
                    >
                        <div className="flex justify-between mb-4">
                            <div className="p-2 bg-luxury-gold/5 rounded-lg border border-luxury-gold/10">
                                <svg className="w-5 h-5 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={stat.icon} />
                                </svg>
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{stat.label}</p>
                        <h3 className="text-xl sm:text-2xl font-inter font-bold text-luxury-indigo">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Recent Acquisitions Table */}
                <div className="bg-white p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-luxury-gold/10 shadow-sm">
                    <h3 className="text-xs sm:text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-6 sm:mb-8 border-b border-luxury-gold/10 pb-4">Recent Acquisitions</h3>
                    <div className="space-y-6">
                        {stats.recentOrders.map(order => (
                            <div key={order._id} className="flex justify-between items-center text-sm border-b border-luxury-gold/5 pb-4 last:border-0">
                                <div>
                                    <p className="font-bold text-luxury-indigo tracking-wider uppercase text-xs">#{order._id.slice(-8)}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{order.user?.name || 'Private Collector'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-inter font-semibold">₹{order.pricing.totalPrice.toLocaleString('en-IN')}</p>
                                    <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-tighter">{order.orderStatus}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inventory Distribution */}
                <div className="bg-white p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] border border-luxury-gold/10 shadow-sm">
                    <h3 className="text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-8 border-b border-luxury-gold/10 pb-4">Collection Balance</h3>
                    <div className="space-y-6">
                        {stats.categoryStats.map(stat => (
                            <div key={stat._id} className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                    <span>{stat._id}</span>
                                    <span>{stat.count} Items</span>
                                </div>
                                <div className="h-2 bg-luxury-marble rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-luxury-gold"
                                        style={{ width: `${(stat.count / stats.summary.products) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
