'use client';

import { useEffect, useState, useMemo } from 'react';
import { ratingService } from '@/services';
import { RatingResponse, RatingUser } from '@/types/mobile-api';
import { useAuth } from '@/lib/auth-context';
import { Info, Trophy, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const PERIODS = [
    { label: 'Umumiy', value: 'total' },
    { label: 'Kun', value: 'day' },
    { label: 'Hafta', value: 'week' },
    { label: 'Oy', value: 'month' },
    { label: 'Yil', value: 'year' },
] as const;

const MIN_TESTS = 5;

export default function LeaderboardPage() {
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [ratings, setRatings] = useState<RatingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'total'>('total');
    const [by, setBy] = useState<'activity' | 'test'>('activity');
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;
        fetchRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, by, authLoading, isAuthenticated]);

    const fetchRatings = async () => {
        setIsLoading(true);
        try {
            const response = await ratingService.getRating({ type: period, by, limit: 100 });
            setRatings(response);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatScore = (user: RatingUser) => {
        if (by === 'test') {
            const score = user.score ?? 0;
            return `${Math.round(score)}%`;
        }
        return formatActivity(user.activity);
    };

    const formatActivity = (activity: number) => {
        // activity is in seconds from activityService
        const hours = Math.floor(activity / 3600);
        const minutes = Math.floor((activity % 3600) / 60);
        const seconds = activity % 60;

        const pad = (num: number) => num < 10 ? `0${num}` : num;

        if (hours > 0) {
            return `${hours}s ${pad(minutes)}d`;
        }
        return `${pad(minutes)}d ${pad(seconds)}s`;
    };

    const { podiumItems, otherItems, meOutsideTop } = useMemo(() => {
        const allItems = ratings?.items || [];
        const podium = [
            allItems[1],
            allItems[0],
            allItems[2],
        ].filter((u): u is RatingUser => !!u);

        const others = allItems.slice(3);
        const me = ratings?.me;
        const meInList = me ? allItems.some((u) => u.user_id === me.user_id) : false;
        const meOutsideTop = me && !meInList ? me : null;

        return { podiumItems: podium, otherItems: others, meOutsideTop };
    }, [ratings]);

    if ((isLoading || authLoading) && !ratings) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Reyting yuklanmoqda...</p>
            </div>
        );
    }

    const me = ratings?.me;
    const Avatar = ({ user, size = 'md' }: { user: RatingUser; size?: 'md' | 'lg' }) => (
        <div
            className={cn(
                'rounded-full bg-primary/10 text-primary flex items-center justify-center overflow-hidden font-black shrink-0',
                size === 'lg' ? 'w-16 h-16 sm:w-20 sm:h-20 text-2xl' : 'w-11 h-11 text-base'
            )}
        >
            {user.image_url ? (
                <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );

    const scoreChip = (user: RatingUser) => (
        <div className="text-right">
            <p className="font-black text-sm text-slate-900 tabular-nums">{formatScore(user)}</p>
            {by === 'test' && user.tests_count !== undefined && (
                <p className="text-[11px] text-slate-400 font-medium">{user.tests_count} test</p>
            )}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto pb-44 md:pb-32">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reyting</h1>
                <button
                    onClick={() => setShowInfo(true)}
                    aria-label="Reyting qanday hisoblanadi"
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/40 flex items-center justify-center transition-colors"
                >
                    <Info size={18} />
                </button>
            </div>

            {/* Vaqt / Test natijalari */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-4">
                {([['activity', 'Vaqt'], ['test', 'Test natijalari']] as const).map(([v, label]) => (
                    <button
                        key={v}
                        onClick={() => setBy(v)}
                        className={cn(
                            'py-2.5 rounded-xl text-sm font-bold transition-all',
                            by === v ? 'bg-white text-primary shadow-soft' : 'text-slate-500 hover:text-slate-800'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Period filters */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-8">
                {PERIODS.map((p) => (
                    <button
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        className={cn(
                            'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all',
                            period === p.value
                                ? 'bg-brand-gradient text-white border-transparent shadow-soft'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                        )}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Podium */}
            {podiumItems.length > 0 ? (
                <div className="flex items-end justify-center gap-3 sm:gap-5 mb-8">
                    {podiumItems.map((user) => {
                        const isFirst = user.rank === 1;
                        return (
                            <div key={user.user_id} className="flex flex-col items-center flex-1 max-w-[140px]">
                                {isFirst && <Trophy className="w-7 h-7 text-brand-cyan mb-1" />}
                                <div className="relative mb-2">
                                    <div className={cn('rounded-full p-0.5', isFirst ? 'bg-brand-gradient' : 'bg-slate-200')}>
                                        <div className="rounded-full bg-white p-0.5">
                                            <Avatar user={user} size="lg" />
                                        </div>
                                    </div>
                                    <span className={cn(
                                        'absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full text-[11px] font-black flex items-center justify-center border-2 border-white text-white',
                                        isFirst ? 'bg-brand-gradient' : 'bg-slate-400'
                                    )}>
                                        {user.rank}
                                    </span>
                                </div>
                                <p className="text-sm font-black text-slate-900 truncate max-w-full mt-1">
                                    {user.name}{user.is_me ? ' (Siz)' : ''}
                                </p>
                                {user.is_ustoz && <p className="text-[10px] font-bold text-primary">Ustoz</p>}
                                <p className="text-xs font-bold text-primary mb-2 tabular-nums">{formatScore(user)}</p>
                                <div
                                    className={cn(
                                        'w-full rounded-t-2xl flex items-start justify-center pt-2 font-black text-2xl',
                                        isFirst ? 'h-32 bg-gradient-to-b from-primary to-brand-cyan text-white/80' : user.rank === 2 ? 'h-24 bg-gradient-to-b from-slate-400 to-slate-300 text-white/80' : 'h-16 bg-gradient-to-b from-primary/70 to-primary/10 text-white/90'
                                    )}
                                >
                                    {user.rank}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-slate-400 font-semibold py-16 text-center">Reyting ma'lumotlari mavjud emas</div>
            )}

            {/* List */}
            {otherItems.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-soft divide-y divide-slate-100 overflow-hidden">
                    {otherItems.map((user) => (
                        <div
                            key={user.user_id}
                            className={cn('flex items-center gap-3 px-4 py-3', user.is_me && 'bg-primary/5')}
                        >
                            <span className="w-9 text-sm font-black text-slate-400 tabular-nums">#{user.rank}</span>
                            <Avatar user={user} />
                            <div className="flex-1 min-w-0">
                                <p className={cn('font-bold text-sm truncate', user.is_me ? 'text-primary' : 'text-slate-900')}>
                                    {user.name}{user.is_me ? ' (Siz)' : ''}
                                </p>
                                {user.is_ustoz && <p className="text-[11px] font-bold text-primary">Ustoz</p>}
                            </div>
                            {scoreChip(user)}
                        </div>
                    ))}
                </div>
            )}

            {/* Pinned "Siz" row */}
            <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-4 left-4 right-4 md:left-[calc(6rem+1rem)] lg:left-[calc(16rem+1rem)] md:right-4 z-30 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-brand-ink text-white shadow-premium">
                        {me ? (
                            <>
                                <span className="w-12 text-sm font-black text-brand-cyan tabular-nums">
                                    {me.rank ? `#${me.rank}` : '—'}
                                </span>
                                <Avatar user={me} />
                                <p className="flex-1 font-black text-sm">Siz</p>
                                {by === 'test' && (me.tests_count ?? 0) < MIN_TESTS ? (
                                    <p className="text-xs font-semibold text-white/70 text-right">
                                        {MIN_TESTS} ta test ishlang, reytingga kirasiz
                                    </p>
                                ) : (
                                    <div className="text-right">
                                        <p className="font-black text-sm text-white tabular-nums bg-white/15 px-3 py-1 rounded-full">
                                            {formatScore(me)}
                                            {by === 'test' && me.tests_count !== undefined ? ` · ${me.tests_count} test` : ''}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm font-semibold text-white/80">
                                {by === 'test' ? `${MIN_TESTS} ta test ishlang, reytingga kirasiz` : 'Reytingga kirish uchun darslarni o‘qing'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Info modal */}
            {showInfo && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={() => setShowInfo(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-premium" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-black text-slate-900">Reyting qanday hisoblanadi?</h2>
                            <button onClick={() => setShowInfo(false)} aria-label="Yopish" className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
                                <X size={18} />
                            </button>
                        </div>
                        <ul className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <li><b className="text-slate-900">Vaqt:</b> platformada darslarni o‘qishga sarflangan vaqt bo‘yicha.</li>
                            <li><b className="text-slate-900">Test natijalari:</b> tanlangan davrdagi har bir testning eng yaxshi natijasi olinadi va ularning o‘rtacha foizi hisoblanadi. Foiz teng bo‘lsa, ko‘proq test ishlagan yuqorida turadi.</li>
                            <li><b className="text-slate-900">Kamida {MIN_TESTS} ta test:</b> test reytingiga davr ichida kamida {MIN_TESTS} ta test ishlagan foydalanuvchilar kiradi.</li>
                            <li>Reyting har 10–15 daqiqada yangilanadi.</li>
                        </ul>
                    </div>
                </div>
            )}

            {isLoading && ratings && (
                <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary" />
                </div>
            )}
        </div>
    );
}
