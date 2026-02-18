import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false, error = '' }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <div className="mb-5 group">
            {label && (
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 ml-0.5 group-focus-within:text-luxury-gold transition-colors duration-300">
                    {label} {required && <span className="text-luxury-gold/50 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`w-full bg-white/5 border-b-2 ${error ? 'border-red-400' : 'border-gray-100 group-focus-within:border-luxury-gold group-focus-within:drop-shadow-[0_4px_8px_rgba(212,175,55,0.12)]'} py-3 px-1 text-sm outline-none transition-all duration-500 placeholder:text-gray-300 placeholder:italic placeholder:font-light`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luxury-gold p-1.5 rounded-full hover:bg-luxury-gold/5 transition-all duration-300"
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                    </button>
                )}
            </div>
            {error && <p className="text-[10px] text-red-400 mt-2 uppercase tracking-widest font-medium ml-1">{error}</p>}
        </div>
    );
};

export default Input;
