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
            <div className="relative aspect-square rounded-[4px] overflow-hidden bg-[#FAF8F5] border border-[#E8E3DD]">
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
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIndex(i)}
                            className={`relative w-20 h-20 rounded-[4px] overflow-hidden border shrink-0 transition-all duration-300 ${
                                selectedIndex === i
                                    ? 'border-[#8B1A1A] opacity-100'
                                    : 'border-[#E8E3DD] opacity-60 hover:opacity-100 hover:border-[#6B6363]'
                            }`}
                        >
                            <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
