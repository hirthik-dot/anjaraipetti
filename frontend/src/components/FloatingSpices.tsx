'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface SpiceConfig {
  id: string;
  src: string;
  className: string;
  desktop: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width: number;
    rotate: number;
    opacity: number;
  };
  mobile: {
    hide?: boolean;
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width: number;
  };
}

// 1. TOP-LEFT corner: mixed spices pile
// 2. TOP-RIGHT corner: star anise
// 3. BOTTOM-LEFT corner: masala bowl
// 4. BOTTOM-RIGHT corner: whole spices
// 5. LEFT EDGE (middle): dried chilli
// 6. RIGHT EDGE (middle): red chilli
const SPICES: SpiceConfig[] = [
  {
    id: 'top-left',
    src: '/images/1774120898214.png',
    className: 'spice-corner',
    desktop: { top: '-110px', left: '-130px', width: 280, rotate: 15, opacity: 0.9 },
    mobile: { top: '80px', left: '-70px', width: 140 }
  },
  {
    id: 'top-right',
    src: '/images/—Pngtree—seasoning natural star anise spice_5664092.png',
    className: 'spice-corner',
    desktop: { top: '-100px', right: '-120px', width: 240, rotate: -20, opacity: 0.85 },
    mobile: { top: '70px', right: '-60px', width: 120 }
  },
  {
    id: 'bottom-left',
    src: '/images/1774120934893.png',
    className: 'spice-corner',
    desktop: { bottom: '-140px', left: '-130px', width: 300, rotate: -10, opacity: 0.9 },
    mobile: { bottom: '-50px', left: '-60px', width: 150 }
  },
  {
    id: 'bottom-right',
    src: '/images/1774121034474.png',
    className: 'spice-corner',
    desktop: { bottom: '-130px', right: '-120px', width: 280, rotate: 12, opacity: 0.9 },
    mobile: { bottom: '-40px', right: '-50px', width: 140 }
  },
  {
    id: 'left-edge',
    src: '/images/1774120811085.png',
    className: 'spice-edge',
    desktop: { top: '45%', left: '-130px', width: 200, rotate: 90, opacity: 0.75 },
    mobile: { hide: true, width: 0 }
  },
  {
    id: 'right-edge',
    src: '/images/1774120970047.png',
    className: 'spice-edge',
    desktop: { top: '38%', right: '-110px', width: 180, rotate: -80, opacity: 0.75 },
    mobile: { hide: true, width: 0 }
  }
];

export default function FloatingSpices() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!hasMounted || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Apply subtle breathing animation to all rendered spices
      const allSpices = gsap.utils.toArray('.spice-corner, .spice-edge');
      
      allSpices.forEach((el: any) => {
        gsap.to(el, {
          scale: 1.04,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasMounted, isMobile]);

  if (!hasMounted) return null; // Avoid hydration mismatch

  return (
    <div 
      ref={containerRef}
      className="floating-spices-fixed-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50, // Behind the z-10 layout wrapper content
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {SPICES.map((spice) => {
        // Skip hidden edge pieces on mobile
        if (isMobile && spice.mobile.hide) return null;

        const config = isMobile ? spice.mobile : spice.desktop;
        
        return (
          <div
            key={spice.id}
            className={`absolute ${spice.className}`}
            style={{
              // Apply positions based on config, fallback to desktop if unassigned on mobile
              top: config.top ?? spice.desktop.top,
              bottom: config.bottom ?? spice.desktop.bottom,
              left: config.left ?? spice.desktop.left,
              right: config.right ?? spice.desktop.right,
              width: `${config.width}px`,
              opacity: spice.desktop.opacity, // Opacity is consistent
              transform: `rotate(${spice.desktop.rotate}deg)`,
              filter: 'drop-shadow(0 8px 24px rgba(139, 26, 26, 0.25))'
            }}
          >
            <Image
              src={spice.src}
              alt="Corner spice decoration"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
}
