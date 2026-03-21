'use client';

import { useState, useEffect } from 'react';
import { Plus, X, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function TickerManagerPage() {
    const [messages, setMessages] = useState<string[]>([]);
    const [enabled, setEnabled] = useState(true);
    const [speed, setSpeed] = useState<string>('normal');
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/site-settings');
                const settings = res.data?.data?.settings;
                if (settings) {
                    const msgs = Array.isArray(settings.tickerMessages)
                        ? settings.tickerMessages
                        : JSON.parse(settings.tickerMessages || '[]');
                    setMessages(msgs);
                    setEnabled(settings.tickerEnabled ?? true);
                    setSpeed(settings.tickerSpeed || 'normal');
                }
            } catch {
                // Use defaults
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const addMessage = () => {
        const trimmed = newMessage.trim();
        if (!trimmed) return;
        if (trimmed.length > 80) {
            toast.error('Max 80 characters');
            return;
        }
        setMessages([...messages, trimmed]);
        setNewMessage('');
    };

    const removeMessage = (index: number) => {
        setMessages(messages.filter((_, i) => i !== index));
    };

    const reorder = (index: number, direction: 'up' | 'down') => {
        const newMessages = [...messages];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= newMessages.length) return;
        [newMessages[index], newMessages[swapIndex]] = [newMessages[swapIndex], newMessages[index]];
        setMessages(newMessages);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/site-settings', {
                tickerMessages: messages,
                tickerEnabled: enabled,
                tickerSpeed: speed,
            });
            toast.success('Ticker settings saved');
        } catch {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-[#E8E3DD] border-t-[#8B1A1A] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 font-sans fade-in-up">
            <div className="border-b border-[#E8E3DD] pb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-[#2A2626]">Announcement Ticker</h1>
                <p className="text-[14px] text-[#6B6363] mt-2 font-light">
                    Manage the scrolling announcement bar below the navigation.
                </p>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-lg border border-[#E8E3DD] shadow-sm space-y-6">
                {/* Show Ticker Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[14px] font-medium text-[#2A2626]">Show Ticker</span>
                        <p className="text-[12px] text-[#6B6363]">Hide the ticker bar site-wide when off</p>
                    </div>
                    <button
                        onClick={() => setEnabled(!enabled)}
                        className={`toggle-switch ${enabled ? 'active' : ''}`}
                    />
                </div>

                {/* Speed Selector */}
                <div>
                    <label className="text-[11px] font-semibold text-[#6B6363] mb-3 block uppercase tracking-wider">
                        Scroll Speed
                    </label>
                    <div className="flex gap-2">
                        {[
                            { value: 'slow', label: 'Slow' },
                            { value: 'normal', label: 'Normal' },
                            { value: 'fast', label: 'Fast' },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSpeed(opt.value)}
                                className={`px-5 py-2.5 rounded text-[13px] font-medium transition-all min-h-[44px] ${
                                    speed === opt.value
                                        ? 'bg-[#8B1A1A] text-white'
                                        : 'bg-[#FAF8F5] text-[#6B6363] border border-[#E8E3DD] hover:border-[#8B1A1A]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages List */}
                <div>
                    <label className="text-[11px] font-semibold text-[#6B6363] mb-3 block uppercase tracking-wider">
                        Messages
                    </label>
                    <div className="space-y-2">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex items-center gap-2 p-3 bg-[#FAF8F5] rounded border border-[#E8E3DD]">
                                <span className="flex-1 text-[14px] text-[#2A2626] truncate">{msg}</span>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => reorder(index, 'up')}
                                        disabled={index === 0}
                                        className="w-8 h-8 flex items-center justify-center rounded text-[#6B6363] hover:bg-white disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => reorder(index, 'down')}
                                        disabled={index === messages.length - 1}
                                        className="w-8 h-8 flex items-center justify-center rounded text-[#6B6363] hover:bg-white disabled:opacity-30 transition-colors"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => removeMessage(index)}
                                        className="w-8 h-8 flex items-center justify-center rounded text-[#6B6363] hover:text-[#8B1A1A] hover:bg-red-50 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Message */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value.slice(0, 80))}
                            onKeyDown={e => e.key === 'Enter' && addMessage()}
                            placeholder="Add a new message..."
                            className="w-full px-4 py-3 rounded border border-[#E8E3DD] bg-[#FAF8F5] text-[14px] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all min-h-[44px]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#6B6363]">
                            {newMessage.length}/80
                        </span>
                    </div>
                    <button
                        onClick={addMessage}
                        disabled={!newMessage.trim()}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-[#218F5B] text-white text-[13px] font-medium rounded hover:bg-[#1a7048] disabled:opacity-50 transition-all min-h-[44px]"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>

                {/* Save */}
                <div className="pt-4 border-t border-[#E8E3DD]">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded hover:bg-[#661010] disabled:opacity-50 transition-all min-h-[44px]"
                    >
                        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
