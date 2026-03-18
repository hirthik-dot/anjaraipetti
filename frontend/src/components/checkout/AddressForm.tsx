'use client';

import { useLanguage } from '@/hooks/useLanguage';

interface AddressFormProps {
    values: {
        name: string;
        email: string;
        line1: string;
        line2: string;
        city: string;
        state: string;
        pincode: string;
    };
    onChange: (field: string, value: string) => void;
    errors: Record<string, string>;
}

export default function AddressForm({ values, onChange, errors }: AddressFormProps) {
    const { t } = useLanguage();

    const inputClass = (field: string) =>
        `w-full px-4 py-3 rounded-[4px] border ${
            errors[field] ? 'border-red-400 bg-red-50/50' : 'border-[#E8E3DD] bg-[#FAF8F5]'
        } text-[#2A2626] text-[13px] placeholder-[#6B6363]/50 focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all`;

    const labelClass = "text-[11px] font-semibold text-[#6B6363] mb-2 block uppercase tracking-wider";

    return (
        <div className="space-y-6" id="address-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>{t('fullName')} *</label>
                    <input
                        type="text"
                        value={values.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className={inputClass('name')}
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.name}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t('email')}</label>
                    <input
                        type="email"
                        value={values.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className={inputClass('email')}
                        placeholder="hello@example.com"
                    />
                    {errors.email && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.email}</p>}
                </div>
            </div>

            <div>
                <label className={labelClass}>{t('addressLine1')} *</label>
                <input
                    type="text"
                    value={values.line1}
                    onChange={(e) => onChange('line1', e.target.value)}
                    className={inputClass('line1')}
                    placeholder="123 Street Name"
                />
                {errors.line1 && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.line1}</p>}
            </div>

            <div>
                <label className={labelClass}>{t('addressLine2')} <span className="text-[9px] lowercase opacity-50 ml-1 font-normal tracking-wide">(optional)</span></label>
                <input
                    type="text"
                    value={values.line2}
                    onChange={(e) => onChange('line2', e.target.value)}
                    className={inputClass('line2')}
                    placeholder="Apartment, suite, etc."
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                    <label className={labelClass}>{t('city')} *</label>
                    <input
                        type="text"
                        value={values.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        className={inputClass('city')}
                        placeholder="Chennai"
                    />
                    {errors.city && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.city}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t('state')} *</label>
                    <input
                        type="text"
                        value={values.state}
                        onChange={(e) => onChange('state', e.target.value)}
                        className={inputClass('state')}
                        placeholder="Tamil Nadu"
                    />
                    {errors.state && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.state}</p>}
                </div>
                <div>
                    <label className={labelClass}>{t('pincode')} *</label>
                    <input
                        type="text"
                        value={values.pincode}
                        onChange={(e) => onChange('pincode', e.target.value)}
                        className={inputClass('pincode')}
                        placeholder="600001"
                        maxLength={6}
                    />
                    {errors.pincode && <p className="text-[#8B1A1A] text-[11px] mt-2 font-medium">{errors.pincode}</p>}
                </div>
            </div>
        </div>
    );
}
