'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { quizService } from '@/services';
import { QuizDetail, QuizFinishRes, QuizQuestion } from '@/types/mobile-api';
import { TEST_TIME_UP, ATTEMPT_FINISHED } from '@/lib/premium';

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
            router.replace(`/lessons/${lessonId}/quiz/${quizId}`);
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
                <Link href={`/lessons/${lessonId}`} className="text-primary font-bold">
                    Darsga qaytish
                </Link>
            </div>
        );
    }

    if (phase === 'result' && result) {
        return (
            <div className="max-w-xl mx-auto py-16 px-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 text-center shadow-soft">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Test yakuni</p>
                    <h1 className="text-5xl font-black text-gray-900 mb-2">{Math.round(result.percent)}%</h1>
                    <p className="text-gray-500 font-medium mb-10">
                        {result.correct_count} / {result.total_count} to‘g‘ri javob
                    </p>
                    <div className="space-y-3">
                        {result.next_lesson_id && (
                            <Link
                                href={`/lessons/${result.next_lesson_id}`}
                                className="block w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                            >
                                Keyingi mavzuga o‘tish
                            </Link>
                        )}
                        <button
                            onClick={handleRetry}
                            className="w-full py-4 bg-slate-50 text-gray-700 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={16} /> Testni qayta ishlash
                        </button>
                        <Link href={`/lessons/${lessonId}`} className="block w-full py-3 text-gray-400 font-bold text-sm">
                            Darsga qaytish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz || !currentQuestion) return null;

    const answer = answers[currentQuestion.id];

    const optionClass = (optionId: string) => {
        if (!answer) {
            return 'border-gray-100 bg-white hover:border-primary/30';
        }
        if (optionId === answer.correctOptionId) {
            return 'border-emerald-200 bg-emerald-50 text-emerald-800';
        }
        if (optionId === answer.selectedId && !answer.isCorrect) {
            return 'border-red-200 bg-red-50 text-red-800';
        }
        return 'border-gray-50 bg-slate-50 text-gray-400';
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-10">
            <button
                onClick={() => router.push(`/lessons/${lessonId}`)}
                className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-primary mb-8"
            >
                <ArrowLeft size={18} /> Darsga qaytish
            </button>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                        Savol {index + 1} / {quiz.questions.length}
                    </p>
                    <h1 className="text-2xl font-black text-gray-900">{quiz.title}</h1>
                </div>
                {timerLabel && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-50 text-gray-700 font-black">
                        <Clock size={16} /> {timerLabel}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-soft">
                {currentQuestion.image_url && (
                    <img
                        src={currentQuestion.image_url}
                        alt=""
                        className="w-full rounded-2xl mb-6 object-cover max-h-64"
                    />
                )}
                <h2 className="text-xl font-black text-gray-900 mb-8 leading-snug">{currentQuestion.text}</h2>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt) => (
                        <button
                            key={opt.id}
                            disabled={!!answer || submitting}
                            onClick={() => handleSelect(opt.id)}
                            className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-bold transition-all ${optionClass(opt.id)}`}
                        >
                            {opt.text}
                        </button>
                    ))}
                </div>

                {answer && (
                    <button
                        onClick={handleNext}
                        className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                        {index < quiz.questions.length - 1 ? 'Keyingi savol' : 'Yakunlash'}
                    </button>
                )}
            </div>
        </div>
    );
}
