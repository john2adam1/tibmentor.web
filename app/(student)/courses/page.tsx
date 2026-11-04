'use client';

import { Suspense, useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services';
import { useRouter, useSearchParams } from 'next/navigation';
import { Subject } from '@/types/mobile-api';
import CourseRow, { daysLeft } from '@/components/student/CourseRow';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
    return (
        <Suspense fallback={<CoursesSkeleton />}>
            <CoursesContent />
        </Suspense>
    );
}

function CoursesSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        </div>
    );
}

function CoursesContent() {
    // Tab / subject come from the URL, so the very first request is already the right one
    const searchParams = useSearchParams();
    const urlTab: 'all' | 'my' = searchParams?.get('tab') === 'my' ? 'my' : 'all';
    const urlSubject = searchParams?.get('subject') || null;
    // ===== SIMPLIFIED STATE (5 variables instead of 7+) =====
    const [activeTab, setActiveTab] = useState<'all' | 'my'>(urlTab);
    const [selectedSubject, setSelectedSubject] = useState<string | 'free' | null>(urlSubject);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courses, setCourses] = useState<any[]>([]);  // Single source of truth
    const [totalCount, setTotalCount] = useState(0);  // From API response
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // ===== SIMPLE FREE COURSE DETECTION =====
    // Trust the API: is_public is the source of truth
    const isFree = (course: any) => course.is_public === true;

    // Follow URL changes (e.g. bottom nav "Kurslarim" while already on /courses)
    useEffect(() => {
        setActiveTab(urlTab);
        setSelectedSubject(urlSubject);
    }, [urlTab, urlSubject]);

    // ===== FETCH SUBJECTS (once on mount) =====
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const data = await subjectService.getAll();
                setSubjects(data.subjects || []);
            } catch (err) {
                console.error('Failed to load subjects:', err);
            }
        }
        fetchSubjects();
    }, []);

    // ===== FETCH COURSES (when tab or filter changes) =====
    useEffect(() => {
        let cancelled = false; // ignore stale responses (tab switched while loading)
        async function fetchCourses() {
            setCourses([]);
            setLoading(true);
            try {
                if (activeTab === 'all') {
                    // Determine API params based on filter
                    let params: any = {};

                    if (selectedSubject && selectedSubject !== 'free') {
                        // Filter by subject via API
                        params.subject_id = selectedSubject;
                    }

                    // Fetch from API
                    const data = await courseService.getCourses(params);
                    if (cancelled) return;
                    let fetchedCourses = data.courses || [];

                    // If "free" filter is active, filter client-side
                    if (selectedSubject === 'free') {
                        fetchedCourses = fetchedCourses.filter(c => isFree(c));
                    }

                    setCourses(fetchedCourses);
                    setTotalCount(selectedSubject === 'free' ? fetchedCourses.length : (data.count || fetchedCourses.length));

                } else {
                    // My courses tab
                    const data = await courseService.getUserCourses();
                    if (cancelled) return;
                    const userCourses = data.user_courses || [];
                    setCourses(userCourses);
                    // Update total count to reflect both API and local courses
                    setTotalCount(userCourses.length);
                }
            } catch (err: any) {
                if (cancelled) return;
                console.error('Failed to load courses:', err);
                setCourses([]);
                setTotalCount(0);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchCourses();
        return () => {
            cancelled = true;
        };
    }, [activeTab, selectedSubject]);

    // ===== COMPUTE COUNTS FOR SIDEBAR =====
    const getAllCoursesCount = () => {
        // We'll fetch this once separately for the sidebar
        return totalCount;
    };

    const getFreeCoursesCount = () => {
        // Count free courses from all courses
        // For simplicity, we show this from current view
        // In production, you might want to fetch all courses once for accurate count
        return courses.filter(c => isFree(c)).length;
    };

    // ===== RENDER =====
    const title =
        activeTab === 'my'
            ? 'Mening kurslarim'
            : selectedSubject === 'free'
                ? 'Bepul kurslar'
                : selectedSubject
                    ? subjects.find((s) => s.id === selectedSubject)?.name || 'Kurslar'
                    : 'Barcha kurslar';

    const chip = (active: boolean) =>
        cn(
            'shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold border transition-all active:scale-95',
            active
                ? 'bg-brand-gradient text-white border-transparent shadow-soft'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
        );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight max-md:flex-1 max-md:text-center md:text-3xl">
                    {title}
                </h1>
            </div>

            {/* My / All tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl md:max-w-md">
                {([['my', 'Mening kurslarim'], ['all', 'Barcha kurslar']] as const).map(([v, label]) => (
                    <button
                        key={v}
                        onClick={() => router.replace(v === 'my' ? '/courses?tab=my' : '/courses')}
                        className={cn(
                            'py-2.5 rounded-xl text-sm font-bold transition-all',
                            activeTab === v ? 'bg-white text-primary shadow-soft' : 'text-slate-500 hover:text-slate-800'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Subject chips (all courses only) */}
            {activeTab === 'all' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
                    <button onClick={() => setSelectedSubject(null)} className={chip(selectedSubject === null)}>
                        Barchasi
                    </button>
                    <button onClick={() => setSelectedSubject('free')} className={chip(selectedSubject === 'free')}>
                        Bepul
                    </button>
                    {subjects.map((subject) => (
                        <button
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject.id)}
                            className={chip(selectedSubject === subject.id)}
                        >
                            {subject.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-semibold text-sm">Kurslar yuklanmoqda...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 py-16 px-6 text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="font-black text-slate-900 mb-2">
                        {activeTab === 'my'
                            ? "Siz hali hech qaysi kursga a'zo bo'lmagansiz"
                            : selectedSubject === 'free'
                                ? 'Hozircha bepul kurslar mavjud emas'
                                : "Ushbu yo'nalish bo'yicha hozircha kurslar mavjud emas"}
                    </h3>
                    {activeTab === 'my' && (
                        <button
                            onClick={() => router.replace('/courses')}
                            className="mt-4 px-8 py-3 bg-brand-gradient text-white rounded-2xl font-bold shadow-soft active:scale-95 transition-all"
                        >
                            Kurslarni ko'rish
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                    {courses.map((course) => {
                        const id = course.course_id || course.id;
                        if (activeTab === 'my') {
                            const left = daysLeft(course.ended_at);
                            return (
                                <CourseRow
                                    key={course.id || id}
                                    href={`/courses/${id}`}
                                    title={course.course_name || course.name}
                                    imageUrl={course.course_image_url || course.image_url}
                                    subtitle={`${course.total_lessons || 0} ta dars${left !== null ? ` · ${left} kun qoldi` : ''}`}
                                    percentage={course.percentage || 0}
                                />
                            );
                        }
                        const free = isFree(course);
                        return (
                            <CourseRow
                                key={id}
                                href={`/courses/${id}`}
                                title={course.name || course.course_name}
                                imageUrl={course.image_url || course.course_image_url}
                                subtitle={`${course.lessons ?? course.total_lessons ?? 0} ta dars`}
                                badge={free ? 'free' : course.has_access === false ? 'locked' : null}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
