import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fetchWishlist } from './wishlistSlice';
import ProductCard from '../../components/products/ProductCard';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const Wishlist = () => {
    const dispatch = useDispatch();
    const { items, isLoading } = useSelector((state) => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-48 bg-luxury-gold/10 rounded mb-4"></div>
                    <div className="h-4 w-64 bg-luxury-gold/5 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
            <header className="mb-16">
                <h1 className="text-4xl font-playfair text-luxury-charcoal uppercase tracking-widest font-bold mb-4">Your Curated Collection</h1>
                <p className="text-gray-500 italic max-w-2xl">A selection of your most desired masterpieces, reserved for your future acquisition.</p>
            </header>

            {items.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-luxury-gold/20 rounded-[3rem] bg-luxury-gold/5">
                    <h3 className="text-2xl font-playfair text-luxury-charcoal mb-4 uppercase tracking-widest font-bold">The Vault is Ready</h3>
                    <p className="text-gray-500 mb-10 max-w-md mx-auto">Explore our collections and mark the pieces that call to you. Your curated wishlist will appear here.</p>
                    <Link to="/products">
                        <Button variant="outline" className="px-12">Explore Collections</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((product) => (
                        <div key={product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
