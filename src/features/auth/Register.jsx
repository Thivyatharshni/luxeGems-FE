import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../layout/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { setCredentials } from './authSlice';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/register', formData);

            // Store token in localStorage
            if (data.data.accessToken) {
                localStorage.setItem('token', data.data.accessToken);
            }

            dispatch(setCredentials(data.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Enter the elite circle of LuxeGems.">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
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
                    {loading ? 'Creating Account...' : 'Register'}
                </Button>

                <div className="text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] pt-8">
                    <span className="opacity-60">Already have an account?</span>{' '}
                    <Link to="/login" className="relative text-luxury-gold font-bold transition-all duration-300 hover:opacity-80 group/link">
                        Sign In
                        <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-luxury-gold transition-all duration-300 group-hover/link:w-full"></span>
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
