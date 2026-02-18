import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Settings2, Check } from 'lucide-react';

const TopFilterBar = ({
    categories,
    activeFilters,
    onFilterChange,
    onOpenDrawer,
    productsCount
}) => {
    const [activePopover, setActivePopover] = useState(null);
    const [isSticky, setIsSticky] = useState(false);
    const popoverRef = useRef(null);

    // Price Slider Internal State
    const minLimit = 0;
    const maxLimit = 500000;
    const [tempPrice, setTempPrice] = useState([
        parseInt(activeFilters.priceMin) || minLimit,
        parseInt(activeFilters.priceMax) || maxLimit
    ]);

    const sortOptions = [
        { label: 'Latest Arrivals', value: '-createdAt' },
        { label: 'Price: Low to High', value: 'pricing.finalPrice' },
        { label: 'Price: High to Low', value: '-pricing.finalPrice' },
        { label: 'Highest Rated', value: '-averageRating' }
    ];

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setActivePopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync temp price when filter changes externally (like reset)
    useEffect(() => {
        setTempPrice([
            parseInt(activeFilters.priceMin) || minLimit,
            parseInt(activeFilters.priceMax) || maxLimit
        ]);
    }, [activeFilters.priceMin, activeFilters.priceMax]);

    const togglePopover = (name) => {
        setActivePopover(activePopover === name ? null : name);
    };

    const handleApplyPrice = () => {
        onFilterChange('priceMin', tempPrice[0]);
        onFilterChange('priceMax', tempPrice[1]);
        setActivePopover(null);
    };

    // Sub-components for Popovers
    const PopoverWrapper = ({ children, name }) => (
        <AnimatePresence>
            {activePopover === name && (
                <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className="absolute top-full left-0 mt-5 z-50 bg-white border border-gray-100 shadow-[0_30px_70px_rgba(0,0,0,0.12)] rounded-3xl min-w-[280px] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-ivory/30 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className={`w-full transition-all duration-700 ${isSticky ? 'sticky top-0 md:top-24 z-40' : 'relative'}`}>
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <div className={`
                    bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl md:rounded-[24px] 
                    px-8 h-[72px] flex items-center justify-between shadow-[0_8px_40px_rgba(0,0,0,0.04)]
                    transition-all duration-700 ${isSticky ? 'shadow-[0_20px_50px_rgba(0,0,0,0.08)] scale-[1.01] -translate-y-2' : ''}
                `}>
                    <div className="flex items-center gap-2 md:gap-6 h-full">
                        {/* Collections */}
                        <div className="relative h-full flex items-center" ref={activePopover === 'collections' ? popoverRef : null}>
                            <button
                                onClick={() => togglePopover('collections')}
                                className="flex items-center gap-3 px-4 h-full group relative overflow-hidden"
                            >
                                <span className={`text-[12px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${activeFilters.category ? 'text-luxury-gold-brand' : 'text-gray-400'} group-hover:text-black`}>
                                    Collections
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activePopover === 'collections' ? 'rotate-180 text-black' : 'text-gray-300'}`} />
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-luxury-gold-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                            <PopoverWrapper name="collections">
                                <div className="py-3 max-h-[350px] overflow-y-auto custom-scrollbar">
                                    <button
                                        onClick={() => { onFilterChange('category', ''); setActivePopover(null); }}
                                        className={`w-full text-left px-8 py-4 text-[11px] uppercase tracking-widest flex items-center justify-between transition-all ${!activeFilters.category ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-luxury-ivory hover:text-black'}`}
                                    >
                                        The Complete Vault
                                        {!activeFilters.category && <Check className="w-3.5 h-3.5 text-luxury-gold-brand" />}
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => { onFilterChange('category', cat._id); setActivePopover(null); }}
                                            className={`w-full text-left px-8 py-4 text-[11px] uppercase tracking-widest flex items-center justify-between transition-all ${activeFilters.category === cat._id ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-luxury-ivory hover:text-black'}`}
                                        >
                                            {cat.name}
                                            {activeFilters.category === cat._id && <Check className="w-3.5 h-3.5 text-luxury-gold-brand" />}
                                        </button>
                                    ))}
                                </div>
                            </PopoverWrapper>
                        </div>

                        {/* Price */}
                        <div className="relative h-full flex items-center" ref={activePopover === 'val' ? popoverRef : null}>
                            <button
                                onClick={() => togglePopover('val')}
                                className="flex items-center gap-3 px-4 h-full group relative overflow-hidden"
                            >
                                <span className={`text-[12px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${(activeFilters.priceMin || activeFilters.priceMax) ? 'text-luxury-gold-brand' : 'text-gray-400'} group-hover:text-black`}>
                                    Valuation
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activePopover === 'val' ? 'rotate-180 text-black' : 'text-gray-300'}`} />
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-luxury-gold-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                            <PopoverWrapper name="val">
                                <div className="p-10 space-y-10 w-[360px]">
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-[10px] uppercase tracking-[0.4em] font-extrabold text-gray-400">Masterpiece Value</h4>
                                            <div className="text-[12px] font-bold text-luxury-gold-brand tracking-widest">
                                                ₹{tempPrice[0].toLocaleString()} — ₹{tempPrice[1].toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="px-1 relative py-4">
                                            <div className="relative h-1.5 w-full bg-luxury-beige/40 rounded-full">
                                                <div
                                                    className="absolute h-full bg-brand-gold-gradient rounded-full shadow-[0_0_15px_rgba(198,161,74,0.3)]"
                                                    style={{
                                                        left: `${(tempPrice[0] / maxLimit) * 100}%`,
                                                        right: `${100 - (tempPrice[1] / maxLimit) * 100}%`
                                                    }}
                                                />
                                                <input
                                                    type="range" min={minLimit} max={maxLimit} value={tempPrice[0]}
                                                    onChange={(e) => {
                                                        const val = Math.min(parseInt(e.target.value), tempPrice[1] - 10000);
                                                        setTempPrice([val, tempPrice[1]]);
                                                    }}
                                                    className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer z-30"
                                                />
                                                <input
                                                    type="range" min={minLimit} max={maxLimit} value={tempPrice[1]}
                                                    onChange={(e) => {
                                                        const val = Math.max(parseInt(e.target.value), tempPrice[0] + 10000);
                                                        setTempPrice([tempPrice[0], val]);
                                                    }}
                                                    className="absolute w-full -top-1.5 h-4 opacity-0 cursor-pointer z-30"
                                                />
                                                <div
                                                    className="absolute w-5 h-5 bg-white border-[3px] border-luxury-gold-brand rounded-full shadow-xl -top-1.5 -ml-2.5 pointer-events-none z-20 group-hover:scale-110 transition-transform"
                                                    style={{ left: `${(tempPrice[0] / maxLimit) * 100}%` }}
                                                />
                                                <div
                                                    className="absolute w-5 h-5 bg-white border-[3px] border-luxury-gold-brand rounded-full shadow-xl -top-1.5 -ml-2.5 pointer-events-none z-20 group-hover:scale-110 transition-transform"
                                                    style={{ left: `${(tempPrice[1] / maxLimit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => { setTempPrice([minLimit, maxLimit]); onFilterChange('priceMax', ''); setActivePopover(null); }}
                                            className="flex-1 py-4 border border-gray-100 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:bg-luxury-ivory transition-all uppercase"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleApplyPrice}
                                            className="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-black/20 hover:-translate-y-0.5 transition-all"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </PopoverWrapper>
                        </div>

                        {/* Sort */}
                        <div className="relative h-full flex items-center" ref={activePopover === 'sort' ? popoverRef : null}>
                            <button
                                onClick={() => togglePopover('sort')}
                                className="flex items-center gap-3 px-4 h-full group relative overflow-hidden"
                            >
                                <span className={`text-[12px] uppercase tracking-[0.25em] font-bold transition-colors duration-500 ${activeFilters.sort !== '-createdAt' ? 'text-luxury-gold-brand' : 'text-gray-400'} group-hover:text-black`}>
                                    Sort
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${activePopover === 'sort' ? 'rotate-180 text-black' : 'text-gray-300'}`} />
                                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-luxury-gold-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                            </button>
                            <PopoverWrapper name="sort">
                                <div className="py-3">
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { onFilterChange('sort', opt.value); setActivePopover(null); }}
                                            className={`w-full text-left px-8 py-4.5 text-[11px] uppercase tracking-widest transition-all duration-300 relative flex items-center justify-between ${activeFilters.sort === opt.value ? 'bg-luxury-gold-brand/5 text-luxury-gold-brand font-bold' : 'text-gray-500 hover:bg-luxury-ivory hover:text-black'}`}
                                        >
                                            {opt.label}
                                            {activeFilters.sort === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold-brand shadow-[0_0_10px_rgba(198,161,74,0.8)]" />}
                                        </button>
                                    ))}
                                </div>
                            </PopoverWrapper>
                        </div>

                        <div className="w-[1px] h-8 bg-gray-100/80 mx-2 hidden md:block" />

                        <button
                            onClick={onOpenDrawer}
                            className="flex items-center gap-3 px-4 h-[72px] group relative"
                        >
                            <Settings2 className="w-4 h-4 text-gray-400 group-hover:text-luxury-gold-brand transition-all duration-500 group-hover:rotate-90" />
                            <span className="text-[12px] uppercase tracking-[0.25em] font-bold text-gray-400 group-hover:text-black hidden md:inline transition-colors duration-500">
                                Filters
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col items-end">
                            <motion.div
                                key={productsCount}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-[14px] font-playfair italic text-luxury-gold-brand border-b border-luxury-gold-brand/20"
                            >
                                {productsCount} Found
                            </motion.div>
                            <span className="text-[8px] uppercase tracking-widest text-gray-300 font-bold mt-1">In The Vault</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopFilterBar;
