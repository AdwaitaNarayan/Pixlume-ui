'use client';

import React from 'react';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-cyan-400 transition-all duration-300">
                            Pixlume
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors">
                            Gallery
                        </Link>
                        <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                            About
                        </Link>
                    </div>

                    <div className="flex items-center">
                        {/* Admin Login Placeholder or similar */}
                        <button className="px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all text-white">
                            Admin
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
