import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, logout } from './features/auth/authSlice';
import api from './services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Components & Features
import Home from './features/products/Home';
import ProductListing from './features/products/ProductListing';
import ProductDetail from './features/products/ProductDetail';
import Cart from './features/cart/Cart';
import Checkout from './features/orders/Checkout';
import Orders from './features/orders/Orders';
import OrderSuccess from './features/orders/OrderSuccess';
import CertificateVerification from './features/orders/CertificateVerification';
import Wishlist from './features/wishlist/Wishlist';
import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminProfile from './features/admin/AdminProfile';
import ProductManagement from './features/admin/ProductManagement';
import CategoryManagement from './features/admin/CategoryManagement';
import OrderManagement from './features/admin/OrderManagement';
import CMSManagement from './features/admin/CMSManagement';
import VideoStoryManagement from './features/admin/VideoStoryManagement';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { fetchCart } from './features/cart/cartSlice';
import { fetchWishlist } from './features/wishlist/wishlistSlice';
import Button from './components/ui/Button';

import UserProfile from './features/users/UserProfile';

// Layouts
const MainLayout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.overflowX = 'hidden';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      dispatch(logout());
    }
  };

  const headerClasses = `fixed top-0 left-0 right-0 h-20 flex items-center px-4 sm:px-8 justify-between z-50 transition-all duration-500 ${isHome
    ? isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3'
      : 'bg-transparent py-6'
    : 'bg-white shadow-sm border-b border-gray-100 py-3'
    }`;

  const navLinkBaseClasses = "text-[13px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:text-luxury-gold";
  const navLinkColorClasses = isHome && !isScrolled ? 'text-white' : 'text-luxury-charcoal';
  const logoClasses = `text-xl sm:text-2xl font-bold tracking-[0.3em] transition-colors duration-500 ${isHome && !isScrolled ? 'text-white' : 'text-luxury-gold'
    }`;

  return (
    <div className={`min-h-screen flex flex-col ${isHome ? '' : 'pt-20'}`}>
      <header className={headerClasses}>
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${navLinkColorClasses}`}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <Link to="/" className={logoClasses}>LUXEGEMS</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-8 items-center">
          <Link to="/" className={`${navLinkBaseClasses} ${navLinkColorClasses}`}>Home</Link>
          <Link to="/products" className={`${navLinkBaseClasses} ${navLinkColorClasses}`}>Jewellery</Link>
          <Link to="/cart" className={`${navLinkBaseClasses} ${navLinkColorClasses}`}>Cart</Link>
          <Link to="/wishlist" className={`${navLinkBaseClasses} ${navLinkColorClasses}`}>
            <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <Link to="/orders" className={`${navLinkBaseClasses} ${navLinkColorClasses}`}>
                Orders
              </Link>

              {/* User Dropdown (Admin & Regular) */}
              <div className="relative group py-2">
                <button className={`flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${isHome && !isScrolled ? 'text-white' : 'text-luxury-gold'
                  }`}>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${isHome && !isScrolled
                    ? 'border-white/30 bg-white/10'
                    : 'border-luxury-gold/30 bg-luxury-gold/5'
                    } overflow-hidden`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>{user?.name} ▾</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  <div className="bg-white border border-luxury-gold/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-xl py-5 min-w-[240px] overflow-hidden">
                    {/* Identity Section */}
                    <div className="px-6 pb-4 border-b border-luxury-gold/5 mb-4">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-bold mb-1">
                        {user?.role === 'admin' ? 'Collector Identity' : 'My Account'}
                      </p>
                      <p className="text-sm font-playfair text-luxury-charcoal font-bold">{user?.name}</p>
                      <p className="text-[11px] text-gray-400 lowercase tracking-normal font-inter mb-3">{user?.email}</p>

                      <div className="inline-block px-3 py-1 bg-luxury-gold/10 rounded-full text-[9px] uppercase tracking-widest text-luxury-gold font-bold">
                        {user?.role === 'admin' ? 'Admin Access' : user?.role === 'inventory_manager' ? 'Manager' : 'Member'}
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="px-3 space-y-1">
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-luxury-charcoal hover:bg-luxury-gold/5 hover:text-luxury-gold transition-colors rounded-lg">
                          Dashboard
                        </Link>
                      )}
                      {user?.role === 'inventory_manager' && (
                        <Link to="/admin/products" className="block px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-luxury-charcoal hover:bg-luxury-gold/5 hover:text-luxury-gold transition-colors rounded-lg">
                          Inventory Dashboard
                        </Link>
                      )}

                      <Link to={user?.role === 'admin' ? '/admin/profile' : '/profile'} className="flex items-center gap-3 px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-luxury-charcoal hover:bg-luxury-gold/5 hover:text-luxury-gold transition-colors rounded-lg">
                        <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {user?.role === 'admin' ? 'Settings' : 'Edit Profile'}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.1em] text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center gap-3 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <Link to="/login" className={`${isHome && !isScrolled ? 'text-white border-white' : 'text-luxury-gold border-luxury-gold'} border-b flex items-center gap-2 group`}>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.3em] transition-all">Sign In</span>
            </Link>
          )}
        </nav>

        {/* Mobile Header Icons (Cart/Profile) */}
        <div className="flex lg:hidden items-center gap-4">
          <Link to="/cart" className={navLinkColorClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
          <Link to="/wishlist" className={navLinkColorClasses}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          {isAuthenticated ? (
            <Link to={user?.role === 'admin' ? '/admin' : '/profile'} className={logoClasses}>
              <div className="w-8 h-8 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 flex items-center justify-center overflow-hidden">
                <svg className="w-4 h-4 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ) : (
            <Link to="/login" className={navLinkColorClasses}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-luxury-indigo lg:hidden flex flex-col p-8 pt-24"
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <nav className="flex flex-col gap-8">
              <Link to="/" className="text-2xl font-playfair text-white hover:text-luxury-gold transition-colors">Home</Link>
              <Link to="/products" className="text-2xl font-playfair text-white hover:text-luxury-gold transition-colors">Jewellery</Link>
              <Link to="/wishlist" className="text-2xl font-playfair text-white hover:text-luxury-gold transition-colors">Wishlist</Link>
              <Link to="/cart" className="text-2xl font-playfair text-white hover:text-luxury-gold transition-colors">Your Bag</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/orders" className="text-2xl font-playfair text-white hover:text-luxury-gold transition-colors">Order History</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="text-2xl font-playfair text-luxury-gold hover:text-white transition-colors border-t border-white/10 pt-8">Admin Vault</Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-left text-2xl font-playfair text-red-400 hover:text-red-500 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-2xl font-playfair text-luxury-gold hover:text-white transition-colors border-t border-white/10 pt-8">Sign In</Link>
              )}
            </nav>

            <div className="mt-auto pb-8">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-4">Curatorial Standards</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 italic text-xs">BIS</div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 italic text-xs">GIA</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-grow">{children}</main>
      <footer className="bg-luxury-indigo text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-luxury-gold text-lg mb-4">LUXEGEMS</h2>
            <p className="text-gray-400 text-sm">Elegance in every facet. Premium gold and diamond jewellery.</p>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/cart">Your Cart</Link></li>
              <li><Link to="/verify">Certificate Verification</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-2">Subscribe to our curated collections.</p>
            <div className="flex">
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 px-4 py-2 text-sm w-full outline-none focus:border-luxury-gold" />
              <button className="bg-luxury-gold px-4 py-2 text-sm uppercase">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};


const Products = () => <ProductListing />;

// App Component
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          dispatch(setCredentials(data.data));
          dispatch(fetchCart());
          dispatch(fetchWishlist());
        }
      } catch (error) {
        console.log('Not authenticated');
        localStorage.removeItem('token');
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public Routes wrapped in MainLayout */}
        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/verify/:id" element={<CertificateVerification />} />
          <Route path="/verify" element={<CertificateVerification />} />
        </Route>

        {/* Admin Routes - No MainLayout */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/cms" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <CMSManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/stories" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <VideoStoryManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute role={['admin', 'inventory_manager']}>
            <AdminLayout>
              <ProductManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/categories" element={
          <ProtectedRoute role={['admin', 'inventory_manager']}>
            <AdminLayout>
              <CategoryManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute role="admin">
            <AdminLayout>
              <OrderManagement />
            </AdminLayout>
          </ProtectedRoute>
        } />

        {/* Add more routes as we progress */}
      </Routes>
    </Router>
  );
}

export default App;
