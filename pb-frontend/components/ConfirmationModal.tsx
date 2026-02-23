
import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden relative animate-in zoom-in-95 duration-200 border border-slate-100 p-6">

                <div className="text-center mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                        <span className="material-symbols-outlined text-2xl">
                            {isDestructive ? 'warning' : 'info'}
                        </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-lg shadow-slate-200 transition-all active:scale-95 ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-slate-900 hover:bg-slate-800'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
