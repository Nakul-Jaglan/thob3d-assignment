"use client";
import { useState } from 'react';
import Cookies from 'js-cookie';
import api from "@/services/api";

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (data && data.token) {
                Cookies.set('token', data.token, { secure: true, sameSite: 'strict' });
                window.location.href = '/dashboard';
            } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
            console.error('Error during login:', error);
        }
    }

    return (
        <section className='flex flex-col min-h-screen items-center justify-center'>
            <div className='bg-white p-10 text-black rounded-lg'>
                <h1 className='text-3xl font-bold text-center mt-10'>Login Page</h1>
                <div className='flex flex-col items-center justify-center mt-10'>
                    <form className='flex flex-col gap-4 w-80' onSubmit={handleSubmit}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' className='p-2 border border-gray-300 rounded-md' />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='p-2 border border-gray-300 rounded-md' />
                        <button type="submit" className='bg-black text-white px-4 py-2 rounded-md mt-4'>Login</button>
                        {error && <p className='text-red-500 mt-2'>{error}</p>}
                    </form>
                </div>
                <p className='text-center mt-4'>Don't have an account? <a href="/register" className='text-blue-500 underline'>Register here</a></p>
            </div>
        </section>
    )
}

export default LoginPage