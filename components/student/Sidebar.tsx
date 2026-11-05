'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import BrandWordmark from '@/components/common/BrandWordmark';
import PremiumButton from '@/components/student/PremiumButton';
import LogoutConfirmModal from '@/components/student/LogoutConfirmModal';
import { BRAND_NAME } from '@/lib/brand';
import { NAV_ITEMS, isNavActive } from '@/lib/nav';
import { cn } from '@/lib/utils';

interface SidebarProps {
    hasUnread?: boolean;
}

/**
 * Tablet (md): narrow icon rail with small labels.
 * Laptop (lg+): full sidebar. Hidden on phones (BottomNav is used instead).
 */
export default function Sidebar({ hasUnread }: SidebarProps) {
    const pathname = usePathname() || '';
    const onMyTab = useSearchParams()?.get('tab') === 'my';
    const { logout } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

    const itemClass = (active: boolean) =>
        cn(
            'flex flex-col lg:flex-row items-center lg:gap-3 gap-1 rounded-2xl font-semibold transition-all',
            'px-2 py-2.5 lg:px-3 lg:py-3 text-[10px] lg:text-sm',
            active
                ? 'bg-primary/10 text-primary'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        );

    const iconTile = (active: boolean) =>
        cn(
            'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
            active ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
        );

    const notifActive = pathname.startsWith('/notifications');

    return (
        <>
        <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-24 lg:w-64 bg-white border-r border-slate-200 flex-col h-screen overflow-hidden">
            {/* Logo */}
            <div className="px-3 lg:px-6 pt-6 pb-4 flex justify-center lg:justify-start">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 relative group-hover:scale-105 transition-transform">
                        <Image src="/assets/logo.png" alt={BRAND_NAME} fill className="object-contain" priority />
                    </div>
                    <BrandWordmark className="hidden lg:inline text-xl tracking-tighter" />
                </Link>
            </div>

            {/* PREMIUM */}
            <div className="px-3 lg:px-5 pb-4 flex justify-center">
                <PremiumButton className="w-full py-2.5 text-[9px] lg:text-[11px] px-2" />
            </div>

            {/* Main navigation */}
            <nav className="flex-1 px-2 lg:px-4 space-y-1.5 overflow-y-auto no-scrollbar" aria-label="Asosiy menyu">
                {NAV_ITEMS.map((item) => {
                    const active = isNavActive(item.href, pathname, onMyTab);
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href} className={itemClass(active)} title={item.name}>
                            <span className={iconTile(active)}>
                                <Icon size={18} />
                            </span>
                            <span className="tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Notifications + logout */}
            <div className="p-2 lg:p-4 border-t border-slate-100 space-y-1.5">
                <Link href="/notifications" className={itemClass(notifActive)} title="Bildirishnomalar">
                    <span className={cn(iconTile(notifActive), 'relative')}>
                        <Bell size={18} />
                        {hasUnread && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-cyan rounded-full border-2 border-white" />
                        )}
                    </span>
                    <span className="tracking-tight">
                        <span className="lg:hidden">Xabarlar</span>
                        <span className="hidden lg:inline">Bildirishnomalar</span>
                    </span>
                </Link>
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    title="Chiqish"
                    className="w-full flex flex-col lg:flex-row items-center lg:gap-3 gap-1 px-2 py-2.5 lg:px-3 lg:py-3 rounded-2xl text-[10px] lg:text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <span className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-red-100 flex items-center justify-center">
                        <LogOut size={18} />
                    </span>
                    <span className="tracking-tight">Chiqish</span>
                </button>
            </div>
        </aside>

        <LogoutConfirmModal
            isOpen={showLogoutConfirm}
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={() => {
                setShowLogoutConfirm(false);
                logout();
            }}
        />
        </>
    );
}
