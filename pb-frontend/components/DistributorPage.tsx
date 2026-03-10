import React, { useState } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { API_BASE_URL } from '../config';

interface DistributorPageProps {
    onHomeClick: () => void;
}

const DistributorPage: React.FC<DistributorPageProps> = ({ onHomeClick }) => {
    const [formData, setFormData] = useState({
        business_name: '',
        full_name: '',
        phone_number: '',
        city: '',
        email: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/distributor-applications/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSuccess(true);
                setFormData({
                    business_name: '',
                    full_name: '',
                    phone_number: '',
                    city: '',
                    email: '',
                });
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit application. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-background-light min-h-screen pt-10 pb-20 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white border-2 border-slate-900 rounded-3xl p-10 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-900 shadow-sm">
                        <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold uppercase text-slate-900 mb-4 font-bebas">Application Received!</h2>
                    <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                        Thank you for your interest in partnering with Pinobite. Our team will review your details and get back to you within 2-3 business days.
                    </p>
                    <button
                        onClick={onHomeClick}
                        className="w-full bg-primary text-white py-4 rounded-xl font-black uppercase tracking-widest hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-light min-h-screen pt-10 pb-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-10 relative z-10">
                <Breadcrumbs onHomeClick={onHomeClick} steps={[{ label: 'Become a Distributor' }]} />
            </div>

            {/* Decorative patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] z-0">
                <div className="font-handdrawn text-9xl absolute top-20 right-10 rotate-12">PARTNER</div>
                <div className="font-handdrawn text-9xl absolute top-1/2 left-20 -rotate-12">DISTRIBUTE</div>
                <div className="font-handdrawn text-9xl absolute bottom-20 right-1/3 rotate-45">GROW</div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 relative">
                    <h1 className="text-5xl md:text-8xl font-bold uppercase text-slate-900 tracking-normal leading-[0.85] mb-4 font-bebas flex flex-wrap items-center justify-center gap-x-4">
                        <span>Join the</span>
                        <img src="/logos/Pinobite-logo.png" alt="Pinobite Logo" className="h-[0.8em] md:h-[1.10em] w-auto inline-block relative -top-1 md:-top-4" />
                        <span>Family</span>
                    </h1>
                    <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
                        We're looking for passionate partners to help us bring premium, healthy snacks to every household. Fill out the form below to start your journey with us.
                    </p>
                </div>

                <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,138,69,0.1)] relative">
                    {/* Form Tag */}
                    <div className="absolute -top-6 -right-6 md:-right-10 transform rotate-6 border-2 border-slate-900 px-4 py-2 rounded bg-yellow-400 shadow-sm hidden sm:block">
                        <div className="flex items-center gap-1 text-slate-900 font-black text-xs uppercase tracking-widest">
                            Distributor Application
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">business</span>
                                    Your Business Name <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="business_name"
                                    value={formData.business_name}
                                    onChange={handleChange}
                                    placeholder="Enter your business name"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none font-bold text-slate-700 transition-all bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Your Full Name <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none font-bold text-slate-700 transition-all bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">call</span>
                                    Phone Number <span className="text-red-500 font-bold">*</span>
                                </label>
                                <input
                                    required
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none font-bold text-slate-700 transition-all bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">location_city</span>
                                    Your City Name
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city name"
                                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none font-bold text-slate-700 transition-all bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">mail</span>
                                Your Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-primary focus:ring-0 outline-none font-bold text-slate-700 transition-all bg-slate-50/50 placeholder:text-slate-300 placeholder:font-normal"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-shake">
                                <span className="material-symbols-outlined text-red-500">error</span>
                                <p className="text-sm font-bold text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-primary hover:shadow-[0_10px_20px_-10px_rgba(0,138,69,0.5)] transition-all flex items-center justify-center gap-3 relative overflow-hidden ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
                                        SUBMITTING...
                                    </>
                                ) : (
                                    <>
                                        SUBMIT APPLICATION
                                        <span className="material-symbols-outlined">send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-slate-400 text-sm font-medium">
                        By submitting this form, you agree to our Terms and Conditions. We'll never share your data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DistributorPage;
