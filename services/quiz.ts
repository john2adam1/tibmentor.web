import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import {
    QuizAnswerReq,
    QuizAnswerRes,
    QuizDetail,
    QuizFinishRes,
    QuizStartRes,
} from '@/types/mobile-api';

export const quizService = {
    getById: async (id: string): Promise<QuizDetail> => {
        const response = await apiClient<any>(`/test/${id}`);
        const data: QuizDetail = response.data || response;
        if (data.questions) {
            data.questions = data.questions.map((q) => ({
                ...q,
                image_url: q.image_url ? getMediaUrl(q.image_url) : q.image_url,
            }));
        }
        return data;
    },

    start: async (id: string): Promise<QuizStartRes> => {
        const response = await apiClient<any>(`/test/${id}/start`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
        return response.data || response;
    },

    answer: async (attemptId: string, body: QuizAnswerReq): Promise<QuizAnswerRes> => {
        const response = await apiClient<any>(`/test/attempt/${attemptId}/answer`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return response.data || response;
    },

    finish: async (attemptId: string): Promise<QuizFinishRes> => {
        const response = await apiClient<any>(`/test/attempt/${attemptId}/finish`, {
            method: 'POST',
            body: JSON.stringify({}),
        });
        return response.data || response;
    },
};
