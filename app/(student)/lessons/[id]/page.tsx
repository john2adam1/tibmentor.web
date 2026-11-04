'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services';
import { SourceLessonMobileRes, SourceMobile } from '@/types/mobile-api';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Play, FileText, ClipboardList, ArrowLeft, ChevronLeft, ChevronRight, ClipboardCheck, AlertCircle, Headphones } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import PDFViewer from '@/components/ui/PDFViewer';
import { celebrate, lessonExitPath, withCourse } from '@/lib/celebrate';
import { LESSON_NO_ACCESS } from '@/lib/premium';
import { ContentType } from '@/types/mobile-api';
import Link from 'next/link';

/** Extracts YouTube video ID from any YouTube URL format */
const getYoutubeId = (url: string = ''): string => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
    try {
        const u = new URL(cleanUrl.includes('://') ? cleanUrl : `https://${cleanUrl}`);
        const host = u.hostname.replace('www.', '');
        if (host === 'youtu.be') return u.pathname.slice(1).split(/[?#]/)[0];
        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (u.pathname.includes('/watch')) return u.searchParams.get('v') || '';
            if (u.pathname.includes('/shorts/')) return u.pathname.split('/shorts/')[1].split(/[?#]/)[0];
            if (u.pathname.includes('/live/')) return u.pathname.split('/live/')[1].split(/[?#]/)[0];
            if (u.pathname.includes('/embed/')) return u.pathname.split('/embed/')[1].split(/[?#]/)[0];
        }
    } catch (e) {
        const m = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/);
        if (m) return m[1];
    }
    return '';
};

/** YouTube player – custom thumbnail + lazy iframe (no YouTube links visible until play) */
const YTPlayer = ({ v }: { v: SourceMobile }) => {
    const [playing, setPlaying] = useState(false);
    const ytid = getYoutubeId(v.url);

    if (!ytid) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white/50 gap-4 p-10 text-center">
                <AlertCircle size={48} className="opacity-20" />
                <div>
                    <p className="text-sm font-bold">Video mavjud emas</p>
                    <p className="text-xs opacity-50">Kechirasiz, ushbu video yuklanmadi</p>
                </div>
            </div>
        );
    }

    // Thumbnail holati — YouTube elementi umuman yo'q
    if (!playing) {
        return (
            <div
                className="relative w-full h-full cursor-pointer bg-black group/play"
                onClick={() => setPlaying(true)}
            >
                {/* YouTube thumbnail */}
                <img
                    src={`https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`; }}
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Custom play tugmasi */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[68px] h-[48px] bg-red-600 rounded-xl flex items-center justify-center shadow-2xl group-hover/play:bg-red-500 group-hover/play:scale-110 transition-all duration-200">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    // Playing holati — iframe autoplay bilan yuklanadi
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=0${origin ? `&origin=${origin}` : ''}`}
            title="Video darslik"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
        />
    );
};

export default function LessonPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const courseId = useSearchParams()?.get('course');
    const exitPath = lessonExitPath(courseId);

    const [lesson, setLesson] = useState<SourceLessonMobileRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [noAccess, setNoAccess] = useState(false);
    const [startTime] = useState(Date.now());
    const [viewPdf, setViewPdf] = useState<{ url: string; name: string } | null>(null);
    const [tab, setTab] = useState<'video' | 'presentation' | 'test' | null>(null);
    const [videoIdx, setVideoIdx] = useState(0);

    useEffect(() => {
        if (!id) return;
        fetchLesson();
    }, [id]);



    const fetchLesson = async () => {
        try {
            setIsLoading(true);
            const data = await lessonService.getLessonById(id);
            setLesson(data);
            setNoAccess(false);
        } catch (err: any) {
            if (err.message === LESSON_NO_ACCESS || err.status === 403) {
                setNoAccess(true);
                setError('');
            } else {
                setError(err.message || 'Dars ma’lumotlarini yuklashda xatolik yuz berdi');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndLesson = async () => {
        if (!lesson) return;

        try {
            celebrate();

            // Calculate duration in seconds
            const studyDuration = Math.floor((Date.now() - startTime) / 1000);

            // Track activity
            await activityService.create({
                activity: studyDuration,
            });

            // Mark lesson as ended
            await lessonService.endLesson(lesson.id);

            // Short delay for animation to be seen
            // Leave the lesson (not router.back(): history may point to a quiz)
            setTimeout(() => {
                router.push(exitPath);
            }, 1500);
        } catch (err) {
            console.error('Failed to end lesson:', err);
            router.push(exitPath);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-medium">Dars yuklanmoqda...</p>
            </div>
        );
    }

    if (noAccess) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center px-6">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-10 mb-8">
                    <p className="text-primary font-black mb-2 uppercase tracking-widest text-sm">Kirish yopiq</p>
                    <p className="text-gray-500 font-medium mb-8">Bu dars Premium paket orqali ochiladi.</p>
                    <Link
                        href="/premium"
                        className="inline-flex w-full justify-center py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        Premium olish
                    </Link>
                </div>
                <button
                    onClick={() => router.push(exitPath)}
                    className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Orqaga qaytish
                </button>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center px-6">
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-10 mb-8">
                    <p className="text-primary font-black mb-2 uppercase tracking-widest text-sm">Xatolik yuz berdi</p>
                    <p className="text-gray-500 font-medium">{error || 'Dars topilmadi'}</p>
                </div>
                <button
                    onClick={() => router.push(exitPath)}
                    className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Orqaga qaytish
                </button>
            </div>
        );
    }

    const inferredTypes: ContentType[] = [
        ...(lesson.videos?.length ? (['video'] as ContentType[]) : []),
        ...(lesson.audios?.length ? (['audio'] as ContentType[]) : []),
        ...(lesson.documents?.length ? (['document'] as ContentType[]) : []),
        ...(lesson.quizzes?.length ? (['test'] as ContentType[]) : []),
    ];
    const contentTypes = (lesson.content_types && lesson.content_types.length > 0)
        ? lesson.content_types
        : inferredTypes;
    const showVideo = contentTypes.includes('video') && lesson.videos?.length > 0;
    const showAudio = contentTypes.includes('audio') && (lesson.audios?.length || 0) > 0;
    const showDocs = contentTypes.includes('document') && lesson.documents?.length > 0;
    const showQuiz = contentTypes.includes('test') && (lesson.quizzes?.length || 0) > 0;

    const tabs: { key: 'video' | 'presentation' | 'test'; label: string }[] = [
        ...(showVideo || showAudio ? [{ key: 'video' as const, label: 'Video' }] : []),
        ...(showDocs ? [{ key: 'presentation' as const, label: 'Prezentatsiya' }] : []),
        ...(showQuiz ? [{ key: 'test' as const, label: 'Testlar' }] : []),
    ];
    const activeTab = tab && tabs.some((t) => t.key === tab) ? tab : tabs[0]?.key;
    const currentVideo = showVideo ? lesson.videos[Math.min(videoIdx, lesson.videos.length - 1)] : null;

    return (
        <div className="max-w-3xl lg:max-w-4xl mx-auto pb-28 md:pb-8">
            {/* Header: round back button + lesson name */}
            <div className="flex items-center gap-3 mb-5">
                <button
                    onClick={() => router.push(exitPath)}
                    aria-label="Orqaga"
                    className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-700 hover:text-primary shrink-0 active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg md:text-2xl font-black text-slate-900 leading-snug line-clamp-2">{lesson.name}</h1>
            </div>

            {/* PDF Viewer Modal */}
            {viewPdf && (
                <PDFViewer url={viewPdf.url} name={viewPdf.name} onClose={() => setViewPdf(null)} />
            )}

            {/* Tabs: only content types that exist (TZ T-06) */}
            {tabs.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap border transition-all ${
                                activeTab === t.key
                                    ? 'bg-brand-ink text-white border-transparent shadow-soft'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                    Bu darsda hozircha material yo‘q.
                </div>
            )}

            {/* Video */}
            {activeTab === 'video' && (
                <div className="space-y-6">
                    {currentVideo && (
                        <div
                            className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-card relative"
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <YTPlayer key={currentVideo.id} v={currentVideo} />
                        </div>
                    )}

                    {showVideo && lesson.videos.length > 1 && (
                        <div>
                            <h2 className="font-black text-slate-900 mb-3">Boshqa video-darslar</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {lesson.videos.map((v, idx) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setVideoIdx(idx)}
                                        className={`h-20 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                                            idx === videoIdx
                                                ? 'bg-brand-ink text-white shadow-soft'
                                                : 'bg-slate-700/90 text-white/80 hover:bg-slate-700'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {showAudio &&
                        lesson.audios!.map((a) => (
                            <div key={a.id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-soft">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Headphones size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-900">{a.name || 'Audio'}</h3>
                                </div>
                                <audio controls className="w-full" src={a.url || a.video_url} />
                            </div>
                        ))}
                </div>
            )}

            {/* Presentation (PDF) */}
            {activeTab === 'presentation' && (
                <ul className="space-y-3">
                    {lesson.documents.map((doc, idx) => (
                        <li key={doc.id}>
                            <button
                                onClick={() => setViewPdf({ url: getMediaUrl(doc.url), name: doc.name })}
                                className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-soft hover:border-primary/30 transition-all text-left"
                            >
                                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-bold text-slate-900 truncate">{doc.name}</span>
                                    <span className="block text-sm text-slate-500">
                                        {lesson.documents.length > 1 ? `${idx + 1}-qism · ` : ''}PDF
                                    </span>
                                </span>
                                <ChevronRight size={16} className="text-slate-300" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Tests */}
            {activeTab === 'test' && (
                <ul className="space-y-3">
                    {lesson.quizzes!.map((quiz) => (
                        <li key={quiz.id}>
                            <Link
                                href={withCourse(`/lessons/${lesson.id}/quiz/${quiz.id}`, courseId)}
                                className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-soft hover:border-primary/30 transition-all"
                            >
                                <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <ClipboardCheck size={20} />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block font-bold text-slate-900 leading-snug">{quiz.title}</span>
                                    <span className="block text-sm text-slate-500">
                                        {quiz.question_count} savol
                                        {quiz.best_percent != null ? ` · eng yaxshi ${Math.round(quiz.best_percent)}%` : ''}
                                    </span>
                                </span>
                                <ChevronRight size={16} className="text-slate-300" />
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {/* Finish lesson: pinned on phones, inline on tablet / laptop */}
            <div className="fixed bottom-4 inset-x-4 z-30 md:static md:mt-8 md:inset-auto pb-[env(safe-area-inset-bottom)] md:pb-0">
                <button
                    onClick={handleEndLesson}
                    className="w-full md:w-auto md:min-w-[280px] md:mx-auto md:flex md:justify-center py-4 px-8 bg-brand-gradient text-white rounded-2xl font-bold shadow-premium hover:opacity-95 transition-all active:scale-[0.99]"
                >
                    Darsni yakunlash
                </button>
            </div>
        </div>
    );
}
