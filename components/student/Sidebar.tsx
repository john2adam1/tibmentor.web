'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Activity, User, LogOut, Grid, Crown } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

const navItems = [
    { name: 'Asosiy', href: '/dashboard', icon: Home },
    { name: 'Barcha kurslar', href: '/courses', icon: Grid },
    { name: 'Reyting', href: '/leaderboard', icon: Activity },
    { name: 'Premium', href: '/premium', icon: Crown },
    { name: 'Profil', href: '/profile', icon: User },
];

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export default function Sidebar({ className = '', onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className={`w-80 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 overflow-hidden shadow-[10px_0_30px_-15px_rgba(0,0,0,0.05)] ${className}`}>
            {/* Logo Area */}
            <div className="p-8 mb-4 flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
                    <div className="w-12 h-12 relative group-hover:scale-110 transition-transform">
                        <Image
                            src="/assets/logo.png"
                            alt="iMed Team"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
                        iMed Team
                    </h2>
                </Link>
                {/* Close button for mobile */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-900">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black transition-all duration-300 group
                                ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-primary'
                                }`}
                        >
                            <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
                            <span className="tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30">
                <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-slate-700 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                    <span className="tracking-tight">Chiqish</span>
                </button>
            </div>
        </div>
    );
}
