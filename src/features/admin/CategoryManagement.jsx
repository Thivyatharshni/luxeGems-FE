import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../products/productSlice';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManagement = () => {
    const dispatch = useDispatch();
    const { categories, isLoading } = useSelector((state) => state.products);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', slug: '' });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '', slug: category.slug });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', slug: '' });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('slug', formData.slug);
        if (imageFile) data.append('image', imageFile);

        if (editingCategory) {
            await dispatch(updateCategory({ id: editingCategory._id, formData: data }));
        } else {
            await dispatch(createCategory(data));
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this collection category? This may affect products linked to it.')) {
            dispatch(deleteCategory(id));
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-playfair text-luxury-charcoal">Collection Categories</h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Managing {categories.length} artistic themes</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="px-8">Define New Category</Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <div key={category._id} className="bg-white rounded-[2rem] border border-luxury-gold/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow group p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-luxury-marble rounded-2xl overflow-hidden border border-luxury-gold/10">
                                <img src={category.image || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal(category)} className="text-luxury-gold hover:opacity-70 p-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(category._id)} className="text-red-400 hover:opacity-70 p-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-playfair font-bold text-luxury-charcoal mb-2">{category.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold mb-4">{category.slug}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 italic">"{category.description || 'No description provided for this collection.'}"</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-luxury-indigo/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
                            <h2 className="text-2xl font-playfair mb-8">{editingCategory ? 'Refine Category' : 'Define Category'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Category Name" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none" required />
                                    <input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="URL Slug (e.g. bridal-sets)" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none" required />
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Collection Philosophy" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none min-h-[80px]" />
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-1">Cover Image</label>
                                        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" className="flex-1" isLoading={isLoading}>{editingCategory ? 'Update' : 'Create'}</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoryManagement;
