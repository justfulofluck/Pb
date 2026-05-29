import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import 'survey-core/survey-core.min.css';
import { API_BASE_URL } from '../config';

const surveyFormStyles = `
@media (max-width: 640px) {
  .sd-body { padding: 0 8px !important; }
  .sd-page { padding: 12px 0 !important; }
  .sd-question { padding: 8px 0 !important; }
  .sd-question__title { font-size: 14px !important; }
  .sd-title { font-size: 18px !important; }
  .sd-description { font-size: 13px !important; }
  .sd-input, .sd-select, .sd-dropdown, .sd-textarea { font-size: 16px !important; padding: 12px 14px !important; }
  .sd-btn { padding: 14px 20px !important; font-size: 14px !important; min-height: 48px !important; width: 100% !important; }
  .sd-navigation { flex-direction: column !important; gap: 8px !important; }
  .sd-progress { height: 6px !important; }
  .sd-progress__text { font-size: 11px !important; }
  .sd-radio, .sd-checkbox { font-size: 15px !important; }
  .sd-custom-html-card { padding: 16px !important; margin-bottom: 16px !important; }
  .sd-custom-html-card h3 { font-size: 17px !important; }
  .sd-custom-html-card p, .sd-custom-html-card li { font-size: 13px !important; }
}
@media (max-width: 380px) {
  .sd-question__title { font-size: 13px !important; }
  .sd-input, .sd-select, .sd-dropdown, .sd-textarea { padding: 10px 12px !important; }
}
`;

interface VisitorFormPageProps {
    formId: string;
    onHomeClick: () => void;
}

type Step = 'email' | 'otp' | 'form' | 'submitted';

const VisitorFormPage: React.FC<VisitorFormPageProps> = ({ formId, onHomeClick }) => {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [stepError, setStepError] = useState<string | null>(null);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [survey, setSurvey] = useState<Model | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [formMeta, setFormMeta] = useState<{ title: string; event_name: string } | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const formDataRef = useRef<any>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/visitor-forms/${formId}/`);
                if (!res.ok) { setError('Form not found or unavailable.'); return; }
                const data = await res.json();
                formDataRef.current = data;
                setFormMeta({ title: data.title, event_name: data.event_name });
                const schema = data.form_schema;
                const hasElements = schema?.elements?.length > 0 || schema?.pages?.some((p: any) => p.elements?.length > 0);
                if (!schema || !hasElements) { setError('This form has no fields configured yet.'); return; }
                if (!data.require_email_verification) {
                    loadFormDirect();
                } else {
                    setStep('email');
                }
            } catch { setError('Failed to load form. Please check your connection.'); }
            finally { setInitialLoading(false); }
        };
        init();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [formId]);

    const loadFormDirect = () => {
        const data = formDataRef.current;
        if (!data) return;
        const schema = JSON.parse(JSON.stringify(data.form_schema));
        const fillEmail = (els: any[]) => {
            els.forEach((el: any) => {
                if (el.name === 'email' && email) {
                    el.defaultValue = email;
                    el.readOnly = true;
                }
                if (el.elements) fillEmail(el.elements);
            });
        };
        if (schema.pages) schema.pages.forEach((p: any) => fillEmail(p.elements || []));
        else fillEmail(schema.elements || []);
        const model = new Model(schema);
        model.onComplete.add(handleComplete);
        setSurvey(model);
        setStep('form');
    };

    const startResendTimer = () => {
        setResendTimer(30);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStepError('Please enter a valid email address.');
            return;
        }
        setSendingOtp(true);
        setStepError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/visitor-forms/${formId}/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (res.ok) {
                setOtpSent(true);
                setStep('otp');
                startResendTimer();
            } else {
                const data = await res.json();
                setStepError(data.error || 'Failed to send OTP. Please try again.');
            }
        } catch {
            setStepError('Network error. Please try again.');
        } finally {
            setSendingOtp(false);
        }
    };

    const handleResendOTP = () => {
        if (resendTimer > 0) return;
        handleSendOTP();
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            setStepError('Please enter the 6-digit OTP.');
            return;
        }
        setVerifyingOtp(true);
        setStepError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/visitor-forms/${formId}/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });
            if (res.ok) {
                loadFormDirect();
            } else {
                const data = await res.json();
                setStepError(data.error || 'Invalid or expired OTP.');
            }
        } catch {
            setStepError('Network error. Please try again.');
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleComplete = useCallback(async (sender: Model) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/visitor-submissions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    form: formId,
                    submission_data: sender.data,
                }),
            });
            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    window.location.href = 'https://pinobite.com';
                }, 2000);
            } else {
                setError('Failed to submit. Please try again.');
            }
        } catch {
            setError('An error occurred while submitting.');
        }
    }, [formId]);

    // -- RENDER --

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-4">error</span>
                    <h2 className="text-xl font-black uppercase text-slate-800 mb-2">Form Exempt</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
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
                        Thank you for registering for <b>{formMeta?.event_name}</b>. We have received your details.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-satoshi">
            <style>{surveyFormStyles}</style>
            <header className="h-20 bg-white shadow-sm flex items-center justify-center p-4">
                <img
                    src="/logos/Pinobite-logo.png"
                    alt="Pinobite"
                    className="h-12 md:h-14 w-auto object-contain cursor-pointer"
                    onClick={onHomeClick}
                />
            </header>
            <div className="max-w-2xl mx-auto p-4 md:p-12">
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    {(step === 'form' || step === 'submitted') && formMeta ? (
                        <>
                            <div className="bg-slate-900 p-6 md:p-8 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-primary/10 opacity-50"></div>
                                <div className="relative z-10">
                                    <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">{formMeta.event_name}</p>
                                    <h1 className="text-xl md:text-3xl font-black text-white uppercase leading-tight">{formMeta.title}</h1>
                                </div>
                            </div>
                            <div className="p-4 md:p-8">
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : survey ? (
                                    <Survey model={survey} />
                                ) : null}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 md:p-12">
                            {step === 'email' && (
                                <div>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-3xl text-primary">mail_lock</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 mb-2">Verify Your Email</h2>
                                        <p className="text-slate-500 text-sm">Enter your email to receive a verification code and access the form.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); setStepError(null); }}
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-800 text-base transition-all"
                                                onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                                            />
                                        </div>
                                        {stepError && <p className="text-red-500 text-sm">{stepError}</p>}
                                        <button
                                            onClick={handleSendOTP}
                                            disabled={sendingOtp}
                                            className="w-full py-3.5 bg-primary text-white font-black rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-sm"
                                        >
                                            {sendingOtp ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Sending...
                                                </span>
                                            ) : 'Send Verification OTP'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'otp' && (
                                <div>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="material-symbols-outlined text-3xl text-primary">pin</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-800 mb-2">Enter OTP</h2>
                                        <p className="text-slate-500 text-sm">
                                            A 6-digit code has been sent to <strong className="text-slate-700">{email}</strong>
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">OTP Code</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={otp}
                                                onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setStepError(null); }}
                                                placeholder="000000"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-slate-800 text-center text-2xl tracking-[8px] font-bold transition-all"
                                                onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                                            />
                                        </div>
                                        {stepError && <p className="text-red-500 text-sm text-center">{stepError}</p>}
                                        <button
                                            onClick={handleVerifyOTP}
                                            disabled={verifyingOtp || otp.length !== 6}
                                            className="w-full py-3.5 bg-primary text-white font-black rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-sm"
                                        >
                                            {verifyingOtp ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                    Verifying...
                                                </span>
                                            ) : 'Verify OTP'}
                                        </button>
                                        <div className="text-center">
                                            {resendTimer > 0 ? (
                                                <p className="text-slate-400 text-sm">Resend in {resendTimer}s</p>
                                            ) : (
                                                <button
                                                    onClick={handleResendOTP}
                                                    disabled={sendingOtp}
                                                    className="text-primary font-bold text-sm hover:underline disabled:opacity-50"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorFormPage;
