'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services';
import { SourceLessonMobileRes, SourceMobile } from '@/types/mobile-api';
import { useRouter, useParams } from 'next/navigation';
import { Play, FileText, ClipboardList, ArrowLeft, CheckCircle2, AlertCircle, Headphones } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import PDFViewer from '@/components/ui/PDFViewer';
import confetti from 'canvas-confetti';
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

    const [lesson, setLesson] = useState<SourceLessonMobileRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [noAccess, setNoAccess] = useState(false);
    const [startTime] = useState(Date.now());
    const [viewPdf, setViewPdf] = useState<{ url: string; name: string } | null>(null);

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
            // Trigger Joy Animation (Dice)
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#800000', '#FFD700']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#800000', '#FFD700']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Calculate duration in seconds
            const studyDuration = Math.floor((Date.now() - startTime) / 1000);

            // Track activity
            await activityService.create({
                activity: studyDuration,
            });

            // Mark lesson as ended
            await lessonService.endLesson(lesson.id);

            // Short delay for animation to be seen
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (err) {
            console.error('Failed to end lesson:', err);
            router.back();
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
                <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 mb-8">
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
                    onClick={() => router.back()}
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
                <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 mb-8">
                    <p className="text-primary font-black mb-2 uppercase tracking-widest text-sm">Xatolik yuz berdi</p>
                    <p className="text-gray-500 font-medium">{error || 'Dars topilmadi'}</p>
                </div>
                <button
                    onClick={() => router.back()}
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

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-primary transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Orqaga qaytish
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full w-fit">
                            DARS {lesson.order_num < 10 ? `0${lesson.order_num}` : lesson.order_num}
                        </span>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                            {lesson.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* PDF Viewer Modal */}
            {viewPdf && (
                <PDFViewer
                    url={viewPdf.url}
                    name={viewPdf.name}
                    onClose={() => setViewPdf(null)}
                />
            )}



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {showVideo && (
                        <div className="space-y-6">
                            {lesson.videos.map((v, idx) => (
                                <div key={v.id} className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                            <Play size={14} fill="currentColor" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-gray-900">
                                                {lesson.videos.length > 1 ? `${idx + 1}-video lavha` : 'Video darslik'}
                                            </h3>
                                            {lesson.videos.length > 1 && (
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                                                    {idx + 1}-qism
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-primary/20 transition-all duration-500 relative"
                                        onContextMenu={(e) => e.preventDefault()}
                                    >
                                        <YTPlayer v={v} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showAudio && (
                        <div className="space-y-4">
                            {lesson.audios!.map((a) => (
                                <div key={a.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-soft">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Headphones size={16} />
                                        </div>
                                        <h3 className="font-bold text-gray-900">{a.name || 'Audio'}</h3>
                                    </div>
                                    <audio controls className="w-full" src={a.url || a.video_url} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {showDocs && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Materiallar</h3>
                        </div>
                        <ul className="space-y-3">
                            {lesson.documents.map((doc) => (
                                <li key={doc.id}>
                                    <button
                                        onClick={() => setViewPdf({ url: getMediaUrl(doc.url), name: doc.name })}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{doc.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}

                    {showQuiz && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <ClipboardList size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Testlar</h3>
                        </div>
                        <ul className="space-y-3">
                            {lesson.quizzes!.map((quiz) => (
                                <li key={quiz.id}>
                                    <Link
                                        href={`/lessons/${lesson.id}/quiz/${quiz.id}`}
                                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-amber-100 hover:bg-amber-50/30 transition-all group text-left"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                            <ClipboardList size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1 block">{quiz.title}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                {quiz.question_count} savol
                                                {quiz.best_percent != null ? ` · eng yaxshi ${Math.round(quiz.best_percent)}%` : ''}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}



                    {/* Completion Card (Relocated to Sidebar) */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <CheckCircle2 size={32} />
                            </div>

                            <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight">Darsni yakunladingizmi?</h3>
                            <p className="text-xs text-gray-500 font-medium">Mavzuni to'liq o'zlashtirgan bo'lsangiz, tugmani bosing.</p>

                            <button
                                onClick={handleEndLesson}
                                className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Tugatish
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

