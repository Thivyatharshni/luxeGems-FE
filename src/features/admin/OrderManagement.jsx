import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatus } from '../orders/orderSlice';
import { fetchAdminOrders } from './adminSlice';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagement = () => {
    const dispatch = useDispatch();
    const { items, pagination, isLoading } = useSelector((state) => state.admin.orders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', carrier: '', trackingNumber: '' });
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAdminOrders({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleSelectOrder = (order) => {
        setSelectedOrder(order);
        setStatusUpdate({ status: order.orderStatus, carrier: order.tracking?.carrier || '', trackingNumber: order.tracking?.trackingNumber || '' });
    };

    const handleStatusUpdate = async () => {
        await dispatch(updateOrderStatus({
            id: selectedOrder._id,
            status: statusUpdate.status,
            tracking: { carrier: statusUpdate.carrier, trackingNumber: statusUpdate.trackingNumber }
        }));
        dispatch(fetchAdminOrders({ page, limit: 10 }));
        setSelectedOrder(null);
    };

    const getStatusBadge = (status) => {
        const colors = {
            'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
            'Processing': 'bg-blue-50 text-blue-600 border-blue-100',
            'Shipped': 'bg-purple-50 text-purple-600 border-purple-100',
            'Delivered': 'bg-green-50 text-green-600 border-green-100',
            'Cancelled': 'bg-red-50 text-red-600 border-red-100'
        };
        return colors[status] || 'bg-gray-50 text-gray-600 border-gray-100';
    };

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-3xl font-playfair text-luxury-charcoal">Acquisition Management</h1>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Overseeing {items.length} client acquisitions</p>
            </header>

            <div className="bg-white rounded-[2rem] border border-luxury-gold/10 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-luxury-marble/20 border-b border-luxury-gold/5">
                        <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                            <th className="px-8 py-6">Registry ID</th>
                            <th className="px-8 py-6">Custodian</th>
                            <th className="px-8 py-6">Items</th>
                            <th className="px-8 py-6">Date</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Acquisition Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-gold/5">
                        {items.map((order) => (
                            <tr
                                key={order._id}
                                className="hover:bg-luxury-marble/5 transition-colors cursor-pointer group"
                                onClick={() => handleSelectOrder(order)}
                            >
                                <td className="px-8 py-6 font-inter text-xs text-luxury-indigo font-bold uppercase tracking-wider">#{order._id.slice(-8)}</td>
                                <td className="px-8 py-6">
                                    <p className="font-playfair font-bold text-luxury-charcoal">{order.user?.name || 'Private Collector'}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-400">{order.user?.email}</p>
                                </td>
                                <td className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                    {order.orderItems.length} Masterpieces
                                </td>
                                <td className="px-8 py-6 text-xs text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full border text-[9px] uppercase tracking-[0.2em] font-bold ${getStatusBadge(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right font-inter font-bold text-xs text-luxury-indigo">
                                    ₹{order.pricing.totalPrice.toLocaleString('en-IN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="px-8 py-6 bg-luxury-marble/5 border-t border-luxury-gold/5 flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        Showing Page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-4 py-2 border border-luxury-gold/10 rounded-lg text-[10px] uppercase tracking-widest font-bold disabled:opacity-30"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-4 py-2 bg-luxury-gold text-white rounded-lg text-[10px] uppercase tracking-widest font-bold disabled:opacity-30"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-luxury-indigo/60 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl"
                        >
                            <h2 className="text-2xl font-playfair mb-8">Fulfillment Command</h2>
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">State Transition</h3>
                                    <select
                                        value={statusUpdate.status}
                                        onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                        className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none"
                                    >
                                        <option value="Pending">Pending Validation</option>
                                        <option value="Processing">In Processing/Crafting</option>
                                        <option value="Shipped">Dispatched to Custodian</option>
                                        <option value="Delivered">Delivered & Certified</option>
                                        <option value="Cancelled">Acquisition Revoked</option>
                                    </select>
                                </section>

                                {statusUpdate.status === 'Shipped' && (
                                    <section className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Logistics Particulars</h3>
                                        <div className="space-y-4">
                                            <input
                                                placeholder="Curated Carrier"
                                                value={statusUpdate.carrier}
                                                onChange={(e) => setStatusUpdate({ ...statusUpdate, carrier: e.target.value })}
                                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none"
                                            />
                                            <input
                                                placeholder="Tracking Identifier"
                                                value={statusUpdate.trackingNumber}
                                                onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none"
                                            />
                                        </div>
                                    </section>
                                )}

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="flex-1 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-luxury-charcoal transition-colors px-6 py-4 rounded-xl border border-luxury-marble"
                                    >
                                        Defer
                                    </button>
                                    <button
                                        onClick={handleStatusUpdate}
                                        className="flex-1 text-[10px] uppercase tracking-[0.2em] font-bold text-white bg-luxury-gold hover:bg-luxury-gold/80 transition-all px-6 py-4 rounded-xl shadow-lg shadow-luxury-gold/20"
                                    >
                                        Authorize Update
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderManagement;
