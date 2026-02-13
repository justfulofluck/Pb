import React, { useState, useEffect } from 'react';
import { VisitorForm } from '../types';
import { API_BASE_URL } from '../config';

interface VisitorFormPageProps {
    formId: string;
    onHomeClick: () => void;
}

const VisitorFormPage: React.FC<VisitorFormPageProps> = ({ formId, onHomeClick }) => {
    const [form, setForm] = useState<VisitorForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        addressDetails: '',
        buyingSource: '',
        brandAwareness: '', // 'yes' or 'no'
        currentUsage: 'No', // 'No' or 'Yes - [Brand]'
        currentUsageBrand: '',
        flavorPreferences: [] as string[],
        reviewedProduct: '',
        reviewContent: '',
        marketingConsent: false
    });

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/visitor-forms/${formId}/`);
                if (response.ok) {
                    const data = await response.json();
                    setForm({
                        id: String(data.id),
                        title: data.title,
                        eventName: data.event_name,
                        status: data.status,
                        createdAt: data.created_at,
                        link: '',
                        submissions: []
                    });
                } else {
                    setError('Form not found or unavailable.');
                }
            } catch (err) {
                setError('Failed to load form. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    const handleFlavorChange = (flavor: string) => {
        setFormData(prev => {
            const newFlavors = prev.flavorPreferences.includes(flavor)
                ? prev.flavorPreferences.filter(f => f !== flavor)
                : [...prev.flavorPreferences, flavor];
            return { ...prev, flavorPreferences: newFlavors };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        if (formData.flavorPreferences.length === 0) {
            alert("Please select at least one flavor you would like to try.");
            return;
        }

        if (!formData.marketingConsent) {
            alert("You must agree to receive updates to proceed.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/visitor-submissions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form: form.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address_details: formData.addressDetails,
                    buying_source: formData.buyingSource,
                    brand_awareness: formData.brandAwareness === 'yes',
                    current_usage: formData.currentUsage === 'Yes' ? `Yes - ${formData.currentUsageBrand}` : 'No',
                    flavor_preferences: formData.flavorPreferences.join(', '),
                    reviewed_product: formData.reviewedProduct,
                    review_content: formData.reviewContent,
                    marketing_consent: formData.marketingConsent
                })
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert("Failed to submit. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !form) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
                    <h2 className="text-xl font-black uppercase text-slate-800 mb-2">Form Exempt</h2>
                    <p className="text-slate-500 mb-6">{error || 'This form is no longer accepting submissions.'}</p>
                    <button onClick={onHomeClick} className="px-6 py-2 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <span className="material-symbols-outlined text-3xl">check</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase text-slate-800 mb-2">You're In!</h2>
                    <p className="text-slate-500 mb-8">
                        Thank you for registering for <b>{form.eventName}</b>. We have received your details.
                    </p>
                    <button onClick={onHomeClick} className="w-full px-6 py-3 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-green-700 transition-colors">
                        Return to Site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-display">
            {/* Simple Header */}
            <header className="h-20 bg-white shadow-sm flex items-center justify-center">
                <span className="font-black text-2xl tracking-tighter text-slate-900">PINO<span className="text-primary">BITE</span></span>
            </header>

            <div className="max-w-xl mx-auto p-6 md:p-12">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-primary/10 opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">{form.eventName}</p>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight">{form.title}</h1>
                        </div>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Alex Johnson" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address <span className="text-red-500">*</span></label>
                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors" placeholder="alex@example.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number <span className="text-red-500">*</span></label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors" placeholder="+91 98765 43210" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">City, Pincode <span className="text-red-500">*</span></label>
                                <input required type="text" value={formData.addressDetails} onChange={e => setFormData({ ...formData, addressDetails: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Mumbai, 400001" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Where do you usually buy nutrition products? <span className="text-red-500">*</span></label>
                                <select required value={formData.buyingSource} onChange={e => setFormData({ ...formData, buyingSource: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors">
                                    <option value="">Select Option...</option>
                                    <option value="Amazon">Amazon</option>
                                    <option value="Flipkart">Flipkart</option>
                                    <option value="Local store">Local store</option>
                                    <option value="Brand website">Brand website</option>
                                    <option value="Gym trainer">Gym trainer</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Have you heard about Pinobite before? <span className="text-red-500">*</span></label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="brandAwareness" value="yes" checked={formData.brandAwareness === 'yes'} onChange={e => setFormData({ ...formData, brandAwareness: e.target.value })} className="w-5 h-5 text-primary focus:ring-primary" required />
                                        <span className="font-bold text-slate-700">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="brandAwareness" value="no" checked={formData.brandAwareness === 'no'} onChange={e => setFormData({ ...formData, brandAwareness: e.target.value })} className="w-5 h-5 text-primary focus:ring-primary" required />
                                        <span className="font-bold text-slate-700">No</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Do you currently consume peanut butter?</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="currentUsage" value="No" checked={formData.currentUsage === 'No'} onChange={e => setFormData({ ...formData, currentUsage: e.target.value })} className="w-5 h-5 text-primary focus:ring-primary" />
                                        <span className="font-bold text-slate-700">No</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="currentUsage" value="Yes" checked={formData.currentUsage === 'Yes'} onChange={e => setFormData({ ...formData, currentUsage: e.target.value })} className="w-5 h-5 text-primary focus:ring-primary" />
                                            <span className="font-bold text-slate-700">Yes – Daily</span>
                                        </label>
                                        {formData.currentUsage === 'Yes' && (
                                            <input type="text" placeholder="(Which brand?)" value={formData.currentUsageBrand} onChange={e => setFormData({ ...formData, currentUsageBrand: e.target.value })} className="px-3 py-1 rounded-lg border border-slate-200 text-sm font-bold w-full" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Which flavor would you like to try? <span className="text-red-500">*</span></label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Classic Creamy', 'Crunchy', 'Chocolate', 'Mango Chia', 'High Protein'].map(flavor => (
                                        <label key={flavor} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.flavorPreferences.includes(flavor)} onChange={() => handleFlavorChange(flavor)} className="w-5 h-5 text-primary rounded focus:ring-primary" />
                                            <span className="font-bold text-slate-700">{flavor}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
                                <h4 className="text-sm font-black uppercase text-slate-800">Review Product</h4>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Selection <span className="text-red-500">*</span></label>
                                    <select required value={formData.reviewedProduct} onChange={e => setFormData({ ...formData, reviewedProduct: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-white transition-colors">
                                        <option value="">Select Product...</option>
                                        <option value="Classic Creamy">Classic Creamy</option>
                                        <option value="Crunchy">Crunchy</option>
                                        <option value="Chocolate">Chocolate</option>
                                        <option value="Mango Chia">Mango Chia</option>
                                        <option value="High Protein">High Protein</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Review <span className="text-red-500">*</span></label>
                                    <textarea required value={formData.reviewContent} onChange={e => setFormData({ ...formData, reviewContent: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-white transition-colors" placeholder="Write your review..." />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.marketingConsent} onChange={e => setFormData({ ...formData, marketingConsent: e.target.checked })} className="w-5 h-5 text-primary rounded focus:ring-primary mt-1" required />
                                    <span className="text-sm font-bold text-slate-600">I agree to receive offers & updates from Pinobite on WhatsApp/SMS. <span className="text-red-500">*</span></span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || submitted}
                                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all ${(isSubmitting || submitted)
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-primary text-white hover:shadow-primary/30 hover:-translate-y-1'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm Registration'}
                            </button>

                            <p className="text-xs text-center text-slate-400 mt-4">
                                By registering, you agree to share your contact details with Pinobite Global for event coordination.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorFormPage;
