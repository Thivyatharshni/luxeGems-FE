import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../../features/products/productSlice';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to LuxeGems. I am your Curatorial Assistant. How may I guide you through our collection today?", sender: 'bot', timestamp: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const dispatch = useDispatch();
    const { items: products } = useSelector((state) => state.products);
    const messagesEndRef = useRef(null);

    // Ensure data is available even on landing page
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
            dispatch(fetchCategories());
        }
    }, [dispatch, products.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate bot thinking
        setTimeout(() => {
            generateResponse(inputValue);
        }, 1000);
    };

    const generateResponse = (text) => {
        const query = text.toLowerCase();
        let response = "";
        let suggestions = [];

        if (query.includes('gold') || query.includes('rate') || query.includes('price')) {
            response = "Our gold rates are updated daily based on global market standards. You can see the live valuation on any product page.";
            suggestions = products.slice(0, 2).map(p => ({ label: p.title, link: `/products/${p._id}` }));
        } else if (query.includes('order') || query.includes('delivery') || query.includes('status')) {
            response = "You can track your acquisitions in the 'Order History' section of your profile. Standard delivery takes 5-7 business days for bespoke items.";
            suggestions = [{ label: "View Orders", link: "/orders" }];
        } else if (query.includes('ring') || query.includes('necklace') || query.includes('earring') || query.includes('jewellery')) {
            response = "We have a magnificent collection of rings, necklaces, and earrings. Would you like to explore our full jewellery archive?";
            suggestions = [{ label: "Explore Jewellery", link: "/products" }];
        } else if (query.includes('login') || query.includes('account') || query.includes('sign in')) {
            response = "You can sign in to your private vault to manage your acquisitions and wishlist.";
            suggestions = [{ label: "Sign In", link: "/login" }];
        } else {
            response = "I am trained to assist with collection inquiries, order statuses, and gold valuation. Could you please specify your request?";
            suggestions = [{ label: "View All Products", link: "/products" }];
        }

        const botMessage = {
            id: Date.now() + 1,
            text: response,
            sender: 'bot',
            timestamp: new Date(),
            suggestions
        };

        setMessages(prev => [...prev, botMessage]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-[320px] sm:w-[380px] h-[500px] bg-white border border-luxury-gold-brand/20 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-luxury-indigo p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-luxury-gold-brand flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest">Luxe Assistant</h3>
                                    <p className="text-[10px] text-luxury-gold-brand/80 italic">Curatorial Guidance</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-luxury-ivory/30 custom-scrollbar">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${m.sender === 'user'
                                        ? 'bg-luxury-indigo text-white rounded-tr-none shadow-md'
                                        : 'bg-white border border-luxury-gold-brand/10 text-luxury-charcoal rounded-tl-none shadow-sm'
                                        }`}>
                                        {m.text}
                                        {m.suggestions && m.suggestions.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-luxury-gold-brand/5 flex flex-col gap-2">
                                                {m.suggestions.map((s, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={s.link}
                                                        onClick={() => setIsOpen(false)}
                                                        className="flex items-center justify-between gap-2 p-2 bg-luxury-ivory hover:bg-luxury-gold-brand/10 text-luxury-gold-brand rounded-lg transition-colors group"
                                                    >
                                                        <span className="font-bold">{s.label}</span>
                                                        <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-luxury-gold-brand/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Inquire about our collection..."
                                    className="w-full pl-4 pr-12 py-3 bg-luxury-ivory border border-luxury-gold-brand/10 rounded-full text-xs outline-none focus:border-luxury-gold-brand transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-luxury-gold-brand text-white flex items-center justify-center hover:bg-black transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-2 ${isOpen
                    ? 'bg-white border-luxury-gold-brand text-luxury-gold-brand'
                    : 'bg-luxury-indigo border-transparent text-luxury-gold-brand'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold-brand opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-luxury-gold-brand"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default Chatbot;
