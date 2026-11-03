export function pathForPushData(data?: { type?: string; course_id?: string } | null): string {
    const type = data?.type;
    const courseId = data?.course_id;

    if (type === 'inactive_reminder') return '/dashboard';
    if (type === 'payment_success') {
        return courseId ? `/courses/${courseId}` : '/premium';
    }
    if (type === 'payment_failed') return '/premium';
    return '/notifications';
}
