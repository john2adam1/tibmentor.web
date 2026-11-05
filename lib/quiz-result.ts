import confetti from 'canvas-confetti';
import { celebrate } from '@/lib/celebrate';

export type QuizTierId = 'excellent' | 'good' | 'average' | 'poor';

export interface QuizTier {
    id: QuizTierId;
    emoji: string;
    title: string;
    message: string;
    /** SVG ring gradient */
    ring: [string, string];
    /** Tailwind classes for the percent number and the label chip */
    textClass: string;
    chipClass: string;
    /** Soft glow behind the ring */
    glowClass: string;
    /** CSS animation class for the emoji */
    emojiAnim: string;
}

const TIERS: Record<QuizTierId, QuizTier> = {
    excellent: {
        id: 'excellent',
        emoji: '🏆',
        title: 'Ajoyib natija!',
        message: 'Siz mavzuni a’lo darajada o‘zlashtirgansiz. Shunday davom eting!',
        ring: ['#34D399', '#10B981'],
        textClass: 'text-emerald-600',
        chipClass: 'bg-emerald-50 text-emerald-700',
        glowClass: 'bg-emerald-400/25',
        emojiAnim: 'animate-pop',
    },
    good: {
        id: 'good',
        emoji: '👏',
        title: 'Yaxshi natija!',
        message: 'Juda yaxshi! Yana ozgina mashq qilsangiz, a’lo natijaga erishasiz.',
        ring: ['#31D0FC', '#0A63E8'],
        textClass: 'text-primary',
        chipClass: 'bg-primary/10 text-primary',
        glowClass: 'bg-primary/20',
        emojiAnim: 'animate-pop',
    },
    average: {
        id: 'average',
        emoji: '💪',
        title: 'Yomon emas',
        message: 'Yaxshi boshlanish. Mavzuni yana bir bor ko‘rib chiqing va qayta urinib ko‘ring.',
        ring: ['#FBBF24', '#F59E0B'],
        textClass: 'text-amber-600',
        chipClass: 'bg-amber-50 text-amber-700',
        glowClass: 'bg-amber-400/20',
        emojiAnim: 'animate-float',
    },
    poor: {
        id: 'poor',
        emoji: '📚',
        title: 'Yana urinib ko‘ring',
        message: 'Xafa bo‘lmang! Darsni qayta ko‘rib chiqib, testni yana bir bor ishlang.',
        ring: ['#FB7185', '#EF4444'],
        textClass: 'text-red-500',
        chipClass: 'bg-red-50 text-red-600',
        glowClass: 'bg-red-400/15',
        emojiAnim: 'animate-wiggle',
    },
};

/** 90–100 → excellent, 70–89 → good, 50–69 → average, below 50 → poor. */
export function getQuizTier(percent: number): QuizTier {
    if (percent >= 90) return TIERS.excellent;
    if (percent >= 70) return TIERS.good;
    if (percent >= 50) return TIERS.average;
    return TIERS.poor;
}

/** Celebration that matches the result: big → none. */
export function celebrateResult(percent: number) {
    const tier = getQuizTier(percent).id;

    if (tier === 'excellent') {
        confetti({
            particleCount: 160,
            spread: 110,
            startVelocity: 45,
            origin: { y: 0.55 },
            colors: ['#FFD700', '#34D399', '#31D0FC', '#0A63E8', '#6A4CF0'],
            disableForReducedMotion: true,
        });
        celebrate(4000);
        return;
    }

    if (tier === 'good') {
        celebrate(2200);
        return;
    }

    if (tier === 'average') {
        confetti({
            particleCount: 45,
            spread: 70,
            startVelocity: 28,
            scalar: 0.9,
            origin: { y: 0.6 },
            colors: ['#FBBF24', '#F59E0B', '#31D0FC'],
            disableForReducedMotion: true,
        });
    }
    // poor: no confetti, a calm encouraging animation is shown instead
}
