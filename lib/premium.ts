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

/** Map backend premium error messages to user-facing Uzbek text. */
export function premiumErrorMessage(message?: string): string {
    switch (message) {
        case 'premium price is not configured':
            return 'Bu fan uchun Premium narxi belgilanmagan';
        case 'subject_id is required':
            return 'Modul tanlanmagan';
        default:
            return message || '';
    }
}
