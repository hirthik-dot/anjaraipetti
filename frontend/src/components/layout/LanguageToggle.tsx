'use client';

import { useLanguageStore } from '@/store/languageStore';

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguageStore();

    return (
        <button
            onClick={toggleLanguage}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm font-medium"
            aria-label="Toggle language"
            id="language-toggle"
        >
            <span className={`transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}>
                EN
            </span>
            <span style={{ color: '#C8962E' }}>/</span>
            <span className={`transition-opacity font-tamil ${language === 'ta' ? 'opacity-100' : 'opacity-50'}`}>
                தமிழ்
            </span>
        </button>
    );
}
