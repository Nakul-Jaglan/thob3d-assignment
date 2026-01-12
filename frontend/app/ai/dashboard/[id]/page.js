"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import AiHeader from '@/components/aiHeader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Tag, File, HardDrive, Share2, AlertTriangle, Loader2, User } from 'lucide-react';

export default function AssetDetailAi() {
    const { id } = useParams();
    const router = useRouter();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get(`/assets/${id}`);
                setAsset(data);
            } catch (err) {
                setError(err.response?.data?.message || "Node access denied. Asset may be deleted.");
            } finally {
                setLoading(false);
            }
        };
        if(id) load();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-zinc-600" size={40} /></div>;

    if (error) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
            <AlertTriangle className="text-red-500 mb-4" size={48} />
            <h1 className="text-2xl font-bold text-zinc-200 mb-2">Protocol Error</h1>
            <p className="text-zinc-500 mb-6">{error}</p>
            <Link href="/ai/dashboard" className="border border-zinc-800 text-zinc-300 px-6 py-2 rounded-lg hover:bg-zinc-900 transition-colors">Return to Grid</Link>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col">
            <AiHeader />
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-12">
                <Link href="/ai/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} /> Data Grid
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Visual Preview */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center aspect-square md:aspect-video lg:aspect-square relative group"
                    >
                         {asset.image ? (
                             <img src={asset.image} alt="Preview" className="w-full h-full object-contain" />
                         ) : (
                             <div className="flex flex-col items-center text-zinc-600">
                                <File size={48} className="mb-2" />
                                <span className="text-sm">No Preview Signal</span>
                             </div>
                         )}
                         <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-lg pointer-events-none" />
                    </motion.div>

                    {/* Data Panel */}
                    <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="flex flex-col h-full"
                    >
                        <div className="mb-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">{asset.category}</span>
                                {asset.format && <span className="text-zinc-500 text-xs font-mono uppercase border border-zinc-800 px-2 py-1 rounded-lg">{asset.format}</span>}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">{asset.name}</h1>
                            
                            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-lg mb-8">
                                <p className="text-zinc-400 leading-relaxed font-light">{asset.description || "No specific data points available."}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-8 font-mono">
                                <div className="flex items-center gap-2"><HardDrive size={16} /> <span>{asset.size ? (asset.size / 1024).toFixed(1) + ' KB' : 'Unknown Size'}</span></div>
                                <div className="flex items-center gap-2"><User size={16} /> <span>{asset.ownerId}</span></div>
                            </div>
                            
                             {asset.tags && asset.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {asset.tags.map(t => (
                                        <span key={t} className="flex items-center gap-1 text-xs text-zinc-400 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                                            <Tag size={12} /> {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex gap-4">
                            {asset.url ? (
                                <a href={asset.url} target="_blank" rel="noreferrer" className="flex-1 bg-white hover:bg-zinc-200 text-black text-center font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/5">
                                    <Download size={18} /> Download
                                </a>
                            ) : (
                                <button disabled className="flex-1 bg-zinc-800 text-zinc-500 font-bold py-3 rounded-lg cursor-not-allowed">Asset Offline</button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}