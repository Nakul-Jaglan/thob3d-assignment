"use client"
import { useState, useEffect } from 'react';
import api from '@/services/api';
import AiHeader from '@/components/aiHeader';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/contexts/toast";

export default function ProfileAi() {
    const { user, refreshUser, loading: authLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/users/${user.id}`, { name, email });
            await refreshUser();
            addToast("Identity parameters updated.", "success");
        } catch (err) {
            addToast("Update failed.", "error");
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-zinc-600" /></div>;

    return (
        <div className="min-h-screen flex flex-col">
            <AiHeader />
            <main className="flex-1 flex items-center justify-center p-6 relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,30,0.5),transparent_70%)] pointer-events-none" />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-lg p-8 shadow-2xl relative z-10"
                >
                    <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-6">
                        <div className="w-16 h-16 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                            <span className="text-2xl font-bold text-zinc-500">{name.charAt(0)}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">User Configuration</h1>
                            <p className="text-zinc-500 text-sm">ID: {user?.id?.slice(0, 8)}...</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                             <label className="text-xs uppercase font-bold text-zinc-500 flex items-center gap-1"><User size={12} /> Display Name</label>
                             <input 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                             />
                        </div>

                        <div className="space-y-2">
                             <label className="text-xs uppercase font-bold text-zinc-500 flex items-center gap-1"><Mail size={12} /> Contact Route</label>
                             <input 
                                type="email"
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                             />
                        </div>

                        <div className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800/50 flex items-start gap-3">
                            <Shield className="text-zinc-500 mt-1" size={16} />
                            <div>
                                <h4 className="text-sm font-bold text-zinc-300">Security Clearance</h4>
                                <p className="text-xs text-zinc-600 mt-1">Your account is fully vetted for asset creation and retrieval operations.</p>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={saving}
                            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    <Save size={18} /> Save Changes
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}