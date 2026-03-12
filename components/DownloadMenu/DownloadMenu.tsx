'use client';

import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface DownloadMenuProps {
    onDownload: () => void;
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({ onDownload }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full"
            onClick={onDownload}
        >
            <Download className="w-5 h-5" />
            <span>Download</span>
        </motion.button>
    );
};

export default DownloadMenu;
