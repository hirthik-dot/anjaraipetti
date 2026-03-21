'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductImageGalleryProps {
    images: string[];
    name: string;
}

export default function ProductImageGallery({ images, name }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-[#FAF8F5] border border-[#E8E3DD] rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-[#6B6363]/30" strokeWidth={1} />
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Main Image - 1:1 aspect ratio */}
            <div className="relative aspect-square bg-white border border-[#E8E3DD] rounded-lg overflow-hidden">
                <Image
                    src={images[selectedIndex]}
                    alt={name}
                    fill
                    className="object-contain p-4 md:p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={selectedIndex === 0}
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scroll-snap-x">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative shrink-0 snap-start rounded border-2 transition-all overflow-hidden ${
                                selectedIndex === index
                                    ? 'border-[#8B1A1A] shadow-sm'
                                    : 'border-[#E8E3DD] hover:border-[#C8962E]'
                            }`}
                            style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px' }}
                        >
                            <Image
                                src={img}
                                alt={`${name} thumbnail ${index + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
