'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DownloadMenuProps {
  onDownload: () => void;
}

const DownloadMenu: React.FC<DownloadMenuProps> = ({ onDownload }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.78 }}
      onClick={onDownload}
      aria-label="Download Photo"
      title="Download Photo"
      className="flex h-9 w-9 items-center justify-center rounded-full
        bg-black/40 text-white backdrop-blur-md shadow-lg
        hover:bg-cyan-600 hover:shadow-cyan-500/40
        transition-colors duration-200"
    >
      <svg className="h-4 w-4 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    </motion.button>
  );
};

export default DownloadMenu;
