
import React, { useState } from 'react';
import { Review } from '../../types';
import { API_BASE_URL } from '../../config';
import { triggerRewardNotification } from '../RewardNotification';

interface SnaxxoAddReviewProps {
    productId: string;
    onAddReview: (review: Review) => void;
    color?: string;
    isLoggedIn?: boolean;
    onLoginClick?: () => void;
}

const SnaxxoAddReview: React.FC<SnaxxoAddReviewProps> = ({ productId, onAddReview, color, isLoggedIn, onLoginClick }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_BASE_URL}/api/reviews/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product: productId,
                    user_name: name,
                    user_role: 'Verified Customer',
                    rating: rating,
                    comment: comment,
                    date: new Date().toLocaleDateString(),
                    avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
                })
            });

            if (response.ok) {
                const data = await response.json();

                const newReview: Review = {
                    id: String(data.id),
                    productId: data.product,
                    userName: data.user_name,
                    userRole: data.user_role,
                    rating: data.rating,
                    comment: data.comment,
                    date: data.date,
                    avatar: data.avatar
                };

                onAddReview(newReview);
                setShowSuccess(true);
                setName('');
                setComment('');
                setRating(5);

                // Trigger reward notification if points were earned
                if (data.points_earned > 0) {
                    triggerRewardNotification(data.points_earned, "High-Quality Product Review");
                }

                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                console.error("Failed to submit review");
                alert("Could not post review. Please check your connection.");
            }
        } catch (err) {
            console.error("Review error:", err);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="section py-20 bg-[#f2f2ec]">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                    {showSuccess && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                            <div className="w-16 h-16 bg-[#008a45] rounded-full flex items-center justify-center text-white mb-4">
                                <span className="material-symbols-outlined text-3xl">check</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase text-slate-900">Thank you!</h3>
                            <p className="text-slate-500 font-bold">Your review has been submitted successfully.</p>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase leading-[0.9] mb-2 font-anton">
                                Share Your <br /> Experience
                            </h2>
                            <p className="text-slate-500 font-bold">We'd love to hear what you think of our snacks!</p>
                        </div>
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="material-symbols-outlined text-4xl fill-1">star</span>
                            ))}
                        </div>
                    </div>

                    {!isLoggedIn ? (
                        <div className="bg-slate-50 rounded-2xl p-10 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                <span className="material-symbols-outlined text-slate-400 text-3xl">lock</span>
                            </div>
                            <h3 className="text-xl font-black uppercase text-slate-900 mb-2">Login to Review</h3>
                            <p className="text-slate-500 font-bold mb-6 max-w-xs">Only verified customers can submit their experience with this product.</p>
                            <button
                                onClick={onLoginClick}
                                className="px-10 py-4 bg-slate-950 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                Login / Register
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:border-[#008a45] focus:outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Rating</label>
                                    <div className="flex gap-2 h-[58px] items-center">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`material-symbols-outlined text-4xl transition-all hover:scale-110 ${star <= rating ? 'text-yellow-400 fill-1' : 'text-slate-200'}`}
                                            >
                                                star
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Your Review</label>
                                <textarea
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-800 focus:bg-white focus:border-[#008a45] focus:outline-none transition-all resize-none"
                                    placeholder="What's the verdict? Be honest!"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{ backgroundColor: color || '#008a45' }}
                                className={`w-full md:w-auto px-12 py-5 rounded-2xl text-white font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Post My Review'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SnaxxoAddReview;
