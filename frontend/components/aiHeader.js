"use client"
import Link from 'next/link'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Terminal, User, LogOut, LayoutDashboard, Cpu } from 'lucide-react'

function AiHeader() {
    const pathname = usePathname();
    const token = Cookies.get('token');

    const handleLogout = () => {
        Cookies.remove('token');
        window.location.href = '/ai/login'; // Redirect to AI login
    }

    const navLinks = [
        { href: '/ai/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors">
                        <Cpu className="w-5 h-5 text-zinc-100" />
                    </div>
                    <span className="text-lg font-medium text-zinc-100 font-mono tracking-tight">THOB<span className="text-zinc-500">_AI</span></span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link key={link.href} href={link.href}>
                                <div className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'}`}>
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-zinc-800/50 rounded-lg -z-10 border border-zinc-700/50"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="flex items-center gap-3">
                    {token ? (
                        <>
                            <Link href="/ai/profile">
                                <button className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-800 transition-all">
                                    <User className="w-5 h-5" />
                                </button>
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : ( 
                        <div className="flex gap-3">
                             <Link href="/ai/login">
                                <button className="px-4 py-2 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors">
                                    Login
                                </button>
                            </Link>
                            <Link href="/ai/register">
                                <button className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
                                    <Terminal className='w-4 h-4'/>
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </motion.header>
    )
}

export default AiHeader
