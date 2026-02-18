import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const { _id, name, image, slug } = category;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative h-80 rounded-xl overflow-hidden shadow-sm"
        >
            <Link to={`/products?category=${_id}`} className="block h-full">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-indigo/80 via-luxury-indigo/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="block text-[10px] uppercase tracking-[0.4em] text-luxury-gold mb-2"
                    >
                        Exclusive Collection
                    </motion.span>
                    <h3 className="text-2xl font-playfair text-white tracking-wide">
                        {name}
                    </h3>

                    <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: '40%' }}
                        className="h-[1px] bg-luxury-gold mx-auto mt-4 transition-all duration-500"
                    />
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCard;
