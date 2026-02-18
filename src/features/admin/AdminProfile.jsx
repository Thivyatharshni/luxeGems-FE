import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { setCredentials } from '../auth/authSlice';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Form States
    const [detailsForm, setDetailsForm] = useState({
        name: '',
        email: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // UI States
    const [loading, setLoading] = useState({ details: false, password: false });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setDetailsForm({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleDetailsChange = (e) => {
        setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setLoading(prev => ({ ...prev, details: true }));
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/updatedetails', detailsForm);
            if (data.success) {
                dispatch(setCredentials({ ...user, ...data.data }));
                setMessage({ type: 'success', text: 'Profile details updated successfully.' });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile.'
            });
        } finally {
            setLoading(prev => ({ ...prev, details: false }));
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        setLoading(prev => ({ ...prev, password: true }));
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/updatepassword', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            if (data.success) {
                setMessage({ type: 'success', text: 'Password updated successfully.' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                // Update token if returned (handled by api interceptors usually, but payload might have it)
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update password.'
            });
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    return (
        <div className="space-y-12 max-w-5xl mx-auto">
            <header>
                <h1 className="text-3xl font-playfair text-luxury-charcoal">Admin Profile</h1>
                <p className="text-xs uppercase tracking-widest text-gray-400 mt-2">Manage your administrative credentials</p>
            </header>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Profile Details Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[2rem] border border-luxury-gold/10 shadow-sm"
                >
                    <h3 className="text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-8 border-b border-luxury-gold/10 pb-4">
                        Personal Details
                    </h3>
                    <form onSubmit={handleDetailsSubmit} className="space-y-8">
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={detailsForm.name}
                                onChange={handleDetailsChange}
                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={detailsForm.email}
                                onChange={handleDetailsChange}
                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                required
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" isLoading={loading.details} className="w-full">
                                Update Details
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Security Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-10 rounded-[2rem] border border-luxury-gold/10 shadow-sm"
                >
                    <h3 className="text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-8 border-b border-luxury-gold/10 pb-4">
                        Security
                    </h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-3">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-luxury-marble/30 border-b border-luxury-gold/20 p-3 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" variant="outline" isLoading={loading.password} className="w-full">
                                Update Password
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminProfile;
