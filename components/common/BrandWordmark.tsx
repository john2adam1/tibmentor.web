import { BRAND_PREFIX, BRAND_SUFFIX } from '@/lib/brand';

interface BrandWordmarkProps {
    className?: string;
    /** Use light colours on dark backgrounds */
    inverted?: boolean;
}

/** "Tib" in navy + "Mentor" in teal, as in the brand palette. */
export default function BrandWordmark({ className = '', inverted = false }: BrandWordmarkProps) {
    return (
        <span className={`font-black tracking-tight ${className}`}>
            <span className={inverted ? 'text-white' : 'text-brand-ink'}>{BRAND_PREFIX}{BRAND_SUFFIX}</span>
        </span>
    );
}
