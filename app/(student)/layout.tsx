'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BRAND_NAME } from '@/lib/brand';
import { cn } from '@/lib/utils';
import BottomNav from '@/components/student/BottomNav';
import { isImmersivePath } from '@/lib/nav';
import Sidebar from '@/components/student/Sidebar';
import { notificationService } from '@/services';
import { Bell } from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import PremiumButton from '@/components/student/PremiumButton';


export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname() || '';
    const [notifications, setNotifications] = React.useState<{ notifications: any[], count: number }>({ notifications: [], count: 0 });
    const { permission, requestPermission, loading: notificationLoading } = usePushNotifications();

    useEffect(() => {
        if (!isLoading && user) {
            notificationService.getNotifications()
                .then(data => {
                    if (data) setNotifications(data);
                })
                .catch(err => console.error('Failed to load notifications in layout:', err));
        }
    }, [user, isLoading]);

    const hasUnread = React.useMemo(() => {
        return notifications?.notifications?.some((n: any) => !n.is_read);
    }, [notifications]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const immersive = isImmersivePath(pathname);
    const showMobileHeader = pathname === '/dashboard';
    const contact = user.email || user.phone_number || '';

    return (
        <div className="flex min-h-screen bg-background">
            {/* Tablet / laptop sidebar */}
            <React.Suspense fallback={<div className="hidden md:block fixed inset-y-0 left-0 w-24 lg:w-64 bg-white border-r border-slate-200" />}>
                <Sidebar hasUnread={!!hasUnread} />
            </React.Suspense>

            <div className="flex-1 min-w-0 flex flex-col overflow-x-hidden relative md:pl-24 lg:pl-64">
                {/* Phone app header (home only, like the mobile app) */}
                {showMobileHeader && (
                    <header className="md:hidden px-4 pt-4 pb-1 flex items-center gap-3">
                        <Link href="/profile" className="w-11 h-11 rounded-full bg-white shadow-soft flex items-center justify-center overflow-hidden shrink-0 font-black text-primary">
                            {user.image_url ? (
                                <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <Image src="/assets/logo.png" alt={BRAND_NAME} width={28} height={28} />
                            )}
                        </Link>
                        <div className="min-w-0 flex-1">
                            <p className="font-black text-slate-900 leading-tight truncate">{user.name || 'Foydalanuvchi'}</p>
                            <p className="text-xs text-slate-500 truncate">{contact}</p>
                        </div>
                        <PremiumButton className="px-3 py-2 text-[10px]" />
                        <button
                            onClick={() => router.push('/notifications')}
                            aria-label="Bildirishnomalar"
                            className="w-10 h-10 rounded-full bg-white shadow-soft text-slate-600 flex items-center justify-center relative active:scale-95"
                        >
                            <Bell size={20} />
                            {hasUnread && (
                                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-brand-cyan rounded-full border-2 border-white" />
                            )}
                        </button>
                    </header>
                )}

                {/* Push Notification Banner */}
                {permission === 'default' && (
                    <div className="bg-primary/5 border-b border-primary/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Bell size={16} />
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                                Kurs yangiliklari va darslarni o'tkazib yubormaslik uchun bildirishnomalarni yoqing.
                            </p>
                        </div>
                        <button
                            onClick={requestPermission}
                            disabled={notificationLoading}
                            className="px-4 sm:px-6 py-2 bg-brand-gradient text-white text-xs font-bold rounded-xl shadow-soft hover:opacity-95 transition-all active:scale-95 whitespace-nowrap disabled:opacity-50"
                        >
                            {notificationLoading ? 'Yuklanmoqda...' : 'YOQISH'}
                        </button>
                    </div>
                )}

                <main
                    className={cn(
                        'flex-1 w-full max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 md:pt-8 lg:pt-10',
                        immersive ? 'pb-6' : 'pb-28 md:pb-10'
                    )}
                >
                    {children}
                </main>
            </div>

            {/* Phone tab bar */}
            {!immersive && (
                <React.Suspense fallback={null}>
                    <BottomNav />
                </React.Suspense>
            )}
        </div>
    );
}
