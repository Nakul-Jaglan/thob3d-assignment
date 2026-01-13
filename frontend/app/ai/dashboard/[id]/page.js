"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import AiHeader from '@/components/aiHeader';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Tag, File, HardDrive, Share2, AlertTriangle, Loader2, User, Edit3, Trash2, X, Upload } from 'lucide-react';
import { useToast } from '@/contexts/toast';
import { useAuth } from '@/contexts/auth';
import { uploadFile } from '@/services/supabase';

export default function AssetDetailAi() {
    const { id } = useParams();
    const router = useRouter();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal states
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // File uploads
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAssetFile, setSelectedAssetFile] = useState(null);

    const { addToast } = useToast();
    const { user } = useAuth();

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
        if (id) load();
    }, [id]);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedImage(file);
    };

    const handleAssetFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) setSelectedAssetFile(file);
    };

    const handleFileUpload = async (file, userId) => {
        if (!file) return null;
        const { fileUrl } = await uploadFile(file, userId);
        return fileUrl;
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const form = e.target;
            const name = form.elements.name.value.trim();
            const description = form.elements.description.value.trim();
            const category = form.elements.category.value;
            const tagsRaw = form.elements.tags.value;
            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

            if (!name) {
                addToast('Name is required', 'error');
                setUpdating(false);
                return;
            }

            const ownerId = user?.id || asset.ownerId;

            // Upload new files if selected
            const [imageUrl, assetUrl] = await Promise.all([
                selectedImage ? handleFileUpload(selectedImage, ownerId) : Promise.resolve(asset.image),
                selectedAssetFile ? handleFileUpload(selectedAssetFile, ownerId) : Promise.resolve(asset.url)
            ]);

            const updatedData = {
                name,
                description,
                image: imageUrl,
                url: assetUrl,
                category,
                format: selectedAssetFile ? selectedAssetFile.name.split('.').pop() : asset.format,
                size: selectedAssetFile ? selectedAssetFile.size : asset.size,
                tags
            };

            const { data } = await api.put(`/assets/${id}`, updatedData);
            setAsset(data);
            setEditModalOpen(false);
            setSelectedImage(null);
            setSelectedAssetFile(null);
            addToast('Asset updated successfully', 'success');
        } catch (err) {
            addToast('Failed to update asset: ' + (err.response?.data?.message || 'Unknown error'), 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/assets/${id}`);
            addToast('Asset deleted successfully', 'success');
            router.push('/ai/dashboard');
        } catch (err) {
            addToast('Failed to delete asset: ' + (err.response?.data?.message || 'Unknown error'), 'error');
            setDeleting(false);
            setDeleteModalOpen(false);
        }
    };

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
        if (id) load();
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
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 size={18} /> Edit
                            </button>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                className="bg-red-900/50 hover:bg-red-900 text-red-200 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-800"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {editModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Edit Asset</h2>
                                <button onClick={() => setEditModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleEdit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Asset Name *</label>
                                    <input
                                        name="name"
                                        type="text"
                                        defaultValue={asset.name}
                                        placeholder="Enter asset name"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={asset.description}
                                        placeholder="Describe this asset"
                                        rows={4}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={asset.category}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-700"
                                    >
                                        <option value="photo">Photo</option>
                                        <option value="video">Video</option>
                                        <option value="audio">Audio</option>
                                        <option value="design">Design</option>
                                        <option value="icon">Icon</option>
                                        <option value="3d">3D Model</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Tags (comma separated)</label>
                                    <input
                                        name="tags"
                                        type="text"
                                        defaultValue={asset.tags?.join(', ')}
                                        placeholder="e.g., design, ui, modern"
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Preview Image</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            accept=".png,.jpg,.jpeg,.webp"
                                            className="hidden"
                                            id="edit-image-upload"
                                        />
                                        <label
                                            htmlFor="edit-image-upload"
                                            className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400 hover:border-zinc-700 cursor-pointer transition-colors"
                                        >
                                            <Upload size={18} />
                                            {selectedImage ? selectedImage.name : 'Upload new preview image (optional)'}
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">Asset File</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleAssetFileUpload}
                                            accept=".glb,.gltf,.fbx,.obj,.png,.jpg,.jpeg,.webp,.hdr,.exr,.zip"
                                            className="hidden"
                                            id="edit-asset-upload"
                                        />
                                        <label
                                            htmlFor="edit-asset-upload"
                                            className="flex items-center justify-center gap-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-400 hover:border-zinc-700 cursor-pointer transition-colors"
                                        >
                                            <Upload size={18} />
                                            {selectedAssetFile ? selectedAssetFile.name : 'Upload new asset file (optional)'}
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 size={18} />
                                                Update Asset
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditModalOpen(false)}
                                        disabled={updating}
                                        className="px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-950 border border-red-900 rounded-lg w-full max-w-md"
                        >
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-red-900/20 border border-red-900 flex items-center justify-center">
                                        <AlertTriangle className="text-red-500" size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Delete Asset</h2>
                                </div>

                                <p className="text-zinc-400 mb-6">
                                    Are you sure you want to delete <span className="text-white font-semibold">"{asset.name}"</span>? This action cannot be undone and all associated data will be permanently removed.
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex-1 bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {deleting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={18} />
                                                Delete Permanently
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeleteModalOpen(false)}
                                        disabled={deleting}
                                        className="px-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}