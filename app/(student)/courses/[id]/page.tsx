'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { ContentType, MobileCourseRes } from '@/types/mobile-api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { rememberCourse, withCourse } from '@/lib/celebrate';
import toast from 'react-hot-toast';
import { packageLabel } from '@/lib/premium';
import { CheckCircle2, ChevronLeft, ChevronRight, Crown, FileText, Headphones, ClipboardCheck, Lock, Play } from 'lucide-react';

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [course, setCourse] = useState<MobileCourseRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (!id) return;
        rememberCourse(id);

        async function fetchCourse() {
            try {
                setLoading(true);
                const data = await courseService.getCourseById(id);
                setCourse(data);
            } catch (err: any) {
                console.error('Failed to fetch course:', err);
                setError(err.message || 'Kurs malumotlarini yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-8">
                    <p className="text-red-600 font-bold mb-2">Xatolik!</p>
                    <p className="text-red-500">{error || 'Kurs topilmadi'}</p>
                </div>
                <Link href="/courses" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                    <span>&larr;</span> <span>Kurslarga qaytish</span>
                </Link>
            </div>
        );
    }

    const isFree = !!course.is_public;
    const hasAccess = !!course.has_access;
    const premiumHref = course.package
        ? `/premium?package=${course.package}`
        : '/premium';
    const contentTypeLabel: Record<ContentType, string> = {
        video: 'Video',
        audio: 'Audio',
        document: 'Hujjat',
        test: 'Test',
    };

    const contentTypeIcon: Record<ContentType, any> = {
        video: Play,
        audio: Headphones,
        document: FileText,
        test: ClipboardCheck,
    };

    const handleStartFreeCourse = async () => {
        try {
            setIsEnrolling(true);

            // ✅ FIX: Save to local storage so it appears in "My Courses"
            // We pass the full object now to avoid API re-fetching issues in the dashboard
            courseService.startFreeCourse(course);

            // ✅ FIX: For free courses, just navigate to first lesson directly
            // No need to create order or enroll for truly free courses
            const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;
            if (firstLessonId) {
                router.push(withCourse(`/lessons/${firstLessonId}`, id));
            } else {
                toast.error('Kursda hali darslar yuklanmagan');
            }
        } catch (err) {
            console.error('Failed to start free course:', err);
            toast.error('Kursni boshlashda xatolik yuz berdi');
        } finally {
            setIsEnrolling(false);
        }
    };

    const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id;
    const mins = course.duration || 0;
    const durationLabel =
        mins < 60 ? `${mins} daqiqa` : `${Math.floor(mins / 60)} soat${mins % 60 ? ` ${mins % 60} daqiqa` : ''}`;

    const cta = hasAccess ? (
        firstLessonId ? (
            <Link
                href={withCourse(`/lessons/${firstLessonId}`, id)}
                className="block w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold text-center shadow-soft hover:opacity-95 active:scale-[0.99] transition-all"
            >
                Kursni boshlash
            </Link>
        ) : null
    ) : isFree ? (
        <button
            onClick={handleStartFreeCourse}
            disabled={isEnrolling}
            className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold text-center shadow-soft hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
        >
            {isEnrolling ? 'Yuklanmoqda...' : 'Kursni boshlash'}
        </button>
    ) : (
        <Link
            href={premiumHref}
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand-gradient text-white rounded-2xl font-bold text-center shadow-soft hover:opacity-95 active:scale-[0.99] transition-all"
        >
            <Crown size={16} fill="currentColor" /> {packageLabel(course.package)} Premiumini olish
        </Link>
    );

    return (
        <div className="max-w-3xl mx-auto pb-28 md:pb-10">
            {/* Header: round back button + title */}
            <div className="flex items-center gap-3 mb-5">
                <Link
                    href="/courses"
                    aria-label="Orqaga"
                    className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-700 hover:text-primary shrink-0"
                >
                    <ChevronLeft size={20} />
                </Link>
                <h1 className="text-lg md:text-2xl font-black text-slate-900 truncate">{course.name}</h1>
            </div>

            {/* Hero */}
            <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-white border border-slate-100 overflow-hidden mb-5">
                {course.image_url ? (
                    <img
                        src={course.image_url}
                        alt={course.name}
                        className="w-full h-44 md:h-64 object-cover"
                        onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                    />
                ) : (
                    <div className="h-36 md:h-48 flex items-center justify-center text-5xl">📘</div>
                )}
            </div>

            {course.description && (
                <p className="text-slate-600 leading-relaxed mb-5">{course.description}</p>
            )}

            {/* Meta + status */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">
                    {course.lessons} ta dars
                </span>
                {mins > 0 && (
                    <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600">
                        {durationLabel}
                    </span>
                )}
                {isFree ? (
                    <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">Bepul kurs</span>
                ) : hasAccess ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                        <Crown size={12} /> {packageLabel(course.package)} · faol
                    </span>
                ) : (
                    <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                        {packageLabel(course.package)}
                    </span>
                )}
            </div>

            {/* Modules & Lessons List */}
            <div className="space-y-4">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Kurs tarkibi</h2>

                {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-4">
                        {[...course.modules]
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((module, mIdx) => (
                                <div key={module.id} className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                                    <div className="px-5 pt-4 pb-3">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                            {mIdx + 1}-MODUL
                                        </p>
                                        <h3 className="font-black text-gray-900 leading-snug">{module.name}</h3>
                                    </div>
                                    <div className="px-3 pb-3 space-y-1">
                                        {[...module.lessons]
                                            .sort((a, b) => a.order_num - b.order_num)
                                            .map((lesson) => {
                                                const lessonAccessible = !!(hasAccess || lesson.is_public);
                                                const types = lesson.content_types || [];
                                                const rowClass = 'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group';

                                                const inner = (
                                                    <>
                                                        <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center ${lessonAccessible ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                                                            {lesson.is_completed
                                                                ? <CheckCircle2 size={18} />
                                                                : <Play size={16} fill="currentColor" />}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="font-bold text-sm text-gray-800 block truncate">
                                                                {lesson.name}
                                                            </span>
                                                            {types.length > 0 && (
                                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                                    {types.map((t) => {
                                                                        const Icon = contentTypeIcon[t];
                                                                        return (
                                                                            <span key={t} className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                                                                                {Icon && <Icon size={12} />}
                                                                                {contentTypeLabel[t] || t}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {lessonAccessible
                                                            ? <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                                            : <Lock size={16} className="text-gray-300" />}
                                                    </>
                                                );

                                                return lessonAccessible ? (
                                                    <Link
                                                        key={lesson.id}
                                                        href={withCourse(`/lessons/${lesson.id}`, id)}
                                                        className={`${rowClass} hover:bg-primary/5`}
                                                    >
                                                        {inner}
                                                    </Link>
                                                ) : (
                                                    <div key={lesson.id} className={`${rowClass} opacity-70`}>
                                                        {inner}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 font-medium">Tez kunda yangi darslar yuklanadi.</p>
                    </div>
                )}

                {!hasAccess && !isFree && (
                    <p className="text-sm text-slate-500 px-1">
                        Bu kurs «{packageLabel(course.package)}» Premiumi bilan ochiladi. Boshqa modul obunasi bu kursni ochmaydi.
                    </p>
                )}
            </div>

            {/* CTA: sticky above the tab bar on phones, inline on larger screens */}
            {cta && (
                <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] inset-x-4 z-30 md:static md:mt-8 md:inset-auto">
                    {cta}
                </div>
            )}
        </div>
    );
}