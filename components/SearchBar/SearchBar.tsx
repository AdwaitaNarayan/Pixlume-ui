"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 w-full max-w-md mx-auto"
            whileFocus={{ scale: 1.02 }}
        >
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Search photos by tags..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
                type="submit"
                className="px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white"
            >
                Search
            </button>
        </motion.form>
    );
};

export default SearchBar;
