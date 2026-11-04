'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import BrandWordmark from '@/components/common/BrandWordmark';
import { BRAND_NAME } from '@/lib/brand';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const authPath = isAuthenticated ? '/dashboard' : '/auth/login';

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-20 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
                                <img src="/assets/logo.png" alt={BRAND_NAME} className="w-10 h-10 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <BrandWordmark className="text-2xl leading-none" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-primary mt-1">
                                    Professional
                                </span>
                            </div>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-10">
                            {['Bosh sahifa', 'Xizmatlar', 'Kurslar', 'Jamoa', 'Aloqa'].map((item, i) => (
                                <a
                                    key={i}
                                    href={`#${['home', 'services', 'courses', 'team', 'contact'][i]}`}
                                    className="text-sm font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>
                        <div className="flex items-center gap-4">
                            <Link
                                href={authPath}
                                className="inline-flex px-8 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95 whitespace-nowrap"
                            >
                                {isAuthenticated ? 'Kabinet' : 'Kirish'}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
