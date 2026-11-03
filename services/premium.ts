import { apiClient } from '@/lib/api-client';
import { PremiumOrderBody, PremiumOrderRes, PremiumRes } from '@/types/mobile-api';

export const premiumService = {
    getPremium: async (): Promise<PremiumRes> => {
        const response = await apiClient<any>('/premium');
        return response.data || response;
    },

    createOrder: async (body: PremiumOrderBody): Promise<PremiumOrderRes> => {
        const response = await apiClient<any>('/premium/order', {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return response.data || response;
    },
};
