import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { toggleWishlist } from '../../features/wishlist/wishlistSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { _id, title, pricing, specifications, images } = product;

    const isInWishlist = wishlistItems.some(item => item._id === _id || item === _id);

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        dispatch(toggleWishlist(_id));
    };

    const mainImage = images && images.length > 0 ? images[0] : '/placeholder-jewellery.jpg';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group bg-white border border-luxury-gold-brand/10 rounded-[20px] overflow-hidden transition-all duration-700 hover:shadow-[0_30px_60px_rgba(198,161,74,0.12)]"
        >
            <Link to={`/products/${_id}`} className="block relative aspect-square overflow-hidden bg-luxury-marble/30">
                <motion.img
                    src={mainImage}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Wishlist Toggle Overlay */}
                <button
                    onClick={handleToggleWishlist}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-luxury-gold-brand/10 flex items-center justify-center text-luxury-charcoal hover:text-luxury-gold-brand transition-all duration-300 shadow-md group/wishlist"
                >
                    <svg
                        className={`w-4 h-4 transition-all duration-500 ${isInWishlist ? 'fill-luxury-gold-brand text-luxury-gold-brand' : 'fill-none'}`}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <div className="absolute inset-0 bg-luxury-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold-brand font-bold mb-1">
                            {specifications.purity} {specifications.metalType}
                        </span>
                        {specifications.stoneWeight > 0 && (
                            <span className="text-[9px] text-gray-400 tracking-wider">
                                {specifications.stoneWeight} Carats
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-inter">
                        {specifications.grossWeight}g
                    </span>
                </div>

                <h3 className="font-playfair text-xl text-luxury-charcoal mb-4 line-clamp-1 group-hover:text-luxury-gold-brand transition-colors duration-500">
                    {title}
                </h3>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-300 line-through tracking-widest font-bold">
                            ₹{(pricing.finalPrice * 1.15).toLocaleString('en-IN')}
                        </span>
                        <span className="font-inter font-bold text-luxury-indigo text-xl tracking-tight">
                            ₹{pricing.finalPrice?.toLocaleString('en-IN')}
                        </span>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(addToCart({
                                productId: _id,
                                quantity: 1,
                                selectedPurity: specifications.purity
                            }));
                        }}
                        className="p-3 border border-luxury-gold-brand/20 rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-500 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
