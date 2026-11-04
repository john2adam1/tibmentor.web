import confetti from 'canvas-confetti';

const COLORS = ['#0A63E8', '#31D0FC', '#6A4CF0', '#FFD700'];

/** Side-cannon confetti, used when a lesson or a test is finished. */
export function celebrate(durationMs = 3000) {
    const end = Date.now() + durationMs;

    const frame = () => {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: COLORS });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: COLORS });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    };
    frame();
}

/** Where to go when leaving a lesson (never back into a quiz). */
export function lessonExitPath(courseId?: string | null): string {
    if (courseId) return `/courses/${courseId}`;
    if (typeof window !== 'undefined') {
        const last = window.sessionStorage.getItem(LAST_COURSE_KEY);
        if (last) return `/courses/${last}`;
    }
    return '/courses?tab=my';
}

const LAST_COURSE_KEY = 'tibmentor:last-course';

/** Remember the course the user is browsing, as a fallback exit target. */
export function rememberCourse(courseId: string) {
    if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(LAST_COURSE_KEY, courseId);
    }
}

/** Appends ?course=<id> so the lesson/quiz pages know where to exit to. */
export function withCourse(path: string, courseId?: string | null): string {
    return courseId ? `${path}?course=${encodeURIComponent(courseId)}` : path;
}
