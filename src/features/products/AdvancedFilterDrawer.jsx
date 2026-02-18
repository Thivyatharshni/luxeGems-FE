import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';

const AdvancedFilterDrawer = ({
    isOpen,
    onClose,
    activeFilters,
    onFilterChange,
    onClearAll
}) => {
    const filterSections = [
        {
            id: 'metalType',
            label: 'Metal Type',
            options: ['Gold', 'Silver', 'Platinum', 'Rose Gold']
        },
        {
            id: 'purity',
            label: 'Purity',
            options: ['14K', '18K', '22K', '24K', '925', '950']
        },
        {
            id: 'stoneType',
            label: 'Stone Type',
            options: ['Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Pearl', 'None']
        },
        {
            id: 'weightRange',
            label: 'Weight (Grams)',
            options: ['0-5g', '5-10g', '10-20g', '20g+']
        },
        {
            id: 'availability',
            label: 'Availability',
            options: ['In Stock', 'Made to Order']
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[101] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 h-20 border-b border-gray-100">
                            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-luxury-charcoal">
                                Advanced Filters
                            </h2>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={onClearAll}
                                    className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-luxury-gold-brand font-bold flex items-center gap-1 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Reset
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-grow overflow-y-auto px-8 py-10 space-y-12 custom-scrollbar">
                            {filterSections.map((section) => (
                                <div key={section.id} className="space-y-6">
                                    <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-luxury-gold-brand">
                                        {section.label}
                                    </h3>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {section.options.map((opt) => {
                                            const isActive = activeFilters[section.id] === opt;
                                            return (
                                                <button
                                                    key={opt}
                                                    onClick={() => onFilterChange(section.id, isActive ? '' : opt)}
                                                    className={`px-4 py-3.5 rounded-xl text-[10px] uppercase tracking-widest text-left transition-all duration-300 border ${isActive
                                                        ? 'bg-black border-black text-white shadow-lg'
                                                        : 'bg-luxury-ivory border-luxury-gold-brand/10 text-gray-500 hover:border-luxury-gold-brand/40 hover:bg-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{opt}</span>
                                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold-brand shadow-[0_0_8px_rgba(198,161,74,0.6)]" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-black text-white rounded-2xl text-[11px] uppercase tracking-[0.3em] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-black/20 transition-all duration-500 hover:-translate-y-0.5"
                            >
                                Show Refined Collection
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AdvancedFilterDrawer;
