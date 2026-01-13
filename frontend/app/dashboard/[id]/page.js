"use client"
import { useEffect, useState } from 'react'
import api from "@/services/api";
import Header from '@/components/header';
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link';
import { uploadFile } from '@/services/supabase';
import { useAuth } from '@/contexts/auth';

function AssetPage() {
    const params = useParams();
    const router = useRouter();

    const [asset, setAsset] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const { data } = await api.get(`/assets/${params.id}`);
                setAsset(data);
            } catch (error) {
                setError(error.response?.data?.message || 'Error fetching asset');
                console.error('Error fetching asset:', error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchAsset();
        }
    }, [params.id]);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        setSelectedImage(file);
    }

    function handleAssetUpload(e) {
        const file = e.target.files[0];
        setSelectedAsset(file);
    }

    async function handleFileUpload(file, userId) {
        if (!file) return null;
        const { fileUrl } = await uploadFile(file, userId);
        return fileUrl;
    }

    async function handleAssetUpdate(e) {
        e.preventDefault();

        try {
            const form = e.target;

            const name = form.elements.name.value.trim();
            const description = form.elements.description.value.trim();
            const category = form.elements.category.value;
            const tagsRaw = form.elements.tags.value;
            const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

            if (!name || !category) {
                alert('Name and category are required');
                return;
            }

            const ownerId = user?.id || asset.ownerId;

            const [imageUrl, assetUrl] = await Promise.all([
                selectedImage ? handleFileUpload(selectedImage, ownerId) : Promise.resolve(asset.image),
                selectedAsset ? handleFileUpload(selectedAsset, ownerId) : Promise.resolve(asset.url)
            ]);

            const updatedData = {
                name,
                description,
                image: imageUrl,
                url: assetUrl,
                category,
                format: selectedAsset ? selectedAsset.name.split('.').pop() : asset.format,
                size: selectedAsset ? selectedAsset.size : asset.size,
                tags
            };

            const { data } = await api.put(`/assets/${params.id}`, updatedData);
            setAsset(data);
            setEditing(false);
            setSelectedImage(null);
            setSelectedAsset(null);
            alert('Asset updated successfully');

        } catch (error) {
            console.error('Error updating asset:', error);
            alert('Failed to update asset: ' + (error.response?.data?.message || 'Unknown error'));
        }
    }

    async function handleAssetDelete() {
        const confirmDelete = confirm('Are you sure you want to delete this asset? This action cannot be undone.');
        if (!confirmDelete) return;

        try {
            await api.delete(`/assets/${params.id}`);
            alert('Asset deleted successfully');
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert('Failed to delete asset');
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <section className='p-8'>
                    <h1 className='text-5xl font-bold mb-6 text-center'>Loading Asset...</h1>
                </section>
            </>
        )
    }

    if (!asset) {
        return (
            <>
                <Header />
                <section className='p-8'>
                    <h1 className='text-5xl font-bold mb-6 text-center'>This Asset Does Not Exist</h1>
                    <Link href="/dashboard" className='text-blue-500 underline'>Back to Dashboard</Link>
                </section>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <section className='p-8'>
                    <h1 className='text-5xl font-bold mb-6 text-center'>Error Loading Asset</h1>
                    <p className='text-red-500 text-center'>{error}</p>
                    <Link href="/dashboard" className='text-blue-500 underline'>Back to Dashboard</Link>
                </section>
            </>
        )
    }

    return (
        <>
            <Header />
            <main className='p-8 max-w-4xl mx-auto'>
                <Link href='/dashboard' className='text-blue-500 hover:underline mb-4 inline-block'>
                    Back to Dashboard
                </Link>

                <div className='bg-white text-black rounded-lg p-6 shadow-lg'>
                    <img
                        src={asset.image}
                        alt={asset.name}
                        className='w-full h-full object-cover rounded-lg mb-6'
                    />

                    <h1 className='text-4xl font-bold mb-4'>{asset.name}</h1>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                        <div>
                            <p className='text-gray-600 text-sm'>Category</p>
                            <p className='text-lg font-semibold capitalize'>{asset.category}</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>Format</p>
                            <p className='text-lg font-semibold uppercase'>{asset.format}</p>
                        </div>

                        <div>
                            <p className='text-gray-600 text-sm'>File Size</p>
                            <p className='text-lg font-semibold'>{(asset.size / 1024).toFixed(2)} KB</p>
                        </div>
                    </div>

                    <div className='mb-6'>
                        <p className='text-gray-600 text-sm mb-2'>Description</p>
                        <p className='text-lg'>{asset.description}</p>
                    </div>

                    <div className='mb-6'>
                        <p className='text-gray-600 text-sm mb-2'>Tags</p>
                        <div className='flex flex-wrap gap-2'>
                            {asset.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className='bg-gray-200 px-3 py-1 rounded-full text-sm'
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <a
                        href={asset.url}
                        target='_blank'
                        className='bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-md inline-block transition-all duration-200 mr-5 mb-5  cursor-pointer'
                    >
                        Download Asset
                    </a>

                    <button onClick={() => setEditing(true)} className='bg-yellow-500 hover:bg-yellow-700 text-white px-6 py-3 rounded-md inline-block transition-all duration-200 cursor-pointer mb-5'>Edit Asset</button>

                    <button onClick={() => handleAssetDelete()} className='bg-red-500 hover:bg-red-700 text-white px-6 py-3 rounded-md inline-block transition-all duration-200 ml-5 cursor-pointer'>Delete Asset</button>
                </div>
            </main>

            {editing && (
                <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50' onClick={() => setEditing(false)}>
                    <div className='bg-white text-black p-6 rounded-lg w-full max-w-lg' onClick={(e) => e.stopPropagation()}>
                        <h2 className='text-2xl font-bold mb-4'>Edit Asset - {asset.name}</h2>
                        <form className='flex flex-col gap-4' onSubmit={handleAssetUpdate}>
                            <input name="name" type="text" value={asset.name} onChange={e => setAsset({ ...asset, name: e.target.value })} placeholder='Asset Name' className='p-2 border border-gray-300 rounded-md' />
                            <textarea name="description" value={asset.description} onChange={e => setAsset({ ...asset, description: e.target.value })} placeholder='Asset Description' className='p-2 border border-gray-300 rounded-md'></textarea>
                            <input name="imageFile" type="file" onChange={handleImageUpload} accept=".png,.jpg,.jpeg,.webp" className='p-2 border border-gray-300 rounded-md' />
                            <input name="assetFile" type="file" onChange={handleAssetUpload} accept=".glb,.gltf,.fbx,.obj,.png,.jpg,.jpeg,.webp,.hdr,.exr,.zip" className='p-2 border border-gray-300 rounded-md' />
                            <select name="category" value={asset.category} onChange={e => setAsset({ ...asset, category: e.target.value })} className='p-2 border border-gray-300 rounded-md'>
                                <option value="">Select Category</option>
                                <option value="photo">Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="design">Design</option>
                                <option value="icon">Icon</option>
                            </select>
                            <input name="tags" type="text" value={asset.tags.join(', ')} onChange={e => setAsset({ ...asset, tags: e.target.value.split(',').map(tag => tag.trim()) })} placeholder='Tags (comma separated)' className='p-2 border border-gray-300 rounded-md' />
                            <button type="submit" className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>
                                Create Asset
                            </button>
                        </form>

                        <button onClick={() => setEditing(false)} className='cursor-pointer mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full'>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AssetPage