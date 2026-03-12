'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PhotoCard from '../PhotoCard/PhotoCard';

interface Photo {
    id: string;
    src: string;
    alt?: string;
    title?: string;
}

interface GalleryGridProps {
    photos: Photo[];
    onDownload?: (id: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onDownload }) => {
    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4"
            whileHover={{ opacity: 1 }}
        >
            {photos.map((photo) => (
                <PhotoCard
                    key={photo.id}
                    id={photo.id}
                    src={photo.src}
                    alt={photo.alt}
                    title={photo.title}
                    onDownload={onDownload}
                />
            ))}
        </motion.div>
    );
};

export default GalleryGrid;
