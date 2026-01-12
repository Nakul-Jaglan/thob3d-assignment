"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Database, Cpu, Globe, Lock } from 'lucide-react';
import AiHeader from '@/components/aiHeader';

const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
            className="absolute inset-0 opacity-[0.15]" 
            style={{ 
                backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
            }}
        />
    </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-zinc-950 border border-zinc-900 hover:border-zinc-700 p-6 rounded-lg transition-colors group"
    >
        <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 mb-4 group-hover:bg-zinc-800 transition-colors">
            <Icon className="text-zinc-400 group-hover:text-white transition-colors" size={24} />
        </div>
        <h3 className="text-lg font-bold text-zinc-100 mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed font-mono">{desc}</p>
    </motion.div>
);

const StatItem = ({ value, label }) => (
    <div className="flex flex-col border-l border-zinc-800 pl-6">
        <span className="text-3xl font-bold text-white mb-1">{value}</span>
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{label}</span>
    </div>
);

export default function AiHomePage() {
    return (
        <div className="min-h-screen flex flex-col bg-black text-zinc-200">
            <AiHeader />
            
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 px-6 border-b border-zinc-900">
                <GridBackground />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm text-xs text-zinc-400 mb-8 font-mono">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            SYSTEM OPERATIONAL // V.2.0.4
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            SECURE ASSET <br />
                            <span className="text-zinc-500">INFRASTRUCTURE</span>
                        </h1>
                        
                        <p className="text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed font-light">
                            Advanced neural storage for digital entities. 
                            Store, categorize, and deploy assets with military-grade encryption and zero-latency access.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <Link href="/ai/login">
                                <button className="bg-white hover:bg-zinc-200 text-black px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-all hover:translate-x-1">
                                    Initialize System <ArrowRight size={18} />
                                </button>
                            </Link>
                            <Link href="/ai/dashboard">
                                <button className="bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border border-zinc-800 px-8 py-4 rounded-lg font-bold transition-colors">
                                    View Documentation
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Band */}
            <section className="border-b border-zinc-900 bg-zinc-950/50">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem value="99.9%" label="Uptime" />
                    <StatItem value="<0.1ms" label="Latency" />
                    <StatItem value="AES-256" label="Encryption" />
                    <StatItem value="Global" label="CDN Nodes" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Core Protocols</h2>
                        <p className="text-zinc-500 max-w-lg">
                            Our architecture is built on redundancy and speed. 
                            Deploy assets closer to the edge with our decentralized grid.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard 
                            icon={Database}
                            title="Neural Indexing"
                            desc="Automated tagging and categorization via lightweight ml-models running on the edge."
                            delay={0.1}
                        />
                        <FeatureCard 
                            icon={Shield}
                            title="Immutable Security"
                            desc="Assets are secured using enterprise-grade protocols. Access logs are immutable."
                            delay={0.2}
                        />
                        <FeatureCard 
                            icon={Zap}
                            title="Instant Deployment"
                            desc="Push assets to production environments instantly via our global API endpoints."
                            delay={0.3}
                        />
                        <FeatureCard 
                            icon={Cpu}
                            title="Smart Processing"
                            desc="On-the-fly format conversion and compression for optimized delivery."
                            delay={0.4}
                        />
                        <FeatureCard 
                            icon={Globe}
                            title="Edge Network"
                            desc="Content delivery via 200+ edge locations ensuring minimal latency worldwide."
                            delay={0.5}
                        />
                        <FeatureCard 
                            icon={Lock}
                            title="Access Control"
                            desc="Granular permission settings for teams and external stakeholders."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to deploy?</h2>
                    <p className="text-zinc-500 mb-8 mx-auto max-w-xl">
                        Join the network today. Initialize your secure container and start uploading assets immediately.
                    </p>
                    <Link href="/ai/register">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-zinc-100 hover:bg-white text-black px-10 py-4 rounded-lg font-bold text-lg shadow-xl shadow-white/5"
                        >
                            Start Free Trial
                        </motion.button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-900 py-12 px-6 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-zinc-500 font-mono text-xs">
                        © 2026 THOB AI SYSTEMS. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex gap-6 text-zinc-500 font-mono text-xs">
                        <Link href="#" className="hover:text-zinc-300">PRIVACY_PROTOCOL</Link>
                        <Link href="#" className="hover:text-zinc-300">TERMS_OF_SERVICE</Link>
                        <Link href="#" className="hover:text-zinc-300">STATUS</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}