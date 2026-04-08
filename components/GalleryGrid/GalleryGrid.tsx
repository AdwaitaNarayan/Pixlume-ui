'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PhotoCard from '../PhotoCard';

interface Photo {
    id: string;
    thumbnail_url: string;
    title: string;
    image_4k_url?: string;
    // ... add other necessary fields or use the Photo type from api
}

interface GalleryGridProps {
    photos: any[]; // Using any for simplicity in this specific fix, or import Photo
    onPhotoClick: (photo: any) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoClick }) => {
    return (
        <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4 [column-fill:_balance]">
            {photos.map((photo) => (
                <div key={photo.id} className="mb-6 break-inside-avoid">
                    <PhotoCard
                        photo={photo}
                        onClick={() => onPhotoClick(photo)}
                    />
                </div>
            ))}
        </div>
    );
};

export default GalleryGrid;
