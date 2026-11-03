// Profile Service
// Handles user profile operations

import { apiClient } from '@/lib/api-client';
import { getMediaUrl } from '@/lib/utils';
import { UserRes, ProfileUpdateBody, TestHistoryRes } from '@/types/mobile-api';

export const profileService = {
    /**
     * Get user profile
     */
    getUserProfile: async (): Promise<UserRes> => {
        const response = await apiClient<any>('/user/get/profile');
        const user = response.data || response;
        if (user) {
            user.image_url = getMediaUrl(user.image_url);
        }
        return user;
    },

    /**
     * Grouped test results history
     */
    getTestHistory: async (params?: { page?: number; limit?: number }): Promise<TestHistoryRes> => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.set('page', String(params.page));
        if (params?.limit) searchParams.set('limit', String(params.limit));
        const query = searchParams.toString();
        const response = await apiClient<any>(`/user/test-history${query ? `?${query}` : ''}`);
        return response.data || response;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: ProfileUpdateBody): Promise<string> => {
        const formData = new FormData();
        if (data.name) formData.append('name', data.name);
        if (data.phone_number) formData.append('phone_number', data.phone_number);
        if (data.email) formData.append('email', data.email);
        if (data.fcm_token) formData.append('fcm_token', data.fcm_token);
        if (data.language) formData.append('language', data.language);
        if (data.image) formData.append('image', data.image);

        return apiClient<string>('/user/update/profile', {
            method: 'PUT',
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    },

    /**
     * Delete user profile
     */
    deleteProfile: async (): Promise<string> => {
        return apiClient<string>('/user/delete/profile', {
            method: 'DELETE',
        });
    },
};
