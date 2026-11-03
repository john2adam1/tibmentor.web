import { useEffect, useState, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { messaging } from '@/lib/firebase';
import { profileService } from '@/services/profile';
import { useAuth } from '@/lib/auth-context';
import { pathForPushData } from '@/lib/push-routing';

export const usePushNotifications = () => {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const syncToken = useCallback(async () => {
        if (!user) return;

        // Don't sync if we already did it this session to avoid redundant API calls
        if (sessionStorage.getItem('fcm_token_synced')) return;

        try {
            if (!messaging) return;
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('[Push] FCM Token generated:', token);
                await profileService.updateProfile({ fcm_token: token });
                sessionStorage.setItem('fcm_token_synced', 'true');
            }
        } catch (err) {
            console.error('[Push] Failed to sync token:', err);
        }
    }, [user]);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.warn('[Push] Notifications not supported in this browser');
            return;
        }

        setLoading(true);
        try {
            const status = await Notification.requestPermission();
            setPermission(status);

            if (status === 'granted') {
                await syncToken();
            }
        } catch (err) {
            console.error('[Push] Permission request failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && permission === 'granted' && !sessionStorage.getItem('fcm_token_synced')) {
            syncToken();
        }
    }, [user, permission, syncToken]);

    useEffect(() => {
        if (!messaging || permission !== 'granted') return;

        const unsubscribe = onMessage(messaging, (payload) => {
            const type = payload.data?.type;
            const title = payload.notification?.title || 'Yangi bildirishnoma';
            const body = payload.notification?.body || '';
            toast(`${title}${body ? `: ${body}` : ''}`);

            if (type === 'payment_success' || type === 'payment_failed') {
                refreshUser().catch(() => undefined);
            }

            if (type === 'inactive_reminder') {
                router.push('/dashboard');
            }
        });

        return unsubscribe;
    }, [permission, refreshUser, router]);

    return { permission, requestPermission, loading };
};
