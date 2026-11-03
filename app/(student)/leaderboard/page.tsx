'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { ratingService } from '@/services';
import { RatingResponse, RatingUser } from '@/types/mobile-api';
import { useAuth } from '@/lib/auth-context';
import { Star, Crown, ChevronDown, Clock, Trophy } from 'lucide-react';
import Image from 'next/image';

const PERIODS = [
    { label: 'Haftalik', value: 'week' },
    { label: 'Oylik', value: 'month' },
    { label: 'Yillik', value: 'year' },
    { label: 'Barchasi', value: 'total' },
];

export default function LeaderboardPage() {
    const { isLoading: authLoading, isAuthenticated } = useAuth();
    const [ratings, setRatings] = useState<RatingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'total'>('total');
    const [by, setBy] = useState<'activity' | 'test'>('activity');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (authLoading || !isAuthenticated) return;
        fetchRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period, by, authLoading, isAuthenticated]);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleString('uz-UZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        };
        updateTime();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPeriodDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    return (
        <div className="space-y-12 pb-24">

            {/* Header Section for Mobile */}
            <div className="md:hidden space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Faollar jadvali</h1>
                <p className="text-sm text-gray-500 font-medium italic">Sizning platformadagi yutuqlaringiz</p>
            </div>

            {/* NEW PODIUM SECTION - Matches Screenshot Layout */}
            <div className="flex items-end justify-center gap-2 sm:gap-6 pt-16 min-h-[400px]">
                {podiumItems.length > 0 ? (
                    podiumItems.map((user) => {
                        const isFirst = user.rank === 1;
                        const isSecond = user.rank === 2;
                        const isThird = user.rank === 3;

                        return (
                            <div
                                key={user.user_id}
                                className={`flex flex-col items-center flex-1 max-w-[120px] transition-all duration-700 animate-in fade-in slide-in-from-bottom-10`}
                            >
                                {/* User Info (Above Block) */}
                                <div className="flex flex-col items-center mb-4 space-y-3 w-full">
                                    {isFirst && (
                                        <Trophy className="w-10 h-10 text-yellow-500 mb-1 drop-shadow-lg animate-bounce" />
                                    )}
                                    <div className={`relative`}>
                                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-2 
                                            ${isFirst ? 'border-yellow-400 ring-4 ring-yellow-400/20' :
                                                isSecond ? 'border-gray-300' : 'border-orange-300'} 
                                            transition-transform duration-500 hover:scale-110 shadow-lg`}>
                                            {user.image_url ? (
                                                <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-black text-gray-200">{user.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-white text-[10px]
                                            ${isFirst ? 'bg-yellow-400 text-white' :
                                                isSecond ? 'bg-gray-300 text-white' : 'bg-orange-300 text-white'}`}>
                                            {user.rank}
                                        </div>
                                    </div>

                                    <div className="text-center w-full px-1">
                                        <h3 className={`text-xs font-black text-gray-900 truncate mb-1`}>
                                            {user.name} {user.is_me ? '(Siz)' : ''} {user.is_ustoz ? '· Ustoz' : ''}
                                        </h3>
                                        <div className={`inline-flex px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight
                                            ${isFirst ? 'bg-yellow-400/10 text-yellow-600' :
                                                isSecond ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-600'}`}>
                                            {formatScore(user)}
                                        </div>
                                    </div>
                                </div>

                                {/* Podium Block */}
                                <div className={`w-full rounded-t-[1.5rem] flex items-center justify-center font-black text-4xl text-white/40 shadow-card
                                    ${isFirst ? 'h-48 bg-gradient-to-b from-yellow-400 to-yellow-500' :
                                        isSecond ? 'h-40 bg-gradient-to-b from-gray-300 to-gray-400' :
                                            'h-32 bg-gradient-to-b from-orange-300 to-orange-400'}`}>
                                    {user.rank}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-400 font-bold italic py-20 text-center w-full">Reyting ma'lumotlari mavjud emas</div>
                )}
            </div>

            {/* TABLE / LIST SECTION - Card Based */}
            <div className="bg-white rounded-[2.5rem] p-4 sm:p-10 border border-gray-100 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Barcha o'quvchilar</h2>
                    </div>

                    <div className="flex flex-wrap gap-4 relative" ref={dropdownRef}>
                        <div className="flex p-1 bg-slate-100 rounded-2xl">
                            <button
                                onClick={() => setBy('activity')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${by === 'activity' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
                            >
                                Faollik
                            </button>
                            <button
                                onClick={() => setBy('test')}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${by === 'test' ? 'bg-white text-gray-900' : 'text-gray-400'}`}
                            >
                                Test
                            </button>
                        </div>
                        <button
                            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                            className="flex items-center gap-4 bg-slate-50 hover:bg-slate-100 px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-inner group"
                        >
                            <span className="text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">
                                {PERIODS.find(p => p.value === period)?.label || 'Barchasi'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-500 ${showPeriodDropdown ? 'rotate-180 text-primary' : ''}`} />
                        </button>

                        {showPeriodDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-[2rem] shadow-premium z-50 overflow-hidden">
                                {PERIODS.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => {
                                            setPeriod(p.value as any);
                                            setShowPeriodDropdown(false);
                                        }}
                                        className={`w-full text-left px-6 py-4 text-xs font-black transition-colors border-b border-gray-50 last:border-0 uppercase tracking-widest ${period === p.value ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-gray-900 hover:bg-slate-50'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-4">
                    {meOutsideTop && (
                        <div className="bg-primary/5 p-4 sm:p-5 rounded-[2rem] flex items-center justify-between gap-4 border-2 border-primary/20 ring-2 ring-primary/10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 text-center font-black text-primary italic">
                                    #{meOutsideTop.rank}
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-primary/20 shadow-sm">
                                    {meOutsideTop.image_url ? (
                                        <img src={meOutsideTop.image_url} alt={meOutsideTop.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-lg font-black text-primary">{meOutsideTop.name.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="font-black tracking-tight text-primary">
                                    {meOutsideTop.name} (Siz) {meOutsideTop.is_ustoz ? '· Ustoz' : ''}
                                </span>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[11px] font-black text-primary shadow-sm flex items-center gap-2 border border-primary/10">
                                <Clock size={12} />
                                {formatScore(meOutsideTop)}
                            </div>
                        </div>
                    )}

                    {otherItems.length > 0 ? (
                        otherItems.map((user) => (
                            <div
                                key={user.user_id}
                                className={`bg-slate-50 p-4 sm:p-5 rounded-[2rem] flex items-center justify-between gap-4 border border-transparent hover:border-primary/10 transition-all group ${user.is_me ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 text-center font-black text-gray-400 group-hover:text-primary transition-colors italic">
                                        #{user.rank}
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                                        {user.image_url ? (
                                            <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-black text-gray-200 group-hover:text-primary">{user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className={`font-black tracking-tight text-gray-900 group-hover:text-primary transition-colors ${user.is_me ? 'text-primary' : ''}`}>
                                        {user.name} {user.is_me ? '(Siz)' : ''} {user.is_ustoz ? '· Ustoz' : ''}
                                    </span>
                                </div>

                                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-[11px] font-black text-gray-500 shadow-sm flex items-center gap-2 border border-gray-100">
                                    <Clock size={12} className="text-gray-400" />
                                    {formatScore(user)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-300 font-bold italic">Boshqa ishtirokchilar topilmadi</div>
                    )}
                </div>

                {currentTime && (
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-slate-50 inline-block px-6 py-2 rounded-full border border-gray-100">
                            YANGILANGAN VAQT: <span className="text-gray-600">{currentTime}</span>
                        </p>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full"></div>
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary relative z-10"></div>
                        </div>
                        <p className="text-gray-400 text-sm font-black tracking-[0.3em] animate-pulse uppercase">Yuklanmoqda</p>
                    </div>
                </div>
            )}
        </div>
    );
}
