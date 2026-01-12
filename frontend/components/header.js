"use client"
import Link from 'next/link'
import Cookies from 'js-cookie'

function Header() {
    const token = Cookies.get('token');

    const handleLogout = () => {
        Cookies.remove('token');
        window.location.href = '/login';
    }

    return (
        <header className='flex flex-row items-center justify-between rounded-b-lg bg-white text-black max-w-7xl mx-auto p-4 text-xl'>
            <Link href="/">
                <h1 className='text-2xl'>THOB</h1>
            </Link>

            <nav>
                <ul className='flex gap-4'>
                    {/* <Link href="/home" className='hover:underline transition-all duration-200'>
                        <li>Home</li>
                    </Link> */}
                    <Link href="/dashboard" className='hover:underline transition-all duration-200'>
                        <li>Dashboard</li>
                    </Link>
                    {/* <Link href="/about" className='hover:underline transition-all duration-200'>
                        <li>About</li>
                    </Link>
                    <Link href="/contact" className='hover:underline transition-all duration-200'>
                        <li>Contact</li>
                    </Link> */}
                </ul>
            </nav>

            {token ?
                <div className='flex flex-col sm:flex-row items-center justify-center gap-2'>
                    <Link href="/profile">
                        <button className='bg-black text-white px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-xl rounded-sm cursor-pointer'>Profile</button>
                    </Link>
                    <button onClick={handleLogout} className='bg-black text-white px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-xl rounded-sm sm:ml-2 cursor-pointer'>Logout</button>
                </div>
                :
                <div className='flex flex-col items-center justify-center gap-2'>
                    <Link href="/login">
                        <button className='bg-black text-white px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-xl rounded-sm cursor-pointer'>Login</button>
                    </Link>
                    <Link href="/register">
                        <button className='bg-black text-white px-2 sm:px-4 py-1 sm:py-2 text-base sm:text-xl rounded-sm ml-2 cursor-pointer'>Register</button>
                    </Link>
                </div>
            }

        </header>
    )
}

export default Header