"use client"
import { useEffect, useState } from 'react'
import api from "@/services/api";
import Header from '@/components/header';
import Link from 'next/link';
import { uploadFile } from '@/services/supabase';
import { useAuth } from '@/contexts/auth';

function DashboardPage() {
    const [allAssets, setAllAssets] = useState([]);
    let [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const { user } = useAuth();

    const fetchAssets = async () => {
        try {
            const { data } = await api.get('/assets');
            setAssets(data || []);
            setAllAssets(data || []);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    assets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    function handleSort(e) {
        const value = e.target.value;
        let sortedAssets = [...assets];
        if (value === 'name-asc') {
            sortedAssets.sort((a, b) => a.name.localeCompare(b.name));
        } else if (value === 'name-desc') {
            sortedAssets.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            sortedAssets = [...allAssets];
        }
        setAssets(sortedAssets);
    }

    function handleFilter(e) {
        const value = e.target.value;
        if (value) {
            let filteredAssets = allAssets.filter(asset => asset.category === value);
            setAssets(filteredAssets);
        } else {
            setAssets([...allAssets]);
        }
    }

    function handleTagSearch(e) {
        const value = e.target.value.toLowerCase();
        if (value) {
            let filteredAssets = allAssets.filter(asset =>
                asset.tags.some(tag => tag.toLowerCase().includes(value))
            );
            setAssets(filteredAssets);
        } else {
            setAssets([...allAssets]);
        }
    }

    function handlePerPage(e) {
        let v = e.target.value;
        setPerPage(v ? parseInt(v) : allAssets.length);
        setCurrentPage(1);
    }


    function handlePagination(pageNumber) {
        setCurrentPage(pageNumber);
    }

    useEffect(() => {
        const startIndex = (currentPage - 1) * perPage;
        const paginatedAssets = allAssets.slice(
            startIndex,
            startIndex + perPage
        );
        setAssets(paginatedAssets);
    }, [currentPage, perPage, allAssets]);

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

    async function handleAssetCreation(e) {
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

            const ownerId = user?.id || null;

            const [imageUrl, assetUrl] = await Promise.all([
                handleFileUpload(selectedImage, ownerId),
                handleFileUpload(selectedAsset, ownerId)
            ]);

            await api.post('/assets/', {
                name,
                description,
                image: imageUrl,
                url: assetUrl,
                category,
                format: selectedAsset ? selectedAsset.name.split('.').pop() : '',
                size: selectedAsset ? selectedAsset.size : 0,
                tags
            }
            );

            alert('Asset created successfully');
            setCreateModalOpen(false);
            setSelectedImage(null);
            setSelectedAsset(null);
            form.reset();
            fetchAssets();

        } catch (error) {
            console.error('Error in asset creation process:', error);
            alert('Failed to create asset due to an unexpected error');
        }
    }

    return (
        <>
            <Header />
            <section className='p-8'>
                <h1 className='text-5xl font-bold mb-6 text-center'>Dashboard</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    <div className='col-span-1 mb-6'>
                        <button onClick={() => setCreateModalOpen(true)} className='cursor-pointer bg-blue-500 hover:bg-blue-700 font-semibold text-white px-4 py-2 rounded-md mb-6 transition-all duration-200 hover:scale-110'>
                            Create New Asset
                        </button>

                        <h2 className='text-2xl font-semibold'>Available Assets ({assets.length})</h2>

                        <p className='text-gray-400'>Search</p>
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className='w-[70%] p-2 border border-gray-300 rounded-md mt-2 mb-4'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <p className='text-gray-400'>Search by Tags</p>
                        <input
                            type="text"
                            placeholder="Filter by tags..."
                            className='w-[70%] p-2 border border-gray-300 rounded-md mt-2 mb-4'
                            onChange={handleTagSearch}
                        />

                        <p className='text-gray-400'>Sorting</p>
                        <select
                            className='w-[70%] p-2 border border-gray-300 rounded-md mt-2 mb-4'
                            onChange={handleSort}
                        >
                            <option value="reset">Sort By</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                        </select>

                        <p className='text-gray-400'>Filter by Type</p>
                        <select
                            className='w-[70%] p-2 border border-gray-300 rounded-md mt-2 mb-4'
                            onChange={handleFilter}
                        >
                            <option value="">All Types</option>
                            <option value="photo">Image</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="design">Design</option>
                            <option value="icon">Icon</option>
                        </select>

                        <p className='text-gray-400'>Items per Page</p>
                        <select
                            className='w-[70%] p-2 border border-gray-300 rounded-md mt-2 mb-4'
                            onChange={handlePerPage}
                        >
                            <option value="">All Together</option>
                            <option>1</option>
                            <option>2</option>
                            <option>4</option>
                        </select>

                        <p className='text-gray-400'>Pagination</p>
                        <div className='flex gap-2 mt-2'>
                            {Array.from({ length: Math.ceil(allAssets.length / perPage) }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handlePagination(num)}
                                    className='bg-gray-200 text-black px-3 py-1 rounded-md'
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {assets.map((asset) => (
                            <div key={asset.id} className='border p-4 rounded-lg shadow-sm flex flex-col justify-between'>
                                <img src={asset.image} alt={asset.name} className="mb-4 rounded" />
                                <h2 className='text-2xl text-center font-semibold mb-2'>{asset.name}</h2>
                                <p className='text-gray-300 mb-4'>{asset.description}</p>
                                <Link href={`/dashboard/${asset.id}`} className='bg-blue-500 hover:bg-blue-700 transition-all duration-200 w-full mx-auto text-white px-4 py-2 rounded-md text-center inline-block'>
                                    <button>View Asset</button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {createModalOpen && (
                <div onClick={() => setCreateModalOpen(false)} className='fixed inset-0 bg-black/70 flex items-center justify-center'>
                    <div className='bg-white text-black p-6 rounded-lg w-[80%] max-w-md mx-auto' onClick={e => e.stopPropagation()}>
                        <h2 className='text-2xl font-semibold mb-4'>Create New Asset</h2>

                        <form className='flex flex-col gap-4' onSubmit={handleAssetCreation}>
                            <input name="name" type="text" placeholder='Asset Name' className='p-2 border border-gray-300 rounded-md' />
                            <textarea name="description" placeholder='Asset Description' className='p-2 border border-gray-300 rounded-md'></textarea>
                            <input name="imageFile" type="file" onChange={handleImageUpload} accept=".png,.jpg,.jpeg,.webp" className='p-2 border border-gray-300 rounded-md' />
                            <input name="assetFile" type="file" onChange={handleAssetUpload} accept=".glb,.gltf,.fbx,.obj,.png,.jpg,.jpeg,.webp,.hdr,.exr,.zip" className='p-2 border border-gray-300 rounded-md' />
                            <select name="category" className='p-2 border border-gray-300 rounded-md'>
                                <option value="">Select Category</option>
                                <option value="photo">Image</option>
                                <option value="video">Video</option>
                                <option value="audio">Audio</option>
                                <option value="design">Design</option>
                                <option value="icon">Icon</option>
                            </select>
                            <input name="tags" type="text" placeholder='Tags (comma separated)' className='p-2 border border-gray-300 rounded-md' />
                            <button type="submit" className='cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md mt-4'>
                                Create Asset
                            </button>
                        </form>

                        <button onClick={() => setCreateModalOpen(false)} className='cursor-pointer mt-4 bg-red-500 text-white px-4 py-2 rounded-md w-full'>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default DashboardPage