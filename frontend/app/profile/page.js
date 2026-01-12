"use client"
import { useState, useEffect } from 'react'
import { useAuth } from "@/contexts/auth";
import Header from '@/components/header';
import api from "@/services/api";

function ProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const { user: authUser, refreshUser, loading } = useAuth();

    const fetchUserProfile = async () => {
        try {
            const { data } = await api.get('/users/me');
            const user = data;

            if (user) {
                setName(user.name || '');
                setEmail(user.email || '');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        if (authUser) {
            setName(authUser.name || '');
            setEmail(authUser.email || '');
        } else {
            fetchUserProfile();
        }
    }, [authUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');
        setSaving(true);

        if (!authUser || !authUser.id) {
            setError('User not authenticated');
            setSaving(false);
            return;
        }

        try {
            await api.put(`/users/${authUser.id}`, { name, email });
            if (refreshUser) {
                await refreshUser();
            }
            setSuccess('Profile updated successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Profile update failed');
            console.error('Error during profile update:', error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className='flex flex-col min-h-screen items-center justify-center'>
                    <p>Loading...</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            <main className='flex flex-col h-[90vh] items-center justify-center'>
                <div className='bg-white p-4 text-black rounded-lg w-[70%] max-w-md'>
                    <h1 className='text-3xl font-bold text-center '>Profile Page</h1>
                    <div className='flex flex-col items-center justify-center mt-5'>
                        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className='p-2 border border-gray-300 rounded-md' />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='p-2 border border-gray-300 rounded-md' />
                            <button type="submit" disabled={saving} className="cursor-pointer bg-black text-white px-4 py-2 rounded-md mt-4">{saving ? "Saving..." : "Update Profile"}</button>
                            {error && <p className='text-red-500 mt-2'>{error}</p>}
                            {success && <p className='text-green-500 mt-2'>{success}</p>}
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ProfilePage