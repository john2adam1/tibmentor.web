'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseRowProps {
    href: string;
    title: string;
    imageUrl?: string;
    /** e.g. "45 ta dars · 362 kun qoldi" */
    subtitle?: string;
    /** 0..100 — renders gradient progress bar */
    percentage?: number;
    /** Right-side badge for catalog rows */
    badge?: 'free' | 'locked' | null;
}

export function daysLeft(endedAt?: string | null): number | null {
    if (!endedAt) return null;
    const end = new Date(endedAt).getTime();
    if (Number.isNaN(end)) return null;
    const diff = Math.ceil((end - Date.now()) / 86_400_000);
    // very large / expired values are not meaningful for the learner
    if (diff < 0 || diff > 3650) return null;
    return diff;
}

/** Course card in the TibMentor list style (icon tile + title + progress). */
export default function CourseRow({ href, title, imageUrl, subtitle, percentage, badge }: CourseRowProps) {
    const pct = Math.max(0, Math.min(100, Math.round(percentage ?? 0)));
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-card hover:border-primary/20 transition-all active:scale-[0.99]"
        >
            <div className="w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 rounded-2xl bg-primary/10 overflow-hidden flex items-center justify-center text-2xl">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                ) : (
                    <span>📘</span>
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                    <h3 className="font-black text-slate-900 leading-snug line-clamp-2 flex-1">{title}</h3>
                    {badge === 'free' && (
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">Bepul</span>
                    )}
                    {badge === 'locked' && (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                            <Lock size={11} /> Yopiq
                        </span>
                    )}
                </div>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5 truncate">{subtitle}</p>}
                {percentage !== undefined && (
                    <div className="flex items-center gap-3 mt-2.5">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                                className={cn('h-full rounded-full bg-brand-progress transition-all duration-700')}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-500 tabular-nums w-9 text-right">{pct}%</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
