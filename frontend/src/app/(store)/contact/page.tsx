'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
    const { t } = useLanguage();
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div className="pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-heading font-bold text-[--color-brown] mb-3">{t('contactTitle')}</h1>
                    <p className="text-[--color-brown]/60 max-w-lg mx-auto">{t('contactDesc')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {[
                            { icon: MapPin, title: 'Address', info: 'Tamil Nadu, India' },
                            { icon: Phone, title: 'Phone', info: '+91 98765 43210' },
                            { icon: Mail, title: 'Email', info: 'hello@anjaraipetti.com' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm">
                                <div className="w-14 h-14 rounded-2xl bg-[--color-primary]/10 flex items-center justify-center shrink-0">
                                    <item.icon className="w-7 h-7 text-[--color-primary]" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-[--color-brown]">{item.title}</h3>
                                    <p className="text-[--color-brown]/60">{item.info}</p>
                                </div>
                            </div>
                        ))}

                        <div className="p-6 bg-gradient-to-br from-[--color-primary] to-[--color-brown] rounded-2xl text-white">
                            <h3 className="text-xl font-heading font-bold mb-2">Business Hours</h3>
                            <p className="text-white/70 text-sm">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                            <p className="text-white/70 text-sm">Sunday: 10:00 AM - 5:00 PM</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-md space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-[--color-brown]/70 mb-1 block">Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[--color-brown]/10 focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20 focus:border-[--color-primary] transition-all" required />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-[--color-brown]/70 mb-1 block">Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[--color-brown]/10 focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20 focus:border-[--color-primary] transition-all" required />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-[--color-brown]/70 mb-1 block">Message</label>
                            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-[--color-brown]/10 focus:outline-none focus:ring-2 focus:ring-[--color-primary]/20 focus:border-[--color-primary] transition-all min-h-[150px]" required />
                        </div>
                        <button type="submit" className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[--color-primary] to-[--color-primary-light] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all">
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
