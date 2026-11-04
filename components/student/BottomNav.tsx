'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { NAV_ITEMS, isNavActive } from '@/lib/nav';
import { cn } from '@/lib/utils';

/** Mobile tab bar (< md). Mirrors the app: Asosiy / Kurslarim / Reyting / Profil. */
export default function BottomNav() {
    const pathname = usePathname() || '';
    const onMyTab = useSearchParams()?.get('tab') === 'my';

    return (
        <nav
            aria-label="Asosiy menyu"
            className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 pb-[env(safe-area-inset-bottom)]"
        >
            <ul className="grid grid-cols-4 max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const active = isNavActive(item.href, pathname, onMyTab);
                    const Icon = item.icon;
                    return (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors',
                                    active ? 'text-primary' : 'text-slate-400 active:text-slate-600'
                                )}
                            >
                                <Icon size={21} strokeWidth={active ? 2.4 : 1.8} />
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
