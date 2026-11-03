'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { ContentType, MobileCourseRes } from '@/types/mobile-api';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { packageLabel } from '@/lib/premium';

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
                router.push(`/lessons/${firstLessonId}`);
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

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Back Link */}
            <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition-all mb-8 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Kurslarga qaytish
            </Link>

            {/* Course Header Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-soft mb-12">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 aspect-[4/3] md:aspect-auto">
                        <img
                            src={course.image_url || 'https://via.placeholder.com/800x600/800000/FFFFFF?text=IMED+KURS'}
                            alt={course.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/800000/FFFFFF?text=IMED+KURS';
                            }}
                        />
                    </div>
                    <div className="md:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            {/* ✅ FIX: Show proper badge based on course type */}
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${isFree
                                ? 'bg-emerald-50 text-emerald-600'
                                : course.has_access
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-slate-50 text-slate-600'
                                }`}>
                                {isFree ? '🎁 BEPUL KURS' : course.has_access ? 'Sotib olingan' : 'Pullik kurs'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                            {course.name}
                        </h1>
                        <p className="text-gray-500 font-medium italic mb-8 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Darslar</span>
                                <span className="text-2xl font-black text-gray-900">{course.lessons} ta</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Muddati</span>
                                <span className="text-2xl font-black text-gray-900">
                                    {(() => {
                                        const mins = course.duration || 0;
                                        if (mins < 60) return `${mins} daqiqa`;
                                        const hours = Math.floor(mins / 60);
                                        const remainingMins = mins % 60;
                                        return remainingMins > 0
                                            ? `${hours} soat ${remainingMins} daqiqa`
                                            : `${hours} soat`;
                                    })()}
                                </span>
                            </div>
                        </div>

                        {hasAccess ? (
                            <div className="flex items-center gap-3 py-4 px-6 rounded-2xl font-bold bg-primary/5 text-primary border border-primary/10">
                                Kirish huquqi mavjud
                            </div>
                        ) : isFree ? (
                            <button
                                onClick={handleStartFreeCourse}
                                disabled={isEnrolling}
                                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-center shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98] tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isEnrolling ? 'Yuklanmoqda...' : 'O\'RGANISHNI BOSHLASH'}
                            </button>
                        ) : (
                            <Link
                                href={premiumHref}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-center shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98] tracking-widest uppercase text-sm"
                            >
                                {packageLabel(course.package)} Premiumini olish
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Modules & Lessons List */}
            <div className="space-y-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Kurs rejasi
                </h2>

                {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-6">
                        {course.modules
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((module) => (
                                <div key={module.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-soft">
                                    <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">{module.name}</h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {module.lessons.length} DARS
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {module.lessons
                                            .sort((a, b) => a.order_num - b.order_num)
                                            .map((lesson) => {
                                                // ✅ FIX: hasAccess already includes free courses, so check that OR if lesson itself is public
                                                const lessonAccessible = !!(hasAccess || lesson.is_public);

                                                return (
                                                    <div key={lesson.id} className="p-5 flex items-center justify-between transition-colors hover:bg-slate-50/50 group">
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <span className="text-xs font-black text-gray-300 group-hover:text-primary/40 transition-colors">
                                                                {lesson.order_num < 10 ? `0${lesson.order_num}` : lesson.order_num}
                                                            </span>
                                                            <div className="min-w-0">
                                                                <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors block">
                                                                    {lesson.name}
                                                                </span>
                                                                {lesson.content_types && lesson.content_types.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                                        {lesson.content_types.map((t) => (
                                                                            <span key={t} className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                                                                {contentTypeLabel[t] || t}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {lessonAccessible ? (
                                                                <Link
                                                                    href={`/lessons/${lesson.id}`}
                                                                    className={`px-5 py-2 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${lesson.is_completed
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                                                        : 'bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white hover:border-primary'
                                                                        }`}
                                                                >
                                                                    {lesson.is_completed ? 'Korilgan' : 'Boshlash'}
                                                                </Link>
                                                            ) : (
                                                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                                    🔒 Yopiq
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 font-medium italic">Tez kunda yangi darslar yuklanadi.</p>
                    </div>
                )}
            </div>
        </div>
    );
}