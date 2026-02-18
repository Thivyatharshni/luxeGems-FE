import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'gold', fullWidth = false, disabled = false, className = '' }) => {
    const baseStyles = "relative overflow-hidden px-8 py-3 rounded-sm transition-all duration-500 font-semibold uppercase tracking-[0.25em] text-[10px] disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-[0.98]";

    const shadowGold = "hover:shadow-[0_8px_30px_rgb(212,175,55,0.25)]";

    const variants = {
        gold: `bg-gradient-to-br from-luxury-gold to-luxury-gold-dark text-white hover:translate-y-[-2px] ${shadowGold}`,
        outline: `border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-white hover:translate-y-[-1px]`,
        ghost: `text-luxury-charcoal hover:bg-black/5`
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
