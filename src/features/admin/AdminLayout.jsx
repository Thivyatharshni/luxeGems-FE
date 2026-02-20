import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import AdminNotifications from './AdminNotifications';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user } = useSelector((state) => state.auth);
    const menuItems = [
        { label: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: ['admin'] },
        { label: 'CMS Editor', path: '/admin/cms', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', roles: ['admin'] },
        { label: 'Acquisitions', path: '/admin/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', roles: ['admin'] },
        { label: 'Story Videos', path: '/admin/stories', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', roles: ['admin'] },
        { label: 'Categories', path: '/admin/categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', roles: ['admin', 'inventory_manager'] },
        { label: 'Inventory', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', roles: ['admin', 'inventory_manager'] },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

    // Close sidebar on route change for mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-luxury-marble/10">
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-luxury-indigo text-white flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <Link to="/" className="text-xl font-bold tracking-[0.3em] text-luxury-gold italic">LUXEGEMS</Link>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-2">Curatorial Command</p>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-luxury-gold">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-grow p-6 space-y-2">
                    {filteredMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-xs uppercase tracking-widest transition-all ${location.pathname === item.path
                                ? 'bg-luxury-gold text-white font-bold shadow-lg shadow-luxury-gold/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                            </svg>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 text-[9px] uppercase tracking-widest text-gray-500 text-center">
                    Bespoke Admin v1.0
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-luxury-gold/10 flex items-center justify-between px-4 sm:px-8 lg:px-12 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-luxury-indigo hover:text-luxury-gold transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-sm sm:text-lg font-playfair text-luxury-charcoal font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
                            {location.pathname.includes('/products') ? 'Inventory' :
                                location.pathname.includes('/orders') ? 'Acquisitions' :
                                    location.pathname.includes('/categories') ? 'Categories' :
                                        location.pathname.includes('/cms') ? 'CMS' :
                                            location.pathname.includes('/profile') ? 'Profile' :
                                                'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6">
                        <AdminNotifications />

                        <div className="h-8 w-px bg-luxury-gold/10 hidden sm:block"></div>

                        {/* Admin Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="text-xs font-bold text-luxury-indigo">{user?.name || 'Admin'}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-luxury-gold">Administrator</p>
                                </div>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-luxury-indigo text-luxury-gold flex items-center justify-center border border-luxury-gold/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <>
                                        {/* Click away overlay */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setIsProfileOpen(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 top-full pt-2 z-50 min-w-[160px] sm:min-w-[180px]"
                                        >
                                            <div className="bg-white border border-luxury-gold/10 shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-lg py-2 overflow-hidden">
                                                <Link
                                                    to="/admin/profile"
                                                    onClick={() => setIsProfileOpen(false)}
                                                    className="block px-4 py-2 text-[10px] uppercase tracking-widest text-luxury-charcoal hover:bg-luxury-gold/5 hover:text-luxury-gold transition-colors"
                                                >
                                                    Admin Profile
                                                </Link>
                                                <div className="h-px bg-luxury-gold/5 my-1"></div>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        localStorage.removeItem('token');
                                                        window.location.href = '/login';
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-50 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-8 lg:p-12 overflow-y-auto max-h-[calc(100vh-64px)] scrollbar-hide">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
