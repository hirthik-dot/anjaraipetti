import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/lib/translations';

interface LanguageState {
    language: Language;
    setLanguage: (language: Language) => void;
    toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en',

            setLanguage: (language: Language) => set({ language }),

            toggleLanguage: () => {
                const current = get().language;
                set({ language: current === 'en' ? 'ta' : 'en' });
            },
        }),
        {
            name: 'anjaraipetti-language',
        }
    )
);
