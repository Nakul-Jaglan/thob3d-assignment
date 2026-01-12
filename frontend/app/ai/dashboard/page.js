"use client"
import { useEffect, useState, useMemo } from 'react';
import api from "@/services/api";
import AiHeader from '@/components/aiHeader';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, Filter, Plus, FileImage, FileVideo, 
    FileAudio, FileCode, Box, Image as ImageIcon,
    ChevronLeft, ChevronRight, X, Upload, Loader2, Tag 
} from 'lucide-react';
import { useToast } from "@/contexts/toast";
import { useAuth } from '@/contexts/auth';
import { uploadFile } from '@/services/supabase';

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
            <Box size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No assets found</p>
            <p className="text-sm">Upload new data to populate the grid.</p>
        </div>
    );
}

export default function DashboardPage() {
    const [allAssets, setAllAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    
    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [tagQuery, setTagQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortOption, setSortOption] = useState('');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(9); // Grid friendly default

    // Create Form
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();
    const { addToast } = useToast();

    // Data Fetching
    const fetchAssets = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/assets');
            setAllAssets(data || []);
        } catch (error) {
            console.error('Error fetching assets:', error);
            addToast("Failed to retrieve asset stream.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    // Logic
    const filteredAssets = useMemo(() => {
        let list = [...allAssets];
        const q = searchTerm.toLowerCase();
        const tQ = tagQuery.toLowerCase();

        if (q) list = list.filter(a => (a.name?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)));
        if (tQ) list = list.filter(a => Array.isArray(a.tags) && a.tags.some(t => t.toLowerCase().includes(tQ)));
        if (filterType) list = list.filter(a => a.category === filterType);

        if (sortOption === 'name-asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        if (sortOption === 'name-desc') list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));

        return list;
    }, [allAssets, searchTerm, tagQuery, filterType, sortOption]);

    const totalPages = Math.ceil(filteredAssets.length / (perPage || filteredAssets.length || 1));
    const paginatedAssets = useMemo(() => {
        if (!perPage) return filteredAssets;
        const start = (currentPage - 1) * perPage;
        return filteredAssets.slice(start, start + perPage);
    }, [filteredAssets, currentPage, perPage]);

    // Handlers
    const handleFileUpload = async (file, userId) => {
        if (!file) return null;
        const { fileUrl } = await uploadFile(file, userId);
        return fileUrl;
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setUploading(true);
        const form = e.target;
        
        try {
            const name = form.name.value;
            const cat = form.category.value;
            const imgFile = form.imageFile.files[0];
            const assetFile = form.assetFile.files[0];
            const tags = form.tags.value.split(',').map(t => t.trim()).filter(Boolean);

            if (!name || !cat || !assetFile) throw new Error("Name, Category and Asset file are required.");

            const ownerId = user?.id || null;

            const [imgUrl, assetUrl] = await Promise.all([
                imgFile ? handleFileUpload(imgFile, ownerId) : null,
                handleFileUpload(assetFile, ownerId)
            ]);

            await api.post('/assets', {
                name,
                description: form.description.value,
                image: imgUrl,
                url: assetUrl,
                category: cat,
                format: assetFile.name.split('.').pop(),
                size: assetFile.size,
                tags
            }, { headers: { Authorization: `Bearer ${Cookies.get('token')}` }});

            addToast("Asset node created successfully.", "success");
            setCreateModalOpen(false);
            fetchAssets();
        } catch (err) {
            addToast(err.message || "Creation failed.", "error");
        } finally {
            setUploading(false);
        }
    };

    // Components
    const CategoryIcon = ({ type }) => {
        switch(type) {
            case 'photo': return <ImageIcon size={16} />;
            case 'video': return <FileVideo size={16} />;
            case 'audio': return <FileAudio size={16} />;
            case 'icon': return <Box size={16} />;
            default: return <FileCode size={16} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <AiHeader />
            <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
                
                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">Data Grid</h1>
                        <p className="text-zinc-500 text-sm">{filteredAssets.length} active nodes found</p>
                    </div>
                    <button 
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-white/5"
                    >
                        <Plus size={18} /> New Asset
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-950/50 p-4 rounded-lg border border-zinc-900">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                        <input 
                            placeholder="Filter by name..." 
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-zinc-600"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Tag className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                        <input 
                            placeholder="Filter by tag..." 
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-zinc-600"
                            value={tagQuery}
                            onChange={e => setTagQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-zinc-600" size={16} />
                        <select 
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-zinc-600 appearance-none"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="photo">Photo</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="design">Design</option>
                            <option value="icon">Icon</option>
                        </select>
                    </div>
                    <div className="relative">
                        <select 
                            className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-4 pr-4 text-sm focus:outline-none focus:border-zinc-600 appearance-none"
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value)}
                        >
                            <option value="">Sort By...</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-zinc-500" size={32} /></div>
                ) : paginatedAssets.length === 0 ? (
                    <EmptyState />
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {paginatedAssets.map((asset) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={asset.id}
                                    className="group bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition-all hover:shadow-2xl hover:shadow-zinc-900/50 flex flex-col"
                                >
                                    <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                        {asset.image ? (
                                            <img src={asset.image} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <CategoryIcon type={asset.category} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-mono border border-white/10 flex items-center gap-1">
                                            <CategoryIcon type={asset.category} />
                                            <span className="capitalize">{asset.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg truncate mb-1 text-zinc-100">{asset.name}</h3>
                                        <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">{asset.description || "No description provided."}</p>
                                        <Link href={`/ai/dashboard/${asset.id}`} className="block">
                                            <button className="w-full border border-zinc-800 hover:bg-zinc-900 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors">
                                                Inspect Node
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-4 py-2 text-sm text-zinc-500">Page {currentPage} of {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-2 rounded-lg border border-zinc-800 hover:bg-zinc-900 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {createModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-lg shadow-2xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
                                <h2 className="font-bold flex items-center gap-2"><Plus size={18} /> New Asset Entity</h2>
                                <button onClick={() => setCreateModalOpen(false)}><X size={20} className="text-zinc-500 hover:text-white" /></button>
                            </div>
                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <input name="name" placeholder="Asset Name" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600" required />
                                <textarea name="description" placeholder="Technical Description" rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600" />
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <select name="category" className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600" required>
                                        <option value="">Select Type</option>
                                        <option value="photo">Photo</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="design">Design</option>
                                        <option value="icon">Icon</option>
                                    </select>
                                    <input name="tags" placeholder="Tags (comma sep)" className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:border-zinc-600" />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <label className="text-xs uppercase text-zinc-500 font-bold block">Preview Image</label>
                                    <div className="relative border border-dashed border-zinc-800 rounded-lg p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                                         <input name="imageFile" type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                                         <div className="flex items-center justify-center gap-2 text-zinc-500 group-hover:text-zinc-300">
                                            <Upload size={16} /> <span>Upload Cover</span>
                                         </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                     <label className="text-xs uppercase text-zinc-500 font-bold block">Asset File (Required)</label>
                                     <input name="assetFile" type="file" className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700" required />
                                </div>

                                <button type="submit" disabled={uploading} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-4 flex justify-center items-center gap-2 disabled:opacity-50">
                                    {uploading ? <Loader2 className="animate-spin" /> : "Deploy to Grid"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}