import { PremiumPackage } from '@/types/mobile-api';

export const PACKAGE_LABELS: Record<PremiumPackage, string> = {
    fundamental: 'Fundamental fanlar',
    preclinical: 'Preklinik fanlar',
    clinical: 'Klinik fanlar',
};

export function packageLabel(pkg?: PremiumPackage | null): string {
    if (!pkg) return 'Premium';
    return PACKAGE_LABELS[pkg] || 'Premium';
}

export function formatUntil(iso?: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('uz-UZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatSom(price: number): string {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        maximumFractionDigits: 0,
    }).format(price);
}

export const LESSON_NO_ACCESS = 'no access to this lesson';
export const TARIFF_SALES_CLOSED = 'tariff sales are closed, please update the app';
export const TEST_TIME_UP = 'test time is up';
export const ATTEMPT_FINISHED = 'attempt already finished';
