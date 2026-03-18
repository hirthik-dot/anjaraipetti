import { useLanguageStore } from '@/store/languageStore';
import { translations, TranslationKey } from '@/lib/translations';

export const useLanguage = () => {
    const { language, setLanguage, toggleLanguage } = useLanguageStore();

    const t = (key: TranslationKey, params?: Record<string, string>): string => {
        let text: string = translations[language][key] || translations.en[key] || key;
        if (params) {
            Object.entries(params).forEach(([paramKey, value]) => {
                text = text.replace(`{${paramKey}}`, value);
            });
        }
        return text;
    };

    return {
        language,
        setLanguage,
        toggleLanguage,
        t,
        isEnglish: language === 'en',
        isTamil: language === 'ta',
    };
};
