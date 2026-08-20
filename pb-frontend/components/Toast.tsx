import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
    showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: Toast['type'] = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto min-w-[300px] max-w-md bg-white rounded-2xl shadow-2xl border-l-4 p-4 flex items-center gap-4 overflow-hidden relative group ${toast.type === 'success' ? 'border-green-500' :
                                    toast.type === 'error' ? 'border-red-500' :
                                        toast.type === 'warning' ? 'border-orange-500' :
                                            'border-primary'
                                }`}
                        >
                            {/* Animation Background */}
                            <div className="absolute inset-0 bg-slate-50/50 -z-10 group-hover:bg-slate-100/50 transition-colors" />

                            {/* Progress Bar */}
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 5, ease: 'linear' }}
                                className={`absolute bottom-0 left-0 h-1 ${toast.type === 'success' ? 'bg-green-500/30' :
                                        toast.type === 'error' ? 'bg-red-500/30' :
                                            toast.type === 'warning' ? 'bg-orange-500/30' :
                                                'bg-primary/30'
                                    }`}
                            />

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                                    toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                        toast.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-primary'
                                }`}>
                                <span className="material-symbols-outlined text-xl">
                                    {toast.type === 'success' ? 'check_circle' :
                                        toast.type === 'error' ? 'error' :
                                            toast.type === 'warning' ? 'warning' :
                                                'info'}
                                </span>
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800 leading-tight">
                                    {toast.message}
                                </p>
                            </div>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
