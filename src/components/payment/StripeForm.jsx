import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../ui/Button';

const StripeForm = ({ amount, onPaymentSuccess, onPaymentError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        // In a real production app, we would create a payment intent on the server first
        // and then confirm it here. For this integration, we'll simulate the successful
        // confirmation of an intent since we're using a test environment.

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            onPaymentError(error.message);
            setIsProcessing(false);
        } else {
            // Simulated delay for "Luxury Clearing"
            setTimeout(() => {
                onPaymentSuccess(paymentMethod.id);
                setIsProcessing(false);
            }, 2000);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#1a1a1a',
                fontFamily: 'Inter, sans-serif',
                '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 border border-luxury-gold/20 rounded-2xl bg-white shadow-inner">
                <CardElement options={cardElementOptions} />
            </div>
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                isLoading={isProcessing}
                className="w-full py-5"
            >
                Authorize Payment of ₹{amount.toLocaleString('en-IN')}
            </Button>
            <p className="text-[10px] text-center uppercase tracking-widest text-gray-400">
                End-to-End Encrypted via Stripe Gold standard
            </p>
        </form>
    );
};

export default StripeForm;
