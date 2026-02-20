import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { setCredentials } from './authSlice';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login...');
            const { data } = await api.post('/auth/login', formData);
            console.log('Login request successful:', data);

            // Store token in localStorage
            if (data.data.accessToken) {
                localStorage.setItem('token', data.data.accessToken);
                console.log('Token saved to localStorage');
            }

            dispatch(setCredentials(data.data.user));
            console.log('Credentials set in Redux');

            // Redirect logic
            if (redirectPath) {
                navigate(redirectPath);
            } else if (data.data.user.role === 'admin' || data.data.user.role === 'inventory_manager') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Sign In" subtitle="Welcome back to the world of fine jewellery.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                </Button>

                <div className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] pt-8">
                    <span className="opacity-60">Don't have an account?</span>{' '}
                    <Link to="/register" className="relative text-luxury-gold font-bold transition-all duration-300 hover:opacity-80 group/link">
                        Register
                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-luxury-gold transition-all duration-300 group-hover/link:w-full"></span>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
