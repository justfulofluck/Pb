import React, { useState, useEffect } from 'react';
import { VisitorForm } from '../types';

interface VisitorFormPageProps {
    formId: string;
    onHomeClick: () => void;
}

const VisitorFormPage: React.FC<VisitorFormPageProps> = ({ formId, onHomeClick }) => {
    const [form, setForm] = useState<VisitorForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/visitor-forms/${formId}/`);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form) return;

        try {
            const response = await fetch('http://localhost:8000/api/visitor-submissions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form: form.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
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
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="e.g. Alex Johnson"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="alex@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 focus:ring-primary focus:border-primary bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all"
                            >
                                Confirm Registration
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
