import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

const ProductFilters = ({
    categories,
    activeFilters,
    onFilterChange,
    onClearAll
}) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const sortDropdownRef = useRef(null);

    // Sort options
    const sortOptions = [
        { label: 'Latest Arrivals', value: '-createdAt' },
        { label: 'Price: Low to High', value: 'pricing.finalPrice' },
        { label: 'Price: High to Low', value: '-pricing.finalPrice' },
        { label: 'Highest Rated', value: '-averageRating' }
    ];

    // Sticky logic
    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 150);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Price Slider Logic
    const minPrice = 0;
    const maxPrice = 500000;
    const [priceRange, setPriceRange] = useState([
        parseInt(activeFilters.priceMin) || minPrice,
        parseInt(activeFilters.priceMax) || maxPrice
    ]);

    const handlePriceChange = (newRange) => {
        setPriceRange(newRange);
        onFilterChange('priceMin', newRange[0]);
        onFilterChange('priceMax', newRange[1]);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <aside className={`w-[280px] md:w-[320px] transition-all duration-700 ${isSticky ? 'sticky top-28 z-40' : ''}`}>
            <div className="bg-white/80 backdrop-blur-xl rounded-[30px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white/50 p-8 space-y-12 overflow-visible relative">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-ivory/20 to-transparent pointer-events-none rounded-[30px]" />

                {/* 1. SIDE CATEGORIES */}
                <div className="space-y-6">
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="flex items-center justify-between w-full group"
                    >
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                            Collections
                        </h3>
                        <motion.div animate={{ rotate: isCategoryOpen ? 0 : -90 }}>
                            <ChevronDown className="w-4 h-4 text-luxury-gold-brand" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2 pt-2 pb-1">
                                    <button
                                        onClick={() => onFilterChange('category', '')}
                                        className={`px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 border ${!activeFilters.category
                                                ? 'bg-black border-black text-white shadow-[0_5px_15px_rgba(0,0,0,0.2)]'
                                                : 'bg-luxury-ivory border-luxury-gold-brand/10 text-luxury-charcoal hover:border-luxury-gold-brand hover:bg-white hover:shadow-md'
                                            }`}
                                    >
                                        All Vault
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => onFilterChange('category', cat._id)}
                                            className={`px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 border ${activeFilters.category === cat._id
                                                    ? 'bg-black border-black text-white shadow-[0_5px_15px_rgba(0,0,0,0.2)]'
                                                    : 'bg-luxury-ivory border-luxury-gold-brand/10 text-luxury-charcoal hover:border-luxury-gold-brand hover:bg-white hover:shadow-md'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. PRICE RANGE */}
                <div className="space-y-6">
                    <button
                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                        className="flex items-center justify-between w-full group"
                    >
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                            Valuation
                        </h3>
                        <motion.div animate={{ rotate: isPriceOpen ? 0 : -90 }}>
                            <ChevronDown className="w-4 h-4 text-luxury-gold-brand" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {isPriceOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden space-y-8"
                            >
                                <div className="px-2 pt-6">
                                    <div className="relative h-1.5 w-full bg-luxury-beige/50 rounded-full mb-6">
                                        <div
                                            className="absolute h-full bg-brand-gold-gradient rounded-full shadow-[0_0_10px_rgba(198,161,74,0.3)]"
                                            style={{
                                                left: `${(priceRange[0] / maxPrice) * 100}%`,
                                                right: `${100 - (priceRange[1] / maxPrice) * 100}%`
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min={minPrice}
                                            max={maxPrice}
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const val = Math.min(parseInt(e.target.value), priceRange[1] - 1000);
                                                handlePriceChange([val, priceRange[1]]);
                                            }}
                                            className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer z-30"
                                        />
                                        <input
                                            type="range"
                                            min={minPrice}
                                            max={maxPrice}
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const val = Math.max(parseInt(e.target.value), priceRange[0] + 1000);
                                                handlePriceChange([priceRange[0], val]);
                                            }}
                                            className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer z-30"
                                        />

                                        <div
                                            className="absolute w-5 h-5 bg-white border-2 border-luxury-gold-brand rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] -top-1.5 -ml-2.5 pointer-events-none z-20"
                                            style={{ left: `${(priceRange[0] / maxPrice) * 100}%` }}
                                        />
                                        <div
                                            className="absolute w-5 h-5 bg-white border-2 border-luxury-gold-brand rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] -top-1.5 -ml-2.5 pointer-events-none z-20"
                                            style={{ left: `${(priceRange[1] / maxPrice) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-luxury-gold-brand">
                                        <span>₹{priceRange[0].toLocaleString()}</span>
                                        <span>—</span>
                                        <span>₹{priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. SORT BY CUSTOM DROPDOWN */}
                <div className="space-y-6 relative" ref={sortDropdownRef}>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 ml-1">
                        Arrange By
                    </h3>

                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-luxury-ivory border border-luxury-gold-brand/10 hover:border-luxury-gold-brand transition-all duration-300 group shadow-sm"
                    >
                        <span className="text-[11px] uppercase tracking-widest text-luxury-charcoal font-bold">
                            {sortOptions.find(opt => opt.value === activeFilters.sort)?.label || 'Latest Arrivals'}
                        </span>
                        <motion.div animate={{ rotate: isSortOpen ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4 text-luxury-gold-brand" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {isSortOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden py-2"
                            >
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            onFilterChange('sort', opt.value);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-6 py-4 text-[10px] uppercase tracking-widest transition-all duration-300 border-l-2 ${activeFilters.sort === opt.value
                                                ? 'bg-luxury-gold-brand/5 border-luxury-gold-brand text-luxury-gold-brand font-bold'
                                                : 'border-transparent text-gray-400 hover:bg-luxury-marble hover:text-luxury-charcoal hover:border-luxury-gold-brand/30'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{opt.label}</span>
                                            {activeFilters.sort === opt.value && (
                                                <div className="w-1 h-1 rounded-full bg-luxury-gold-brand shadow-[0_0_8px_rgba(198,161,74,0.6)]" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Reset Action */}
                <button
                    onClick={onClearAll}
                    className="w-full py-4 text-[9px] uppercase tracking-[0.4em] font-bold text-gray-300 hover:text-luxury-gold-brand border-t border-gray-50 transition-all pt-8 flex items-center justify-center gap-2 group"
                >
                    <X className="w-3 h-3 transition-transform group-hover:rotate-90" />
                    Reset Archives
                </button>
            </div>
        </aside>
    );
};

export default ProductFilters;
