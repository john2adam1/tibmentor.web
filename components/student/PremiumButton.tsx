import Link from 'next/link';
import { Crown } from 'lucide-react';

interface PremiumButtonProps {
    className?: string;
    onClick?: () => void;
}

/** Brand gradient PREMIUM pill (TZ T-12). */
export default function PremiumButton({ className = '', onClick }: PremiumButtonProps) {
    return (
        <Link
            href="/premium"
            onClick={onClick}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-brand-gradient text-white text-[11px] font-black uppercase tracking-widest shadow-md shadow-primary/25 hover:opacity-95 active:scale-95 transition-all ${className}`}
        >
            <Crown size={13} fill="currentColor" /> Premium
        </Link>
    );
}
