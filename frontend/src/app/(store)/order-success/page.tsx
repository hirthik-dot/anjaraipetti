'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

function OrderSuccessContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get('orderNumber');

    return (
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
            <div className="max-w-lg w-full mx-auto px-4 text-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8 animate-bounce-in">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                </div>

                <h1 className="text-3xl font-heading font-bold text-[--color-brown] mb-3">
                    {t('orderSuccess')}
                </h1>

                {orderNumber && (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-[--color-cream] rounded-2xl mb-4">
                        <Package className="w-5 h-5 text-[--color-secondary]" />
                        <span className="text-sm text-[--color-brown]/60">{t('orderNumber')}:</span>
                        <span className="font-mono font-bold text-[--color-primary]">{orderNumber}</span>
                    </div>
                )}

                <p className="text-[--color-brown]/60 mb-10">{t('thankYou')}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/orders" className="flex items-center justify-center gap-2 px-6 py-3 bg-[--color-primary] text-white font-semibold rounded-xl hover:bg-[--color-primary-light] transition-colors">
                        {t('trackOrder')}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[--color-brown]/10 text-[--color-brown] font-semibold rounded-xl hover:bg-[--color-cream] transition-colors">
                        {t('continueShopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="pt-24 pb-16 min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[--color-cream] border-t-[--color-primary] rounded-full animate-spin" /></div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
