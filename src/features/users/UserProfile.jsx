import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { setCredentials } from '../auth/authSlice';

const UserProfile = () => {
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
        <div className="py-20 px-6 max-w-5xl mx-auto space-y-12">
            <header className="text-center border-b border-luxury-gold/20 pb-10">
                <span className="text-luxury-gold uppercase tracking-[0.3em] text-xs font-bold mb-3 block">
                    My Account
                </span>
                <h1 className="text-4xl md:text-5xl font-playfair text-luxury-charcoal">
                    Profile Settings
                </h1>
            </header>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-sm font-medium text-center ${message.type === 'success'
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
                    className="bg-white p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-luxury-gold/10"
                >
                    <h3 className="text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        Personal Identity
                    </h3>
                    <form onSubmit={handleDetailsSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={detailsForm.name}
                                onChange={handleDetailsChange}
                                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-luxury-gold hover:bg-gray-100 p-4 transition-all outline-none font-playfair"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={detailsForm.email}
                                onChange={handleDetailsChange}
                                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-luxury-gold hover:bg-gray-100 p-4 transition-all outline-none font-playfair"
                                required
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" isLoading={loading.details} className="w-full py-4 text-xs">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Security Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-luxury-gold/10"
                >
                    <h3 className="text-sm uppercase tracking-widest text-luxury-charcoal font-bold mb-8 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        Security Credentials
                    </h3>
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-luxury-gold hover:bg-gray-100 p-4 transition-all outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-luxury-gold hover:bg-gray-100 p-4 transition-all outline-none"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                className="w-full bg-gray-50 border-b-2 border-transparent focus:border-luxury-gold hover:bg-gray-100 p-4 transition-all outline-none"
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="pt-4">
                            <Button type="submit" variant="outline" isLoading={loading.password} className="w-full py-4 text-xs">
                                Update Password
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
