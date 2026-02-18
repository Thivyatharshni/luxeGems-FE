import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchReviews, createReview, deleteReview } from './reviewSlice';
import Button from '../../components/ui/Button';

const ReviewSection = ({ productId }) => {
    const dispatch = useDispatch();
    const { items: reviews, isLoading, error } = useSelector((state) => state.reviews);
    const { user } = useSelector((state) => state.auth);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchReviews(productId));
    }, [dispatch, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(createReview({ product: productId, rating, comment })).unwrap();
            setComment('');
            setRating(5);
        } catch (err) {
            console.error('Review submission failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (reviewId) => {
        if (window.confirm('Are you sure you want to remove this feedback?')) {
            dispatch(deleteReview(reviewId));
        }
    };

    return (
        <section className="mt-24 pt-24 border-t border-luxury-gold/10">
            <div className="max-w-4xl">
                <header className="mb-12">
                    <h2 className="text-2xl font-playfair text-luxury-charcoal uppercase tracking-widest font-bold mb-4">Client Appreciations</h2>
                    <p className="text-gray-500 italic">Authentic reflections from the owners of our curated masterpieces.</p>
                </header>

                {/* Review Form */}
                {user ? (
                    <div className="mb-16 p-8 bg-luxury-gold/5 rounded-[2rem] border border-luxury-gold/10">
                        <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-bold mb-6">Leave Your Reflection</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex gap-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`transition-colors ${star <= rating ? 'text-luxury-gold' : 'text-gray-300'}`}
                                    >
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your experience with this masterpiece..."
                                className="w-full bg-white border border-luxury-gold/10 p-6 rounded-2xl text-sm focus:outline-none focus:border-luxury-gold min-h-[120px] shadow-inner"
                                required
                            />
                            <div className="flex justify-end">
                                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="px-12">Publish Review</Button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="mb-16 p-8 text-center bg-luxury-gold/5 rounded-[2rem] border border-luxury-gold/10 border-dashed">
                        <p className="text-gray-500 italic mb-4">You must be logged in to share your appreciation.</p>
                        <Button variant="outline" onClick={() => window.location.href = '/login'}>Authenticate to Comment</Button>
                    </div>
                )}

                {/* Reviews List */}
                <div className="space-y-10">
                    {reviews.length === 0 ? (
                        <p className="text-gray-400 italic">No appreciations yet. Be the first to share your experience.</p>
                    ) : (
                        reviews.map((review) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pb-10 border-b border-luxury-gold/5 group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-playfair font-bold text-luxury-charcoal uppercase tracking-widest text-sm">{review.user?.name}</span>
                                            {review.isVerifiedPurchase && (
                                                <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 bg-luxury-indigo/5 text-luxury-indigo rounded-full font-bold">Verified Owner</span>
                                            )}
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3 h-3 fill-current ${i < review.rating ? 'text-luxury-gold' : 'text-gray-200'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-gray-400 font-inter">{new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                        {(user?.id === review.user?._id || user?.role === 'admin') && (
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 italic leading-relaxed">"{review.comment}"</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
