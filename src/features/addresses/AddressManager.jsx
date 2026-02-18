import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    fetchAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress
} from './addressSlice';
import Button from '../../components/ui/Button';

const AddressManager = ({ onSelect, selectable = true, activeId }) => {
    const dispatch = useDispatch();
    const { items, isLoading } = useSelector((state) => state.addresses);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        phone: '',
        isDefault: false
    });

    useEffect(() => {
        dispatch(fetchAddresses());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(addAddress(formData));
        if (!result.error) {
            setIsAdding(false);
            setFormData({
                type: 'Home',
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: 'India',
                phone: '',
                isDefault: false
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-charcoal font-bold">
                    Delivery Destination
                </h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold hover:opacity-70 transition-opacity"
                    >
                        + Add New Vault
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isAdding ? (
                    <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="p-8 bg-luxury-marble/30 border border-luxury-gold/10 rounded-xl space-y-6"
                    >
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                                <input
                                    name="street"
                                    required
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                    placeholder="House No, Building, Area"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">City</label>
                                <input
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">State</label>
                                <input
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Zip Code</label>
                                <input
                                    name="zipCode"
                                    required
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2">Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-luxury-gold/10 px-4 py-3 text-sm focus:border-luxury-gold outline-none rounded-lg"
                                >
                                    <option>Home</option>
                                    <option>Work</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="accent-luxury-gold"
                                />
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Set as Default</span>
                            </label>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button type="submit" className="flex-grow">Save Address</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAdding(false)}
                            >Cancel</Button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {items.map((address) => (
                            <div
                                key={address._id}
                                onClick={() => selectable && onSelect(address)}
                                className={`relative p-6 rounded-xl border transition-all cursor-pointer ${activeId === address._id
                                        ? 'border-luxury-gold bg-luxury-gold/5 shadow-[0_10px_30px_rgba(212,175,55,0.1)]'
                                        : 'border-luxury-gold/10 bg-white hover:border-luxury-gold/30'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] uppercase tracking-widest bg-luxury-marble px-2 py-1 rounded font-bold text-luxury-gold">
                                        {address.type}
                                    </span>
                                    {address.isDefault && (
                                        <span className="text-[9px] uppercase tracking-widest text-gray-400 italic">Default</span>
                                    )}
                                </div>
                                <p className="text-sm text-luxury-charcoal font-medium mb-1">{address.street}</p>
                                <p className="text-xs text-gray-500 mb-4">
                                    {address.city}, {address.state} - {address.zipCode}
                                </p>
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-gray-400">
                                    <span>{address.phone}</span>
                                    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => dispatch(setDefaultAddress(address._id))}
                                                className="hover:text-luxury-gold transition-colors"
                                            >Set Default</button>
                                        )}
                                        <button
                                            onClick={() => dispatch(deleteAddress(address._id))}
                                            className="hover:text-red-400 transition-colors"
                                        >Remove</button>
                                    </div>
                                </div>
                                {activeId === address._id && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-gold rounded-full flex items-center justify-center text-white"
                                    >
                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {items.length === 0 && !isAdding && (
                <div className="py-12 text-center border-2 border-dashed border-luxury-gold/10 rounded-xl bg-luxury-marble/20">
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Exclusive delivery awaits your primary vault address</p>
                    <Button variant="outline" onClick={() => setIsAdding(true)}>Initialize Delivery Vault</Button>
                </div>
            )}
        </div>
    );
};

export default AddressManager;
