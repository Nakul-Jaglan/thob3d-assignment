"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000); // Auto dismiss
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ message, type, onClose }) {
    const bgColors = {
        success: 'bg-zinc-950 border-green-900',
        error: 'bg-zinc-950 border-red-900',
        info: 'bg-zinc-950 border-zinc-800'
    };
    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-blue-500'
    };
    const Icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info
    };
    const Icon = Icons[type];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`pointer-events-auto flex items-center gap-3 min-w-75 p-4 rounded-lg border ${bgColors[type]} text-zinc-100 shadow-xl backdrop-blur-md`}
        >
            <Icon size={20} className={iconColors[type]} />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
}

export const useToast = () => useContext(ToastContext);