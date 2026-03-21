'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types';
import api from '@/lib/api';

export default function AnnouncementTicker() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/site-settings');
                setSettings(res.data?.data?.settings || null);
            } catch {
                // Use defaults
                setSettings({
                    id: 1,
                    tickerMessages: ['Minimum order value is Rs.250/-', 'COD Available for all orders'],
                    tickerEnabled: true,
                    tickerSpeed: 'normal',
                });
            }
        };
        fetchSettings();
    }, []);

    if (!settings || !settings.tickerEnabled) return null;

    const messages: string[] = Array.isArray(settings.tickerMessages)
        ? settings.tickerMessages
        : JSON.parse(settings.tickerMessages as unknown as string);

    if (messages.length === 0) return null;

    const speedMap: Record<string, string> = {
        slow: '30s',
        normal: '20s',
        fast: '12s',
    };

    const tickerSpeed = speedMap[settings.tickerSpeed] || '20s';
    const separator = ' • ';
    const fullText = messages.join(separator) + separator;
    // Duplicate for seamless loop
    const doubledText = fullText + fullText;

    return (
        <div
            className="w-full overflow-hidden"
            style={{
                backgroundColor: '#1a5c2a',
                height: '36px',
            }}
            id="announcement-ticker"
        >
            <div className="h-full flex items-center overflow-hidden">
                <div
                    className="marquee-track whitespace-nowrap"
                    style={{
                        '--ticker-speed': tickerSpeed,
                    } as React.CSSProperties}
                >
                    <span
                        className="text-white font-bold"
                        style={{ fontSize: '13px' }}
                    >
                        {doubledText}
                    </span>
                </div>
            </div>
        </div>
    );
}
