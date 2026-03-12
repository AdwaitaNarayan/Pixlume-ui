'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface PhotoCardProps {
    id: string;
    src: string; // image URL
    alt?: string;
    title?: string;
    onDownload?: (id: string) => void;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ id, src, alt = 'Photo', title, onDownload }) => {
    return (
        <motion.div
            className="relative rounded-lg overflow-hidden shadow-lg bg-gray-900"
            whileHover={{ scale: 1.02 }}
        >
            <Image
                src={src}
                alt={alt}
                width={400}
                height={300}
                className="object-cover w-full h-64"
                priority
            />
            {title && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                    {title}
                </div>
            )}
            {onDownload && (
                <button
                    onClick={() => onDownload(id)}
                    className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full"
                >
                    <Download className="w-5 h-5" />
                </button>
            )}
        </motion.div>
    );
};

export default PhotoCard;
