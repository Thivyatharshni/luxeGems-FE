import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, Package, FileEdit, UserCheck, CheckCircle2 } from 'lucide-react';
import { fetchNotifications, markAsRead, markAllAsRead } from './notificationSlice';
// import { formatDistanceToNow } from 'date-fns';

const formatDistanceToNow = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
};

const AdminNotifications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: notifications, unreadCount } = useSelector((state) => state.notifications);
    const [isHovered, setIsHovered] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    useEffect(() => {
        dispatch(fetchNotifications());
        const pollInterval = setInterval(() => {
            dispatch(fetchNotifications());
        }, 30000); // 30s polling
        return () => clearInterval(pollInterval);
    }, [dispatch]);

    const handleMouseEnter = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => setIsHovered(false), 300);
        setTimeoutId(id);
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            dispatch(markAsRead(notification._id));
        }
        navigate(notification.link);
        setIsHovered(false);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <ShoppingBag className="w-4 h-4 text-luxury-gold-brand" />;
            case 'inventory': return <Package className="w-4 h-4 text-amber-500" />;
            case 'cms': return <FileEdit className="w-4 h-4 text-blue-500" />;
            case 'admin': return <UserCheck className="w-4 h-4 text-emerald-500" />;
            default: return <Bell className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button className="relative p-2 text-gray-400 hover:text-luxury-gold-brand transition-all duration-300 group">
                <Bell className={`w-5 h-5 transition-transform duration-500 ${unreadCount > 0 ? 'group-hover:animate-bounce' : ''}`} />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-2 ring-red-500/20"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 top-full pt-4 z-50 w-[340px] md:w-[380px]"
                    >
                        <div className="bg-white border border-luxury-gold-brand/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden backdrop-blur-xl bg-white/95">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-luxury-ivory/50">
                                <h3 className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-luxury-charcoal">
                                    Vault Activity
                                </h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => dispatch(markAllAsRead())}
                                        className="text-[9px] uppercase tracking-widest text-luxury-gold-brand hover:text-black font-bold transition-colors flex items-center gap-1.5"
                                    >
                                        <CheckCircle2 className="w-3 h-3" />
                                        Mark all Read
                                    </button>
                                )}
                            </div>

                            {/* List */}
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`px-6 py-5 border-b border-gray-50 cursor-pointer transition-all duration-300 relative group ${!n.isRead ? 'bg-luxury-gold-brand/5' : 'hover:bg-gray-50'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${!n.isRead ? 'bg-white border-luxury-gold-brand/20 shadow-md scale-110' : 'bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-luxury-gold-brand/10'}`}>
                                                    {getIcon(n.type)}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-[12px] leading-relaxed transition-colors ${!n.isRead ? 'text-black font-semibold' : 'text-gray-500'}`}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-medium flex items-center gap-2">
                                                        {formatDistanceToNow(new Date(n.createdAt))} ago
                                                        {!n.isRead && <span className="w-1 h-1 bg-luxury-gold-brand rounded-full animate-pulse" />}
                                                    </p>
                                                </div>
                                            </div>
                                            {!n.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury-gold-brand shadow-[2px_0_10px_rgba(198,161,74,0.3)]" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-luxury-ivory rounded-full flex items-center justify-center mx-auto opacity-50">
                                            <Bell className="w-6 h-6 text-luxury-gold-brand" />
                                        </div>
                                        <div className="space-y-1 px-10">
                                            <p className="text-[13px] font-playfair italic text-gray-500">No recent vault activity.</p>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-400">Notifications will appear here as they occur.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50 text-center">
                                    <span className="text-[8px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                                        LuxeGems Command Center
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminNotifications;
