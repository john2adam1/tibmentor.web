import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { SourceLessonMobileRes } from '@/types/mobile-api';

const saveLocalLessonCompletion = (lessonId: string) => {
    if (typeof window === 'undefined') return;
    try {
        const saved = localStorage.getItem('completed_lessons');
        const ids = saved ? JSON.parse(saved) : [];
        const set = new Set(Array.isArray(ids) ? ids : []);
        set.add(lessonId);
        localStorage.setItem('completed_lessons', JSON.stringify(Array.from(set)));
    } catch (e) {
        console.error('Failed to save local lesson completion', e);
    }
};

export const lessonService = {
    /**
     * Get lesson by ID
     */
    async getLessonById(lessonId: string): Promise<SourceLessonMobileRes> {
        const response = await apiClient<SourceLessonMobileRes>(`/lesson/${lessonId}`);

        // Transform media URLs
        if (response.videos) {
            response.videos = response.videos.map(v => ({
                ...v,
                video_url: v.video_url ? getMediaUrl(v.video_url) : undefined
            }));
        }

        if (response.audios) {
            response.audios = response.audios.map(a => ({
                ...a,
                url: getMediaUrl(a.url),
                video_url: a.video_url ? getMediaUrl(a.video_url) : undefined,
            }));
        }

        if (response.documents) {
            response.documents = response.documents.map(doc => ({
                ...doc,
                url: getMediaUrl(doc.url)
            }));
        }

        if (response.tests) {
            response.tests = response.tests.map(test => ({
                ...test,
                url: getMediaUrl(test.url)
            }));
        }

        return response;
    },

    /**
     * Mark lesson as completed
     */
    endLesson: async (lessonId: string): Promise<void> => {
        saveLocalLessonCompletion(lessonId);
        await apiClient(`/lesson/${lessonId}/end`, {
            method: 'PUT',
            body: JSON.stringify({})
        });
    },
};
