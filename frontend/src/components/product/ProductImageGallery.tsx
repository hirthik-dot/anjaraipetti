'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
    images: string[];
    name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (images.length === 0) return null;

    return (
        <div className="space-y-4" id="product-image-gallery">
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg">
                <Image
                    src={images[selectedIndex]}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                selectedIndex === i
                                    ? 'border-[--color-primary] shadow-lg scale-105'
                                    : 'border-transparent hover:border-[--color-secondary]/50 opacity-70 hover:opacity-100'
                            }`}
                        >
                            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
