"use client"
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '@/services/api';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react';
import { useToast } from "@/contexts/toast";
import AiHeader from '@/components/aiHeader';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            if (data && data.token) {
                const cookieOptions = process.env.NODE_ENV === 'production'
                    ? { secure: true, sameSite: 'strict' }
                    : { sameSite: 'strict' };
                Cookies.set('token', data.token, cookieOptions);
                addToast('Identity protocol initialized.', 'success');
                window.location.href = '/ai/dashboard';
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AiHeader />
            <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
                <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-zinc-900/20 rounded-full blur-3xl pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-lg p-8 shadow-2xl relative z-10"
                >
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Initialize</h1>
                        <p className="text-zinc-500 text-sm">Register new identity in the network.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-semibold text-zinc-500 ml-1">Identity Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-zinc-600" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-semibold text-zinc-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-zinc-600" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                                    placeholder="user@domain.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-semibold text-zinc-500 ml-1">Secure Key</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 text-zinc-600" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
                                    placeholder="Min 6 chars"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-100 hover:bg-white text-black font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    Register <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-600">
                        Already registered? <Link href="/ai/login" className="text-zinc-300 hover:text-white underline underline-offset-4">Access terminal</Link>
                    </div>
                </motion.div>
            </div>
        </>
    );
}