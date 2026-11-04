'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    courseService,
    bannerService,
    notificationService,
    activityService,
    ratingService,
    subjectService
} from '@/services';
import { useRouter } from 'next/navigation';
import { ChevronRight, Crown, Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import BannerSlider from '@/components/student/BannerSlider';
import CourseRow, { daysLeft } from '@/components/student/CourseRow';
import { formatUntil, packageLabel } from '@/lib/premium';
import Link from 'next/link';

const SECTION_STYLE: Record<string, { emoji: string; tile: string }> = {
    fundamental: { emoji: '🫀', tile: 'bg-rose-50' },
    preclinical: { emoji: '🔬', tile: 'bg-blue-50' },
    clinical: { emoji: '🩺', tile: 'bg-sky-50' },
    free: { emoji: '🔥', tile: 'bg-orange-50' },
    default: { emoji: '📚', tile: 'bg-indigo-50' },
};

function sectionStyle(name: string, pkg?: string | null) {
    if (pkg && SECTION_STYLE[pkg]) return SECTION_STYLE[pkg];
    const n = (name || '').toLowerCase();
    if (n.includes('fundamental')) return SECTION_STYLE.fundamental;
    if (n.includes('preklinik')) return SECTION_STYLE.preclinical;
    if (n.includes('klinik')) return SECTION_STYLE.clinical;
    return SECTION_STYLE.default;
}

export default function AppHome() {
    const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuth();
    const [userCourses, setUserCourses] = useState<{ user_courses: any[], count: number }>({ user_courses: [], count: 0 });
    const [banners, setBanners] = useState<{ banners: any[], count: number }>({ banners: [], count: 0 });
    const [activity, setActivity] = useState<any>(null);
    const [rating, setRating] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        const loadDashboardData = async () => {
            setLoading(true);

            const fetchData = async (serviceMethod: () => Promise<any>, stateSetter: (data: any) => void, label: string) => {
                try {
                    const data = await serviceMethod();
                    if (data) stateSetter(data);
                } catch (error) {
                    console.error(`Failed to load ${label}:`, error);
                }
            };

            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            await Promise.allSettled([
                fetchData(() => courseService.getUserCourses(), setUserCourses, 'user courses'),
                fetchData(() => bannerService.getBanners(), setBanners, 'banners'),
                fetchData(() => activityService.getStats({ type: 'year' }), setActivity, 'activity'),
                fetchData(() => ratingService.getRating(), setRating, 'rating'),
                fetchData(() => subjectService.getAll(), (d) => setSubjects(d.subjects || []), 'subjects')
            ]);

            setLoading(false);
        };

        loadDashboardData();
    }, [authLoading, isAuthenticated]);

    // Memoize the derived statistics
    const stats = useMemo(() => {
        if (!userCourses?.user_courses) return { enrolled: 0, completed: 0 };
        const courses = userCourses.user_courses;
        return {
            enrolled: userCourses.count || courses.length,
            completed: courses.reduce((acc: number, c: any) => acc + (c.completed_lessons || 0), 0)
        };
    }, [userCourses]);

    // Helper to format activity time (MMd SSs)
    const formatActivity = (activity: number) => {
        const totalSeconds = activity || 0;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? `0${minutes}` : minutes}d ${seconds < 10 ? `0${seconds}` : seconds}s`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</p>
            </div>
        );
    }

    const activePackages = (authUser?.packages || []).filter((p) => p.is_active);
    const isUstoz = !!authUser?.is_ustoz;
    const hasPremium = isUstoz || activePackages.length > 0;
    const firstName = authUser?.name?.split(' ')[0];

    const sections = [
        ...[...subjects]
            .sort((x, y) => (x.order_num ?? 0) - (y.order_num ?? 0))
            .map((s) => {
                const pkg = s.package || null;
                const active = isUstoz || (pkg ? activePackages.some((p) => p.package === pkg) : false);
                const st = sectionStyle(s.name, pkg);
                return {
                    key: s.id,
                    name: s.name,
                    desc: s.description || (s.total_courses !== undefined ? `${s.total_courses} ta kurs` : ''),
                    href: `/courses?subject=${s.id}`,
                    st,
                    status: pkg ? (active ? 'active' : 'locked') : null,
                };
            }),
        { key: 'free', name: 'Bepul kurslar', desc: 'Bepul namunaviy kurslar', href: '/courses?subject=free', st: SECTION_STYLE.free, status: 'open' as const },
    ];

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Greeting (tablet / laptop — phones show the app header) */}
            <div className="hidden md:block">
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    {firstName ? `Assalomu alaykum, ${firstName}!` : 'Xush kelibsiz!'}
                </h1>
                <p className="text-slate-500 mt-1">Bugun yangi bilimlar olish uchun ajoyib kun.</p>
            </div>

            {/* Banners */}
            {banners?.banners && banners.banners.length > 0 && (
                <div className="rounded-3xl overflow-hidden">
                    <BannerSlider banners={banners.banners} />
                </div>
            )}

            {/* Premium status + quick stats: one balanced row */}
            <div className={`grid gap-4 ${hasPremium ? 'lg:grid-cols-2' : ''}`}>
                {hasPremium && (
                    <Link
                        href="/premium"
                        className="flex items-center gap-3 rounded-3xl bg-brand-hero text-white p-5 shadow-premium"
                    >
                        <Crown size={22} className="shrink-0" />
                        <div className="min-w-0">
                            <p className="font-black">{isUstoz ? 'Ustoz — doimiy kirish' : 'Premium faol'}</p>
                            <p className="text-sm text-white/80">
                                {isUstoz
                                    ? 'Barcha kurslar ochiq'
                                    : activePackages
                                          .map((p) => `${packageLabel(p.package)}${p.until ? ` · ${formatUntil(p.until)} gacha` : ''}`)
                                          .join(' | ')}
                            </p>
                        </div>
                    </Link>
                )}

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Kurslar', value: stats.enrolled },
                        { label: 'Darslar', value: stats.completed },
                        { label: 'O‘qish vaqti', value: formatActivity(rating?.me?.activity || 0) },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-soft px-2 py-3 text-center flex flex-col justify-center">
                            <p className="text-base sm:text-lg font-black text-slate-900 tabular-nums">{s.value}</p>
                            <p className="text-[11px] text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bo‘limlar: phone = one card with dividers, tablet/laptop = grid of cards */}
            <section>
                <h2 className="text-lg font-black text-slate-900 mb-3 px-1">Bo‘limlar</h2>
                <div className="max-md:bg-white max-md:rounded-3xl max-md:border max-md:border-slate-100 max-md:shadow-soft max-md:divide-y max-md:divide-slate-100 max-md:overflow-hidden md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-3">
                    {sections.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors group md:bg-white md:rounded-2xl md:border md:border-slate-100 md:shadow-soft md:hover:border-primary/30"
                        >
                            <span className={`w-11 h-11 rounded-2xl ${item.st.tile} flex items-center justify-center text-xl shrink-0`}>
                                {item.st.emoji}
                            </span>
                            <span className="flex-1 min-w-0">
                                <span className="block font-bold text-slate-900 leading-snug truncate">{item.name}</span>
                                {item.desc && <span className="block text-sm text-slate-500 truncate">{item.desc}</span>}
                            </span>
                            {item.status === 'active' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold shrink-0">
                                    <Crown size={11} /> Faol
                                </span>
                            )}
                            {item.status === 'locked' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold shrink-0">
                                    <Lock size={11} /> Yopiq
                                </span>
                            )}
                            {item.status === 'open' && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold shrink-0">Ochiq</span>
                            )}
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* My courses */}
            <section>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-lg font-black text-slate-900">Mening kurslarim</h2>
                    <Link href="/courses?tab=my" className="text-sm font-bold text-primary">
                        Barchasi
                    </Link>
                </div>
                {userCourses?.user_courses?.length > 0 ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {userCourses.user_courses.slice(0, 6).map((course: any) => {
                            const left = daysLeft(course.ended_at);
                            return (
                                <CourseRow
                                    key={course.id}
                                    href={`/courses/${course.course_id}`}
                                    title={course.course_name}
                                    imageUrl={course.course_image_url}
                                    subtitle={`${course.total_lessons || 0} ta dars${left !== null ? ` · ${left} kun qoldi` : ''}`}
                                    percentage={course.percentage || 0}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-8 text-center">
                        <p className="font-bold text-slate-900 mb-1">Kurslar topilmadi</p>
                        <p className="text-sm text-slate-500 mb-4">Siz hali hech qaysi kursga a'zo bo'lmagansiz.</p>
                        <Link href="/courses" className="inline-flex px-6 py-3 bg-brand-gradient text-white rounded-2xl font-bold text-sm shadow-soft">
                            Kurslarni ko'rish
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
