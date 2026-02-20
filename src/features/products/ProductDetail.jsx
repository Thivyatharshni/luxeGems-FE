import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchProductById, clearSelectedProduct } from './productSlice';
import { addToCart } from '../cart/cartSlice';
import { toggleWishlist } from '../wishlist/wishlistSlice';
import { clearReviews } from '../reviews/reviewSlice';
import ReviewSection from '../reviews/ReviewSection';
import Button from '../../components/ui/Button';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedProduct: product, isLoading, error } = useSelector((state) => state.products);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchProductById(id));
        return () => {
            dispatch(clearSelectedProduct());
            dispatch(clearReviews());
        };
    }, [dispatch, id]);

    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const isInWishlist = wishlistItems.some(item => item._id === id || item === id);


    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="aspect-square bg-luxury-ivory rounded-[30px] overflow-hidden relative">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                    </div>
                    <div className="space-y-8 py-4">
                        <div className="h-4 w-24 bg-luxury-beige/30 rounded" />
                        <div className="h-12 w-full bg-luxury-beige/30 rounded" />
                        <div className="h-32 w-full bg-luxury-beige/30 rounded" />
                        <div className="h-14 w-48 bg-luxury-beige/30 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-2xl font-playfair mb-4">Masterpiece Not Found</h2>
                <p className="text-gray-500 mb-8">The requested item could not be retrieved from our vaults.</p>
                <Link to="/products">
                    <Button variant="outline">Back to Collection</Button>
                </Link>
            </div>
        );
    }

    const { title, pricing, specifications, description, images, category } = product;

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=/products/${id}`);
            return;
        }

        try {
            await dispatch(addToCart({
                productId: product._id,
                quantity: 1,
                selectedPurity: specifications.purity
            })).unwrap();

            navigate('/cart');
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    return (
        <div className="container-luxury py-8 lg:py-20">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-12">
                <Link to="/" className="hover:text-luxury-gold-brand transition-colors">Home</Link>
                <span>/</span>
                <Link to="/products" className="hover:text-luxury-gold-brand transition-colors font-bold">Jewellery</Link>
                <span>/</span>
                <span className="text-luxury-gold-brand font-bold bg-luxury-gold-brand/10 px-3 py-1 rounded-full">{title}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-24">
                {/* Image Gallery */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square bg-luxury-marble rounded-xl overflow-hidden border border-luxury-gold/5"
                    >
                        <img
                            src={images[0] || '/placeholder-jewellery.jpg'}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="aspect-square bg-luxury-marble rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-luxury-gold transition-colors">
                                    <img src={img} alt={`${title} view ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <span className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold mb-4">
                        {category?.name} • {specifications.purity} {specifications.metalType}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-playfair text-luxury-charcoal mb-6 leading-tight">
                        {title}
                    </h1>

                    <div className="p-8 bg-luxury-ivory/50 border border-luxury-gold-brand/10 rounded-[20px] mb-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold-brand/5 rounded-full blur-3xl -mr-10 -mt-10" />
                        <div className="flex items-baseline gap-4 mb-3 relative z-10">
                            <span className="text-4xl font-inter font-bold text-luxury-indigo tracking-tight">
                                ₹{pricing.finalPrice?.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xl text-gray-300 line-through">
                                ₹{(pricing.finalPrice * 1.15).toLocaleString('en-IN')}
                            </span>
                            <span className="bg-luxury-gold-brand text-white text-[9px] px-2.5 py-1 rounded-full tracking-[0.2em] font-bold shadow-sm">
                                15% OFF
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed relative z-10 font-medium">
                            Includes GST and Complimentary Insured Shipping.
                        </p>
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-10 font-light italic">
                        "{description}"
                    </p>

                    <div className="flex gap-4 mb-12">
                        <Button
                            size="lg"
                            className="flex-grow py-5 text-base"
                            onClick={handleAddToCart}
                        >
                            Add to Shopping Bag
                        </Button>
                        <button
                            onClick={() => dispatch(toggleWishlist(id))}
                            className={`p-4 border border-luxury-gold-brand/20 rounded-xl transition-all duration-500 ${isInWishlist ? 'bg-luxury-gold-brand text-white shadow-lg' : 'hover:bg-luxury-gold-brand/5'}`}
                        >
                            <svg className={`w-6 h-6 transition-transform duration-500 ${isInWishlist ? 'fill-current scale-110' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-center text-[10px] uppercase tracking-widest text-gray-400 mb-12">
                        Available for immediate dispatch • 7 Days Return Policy
                    </p>


                    {/* Specifications */}
                    <div className="border-t border-luxury-gold/10 pt-10">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold mb-6">
                            Masterpiece Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Metal Type</span>
                                <span className="text-sm font-medium text-luxury-indigo">{specifications.metalType}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Purity</span>
                                <span className="text-sm font-medium text-luxury-indigo">{specifications.purity}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Gross Weight</span>
                                <span className="text-sm font-medium text-luxury-indigo">{specifications.grossWeight}g</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Net Weight</span>
                                <span className="text-sm font-medium text-luxury-indigo">{specifications.netWeight}g</span>
                            </div>
                            {specifications.stoneWeight > 0 && (
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">Diamond Weight</span>
                                    <span className="text-sm font-medium text-luxury-indigo">{specifications.stoneWeight} Carats</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <ReviewSection productId={id} />
        </div>
    );
};

export default ProductDetail;
