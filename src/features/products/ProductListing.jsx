import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { fetchProducts, fetchCategories } from './productSlice';
import ProductCard from '../../components/products/ProductCard';
import TopFilterBar from './TopFilterBar';
import AdvancedFilterDrawer from './AdvancedFilterDrawer';

const ProductListing = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { items, categories, isLoading } = useSelector((state) => state.products);
    const products = items || [];

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Initialize filters from URL
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
        sort: searchParams.get('sort') || '-createdAt',
        metalType: searchParams.get('metalType') || '',
        purity: searchParams.get('purity') || '',
        availability: searchParams.get('availability') || ''
    });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const queryParams = { ...filters };
        // Remove empty values
        Object.keys(queryParams).forEach(key => !queryParams[key] && delete queryParams[key]);

        const handler = setTimeout(() => {
            dispatch(fetchProducts(queryParams));
        }, 300);

        setSearchParams(queryParams);
        return () => clearTimeout(handler);
    }, [dispatch, filters, setSearchParams]);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const clearFilter = (name) => {
        if (name === 'price') {
            setFilters(prev => ({ ...prev, priceMin: '', priceMax: '' }));
        } else {
            setFilters(prev => ({ ...prev, [name]: '' }));
        }
    };

    const clearAllFilters = () => {
        setFilters({
            category: '',
            priceMin: '',
            priceMax: '',
            sort: '-createdAt',
            metalType: '',
            purity: '',
            availability: ''
        });
    };

    const activeFilterTags = useMemo(() => {
        const tags = [];
        if (filters.category) {
            const cat = categories.find(c => c._id === filters.category);
            tags.push({ id: 'category', label: cat ? cat.name : 'Category' });
        }
        if (filters.priceMin || filters.priceMax) {
            const min = filters.priceMin || '0';
            const max = filters.priceMax || '5L+';
            tags.push({ id: 'price', label: `₹${min} — ₹${max}` });
        }
        if (filters.sort && filters.sort !== '-createdAt') {
            const sortLabel = {
                'pricing.finalPrice': 'Price: Low to High',
                '-pricing.finalPrice': 'Price: High to Low',
                '-averageRating': 'Highest Rated'
            }[filters.sort] || 'Sorted';
            tags.push({ id: 'sort', label: sortLabel });
        }
        if (filters.metalType) tags.push({ id: 'metalType', label: filters.metalType });
        if (filters.purity) tags.push({ id: 'purity', label: filters.purity });
        if (filters.availability) tags.push({ id: 'availability', label: filters.availability });

        return tags;
    }, [filters, categories]);

    return (
        <div className="bg-white min-h-screen">
            {/* Header / Hero Section */}
            <div className="pt-12 pb-16 text-center space-y-4">
                <span className="text-luxury-gold-brand uppercase tracking-[0.6em] text-[10px] font-bold block opacity-70">
                    The Luxe Archives
                </span>
                <h1 className="text-5xl md:text-7xl font-playfair text-luxury-charcoal leading-tight">
                    Timeless Jewellery
                </h1>
                <p className="max-w-2xl mx-auto text-gray-400 text-sm font-light italic px-6">
                    Discover a curated selection of refined masterpieces, each telling a story of eternal elegance and craftsmanship.
                </p>
            </div>

            {/* Top Filter Bar Component */}
            <TopFilterBar
                categories={categories}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onOpenDrawer={() => setIsDrawerOpen(true)}
                productsCount={products?.length || 0}
            />

            <div className="container-luxury py-10 lg:py-16">
                {/* Active Filter Pills */}
                <AnimatePresence mode="popLayout">
                    {activeFilterTags.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-gray-50"
                        >
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mr-2 opacity-60">Filtered By:</span>
                            {activeFilterTags.map(tag => (
                                <motion.button
                                    layout
                                    key={tag.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    onClick={() => clearFilter(tag.id)}
                                    className="group flex items-center gap-2 px-5 py-2.5 bg-luxury-ivory border border-luxury-gold-brand/10 rounded-full text-[10px] uppercase tracking-widest text-luxury-gold-brand hover:bg-black hover:text-white hover:border-black transition-all duration-300 shadow-sm"
                                >
                                    {tag.label}
                                    <X className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-90" />
                                </motion.button>
                            ))}
                            <button
                                onClick={clearAllFilters}
                                className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black font-bold ml-4 border-b border-gray-200 hover:border-black transition-colors"
                            >
                                Clear All
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Product Grid - Full Width */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-10 lg:gap-y-16">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="aspect-[3/4] bg-luxury-ivory rounded-[20px] overflow-hidden relative">
                                        <motion.div
                                            animate={{ x: ['-100%', '100%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent z-10"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                                            <div className="h-4 w-1/3 bg-luxury-beige/30 rounded" />
                                            <div className="h-6 w-3/4 bg-luxury-beige/30 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                key={`grid-${activeFilterTags.length}-${filters.sort}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 lg:gap-x-8 gap-y-10 lg:gap-y-16"
                            >
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductCard key={product._id} product={product} />
                                    ))
                                ) : (
                                    <div className="col-span-full py-40 text-center bg-luxury-ivory/30 rounded-[40px] border border-dashed border-luxury-gold-brand/20">
                                        <p className="text-gray-400 font-playfair text-3xl italic mb-6">
                                            No masterpieces found in our current archives.
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="px-8 py-4 bg-white border border-luxury-gold-brand/20 text-luxury-gold-brand uppercase tracking-[0.2em] text-[10px] font-bold rounded-full hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                                        >
                                            View Complete Collection
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Advanced Filters Drawer */}
            <AdvancedFilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                activeFilters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
            />
        </div>
    );
};

export default ProductListing;
