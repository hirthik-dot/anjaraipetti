'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Phone, MapPin, CreditCard } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentOptions from '@/components/checkout/PaymentOptions';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const items = useCartStore((s) => s.items);
    const clearCart = useCartStore((s) => s.clearCart);
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const { sendOTP, verifyOTP, resendOTP } = useAuthStore();

    const [step, setStep] = useState(isAuthenticated ? 2 : 1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [phoneVerified, setPhoneVerified] = useState(isAuthenticated);
    const [paymentMode, setPaymentMode] = useState<'RAZORPAY' | 'COD'>('COD');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [timer, setTimer] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const [address, setAddress] = useState({
        name: user?.name || '',
        email: user?.email || '',
        line1: user?.addresses?.[0]?.line1 || '',
        line2: user?.addresses?.[0]?.line2 || '',
        city: user?.addresses?.[0]?.city || '',
        state: user?.addresses?.[0]?.state || 'Tamil Nadu',
        pincode: user?.addresses?.[0]?.pincode || '',
    });

    const handleAddressChange = (field: string, value: string) => {
        setAddress((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleSendOTP = async () => {
        if (!/^[6-9]\d{9}$/.test(phone)) {
            toast.error('Enter a valid 10-digit Indian phone number');
            return;
        }

        setIsLoading(true);
        try {
            await sendOTP(phone);
            setOtpSent(true);
            setTimer(60);
            toast.success('OTP sent successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        setIsLoading(true);
        try {
            await resendOTP(phone);
            setTimer(60);
            toast.success('OTP resent successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpSent) {
            toast.error('Please request an OTP first');
            return;
        }

        if (otp.length !== 6) {
            toast.error('Enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            await verifyOTP(phone, otp);
            setPhoneVerified(true);
            setStep(2);
            toast.success('Phone verified successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const validateAddress = () => {
        const newErrors: Record<string, string> = {};
        if (!address.name.trim()) newErrors.name = 'Name is required';
        if (!address.line1.trim()) newErrors.line1 = 'Address is required';
        if (!address.city.trim()) newErrors.city = 'City is required';
        if (!address.state.trim()) newErrors.state = 'State is required';
        if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateAddress()) return;
        setIsLoading(true);

        try {
            const orderData = {
                items: items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                })),
                address: {
                    line1: address.line1,
                    line2: address.line2 || undefined,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                },
                paymentMode,
                name: address.name,
                email: address.email || undefined,
            };

            const res = await api.post('/orders', orderData);

            if (res.data.success) {
                const order = res.data.data.order;
                clearCart();
                router.push(`/order-success?orderNumber=${order.orderNumber}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        router.push('/cart');
        return null;
    }

    const steps = [
        { num: 1, label: t('step1Phone'), icon: Phone },
        { num: 2, label: t('step2Details'), icon: MapPin },
        { num: 3, label: t('step3Payment'), icon: CreditCard },
    ];

    return (
        <div className="pt-8 md:pt-12 pb-24 bg-[#FAF8F5] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl lg:text-5xl font-serif text-[#2A2626] mb-12 text-center lg:text-left">{t('checkout')}</h1>

                {/* Step indicator */}
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-16 overflow-x-auto pb-4">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center shrink-0">
                            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-[40px] text-[12px] font-medium uppercase tracking-widest transition-all border ${step >= s.num
                                    ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                                    : 'bg-white text-[#6B6363] border-[#E8E3DD]'
                                }`}>
                                {step > s.num ? <Check className="w-4 h-4" strokeWidth={2} /> : <s.icon className="w-4 h-4" strokeWidth={1.5} />}
                                <span className="hidden sm:inline">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && <div className={`w-8 h-[1px] mx-2 ${step > s.num ? 'bg-[#8B1A1A]' : 'bg-[#E8E3DD]'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 xl:col-span-8 space-y-10">
                        {/* Step 1: Phone */}
                        {step === 1 && (
                            <div className="bg-white rounded-[8px] p-8 lg:p-12 border border-[#E8E3DD] shadow-sm shadow-[#2A2626]/5 animate-fade-in">
                                <h2 className="text-2xl font-serif text-[#2A2626] mb-8">{t('step1Phone')}</h2>
                                <div className="max-w-md space-y-6">
                                    <div>
                                        <label className="text-[11px] font-semibold text-[#6B6363] uppercase tracking-widest mb-2 block">{t('enterPhone')}</label>
                                        <div className="flex gap-3">
                                            <span className="flex items-center px-4 bg-[#FAF8F5] border border-[#E8E3DD] rounded-[4px] text-[14px] font-medium text-[#2A2626]">+91</span>
                                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="flex-1 px-4 py-3 rounded-[4px] border border-[#E8E3DD] bg-[#FAF8F5] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all text-[#2A2626] text-[15px]" placeholder="9876543210" maxLength={10} disabled={otpSent} />
                                        </div>
                                    </div>
                                    {!otpSent && (
                                        <button onClick={handleSendOTP} disabled={isLoading} className="w-full py-3.5 bg-[#8B1A1A] text-white text-[12px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] disabled:opacity-50 transition-colors">
                                            {isLoading ? 'Sending...' : t('sendOTP')}
                                        </button>
                                    )}
                                    
                                    {otpSent && (
                                        <div className="pt-6 border-t border-[#E8E3DD] animate-fade-in">
                                            <label className="text-[11px] font-semibold text-[#6B6363] uppercase tracking-widest mb-2 block">{t('enterOTP')}</label>
                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full px-4 py-3 rounded-[4px] border border-[#E8E3DD] bg-[#FAF8F5] focus:outline-none focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] transition-all text-[#2A2626] text-[15px] text-center tracking-[0.5em] mb-4" placeholder="------" maxLength={6} />
                                            
                                            <button onClick={handleVerifyOTP} disabled={isLoading} className="w-full py-3.5 bg-[#8B1A1A] text-white text-[12px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] disabled:opacity-50 transition-colors mb-4">
                                                {isLoading ? 'Verifying...' : t('verifyOTP')}
                                            </button>

                                            <div className="text-center">
                                                <button
                                                    onClick={handleResendOTP}
                                                    disabled={timer > 0 || isLoading}
                                                    className={`text-[12px] font-medium ${timer > 0 ? 'text-[#AFA8A3] cursor-not-allowed' : 'text-[#8B1A1A] hover:underline hover:text-[#C8962E]'}`}
                                                >
                                                    {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address */}
                        {step === 2 && (
                            <div className="bg-white rounded-[8px] p-8 lg:p-12 border border-[#E8E3DD] shadow-sm shadow-[#2A2626]/5 animate-fade-in">
                                <h2 className="text-2xl font-serif text-[#2A2626] mb-8">{t('step2Details')}</h2>
                                <AddressForm values={address} onChange={handleAddressChange} errors={errors} />
                                <div className="mt-10 pt-8 border-t border-[#E8E3DD]">
                                    <button onClick={() => { if (validateAddress()) setStep(3); }} className="w-full sm:w-auto px-12 py-4 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] transition-colors float-right">
                                        Continue to Payment
                                    </button>
                                    <div className="clear-both"></div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-[8px] p-8 lg:p-12 border border-[#E8E3DD] shadow-sm shadow-[#2A2626]/5 animate-fade-in">
                                <h2 className="text-2xl font-serif text-[#2A2626] mb-8">{t('step3Payment')}</h2>
                                <PaymentOptions selected={paymentMode} onChange={setPaymentMode} />
                                <div className="mt-10 pt-8 border-t border-[#E8E3DD]">
                                    <button onClick={handlePlaceOrder} disabled={isLoading} className="w-full sm:w-auto px-12 py-4 bg-[#8B1A1A] text-white text-[13px] font-medium uppercase tracking-wider rounded-[4px] hover:bg-[#661010] disabled:opacity-50 transition-colors float-right flex items-center justify-center gap-3">
                                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                                        {isLoading ? 'Processing...' : t('placeOrder')}
                                    </button>
                                    <div className="clear-both"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <div className="sticky top-32">
                            <OrderSummary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
