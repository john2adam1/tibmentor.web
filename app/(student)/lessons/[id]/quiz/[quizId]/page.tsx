'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Clock, RefreshCw, X } from 'lucide-react';
import { quizService } from '@/services';
import { QuizDetail, QuizFinishRes, QuizQuestion } from '@/types/mobile-api';
import { TEST_TIME_UP, ATTEMPT_FINISHED } from '@/lib/premium';
import { withCourse } from '@/lib/celebrate';
import { celebrateResult, getQuizTier } from '@/lib/quiz-result';

type AnswerState = {
    selectedId: string;
    isCorrect: boolean;
    correctOptionId: string;
};

type Phase = 'loading' | 'quiz' | 'result' | 'error';

export default function QuizPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const lessonId = params?.id as string;
    const quizId = params?.quizId as string;
    const resumeAttemptId = searchParams?.get('attempt');
    const courseId = searchParams?.get('course');
    const lessonHref = withCourse(`/lessons/${lessonId}`, courseId);

    const [phase, setPhase] = useState<Phase>('loading');
    const [error, setError] = useState('');
    const [quiz, setQuiz] = useState<QuizDetail | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<QuizFinishRes | null>(null);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const finishingRef = useRef(false);
    const [shownPercent, setShownPercent] = useState(0);

    const currentQuestion: QuizQuestion | undefined = quiz?.questions[index];

    const startQuiz = useCallback(async () => {
        if (!quizId) return;
        setPhase('loading');
        setError('');
        setAnswers({});
        setIndex(0);
        setResult(null);
        finishingRef.current = false;

        try {
            if (resumeAttemptId) {
                const finish = await quizService.finish(resumeAttemptId);
                setResult(finish);
                setPhase('result');
                return;
            }

            const detail = await quizService.getById(quizId);
            const started = await quizService.start(quizId);
            setQuiz(detail);
            setAttemptId(started.attempt_id);
            setSecondsLeft(started.time_limit_sec ?? detail.time_limit_sec ?? null);
            setPhase('quiz');
        } catch (err: any) {
            setError(err.message || 'Testni yuklashda xatolik yuz berdi');
            setPhase('error');
        }
    }, [quizId, resumeAttemptId]);

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    // Result animation: count the percent up, and celebrate according to the score
    // (confetti only when the test was just completed, not when reopening history).
    useEffect(() => {
        if (phase !== 'result' || !result) return;
        const target = Math.max(0, Math.min(100, Math.round(result.percent)));

        if (!resumeAttemptId) celebrateResult(target);

        setShownPercent(0);
        const duration = 1100;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setShownPercent(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [phase, result, resumeAttemptId]);

    const finishAttempt = useCallback(async (id: string) => {
        if (finishingRef.current) return;
        finishingRef.current = true;
        try {
            const data = await quizService.finish(id);
            setResult(data);
            setPhase('result');
        } catch (err: any) {
            if (err.message === ATTEMPT_FINISHED) {
                try {
                    const data = await quizService.finish(id);
                    setResult(data);
                    setPhase('result');
                    return;
                } catch {
                    // fall through
                }
            }
            setError(err.message || 'Testni yakunlashda xatolik');
            setPhase('error');
        }
    }, []);

    useEffect(() => {
        if (phase !== 'quiz' || secondsLeft == null || !attemptId) return;
        if (secondsLeft <= 0) {
            finishAttempt(attemptId);
            return;
        }
        const t = setTimeout(() => setSecondsLeft((s) => (s == null ? s : s - 1)), 1000);
        return () => clearTimeout(t);
    }, [phase, secondsLeft, attemptId, finishAttempt]);

    const handleSelect = async (optionId: string) => {
        if (!currentQuestion || !attemptId || submitting) return;
        if (answers[currentQuestion.id]) return;

        setSubmitting(true);
        try {
            const res = await quizService.answer(attemptId, {
                question_id: currentQuestion.id,
                option_id: optionId,
            });
            setAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: {
                    selectedId: optionId,
                    isCorrect: res.is_correct,
                    correctOptionId: res.correct_option_id,
                },
            }));
        } catch (err: any) {
            if (err.message === TEST_TIME_UP) {
                await finishAttempt(attemptId);
            } else if (err.message === ATTEMPT_FINISHED) {
                await finishAttempt(attemptId);
            } else {
                setError(err.message || 'Javob yuborilmadi');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleNext = async () => {
        if (!quiz || !attemptId) return;
        if (index < quiz.questions.length - 1) {
            setIndex((i) => i + 1);
            return;
        }
        await finishAttempt(attemptId);
    };

    const handleRetry = () => {
        if (resumeAttemptId) {
            router.replace(withCourse(`/lessons/${lessonId}/quiz/${quizId}`, courseId));
            return;
        }
        startQuiz();
    };

    const timerLabel = useMemo(() => {
        if (secondsLeft == null) return null;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }, [secondsLeft]);

    if (phase === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Test yuklanmoqda...</p>
            </div>
        );
    }

    if (phase === 'error') {
        return (
            <div className="max-w-xl mx-auto py-20 text-center px-6">
                <p className="text-primary font-black mb-2 uppercase tracking-widest text-sm">Xatolik</p>
                <p className="text-gray-500 font-medium mb-8">{error}</p>
                <Link href={lessonHref} className="text-primary font-bold">
                    Darsga qaytish
                </Link>
            </div>
        );
    }

    if (phase === 'result' && result) {
        const percent = Math.max(0, Math.min(100, Math.round(result.percent)));
        const tier = getQuizTier(percent);
        const R = 70;
        const C = 2 * Math.PI * R;
        return (
            <div className="max-w-md mx-auto py-10 px-6">
                <button
                    onClick={() => router.push(lessonHref)}
                    className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary mb-6"
                >
                    <ArrowLeft size={18} /> Test natijasi
                </button>

                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-premium overflow-hidden">
                    <div className="relative w-52 h-52 mx-auto mb-5">
                        <div className={`absolute inset-3 rounded-full blur-2xl animate-glow ${tier.glowClass}`} />
                        <svg viewBox="0 0 160 160" className="relative w-full h-full -rotate-90">
                            <defs>
                                <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor={tier.ring[0]} />
                                    <stop offset="100%" stopColor={tier.ring[1]} />
                                </linearGradient>
                            </defs>
                            <circle cx="80" cy="80" r={R} fill="none" stroke="currentColor" className="text-slate-200 dark:text-[#263461]" strokeWidth="14" />
                            <circle
                                cx="80" cy="80" r={R} fill="none" stroke="url(#ring)" strokeWidth="14" strokeLinecap="round"
                                strokeDasharray={C}
                                strokeDashoffset={C - (C * shownPercent) / 100}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-black tracking-tight tabular-nums ${tier.textClass}`}>{shownPercent}%</span>
                            <span className="text-xs font-semibold text-gray-400 mt-1">to‘g‘ri</span>
                        </div>
                    </div>

                    <div className={`text-5xl mb-3 inline-block ${tier.emojiAnim}`} aria-hidden="true">{tier.emoji}</div>

                    <div className="animate-fade-up" style={{ animationDelay: '0.35s' }}>
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest mb-2 ${tier.chipClass}`}>
                            {result.correct_count} / {result.total_count} to‘g‘ri javob
                        </span>
                        <h1 className="text-xl font-black text-slate-900">{tier.title}</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1.5 mb-8 leading-relaxed">{tier.message}</p>
                    </div>

                    <div className="space-y-3 animate-fade-up" style={{ animationDelay: '0.55s' }}>
                        {result.next_lesson_id && (
                            <Link
                                href={withCourse(`/lessons/${result.next_lesson_id}`, courseId)}
                                className="block w-full py-4 bg-brand-gradient text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all"
                            >
                                Keyingi mavzuga o‘tish
                            </Link>
                        )}
                        <button
                            onClick={handleRetry}
                            className="w-full py-4 bg-white border border-gray-200 text-slate-800 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:border-primary/40 hover:text-primary active:scale-[0.98] transition-all"
                        >
                            <RefreshCw size={16} /> Testni qayta ishlash
                        </button>
                        <Link href={lessonHref} className="block w-full py-2 text-gray-400 font-bold text-sm hover:text-primary">
                            Darsga qaytish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || !currentQuestion) return null;

    const answer = answers[currentQuestion.id];
    const total = quiz.questions.length;
    const progress = Math.round(((index + (answer ? 1 : 0)) / total) * 100);
    const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const optionState = (optionId: string): 'idle' | 'correct' | 'wrong' | 'dim' => {
        if (!answer) return 'idle';
        if (optionId === answer.correctOptionId) return 'correct';
        if (optionId === answer.selectedId && !answer.isCorrect) return 'wrong';
        return 'dim';
    };

    const optionClass = {
        idle: 'border-gray-100 bg-white hover:border-primary/40 hover:shadow-soft text-slate-800',
        correct: 'border-emerald-400 bg-emerald-50 text-emerald-700',
        wrong: 'border-red-300 bg-red-50 text-red-600',
        dim: 'border-gray-100 bg-white text-gray-400',
    } as const;

    const badgeClass = {
        idle: 'bg-slate-100 text-slate-500',
        correct: 'bg-emerald-500 text-white',
        wrong: 'bg-red-500 text-white',
        dim: 'bg-slate-100 text-slate-300',
    } as const;

    return (
        <div className="max-w-xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={() => router.push(lessonHref)}
                    className="inline-flex items-center gap-2 text-slate-900 font-black hover:text-primary"
                >
                    <ArrowLeft size={18} /> Test
                </button>
                {timerLabel && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-100 text-slate-700 text-sm font-black">
                        <Clock size={14} className="text-primary" /> {timerLabel}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-brand-progress transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs font-bold text-gray-400 tabular-nums">{index + 1} / {total}</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft mb-4">
                {currentQuestion.image_url && (
                    <img
                        src={currentQuestion.image_url}
                        alt=""
                        className="w-full rounded-xl mb-4 object-cover max-h-64"
                    />
                )}
                <h2 className="text-base font-black text-slate-900 leading-snug">{currentQuestion.text}</h2>
            </div>

            <div className="space-y-2.5">
                {currentQuestion.options.map((opt, i) => {
                    const state = optionState(opt.id);
                    return (
                        <button
                            key={opt.id}
                            disabled={!!answer || submitting}
                            onClick={() => handleSelect(opt.id)}
                            className={`w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border-2 font-bold text-sm transition-all ${optionClass[state]}`}
                        >
                            <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-black ${badgeClass[state]}`}>
                                {state === 'correct' ? <Check size={14} strokeWidth={3} /> : state === 'wrong' ? <X size={14} strokeWidth={3} /> : LETTERS[i]}
                            </span>
                            <span className="flex-1">{opt.text}</span>
                            {state === 'correct' && <Check size={18} className="text-emerald-500" />}
                            {state === 'wrong' && <X size={18} className="text-red-500" />}
                        </button>
                    );
                })}
            </div>

            {answer && (
                <button
                    onClick={handleNext}
                    className="mt-6 w-full py-4 bg-brand-gradient text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all"
                >
                    {index < total - 1 ? 'Keyingi savol' : 'Yakunlash'}
                </button>
            )}
        </div>
    );
}
