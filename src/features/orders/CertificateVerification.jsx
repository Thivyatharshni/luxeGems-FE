import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { verifyCertificateAction, clearVerificationResult } from './orderSlice';
import Button from '../../components/ui/Button';

const CertificateVerification = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { verificationResult, isLoading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (id) {
            dispatch(verifyCertificateAction(id));
        }
        return () => dispatch(clearVerificationResult());
    }, [dispatch, id]);

    if (!id) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                <div className="w-20 h-20 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-luxury-gold/10">
                    <svg className="w-10 h-10 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest text-shadow-sm">Registry Access</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">Please use the unique digital identifier provided with your acquisition to verify its curatorial standard.</p>
                <Link to="/products">
                    <Button variant="outline" className="px-12">Browse Vault</Button>
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-32 text-center">
                <p className="font-playfair italic text-luxury-gold animate-pulse">Consulting the digital vault...</p>
            </div>
        );
    }

    if (error || !verificationResult) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-32 text-center bg-red-50/30 rounded-3xl border border-red-100 mb-20">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-playfair mb-6 text-luxury-charcoal uppercase tracking-widest">Verification Failed</h2>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">{error || 'The certificate identifier provided is invalid or has been revoked.'}</p>
                <Link to="/">
                    <Button variant="outline" className="px-12">Return to Safety</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-white border border-luxury-gold/20 rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(212,175,55,0.08)]"
            >
                {/* Certificate Header */}
                <div className="bg-luxury-indigo text-white p-12 lg:p-16 text-center relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <h1 className="text-luxury-gold text-xs uppercase tracking-[0.5em] font-bold">LuxeGems Digital Vault</h1>
                        <h2 className="text-4xl lg:text-5xl font-playfair leading-tight">Certificate of Authenticity</h2>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-luxury-gold/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="p-12 lg:p-20 relative">
                    {/* Verified Seal */}
                    <div className="absolute top-0 right-12 lg:right-20 -translate-y-1/2 z-20">
                        <div className="w-24 h-24 bg-white rounded-full p-1 border-4 border-luxury-indigo shadow-xl flex items-center justify-center italic text-luxury-gold font-playfair font-bold text-[10px] leading-tight text-center relative">
                            <div className="absolute inset-2 border border-luxury-gold/20 rounded-full" />
                            VERIFIED<br />AUTHENTIC
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Section: Acquisition Details */}
                        <div className="space-y-12">
                            <div>
                                <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold mb-6 italic">Masterpiece Particulars</h3>
                                <div className="space-y-8">
                                    {verificationResult.items.map((item, idx) => (
                                        <div key={idx} className="space-y-4 pb-8 border-b border-luxury-gold/5 last:border-0">
                                            <p className="font-playfair text-2xl text-luxury-charcoal">{item.name}</p>
                                            <div className="grid grid-cols-2 gap-6 text-[10px] uppercase tracking-widest font-bold">
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Metal Composition</span>
                                                    <span className="text-luxury-indigo">{item.metal}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Metal Purity</span>
                                                    <span className="text-luxury-indigo">{item.purity}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Certified Weight</span>
                                                    <span className="text-luxury-indigo">{item.weight}g</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400 block mb-1">Origin</span>
                                                    <span className="text-luxury-indigo tracking-normal">Direct From Vault</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: Official Verification */}
                        <div className="space-y-12 flex flex-col justify-between">
                            <div className="space-y-8 p-8 bg-luxury-marble/20 rounded-2xl border border-luxury-gold/5">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Registry Identifier</h4>
                                    <p className="font-inter font-bold text-sm text-luxury-indigo tracking-wider">#{verificationResult.certificateId?.toUpperCase()}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Date of Validation</h4>
                                    <p className="font-medium text-luxury-charcoal">
                                        {new Date(verificationResult.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-luxury-gold/10">
                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed italic">
                                        This document serves as definitive evidence that the items specified herein have undergone rigorous
                                        quality control and meet the precision standards of LuxeGems curation.
                                    </p>
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <div className="w-16 h-1 border-t-2 border-luxury-gold mx-auto" />
                                <p className="text-[10px] uppercase tracking-[0.4em] text-luxury-charcoal font-bold">CURATORIAL SEAL</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-luxury-marble/30 p-8 text-center border-t border-luxury-gold/5">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-medium">Verify another collection masterpiece</p>
                    <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                        <Link to="/" className="text-luxury-gold hover:opacity-70 transition-opacity">Private Collection</Link>
                        <span className="text-gray-200">|</span>
                        <Link to="/products" className="text-luxury-gold hover:opacity-70 transition-opacity">Current Acquisitions</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CertificateVerification;
