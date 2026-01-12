"use client";
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from "@/services/api";
import Link from 'next/link';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await api.post('/auth/register', { name, email, password });

            if (data && data.token) {
                Cookies.set('token', data.token, { secure: true, sameSite: 'strict' });
                window.location.href = '/dashboard';
            } else {
                alert('Registration failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed');
            console.error('Error during registration:', error);
        }
    }

    return (
        <main className='flex flex-col min-h-screen items-center justify-center'>
            <div className='bg-white p-10 text-black rounded-lg'>
                <h1 className='text-3xl font-bold text-center mt-10'>Register Page</h1>
                <div className='flex flex-col items-center justify-center mt-10'>
                    <form className='flex flex-col gap-4 w-80' onSubmit={handleSubmit}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' className='p-2 border border-gray-300 rounded-md' />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='p-2 border border-gray-300 rounded-md' />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='p-2 border border-gray-300 rounded-md' />
                        <button type="submit" className='bg-black text-white px-4 py-2 rounded-md mt-4'>Register</button>
                        {error && <p className='text-red-500 mt-2'>{error}</p>}
                    </form>
                </div>
                <p className='text-center mt-4'>Already have an account? <Link href="/login" className='text-blue-500 underline'>Login here</Link></p>
            </div>
        </main>
    )
}

export default RegisterPage