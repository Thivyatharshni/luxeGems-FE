import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchCategories, fetchAdminProducts, restoreProduct } from '../products/productSlice';
import Button from '../../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ProductManagement = () => {
    const dispatch = useDispatch();
    const { items, categories, isLoading } = useSelector((state) => state.products);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '', sku: '', description: '', category: '',
        basePrice: 0, makingCharges: 0, tax: 3, discount: 0,
        metalType: 'Gold', purity: '22K', grossWeight: 0, netWeight: 0, stoneWeight: 0,
        stock: 0, isFeatured: false
    });
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        dispatch(fetchAdminProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title, sku: product.sku, description: product.description, category: product.category._id || product.category,
                basePrice: product.pricing.basePrice, makingCharges: product.pricing.makingCharges, tax: product.pricing.tax, discount: product.pricing.discount,
                metalType: product.specifications.metalType, purity: product.specifications.purity, grossWeight: product.specifications.grossWeight,
                netWeight: product.specifications.netWeight, stoneWeight: product.specifications.stoneWeight,
                stock: product.stock, isFeatured: product.isFeatured
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: '', sku: '', description: '', category: categories[0]?._id || '',
                basePrice: 0, makingCharges: 0, tax: 3, discount: 0,
                metalType: 'Gold', purity: '22K', grossWeight: 0, netWeight: 0, stoneWeight: 0,
                stock: 0, isFeatured: false
            });
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        setImageFiles([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        imageFiles.forEach(file => data.append('images', file));

        if (editingProduct) {
            await dispatch(updateProduct({ id: editingProduct._id, formData: data }));
        } else {
            await dispatch(createProduct(data));
        }
        dispatch(fetchAdminProducts());
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this masterpiece from the vault?')) {
            await dispatch(deleteProduct(id));
            dispatch(fetchAdminProducts());
        }
    };

    const handleRestore = async (id) => {
        if (window.confirm('Restore this masterpiece to the active vault?')) {
            await dispatch(restoreProduct(id));
            dispatch(fetchAdminProducts());
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-playfair text-luxury-charcoal">Inventory Registry</h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Managing {items.length} curated masterpieces</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="px-8">Register New Item</Button>
            </header>

            <div className="bg-white rounded-[2rem] border border-luxury-gold/10 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-luxury-marble/20 border-b border-luxury-gold/5">
                        <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                            <th className="px-8 py-6">Masterpiece</th>
                            <th className="px-8 py-6">SKU</th>
                            <th className="px-8 py-6">Category</th>
                            <th className="px-8 py-6">Stock</th>
                            <th className="px-8 py-6">Current Valuation</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-gold/5">
                        {items.map((product) => (
                            <tr key={product._id} className="hover:bg-luxury-marble/5 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-luxury-marble rounded overflow-hidden border border-luxury-gold/10">
                                            <img src={product.images[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-playfair font-bold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">{product.title}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-400">{product.specifications.purity} {product.specifications.metalType}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 font-inter text-xs text-luxury-indigo font-bold">{product.sku}</td>
                                <td className="px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-gray-500">{product.category?.name || 'Uncategorized'}</td>
                                <td className="px-8 py-6 font-medium text-xs">
                                    <span className={product.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-600'}>{product.stock} Units</span>
                                </td>
                                <td className="px-8 py-6 font-inter font-bold text-xs text-luxury-indigo">₹{product.pricing.finalPrice?.toLocaleString('en-IN')}</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-4">
                                        {product.isDeleted ? (
                                            <button onClick={() => handleRestore(product._id)} className="text-green-500 hover:opacity-70 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                Restore
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => handleOpenModal(product)} className="text-luxury-gold hover:opacity-70">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="text-red-400 hover:opacity-70">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-12">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-luxury-indigo/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-12 lg:p-16 shadow-2xl"
                        >
                            <h2 className="text-3xl font-playfair mb-8">{editingProduct ? 'Update Masterpiece' : 'Register New Masterpiece'}</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Base Particulars</h3>
                                        <div className="space-y-4">
                                            <input name="title" value={formData.title} onChange={handleFormChange} placeholder="Masterpiece Title" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold" required />
                                            <input name="sku" value={formData.sku} onChange={handleFormChange} placeholder="SKU Identification" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold" required />
                                            <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Artistic Narrative" className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold min-h-[100px]" required />
                                            <select name="category" value={formData.category} onChange={handleFormChange} className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold" required>
                                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Valuation Components</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Base Price (Fixed)</label>
                                                <input type="number" name="basePrice" value={formData.basePrice} onChange={handleFormChange} className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Making Charges</label>
                                                <input type="number" name="makingCharges" value={formData.makingCharges} onChange={handleFormChange} className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Artisanship Specs</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select name="metalType" value={formData.metalType} onChange={handleFormChange} className="bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm">
                                                <option>Gold</option><option>Silver</option><option>Platinum</option><option>Rose Gold</option>
                                            </select>
                                            <select name="purity" value={formData.purity} onChange={handleFormChange} className="bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm">
                                                <option>22K</option><option>18K</option><option>14K</option><option>925</option><option>950</option>
                                            </select>
                                            <input type="number" step="0.01" name="netWeight" value={formData.netWeight} onChange={handleFormChange} placeholder="Net Weight (g)" className="bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm" />
                                            <input type="number" step="0.01" name="grossWeight" value={formData.grossWeight} onChange={handleFormChange} placeholder="Gross Weight (g)" className="bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Visual Assets & Stock</h3>
                                        <input type="file" multiple onChange={handleFileChange} className="w-full text-[10px] uppercase tracking-widest" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="Vault Stock" className="bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm" />
                                            <label className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 cursor-pointer">
                                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleFormChange} />
                                                Featured Masterpiece
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex gap-4">
                                        <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                        <Button type="submit" className="flex-1" isLoading={isLoading}>{editingProduct ? 'Preserve Changes' : 'Acquire to Vault'}</Button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductManagement;
