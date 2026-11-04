'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { authService, profileService } from '@/services';
import { RefreshCw, CheckCircle2, ShieldCheck, Mail, MessageCircle, AlertCircle } from 'lucide-react';

function ConfirmContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { otpConfirm, refreshUser } = useAuth();
    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const code = searchParams.get('code');

    useEffect(() => {
        const attemptConfirmation = async () => {
            if (!code) {
                setStatus('error');
                setErrorMessage('Tasdiqlash kodi topilmadi');
                return;
            }

            // Get identifier from localStorage
            const identifier = localStorage.getItem('auth_identifier');

            if (!identifier) {
                console.error('No identifier found in localStorage');
                // Don't show error immediately, just wait for user to re-log if needed
                setStatus('error');
                setErrorMessage('Email yoki telefon topilmadi. Iltimos, login sahifasidan qayta urinib ko\'ring.');
                return;
            }

            try {
                setStatus('loading');
                await otpConfirm(identifier, code);

                // Fetch profile to see if user needs registration (name entry)
                const userProfile = await profileService.getUserProfile();
                await refreshUser(); // sync context State

                if (!userProfile.name) {
                    // New user, redirect to login page with register state
                    // We need a way for the login page to pick up the register step
                    router.push('/auth/login?step=register');
                } else {
                    setStatus('success');
                    // Redirect on success after a short delay
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 1500);
                }
            } catch (error: any) {
                console.error('Auto-confirmation failed:', error);
                setStatus('error');
                setErrorMessage(error.message || 'Kodni tasdiqlashda xatolik yuz berdi');
            }
        };

        attemptConfirmation();
    }, [code, otpConfirm, router, refreshUser]);

    return (
        <div className="text-center">
            {status === 'loading' && (
                <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-primary/10 text-primary mb-4 animate-pulse">
                        <RefreshCw className="animate-spin" size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tasdiqlanmoqda...</h1>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Sizning kodingiz tekshirilmoqda. Iltimos, bir necha soniya kuting.
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-emerald-50 text-emerald-500 mb-4 animate-float">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-emerald-900 tracking-tight">Muvaffaqiyatli!</h1>
                    <p className="text-emerald-600 font-medium max-w-sm mx-auto leading-relaxed">
                        Kodingiz tasdiqlandi. Siz dashboardga yo'naltirilmoqdasiz...
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-red-50 text-red-500 mb-4">
                        <AlertCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Xatolik</h1>
                    <p className="text-red-600 font-medium whitespace-pre-line max-w-sm mx-auto leading-relaxed">
                        {errorMessage}
                    </p>
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="mt-4 px-10 py-4 bg-primary text-white rounded-[1.5rem] font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
                    >
                        Login sahifasiga qaytish
                    </button>
                </div>
            )}
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-md bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-slate-200 border border-white relative z-10">
                <div className="flex justify-center mb-10">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center p-4">
                        <img src="/assets/logo.png" alt="TibMentor" className="w-full h-full object-contain" />
                    </div>
                </div>

                <Suspense fallback={
                    <div className="flex flex-col items-center">
                        <RefreshCw className="animate-spin text-primary mb-4" size={48} />
                        <p className="font-bold text-gray-400">Yuklanmoqda...</p>
                    </div>
                }>
                    <ConfirmContent />
                </Suspense>
            </div>
        </div>
    );
}
